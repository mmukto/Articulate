import type { Metadata } from "next";

// The pricing page is a client component ("use client"), so it can't export
// metadata itself. This server-component layout supplies SEO metadata for the
// /pricing route while rendering its children unchanged.
export const metadata: Metadata = {
  title: "Plans & Pricing",
  description:
    "Choose a plan for AI-coached articulation practice — Free, Starter, Plus, Pro, or Max. Unlock more drills across all ten modules with instant rubric-based feedback.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Plans & Pricing · iArticulate",
    description:
      "Choose a plan for AI-coached articulation practice — from a free sampler to full access across all ten modules.",
    url: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
