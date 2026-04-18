interface ToolbarProps {
  onAddPhoto: () => void
  onAddEditedPhoto: () => void
  onEditSelectedImage: () => void
  onAddText: () => void
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
  onAddPhoto, onAddEditedPhoto, onEditSelectedImage, onAddText, onAddQr, onToggleDraw,
  onZoomIn, onZoomOut, onUndo, onRedo, onDelete,
  canUndo, canRedo, imageSelected, drawingMode,
}: ToolbarProps) {
  // Two-row layout keeps all 11 actions easily reachable without horizontal scroll.
  const btnClass = "shrink-0 bg-white border-[1.5px] border-border rounded-[10px] w-10 h-10 flex items-center justify-center text-[16px] cursor-pointer transition-all hover:border-accent hover:text-accent hover:bg-sky tap-feedback text-text-secondary font-[inherit] disabled:opacity-30 disabled:cursor-default relative"

  const drawBtnClass = drawingMode
    ? btnClass.replace('bg-white', 'bg-accent').replace('text-text-secondary', 'text-white').replace('border-border', 'border-accent')
    : btnClass

  return (
    <div className="flex flex-col gap-1.5 px-2 py-2 border-b border-border bg-white">
      {/* Row 1: content adding */}
      <div className="flex justify-center gap-1.5 flex-wrap">
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
        <button className={btnClass} onClick={onAddQr} title="QRコードを追加" aria-label="QRコードを追加">
          <span className="text-[14px]">🔳</span>
        </button>
        <button className={drawBtnClass} onClick={onToggleDraw} title={drawingMode ? '手描き終了' : '手描き開始'} aria-label="手描きモード">
          ✏️
        </button>
      </div>

      {/* Row 2: view / edit controls */}
      <div className="flex justify-center gap-1.5 flex-wrap">
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
    </div>
  )
}
