import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@/components/auth";
import { MODULES, DIMENSIONS, ALL_DRILL_KEYS } from "@/lib/course";
import { CourseProgress } from "@/components/CourseProgress";
import { ModuleProgressBadge } from "@/components/ModuleProgressBadge";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Articulation training · AI-coached
        </p>
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Say the important thing,
          <br />
          <span className="italic text-accent">clearly</span>, the first time.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          A practical course in executive communication and clarity. You read short
          lessons, then practice on realistic drills — and an AI coach scores every
          response against a sharp rubric, rewrites it stronger, and tells you exactly
          what to fix.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href={`/modules/${MODULES[0].slug}`}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Start with Module 1
          </Link>
          <Link
            href="#modules"
            className="rounded-md border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            See all 10 modules
          </Link>
        </div>
      </section>

      {/* Rubric */}
      <section>
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          You'll be graded on six things
        </h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Every response you write gets a score on each dimension, plus specific notes.
          The same rubric a strong editor would apply.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DIMENSIONS.map((d) => (
            <div
              key={d.key}
              className="rounded-lg border border-ink/10 bg-white/50 p-4"
            >
              <div className="font-serif text-lg font-semibold">{d.label}</div>
              <p className="mt-1 text-sm leading-relaxed text-ink-mute">
                {d.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="scroll-mt-20">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          The curriculum
        </h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Ten modules, each with a short lesson, before/after examples, and a deep
          bank of AI-coached practice drills. Every drill comes in{" "}
          <span className="font-medium text-ink">three career levels — Early, Mid,
          and Senior</span> — so the scenarios and coaching match where you are. Pick
          your level at sign-up (change it anytime); work through the modules in order
          or jump to a weak spot.
        </p>
        <SignedIn>
          <CourseProgress keys={ALL_DRILL_KEYS} />
        </SignedIn>
        <SignedOut>
          <p className="mt-4 text-sm text-ink-mute">
            <SignUpButton mode="modal">
              <button className="font-medium text-accent hover:underline">
                Create a free account
              </button>
            </SignUpButton>{" "}
            to practice the drills, get AI feedback, and track your progress.
          </p>
        </SignedOut>
        <ol className="mt-6 space-y-3">
          {MODULES.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/modules/${m.slug}`}
                className="group flex items-start gap-4 rounded-lg border border-ink/10 bg-white/40 p-5 transition-colors hover:border-accent/50 hover:bg-accent-wash/40"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-wash font-serif text-lg font-semibold text-accent">
                  {m.number}
                </span>
                <span className="min-w-0">
                  <span className="font-serif text-lg font-semibold tracking-tight group-hover:text-accent">
                    {m.title}
                  </span>
                  <span className="block text-sm text-ink-mute">{m.tagline}</span>
                </span>
                <span className="ml-auto hidden shrink-0 self-center text-sm text-ink-mute transition-colors group-hover:text-accent sm:block">
                  <ModuleProgressBadge
                    moduleSlug={m.slug}
                    drillIds={m.drills.map((d) => d.id)}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* How it works */}
      <section>
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          How the coaching works
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "1",
              t: "Read the lesson",
              b: "A tight concept with concrete before/after examples you can copy.",
            },
            {
              n: "2",
              t: "Write your answer",
              b: "Respond to a realistic scenario — a status update, an ask, a tough reply.",
            },
            {
              n: "3",
              t: "Get coached",
              b: "Scores per dimension, specific fixes, and a stronger rewrite of your own words.",
            },
          ].map((s) => (
            <div key={s.n} className="rounded-lg border border-ink/10 bg-white/40 p-5">
              <div className="font-serif text-2xl font-semibold text-accent">{s.n}</div>
              <div className="mt-1 font-medium">{s.t}</div>
              <p className="mt-1 text-sm leading-relaxed text-ink-mute">{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Evidence basis */}
      <section>
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Grounded in the evidence
        </h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          The techniques here aren&apos;t style opinions — they track what
          communication research and top management-communication programs actually
          teach. Each module shows the basis under &ldquo;Why it works.&rdquo;
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            {
              t: "Lead with the point",
              b: "Primacy effect — readers recall and organize around what comes first.",
            },
            {
              t: "Group into threes",
              b: "Working memory holds ~3–4 chunks, so grouped support beats long lists.",
            },
            {
              t: "Cut the words",
              b: "Concision lowers cognitive load; at the top, less is more.",
            },
            {
              t: "Be concrete",
              b: "Specifics are recalled better than abstractions (concreteness effect).",
            },
            {
              t: "Translate for the audience",
              b: "The curse of knowledge is robust — write for what the reader knows.",
            },
            {
              t: "Land the 'so what'",
              b: "What → So What → Now What turns data into a decision.",
            },
          ].map((p) => (
            <li
              key={p.t}
              className="rounded-lg border border-ink/10 bg-white/40 p-4"
            >
              <div className="font-medium">{p.t}</div>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-mute">{p.b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-ink-mute">
          Sources: MIT Sloan OpenCourseWare (Communication for Managers 15.280; Advanced
          Communication for Leaders 15.281), Harvard Business Review and HBS Online on
          concise and executive communication, and cognitive-science research on the
          primacy effect, working-memory chunking, and the curse of knowledge.
        </p>
      </section>
    </div>
  );
}
