import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, GUIDE_MAP } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const guide = GUIDE_MAP[params.slug];
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: `${guide.title} · iArticulate`,
      description: guide.description,
      url: `/guides/${guide.slug}`,
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
    },
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = GUIDE_MAP[params.slug];
  if (!guide) notFound();

  const url = `${SITE_URL}/guides/${guide.slug}`;

  // Article structured data — lets Google treat this as a proper article with
  // a headline, dates, and publisher.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.datePublished,
    dateModified: guide.dateModified,
    author: { "@type": "Organization", name: "iArticulate" },
    publisher: { "@type": "Organization", name: "iArticulate" },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  // Breadcrumb trail (Home → Guides → this guide).
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: url },
    ],
  };

  // FAQ structured data — eligible for FAQ rich results in search.
  const faqLd = guide.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <article className="space-y-10">
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      {faqLd ? <JsonLd data={faqLd} /> : null}

      <header>
        <Link
          href="/guides"
          className="text-sm text-ink-mute transition-colors hover:text-accent"
        >
          ← All guides
        </Link>
        <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-3 text-lg italic text-ink-soft">{guide.dek}</p>
        <p className="mt-3 text-xs uppercase tracking-wide text-ink-mute">
          {guide.readMinutes} min read
        </p>
      </header>

      <div className="prose-lesson space-y-8">
        {guide.sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              {s.heading}
            </h2>
            {s.body.map((p, j) => (
              <p key={j} className="mt-3 leading-relaxed">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      {guide.faq?.length ? (
        <section>
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            Frequently asked
          </h2>
          <div className="mt-5 space-y-4">
            {guide.faq.map((f, i) => (
              <div key={i} className="rounded-lg border border-ink/10 bg-white/50 p-5">
                <h3 className="font-medium">{f.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-ink/10 bg-accent-wash/40 p-8 text-center">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Now practice it
        </h2>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">
          {guide.relatedModuleLabel
            ? `Turn this into a habit with AI-coached drills in the “${guide.relatedModuleLabel}” module.`
            : "Turn these principles into habits with AI-coached drills."}
        </p>
        <Link
          href={
            guide.relatedModuleSlug
              ? `/modules/${guide.relatedModuleSlug}`
              : "/"
          }
          className="mt-5 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
        >
          {guide.relatedModuleLabel ? `Practice: ${guide.relatedModuleLabel}` : "Explore the course"}
        </Link>
      </section>
    </article>
  );
}
