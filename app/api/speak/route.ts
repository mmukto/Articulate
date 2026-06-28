import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDrill } from "@/lib/course";
import { gradeSpoken } from "@/lib/feedback";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { checkAccess, recordSpend, estimateCostUsd, type AccessGate } from "@/lib/limits";
import { getUserTier } from "@/lib/entitlements";
import { drillsPerModule } from "@/lib/tiers";

// Audio coaching can take a little longer than text — give it room.
export const maxDuration = 60;
export const runtime = "nodejs";

// ~6.7MB of base64 ≈ ~5MB of audio (roughly 90s of compressed mono speech).
const MAX_AUDIO_BASE64 = 6_700_000;

export async function POST(req: NextRequest) {
  // When auth is enabled, require a signed-in user. With Clerk unconfigured the
  // app runs open, so skip the check.
  let userId: string | null = null;
  if (CLERK_ENABLED) {
    const a = await auth();
    if (!a.userId) {
      return NextResponse.json(
        { error: "Please sign in to get feedback." },
        { status: 401 },
      );
    }
    userId = a.userId;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { moduleSlug, drillId, audio, mimeType } = (body ?? {}) as {
    moduleSlug?: string;
    drillId?: string;
    audio?: string;
    mimeType?: string;
  };

  if (!moduleSlug || !drillId) {
    return NextResponse.json(
      { error: "moduleSlug and drillId are required." },
      { status: 400 },
    );
  }
  if (typeof audio !== "string" || audio.length === 0) {
    return NextResponse.json(
      { error: "Record an answer before requesting feedback." },
      { status: 400 },
    );
  }
  if (audio.length > MAX_AUDIO_BASE64) {
    return NextResponse.json(
      { error: "Recording is too long. Keep it under about 90 seconds." },
      { status: 413 },
    );
  }

  const found = getDrill(moduleSlug, drillId);
  if (!found) {
    return NextResponse.json({ error: "Unknown drill." }, { status: 404 });
  }

  // Server-authoritative tier gate: a drill is only accessible if its position
  // within the module is within the user's plan. Never trust the client.
  let gate: AccessGate | null = null;
  if (userId) {
    const tier = await getUserTier(userId);
    if (found.index >= drillsPerModule(tier)) {
      return NextResponse.json(
        { error: "This drill is part of a higher plan. Upgrade to unlock it." },
        { status: 403 },
      );
    }
    // Enforce the per-user annual AI allowance before spending money.
    gate = await checkAccess(userId);
    if (!gate.ok) {
      return NextResponse.json({ error: gate.message }, { status: gate.status });
    }
  }

  try {
    const { feedback, usage } = await gradeSpoken(
      found.module,
      found.drill,
      audio,
      typeof mimeType === "string" && mimeType ? mimeType : "audio/mp4",
    );
    if (userId && gate) await recordSpend(userId, gate, estimateCostUsd(usage));
    return NextResponse.json({ feedback });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate feedback.";
    console.error("[speak] grading failed:", err);
    const isConfig = message.includes("isn't configured");
    return NextResponse.json({ error: message }, { status: isConfig ? 503 : 500 });
  }
}
