import { auth, clerkClient } from "@clerk/nextjs/server";
import { CLERK_ENABLED } from "./clerk-config";
import {
  drillsPerModule,
  FREE_DRILLS_PER_MODULE,
  FREE_MODULE_LIMIT,
  FREE_TIER,
  TIER_MAP,
  tierById,
  type Tier,
  type TierId,
} from "./tiers";
import {
  DEFAULT_LEVEL,
  LEVEL_IDS,
  hasChosenLevel,
  parseLevels,
  readLevel,
  type Level,
} from "./levels";
import {
  DEFAULT_PROFESSION,
  PROFESSION_IDS,
  PROFESSION_MAP,
  hasChosenProfession,
  levelInfoFor,
  parseProfessions,
  readProfession,
  type Profession,
} from "./professions";
import type { Module } from "./types";

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
  /** Professions the user has paid for. Pricing is also per profession (Stripe
   *  quantity = levels × professions); the checkout currently sells one
   *  profession per subscription. Missing on pre-professions subscriptions,
   *  which resolve to ["business"] — the library that existed when they bought. */
  professions?: Profession[];
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
    professions: Array.isArray(s.professions)
      ? parseProfessions(s.professions)
      : undefined,
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

/**
 * Professions the user has actually paid for (empty when on Free). Unlike
 * levels, a MISSING list does not fail closed: subscriptions sold before
 * professions existed covered the original general library, so they resolve
 * to ["business"] — exactly what those subscribers bought. New checkouts
 * always record an explicit list.
 */
