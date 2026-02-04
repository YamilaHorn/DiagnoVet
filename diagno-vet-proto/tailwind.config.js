/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9f9',
          100: '#d9f2f1',
          200: '#b5e5e3',
          300: '#82d0cd',
          400: '#4db5b1',
          500: '#2FB8B3', // Tu color principal
          600: '#25918d', // Hover
          700: '#217673',
          800: '#1f5f5d',
          900: '#1d4f4d',
        },
      },
    },
  },
  plugins: [],
}