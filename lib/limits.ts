import { clerkClient } from "@clerk/nextjs/server";
import type { Usage } from "./feedback";
import {
  aiBudgetUsdForUser,
  isCompUser,
  levelsForUser,
  professionsForUser,
  readSubscription,
  tierForUser,
} from "./entitlements";
import { readLevel, type Level } from "./levels";
import { readProfession, type Profession } from "./professions";
import { markPracticed } from "./practiced";

// Per-user AI-feedback guardrails.
//
// Each user has an annual allowance that RENEWS every 365 days (a rolling
// window), sized by their subscription tier (`tier.aiBudgetUsd`). Spend is
// metered from *real* token usage and kept in Clerk `privateMetadata.usage`
// (server-only, so users can't tamper with it — unlike progress, which lives in
// client-writable `unsafeMetadata`). The cap is a safety ceiling against
// runaway cost/abuse, not a quota users are expected to hit. Paid-plan *access*
// (more drills, bigger allowance) is governed separately by subscription expiry
// in lib/entitlements.ts; when a plan lapses the user reverts to the Free tier.

const WINDOW_DAYS = Number(process.env.USER_ALLOWANCE_DAYS) || 365;
const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_MS = WINDOW_DAYS * DAY_MS;

// USD per 1M tokens for each model the provider may serve a request with. The
// primary (gemini-2.5-flash-lite) is cheap; when it's overloaded the provider
// falls back to gemini-2.5-flash, which MUST be metered at its higher rate.
// Unknown models are metered at the most expensive listed price so the cap
// fails safe. (Audio input is billed a little higher by Google; we approximate
// it at the text input rate — close enough for a guardrail.) If you change
// GEMINI_MODEL / GEMINI_FALLBACK_MODEL or enable the Claude provider, add the
// model's price here.
const PRICES: Record<string, { inputPerMTokens: number; outputPerMTokens: number }> = {
  "gemini-2.5-flash-lite": { inputPerMTokens: 0.1, outputPerMTokens: 0.4 },
  "gemini-2.5-flash": { inputPerMTokens: 0.3, outputPerMTokens: 2.5 },
};
const MAX_PRICE = Object.values(PRICES).reduce((a, b) =>
  b.inputPerMTokens + b.outputPerMTokens > a.inputPerMTokens + a.outputPerMTokens
    ? b
    : a,
);

export function estimateCostUsd(usage: Usage): number {
  const price = PRICES[usage.model] ?? MAX_PRICE;
  return (
    (usage.inputTokens / 1_000_000) * price.inputPerMTokens +
    (usage.outputTokens / 1_000_000) * price.outputPerMTokens
  );
}

interface Meter {
  windowStartedAt: number; // epoch ms the current allowance window began
  spentUsd: number; // spend within the current window
}

function readMeter(privateMetadata: unknown): Meter | null {
  const m = (privateMetadata as { usage?: Partial<Meter> } | undefined)?.usage;
  if (!m || typeof m.windowStartedAt !== "number") return null;
  return {
    windowStartedAt: m.windowStartedAt,
    spentUsd: typeof m.spentUsd === "number" && m.spentUsd >= 0 ? m.spentUsd : 0,
  };
}

const round6 = (n: number) => Math.round(n * 1_000_000) / 1_000_000;

async function writeMeter(
  client: Awaited<ReturnType<typeof clerkClient>>,
  userId: string,
  existing: Record<string, unknown>,
  meter: Meter,
): Promise<void> {
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { ...existing, usage: meter },
  });
}

const overBudgetMsg = (tierName: string) =>
  `You've reached your ${tierName} plan's AI coaching allowance for this year. ` +
  `Your progress is saved; the allowance renews on your next cycle, or upgrade for more.`;

export interface AccessGate {
  ok: boolean;
  status: number; // HTTP status to return when !ok
  message: string; // user-facing message when !ok
  spentUsd: number; // spend so far, carried through to recordSpend()
  windowStartedAt: number; // current window start, carried to recordSpend()
  budgetUsd: number; // this user's tier allowance
  existingMetadata: Record<string, unknown>; // preserved on write
}

/**
 * Gate an AI request: enforces the per-tier annual allowance, resetting the
 * window when 365 days have elapsed. Reads the user once; the result is passed
 * to recordSpend() so the write needs no reread.
 */
