# Articulate

An **articulation training course with AI coaching** for executive communication and
clarity. You read short, practical lessons, then practice on realistic drills — and an
AI coach (Claude) scores every response against a sharp rubric, rewrites it stronger,
and tells you exactly what to fix.

Built with Next.js (App Router) + TypeScript + Tailwind. Feedback is powered by your
choice of a **free Google Gemini** key or an Anthropic Claude key — the provider is
switchable with no code changes.

## Deploy in one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmmukto%2Fmylifeos&env=GEMINI_API_KEY&envDescription=Free%20Google%20Gemini%20API%20key%20that%20powers%20the%20AI%20coaching&envLink=https%3A%2F%2Faistudio.google.com%2Fapp%2Fapikey&project-name=articulate&repository-name=articulate)

Clicking the button clones this repo into your own Vercel account and prompts you for a
`GEMINI_API_KEY` before the first build. Get a **free** key (no credit card) at
<https://aistudio.google.com/app/apikey>. Prefer Claude instead? See
[AI provider](#ai-provider) below — set `ANTHROPIC_API_KEY` in Vercel and skip the
Gemini one.

**Use it as an app on your iPad:** once deployed, open the `*.vercel.app` URL in
**Safari**, tap **Share → Add to Home Screen**. The app is a standalone PWA, so the
home-screen icon launches full-screen with no browser chrome.

## What's inside

- **8 modules**, each with a tight lesson, before/after examples, and two AI-coached
  practice drills:
  1. Lead With the Point (BLUF)
  2. Structure That Carries (Pyramid, SCQA, PREP)
  3. Cut to the Bone (concision)
  4. Precision & Evidence
  5. Executive Presence in Words
  6. Answering Under Pressure
  7. Narrative & Persuasion
  8. Putting It Together
- **A 5-dimension rubric** — Clarity, Concision, Structure, Precision, Impact — applied
  to every response.
- **AI feedback** for each drill: an overall score, per-dimension scores with comments,
  specific strengths and fixes, a stronger rewrite of *your own words*, and a suggested
  next micro-drill.

## AI provider

The coach is **provider-switchable** — it uses whichever key is configured, with no
code changes:

| If this env var is set      | Provider used        | Cost                 |
| --------------------------- | -------------------- | -------------------- |
| `GEMINI_API_KEY`            | Google Gemini        | **Free tier**        |
| `ANTHROPIC_API_KEY`         | Anthropic Claude     | Paid                 |

If both are set, Gemini wins (free first). Force a choice with
`ARTICULATE_PROVIDER=gemini` or `ARTICULATE_PROVIDER=claude`. Override models with
`GEMINI_MODEL` (default `gemini-2.0-flash`) or `ANTHROPIC_MODEL` (default
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

### 2. Configure an API key

Copy the example env file and add **one** key:

```bash
cp .env.example .env.local
# Free option (recommended): set GEMINI_API_KEY=...
#   free key at https://aistudio.google.com/app/apikey
# Or paid: set ANTHROPIC_API_KEY=sk-ant-...
#   key at https://console.anthropic.com/
```

See [AI provider](#ai-provider) for how the switch works.

### 3. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

> The app loads and the lessons work without a key — but requesting feedback on a drill
> requires `GEMINI_API_KEY` or `ANTHROPIC_API_KEY` to be set. Without either, the drill
> returns a clear "AI coach isn't configured" message.

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
app/
  layout.tsx                 # Shell, header/footer
  page.tsx                   # Course overview / landing
  globals.css                # Tailwind + theme
  modules/[slug]/page.tsx    # Lesson + examples + drills for one module
  api/feedback/route.ts      # POST endpoint that grades a response via the active provider
components/
  DrillPractice.tsx          # Client component: write → submit → feedback
  ScoreBar.tsx               # Per-dimension score bar
lib/
  types.ts                   # Shared domain + feedback types
  course.ts                  # All course content (modules, drills, rubric)
  prompt.ts                  # Provider-agnostic system + user prompts
  feedback.ts                # Provider dispatch + score normalization
  providers/
    gemini.ts                # Google Gemini backend (free)
    claude.ts                # Anthropic Claude backend (paid)
```

## Extending the course

Course content is plain data in `lib/course.ts`. To add a module, append a `Module`
object to `MODULES`; to add a drill, add a `Drill` to a module's `drills` array. The
rubric, prompt, and feedback UI all adapt automatically — no other changes needed.

## Notes

- Feedback is AI-generated practice, not authoritative judgment. Treat the rewrite as a
  worked example, not the only correct answer.
- No data is persisted: responses are sent to the API for grading and not stored.
