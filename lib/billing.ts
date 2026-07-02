import type Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { tierForPriceId } from "./stripe";
import { LEVEL_IDS, parseLevels, type Level } from "./levels";
import { parseProfessions, type Profession } from "./professions";
import { readSubscription, setUserSubscription } from "./entitlements";
import type { TierId } from "./tiers";

// Single source of truth for turning a Stripe subscription into our stored
// entitlement. Used by both the webhook (push) and the post-checkout sync
// endpoint (pull) so a flaky/late webhook never leaves the plan unreflected.
export async function applyStripeSubscription(
  userId: string,
  sub: Stripe.Subscription,
  customerId: string | null,
): Promise<{ tier: TierId; levels: Level[]; professions: Profession[] }> {
  const item = sub.items.data[0];
  const tier = tierForPriceId(item?.price?.id) ?? "free";
  const active = sub.status === "active" || sub.status === "trialing";
  // In the current Stripe API the billing period lives on the subscription item.
  const periodEnd = item?.current_period_end;

  // Which levels and professions were purchased (pricing is per level × per
  // profession; Stripe quantity = levels × professions). Prefer the explicit
  // lists in metadata (our checkout always sets both). If missing (e.g. a
  // change made in the Stripe dashboard), PRESERVE the user's existing stored
  // values rather than guessing — a quantity-slice would corrupt any set that
  // isn't a canonical prefix. Quantity is a last resort for levels only;
  // professions default to the original "business" library.
  let levels = parseLevels(sub.metadata?.levels);
  let professions = parseProfessions(sub.metadata?.professions);
  if (levels.length === 0 || professions.length === 0) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const stored = readSubscription(user.privateMetadata);
    if (levels.length === 0) levels = stored?.levels ?? [];
    if (professions.length === 0) professions = stored?.professions ?? [];
    if (levels.length === 0) {
      const qty = typeof item?.quantity === "number" ? item.quantity : 1;
      const perProfession = Math.max(1, professions.length || 1);
      const levelCount = Math.max(1, Math.round(qty / perProfession));
      levels = LEVEL_IDS.slice(0, Math.min(levelCount, LEVEL_IDS.length));
    }
    if (professions.length === 0) professions = ["business"];
  }

  const resolvedTier: TierId = active ? tier : "free";
  const resolvedLevels = active ? levels : [];
  const resolvedProfessions = active ? professions : [];
  await setUserSubscription(userId, {
    tier: resolvedTier,
    levels: resolvedLevels,
    professions: resolvedProfessions,
    // Access lasts through the paid period; effectiveTier() reverts to Free after.
    expiresAt: periodEnd ? periodEnd * 1000 : undefined,
    cancelAtPeriodEnd: sub.cancel_at_period_end === true ? true : undefined,
    stripeCustomerId: customerId ?? (sub.customer as string),
    stripeSubscriptionId: sub.id,
  });
  return { tier: resolvedTier, levels: resolvedLevels, professions: resolvedProfessions };
}
