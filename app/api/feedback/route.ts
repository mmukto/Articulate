import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDrill } from "@/lib/course";
import { gradeResponse } from "@/lib/feedback";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { checkAccess, recordSpend, estimateCostUsd, type AccessGate } from "@/lib/limits";
import { getUserEntitlements } from "@/lib/entitlements";
import { drillsPerModule, FREE_DRILLS_PER_MODULE, FREE_MODULE_LIMIT } from "@/lib/tiers";
import type { Level } from "@/lib/levels";
import { levelInfoFor } from "@/lib/professions";

// Feedback grading can take a few seconds with adaptive thinking — give it room.
export const maxDuration = 60;
export const runtime = "nodejs";

const MAX_RESPONSE_CHARS = 6000;

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

  const { moduleSlug, drillId, response } = (body ?? {}) as {
    moduleSlug?: string;
    drillId?: string;
    response?: string;
  };

  if (!moduleSlug || !drillId) {
    return NextResponse.json(
      { error: "moduleSlug and drillId are required." },
      { status: 400 },
    );
  }
  if (typeof response !== "string" || response.trim().length === 0) {
    return NextResponse.json(
      { error: "Write a response before requesting feedback." },
      { status: 400 },
    );
  }
  if (response.length > MAX_RESPONSE_CHARS) {
    return NextResponse.json(
      { error: `Response is too long (max ${MAX_RESPONSE_CHARS} characters).` },
      { status: 400 },
    );
  }

  const found = getDrill(moduleSlug, drillId);
  if (!found) {
    return NextResponse.json({ error: "Unknown drill." }, { status: 404 });
  }

  // Coaching is calibrated to the drill's own career level and profession.
  const level: Level = found.level;

  // Server-authoritative gate (never trust the client): pricing is per level —
  // a level the user has paid for unlocks their full tier count; any other level
  // exposes only the Free sampler. Professions aren't priced: the same per-level
  // rule applies within whichever profession the drill belongs to (levelIndex is
  // the drill's position within its level+profession group).
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
              : `Subscribe to unlock all drills at the ${levelInfoFor(found.profession, found.level).name} level.`;
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
    const { feedback, usage } = await gradeResponse(
      found.module,
      found.drill,
      response,
      level,
      found.profession,
    );
    if (userId && gate) {
      await recordSpend(userId, gate, estimateCostUsd(usage), { moduleSlug, drillId });
    }
    return NextResponse.json({ feedback });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate feedback.";
    // Surface a clean message; log the detail server-side. "Over capacity" is
    // the provider's retries-exhausted case — a true (temporary) 503.
    console.error("[feedback] grading failed:", err);
    const isUnavailable =
      message.includes("isn't configured") || message.includes("over capacity");
    return NextResponse.json(
      { error: message },
      { status: isUnavailable ? 503 : 500 },
    );
  }
}
