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
  // Square icon-only buttons — fits 9 actions in a single row on 360px+ viewports.
  // On <360px (rare iPhone SE), falls back to horizontal scroll.
  const btnClass = "shrink-0 bg-white border-[1.5px] border-border rounded-[10px] w-9 h-9 flex items-center justify-center text-[16px] cursor-pointer transition-all hover:border-accent hover:text-accent hover:bg-sky tap-feedback text-text-secondary font-[inherit] disabled:opacity-30 disabled:cursor-default relative"

  return (
    <div className="flex justify-center gap-1 px-1 py-2 border-b border-border bg-white overflow-x-auto scrollbar-hide">
      <button className={btnClass} onClick={onAddPhoto} title="写真を追加" aria-label="写真を追加">
        📷
      </button>
      <button className={btnClass} onClick={onAddEditedPhoto} title="写真を編集して追加" aria-label="写真を編集して追加">
        <span>📷</span>
        <span className="absolute -top-1 -right-1 text-[10px] bg-accent text-white rounded-full w-4 h-4 flex items-center justify-center leading-none">＋</span>
      </button>
      <button className={btnClass} onClick={onEditSelectedImage} disabled={!imageSelected} title="選択中の画像を編集" aria-label="選択中の画像を編集">
        <span>🖼</span>
        <span className="absolute -top-1 -right-1 text-[10px] bg-accent text-white rounded-full w-4 h-4 flex items-center justify-center leading-none">✎</span>
      </button>
      <button className={btnClass} onClick={onAddText} title="テキストを追加" aria-label="テキストを追加">
        <span className="text-[14px] font-bold">Aa</span>
      </button>
      <button className={btnClass} onClick={onZoomIn} title="拡大" aria-label="拡大">
        <span className="text-[14px]">🔍</span>
        <span className="absolute -bottom-0.5 -right-0.5 text-[10px] font-bold text-accent bg-white rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">＋</span>
      </button>
      <button className={btnClass} onClick={onZoomOut} title="縮小" aria-label="縮小">
        <span className="text-[14px]">🔍</span>
        <span className="absolute -bottom-0.5 -right-0.5 text-[10px] font-bold text-accent bg-white rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">−</span>
      </button>
      <button className={btnClass} onClick={onUndo} disabled={!canUndo} title="元に戻す" aria-label="元に戻す">
        ↩
      </button>
      <button className={btnClass} onClick={onRedo} disabled={!canRedo} title="やり直す" aria-label="やり直す">
        ↪
      </button>
      <button className={btnClass} onClick={onDelete} title="選択中を削除" aria-label="選択中を削除">
        🗑
      </button>
    </div>
  )
}
