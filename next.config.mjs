// Baseline security headers applied to every response. CSP is intentionally
// omitted here (Clerk + Stripe need careful allowlisting — add it after testing);
// microphone is allowed for `self` because the spoken-practice feature uses the
// mic. These are defense-in-depth on top of Clerk's httpOnly/SameSite cookies.
const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Build to Next.js's default `.next`. The Vercel project's "Output Directory"
  // is left at the framework default, so no `distDir` override is needed here.
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
