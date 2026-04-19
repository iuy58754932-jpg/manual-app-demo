import { useState, useRef, useEffect } from 'react'
import {
  Camera, ImageIcon, Type, Mic, QrCode, PenTool,
  ZoomIn, ZoomOut, Undo2, Redo2, Trash2, Plus, Pencil, X,
} from 'lucide-react'

interface ToolbarProps {
  onAddPhoto: () => void
  onAddEditedPhoto: () => void
  onEditSelectedImage: () => void
  onAddText: () => void
  onAddVoiceText: () => void
  onAddQr: () => void
  onToggleDraw: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onUndo: () => void
  onRedo: () => void
  onDelete: () => void
  canUndo: boolean
  canRedo: boolean
  imageSelected: boolean
  drawingMode: boolean
}

export default function Toolbar({
  onAddPhoto, onAddEditedPhoto, onEditSelectedImage, onAddText, onAddVoiceText, onAddQr, onToggleDraw,
  onZoomIn, onZoomOut, onUndo, onRedo, onDelete,
  canUndo, canRedo, imageSelected, drawingMode,
}: ToolbarProps) {
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside tap
  useEffect(() => {
    if (!addMenuOpen) return
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAddMenuOpen(false)
      }
    }
    const t = setTimeout(() => document.addEventListener('click', close), 100)
    return () => { clearTimeout(t); document.removeEventListener('click', close) }
  }, [addMenuOpen])

  const invoke = (fn: () => void) => () => {
    fn()
    setAddMenuOpen(false)
  }

  const btnBase = 'shrink-0 flex items-center justify-center rounded-full cursor-pointer transition-all tap-feedback disabled:opacity-30 disabled:cursor-default'
  const iconBtn = `${btnBase} w-11 h-11 bg-white dark:bg-dark-card text-primary border border-border dark:border-dark-border hover:border-primary hover:bg-bg-warm dark:hover:bg-dark-card-alt`
  const activeBtn = `${btnBase} w-11 h-11 bg-primary text-white shadow-[0_4px_12px_rgba(234,88,12,0.35)]`

  const menuItems = [
    { icon: Camera, label: '写真', color: '#EA580C', onClick: invoke(onAddPhoto) },
    { icon: Camera, label: '編集して追加', color: '#F97316', badge: Plus, onClick: invoke(onAddEditedPhoto) },
    { icon: ImageIcon, label: '画像を編集', color: '#9A3412', disabled: !imageSelected, badge: Pencil, onClick: invoke(onEditSelectedImage) },
    { icon: Type, label: 'テキスト', color: '#EA580C', onClick: invoke(onAddText) },
    { icon: Mic, label: '音声入力', color: '#DC2626', onClick: invoke(onAddVoiceText) },
    { icon: QrCode, label: 'QRコード', color: '#84CC16', onClick: invoke(onAddQr) },
  ]

  return (
    <>
      {/* Backdrop when menu is open */}
      {addMenuOpen && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-[2px] z-[50] animate-fade-in" aria-hidden />
      )}

      {/* Floating toolbar */}
      <div
        ref={menuRef}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[60] safe-bottom pointer-events-none"
      >
        {/* Expand menu (fan) */}
        {addMenuOpen && (
          <div className="pointer-events-auto px-4 pb-3">
            <div className="bg-white dark:bg-dark-card rounded-3xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-border-soft dark:border-dark-border">
              <p className="font-display text-[11px] font-bold text-text-muted dark:text-dark-text-muted text-center mb-2 tracking-wider">
                追加するもの
              </p>
              <div className="grid grid-cols-3 gap-2 expand-fan">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const Badge = item.badge
                  return (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-bg-warm dark:bg-dark-card-alt hover:bg-border dark:hover:bg-dark-border transition-all tap-feedback disabled:opacity-30 disabled:cursor-default border-none cursor-pointer"
                    >
                      <div className="relative">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{ background: item.color }}
                        >
                          <Icon size={20} strokeWidth={2.2} />
                        </div>
                        {Badge && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center text-white border-2 border-white dark:border-dark-card">
                            <Badge size={9} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-text-primary dark:text-dark-text leading-tight">
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main toolbar bar */}
        <div className="pointer-events-auto px-3 pb-3">
          <div className="bg-white dark:bg-dark-card rounded-full shadow-[0_8px_32px_rgba(234,88,12,0.18)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-border-soft dark:border-dark-border p-1.5 flex items-center justify-between gap-1">
            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <button className={iconBtn} onClick={onZoomIn} title="拡大" aria-label="拡大">
                <ZoomIn size={18} strokeWidth={2} />
              </button>
              <button className={iconBtn} onClick={onZoomOut} title="縮小" aria-label="縮小">
                <ZoomOut size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Primary FAB (Add) */}
            <button
              onClick={(e) => { e.stopPropagation(); setAddMenuOpen((v) => !v) }}
              className={`${btnBase} w-14 h-14 ${addMenuOpen ? 'bg-secondary rotate-45' : 'bg-primary fab-pulse'} text-white transition-all duration-300`}
              title={addMenuOpen ? '閉じる' : '追加'}
              aria-label="追加メニュー"
              aria-expanded={addMenuOpen}
            >
              {addMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Plus size={26} strokeWidth={2.5} />}
            </button>

            {/* Drawing toggle */}
            <button
              className={drawingMode ? activeBtn : iconBtn}
              onClick={onToggleDraw}
              title={drawingMode ? '手描き終了' : '手描き開始'}
              aria-label="手描きモード"
            >
              <PenTool size={18} strokeWidth={2} />
            </button>

            {/* History & delete (mini) */}
            <div className="flex items-center gap-1">
              <button className={iconBtn} onClick={onUndo} disabled={!canUndo} title="元に戻す" aria-label="元に戻す">
                <Undo2 size={18} strokeWidth={2} />
              </button>
              <button className={iconBtn} onClick={onRedo} disabled={!canRedo} title="やり直す" aria-label="やり直す">
                <Redo2 size={18} strokeWidth={2} />
              </button>
              <button className={iconBtn} onClick={onDelete} title="選択中を削除" aria-label="削除">
                <Trash2 size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
