/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold-primary': 'var(--gold-primary)',
        'gold-light': 'var(--gold-light)',
        'gold-pale': 'var(--gold-pale)',
        'brand-white': 'var(--white)',
        'off-white': 'var(--off-white)',
        'bg-section': 'var(--bg-section)',
        'text-dark': 'var(--text-dark)',
        'text-muted': 'var(--text-muted)',
        'border-gold': 'var(--border)',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        noto: ['Noto Sans Devanagari', 'sans-serif'],
      },
      letterSpacing: {
        wide: '0.08em',
      },
    },
  },
  plugins: [],
}