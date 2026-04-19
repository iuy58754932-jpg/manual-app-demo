import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FolderOpen, FileText, ChevronRight } from 'lucide-react'
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
        <div className="relative w-20 h-20 mx-auto mb-5">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-light to-primary rounded-full flex items-center justify-center text-4xl text-white font-display font-black shadow-[0_8px_24px_rgba(234,88,12,0.35)]">
            M
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-full border-[3px] border-bg flex items-center justify-center text-white text-sm font-bold">
            ♥
          </div>
        </div>
        <h2 className="font-display text-[22px] font-black text-secondary mb-2">マニュアル作成アプリ</h2>
        <p className="text-[13px] text-text-muted leading-relaxed">
          撮って、書いて、チームで共有。<br />レシピと手順を一冊に。
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={() => navigate('/industry')}
          className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-full text-[15px] font-bold bg-primary text-white shadow-[0_4px_16px_rgba(234,88,12,0.3)] hover:bg-primary-hover hover:translate-y-[-1px] hover:shadow-[0_6px_20px_rgba(234,88,12,0.4)] tap-feedback transition-all cursor-pointer border-none"
        >
          <Plus size={20} strokeWidth={2.5} /> 新規作成
        </button>
        <button
          onClick={() => navigate('/files')}
          className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-full text-[15px] font-bold bg-white text-primary border-2 border-border hover:border-primary hover:bg-bg-warm tap-feedback transition-all cursor-pointer"
        >
          <FolderOpen size={20} strokeWidth={2.5} /> ファイルを開く
        </button>
      </div>

      {/* Recent files */}
      {recent.length > 0 && (
        <div className="mt-8">
          <p className="font-display text-[13px] font-bold text-text-muted uppercase tracking-[2px] mb-3">最近のファイル</p>
          <div className="flex flex-col gap-2">
            {recent.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(`/editor/${m.id}`)}
                className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-border-soft shadow-[0_2px_8px_rgba(234,88,12,0.06)] hover:border-primary hover:shadow-[0_8px_24px_rgba(234,88,12,0.12)] transition-all cursor-pointer tap-feedback text-left w-full"
              >
                {m.thumbnailDataUrl ? (
                  <img src={m.thumbnailDataUrl} alt="" className="w-12 h-16 rounded-lg object-cover bg-bg-warm" />
                ) : (
                  <div className="w-12 h-16 rounded-lg bg-bg-warm flex items-center justify-center text-primary">
                    <FileText size={22} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-text-primary truncate">{m.title || '無題のマニュアル'}</p>
                  <p className="text-[11px] text-text-muted mt-1 font-mono">
                    {new Date(m.updatedAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <ChevronRight size={18} className="text-text-muted" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
