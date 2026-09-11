/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10221f',
        forest: '#0f6b57',
        mint: '#d8f1e9',
        cream: '#f5f4ed',
        coral: '#e96b4b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Georgia', 'serif'],
      },
      boxShadow: { card: '0 18px 50px -28px rgba(7, 46, 38, .42)' },
    },
  },
  plugins: [],
}
