/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af',
          light: '#3b82f6',
          dark: '#1e3a8a'
        },
        secondary: {
          DEFAULT: '#64748b',
          light: '#94a3b8'
        },
        background: {
          DEFAULT: '#f8fafc',
          light: '#f1f5f9'
        }
      }
    },
  },
  plugins: [],
}