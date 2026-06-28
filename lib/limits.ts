import { clerkClient } from "@clerk/nextjs/server";
import type { Usage } from "./feedback";
import { isCompUser, tierForUser } from "./entitlements";

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

// Price of the active model (gemini-2.5-flash-lite), USD per 1M tokens. Used to
// turn token usage into dollars for the cap. If you switch GEMINI_MODEL or the
// provider, update these so the cap stays accurate. (Audio input is billed a
// little higher by Google; we approximate it at the text input rate — close
// enough for a guardrail.)
const PRICE = { inputPerMTokens: 0.1, outputPerMTokens: 0.4 };

export function estimateCostUsd(usage: Usage): number {
  return (
    (usage.inputTokens / 1_000_000) * PRICE.inputPerMTokens +
    (usage.outputTokens / 1_000_000) * PRICE.outputPerMTokens
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

/** Current AI spend (USD) within the active window — used for cancellation refund math. */
export function readSpentUsd(privateMetadata: unknown): number {
  return readMeter(privateMetadata)?.spentUsd ?? 0;
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
  const budgetUsd = tier.aiBudgetUsd;
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
 * Add the cost of a completed AI call to the user's running total. Best-effort:
 * a failed write never blocks returning feedback the user already received.
 */
export async function recordSpend(
  userId: string,
  gate: AccessGate,
  costUsd: number,
): Promise<void> {
  if (!(costUsd > 0)) return;
  try {
    const client = await clerkClient();
    await writeMeter(client, userId, gate.existingMetadata, {
      windowStartedAt: gate.windowStartedAt,
      spentUsd: round6(gate.spentUsd + costUsd),
    });
  } catch (err) {
    console.error("[limits] failed to record spend:", err);
  }
}

/** Read-only allowance summary for the signed-in user, for display in the UI. */
export interface UsageSummary {
  tierId: string;
  tierName: string;
  spentUsd: number;
  budgetUsd: number;
  percentUsed: number; // 0–100, rounded
  daysLeft: number; // whole days until the allowance renews
}

export async function getUsageSummary(userId: string): Promise<UsageSummary> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const tier = tierForUser(user);
  const meter = readMeter(user.privateMetadata);
  const now = Date.now();

  // Reflect a pending window rollover so the UI shows a fresh allowance.
  const rolled = !meter || now - meter.windowStartedAt > WINDOW_MS;
  const spentUsd = rolled ? 0 : meter!.spentUsd;
  const windowStartedAt = rolled ? now : meter!.windowStartedAt;
  const budgetUsd = tier.aiBudgetUsd;

  return {
    tierId: tier.id,
    tierName: tier.name,
    spentUsd: round6(spentUsd),
    budgetUsd,
    percentUsed: Math.min(100, Math.round((spentUsd / budgetUsd) * 100)),
    daysLeft: Math.max(0, Math.ceil((windowStartedAt + WINDOW_MS - now) / DAY_MS)),
  };
}
