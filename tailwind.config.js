/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#0f1419",
          elevated: "#1a222d",
          border: "#2a3544",
        },
        accent: {
          DEFAULT: "#3b9eff",
          muted: "#1e3a5f",
        },
        income: "#34d399",
        expense: "#f87171",
      },
    },
  },
  plugins: [],
};
