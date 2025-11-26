/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#290ea0",
        "background-light": "#f6f6f8",
        "background-dark": "#141022",
        "secondary-light": "#F0F4F8",
        "secondary-dark": "#201a38",
        "text-light": "#333333",
        "text-dark": "#e0e0e0",
        "text-muted-light": "#6b7280",
        "text-muted-dark": "#a29db9",
      },
      fontFamily: {
        "display": ["'Noto Serif'", "serif"],
        "sans": ["'Noto Sans'", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      }
    },
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
