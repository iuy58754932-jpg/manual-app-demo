/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Kitchen theme — 飲食店向け
        primary: '#EA580C',
        'primary-hover': '#C2410C',
        'primary-light': '#F97316',
        secondary: '#9A3412',
        accent: '#84CC16',
        'accent-soft': '#BEF264',

        bg: '#FFFBEB',
        card: '#FFFFFF',
        'bg-warm': '#FFF7ED',

        'text-primary': '#44403C',
        'text-secondary': '#57534E',
        'text-muted': '#A8A29E',

        border: '#FED7AA',
        'border-soft': '#FEE4CC',

        success: '#84CC16',
        warning: '#F59E0B',
        error: '#DC2626',

        sky: '#FFF7ED',
        ice: '#FED7AA',

        // Dark mode palette (Kitchen Dark)
        'dark-bg': '#1C1410',          // Very dark brown (coffee)
        'dark-card': '#2B201A',        // Dark brown card
        'dark-card-alt': '#3A2B22',    // Slightly lighter
        'dark-border': '#44332A',
        'dark-text': '#FEF3C7',        // Warm cream text
        'dark-text-muted': '#A8A29E',
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
        display: ['"Zen Kaku Gothic New"', '"Noto Sans JP"', 'sans-serif'],
        mono: ['"Inter"', 'monospace'],
      },
      keyframes: {
        'check-draw': {
          '0%': { strokeDashoffset: '50' },
          '100%': { strokeDashoffset: '0' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'check-draw': 'check-draw 0.5s ease-out forwards',
        'pop-in': 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.25s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
