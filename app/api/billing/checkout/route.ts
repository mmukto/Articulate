import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { getStripe, STRIPE_ENABLED, priceIdForTier } from "@/lib/stripe";
import { tierById } from "@/lib/tiers";
import { parseLevels } from "@/lib/levels";
import { parseProfessions } from "@/lib/professions";
import { readSubscription, setUserSubscription } from "@/lib/entitlements";
import { applyStripeSubscription } from "@/lib/billing";

export const runtime = "nodejs";

// Start (or change) an annual subscription. Pricing is PER LEVEL and PER
// PROFESSION: the chosen tier's price is billed once per selected career level
// per selected profession (Stripe quantity = levels × professions; the pricing
// page currently sells one profession per subscription). For a first purchase
// we open Stripe Checkout; if the user already has an active subscription we
// update it in place (higher tier / added levels, prorated, same professions)
// and return them to the pricing page. Swapping a profession or level requires
// cancel + re-subscribe.
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
  const levels = parseLevels((body as { levels?: unknown })?.levels);
  if (levels.length === 0) {
    return NextResponse.json(
      { error: "Pick at least one career level to subscribe." },
      { status: 400 },
    );
  }
  const professions = parseProfessions(
    (body as { profession?: unknown })?.profession ??
      (body as { professions?: unknown })?.professions,
  );
  if (professions.length === 0) {
    return NextResponse.json(
      { error: "Pick a profession to subscribe." },
      { status: 400 },
    );
  }
  const quantity = levels.length * professions.length;
  const metadata = {
    userId,
    tier: tier.id,
    levels: levels.join(","),
    professions: professions.join(","),
  };

  const stripe = getStripe();
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const sub = readSubscription(user.privateMetadata);
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;

  // Existing active subscription → update it in place (change tier/levels) so we
  // never stack duplicate subscriptions. The saved card is charged any proration.
  const hasActive =
    sub?.stripeSubscriptionId &&
    sub.tier !== "free" &&
    (!sub.expiresAt || sub.expiresAt > Date.now());
  if (hasActive) {
    // Upgrades only, no free swaps: you may ADD levels/professions and/or move
    // to a HIGHER tier (charged immediately), but not drop/swap an owned level
    // or profession, or move to a lower tier in place — those require cancel +
    // re-subscribe.
    const ownedLevels = sub!.levels ?? [];
    // Pre-professions subscriptions covered the original general library.
    const ownedProfessions =
      sub!.professions && sub!.professions.length > 0
        ? sub!.professions
        : (["business"] as const);
    const currentTier = tierById(sub!.tier);
    const keepsAllOwned =
      ownedLevels.every((l) => levels.includes(l)) &&
      ownedProfessions.every((p) => professions.includes(p));
    const currentTotal =
      currentTier.priceUsd * Math.max(1, ownedLevels.length) *
      Math.max(1, ownedProfessions.length);
    const newTotal = tier.priceUsd * levels.length * professions.length;
    if (!keepsAllOwned || tier.priceUsd < currentTier.priceUsd) {
      return NextResponse.json(
        {
          error:
            "To switch or drop a career level or profession, or move to a lower plan, cancel and re-subscribe.",
        },
        { status: 400 },
      );
    }
    if (newTotal <= currentTotal) {
      return NextResponse.json(
        { error: "That isn't an upgrade — you're already on this plan." },
        { status: 400 },
      );
    }
    try {
      const existing = await stripe.subscriptions.retrieve(sub!.stripeSubscriptionId!);
      const itemId = existing.items.data[0]?.id;
      const updated = await stripe.subscriptions.update(sub!.stripeSubscriptionId!, {
        items: [{ id: itemId, price: priceId, quantity }],
        // Invoice and charge the prorated upgrade now, not on the next cycle.
        proration_behavior: "always_invoice",
        // Upgrading implies they want to keep the plan — clear any scheduled
        // cancellation so Stripe and our metadata don't disagree.
        cancel_at_period_end: false,
        metadata,
      });
      // Reflect immediately; the subscription.updated webhook also confirms.
      // Take expiresAt from Stripe's response so a paid sub is never stored
      // without one (stored-only value could be missing if a webhook was lost).
      const periodEnd = updated.items.data[0]?.current_period_end;
      await setUserSubscription(userId, {
        tier: tier.id,
        levels,
        professions,
        cancelAtPeriodEnd: false,
        expiresAt: periodEnd ? periodEnd * 1000 : sub!.expiresAt,
        stripeCustomerId: sub!.stripeCustomerId,
        stripeSubscriptionId: sub!.stripeSubscriptionId,
      });
      return NextResponse.json({ url: `${origin}/pricing?status=success` });
    } catch (err) {
      console.error("[checkout] in-place update failed:", err);
      return NextResponse.json(
        { error: "Couldn't update your subscription. Please contact support." },
        { status: 500 },
      );
    }
  }

  // Clerk metadata can be stale (e.g. a missed renewal webhook makes hasActive
  // false while the subscription is still live in Stripe). Before opening a NEW
  // checkout, ask Stripe directly — stacking a second subscription would
  // double-charge the user. On a hit, re-sync the plan and refuse the session.
  if (sub?.stripeCustomerId) {
    try {
      const existing = await stripe.subscriptions.list({
        customer: sub.stripeCustomerId,
        status: "all",
        limit: 10,
      });
      const live = existing.data.find(
        (s) => s.status === "active" || s.status === "trialing" || s.status === "past_due",
      );
      if (live) {
        await applyStripeSubscription(userId, live, sub.stripeCustomerId);
        return NextResponse.json(
          {
            error:
              "You already have a subscription — your plan has been re-synced. Reload the page, then upgrade or cancel from here.",
          },
          { status: 409 },
        );
      }
    } catch (err) {
      // Best-effort guard: if Stripe can't answer, proceed — Checkout itself
      // will fail loudly if the account is unreachable.
      console.error("[checkout] duplicate-subscription check failed:", err);
    }
  }

  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity }],
    client_reference_id: userId,
    // Reuse an existing customer if we have one; otherwise prefill the email.
    customer: sub?.stripeCustomerId,
    customer_email: sub?.stripeCustomerId ? undefined : email,
    metadata,
    subscription_data: { metadata },
    allow_promotion_codes: true,
    // session_id lets the success page reconcile the plan immediately (in case
    // the webhook is delayed). Stripe substitutes the real id on redirect.
    success_url: `${origin}/pricing?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?status=cancel`,
  });

  return NextResponse.json({ url: session.url });
}
