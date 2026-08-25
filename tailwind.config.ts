import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16213E",
        sand: "#FBF8F2",
        teal: {
          DEFAULT: "#2D5F5D",
          dark: "#1E4442",
          light: "#E4EEED",
        },
        gold: "#C9932A",
        clay: "#B8532E",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sm: "3px",
      },
    },
  },
  plugins: [],
};
export default config;
