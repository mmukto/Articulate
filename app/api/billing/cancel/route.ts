import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type Stripe from "stripe";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { getStripe, STRIPE_ENABLED } from "@/lib/stripe";
import { readSubscription, setUserSubscription } from "@/lib/entitlements";
import { tierById } from "@/lib/tiers";
import { readSpentUsd } from "@/lib/limits";

export const runtime = "nodejs";

const round2 = (n: number) => Math.round(n * 100) / 100;

// Distinct drills the user has practiced (progress lives in unsafeMetadata.progress
// as drillKey -> stats). Used to prorate the refund by usage.
function countDrillsCompleted(unsafeMetadata: unknown): number {
  const p = (unsafeMetadata as { progress?: Record<string, unknown> } | undefined)?.progress;
  return p && typeof p === "object" ? Object.keys(p).length : 0;
}

// Cancellation with a usage-based refund:
//   refund = price − AI spend − (drills completed / tier total) × price   (floored at 0)
// POST with no body (or {confirm:false}) returns the breakdown as a preview;
// POST {confirm:true} issues the Stripe refund, cancels the subscription, and
// reverts the user to Free.
export async function POST(req: NextRequest) {
  if (!CLERK_ENABLED) {
    return NextResponse.json({ error: "Sign-in is required." }, { status: 400 });
  }
  if (!STRIPE_ENABLED) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 503 });
  }

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  let confirm = false;
  try {
    confirm = !!((await req.json()) as { confirm?: boolean })?.confirm;
  } catch {
    /* no body → preview */
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const sub = readSubscription(user.privateMetadata);
  if (!sub || sub.tier === "free" || !sub.stripeSubscriptionId) {
    return NextResponse.json(
      { error: "You don't have an active paid subscription to cancel." },
      { status: 400 },
    );
  }

  const tier = tierById(sub.tier);
  // Pricing is per level, so the annual price and the drill total both scale with
  // how many levels the user bought.
  const levelCount = Math.max(1, sub.levels?.length ?? 1);
  const price = round2(tier.priceUsd * levelCount);
  const drillTotal = tier.drillTotal * levelCount;
  const aiCostUsd = round2(readSpentUsd(user.privateMetadata));
  const drillsCompleted = countDrillsCompleted(user.unsafeMetadata);
  const drillCharge = Math.min(
    price,
    drillTotal > 0 ? round2((drillsCompleted / drillTotal) * price) : 0,
  );
  const refund = Math.max(0, round2(price - aiCostUsd - drillCharge));

  const breakdown = {
    tierName: tier.name,
    levelCount,
    price,
    aiCostUsd,
    drillsCompleted,
    drillTotal,
    drillCharge,
    refund,
  };

  if (!confirm) {
    return NextResponse.json({ preview: true, ...breakdown });
  }

  // Issue the partial refund (if any), then cancel the subscription.
  const stripe = getStripe();
  try {
    if (refund > 0) {
      const subscription = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId, {
        expand: ["latest_invoice.payment_intent"],
      });
      const inv = subscription.latest_invoice as Stripe.Invoice | null;
      // payment_intent / charge availability varies by Stripe API version — read defensively.
      const piRaw = (inv as unknown as { payment_intent?: unknown })?.payment_intent;
      const chRaw = (inv as unknown as { charge?: unknown })?.charge;
      const paymentIntent =
        typeof piRaw === "string" ? piRaw : (piRaw as { id?: string } | undefined)?.id;
      const charge =
        typeof chRaw === "string" ? chRaw : (chRaw as { id?: string } | undefined)?.id;

      if (paymentIntent || charge) {
        await stripe.refunds.create({
          amount: Math.round(refund * 100),
          ...(paymentIntent ? { payment_intent: paymentIntent } : { charge }),
        } as Stripe.RefundCreateParams);
      } else {
        console.error(
          "[cancel] no payment_intent/charge found to refund for",
          sub.stripeSubscriptionId,
        );
      }
    }
    await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
  } catch (err) {
    console.error("[cancel] stripe error:", err);
    return NextResponse.json(
      { error: "Couldn't process the cancellation. Please contact support." },
      { status: 500 },
    );
  }

  // Revert to Free now (the subscription.deleted webhook will also fire; idempotent).
  await setUserSubscription(userId, {
    tier: "free",
    expiresAt: Date.now(),
    stripeCustomerId: sub.stripeCustomerId,
    stripeSubscriptionId: sub.stripeSubscriptionId,
  });

  return NextResponse.json({ canceled: true, ...breakdown });
}