export function effectiveProfessions(privateMetadata: unknown): Profession[] {
  const sub = readSubscription(privateMetadata);
  if (!isActivePaid(sub)) return [];
  const pr = sub!.professions ?? [];
  return pr.length > 0 ? pr : [DEFAULT_PROFESSION];
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

/** Professions a full Clerk user's plan covers: all of them if comp, else paid. */
export function professionsForUser(user: ClerkUserLike): Profession[] {
  if (isCompUser(user)) return [...PROFESSION_IDS];
  return effectiveProfessions(user.privateMetadata);
}

/**
 * The user's annual AI-feedback allowance. The per-tier budget is 1/3 of the
 * per-(level × profession) price, so a user who bought N levels × M professions
 * (paying N×M× the price) gets N×M× the allowance. Free (and comp, who bypass
 * the cap anyway) get one unit.
 */
export function aiBudgetUsdForUser(user: ClerkUserLike): number {
  const tier = tierForUser(user);
  if (isCompUser(user)) return tier.aiBudgetUsd; // cap is bypassed anyway
  const units =
    effectiveLevels(user.privateMetadata).length *
    effectiveProfessions(user.privateMetadata).length;
  // A paid sub whose levels failed closed (units 0) gets the FREE budget, not a
  // paid one — consistent with it granting no drill access until it self-heals.
  const budget =
    tier.id !== "free" && units === 0
      ? FREE_TIER.aiBudgetUsd
      : tier.aiBudgetUsd * Math.max(1, units);
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
  /** Professions the user's plan covers (all of them for comp accounts). */
  professions: Profession[];
  /** The user's chosen career level (preference) — for free users this is the
   *  single level the sampler is locked to. */
  level: Level;
  /** The PRACTICE profession — the chosen preference, clamped to the plan:
   *  paid users are clamped onto a profession they bought; free users get the
   *  one profession they chose (locked once chosen); comp users roam freely. */
  profession: Profession;
  /** True when the profession can't be changed in the UI (free once chosen,
   *  or paid — switching a paid profession means changing the plan). */
  professionLocked: boolean;
  comp: boolean;
}

/** The free sampler's first choice, recorded SERVER-SIDE (privateMetadata) the
 *  first time a free user chooses a level/profession. The pickers' client-side
 *  lock lives in client-writable unsafeMetadata, which a user could rewrite to
 *  sample every profession × level — this record is what's actually enforced. */
interface FreeChoice {
  level?: Level;
  profession?: Profession;
}

function readFreeChoice(privateMetadata: unknown): FreeChoice {
  const fc = (
    privateMetadata as
      | { freeChoice?: { level?: string; profession?: string } }
      | undefined
  )?.freeChoice;
  const level = LEVEL_IDS.find((l) => l === fc?.level);
  const profession = PROFESSION_IDS.find((p) => p === fc?.profession);
  return { level, profession };
}

/** Tier + purchased levels/professions + chosen level/profession + comp flag
 *  in one Clerk read. */
export async function getUserEntitlements(userId: string): Promise<Entitlements> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const comp = isCompUser(user);
  const professions = professionsForUser(user);
  const unsafe = user.unsafeMetadata;
  const pref = readProfession(unsafe);
  const prefLevel = readLevel(unsafe);
  const isFree = !comp && professions.length === 0;
  // Free sampler: enforce the server-recorded first choice, not the raw
  // (client-writable) preference.
  const freeChoice: FreeChoice = isFree ? readFreeChoice(user.privateMetadata) : {};
  const level = isFree && freeChoice.level ? freeChoice.level : prefLevel;
  // Paid users practice within what they bought; a stale preference falls back
  // to a purchased profession instead of silently showing an unpaid bank.
  const profession =
    comp || professions.length === 0
      ? isFree && freeChoice.profession
        ? freeChoice.profession
        : pref
      : professions.includes(pref)
        ? pref
        : professions[professions.length - 1];

  // Record a free account's first choice once, at choice time (the preference
  // appears in unsafeMetadata when the picker is used). Best-effort: a failed
  // write just retries on the next request.
  if (isFree) {
    const lockLevel = freeChoice.level == null && hasChosenLevel(unsafe);
    const lockProfession =
      freeChoice.profession == null && hasChosenProfession(unsafe);
    if (lockLevel || lockProfession) {
      const next: FreeChoice = {
        ...(freeChoice.level ? { level: freeChoice.level } : {}),
        ...(freeChoice.profession ? { profession: freeChoice.profession } : {}),
        ...(lockLevel ? { level: prefLevel } : {}),
        ...(lockProfession ? { profession: pref } : {}),
      };
      try {
        await client.users.updateUserMetadata(userId, {
          privateMetadata: {
            ...((user.privateMetadata ?? {}) as Record<string, unknown>),
            freeChoice: next,
          },
        });
      } catch (err) {
        console.error("[entitlements] failed to record free choice:", err);
      }
    }
  }

  return {
    tier: tierForUser(user),
    levels: levelsForUser(user),
    professions,
    level,
    profession,
    professionLocked:
      !comp &&
      (professions.length > 0 ||
        freeChoice.profession != null ||
        hasChosenProfession(unsafe)),
    comp,
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
    professions: [] as Profession[],
    level: DEFAULT_LEVEL,
    profession: DEFAULT_PROFESSION,
    professionLocked: false,
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
 * The single server-side drill entitlement gate, shared by the feedback and
 * speak routes (never trust the client — the module page UI mirrors this, but
 * this is what's enforced). Pricing is per level AND per profession: a drill
 * is fully unlocked (the tier's per-module count) only when the user's plan
 * covers both the drill's level and its profession. Otherwise the Free
 * sampler applies — the first drill per module in the first
 * FREE_MODULE_LIMIT modules, at the user's chosen (locked) level and
 * profession only. Comp/owner accounts (COMP_USER_EMAILS) bypass everything.
 */
export function drillAccess(
  ent: Entitlements,
  found: { module: Module; level: Level; profession: Profession; levelIndex: number },
): { allowed: true } | { allowed: false; error: string } {
  if (ent.comp) return { allowed: true }; // comp/owner accounts see everything

  const purchased =
    ent.levels.includes(found.level) && ent.professions.includes(found.profession);
  const freeOk =
    found.module.number <= FREE_MODULE_LIMIT &&
    found.level === ent.level &&
    found.profession === ent.profession;
  const allowed = purchased
    ? drillsPerModule(ent.tier)
    : freeOk
      ? FREE_DRILLS_PER_MODULE
      : 0;
  if (found.levelIndex < allowed) return { allowed: true };

  const paid = ent.levels.length > 0;
  const error = purchased
    ? "This drill is part of a higher plan. Upgrade to unlock it."
    : paid && !ent.professions.includes(found.profession)
      ? `Your plan doesn't include the ${PROFESSION_MAP[found.profession].name} profession. Switching professions requires changing your plan.`
      : found.module.number > FREE_MODULE_LIMIT
        ? `Free practice covers the first ${FREE_MODULE_LIMIT} modules. Subscribe to unlock the full course.`
        : found.level !== ent.level
          ? "Free practice is locked to your chosen level. Subscribe to unlock other levels."
          : found.profession !== ent.profession
            ? "Free practice is locked to your chosen profession. Subscribe to unlock other professions."
            : `Subscribe to unlock all drills at the ${levelInfoFor(found.profession, found.level).name} level.`;
  return { allowed: false, error };
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
