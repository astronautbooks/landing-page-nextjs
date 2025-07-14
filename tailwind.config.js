/** @type {import('tailwindcss').Config} */
// The Montserrat font is managed via next/font in layout.js.
// The --font-montserrat variable is set automatically by Next.js.
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-montserrat)', 'system-ui', '-apple-system', 'sans-serif'],
    },
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
        'launch-green': '#10B981',
        'bestseller-amber': '#F59E0B',
        'price-theme': {
          lilac: {
            light: '#EDE9FE',
            dark: '#6D28D9',
          },
          green: {
            light: '#D1FAE5',
            dark: '#065F46',
          },
          amber: {
            light: '#FEF3C7',
            dark: '#B45309',
          },
        },
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
