import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@/components/auth";
import { ProgressDashboard } from "@/components/ProgressDashboard";

export const metadata = {
  title: "My progress · Articulate",
  description: "Your practiced drills and scores.",
};

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/#modules"
          className="text-sm text-ink-mute transition-colors hover:text-accent"
        >
          ← All modules
        </Link>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
          My progress
        </h1>
        <p className="mt-1 text-ink-soft">
          Your practiced drills and best scores across the course.
        </p>
      </div>

      <SignedIn>
        <ProgressDashboard />
      </SignedIn>
      <SignedOut>
        <div className="rounded-xl border border-ink/10 bg-white/60 p-8 text-center">
          <p className="font-serif text-lg">Sign in to see your progress.</p>
          <div className="mt-5 flex justify-center gap-3">
            <SignUpButton mode="modal">
              <button className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5">
                Sign up free
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="rounded-md border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent">
                Sign in
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
