// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}',
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
  plugins: [],
};
