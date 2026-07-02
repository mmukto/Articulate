# Project guidance for Claude Code

## Working branch (IMPORTANT)

This repo uses **`main`** as the single long-lived branch for every Claude Code session
**and** as the Vercel **production** branch (the `articulate` Vercel project deploys
production from `main`).

At the start of any session:

1. Check out `main` (create it from `origin` if it isn't already present locally).
2. Do all development, commits, and pushes on `main`.
3. **Do not** create a new per-session branch. Keeping everything on `main` keeps the git
   history linear and makes Vercel deploy your latest work to production automatically.

If the session was started on a different auto-generated branch, switch to (or
fast-forward into) `main` and continue there. (The older
`claude/articulation-training-course-c6abl6` branch is kept only as history.)

## What this project is

**Articulate** — an articulation training course with AI coaching, built with Next.js
(App Router) + TypeScript + Tailwind. Course content (modules, drills, rubric dimensions)
lives in `lib/course.ts`; the AI feedback contract is in `lib/types.ts`. Public SEO
content (the `/guides` articles) lives in `lib/guides.ts`; sitemap/robots/JSON-LD are in
`app/sitemap.ts`, `app/robots.ts`, and `components/JsonLd.tsx`, with the canonical origin
in `lib/site.ts` (`SITE_URL`, default `https://iarticulate.ca`).

## Deployment notes

- Hosted on **Vercel** (project name: `articulate`).
- The Vercel project's **Output Directory** is left at the **Next.js default** (`.next`),
  so `next.config.mjs` does **not** set a `distDir` override. If you ever switch the
  dashboard override to `dist`, add `distDir: "dist"` back to `next.config.mjs` to match.
- `vercel.json` pins `framework` to `nextjs` so Vercel uses the Next.js build pipeline.
- **Auth (Clerk) is optional.** With `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` unset, the app
  builds and runs in a local-only guest mode (see `lib/clerk-config.ts` and
  `components/auth.tsx`). With the keys set, full sign-in and cross-device progress work.
- **AI coach.** Default model is `gemini-2.5-flash-lite` (override with `GEMINI_MODEL`);
  the provider is switchable to Claude via `ANTHROPIC_API_KEY`. Gemini billing must be
  enabled on the Google Cloud project (free tier is effectively unavailable).
- **Subscription tiers** (`lib/tiers.ts`): Starter / Plus / Pro / Max unlock
  30 / 60 / 120 / 250 **total** drills *per purchased career level* (spread evenly =
  3/6/12/25 per module, via `drillsPerModule`). Free is a sampler: 1 drill per module in
  the **first 3 modules only** (`FREE_MODULE_LIMIT`), locked to the user's chosen level.
  **Pricing is per career level** (`lib/levels.ts`: early / mid / senior): the tier price
  is billed once per level bought (Stripe quantity = level count), and only purchased
  levels unlock the tier's drill count — other levels fall back to the Free sampler.
  Each module hand-curates 2 senior drills; `lib/drills-extra.ts` (senior),
  `lib/drills-early.ts`, and `lib/drills-mid.ts` fill each level to 25 per module, merged
  in `course.ts`. The active plan (tier + levels) lives in Clerk `privateMetadata`
  (server-authoritative, written by the Stripe webhook); `lib/entitlements.ts` resolves
  the *effective* tier/levels (reverts to Free when a paid plan lapses, and fails closed
  if a paid sub has no recorded levels). Drill access is gated in the module page UI
  **and** enforced server-side in the feedback/speak routes — never trust the client.
- **Comp accounts** (`lib/entitlements.ts`): emails/usernames in `COMP_USER_EMAILS`
  (server-only env, comma-separated) resolve to **Max tier with the AI cap bypassed** —
  full access, no subscription. Checked in `tierForUser`/`isCompUser`; kept in env so the
  addresses stay private even though the repo is public.
- **Payments** (`lib/stripe.ts`, `lib/billing.ts`, `app/api/billing/*`): Stripe Checkout
  for annual subscriptions (`/checkout` — also does in-place, prorated **upgrades** for
  existing subscribers; downgrades/level swaps require cancel + re-subscribe), webhook
  sync (`/webhook`, raw-body signature verify), post-checkout/recovery reconcile
  (`/sync`, pull-based, owner-verified), and upgrade-charge preview (`/preview`).
  Optional like Clerk — unset `STRIPE_SECRET_KEY` and the app still builds/runs
  (checkout returns 503). Needs the secret key + 4 annual price IDs + webhook secret
  (see `.env.example`). A Clerk webhook (`app/api/clerk/webhook`, needs
  `CLERK_WEBHOOK_SIGNING_SECRET`) cancels a user's Stripe subscriptions when their
  account is deleted.
- **Cancellation — NO refund** (`app/api/billing/cancel`): annual plans are
  non-refundable. POST `{}` previews (tier, level count, access-until date);
  `{confirm:true}` schedules `cancel_at_period_end` — the user keeps full access until
  the period ends, then reverts to Free; `{resume:true}` undoes a scheduled cancellation.
  The pricing page drives all three. (Configure the Stripe billing portal to **disable**
  cancellation so this flow isn't bypassed.)
- **Brand**: user-facing name is **iArticulate™** (header wordmark carries the ™). The
  repo/package/Vercel project keep the technical id `articulate`.
- **Per-user AI cost guardrails** (`lib/limits.ts`): each signed-in user gets an annual
  AI-feedback allowance that **renews every 365 days** (window length overridable via
  `USER_ALLOWANCE_DAYS`), sized by their tier × levels purchased (`tier.aiBudgetUsd` =
  **1/3 of the annual price** per level; Free = $1 trial; see `aiBudgetForPrice` in
  `lib/tiers.ts`). Metered from real token usage, stored in Clerk `privateMetadata`
  (server-only, tamper-proof), enforced in the feedback/speak routes, and read by the
  client through `/api/usage` (used by the pricing page for plan/level state; there is
  currently no header meter component). `recordSpend` also marks the drill practiced in
  the server-side bitset (`lib/practiced.ts`) in the same metadata write. If you change
  model/provider, update the per-token price in `lib/limits.ts`.

## Verifying changes

- `npm run typecheck` — type-checks without emitting.
- `npm run build` — full production build (works with or without Clerk keys).
