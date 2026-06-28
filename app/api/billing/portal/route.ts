import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { getStripe, STRIPE_ENABLED } from "@/lib/stripe";
import { readSubscription } from "@/lib/entitlements";

export const runtime = "nodejs";

// Open the Stripe billing portal so a subscriber can change or cancel their plan.
export async function POST(req: NextRequest) {
  if (!CLERK_ENABLED || !STRIPE_ENABLED) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 503 });
  }
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const sub = readSubscription(user.privateMetadata);
  if (!sub?.stripeCustomerId) {
    return NextResponse.json({ error: "No subscription to manage yet." }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const session = await getStripe().billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${origin}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
