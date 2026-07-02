import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@/components/auth";
import { MODULES, DIMENSIONS, ALL_DRILL_KEYS } from "@/lib/course";
import { CourseProgress } from "@/components/CourseProgress";
import { ModuleProgressBadge } from "@/components/ModuleProgressBadge";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { rampBadge, rampBar, rampCard, rampText } from "@/lib/palette";
import { SpeakButton } from "@/components/SpeakButton";

// Questions people actually type into search. Rendered visibly (below) and
// mirrored into FAQPage structured data for rich-result eligibility.
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
          Say what matters.
          <br />
          <span className="italic text-accent">Clearly.</span> The first time.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          <span className="block font-medium text-ink">
            Speak like an executive — before it counts.
          </span>
          <span className="mt-2 block">
            Sound sharper in every meeting and email. Respond to realistic scenarios,
            get scored against an executive-level rubric, see precisely what to fix —
            then hear the polished version read aloud. Rehearse the moment before
            it&apos;s real.
          </span>
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
          You will be graded on six rubrics
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
                className="group flex items-start gap-4 rounded-lg border border-l-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                style={{ ...rampCard(i), ...rampBar(i) }}
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

        {/* A real drill from Module 1, worked end-to-end, so visitors see the
            coaching before they sign up. */}
        <div className="mt-8 rounded-xl border border-ink/10 bg-white/60 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-xl font-semibold tracking-tight">
              A real drill: the buried status update
            </h3>
            <span className="ml-auto flex gap-1.5">
              {["Structure", "Clarity"].map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-accent-wash px-2.5 py-0.5 text-xs font-medium text-accent"
                >
                  {f}
                </span>
              ))}
            </span>
          </div>

          <div className="mt-3 rounded-lg bg-paper p-4 text-sm leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">Scenario. </span>
            Your manager asks how the data migration is going. It&apos;s behind
            schedule — a vendor delivered a corrupted export — but your recovery plan
            gets you back on track within a week.
          </div>
          <p className="mt-3 text-sm font-medium">
            🎙 Speak your update aloud — or ✍️ write it. Two to four sentences, bottom
            line first.
          </p>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                A first attempt · scored{" "}
                <span className="font-serif text-sm font-bold text-amber-600">58</span>
              </div>
              <blockquote className="mt-1.5 rounded-lg border border-ink/10 bg-white p-4 text-sm leading-relaxed text-ink-mute">
                &ldquo;So basically the vendor sent us a corrupted export file, which we
                didn&apos;t catch right away, and the team has been working through it
                all week. We think we should be able to get things back on track fairly
                soon.&rdquo;
              </blockquote>
              <p className="mt-2 text-xs leading-relaxed text-ink-mute">
                The coach&apos;s verdict: the bottom line — a week behind, recovery in
                hand — is buried under the vendor story. Lead with it, and replace
                &ldquo;fairly soon&rdquo; with a date.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wide text-accent">
                  The coached version · scored{" "}
                  <span className="font-serif text-sm font-bold text-emerald-700">92</span>
                </div>
                <SpeakButton
                  text="We're one week behind on the migration — a vendor delivered a corrupted export. Our recovery plan has us back on track by Friday. Nothing needed from you; I'll flag it immediately if Friday slips."
                  label="Hear it"
                />
              </div>
              <blockquote className="mt-1.5 rounded-lg border-l-2 border-accent bg-paper p-4 font-serif text-[15px] leading-relaxed text-ink">
                &ldquo;We&apos;re one week behind on the migration — a vendor delivered
                a corrupted export. Our recovery plan has us back on track by Friday.
                Nothing needed from you; I&apos;ll flag it immediately if Friday
                slips.&rdquo;
              </blockquote>
              <p className="mt-2 text-xs leading-relaxed text-ink-mute">
                Status first, cause in one clause, a date instead of &ldquo;soon,&rdquo;
                and a clear no-action close.
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm">
            <Link
              href={`/modules/${MODULES[0].slug}`}
              className="font-medium text-accent hover:underline"
            >
              Practice this drill in Module 1 →
            </Link>
          </p>
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
              className="group rounded-lg border border-l-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
              style={{ ...rampCard(i, 36), ...rampBar(i, 36) }}
            >
              <span className="font-serif font-semibold group-hover:text-accent">
                {g.t}
              </span>
              <span className="mt-1 block text-sm font-medium" style={rampText(i, 36)}>
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
