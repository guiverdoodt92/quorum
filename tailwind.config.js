/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          elevated: '#2a2a2a',
          border: '#3a3a3a',
          hover: '#252525',
        },
        orange: {
          primary: '#ff6b35',
          light: '#ff8c61',
          dark: '#e85a2a',
          glow: '#ff6b3540',
        },
      },
      boxShadow: {
        'orange-glow': '0 0 20px rgba(255, 107, 53, 0.3)',
        'orange-glow-lg': '0 0 40px rgba(255, 107, 53, 0.4)',
      },
    },
  },
  plugins: [],
};
