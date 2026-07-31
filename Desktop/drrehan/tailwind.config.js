/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A6E79',
        secondary: '#1A8A9E',
        accent: '#F4A261',
        dark: '#1E293B',
        light: '#F8FAFC',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
