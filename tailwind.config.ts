import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#201f1e",
          soft: "#3b3a39",
          mute: "#605e5c",
        },
        paper: "#faf9f8",
        accent: {
          DEFAULT: "#6b6ed4",
          soft: "#abadea",
          wash: "#ededfb",
        },
        // Reserved strictly for errors and failing scores — keeps the red
        // "something's wrong" cue distinct from the violet brand accent.
        danger: {
          DEFAULT: "#c0322b",
          wash: "#fbe9e8",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
