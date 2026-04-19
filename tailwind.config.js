/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Kitchen theme — 飲食店向け・親しみレシピ共有
        primary: '#EA580C',         // Orange 600 — メインブランド
        'primary-hover': '#C2410C', // Orange 700 — ホバー
        'primary-light': '#F97316', // Orange 500 — ライト
        secondary: '#9A3412',       // Orange 900 — 深いアクセント
        accent: '#84CC16',          // Lime 500 — ライム緑（野菜・ハーブ）
        'accent-soft': '#BEF264',   // Lime 300 — ライト

        bg: '#FFFBEB',              // Amber 50 — クリーム背景
        card: '#FFFFFF',
        'bg-warm': '#FFF7ED',       // Orange 50 — warm accent背景

        'text-primary': '#44403C',  // Stone 700 — 温かい茶系
        'text-secondary': '#57534E',// Stone 600
        'text-muted': '#A8A29E',    // Stone 400

        border: '#FED7AA',          // Orange 200 — 温かい境界
        'border-soft': '#FEE4CC',   // lighter border

        success: '#84CC16',         // Lime 500（テーマに合わせる）
        warning: '#F59E0B',         // Amber 500
        error: '#DC2626',           // Red 600

        // legacy aliases（既存コードとの互換性維持）
        sky: '#FFF7ED',             // → bg-warm
        ice: '#FED7AA',             // → border
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
        display: ['"Zen Kaku Gothic New"', '"Noto Sans JP"', 'sans-serif'],
        mono: ['"Inter"', 'monospace'],
      },
    },
  },
  plugins: [],
}
