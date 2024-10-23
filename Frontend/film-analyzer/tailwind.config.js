const {nextui} = require('@nextui-org/theme');
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/[object Object].js"
  ],
  theme: {
    extend: {
      colors: {
        'steel-gray': '#3A3F44',
        'gold': '#D5A036',
        'red-theme': '#7E1328',
      },
    },
  },
  plugins: [nextui()],
};
