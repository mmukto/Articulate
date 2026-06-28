import type { MetadataRoute } from "next";

// Web App Manifest — makes the site installable as a standalone app
// (e.g. iPad "Add to Home Screen" launches it full-screen, no browser chrome).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "iArticulate — Clarity Training",
    short_name: "iArticulate",
    description:
      "AI-coached practice for executive communication and clarity. Lessons, drills, and instant rubric-based feedback.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f8fa",
    theme_color: "#2a6098",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
