import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#080706",
        ink: "#141210",
        paper: "#f2ead9",
        bone: "#d8cfb8",
        dust: "#c2b68e",
        leader: "#d4b05a",
        signal: "#d05642",
        hold: "#d05642",
        night: "#7eaaa3",
        tungsten: "#c17a42",
        chicago: "#e2b85c",
        tape: "#2a2418",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        cond: ["var(--font-cond)", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "Helvetica Neue", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        archive: "0.22em",
      },
      boxShadow: {
        frame: "0 0 0 1px rgba(239,230,214,0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
