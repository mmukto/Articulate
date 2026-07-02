import { auth, clerkClient } from "@clerk/nextjs/server";
import { CLERK_ENABLED } from "./clerk-config";
import { FREE_TIER, TIER_MAP, tierById, type Tier, type TierId } from "./tiers";
import { DEFAULT_LEVEL, LEVEL_IDS, parseLevels, readLevel, type Level } from "./levels";
import { DEFAULT_PROFESSION, readProfession, type Profession } from "./professions";

// Server-authoritative subscription entitlements. The user's plan lives in Clerk
// `privateMetadata.subscription` (server-only, never trusted from the client)
// and is written by the Stripe webhook. Everything that gates content reads the
// *effective* tier — which falls back to Free when there's no active, unexpired
// paid subscription.

export interface Subscription {
  tier: TierId;
  /** Career levels the user has paid for. Pricing is per level — the tier price
   *  buys each level in this list (so all three levels cost 3× one level). */
  levels?: Level[];
  /** Epoch ms when paid access lapses; after this the user reverts to Free. */
  expiresAt?: number;
  /** True once the user has scheduled cancellation: access continues until
   *  expiresAt, then it won't renew. */
  cancelAtPeriodEnd?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  updatedAt?: number;
}

export function readSubscription(privateMetadata: unknown): Subscription | null {
  const s = (privateMetadata as { subscription?: Partial<Subscription> } | undefined)
    ?.subscription;
  if (!s || typeof s.tier !== "string") return null;
  return {
    tier: s.tier as TierId,
    levels: Array.isArray(s.levels) ? parseLevels(s.levels) : undefined,
    expiresAt: typeof s.expiresAt === "number" ? s.expiresAt : undefined,
    cancelAtPeriodEnd: s.cancelAtPeriodEnd === true ? true : undefined,
    stripeCustomerId:
      typeof s.stripeCustomerId === "string" ? s.stripeCustomerId : undefined,
    stripeSubscriptionId:
      typeof s.stripeSubscriptionId === "string" ? s.stripeSubscriptionId : undefined,
    updatedAt: typeof s.updatedAt === "number" ? s.updatedAt : undefined,
  };
}

/** True if the subscription is paid and still within its paid period. */
function isActivePaid(sub: Subscription | null): boolean {
  if (!sub || sub.tier === "free") return false;
  if (sub.expiresAt && Date.now() > sub.expiresAt) return false;
  return true;
}

/** Effective tier from raw private metadata — Free unless a paid plan is active. */
export function effectiveTier(privateMetadata: unknown): Tier {
  const sub = readSubscription(privateMetadata);
  return isActivePaid(sub) ? tierById(sub!.tier) : FREE_TIER;
}

/**
 * Career levels the user has actually paid for (empty when on Free).
 *
 * Fails CLOSED: pricing is strictly per purchased level, so a paid subscription
 * must carry an explicit, non-empty `levels` list. If none is recorded (legacy
 * or corrupt data), we grant NOTHING beyond the free sampler rather than
 * unlocking every level — that would let one payment reach all three levels.
 * Such a subscription self-heals on the next webhook or pricing-page recover.
 */
export function effectiveLevels(privateMetadata: unknown): Level[] {
  const sub = readSubscription(privateMetadata);
  if (!isActivePaid(sub)) return [];
  const lv = sub!.levels ?? [];
  if (lv.length === 0) {
    console.warn(
      "[entitlements] active paid subscription has no recorded levels — failing closed",
    );
    return [];
  }
  return lv;
}

// Comp accounts: emails/usernames listed in COMP_USER_EMAILS (server-only env,
// comma-separated) get full Max access with no subscription, and the AI cap is
// bypassed (see lib/limits.ts). Kept in env, not code, so the addresses stay
// private even though the repo is public.
type ClerkUserLike = {
  username?: string | null;
  emailAddresses?: { emailAddress: string }[];
  privateMetadata?: unknown;
};

