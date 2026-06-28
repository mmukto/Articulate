import Stripe from "stripe";
import type { TierId } from "./tiers";

// Stripe is optional, like Clerk: with STRIPE_SECRET_KEY unset the app still
// builds and runs (the pricing page shows plans but checkout returns 503). Set
// the secret key + the four price IDs to turn on real annual subscriptions.

export const STRIPE_ENABLED = !!process.env.STRIPE_SECRET_KEY;

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured (STRIPE_SECRET_KEY missing).");
  if (!_stripe) _stripe = new Stripe(key);
  return _stripe;
}

// Stripe Price IDs per paid tier, provided via env (created in the Stripe
// dashboard as annual recurring prices).
function priceMap(): Record<Exclude<TierId, "free">, string | undefined> {
  return {
    starter: process.env.STRIPE_PRICE_STARTER,
    plus: process.env.STRIPE_PRICE_PLUS,
    pro: process.env.STRIPE_PRICE_PRO,
    max: process.env.STRIPE_PRICE_MAX,
  };
}

export function priceIdForTier(tierId: TierId): string | undefined {
  if (tierId === "free") return undefined;
  return priceMap()[tierId];
}

export function tierForPriceId(priceId: string | null | undefined): TierId | undefined {
  if (!priceId) return undefined;
  for (const [tier, id] of Object.entries(priceMap())) {
    if (id && id === priceId) return tier as TierId;
  }
  return undefined;
}
