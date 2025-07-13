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
        'button-indigo': '#4F46E5',
        'promo-lilac': '#A855F7',
        'price-lilac-light': '#F5F3FF',
        'price-lilac-dark': '#6D28D9',
        'launch-green': '#10B981',
        'bestseller-amber': '#F59E0B',
        purple: {
          500: '#9333ea',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
