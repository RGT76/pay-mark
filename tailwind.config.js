/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#ff5252',
          light: '#ff867f',
          dark: '#c50e29',
        },
      },
    },
  },
  plugins: [],
  important: true,
}