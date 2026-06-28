// Subscription tiers. Pure data + helpers (no server imports) so this is safe
// to use from client components (pricing UI) and server code alike.
//
// Each tier unlocks a TOTAL number of drills spread evenly across the 10
// modules, and carries an annual AI-feedback allowance (a safety ceiling — AI
// feedback on gemini-2.5-flash-lite is cheap, so these are generous bounds, not
// quotas users are expected to hit). Drills themselves are static content, so
// unlocking more never costs anything to generate.

export type TierId = "free" | "starter" | "plus" | "pro" | "max";

export const MODULE_COUNT = 10;

export interface Tier {
  id: TierId;
  name: string;
  /** Annual price in the configured currency. 0 = free. */
  priceUsd: number;
  /** Total drills unlocked across all modules. */
  drillTotal: number;
  /** Annual AI-feedback spend ceiling for this tier, in USD. */
  aiBudgetUsd: number;
  /** Short marketing line for the pricing card. */
  blurb: string;
  /** Visually feature this tier on the pricing page. */
  highlight?: boolean;
}

export const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    priceUsd: 0,
    drillTotal: 10,
    aiBudgetUsd: 2,
    blurb: "1 drill per module — try the method.",
  },
  {
    id: "starter",
    name: "Starter",
    priceUsd: 4.99,
    drillTotal: 30,
    aiBudgetUsd: 5,
    blurb: "3 drills per module.",
  },
  {
    id: "plus",
    name: "Plus",
    priceUsd: 9.99,
    drillTotal: 60,
    aiBudgetUsd: 10,
    blurb: "6 drills per module.",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    priceUsd: 19.99,
    drillTotal: 120,
    aiBudgetUsd: 20,
    blurb: "12 drills per module.",
  },
  {
    id: "max",
    name: "Max",
    priceUsd: 49.99,
    drillTotal: 250,
    aiBudgetUsd: 40,
    blurb: "All 25 drills per module — the full library.",
  },
];

export const TIER_MAP: Record<TierId, Tier> = TIERS.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<TierId, Tier>,
);

export const FREE_TIER = TIER_MAP.free;
export const PAID_TIERS = TIERS.filter((t) => t.priceUsd > 0);

/** Drills unlocked per module for a tier (total spread evenly across modules). */
export function drillsPerModule(tier: Tier): number {
  return Math.ceil(tier.drillTotal / MODULE_COUNT);
}

/** Resolve a tier id to a Tier, falling back to Free for unknown/empty ids. */
export function tierById(id: string | null | undefined): Tier {
  return (id && TIER_MAP[id as TierId]) || FREE_TIER;
}
