/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'bebas-neue': ['Bebas Neue', 'system-ui', 'sans-serif'],
      },
      colors: {
        orange: {
          500: '#e64800',
        },
      },
    },
  },
  plugins: [],
}
