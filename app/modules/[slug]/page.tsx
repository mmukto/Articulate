import Link from "next/link";
import { notFound } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@/components/auth";
import { MODULES, MODULE_MAP } from "@/lib/course";
import { DrillPractice } from "@/components/DrillPractice";
import { getCurrentTier } from "@/lib/entitlements";
import { drillsPerModule } from "@/lib/tiers";

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const module = MODULE_MAP[params.slug];
  if (!module) return { title: "Module not found · iArticulate" };
  return {
    title: `${module.number}. ${module.title} · iArticulate`,
    description: module.tagline,
  };
}

export default async function ModulePage({ params }: { params: { slug: string } }) {
  const module = MODULE_MAP[params.slug];
  if (!module) notFound();

  const idx = MODULES.findIndex((m) => m.slug === module.slug);
  const prev = idx > 0 ? MODULES[idx - 1] : null;
  const next = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;

  // Tier-gate the drills: a plan unlocks the first N drills in each module.
  const tier = await getCurrentTier();
  const unlocked = drillsPerModule(tier);
  const unlockedDrills = module.drills.slice(0, unlocked);
  const lockedDrills = module.drills.slice(unlocked);

  return (
    <article className="space-y-12">
      {/* Header */}
      <header>
        <Link
          href="/#modules"
          className="text-sm text-ink-mute transition-colors hover:text-accent"
        >
          ← All modules
        </Link>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-serif text-sm font-semibold text-accent">
            Module {module.number}
          </span>
        </div>
        <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          {module.title}
        </h1>
        <p className="mt-2 text-lg italic text-ink-soft">{module.tagline}</p>

        <div className="mt-5 rounded-lg border border-ink/10 bg-white/50 p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
            By the end you can
          </div>
          <ul className="mt-2 space-y-1.5">
            {module.outcomes.map((o, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-soft">
                <span className="text-accent">✓</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Lesson */}
      <section className="prose-lesson">
        <p className="font-serif text-lg leading-relaxed text-ink">
          {module.lesson.summary}
        </p>

        <div className="mt-8 space-y-6">
          {module.lesson.concepts.map((c, i) => (
            <div key={i}>
              <h3 className="font-serif text-xl font-semibold tracking-tight">
                {c.heading}
              </h3>
              <p className="mt-1.5 leading-relaxed text-ink-soft">{c.body}</p>
            </div>
          ))}
        </div>

        {module.lesson.evidence ? (
          <div className="mt-8 rounded-lg border border-ink/10 bg-accent-wash/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-accent">
              Why it works — the evidence
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {module.lesson.evidence}
            </p>
          </div>
        ) : null}
      </section>

      {/* Examples */}
      {module.lesson.examples.length > 0 ? (
        <section>
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            Before &amp; after
          </h2>
          <div className="mt-5 space-y-5">
            {module.lesson.examples.map((ex, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-ink/10 bg-white/50"
              >
                <div className="grid sm:grid-cols-2">
                  <div className="border-b border-ink/10 p-4 sm:border-b-0 sm:border-r">
                    <div className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                      Before
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-mute line-through decoration-ink/20">
                      {ex.before}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-accent">
                      After
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink">{ex.after}</p>
                  </div>
                </div>
                <div className="border-t border-ink/10 bg-paper px-4 py-2.5 text-xs leading-relaxed text-ink-mute">
                  {ex.note}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Drills */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              Practice
            </h2>
            <p className="mt-1 text-ink-soft">
              Write a response, then get coached. Revise and re-score as many times as you
              like — iteration is the point.
            </p>
          </div>
          <span className="shrink-0 whitespace-nowrap text-xs text-ink-mute">
            {Math.min(unlocked, module.drills.length)} of {module.drills.length} drills
          </span>
        </div>
        <SignedIn>
          {unlockedDrills.map((drill) => (
            <DrillPractice key={drill.id} moduleSlug={module.slug} drill={drill} />
          ))}
          {lockedDrills.length > 0 ? (
            <div className="rounded-xl border border-dashed border-ink/15 bg-white/40 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span aria-hidden>🔒</span>
                {lockedDrills.length} more drill{lockedDrills.length === 1 ? "" : "s"} in
                this module
              </div>
              <ul className="mt-2 space-y-1 text-sm text-ink-mute">
                {lockedDrills.slice(0, 3).map((d) => (
                  <li key={d.id} className="truncate">
                    • {d.title}
                  </li>
                ))}
                {lockedDrills.length > 3 ? (
                  <li>• …and {lockedDrills.length - 3} more</li>
                ) : null}
              </ul>
              <p className="mt-3 text-sm text-ink-soft">
                You're on the <span className="font-medium">{tier.name}</span> plan. Upgrade
                to unlock more practice in every module.
              </p>
              <Link
                href="/pricing"
                className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                See plans
              </Link>
            </div>
          ) : null}
        </SignedIn>
        <SignedOut>
          <div className="rounded-xl border border-ink/10 bg-white/60 p-8 text-center">
            <p className="font-serif text-lg">Sign in to practice and get AI feedback.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-ink-mute">
              Create a free account to write or speak your answers, get scored against the
              rubric, and track your progress across the course.
            </p>
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
      </section>

      {/* Nav */}
      <nav className="flex items-center justify-between border-t border-ink/10 pt-6">
        {prev ? (
          <Link
            href={`/modules/${prev.slug}`}
            className="group max-w-[45%] text-sm text-ink-mute transition-colors hover:text-accent"
          >
            <span className="block text-xs uppercase tracking-wide">← Previous</span>
            <span className="font-serif font-medium group-hover:text-accent">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/modules/${next.slug}`}
            className="group max-w-[45%] text-right text-sm text-ink-mute transition-colors hover:text-accent"
          >
            <span className="block text-xs uppercase tracking-wide">Next →</span>
            <span className="font-serif font-medium group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href="/#modules"
            className="text-right text-sm text-accent hover:underline"
          >
            <span className="block text-xs uppercase tracking-wide">Done</span>
            <span className="font-serif font-medium">Back to all modules</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
