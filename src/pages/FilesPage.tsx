import { useState, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Upload } from 'lucide-react'
import { useDatabase } from '../hooks/useDatabase'
import { showToast } from '../components/common/Toast'
import EmptyState from '../components/common/EmptyState'
import { exportManualAsJson, parseManualJsonFile } from '../lib/manualIO'

type SortKey = 'updatedAt' | 'createdAt' | 'title'

function generateId(): string {
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function FilesPage() {
  const navigate = useNavigate()
  const { manuals, loading, deleteManual, duplicateManual, loadManual, saveManual } = useDatabase()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const importInputRef = useRef<HTMLInputElement>(null)

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

  const handleDelete = async (id: string) => {
    setOpenMenuId(null)
    if (confirm('このマニュアルを削除しますか？')) {
      await deleteManual(id)
      showToast('削除しました')
    }
  }

  const handleDuplicate = async (id: string) => {
    setOpenMenuId(null)
    await duplicateManual(id)
    showToast('複製しました')
  }

  const handleExport = async (id: string) => {
    setOpenMenuId(null)
    const manual = await loadManual(id)
    if (!manual) {
      showToast('マニュアルが見つかりません')
      return
    }
    try {
      exportManualAsJson(manual)
      showToast('エクスポートしました')
    } catch {
      showToast('エクスポートに失敗しました')
    }
  }

  const handleImportClick = useCallback(() => {
    importInputRef.current?.click()
  }, [])

  const handleImportFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const parsed = await parseManualJsonFile(file)
      const now = new Date()
      await saveManual({
        id: generateId(),
        title: parsed.title + ' (インポート)',
        industry: parsed.industry,
        templateId: parsed.templateId,
        pages: parsed.pages,
        thumbnailDataUrl: parsed.thumbnailDataUrl,
        createdAt: now,
        updatedAt: now,
      })
      showToast('インポートしました')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'インポートに失敗しました'
      showToast(msg)
    }
    e.target.value = ''
  }, [saveManual])

  return (
    <div className="p-5" onClick={() => setOpenMenuId(null)}>
      {/* Hidden import input */}
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFileSelected}
      />

      {/* Search + Import */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="タイトルで検索..."
            className="w-full px-4 py-3 pl-10 bg-white border-[1.5px] border-border rounded-xl text-[14px] outline-none focus:border-accent transition-colors font-[inherit]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
        </div>
        <button
          onClick={handleImportClick}
          title="JSONファイルをインポート"
          className="bg-white border-[1.5px] border-border rounded-xl px-3 text-[13px] font-bold text-primary cursor-pointer tap-feedback hover:border-accent flex items-center gap-1 shrink-0"
        >
          📥<span className="hidden sm:inline">読込</span>
        </button>
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
        search ? (
          <EmptyState
            variant="search"
            title="検索結果がありません"
            description={`「${search}」に一致するマニュアルは見つかりませんでした。`}
          >
            <button
              onClick={() => setSearch('')}
              className="bg-white dark:bg-dark-card text-primary border-2 border-border dark:border-dark-border px-4 py-2 rounded-full text-[13px] font-bold cursor-pointer tap-feedback hover:border-primary"
            >
              検索をクリア
            </button>
          </EmptyState>
        ) : (
          <EmptyState
            title="最初のマニュアルを作りましょう"
            description="テンプレートを選んで、3分でマニュアル完成。"
          >
            <button
              onClick={() => navigate('/industry')}
              className="bg-primary text-white px-5 py-2.5 rounded-full text-[13px] font-bold cursor-pointer flex items-center gap-1.5 tap-feedback hover:bg-primary-hover shadow-[0_4px_12px_rgba(234,88,12,0.25)]"
            >
              <Plus size={14} strokeWidth={2.5} /> 新規作成
            </button>
            <button
              onClick={handleImportClick}
              className="bg-white dark:bg-dark-card text-primary border-2 border-border dark:border-dark-border px-5 py-2.5 rounded-full text-[13px] font-bold cursor-pointer flex items-center gap-1.5 tap-feedback hover:border-primary"
            >
              <Upload size={14} strokeWidth={2.5} /> JSONを読込
            </button>
          </EmptyState>
        )
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((m) => {
            const pages = JSON.parse(m.pages)
            return (
              <div
                key={m.id}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border shadow-[0_2px_12px_rgba(30,39,97,0.08)] hover:border-accent hover:shadow-[0_8px_32px_rgba(30,39,97,0.12)] transition-all relative"
              >
                <button
                  onClick={() => navigate(`/editor/${m.id}`)}
                  className="flex items-center gap-3 flex-1 bg-transparent border-none cursor-pointer tap-feedback text-left min-w-0 py-1"
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
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenMenuId((prev) => (prev === m.id ? null : m.id))
                  }}
                  title="メニュー"
                  aria-label="操作メニュー"
                  className="shrink-0 w-9 h-9 rounded-lg bg-white border border-border hover:border-accent text-text-muted hover:text-accent flex items-center justify-center cursor-pointer text-[16px] tap-feedback"
                >
                  ⋯
                </button>

                {/* Dropdown menu */}
                {openMenuId === m.id && (
                  <div
                    className="absolute top-14 right-3 z-40 bg-white rounded-xl shadow-[0_8px_32px_rgba(30,39,97,0.18)] border border-border overflow-hidden min-w-[160px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleDuplicate(m.id)}
                      className="block w-full text-left px-4 py-3 text-[13px] text-text-secondary hover:bg-sky hover:text-primary cursor-pointer border-none bg-transparent font-[inherit]"
                    >
                      📋 複製
                    </button>
                    <button
                      onClick={() => handleExport(m.id)}
                      className="block w-full text-left px-4 py-3 text-[13px] text-text-secondary hover:bg-sky hover:text-primary cursor-pointer border-none bg-transparent font-[inherit]"
                    >
                      📤 エクスポート(JSON)
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="block w-full text-left px-4 py-3 text-[13px] text-error hover:bg-red-50 cursor-pointer border-none bg-transparent font-[inherit] border-t border-border"
                    >
                      🗑 削除
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
