/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#f0f7ff',
          100: '#e0e7ff',
          600: '#4338ca',
          800: '#1e1b4b',
        },
        purple: {
          500: '#9333ea',
        },
      },
    },
  },
  plugins: [],
}
