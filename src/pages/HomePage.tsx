import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ManualRecord } from '../lib/db'
import { useDatabase } from '../hooks/useDatabase'

export default function HomePage() {
  const navigate = useNavigate()
  const { getRecentManuals } = useDatabase()
  const [recent, setRecent] = useState<ManualRecord[]>([])

  useEffect(() => {
    getRecentManuals(5).then(setRecent)
  }, [getRecentManuals])

  return (
    <div className="p-5">
      {/* Hero */}
      <div className="text-center py-10 pb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl text-white font-black shadow-[0_8px_24px_rgba(8,145,178,0.3)]">
          M
        </div>
        <h2 className="text-[22px] font-black text-secondary mb-2">マニュアル作成アプリ</h2>
        <p className="text-[13px] text-text-muted leading-relaxed">
          テンプレートを選んで、写真とテキストで<br />業務マニュアルを簡単に作成
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={() => navigate('/industry')}
          className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-[15px] font-bold bg-gradient-to-br from-primary to-accent text-white shadow-[0_4px_16px_rgba(8,145,178,0.3)] hover:translate-y-[-1px] hover:shadow-[0_6px_20px_rgba(8,145,178,0.4)] tap-feedback transition-all cursor-pointer border-none"
        >
          <span className="text-xl">＋</span> 新規作成
        </button>
        <button
          onClick={() => navigate('/files')}
          className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-[15px] font-bold bg-white text-primary border-2 border-border hover:border-accent hover:bg-sky tap-feedback transition-all cursor-pointer"
        >
          <span className="text-xl">📂</span> ファイル読み込み
        </button>
      </div>

      {/* Recent files */}
      {recent.length > 0 && (
        <div className="mt-8">
          <p className="text-[13px] font-bold text-text-muted uppercase tracking-[2px] mb-3">最近のファイル</p>
          <div className="flex flex-col gap-2">
            {recent.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(`/editor/${m.id}`)}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border shadow-[0_2px_12px_rgba(30,39,97,0.08)] hover:border-accent hover:shadow-[0_8px_32px_rgba(30,39,97,0.12)] transition-all cursor-pointer tap-feedback text-left w-full"
              >
                {m.thumbnailDataUrl ? (
                  <img src={m.thumbnailDataUrl} alt="" className="w-12 h-16 rounded-lg object-cover bg-bg" />
                ) : (
                  <div className="w-12 h-16 rounded-lg bg-bg flex items-center justify-center text-text-muted text-2xl">📄</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-text-primary truncate">{m.title || '無題のマニュアル'}</p>
                  <p className="text-[11px] text-text-muted mt-1">
                    {new Date(m.updatedAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <span className="text-text-muted text-lg">›</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
