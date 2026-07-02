import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@/components/auth";
import { ProgressDashboard, type ProgressModule } from "@/components/ProgressDashboard";
import { CurrentLevel } from "@/components/CurrentLevel";
import { ProfessionPicker } from "@/components/ProfessionPicker";
import { MODULES, drillsForProfession } from "@/lib/course";
import { getCurrentEntitlements } from "@/lib/entitlements";

export const metadata = {
  title: "My progress",
  description: "Your practiced drills and scores.",
  // Per-user dashboard — no value to search engines and nothing to index behind
  // auth. Explicitly keep it out of the index (overrides the layout default).
  robots: { index: false, follow: false },
};

export default async function ProgressPage() {
  // Resolve the user's profession on the server and pass only that
  // profession's drills down — the full library is thousands of drills and
  // must not be serialized to the client.
  const ent = await getCurrentEntitlements();
  const modules: ProgressModule[] = MODULES.map((m) => ({
    slug: m.slug,
    number: m.number,
    title: m.title,
    drills: drillsForProfession(m, ent.profession).map((d) => ({
      id: d.id,
      title: d.title,
    })),
  }));

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
        <div className="space-y-8">
          <section>
            <h2 className="font-serif text-xl font-semibold tracking-tight">
              Your profession &amp; career level
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Drills and AI coaching are calibrated to these. Change the level on any
              module or the Plans page.
            </p>
            <div className="mt-3 space-y-3">
              <ProfessionPicker value={ent.profession} />
              <CurrentLevel />
            </div>
          </section>
          <ProgressDashboard modules={modules} />
        </div>
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
