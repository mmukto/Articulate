import Link from "next/link";
import { notFound } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@/components/auth";
import { MODULES, MODULE_MAP } from "@/lib/course";
import { ModuleDrills } from "@/components/ModuleDrills";
import { getCurrentEntitlements } from "@/lib/entitlements";
import { drillsPerModule, FREE_DRILLS_PER_MODULE, FREE_MODULE_LIMIT } from "@/lib/tiers";

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const module = MODULE_MAP[params.slug];
  // The root layout's title template appends "· iArticulate", so titles here are
  // the bare page name. Each module gets a canonical URL for clean indexing.
  if (!module) return { title: "Module not found" };
  return {
    title: `${module.number}. ${module.title}`,
    description: module.tagline,
    alternates: { canonical: `/modules/${module.slug}` },
    openGraph: {
      title: `${module.number}. ${module.title} · iArticulate`,
      description: module.tagline,
      url: `/modules/${module.slug}`,
    },
  };
}

export default async function ModulePage({ params }: { params: { slug: string } }) {
  const module = MODULE_MAP[params.slug];
  if (!module) notFound();

  const idx = MODULES.findIndex((m) => m.slug === module.slug);
  const prev = idx > 0 ? MODULES[idx - 1] : null;
  const next = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;

  // Pricing is per level (server-authoritative): a level the user has paid for
  // unlocks the full tier count; other levels show the Free sampler. The client
  // filters by the chosen career level and locks the rest.
  const ent = await getCurrentEntitlements();
  const tierCount = drillsPerModule(ent.tier);
  // Free sign-up (and signed-out visitors) reach only the first few modules;
  // the rest — lesson, examples, and drills — require a paid plan.
  const hasPaid = ent.comp || ent.levels.length > 0;
  const moduleLocked = !hasPaid && module.number > FREE_MODULE_LIMIT;

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

      {moduleLocked ? (
        <section className="rounded-xl border border-ink/10 bg-white/50 p-8 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-wash text-2xl">
            🔒
          </div>
          <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
            Module {module.number} is part of a paid plan
          </h2>
          <p className="mx-auto mt-2 max-w-md text-ink-soft">
            Free sign-up includes the first {FREE_MODULE_LIMIT} modules. Subscribe to unlock this
            module — the lesson, examples, and AI-coached drills — and the rest of the course.
          </p>
          <Link
            href="/pricing"
            className="mt-5 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            See plans
          </Link>
        </section>
      ) : (
        <>
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
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight">Practice</h2>
          <p className="mt-1 text-ink-soft">
            Speak your answer aloud — or write it — then get coached. Revise and re-score
            as many times as you like — iteration is the point. Every drill trains both
            your spoken and written articulation.
          </p>
        </div>
        <SignedIn>
          <ModuleDrills
            module={module}
            tierCount={tierCount}
            freeCount={FREE_DRILLS_PER_MODULE}
            tierName={ent.tier.name}
            purchasedLevels={ent.levels}
          />
        </SignedIn>
        <SignedOut>
          <div className="rounded-xl border border-ink/10 bg-white/60 p-8 text-center">
            <p className="font-serif text-lg">Sign in to practice and get AI feedback.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-ink-mute">
              Create a free account to speak or write your answers, get scored against the
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
        </>
      )}

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
