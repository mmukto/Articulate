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
lives in `lib/course.ts`; the AI feedback contract is in `lib/types.ts`.

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
- **Subscription tiers** (`lib/tiers.ts`): Free / Starter / Plus / Pro / Max unlock
  10 / 30 / 60 / 120 / 250 **total** drills (spread evenly = 1/3/6/12/25 per module, via
  `drillsPerModule`). Each module hand-curates 2 drills; `lib/drills-extra.ts` fills the
  rest to 25, merged in `course.ts`. The active plan lives in Clerk `privateMetadata`
  (server-authoritative, written by the Stripe webhook); `lib/entitlements.ts` resolves
  the *effective* tier (reverts to Free when a paid plan lapses). Drill access is gated in
  the module page UI **and** enforced server-side in the feedback/speak routes — never
  trust the client.
- **Payments** (`lib/stripe.ts`, `app/api/billing/*`): Stripe Checkout for annual
  subscriptions (`/checkout`), webhook sync (`/webhook`, raw-body signature verify), and
  billing portal (`/portal`). Optional like Clerk — unset `STRIPE_SECRET_KEY` and the app
  still builds/runs (checkout returns 503). Needs the secret key + 4 annual price IDs +
  webhook secret (see `.env.example`).
- **Per-user AI cost guardrails** (`lib/limits.ts`): each signed-in user gets an annual
  AI-feedback allowance that **renews every 365 days**, sized by their tier
  (`tier.aiBudgetUsd`; Free = $2). Metered from real token usage, stored in Clerk
  `privateMetadata` (server-only, tamper-proof), enforced in the feedback/speak routes,
  surfaced by the header `AllowanceMeter` via `/api/usage`. If you change model/provider,
  update the per-token price in `lib/limits.ts`.

## Verifying changes

- `npm run typecheck` — type-checks without emitting.
- `npm run build` — full production build (works with or without Clerk keys).
