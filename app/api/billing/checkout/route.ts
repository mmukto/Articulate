import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { getStripe, STRIPE_ENABLED, priceIdForTier } from "@/lib/stripe";
import { tierById } from "@/lib/tiers";
import { readSubscription } from "@/lib/entitlements";

export const runtime = "nodejs";

// Create a Stripe Checkout Session for an annual subscription to a paid tier and
// return its URL. The client redirects the browser there.
export async function POST(req: NextRequest) {
  if (!CLERK_ENABLED) {
    return NextResponse.json({ error: "Sign-in is required to subscribe." }, { status: 400 });
  }
  if (!STRIPE_ENABLED) {
    return NextResponse.json({ error: "Payments aren't configured yet." }, { status: 503 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const tier = tierById((body as { tier?: string })?.tier);
  const priceId = priceIdForTier(tier.id);
  if (tier.id === "free" || !priceId) {
    return NextResponse.json({ error: "Choose a paid plan to continue." }, { status: 400 });
  }

  const stripe = getStripe();
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const sub = readSubscription(user.privateMetadata);
  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: userId,
    // Reuse an existing customer if we have one; otherwise prefill the email.
    customer: sub?.stripeCustomerId,
    customer_email: sub?.stripeCustomerId ? undefined : email,
    metadata: { userId, tier: tier.id },
    subscription_data: { metadata: { userId, tier: tier.id } },
    allow_promotion_codes: true,
    success_url: `${origin}/pricing?status=success`,
    cancel_url: `${origin}/pricing?status=cancel`,
  });

  return NextResponse.json({ url: session.url });
}
