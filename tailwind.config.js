/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
