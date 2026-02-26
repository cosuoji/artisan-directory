/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Now 'Inter' is the default font
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
