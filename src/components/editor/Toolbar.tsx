import {
  Camera, CameraOff, ImageIcon, Type, Mic, QrCode, PenTool,
  ZoomIn, ZoomOut, Undo2, Redo2, Trash2, Plus, Pencil,
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
  const btnBase = "shrink-0 w-10 h-10 flex items-center justify-center rounded-[12px] cursor-pointer transition-all tap-feedback disabled:opacity-30 disabled:cursor-default relative"
  const btnNormal = `${btnBase} bg-white border border-border text-primary hover:border-primary hover:bg-bg-warm`
  const btnActive = `${btnBase} bg-primary border border-primary text-white shadow-[0_4px_12px_rgba(234,88,12,0.35)]`

  const drawBtn = drawingMode ? btnActive : btnNormal

  // Suppress unused import warning by using CameraOff (alias for future use)
  void CameraOff

  return (
    <div className="flex flex-col gap-1.5 px-2 py-2 border-b border-border-soft bg-white/70 backdrop-blur-sm">
      {/* Row 1: content adding */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        <button className={btnNormal} onClick={onAddPhoto} title="写真を追加" aria-label="写真を追加">
          <Camera size={18} strokeWidth={2} />
        </button>
        <button className={btnNormal} onClick={onAddEditedPhoto} title="写真を編集して追加" aria-label="写真を編集して追加">
          <Camera size={18} strokeWidth={2} />
          <span className="absolute -top-1 -right-1 bg-accent text-white rounded-full w-4 h-4 flex items-center justify-center">
            <Plus size={10} strokeWidth={3} />
          </span>
        </button>
        <button className={btnNormal} onClick={onEditSelectedImage} disabled={!imageSelected} title="選択中の画像を編集" aria-label="選択中の画像を編集">
          <ImageIcon size={18} strokeWidth={2} />
          <span className="absolute -top-1 -right-1 bg-accent text-white rounded-full w-4 h-4 flex items-center justify-center">
            <Pencil size={9} strokeWidth={3} />
          </span>
        </button>
        <button className={btnNormal} onClick={onAddText} title="テキストを追加" aria-label="テキストを追加">
          <Type size={18} strokeWidth={2} />
        </button>
        <button className={btnNormal} onClick={onAddVoiceText} title="音声入力でテキスト追加" aria-label="音声入力">
          <Mic size={18} strokeWidth={2} />
        </button>
        <button className={btnNormal} onClick={onAddQr} title="QRコードを追加" aria-label="QRコード">
          <QrCode size={18} strokeWidth={2} />
        </button>
        <button className={drawBtn} onClick={onToggleDraw} title={drawingMode ? '手描き終了' : '手描き開始'} aria-label="手描きモード">
          <PenTool size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Row 2: view / edit controls */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        <button className={btnNormal} onClick={onZoomIn} title="拡大" aria-label="拡大">
          <ZoomIn size={18} strokeWidth={2} />
        </button>
        <button className={btnNormal} onClick={onZoomOut} title="縮小" aria-label="縮小">
          <ZoomOut size={18} strokeWidth={2} />
        </button>
        <button className={btnNormal} onClick={onUndo} disabled={!canUndo} title="元に戻す" aria-label="元に戻す">
          <Undo2 size={18} strokeWidth={2} />
        </button>
        <button className={btnNormal} onClick={onRedo} disabled={!canRedo} title="やり直す" aria-label="やり直す">
          <Redo2 size={18} strokeWidth={2} />
        </button>
        <button className={btnNormal} onClick={onDelete} title="選択中を削除" aria-label="削除">
          <Trash2 size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
