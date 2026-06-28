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
  /** Annual AI-feedback spend ceiling, in USD (= 1/3 of the annual price; a
   *  small fixed trial for Free). Caps AI cost at a third of the revenue. */
  aiBudgetUsd: number;
  /** Short marketing line for the pricing card. */
  blurb: string;
  /** Visually feature this tier on the pricing page. */
  highlight?: boolean;
}

// AI-feedback spend is capped at one-third of the annual price, so AI cost can
// never exceed a third of a subscription's revenue. Free has no price to take a
// third of, so it gets a small fixed trial allowance.
const FREE_AI_BUDGET_USD = 1;
export function aiBudgetForPrice(priceUsd: number): number {
  return priceUsd > 0 ? Math.round((priceUsd / 3) * 100) / 100 : FREE_AI_BUDGET_USD;
}

const RAW_TIERS: Omit<Tier, "aiBudgetUsd">[] = [
  {
    id: "free",
    name: "Free",
    priceUsd: 0,
    drillTotal: 10,
    blurb: "1 drill per module — try the method.",
  },
  {
    id: "starter",
    name: "Starter",
    priceUsd: 4.99,
    drillTotal: 30,
    blurb: "3 drills per module.",
  },
  {
    id: "plus",
    name: "Plus",
    priceUsd: 9.99,
    drillTotal: 60,
    blurb: "6 drills per module.",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    priceUsd: 19.99,
    drillTotal: 120,
    blurb: "12 drills per module.",
  },
  {
    id: "max",
    name: "Max",
    priceUsd: 49.99,
    drillTotal: 250,
    blurb: "All 25 drills per module — the full library.",
  },
];

// 1/3-of-price AI budget applied to every tier.
export const TIERS: Tier[] = RAW_TIERS.map((t) => ({
  ...t,
  aiBudgetUsd: aiBudgetForPrice(t.priceUsd),
}));

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

/** Per-module drills the Free tier unlocks — the sampler shown on every level. */
export const FREE_DRILLS_PER_MODULE = Math.ceil(FREE_TIER.drillTotal / MODULE_COUNT);

/**
 * Drills unlocked per module *at a given career level*. Pricing is per level:
 * a level the user has purchased unlocks the full tier count; any other level
 * still shows the Free sampler so they can try it before buying.
 */
export function unlockedPerModule(tier: Tier, levelPurchased: boolean): number {
  return levelPurchased ? drillsPerModule(tier) : FREE_DRILLS_PER_MODULE;
}

/** Resolve a tier id to a Tier, falling back to Free for unknown/empty ids. */
export function tierById(id: string | null | undefined): Tier {
  return (id && TIER_MAP[id as TierId]) || FREE_TIER;
}
