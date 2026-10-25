/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#1e3a5f',
          dark: '#0f2743',
          hover: '#2c4d75',
          bg: '#f5f7fa',
          border: '#d1d5db',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '2px',
      }
    },
  },
  plugins: [],
}
