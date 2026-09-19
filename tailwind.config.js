/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1210",
          panel: "#151A17",
          panel2: "#1B211D",
          border: "#293029",
        },
        paper: {
          DEFAULT: "#EDEFEA",
          dim: "#9AA39B",
          faint: "#6E766F",
        },
        cash: {
          DEFAULT: "#4C9A6A",
          bright: "#6ABE86",
          deep: "#356E4A",
        },
        gold: {
          DEFAULT: "#E0AE49",
          bright: "#F0C568",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "6px",
      },
      backgroundImage: {
        ledger:
          "repeating-linear-gradient(to bottom, rgba(237,239,234,0.035) 0px, rgba(237,239,234,0.035) 1px, transparent 1px, transparent 42px)",
      },
    },
  },
  plugins: [],
};
