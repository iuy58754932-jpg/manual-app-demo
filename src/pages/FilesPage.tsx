import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDatabase } from '../hooks/useDatabase'
import { showToast } from '../components/common/Toast'

type SortKey = 'updatedAt' | 'createdAt' | 'title'

export default function FilesPage() {
  const navigate = useNavigate()
  const { manuals, loading, deleteManual, duplicateManual } = useDatabase()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt')
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null)

  const filtered = useMemo(() => {
    let list = [...manuals]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((m) => m.title.toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      if (sortKey === 'title') return a.title.localeCompare(b.title)
      if (sortKey === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
    return list
  }, [manuals, search, sortKey])

  const handleContextMenu = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.preventDefault()
    const x = 'clientX' in e ? e.clientX : e.touches[0].clientX
    const y = 'clientY' in e ? e.clientY : e.touches[0].clientY
    setContextMenu({ id, x: Math.min(x, 300), y })
  }

  const handleDelete = async (id: string) => {
    if (confirm('このマニュアルを削除しますか？')) {
      await deleteManual(id)
      showToast('削除しました')
    }
    setContextMenu(null)
  }

  const handleDuplicate = async (id: string) => {
    await duplicateManual(id)
    showToast('複製しました')
    setContextMenu(null)
  }

  return (
    <div className="p-5" onClick={() => setContextMenu(null)}>
      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="タイトルで検索..."
          className="w-full px-4 py-3 pl-10 bg-white border-[1.5px] border-border rounded-xl text-[14px] outline-none focus:border-accent transition-colors font-[inherit]"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
      </div>

      {/* Sort */}
      <div className="flex gap-2 mb-4">
        {([
          ['updatedAt', '更新日順'],
          ['createdAt', '作成日順'],
          ['title', 'タイトル順'],
        ] as [SortKey, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSortKey(key)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold border cursor-pointer tap-feedback transition-all ${
              sortKey === key
                ? 'border-accent bg-sky text-primary'
                : 'border-border bg-white text-text-muted hover:border-accent'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* File list */}
      {loading ? (
        <div className="text-center py-12 text-text-muted">読み込み中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-[14px]">{search ? '検索結果がありません' : '保存されたファイルがありません'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((m) => {
            const pages = JSON.parse(m.pages)
            return (
              <button
                key={m.id}
                onClick={() => navigate(`/editor/${m.id}`)}
                onContextMenu={(e) => handleContextMenu(e, m.id)}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border shadow-[0_2px_12px_rgba(30,39,97,0.08)] hover:border-accent hover:shadow-[0_8px_32px_rgba(30,39,97,0.12)] transition-all cursor-pointer tap-feedback text-left w-full"
              >
                {m.thumbnailDataUrl ? (
                  <img src={m.thumbnailDataUrl} alt="" className="w-14 h-18 rounded-lg object-cover bg-bg" />
                ) : (
                  <div className="w-14 h-18 rounded-lg bg-bg flex items-center justify-center text-text-muted text-2xl">📄</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-text-primary truncate">{m.title || '無題のマニュアル'}</p>
                  <p className="text-[11px] text-text-muted mt-1">
                    {new Date(m.updatedAt).toLocaleDateString('ja-JP')} · {pages.length}ページ
                  </p>
                </div>
                <span className="text-text-muted text-lg">›</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white rounded-xl shadow-[0_8px_32px_rgba(30,39,97,0.12)] border border-border overflow-hidden min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleDuplicate(contextMenu.id)}
            className="block w-full text-left px-4 py-3 text-[13px] text-text-secondary hover:bg-sky hover:text-primary cursor-pointer border-none bg-transparent font-[inherit]"
          >
            📋 複製
          </button>
          <button
            onClick={() => handleDelete(contextMenu.id)}
            className="block w-full text-left px-4 py-3 text-[13px] text-error hover:bg-red-50 cursor-pointer border-none bg-transparent font-[inherit]"
          >
            🗑 削除
          </button>
        </div>
      )}
    </div>
  )
}
