/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        bg: 'var(--color-bg)',
        text: 'var(--color-text)',
        border: 'var(--color-border)',
        button: 'var(--color-button)',
        buttonHover: 'var(--color-button-hover)',
      },
    },
  },
  plugins: [],
};
