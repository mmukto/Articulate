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

## Verifying changes

- `npm run typecheck` — type-checks without emitting.
- `npm run build` — full production build (works with or without Clerk keys).
