import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        ink2: "#111111",
        fg: "#F5F5F5",
        muted: "#A3A3A3",
        gold: "#C9A84C",
        "gold-hi": "#D6B65A",
        line: "#2A2A2A",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: [
          "clamp(2.5rem, 1.6rem + 3.2vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        h2: [
          "clamp(1.75rem, 1.1rem + 2.2vw, 3rem)",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        body: [
          "clamp(1rem, 0.95rem + 0.2vw, 1.125rem)",
          { lineHeight: "1.6", fontWeight: "400" },
        ],
        btn: ["1rem", { letterSpacing: "0.04em", fontWeight: "500" }],
        caption: ["0.75rem", { letterSpacing: "0.18em", fontWeight: "500" }],
      },
      borderRadius: {
        DEFAULT: "4px",
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("story", 'html[data-story="on"] &');
      addVariant("nostory", 'html:not([data-story="on"]) &');
    }),
  ],
};

export default config;
