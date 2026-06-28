import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { getStripe, STRIPE_ENABLED } from "@/lib/stripe";
import { applyStripeSubscription } from "@/lib/billing";

export const runtime = "nodejs";

// Reconcile a user's plan from Stripe (pull), so it reflects even if the webhook
// is delayed or never fired. Two modes:
//   { sessionId }  — apply a specific completed Checkout Session (used right
//                    after checkout; verified to belong to this user).
//   {}             — "recover": find this user's latest active subscription by
//                    their email and apply it (self-heals past purchases).
export async function POST(req: NextRequest) {
  if (!CLERK_ENABLED || !STRIPE_ENABLED) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ ok: false }, { status: 401 });

  let sessionId: string | undefined;
  try {
    sessionId = (await req.json())?.sessionId;
  } catch {
    /* no body → recover mode */
  }

  const stripe = getStripe();
  try {
    if (sessionId && typeof sessionId === "string") {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      // Only apply a session that belongs to this user (never trust the client id).
      const owner = session.client_reference_id ?? session.metadata?.userId;
      if (owner !== userId || !session.subscription) {
        return NextResponse.json({ ok: false }, { status: 200 });
      }
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const result = await applyStripeSubscription(
        userId,
        sub,
        session.customer as string | null,
      );
      return NextResponse.json({ ok: true, ...result });
    }

    // Recover mode: look up the user's Stripe customer(s) by their email and
    // apply the most recent active subscription, if any.
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
      user.emailAddresses[0]?.emailAddress;
    if (!email) return NextResponse.json({ ok: false }, { status: 200 });

    const customers = await stripe.customers.list({ email, limit: 10 });
    let best: { sub: import("stripe").Stripe.Subscription; customer: string } | null = null;
    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: "all",
        limit: 20,
      });
      for (const sub of subs.data) {
        const active = sub.status === "active" || sub.status === "trialing";
        if (!active) continue;
        if (!best || sub.created > best.sub.created) best = { sub, customer: customer.id };
      }
    }
    if (!best) return NextResponse.json({ ok: false }, { status: 200 });

    const result = await applyStripeSubscription(userId, best.sub, best.customer);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[billing/sync] failed:", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
