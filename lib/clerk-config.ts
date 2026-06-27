// Auth (Clerk) is optional. When the publishable key isn't configured, the app
// runs in a local-only "guest" mode: every page works, drills are practiceable,
// and progress is kept in localStorage instead of synced to a Clerk account.
//
// `NEXT_PUBLIC_*` env vars are inlined at build time, so this constant is safe to
// read from server components, client components, route handlers, and middleware.
export const CLERK_ENABLED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
