import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        border: "var(--border)",
        navy: {
          DEFAULT: "#0A1628",
          soft: "#1B2A44",
        },
        sky: {
          DEFAULT: "#6BA9E0",
          deep: "#2C6FBA",
          pale: "#E8F1FB",
        },
        grade: {
          mild: "#5BA3D0",
          caution: "#F4A623",
          warning: "#E27D40",
          severe: "#D03030",
        },
      },
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 16px -4px rgba(10, 22, 40, 0.08)",
        cardHover: "0 8px 24px -4px rgba(10, 22, 40, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
