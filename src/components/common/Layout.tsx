import { Outlet, useNavigate, useLocation } from 'react-router-dom'

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

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col">
      <header className="bg-gradient-to-br from-secondary to-primary text-white px-5 py-4 safe-top flex items-center gap-3 sticky top-0 z-[100] shadow-[0_4px_20px_rgba(6,90,130,0.3)]">
        {!isHome && (
          <button
            onClick={() => navigate(-1)}
            className="bg-white/15 border-none text-white w-9 h-9 rounded-[10px] text-[18px] cursor-pointer flex items-center justify-center hover:bg-white/25 transition-colors tap-feedback"
          >
            ←
          </button>
        )}
        <h1 className="text-[17px] font-bold tracking-wide">{title}</h1>
      </header>
      <main className="flex-1">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
