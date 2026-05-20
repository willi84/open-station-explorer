/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'db-red': '#CC0000',
        'db-red-dark': '#AA0000',
        'db-red-light': '#FF3333',
      }
    },
  },
  plugins: [],
}
