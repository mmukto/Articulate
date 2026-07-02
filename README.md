# iArticulate&trade;

An **articulation training course with AI coaching** for executive communication and
clarity. You read short, practical lessons, then practice on realistic drills — and an
AI coach (Claude) scores every response against a sharp rubric, rewrites it stronger,
and tells you exactly what to fix.

Built with Next.js (App Router) + TypeScript + Tailwind. Feedback is powered by your
choice of a **free Google Gemini** key or an Anthropic Claude key — the provider is
switchable with no code changes. Sign-up / login (so multiple people can share one link,
each with their own progress) is handled by **Clerk**.

> ## 🧭 Working branch for Claude Code sessions
>
> This repo uses **`main`** as its single long-lived branch — for all Claude Code
> sessions **and** as the Vercel **production** branch.
>
> **When you start a new session on this repo, check out and develop on `main`** (create
> it from `origin` if it isn't present), commit there, and push there. Do **not** create a
> new per-session branch — keeping all work on `main` keeps the git history linear and lets
> Vercel deploy your latest work to production automatically. This convention is also
> recorded in `CLAUDE.md`, which Claude Code reads automatically at the start of every
> session.

## Deploy in one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmmukto%2Farticulate&env=GEMINI_API_KEY%2CNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY%2CCLERK_SECRET_KEY&envDescription=Keys%20for%20the%20free%20Gemini%20AI%20and%20Clerk%20sign-in%20%E2%80%94%20see%20the%20README&envLink=https%3A%2F%2Fgithub.com%2Fmmukto%2Farticulate%23getting-started&project-name=articulate&repository-name=articulate)

Clicking the button clones this repo into your own Vercel account and prompts you for
three keys before the first build:

- **`GEMINI_API_KEY`** — the free AI coach. Get one (no credit card) at
  <https://aistudio.google.com/app/apikey>. (Prefer Claude? See
  [AI provider](#ai-provider) and set `ANTHROPIC_API_KEY` instead.)
- **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`** and **`CLERK_SECRET_KEY`** — sign up / login.
  Create a free app at <https://dashboard.clerk.com> and copy both from its API Keys
  page. See [Accounts & sign-in](#accounts--sign-in).

**Use it as an app on your iPad:** once deployed, open the `*.vercel.app` URL in
**Safari**, tap **Share → Add to Home Screen**. The app is a standalone PWA, so the
home-screen icon launches full-screen with no browser chrome.

## What's inside

- **10 modules**, each with a tight lesson, before/after examples, and a deep bank of
  AI-coached practice drills written for **three career levels** — Early career, Mid
  career (manager), and Executive — 25 drills per level per module:
  1. Lead With the Point (BLUF)
  2. Start With the Audience (curse of knowledge)
  3. Structure That Carries (Pyramid, SCQA, PREP)
  4. Cut to the Bone (concision)
  5. Precision & Evidence (What → So What → Now What)
  6. Executive Presence in Words
  7. Answering Under Pressure
  8. Narrative & Persuasion
  9. Delivering Hard Messages (clear is kind; SBI feedback)
  10. Putting It Together
- **A 6-dimension rubric** — Clarity, Concision, Structure, Precision, Audience, Impact —
  applied to every response.
- **AI feedback** for each drill: an overall score, per-dimension scores with comments,
  specific strengths and fixes, a stronger rewrite of *your own words*, and a suggested
  next micro-drill.
- **Voice practice** on every drill — a Speak / Write toggle (Speak is first and the
  default, so every drill trains both spoken and written articulation):
  - **Speak:** record your answer aloud (up to 90s); the coach transcribes it and scores
    your delivery — pace, filler words, clarity, and enunciation — and gives you a
    stronger spoken version. *(Requires a Gemini key — it's the multimodal one.)*
  - **Listen:** a "Hear it" button reads the model answer aloud using the device's
    built-in speech, so you can hear a crisp delivery. *(Free, no key, works on iPad.)*

- **My progress dashboard** (`/progress`, signed-in) — each user sees their completed
  drills, attempts, and best scores (written = overall; spoken = average delivery), with
  per-module breakdown and summary stats.

- **Subscription plans** (`/pricing`, optional — needs Stripe): Free unlocks a sampler
  (1 drill each in the first 3 modules); Starter / Plus / Pro / Max ($4.99–$49.99 per
  career level, per year) unlock 3/6/12/25 drills per module for each level purchased.
  Plans are annual, upgradable in place (prorated), and cancelable at period end
  (non-refundable). Without `STRIPE_SECRET_KEY` the app runs free-only.

- **Free guides** (`/guides`) — public, SEO-indexed articles on the core principles
  (being articulate, BLUF, cutting filler words), cross-linked into the course, with
  sitemap/robots/JSON-LD structured data built in.

> Pronunciation note: spoken feedback judges **general intelligibility and enunciation**,
> not phoneme-level accuracy, and never penalizes an accent. True pronunciation scoring
> would need a dedicated (paid) speech-assessment service and isn't included.

## Accounts & sign-in

Sign-up / login is handled by [Clerk](https://clerk.com) so multiple people can use the
app from one shared link, each with their own account and progress.

- Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (from the Clerk
  dashboard → API Keys). The free tier covers ~10k monthly users.
- Lessons are public; **practice and AI feedback require sign-in**. The `/api/feedback`
  and `/api/speak` routes return `401` without a signed-in user, and the practice UI
  shows a sign-in prompt.
- Practice progress is stored per-user in Clerk `unsafeMetadata`, so it **syncs across
  devices** for the signed-in account. localStorage is a local cache; the two are merged
  on load (best score and attempts reconciled).

Users sign up/in via a modal (email + whichever social logins you enable in Clerk).

## AI provider

The coach is **provider-switchable** — it uses whichever key is configured, with no
code changes:

| If this env var is set      | Provider used        | Cost                 |
| --------------------------- | -------------------- | -------------------- |
| `GEMINI_API_KEY`            | Google Gemini        | **Free tier**        |
| `ANTHROPIC_API_KEY`         | Anthropic Claude     | Paid                 |

If both are set, Gemini wins (free first). Force a choice with
`ARTICULATE_PROVIDER=gemini` or `ARTICULATE_PROVIDER=claude`. Override models with
`GEMINI_MODEL` (default `gemini-2.5-flash-lite`) or `ANTHROPIC_MODEL` (default
`claude-opus-4-8`).

## How the AI coaching works

`lib/feedback.ts` builds a provider-agnostic prompt (`lib/prompt.ts`) from the module,
the drill, the rubric, and the learner's response, then dispatches to the active
provider in `lib/providers/`:

- **Gemini** (`providers/gemini.ts`) requests JSON via `responseSchema` +
  `responseMimeType: "application/json"`.
- **Claude** (`providers/claude.ts`) uses **forced tool use** — the model must call a
  `submit_feedback` tool whose input schema is the feedback shape — so the result comes
  back as a parsed object.

Either way, scores are clamped and the payload is normalized server-side, so a
malformed model response can never crash the UI. Grading happens in the
`/api/feedback` route (`app/api/feedback/route.ts`); the keys never reach the browser.

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure keys

Copy the example env file and fill it in:

```bash
cp .env.example .env.local
# AI coach (pick one):
#   GEMINI_API_KEY=...        free   → https://aistudio.google.com/app/apikey
#   ANTHROPIC_API_KEY=sk-...  paid   → https://console.anthropic.com/
# Sign-in (Clerk — both required):
#   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
#   CLERK_SECRET_KEY=sk_...   → https://dashboard.clerk.com (API Keys)
```

See [AI provider](#ai-provider) and [Accounts & sign-in](#accounts--sign-in) for details.

### 3. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

> Lessons load for everyone. **Practice requires signing in** (Clerk keys set), and
> feedback requires an AI key (`GEMINI_API_KEY` or `ANTHROPIC_API_KEY`). Without the AI
> key the drill returns a clear "AI coach isn't configured" message; without sign-in the
> practice area shows a sign-in prompt.

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server                 |
| `npm run build`     | Production build                     |
| `npm run start`     | Serve the production build           |
| `npm run typecheck` | Type-check without emitting          |
| `npm run lint`      | Next.js lint                         |

## Project structure

```
middleware.ts                # Clerk auth middleware (attaches session to requests)
app/
  layout.tsx                 # Shell, header/footer, ClerkProvider, site-wide SEO metadata
  page.tsx                   # Course overview / landing (+ FAQ, JSON-LD)
  globals.css                # Tailwind + theme
  sitemap.ts / robots.ts     # /sitemap.xml and /robots.txt for search engines
  modules/[slug]/page.tsx    # Lesson + examples + tier/level-gated drills for one module
  guides/                    # Public editorial guides hub (index + article pages)
  pricing/page.tsx           # Plans, per-level checkout, upgrade/cancel/resume UI
  progress/page.tsx          # Per-user "my progress" dashboard (signed-in, noindex)
  api/feedback/route.ts      # POST: grades a written response (gated + metered)
  api/speak/route.ts         # POST: grades a spoken recording (Gemini audio)
  api/usage/route.ts         # GET: the signed-in user's plan + AI-allowance summary
  api/billing/               # Stripe: checkout, webhook, sync, preview, cancel
  api/clerk/webhook/route.ts # Cancels Stripe subs when a Clerk account is deleted
components/
  DrillPractice.tsx          # Speak/Write toggle (speak-first) + feedback panels
  ModuleDrills.tsx           # Level switcher + per-tier drill gating on a module
  SpeakPractice.tsx          # Record audio → spoken delivery feedback
  SpeakButton.tsx            # Text-to-speech "Listen" button (Web Speech API)
  ScoreBar.tsx               # Per-dimension score bar
  JsonLd.tsx                 # JSON-LD structured-data emitter
lib/
  types.ts                   # Shared domain + feedback types
  course.ts                  # Course content assembly (modules + merged drill banks)
  drills-extra/early/mid.ts  # Drill banks per career level (25 per module each)
  levels.ts                  # Career levels (early / mid / senior) + helpers
  tiers.ts                   # Subscription tiers, prices, per-module drill counts
  entitlements.ts            # Server-authoritative tier/level resolution + comp accounts
  limits.ts                  # Per-user annual AI-spend allowance (metering + gate)
  practiced.ts               # Server-side practiced-drill bitset
  stripe.ts / billing.ts     # Stripe client + subscription→entitlement mapping
  guides.ts                  # Editorial guide content (/guides)
  site.ts                    # Canonical site URL + support email
  prompt.ts                  # Provider-agnostic prompts (written + spoken)
  feedback.ts                # Provider dispatch + score normalization
  providers/
    gemini.ts                # Google Gemini backend (free; text + audio)
    claude.ts                # Anthropic Claude backend (paid; text)
```

## Extending the course

Course content is plain data. To add a module, append a `Module` object to `MODULES` in
`lib/course.ts`. To add a drill, append a `Drill` to the right career-level bank —
`lib/drills-extra.ts` (senior), `lib/drills-early.ts`, or `lib/drills-mid.ts` — keyed by
module slug; order within an array is the tier unlock order, so **append** (don't
reorder or rename ids — the practiced-drill bitset indexes by position). The rubric,
prompt, gating, and feedback UI all adapt automatically. Guides are the same idea in
`lib/guides.ts`.

## Notes

- Feedback is AI-generated practice, not authoritative judgment. Treat the rewrite as a
  worked example, not the only correct answer.
- Drill responses and recordings are sent to the AI provider for grading and are not
  stored. What *is* persisted (in Clerk user metadata): practice progress and scores,
  the subscription plan, the practiced-drill record, and the AI-allowance meter.
