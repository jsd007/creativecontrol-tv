import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#070706",
        ink: "#10100e",
        paper: "#efe6d6",
        bone: "#e6ddd0",
        dust: "#b8b29f",
        leader: "#d4b66a",
        signal: "#b83a2f",
        chicago: "#e8c36a",
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
