import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { getStripe, STRIPE_ENABLED, priceIdForTier } from "@/lib/stripe";
import { tierById } from "@/lib/tiers";
import { parseLevels } from "@/lib/levels";
import { readSubscription } from "@/lib/entitlements";

export const runtime = "nodejs";

// Preview the exact prorated amount an in-place upgrade would charge the saved
// card right now, so the confirm dialog can show it before the user commits.
// Returns { amountDueNow: number } in dollars, or { amountDueNow: null } when it
// can't be computed (the UI then shows a generic message rather than a figure).
export async function POST(req: NextRequest) {
  if (!CLERK_ENABLED || !STRIPE_ENABLED) {
    return NextResponse.json({ amountDueNow: null });
  }
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ amountDueNow: null }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ amountDueNow: null }, { status: 400 });
  }
  const tier = tierById((body as { tier?: string })?.tier);
  const priceId = priceIdForTier(tier.id);
  const levels = parseLevels((body as { levels?: unknown })?.levels);
  if (tier.id === "free" || !priceId || levels.length === 0) {
    return NextResponse.json({ amountDueNow: null }, { status: 400 });
  }
  const quantity = levels.length;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const sub = readSubscription(user.privateMetadata);
  const active =
    sub?.stripeSubscriptionId &&
    sub.tier !== "free" &&
    (!sub.expiresAt || sub.expiresAt > Date.now());
  // Only in-place upgrades have a "charge now" amount; new subs go via Checkout.
  if (!active || !sub?.stripeCustomerId) {
    return NextResponse.json({ amountDueNow: null });
  }

  const stripe = getStripe();
  try {
    const existing = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId!);
    const itemId = existing.items.data[0]?.id;
    const preview = await stripe.invoices.createPreview({
      customer: sub.stripeCustomerId,
      subscription: sub.stripeSubscriptionId!,
      subscription_details: {
        items: [{ id: itemId, price: priceId, quantity }],
        proration_behavior: "always_invoice",
      },
    });
    // The immediate charge is the net of the proration line items (a positive
    // charge for the new plan minus the credit for unused time on the old one).
    const cents = preview.lines.data
      .filter((l) => (l as { proration?: boolean }).proration)
      .reduce((sum, l) => sum + l.amount, 0);
    const amountDueNow = Math.max(0, Math.round(cents)) / 100;
    return NextResponse.json({ amountDueNow });
  } catch (err) {
    console.error("[billing/preview] failed:", err);
    return NextResponse.json({ amountDueNow: null });
  }
}
