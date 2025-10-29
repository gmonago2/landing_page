/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#457B9D',
          green: '#87ae73',
          cream: '#eae6e3',
          yellow: '#f4e98c',
        }
      }
    },
  },
  plugins: [],
};
