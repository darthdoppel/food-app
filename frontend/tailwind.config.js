/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}
