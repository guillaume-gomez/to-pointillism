// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
         'img': `linear-gradient(to right top, #acacacAA, #9ea1a6AA, #8c97a0AA, #778e98AA, #61858bAA), url(./background.png)`,
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
}