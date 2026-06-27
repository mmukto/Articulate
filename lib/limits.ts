import { clerkClient } from "@clerk/nextjs/server";
import type { Usage } from "./feedback";

// Per-user guardrails for the AI coach.
//
// Every signed-in user gets a fixed window of access (one year from sign-up)
// and a hard spend ceiling within it, so a single account can never run up the
// Gemini bill. Spend is metered from *real* token usage (not guesses) and kept
// in Clerk `privateMetadata` — server-only, so users can't tamper with it
// (unlike progress, which lives in client-writable `unsafeMetadata`).
//
// Defaults match the product policy ($2 / one year) and can be overridden with
// env vars without a code change.

export const ANNUAL_BUDGET_USD = Number(process.env.USER_ANNUAL_BUDGET_USD) || 2;
export const ACCESS_DURATION_DAYS = Number(process.env.USER_ACCESS_DAYS) || 365;
const DAY_MS = 24 * 60 * 60 * 1000;

// Price of the active model (gemini-2.5-flash-lite), USD per 1M tokens. Used to
// turn token usage into dollars for the cap. If you switch GEMINI_MODEL or the
// provider, update these so the cap stays accurate. (Audio input is billed a
// little higher by Google; we approximate it at the text input rate — close
// enough for a $2 guardrail.)
const PRICE = { inputPerMTokens: 0.1, outputPerMTokens: 0.4 };

export function estimateCostUsd(usage: Usage): number {
  return (
    (usage.inputTokens / 1_000_000) * PRICE.inputPerMTokens +
    (usage.outputTokens / 1_000_000) * PRICE.outputPerMTokens
  );
}

function readSpent(privateMetadata: unknown): number {
  const s = (privateMetadata as { usage?: { spentUsd?: number } } | undefined)
    ?.usage?.spentUsd;
  return typeof s === "number" && s >= 0 ? s : 0;
}

const round6 = (n: number) => Math.round(n * 1_000_000) / 1_000_000;

const EXPIRED_MSG =
  "Your one-year access to the AI coach has ended. Your saved progress stays " +
  "available — reach out if you'd like to renew.";
const OVER_BUDGET_MSG =
  "You've reached your AI coaching limit for this year. Your progress is " +
  "saved; the limit lifts when your access renews.";

export interface AccessGate {
  ok: boolean;
  status: number; // HTTP status to return when !ok
  message: string; // user-facing message when !ok
  spentUsd: number; // spend so far, carried through to recordSpend()
  existingMetadata: Record<string, unknown>; // preserved on write
}

/**
 * Decide whether a signed-in user may make an AI request: enforces the one-year
 * access window (from Clerk sign-up time) and the annual spend cap. Reads the
 * user once; the result is passed to recordSpend() so the write needs no reread.
 */
export async function checkAccess(userId: string): Promise<AccessGate> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existingMetadata = (user.privateMetadata ?? {}) as Record<string, unknown>;
  const spentUsd = readSpent(existingMetadata);
  const endsAt = user.createdAt + ACCESS_DURATION_DAYS * DAY_MS;

  if (Date.now() > endsAt) {
    return { ok: false, status: 403, message: EXPIRED_MSG, spentUsd, existingMetadata };
  }
  if (spentUsd >= ANNUAL_BUDGET_USD) {
    return { ok: false, status: 402, message: OVER_BUDGET_MSG, spentUsd, existingMetadata };
  }
  return { ok: true, status: 200, message: "", spentUsd, existingMetadata };
}

/**
 * Add the cost of a completed AI call to the user's running total. Best-effort:
 * a failed write never blocks returning feedback the user already paid for.
 */
export async function recordSpend(
  userId: string,
  gate: AccessGate,
  costUsd: number,
): Promise<void> {
  if (!(costUsd > 0)) return;
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...gate.existingMetadata,
        usage: { spentUsd: round6(gate.spentUsd + costUsd) },
      },
    });
  } catch (err) {
    console.error("[limits] failed to record spend:", err);
  }
}
