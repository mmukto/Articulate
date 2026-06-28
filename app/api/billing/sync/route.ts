import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { getStripe, STRIPE_ENABLED } from "@/lib/stripe";
import { applyStripeSubscription } from "@/lib/billing";

export const runtime = "nodejs";

// Post-checkout reconcile (pull). The success page calls this with the Checkout
// Session id so the user's plan reflects immediately, without waiting on the
// webhook. We verify the session belongs to the signed-in user before applying.
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
    /* no body */
  }
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const stripe = getStripe();
  try {
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
  } catch (err) {
    console.error("[billing/sync] failed:", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
