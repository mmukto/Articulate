import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { CLERK_ENABLED } from "@/lib/clerk-config";

// Attaches Clerk auth context to every request. Routes aren't force-protected
// here — practice and the AI routes are gated in the UI and in the route
// handlers (which return 401 when there's no signed-in user).
//
// When Clerk isn't configured, clerkMiddleware() would error at request time,
// so fall back to a pass-through and let the app run auth-disabled.
export default CLERK_ENABLED ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    // Run on everything except Next internals and static files...
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp|woff2?|ttf|otf|eot|map|txt|xml|webmanifest)).*)",
    // ...and always on API routes.
    "/(api|trpc)(.*)",
  ],
};
