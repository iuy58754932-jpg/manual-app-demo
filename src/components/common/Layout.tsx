import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Utensils, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const TITLES: Record<string, string> = {
  '/': 'マニュアル作成',
  '/industry': '業種選択',
  '/files': 'ファイル一覧',
}

function getTitle(pathname: string): string {
  if (pathname.startsWith('/template/')) return 'テンプレート選択'
  if (pathname.startsWith('/editor')) return 'マニュアル編集'
  return TITLES[pathname] || 'マニュアル作成'
}

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const title = getTitle(location.pathname)
  const { resolved, toggle } = useTheme()

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-bg dark:bg-dark-bg transition-colors">
      <header className="bg-gradient-to-br from-primary to-primary-light dark:from-secondary dark:to-primary text-white px-5 py-4 safe-top flex items-center gap-3 sticky top-0 z-[100] shadow-[0_4px_20px_rgba(234,88,12,0.3)]">
        {!isHome ? (
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 border-none text-white w-9 h-9 rounded-[10px] cursor-pointer flex items-center justify-center hover:bg-white/30 transition-colors tap-feedback"
            aria-label="戻る"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <Utensils size={22} className="text-white/90" />
        )}
        <h1 className="font-display text-[17px] font-bold tracking-wide flex-1">{title}</h1>
        <button
          onClick={toggle}
          className="bg-white/20 border-none text-white w-9 h-9 rounded-full cursor-pointer flex items-center justify-center hover:bg-white/30 transition-all tap-feedback"
          aria-label={resolved === 'dark' ? 'ライトモードに切替' : 'ダークモードに切替'}
          title={resolved === 'dark' ? 'ライトモード' : 'ダークモード'}
        >
          {resolved === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>
      <main className="flex-1">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
