// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#EBC238",
          "secondary": "#06031B",
          "accent": "#7586FF",
          "neutral": "#131325",
          "base-100": "#F1F1E6",
        },
      },
      "bumblebee",
    ],
  },
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
         'img': `linear-gradient(to right top, #acacacAA, #9ea1a6AA, #8c97a0AA, #778e98AA, #61858bAA), url(./assets/background.png)`,
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
}