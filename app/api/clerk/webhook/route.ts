import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { getStripe, STRIPE_ENABLED } from "@/lib/stripe";

export const runtime = "nodejs";

// Clerk webhook. When a user deletes their account, cancel their Stripe
// subscriptions so a deleted account never keeps renewing/charging a card.
// Signature is verified by Clerk's verifyWebhook (svix) against the
// CLERK_WEBHOOK_SIGNING_SECRET env var. No-ops cleanly when not configured.
export async function POST(req: NextRequest) {
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  let evt: { type: string; data: { id?: string } };
  try {
    evt = (await verifyWebhook(req)) as unknown as { type: string; data: { id?: string } };
  } catch (err) {
    console.error("[clerk] bad webhook signature:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    if (evt.type === "user.deleted" && evt.data?.id && STRIPE_ENABLED) {
      const userId = evt.data.id;
      const stripe = getStripe();
      // Find subscriptions stamped with this user's id at checkout and cancel any
      // that are still live. Immediate cancel, no refund — the account is gone.
      const found = await stripe.subscriptions.search({
        query: `metadata['userId']:'${userId}'`,
        limit: 50,
      });
      for (const sub of found.data) {
        if (sub.status === "canceled" || sub.status === "incomplete_expired") continue;
        try {
          await stripe.subscriptions.cancel(sub.id);
        } catch (e) {
          console.error("[clerk] failed to cancel subscription", sub.id, e);
        }
      }
    }
  } catch (err) {
    console.error("[clerk] handler error:", err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
