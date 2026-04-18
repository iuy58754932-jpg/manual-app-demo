interface ToolbarProps {
  onAddPhoto: () => void
  onAddEditedPhoto: () => void
  onEditSelectedImage: () => void
  onAddText: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onUndo: () => void
  onRedo: () => void
  onDelete: () => void
  canUndo: boolean
  canRedo: boolean
  imageSelected: boolean
}

export default function Toolbar({
  onAddPhoto, onAddEditedPhoto, onEditSelectedImage, onAddText, onZoomIn, onZoomOut,
  onUndo, onRedo, onDelete, canUndo, canRedo, imageSelected,
}: ToolbarProps) {
  const btnClass = "bg-white border-[1.5px] border-border rounded-[10px] px-3 py-2 text-[13px] cursor-pointer flex items-center gap-1.5 transition-all hover:border-accent hover:text-accent hover:bg-sky tap-feedback text-text-secondary font-[inherit] disabled:opacity-30 disabled:cursor-default"

  return (
    <div className="flex gap-1.5 px-4 py-2.5 border-b border-border overflow-x-auto scrollbar-hide bg-white">
      <button className={btnClass} onClick={onAddPhoto}>
        <span className="text-[16px]">📷</span> 写真
      </button>
      <button className={btnClass} onClick={onAddEditedPhoto}>
        <span className="text-[16px]">📸</span><span className="text-[12px]">✏️</span> 編集して追加
      </button>
      <button className={btnClass} onClick={onEditSelectedImage} disabled={!imageSelected}>
        <span className="text-[16px]">✏️</span> 画像を編集
      </button>
      <button className={btnClass} onClick={onAddText}>
        <span className="text-[16px]">Aa</span> テキスト
      </button>
      <button className={btnClass} onClick={onZoomIn}>
        <span className="text-[16px]">🔍+</span>
      </button>
      <button className={btnClass} onClick={onZoomOut}>
        <span className="text-[16px]">🔍−</span>
      </button>
      <button className={btnClass} onClick={onUndo} disabled={!canUndo}>
        <span className="text-[16px]">↩</span>
      </button>
      <button className={btnClass} onClick={onRedo} disabled={!canRedo}>
        <span className="text-[16px]">↪</span>
      </button>
      <button className={btnClass} onClick={onDelete}>
        <span className="text-[16px]">🗑</span>
      </button>
    </div>
  )
}
