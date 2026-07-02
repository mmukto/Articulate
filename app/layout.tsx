import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { ClerkProvider } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@/components/auth";
import { CLERK_ENABLED } from "@/lib/clerk-config";
import { CheckoutResume, LevelResume } from "@/components/CheckoutResume";
import { SUPPORT_MAILTO, SITE_URL } from "@/lib/site";
import "./globals.css";

const TITLE = "iArticulate — Executive Communication & Clarity";
const DESCRIPTION =
  "An articulation training course with AI coaching. Speak or write your answers to realistic drills and get rubric-based feedback — train both spoken and written executive communication.";

export const metadata: Metadata = {
  // metadataBase makes all relative Open Graph / canonical URLs resolve to
  // absolute https://iarticulate.ca links (required for valid social previews
  // and canonical tags). Child pages inherit this.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    // Child pages that set their own `title` string get "iArticulate" appended
    // automatically, so per-page titles stay branded without repeating it.
    template: "%s · iArticulate",
  },
  description: DESCRIPTION,
  applicationName: "iArticulate",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  // Default: let search engines index and follow. Per-page metadata can override
  // (e.g. the user-specific /progress page sets robots.index = false).
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: "iArticulate",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
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
                  href="/"
                  className="text-sm text-ink-mute transition-colors hover:text-accent"
                >
                  Home
                </Link>
                <Link
                  href="/#modules"
                  className="text-sm text-ink-mute transition-colors hover:text-accent"
                >
                  Modules
                </Link>
                <Link
                  href="/guides"
                  className="text-sm text-ink-mute transition-colors hover:text-accent"
                >
                  Guides
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
                      a plan (or Free) before creating an account. The #plans anchor
                      means clicking this while already on /pricing scrolls to the
                      plan chooser instead of doing nothing. */}
                  <Link
                    href="/pricing#plans"
                    className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    Sign up
                  </Link>
                </SignedOut>
                <SignedIn>
                  <CheckoutResume />
                  <LevelResume />
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
                is AI-generated and meant as practice.
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