function compList(): string[] {
  return (process.env.COMP_USER_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/** True if this user is on the comp allowlist (by email or username). */
export function isCompUser(user: ClerkUserLike): boolean {
  const list = compList();
  if (list.length === 0) return false;
  const ids = [
    ...(user.username ? [user.username] : []),
    ...(user.emailAddresses ?? []).map((e) => e.emailAddress),
  ].map((s) => s.toLowerCase());
  return ids.some((id) => list.includes(id));
}

/** Effective tier for a full Clerk user: Max if comp, else their plan. */
export function tierForUser(user: ClerkUserLike): Tier {
  if (isCompUser(user)) return TIER_MAP.max;
  return effectiveTier(user.privateMetadata);
}

/** Career levels a full Clerk user can practice: all of them if comp, else paid. */
export function levelsForUser(user: ClerkUserLike): Level[] {
  if (isCompUser(user)) return [...LEVEL_IDS];
  return effectiveLevels(user.privateMetadata);
}

/**
 * The user's annual AI-feedback allowance. The per-tier budget is 1/3 of the
 * per-level price, so a user who bought N levels (paying N× the price) gets N×
 * the allowance. Free (and comp, who bypass the cap anyway) get one unit.
 */
export function aiBudgetUsdForUser(user: ClerkUserLike): number {
  const tier = tierForUser(user);
  const count = isCompUser(user) ? 1 : effectiveLevels(user.privateMetadata).length;
  const budget = tier.aiBudgetUsd * Math.max(1, count);
  return Math.round(budget * 100) / 100;
}

/** Effective tier for a given user id (one Clerk read). */
export async function getUserTier(userId: string): Promise<Tier> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return tierForUser(user);
}

/**
 * Effective tier for the current request. Free when auth is disabled (guest
 * mode) or no one is signed in — gating then simply shows the Free slice.
 */
export async function getCurrentTier(): Promise<Tier> {
  if (!CLERK_ENABLED) return FREE_TIER;
  const { userId } = await auth();
  if (!userId) return FREE_TIER;
  return getUserTier(userId);
}

/** The user's chosen career level (Clerk unsafeMetadata.level; default = DEFAULT_LEVEL). */
export async function getUserLevel(userId: string): Promise<Level> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return readLevel(user.unsafeMetadata);
}

export interface Entitlements {
  tier: Tier;
  /** Career levels the user has paid for (all of them for comp accounts). */
  levels: Level[];
  /** The user's chosen career level (preference) — for free users this is the
   *  single level the sampler is locked to. */
  level: Level;
  /** The user's chosen profession (free preference, switchable anytime — it
   *  selects which drill bank they see; it is never priced or purchased). */
  profession: Profession;
  comp: boolean;
}

/** Tier + purchased levels + chosen level/profession + comp flag in one Clerk read. */
export async function getUserEntitlements(userId: string): Promise<Entitlements> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return {
    tier: tierForUser(user),
    levels: levelsForUser(user),
    level: readLevel(user.unsafeMetadata),
    profession: readProfession(user.unsafeMetadata),
    comp: isCompUser(user),
  };
}

/**
 * Entitlements for the current request. Free with no levels when auth is off or
 * no one is signed in — gating then shows only the Free sampler.
 */
export async function getCurrentEntitlements(): Promise<Entitlements> {
  const guest = {
    tier: FREE_TIER,
    levels: [] as Level[],
    level: DEFAULT_LEVEL,
    profession: DEFAULT_PROFESSION,
    comp: false,
  };
  if (!CLERK_ENABLED) return guest;
  const { userId } = await auth();
  if (!userId) return guest;
  return getUserEntitlements(userId);
}

/** Career level for the current request (default when auth off / signed out). */
export async function getCurrentLevel(): Promise<Level> {
  if (!CLERK_ENABLED) return DEFAULT_LEVEL;
  const { userId } = await auth();
  if (!userId) return DEFAULT_LEVEL;
  return getUserLevel(userId);
}

/**
 * Persist a user's subscription (called by the Stripe webhook). Merges into
 * existing private metadata so the AI usage meter isn't clobbered.
 */
export async function setUserSubscription(
  userId: string,
  sub: Subscription,
): Promise<void> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...(user.privateMetadata ?? {}),
      subscription: { ...sub, updatedAt: Date.now() },
    },
  });
}
