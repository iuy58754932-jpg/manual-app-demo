interface DrawingControlsProps {
  color: string
  onColorChange: (c: string) => void
  brushWidth: number
  onBrushWidthChange: (w: number) => void
  onDone: () => void
}

const COLORS = [
  { name: 'red', value: '#EF4444' },
  { name: 'orange', value: '#F97316' },
  { name: 'yellow', value: '#FBBF24' },
  { name: 'green', value: '#10B981' },
  { name: 'blue', value: '#0891B2' },
  { name: 'navy', value: '#1E2761' },
  { name: 'black', value: '#1A1F36' },
  { name: 'white', value: '#FFFFFF' },
]
const BRUSH_SIZES = [2, 4, 8, 14, 22]

export default function DrawingControls({
  color, onColorChange, brushWidth, onBrushWidthChange, onDone,
}: DrawingControlsProps) {
  return (
    <div className="bg-secondary text-white px-3 py-2 border-b border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-white/70 shrink-0 w-8">色</span>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => onColorChange(c.value)}
              aria-label={c.name}
              className={`shrink-0 w-7 h-7 rounded-full border-2 cursor-pointer transition-all ${
                color === c.value ? 'border-white scale-110' : 'border-white/30'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
        <button
          onClick={onDone}
          className="shrink-0 bg-accent text-white px-3 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer tap-feedback"
        >
          ✓ 終了
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-white/70 shrink-0 w-8">太さ</span>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1">
          {BRUSH_SIZES.map((w) => (
            <button
              key={w}
              onClick={() => onBrushWidthChange(w)}
              aria-label={`brush ${w}px`}
              className={`shrink-0 h-7 flex items-center justify-center rounded-md px-2 border cursor-pointer transition-all ${
                brushWidth === w
                  ? 'bg-white/20 border-white'
                  : 'bg-transparent border-white/30'
              }`}
            >
              <span
                className="rounded-full bg-white"
                style={{ width: Math.min(w, 18), height: Math.min(w, 18) }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
