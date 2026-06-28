import { auth, clerkClient } from "@clerk/nextjs/server";
import { CLERK_ENABLED } from "./clerk-config";
import { FREE_TIER, TIER_MAP, tierById, type Tier, type TierId } from "./tiers";

// Server-authoritative subscription entitlements. The user's plan lives in Clerk
// `privateMetadata.subscription` (server-only, never trusted from the client)
// and is written by the Stripe webhook. Everything that gates content reads the
// *effective* tier — which falls back to Free when there's no active, unexpired
// paid subscription.

export interface Subscription {
  tier: TierId;
  /** Epoch ms when paid access lapses; after this the user reverts to Free. */
  expiresAt?: number;
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
    expiresAt: typeof s.expiresAt === "number" ? s.expiresAt : undefined,
    stripeCustomerId:
      typeof s.stripeCustomerId === "string" ? s.stripeCustomerId : undefined,
    stripeSubscriptionId:
      typeof s.stripeSubscriptionId === "string" ? s.stripeSubscriptionId : undefined,
    updatedAt: typeof s.updatedAt === "number" ? s.updatedAt : undefined,
  };
}

/** Effective tier from raw private metadata — Free unless a paid plan is active. */
export function effectiveTier(privateMetadata: unknown): Tier {
  const sub = readSubscription(privateMetadata);
  if (!sub || sub.tier === "free") return FREE_TIER;
  if (sub.expiresAt && Date.now() > sub.expiresAt) return FREE_TIER; // lapsed
  return tierById(sub.tier);
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
