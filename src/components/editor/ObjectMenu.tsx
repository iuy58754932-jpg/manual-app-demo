interface ObjectMenuProps {
  visible: boolean
  x: number
  y: number
  onDelete: () => void
  onBringForward: () => void
  onSendBackward: () => void
  onDuplicate: () => void
}

export default function ObjectMenu({
  visible, x, y, onDelete, onBringForward, onSendBackward, onDuplicate,
}: ObjectMenuProps) {
  if (!visible) return null

  const btnClass = "px-3 py-2 text-[12px] text-text-secondary hover:bg-sky hover:text-primary cursor-pointer border-none bg-transparent w-full text-left font-[inherit] tap-feedback"

  return (
    <div
      className="absolute z-50 bg-white rounded-xl shadow-[0_8px_32px_rgba(30,39,97,0.12)] border border-border overflow-hidden min-w-[120px]"
      style={{ left: x, top: y }}
    >
      <button className={btnClass} onClick={onDuplicate}>📋 複製</button>
      <button className={btnClass} onClick={onBringForward}>⬆ 前面へ</button>
      <button className={btnClass} onClick={onSendBackward}>⬇ 背面へ</button>
      <button className={`${btnClass} text-error hover:bg-red-50 hover:text-error`} onClick={onDelete}>🗑 削除</button>
    </div>
  )
}
