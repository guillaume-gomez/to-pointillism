// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
         'img': `linear-gradient(to right top, #acacacAF, #9ea1a6AF, #8c97a0AF, #778e98AF, #61858bAF), url(./background.png)`,
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
}