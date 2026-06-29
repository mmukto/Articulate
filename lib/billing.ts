import type Stripe from "stripe";
import { tierForPriceId } from "./stripe";
import { LEVEL_IDS, parseLevels, type Level } from "./levels";
import { setUserSubscription } from "./entitlements";
import type { TierId } from "./tiers";

// Single source of truth for turning a Stripe subscription into our stored
// entitlement. Used by both the webhook (push) and the post-checkout sync
// endpoint (pull) so a flaky/late webhook never leaves the plan unreflected.
export async function applyStripeSubscription(
  userId: string,
  sub: Stripe.Subscription,
  customerId: string | null,
): Promise<{ tier: TierId; levels: Level[] }> {
  const item = sub.items.data[0];
  const tier = tierForPriceId(item?.price?.id) ?? "free";
  const active = sub.status === "active" || sub.status === "trialing";
  // In the current Stripe API the billing period lives on the subscription item.
  const periodEnd = item?.current_period_end;

  // Which levels were purchased (pricing is per level). Prefer the explicit list
  // in metadata; fall back to the first N levels by quantity if it's missing.
  let levels = parseLevels(sub.metadata?.levels);
  if (levels.length === 0) {
    const qty = typeof item?.quantity === "number" ? item.quantity : 1;
    levels = LEVEL_IDS.slice(0, Math.min(Math.max(qty, 1), LEVEL_IDS.length));
  }

  const resolvedTier: TierId = active ? tier : "free";
  const resolvedLevels = active ? levels : [];
  await setUserSubscription(userId, {
    tier: resolvedTier,
    levels: resolvedLevels,
    // Access lasts through the paid period; effectiveTier() reverts to Free after.
    expiresAt: periodEnd ? periodEnd * 1000 : undefined,
    cancelAtPeriodEnd: sub.cancel_at_period_end === true ? true : undefined,
    stripeCustomerId: customerId ?? (sub.customer as string),
    stripeSubscriptionId: sub.id,
  });
  return { tier: resolvedTier, levels: resolvedLevels };
}
