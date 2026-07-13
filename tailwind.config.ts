import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          "0%": {transform: "translateY(-100%)"},
          "100%": {transform: "translateY(600%)"},
        },
      },
      animation: {
        slideDown: "slideDown 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
