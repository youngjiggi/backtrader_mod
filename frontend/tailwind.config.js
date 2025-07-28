/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cyan accent colors
        accent: {
          light: '#0099cc',
          dark: '#00d4ff',
        },
        // Glacier blue highlight colors  
        highlight: {
          light: '#4682b4',
          dark: '#87ceeb',
        },
        // Custom dark theme
        dark: {
          bg: '#0a0a0b',
          surface: '#1a1a1b',
          border: '#333333',
        }
      }
    },
  },
  plugins: [],
}