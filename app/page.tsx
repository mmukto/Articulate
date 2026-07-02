import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@/components/auth";
import { MODULES, DIMENSIONS, ALL_DRILL_KEYS } from "@/lib/course";
import { CourseProgress } from "@/components/CourseProgress";
import { ModuleProgressBadge } from "@/components/ModuleProgressBadge";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

// Questions people actually type into search. Rendered visibly (below) and
// mirrored into FAQPage structured data for rich-result eligibility.
// Smooth hue ramp (brand violet → teal) used to color-code the module and
// guide cards. Constant saturation/lightness across the ramp keeps the ten
// colors reading as one calm palette rather than a rainbow.
const rampHue = (i: number, step = 12) => 245 - i * step;
const rampBadge = (i: number, step = 12) => ({
  backgroundColor: `hsl(${rampHue(i, step)} 60% 93%)`,
  color: `hsl(${rampHue(i, step)} 48% 42%)`,
});
const rampBar = (i: number, step = 12) => ({
  borderLeftColor: `hsl(${rampHue(i, step)} 50% 62%)`,
});

const HOME_FAQ = [
  {
    q: "What is iArticulate?",
    a: "iArticulate is an articulation training course with an AI coach. You read short lessons on executive communication, then answer realistic drills by speaking aloud or writing, and get scored against a clarity rubric with a stronger rewrite of your own words. It trains both spoken and written articulation.",
  },
  {
    q: "Can you actually learn to be more articulate?",
    a: "Yes. Being articulate is mostly about structure — leading with your point, grouping support, and cutting filler — not innate talent. Those are habits you build with practice and specific feedback, which is exactly what the drills provide.",
  },
  {
    q: "How does the AI coaching work?",
    a: "You speak — or write — an answer to a realistic scenario. Spoken answers are transcribed and coached on delivery: pace, filler words, clarity, and enunciation, with a stronger version you can hear read aloud. Written answers are scored on six dimensions: clarity, concision, structure, precision, audience, and impact. Either way you get specific fixes and a stronger rewrite, and can revise and re-score as many times as you like.",
  },
  {
    q: "Is there a free version?",
    a: "Yes. A free account unlocks the first three modules with one AI-coached drill each, at your chosen career level. Paid plans unlock more drills across all ten modules.",
  },
];

export default function HomePage() {
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "iArticulate",
    url: `${SITE_URL}/`,
    description:
      "An articulation training course with AI coaching for executive communication and clarity.",
  };

  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "iArticulate — Executive Communication & Clarity",
    description:
      "A ten-module course that trains clear, articulate communication with short lessons and AI-coached drills scored against a clarity rubric.",
    url: `${SITE_URL}/`,
    provider: { "@type": "Organization", name: "iArticulate", url: `${SITE_URL}/` },
    hasCourseInstance: MODULES.map((m) => ({
      "@type": "CourseInstance",
      name: `${m.number}. ${m.title}`,
      description: m.tagline,
      courseMode: "online",
      url: `${SITE_URL}/modules/${m.slug}`,
    })),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="space-y-16">
      <JsonLd data={organizationLd} />
      <JsonLd data={courseLd} />
      <JsonLd data={faqLd} />
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
          <span className="font-medium text-ink">
            Become more articulate — in meetings and in writing.
          </span>{" "}
          Speak your answer to a realistic workplace scenario, or write it. Your AI
          communication coach scores it against an executive-level rubric, shows you
          exactly what to fix, and reads the stronger version aloud — so you hear how
          it should sound before it matters.
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
          Every answer is scored on each dimension, with specific notes — the rubric a
          sharp editor would use.
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
          Modules
        </h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Ten modules. Each pairs a short lesson and before/after examples with a deep
          bank of AI-coached drills, written for{" "}
          <span className="font-medium text-ink">three career levels — Early, Mid, and
          Executive</span> — so every scenario meets you where you work. Pick your level
          when you join; change it anytime. Go in order, or straight to a weak spot.
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
            to try the first three modules free — one AI-coached drill each, at your level.
          </p>
        </SignedOut>
        <ol className="mt-6 space-y-3">
          {MODULES.map((m, i) => (
            <li key={m.slug}>
              <Link
                href={`/modules/${m.slug}`}
                className="group flex items-start gap-4 rounded-lg border border-ink/10 border-l-4 bg-white/40 p-5 transition-colors hover:bg-accent-wash/40"
                style={rampBar(i)}
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-lg font-semibold"
                  style={rampBadge(i)}
                >
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
              t: "Speak — or write — your answer",
              b: "Record yourself answering a realistic scenario and get coached on pace, fillers, and delivery — or type it out instead.",
            },
            {
              n: "3",
              t: "Get coached",
              b: "Scores per dimension, specific fixes, a stronger rewrite of your own words — and a 'Hear it' button that reads it aloud.",
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

      {/* Guides teaser */}
      <section>
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Start with a free guide
        </h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Prefer to read first? Our guides cover the core principles — no account needed.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { slug: "how-to-be-more-articulate", t: "How to be more articulate" },
            { slug: "bluf-bottom-line-up-front", t: "The BLUF method" },
            { slug: "cut-filler-words", t: "Cut filler words" },
          ].map((g, i) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group rounded-lg border border-ink/10 border-l-4 bg-white/40 p-4 transition-colors hover:bg-accent-wash/40"
              style={rampBar(i, 36)}
            >
              <span className="font-serif font-semibold group-hover:text-accent">
                {g.t}
              </span>
              <span
                className="mt-1 block text-sm font-medium"
                style={{ color: `hsl(${rampHue(i, 36)} 45% 45%)` }}
              >
                Read the guide →
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm">
          <Link href="/guides" className="font-medium text-accent hover:underline">
            Browse all guides
          </Link>
        </p>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Common questions
        </h2>
        <div className="mt-6 space-y-4">
          {HOME_FAQ.map((f) => (
            <div key={f.q} className="rounded-lg border border-ink/10 bg-white/50 p-5">
              <h3 className="font-medium">{f.q}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
