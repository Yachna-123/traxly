/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        surface: "#111118",
        border: "#1E1E2E",
        primary: "#6E56CF",
        "primary-hover": "#5A42B0",
        accent: "#00D4AA",
        "text-primary": "#EEEEEE",
        "text-muted": "#888899",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};