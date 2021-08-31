// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
         'img': `url(./background.png)`,
        })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
}