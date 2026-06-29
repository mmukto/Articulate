import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDrill } from "@/lib/course";
import { gradeSpoken } from "@/lib/feedback";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { checkAccess, recordSpend, estimateCostUsd, type AccessGate } from "@/lib/limits";
import { getUserEntitlements } from "@/lib/entitlements";
import { drillsPerModule, FREE_DRILLS_PER_MODULE, FREE_MODULE_LIMIT } from "@/lib/tiers";
import { LEVEL_MAP, type Level } from "@/lib/levels";

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

  // Coaching is calibrated to the drill's own career level.
  const level: Level = found.level;

  // Server-authoritative gate (never trust the client): pricing is per level —
  // a level the user has paid for unlocks their full tier count; any other level
  // exposes only the Free sampler.
  let gate: AccessGate | null = null;
  if (userId) {
    const ent = await getUserEntitlements(userId);
    // Comp/owner accounts have full access to every drill at every level.
    if (!ent.comp) {
      const purchased = ent.levels.includes(found.level);
      // Paid levels: the tier's full count, all modules. Free sign-up: the
      // 1-drill sampler, only in the first FREE_MODULE_LIMIT modules and only at
      // the user's chosen (locked) level.
      const freeOk =
        found.module.number <= FREE_MODULE_LIMIT && found.level === ent.level;
      const allowed = purchased
        ? drillsPerModule(ent.tier)
        : freeOk
          ? FREE_DRILLS_PER_MODULE
          : 0;
      if (found.levelIndex >= allowed) {
        const error = purchased
          ? "This drill is part of a higher plan. Upgrade to unlock it."
          : found.module.number > FREE_MODULE_LIMIT
            ? `Free practice covers the first ${FREE_MODULE_LIMIT} modules. Subscribe to unlock the full course.`
            : found.level !== ent.level
              ? "Free practice is locked to your chosen level. Subscribe to unlock other levels."
              : `Subscribe to unlock all drills at the ${LEVEL_MAP[found.level].name} level.`;
        return NextResponse.json({ error }, { status: 403 });
      }
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
      level,
    );
    if (userId && gate) {
      await recordSpend(userId, gate, estimateCostUsd(usage), { moduleSlug, drillId });
    }
    return NextResponse.json({ feedback });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate feedback.";
    console.error("[speak] grading failed:", err);
    const isConfig = message.includes("isn't configured");
    return NextResponse.json({ error: message }, { status: isConfig ? 503 : 500 });
  }
}
