import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@/components/auth";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import AllowanceMeter from "@/components/AllowanceMeter";
import LevelChip from "@/components/LevelChip";
import { SUPPORT_MAILTO } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: "iArticulate — Executive Communication & Clarity",
  description:
    "An articulation training course with AI coaching. Practice executive communication and get specific, rubric-based feedback on clarity, concision, structure, precision, and presence.",
  manifest: "/manifest.webmanifest",
  // Makes an iPad "Add to Home Screen" install launch full-screen as a
  // standalone app rather than inside Safari.
  appleWebApp: {
    capable: true,
    title: "iArticulate",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#6b6ed4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shell = (
    <html lang="en">
        <body className="bg-grain min-h-screen font-sans antialiased">
          <header className="border-b border-ink/10">
            <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
              <Link href="/" className="group flex items-baseline gap-2">
                <span className="font-serif text-xl font-semibold tracking-tight">
                  iArticulate
                  <sup className="ml-0.5 align-super text-[0.5em] font-normal">™</sup>
                </span>
                <span className="hidden text-xs uppercase tracking-widest text-ink-mute sm:inline">
                  clarity training
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/#modules"
                  className="text-sm text-ink-mute transition-colors hover:text-accent"
                >
                  Modules
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm text-ink-mute transition-colors hover:text-accent"
                >
                  Plans
                </Link>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-sm text-ink-soft transition-colors hover:text-accent">
                      Sign in
                    </button>
                  </SignInButton>
                  {/* Send sign-up through the plans page first, so people choose
                      a plan (or Free) before creating an account. */}
                  <Link
                    href="/pricing"
                    className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    Sign up
                  </Link>
                </SignedOut>
                <SignedIn>
                  <LevelChip />
                  <AllowanceMeter />
                  <Link
                    href="/progress"
                    className="text-sm text-ink-mute transition-colors hover:text-accent"
                  >
                    My progress
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
          <footer className="border-t border-ink/10">
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-xs text-ink-mute">
              <span>
                iArticulate™ · AI-coached practice for executive communication. Feedback
                is AI-generated and meant as practice, not gospel.
              </span>
              <a href={SUPPORT_MAILTO} className="whitespace-nowrap transition-colors hover:text-accent">
                Contact support
              </a>
            </div>
          </footer>
        </body>
      </html>
  );

  // Only mount ClerkProvider when Clerk is configured; without a publishable key
  // it throws during render. When unconfigured the app runs auth-disabled.
  // The localization override forces the sign-in modal title to our brand
  // instead of Clerk's application name (which is still "LifeOS" upstream).
  return CLERK_ENABLED ? (
    <ClerkProvider
      localization={{
        signIn: { start: { title: "Sign in to iArticulate™" } },
      }}
    >
      {shell}
    </ClerkProvider>
  ) : shell;
}
