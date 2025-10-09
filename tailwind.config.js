/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#457B9D', // primary
          50: '#eaf4f8',
          100: '#d6eef3',
          200: '#addfe6',
          300: '#85cfe0',
          400: '#5ebed6',
          500: '#3aa8c0',
          600: '#2b8ea8',
          700: '#1f6f85',
          800: '#185768',
          900: '#123f4a'
        },
        mint: {
          DEFAULT: '#87ae73', // secondary
          50: '#f1f7ef',
          100: '#e3f0df',
          200: '#c6e2bf',
          300: '#a7d39f',
          400: '#89c57f',
          500: '#6da868',
          600: '#568a50',
          700: '#426b3d',
          800: '#2f4b2b',
          900: '#1b2b18'
        },
        sand: {
          DEFAULT: '#eae6e3', // neutral background
          50: '#fbfaf9',
          100: '#f6f5f4',
          200: '#efeeed',
          300: '#e7e5e4',
          400: '#e0dedd',
          500: '#d9d7d6',
          600: '#bfbcbc',
          700: '#9f9c9b',
          800: '#7f7c7b',
          900: '#626160'
        },
        gold: {
          DEFAULT: '#f4e98c', // accent
          50: '#fffaf0',
          100: '#fff5df',
          200: '#fff0bf',
          300: '#fff09a',
          400: '#fae66f',
          500: '#f2d94a',
          600: '#d4ba3a',
          700: '#a78f29',
          800: '#7c641f',
          900: '#513e14'
        }
      }
    },
  },
  plugins: [],
};
