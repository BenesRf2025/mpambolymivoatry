/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#2D5A27',
          greenDark: '#1E3F1A',
          cream: '#FDFBF7',
          beige: '#E8E4D9',
          beigeDark: '#D7D3C6',
          border: '#C4BFB1',
          brown: '#4A3728',
          brownLight: '#8B7E66',
        },
      },
    },
  },
  plugins: [],
};
