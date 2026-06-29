import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { getStripe, STRIPE_ENABLED } from "@/lib/stripe";
import { readSubscription, setUserSubscription } from "@/lib/entitlements";
import { tierById } from "@/lib/tiers";

export const runtime = "nodejs";

// Cancellation policy: NO refund. The subscription is scheduled to cancel at the
// end of the paid period — the user keeps full access until then, and it won't
// renew (industry-standard for annual plans).
//   POST {}              → preview { tierName, levelCount, accessUntil }
//   POST {confirm:true}  → schedule cancellation at period end
//   POST {resume:true}   → undo a scheduled cancellation
export async function POST(req: NextRequest) {
  if (!CLERK_ENABLED) {
    return NextResponse.json({ error: "Sign-in is required." }, { status: 400 });
  }
  if (!STRIPE_ENABLED) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 503 });
  }

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  let body: { confirm?: boolean; resume?: boolean } = {};
  try {
    body = ((await req.json()) as typeof body) ?? {};
  } catch {
    /* no body → preview */
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const sub = readSubscription(user.privateMetadata);
  if (!sub || sub.tier === "free" || !sub.stripeSubscriptionId) {
    return NextResponse.json(
      { error: "You don't have an active paid subscription." },
      { status: 400 },
    );
  }

  const tier = tierById(sub.tier);
  const levelCount = Math.max(1, sub.levels?.length ?? 1);
  const stripe = getStripe();

  // Resolve the access-until date from Stripe (period end lives on the item).
  let accessUntil = sub.expiresAt ?? 0;
  try {
    const live = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
    const periodEnd = live.items.data[0]?.current_period_end;
    if (periodEnd) accessUntil = periodEnd * 1000;
  } catch {
    /* fall back to the stored expiresAt */
  }

  // Resume: undo a scheduled cancellation.
  if (body.resume) {
    try {
      await stripe.subscriptions.update(sub.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });
    } catch (err) {
      console.error("[cancel] resume failed:", err);
      return NextResponse.json(
        { error: "Couldn't resume your plan. Please contact support." },
        { status: 500 },
      );
    }
    await setUserSubscription(userId, { ...sub, cancelAtPeriodEnd: false });
    return NextResponse.json({ resumed: true, tierName: tier.name });
  }

  // Preview (no charge, no change).
  if (!body.confirm) {
    return NextResponse.json({ preview: true, tierName: tier.name, levelCount, accessUntil });
  }

  // Schedule cancellation at period end — no refund, access continues until then.
  try {
    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  } catch (err) {
    console.error("[cancel] schedule failed:", err);
    return NextResponse.json(
      { error: "Couldn't cancel. Please contact support." },
      { status: 500 },
    );
  }
  // Keep access until period end; just record that it won't renew.
  await setUserSubscription(userId, { ...sub, cancelAtPeriodEnd: true });

  return NextResponse.json({ canceled: true, tierName: tier.name, levelCount, accessUntil });
}
