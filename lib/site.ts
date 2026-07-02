// Site-wide constants. Centralized so the support address (and similar) live in
// one place. Safe to import from client and server components.

export const SUPPORT_EMAIL = "support@iarticulate.ca";
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`;

// Canonical production origin. Used as the metadataBase so Open Graph, canonical,
// and sitemap URLs resolve to absolute https://iarticulate.ca links. No trailing
// slash. Override with NEXT_PUBLIC_SITE_URL for preview/staging if ever needed.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://iarticulate.ca"
).replace(/\/$/, "");
