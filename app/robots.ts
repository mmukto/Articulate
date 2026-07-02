import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// robots.txt served at /robots.txt. Allows crawling of public pages, blocks
// API routes and the per-user /progress dashboard, and points crawlers at the
// sitemap so they can discover every indexable page.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/progress"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
