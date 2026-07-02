import type { MetadataRoute } from "next";
import { MODULES } from "@/lib/course";
import { SITE_URL } from "@/lib/site";

// Sitemap served at /sitemap.xml. Lists the publicly indexable routes so Google
// can discover them. Gated/user-specific routes (/progress) and API routes are
// intentionally omitted — /progress is also noindex, and robots.ts blocks /api.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    ...MODULES.map((m) => ({
      url: `${SITE_URL}/modules/${m.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
  return routes;
}
