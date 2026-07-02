import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Guides — Clearer Communication",
  description:
    "Practical, evidence-based guides to clearer communication: how to be more articulate, lead with the point (BLUF), and cut filler words.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Guides — Clearer Communication · iArticulate",
    description:
      "Practical, evidence-based guides to clearer communication — being articulate, BLUF, and concision.",
    url: "/guides",
  },
};

export default function GuidesIndexPage() {
  // ItemList structured data helps search engines understand this as a hub of
  // related articles.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "iArticulate communication guides",
    itemListElement: GUIDES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/guides/${g.slug}`,
      name: g.title,
    })),
  };

  return (
    <div className="space-y-10">
      <JsonLd data={itemList} />

      <header>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Guides
        </p>
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Clearer communication, one habit at a time
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Short, practical reads on the principles behind articulate communication —
          the same ones the course drills. Free to read; no account needed.
        </p>
      </header>

      <ul className="space-y-4">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guides/${g.slug}`}
              className="group block rounded-lg border border-ink/10 bg-white/40 p-6 transition-colors hover:border-accent/50 hover:bg-accent-wash/40"
            >
              <h2 className="font-serif text-xl font-semibold tracking-tight group-hover:text-accent">
                {g.title}
              </h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{g.dek}</p>
              <span className="mt-3 inline-block text-xs uppercase tracking-wide text-ink-mute">
                {g.readMinutes} min read
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="rounded-xl border border-ink/10 bg-accent-wash/40 p-8 text-center">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Reading about it only gets you so far
        </h2>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">
          The course turns these principles into reps: realistic drills, scored against a
          rubric, with a stronger rewrite of your own words every time.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Explore the course
        </Link>
      </section>
    </div>
  );
}
