/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#065A82',
        secondary: '#1E2761',
        accent: '#0891B2',
        bg: '#F6F8FB',
        card: '#FFFFFF',
        'text-primary': '#1A1F36',
        'text-secondary': '#3A4560',
        'text-muted': '#8896A7',
        border: '#E2E8F0',
        success: '#10B981',
        error: '#EF4444',
        sky: '#E8F4FD',
        ice: '#CADCFC',
      },
    },
  },
  plugins: [],
}
