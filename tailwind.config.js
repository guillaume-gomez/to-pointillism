// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      /*colors: {
        primary: "#93C5FD",
        secondary: "#EF4444",
        neutral: "grey"
      },*/
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
}