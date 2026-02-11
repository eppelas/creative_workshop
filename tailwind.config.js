/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        swiss: {
          white: '#FFFFFF',
          black: '#171717',
          red: '#DC2626',
          gray: '#D4D4D4',
          muted: '#737373',
        },
      }
    },
  },
  plugins: [],
}
