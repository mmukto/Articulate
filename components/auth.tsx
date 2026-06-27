"use client";

// Thin wrappers around Clerk's auth components so the rest of the app doesn't
// have to know whether Clerk is configured. When it isn't (CLERK_ENABLED is
// false), there's no <ClerkProvider> in the tree, so the real Clerk components
// would throw — these fall back to sensible auth-disabled behavior instead.

import {
  SignedIn as ClerkSignedIn,
  SignedOut as ClerkSignedOut,
  SignInButton as ClerkSignInButton,
  SignUpButton as ClerkSignUpButton,
  UserButton as ClerkUserButton,
  useUser,
} from "@clerk/nextjs";
import { CLERK_ENABLED } from "@/lib/clerk-config";

/** The Clerk user object (or null/undefined while loading / signed out). */
export type MaybeClerkUser = ReturnType<typeof useUser>["user"];

// With auth disabled everyone is treated as having access, so "signed in"
// content always renders and "signed out" prompts never do.
export function SignedIn({ children }: { children: React.ReactNode }) {
  if (!CLERK_ENABLED) return <>{children}</>;
  return <ClerkSignedIn>{children}</ClerkSignedIn>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  if (!CLERK_ENABLED) return null;
  return <ClerkSignedOut>{children}</ClerkSignedOut>;
}

export function SignInButton(props: React.ComponentProps<typeof ClerkSignInButton>) {
  if (!CLERK_ENABLED) return <>{props.children}</>;
  return <ClerkSignInButton {...props} />;
}

export function SignUpButton(props: React.ComponentProps<typeof ClerkSignUpButton>) {
  if (!CLERK_ENABLED) return <>{props.children}</>;
  return <ClerkSignUpButton {...props} />;
}

export function UserButton(props: React.ComponentProps<typeof ClerkUserButton>) {
  if (!CLERK_ENABLED) return null;
  return <ClerkUserButton {...props} />;
}

/** Like Clerk's useUser(), but safe to call when Clerk isn't configured. */
export function useMaybeUser(): { user: MaybeClerkUser | null; isLoaded: boolean } {
  if (!CLERK_ENABLED) return { user: null, isLoaded: true };
  // CLERK_ENABLED is a build-time constant, so this branch is stable across
  // renders and the rules-of-hooks invariant still holds.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user, isLoaded } = useUser();
  return { user, isLoaded };
}
