import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, STRIPE_ENABLED } from "@/lib/stripe";
import { setUserSubscription } from "@/lib/entitlements";
import { applyStripeSubscription } from "@/lib/billing";

export const runtime = "nodejs";

// Stripe webhook. Verifies the signature against the RAW body, then syncs the
// user's tier into Clerk metadata. Handlers set absolute state, so redelivering
// the same event is naturally idempotent.
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!STRIPE_ENABLED || !secret) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature") ?? "";
  const raw = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[billing] bad webhook signature:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id ?? session.metadata?.userId;
        if (userId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await applyStripeSubscription(userId, sub, session.customer as string | null);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) await applyStripeSubscription(userId, sub, sub.customer as string);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) {
          // Lapsed/canceled — revert to Free immediately.
          await setUserSubscription(userId, {
            tier: "free",
            expiresAt: Date.now(),
            stripeCustomerId: sub.customer as string,
            stripeSubscriptionId: sub.id,
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[billing] handler error:", err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