export async function checkAccess(userId: string): Promise<AccessGate> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existingMetadata = (user.privateMetadata ?? {}) as Record<string, unknown>;
  const tier = tierForUser(user);
  const comp = isCompUser(user); // comp accounts bypass the cap entirely
  const budgetUsd = aiBudgetUsdForUser(user); // scales with levels purchased
  const now = Date.now();

  let meter = readMeter(existingMetadata);
  if (!meter || now - meter.windowStartedAt > WINDOW_MS) {
    // First use, or the yearly window rolled over — start a fresh allowance.
    meter = { windowStartedAt: now, spentUsd: 0 };
    await writeMeter(client, userId, existingMetadata, meter);
  }

  const base = {
    spentUsd: meter.spentUsd,
    windowStartedAt: meter.windowStartedAt,
    budgetUsd,
    existingMetadata,
  };
  if (!comp && meter.spentUsd >= budgetUsd) {
    return { ok: false, status: 402, message: overBudgetMsg(tier.name), ...base };
  }
  return { ok: true, status: 200, message: "", ...base };
}

/**
 * Record the result of a completed AI call: add its cost to the user's running
 * total and (if a drill is given) mark that drill practiced in the server-side
 * bitset, both in a single metadata write. Best-effort: a failed write never
 * blocks returning feedback the user already received.
 */
export async function recordSpend(
  userId: string,
  gate: AccessGate,
  costUsd: number,
  practiced?: { moduleSlug: string; drillId: string },
): Promise<void> {
  const spendChanged = costUsd > 0;
  const mark = practiced
    ? markPracticed(gate.existingMetadata, practiced.moduleSlug, practiced.drillId)
    : null;
  const practicedChanged = !!mark?.changed;
  if (!spendChanged && !practicedChanged) return;

  try {
    const client = await clerkClient();
    const meter: Meter = {
      windowStartedAt: gate.windowStartedAt,
      spentUsd: round6(gate.spentUsd + (spendChanged ? costUsd : 0)),
    };
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...gate.existingMetadata,
        usage: meter,
        ...(practicedChanged ? { practiced: mark!.value } : {}),
      },
    });
  } catch (err) {
    console.error("[limits] failed to record spend:", err);
  }
}

/** Read-only allowance summary for the signed-in user, for display in the UI. */
export interface UsageSummary {
  tierId: string;
  tierName: string;
  /** Levels the user has paid for (drives the pricing-page selection). */
  levels: Level[];
  levelCount: number;
  /** Professions the user's plan covers (empty on Free; all for comp). */
  professions: Profession[];
  /** The user's currently chosen career level (preference, not entitlement). */
  currentLevel: Level;
  /** The user's chosen profession preference (drives signup/pricing UI). */
  currentProfession: Profession;
  /** True if the paid plan is set to cancel at period end (access until accessUntil). */
  cancelAtPeriodEnd: boolean;
  /** Epoch ms the paid access ends (period end), when known. */
  accessUntil: number | null;
  spentUsd: number;
  budgetUsd: number;
  percentUsed: number; // 0–100, rounded
  daysLeft: number; // whole days until the allowance renews
}

export async function getUsageSummary(userId: string): Promise<UsageSummary> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const tier = tierForUser(user);
  const levels = levelsForUser(user);
  const professions = professionsForUser(user);
  const comp = isCompUser(user);
  // Comp accounts get access regardless of any (possibly stale) subscription, so
  // don't surface its cancel/period-end state for them.
  const subscription = comp ? null : readSubscription(user.privateMetadata);
  const meter = readMeter(user.privateMetadata);
  const now = Date.now();

  // Reflect a pending window rollover so the UI shows a fresh allowance.
  const rolled = !meter || now - meter.windowStartedAt > WINDOW_MS;
  const spentUsd = rolled ? 0 : meter!.spentUsd;
  const windowStartedAt = rolled ? now : meter!.windowStartedAt;
  const budgetUsd = aiBudgetUsdForUser(user);

  return {
    tierId: tier.id,
    tierName: tier.name,
    levels,
    levelCount: levels.length,
    professions,
    currentLevel: readLevel(user.unsafeMetadata),
    currentProfession: readProfession(user.unsafeMetadata),
    cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd === true,
    accessUntil: subscription?.expiresAt ?? null,
    spentUsd: round6(spentUsd),
    budgetUsd,
    percentUsed: budgetUsd > 0 ? Math.min(100, Math.round((spentUsd / budgetUsd) * 100)) : 0,
    daysLeft: Math.max(0, Math.ceil((windowStartedAt + WINDOW_MS - now) / DAY_MS)),
  };
}
