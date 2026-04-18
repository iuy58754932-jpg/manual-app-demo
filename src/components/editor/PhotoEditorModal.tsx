import { useEffect, useRef, useState, useCallback } from 'react'
import { fabric } from 'fabric'

interface PhotoEditorModalProps {
  open: boolean
  photoDataUrl: string | null
  onComplete: (flattenedDataUrl: string) => void
  onCancel: () => void
}

const COLORS = [
  { name: 'white', value: '#FFFFFF' },
  { name: 'black', value: '#1A1F36' },
  { name: 'red', value: '#EF4444' },
  { name: 'blue', value: '#0891B2' },
  { name: 'yellow', value: '#FBBF24' },
  { name: 'green', value: '#10B981' },
  { name: 'orange', value: '#F97316' },
]

const FONT_SIZES = [12, 16, 20, 24, 32, 48]

// Workaround: ensure textbox styles are initialized to prevent Fabric.js v5 crash
function patchTextboxStyles(canvas: fabric.Canvas) {
  canvas.getObjects().forEach((obj) => {
    if ((obj.type === 'textbox' || obj.type === 'i-text') && !(obj as any).styles) {
      (obj as any).styles = {}
    }
  })
}

export default function PhotoEditorModal({
  open, photoDataUrl, onComplete, onCancel,
}: PhotoEditorModalProps) {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<fabric.Canvas | null>(null)
  const [activeColor, setActiveColor] = useState<string>('#EF4444')
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null)
  const [historyTrigger, setHistoryTrigger] = useState(0)
  const undoStackRef = useRef<string[]>([])

  // Initialize canvas when modal opens with photo
  useEffect(() => {
    if (!open || !photoDataUrl || !canvasContainerRef.current) return

    const container = canvasContainerRef.current
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    // Load image to determine dimensions
    const img = new Image()
    img.onload = () => {
      const imgRatio = img.width / img.height
      const containerRatio = containerWidth / containerHeight
      let canvasW: number, canvasH: number

      if (imgRatio > containerRatio) {
        canvasW = containerWidth
        canvasH = containerWidth / imgRatio
      } else {
        canvasH = containerHeight
        canvasW = containerHeight * imgRatio
      }

      // Find the actual canvas element
      const canvasEl = container.querySelector('canvas') as HTMLCanvasElement
      if (!canvasEl) return

      const fcanvas = new fabric.Canvas(canvasEl, {
        width: canvasW,
        height: canvasH,
        backgroundColor: '#000000',
        preserveObjectStacking: true,
      })

      // Add photo as locked background image
      fabric.Image.fromURL(photoDataUrl, (fimg) => {
        fimg.set({
          left: 0,
          top: 0,
          scaleX: canvasW / (fimg.width || 1),
          scaleY: canvasH / (fimg.height || 1),
          selectable: false,
          evented: false,
          hoverCursor: 'default',
        })
        fcanvas.add(fimg)
        fcanvas.sendToBack(fimg)
        fcanvas.renderAll()
      })

      // Track selection changes
      fcanvas.on('selection:created', (e: any) => setSelectedObject(e.selected?.[0] || null))
      fcanvas.on('selection:updated', (e: any) => setSelectedObject(e.selected?.[0] || null))
      fcanvas.on('selection:cleared', () => setSelectedObject(null))

      // Track for undo
      const pushHistory = () => {
        try {
          patchTextboxStyles(fcanvas)
          const json = JSON.stringify(fcanvas.toJSON())
          undoStackRef.current.push(json)
          if (undoStackRef.current.length > 30) undoStackRef.current.shift()
          setHistoryTrigger((n) => n + 1)
        } catch {
          // ignore serialization errors
        }
      }
      fcanvas.on('object:added', pushHistory)
      fcanvas.on('object:modified', pushHistory)
      fcanvas.on('object:removed', pushHistory)

      canvasRef.current = fcanvas
    }
    img.src = photoDataUrl

    return () => {
      try { canvasRef.current?.dispose() } catch { /* DOM gone */ }
      canvasRef.current = null
      undoStackRef.current = []
      setSelectedObject(null)
    }
  }, [open, photoDataUrl])

  // ── Tool handlers ──
  const addText = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const t = new fabric.Textbox('テキスト', {
      left: canvas.getWidth() / 2 - 60,
      top: canvas.getHeight() / 2 - 20,
      width: 200,
      fontSize: 24,
      fontFamily: 'Noto Sans JP',
      fill: activeColor,
      textAlign: 'center',
      editable: true,
      styles: {},
      shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.5)', blur: 4, offsetX: 1, offsetY: 1 }),
    })
    canvas.add(t)
    canvas.setActiveObject(t)
    canvas.renderAll()
  }, [activeColor])

  const addRect = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const r = new fabric.Rect({
      left: canvas.getWidth() / 2 - 60,
      top: canvas.getHeight() / 2 - 40,
      width: 120,
      height: 80,
      fill: 'transparent',
      stroke: activeColor,
      strokeWidth: 4,
    })
    canvas.add(r)
    canvas.setActiveObject(r)
    canvas.renderAll()
  }, [activeColor])

  const addCircle = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const c = new fabric.Circle({
      left: canvas.getWidth() / 2 - 50,
      top: canvas.getHeight() / 2 - 50,
      radius: 50,
      fill: 'transparent',
      stroke: activeColor,
      strokeWidth: 4,
    })
    canvas.add(c)
    canvas.setActiveObject(c)
    canvas.renderAll()
  }, [activeColor])

  const addLine = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const cx = canvas.getWidth() / 2
    const cy = canvas.getHeight() / 2
    const l = new fabric.Line([cx - 60, cy, cx + 60, cy], {
      stroke: activeColor,
      strokeWidth: 4,
    })
    canvas.add(l)
    canvas.setActiveObject(l)
    canvas.renderAll()
  }, [activeColor])

  const addArrow = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const cx = canvas.getWidth() / 2
    const cy = canvas.getHeight() / 2
    // Arrow path: line + arrowhead. Path drawn with origin (0,0) at arrow tip area.
    const pathStr = 'M 0 20 L 100 20 M 90 12 L 100 20 L 90 28'
    const a = new fabric.Path(pathStr, {
      left: cx - 50,
      top: cy - 20,
      stroke: activeColor,
      strokeWidth: 4,
      fill: '',
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
    })
    canvas.add(a)
    canvas.setActiveObject(a)
    canvas.renderAll()
  }, [activeColor])

  const addStar = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // 5-pointed star path
    const pathStr = 'M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z'
    const s = new fabric.Path(pathStr, {
      left: canvas.getWidth() / 2 - 50,
      top: canvas.getHeight() / 2 - 50,
      fill: activeColor,
      stroke: activeColor,
      strokeWidth: 2,
    })
    canvas.add(s)
    canvas.setActiveObject(s)
    canvas.renderAll()
  }, [activeColor])

  const addCheck = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const pathStr = 'M 5 35 L 30 60 L 75 10'
    const c = new fabric.Path(pathStr, {
      left: canvas.getWidth() / 2 - 40,
      top: canvas.getHeight() / 2 - 35,
      stroke: activeColor,
      strokeWidth: 6,
      fill: '',
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
    })
    canvas.add(c)
    canvas.setActiveObject(c)
    canvas.renderAll()
  }, [activeColor])

  const addTriangle = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const t = new fabric.Triangle({
      left: canvas.getWidth() / 2 - 50,
      top: canvas.getHeight() / 2 - 45,
      width: 100,
      height: 90,
      fill: 'transparent',
      stroke: activeColor,
      strokeWidth: 4,
    })
    canvas.add(t)
    canvas.setActiveObject(t)
    canvas.renderAll()
  }, [activeColor])

  const deleteSelected = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const objs = canvas.getActiveObjects()
    objs.forEach((o) => canvas.remove(o))
    canvas.discardActiveObject()
    canvas.renderAll()
    setSelectedObject(null)
  }, [])

  const undo = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || undoStackRef.current.length < 2) return
    // pop current state, peek previous
    undoStackRef.current.pop()
    const prev = undoStackRef.current[undoStackRef.current.length - 1]
    if (!prev) return
    canvas.loadFromJSON(JSON.parse(prev), () => {
      canvas.renderAll()
      setHistoryTrigger((n) => n + 1)
    })
  }, [])

  const applyColor = useCallback((color: string) => {
    setActiveColor(color)
    const canvas = canvasRef.current
    const obj = selectedObject
    if (!canvas || !obj) return
    if (obj.type === 'textbox' || obj.type === 'i-text') {
      obj.set('fill', color)
    } else if (obj.type === 'path' && (obj as fabric.Path).fill && (obj as fabric.Path).fill !== '') {
      // Filled paths (star, check etc.) — update both
      obj.set('fill', color)
      obj.set('stroke', color)
    } else {
      obj.set('stroke', color)
    }
    canvas.renderAll()
  }, [selectedObject])

  const applyFontSize = useCallback((size: number) => {
    const canvas = canvasRef.current
    const obj = selectedObject
    if (!canvas || !obj) return
    if (obj.type === 'textbox' || obj.type === 'i-text') {
      (obj as fabric.Textbox).set('fontSize', size)
      canvas.renderAll()
    }
  }, [selectedObject])

  const handleComplete = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.discardActiveObject()
    patchTextboxStyles(canvas)
    canvas.renderAll()
    const dataUrl = canvas.toDataURL({ format: 'jpeg', quality: 0.92, multiplier: 1 })
    onComplete(dataUrl)
  }, [onComplete])

  if (!open) return null

  const isTextSelected = selectedObject?.type === 'textbox' || selectedObject?.type === 'i-text'
  // historyTrigger is used so we can show enabled/disabled undo without subscribing internals
  const canUndo = undoStackRef.current.length > 1 && historyTrigger >= 0

  const toolBtn = "shrink-0 bg-white/10 border border-white/20 rounded-[10px] w-12 h-12 flex flex-col items-center justify-center text-white text-[10px] cursor-pointer transition-all hover:bg-white/20 active:scale-95 disabled:opacity-30"

  return (
    <div className="fixed inset-0 bg-black z-[400] flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 bg-black/80 border-b border-white/10"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)', paddingBottom: 12 }}
      >
        <button
          onClick={onCancel}
          className="text-white text-[14px] font-bold bg-transparent border-none cursor-pointer px-3 py-2 tap-feedback"
        >
          ✕ キャンセル
        </button>
        <h2 className="text-white text-[15px] font-bold">写真を編集</h2>
        <button
          onClick={handleComplete}
          className="text-white text-[14px] font-bold bg-accent rounded-lg px-4 py-2 border-none cursor-pointer tap-feedback"
        >
          ✓ 完了
        </button>
      </div>

      {/* Canvas area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden bg-black p-2">
        <div
          ref={canvasContainerRef}
          className="relative flex items-center justify-center"
          style={{ width: '100%', height: '100%', maxWidth: 460 }}
        >
          <canvas />
        </div>
      </div>

      {/* Context panel: font size (text only) + color palette */}
      <div className="bg-black/85 border-t border-white/10 px-3 pt-2 pb-1">
        {isTextSelected && (
          <div className="flex items-center gap-2 mb-2 overflow-x-auto scrollbar-hide">
            <span className="text-white/70 text-[10px] shrink-0 px-1">サイズ</span>
            {FONT_SIZES.map((sz) => (
              <button
                key={sz}
                onClick={() => applyFontSize(sz)}
                className="shrink-0 bg-white/10 border border-white/20 rounded-md px-3 py-1 text-white text-[12px] font-bold cursor-pointer hover:bg-white/20 active:scale-95"
              >
                {sz}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-white/70 text-[10px] shrink-0 px-1">色</span>
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => applyColor(c.value)}
              aria-label={c.name}
              className={`shrink-0 w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                activeColor === c.value ? 'border-white scale-110' : 'border-white/30'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      {/* Tool palette */}
      <div
        className="bg-black border-t border-white/10 flex items-center gap-2 px-3 py-3 overflow-x-auto scrollbar-hide"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <button className={toolBtn} onClick={addText}>
          <span className="text-[18px] font-bold">Aa</span>
          <span>テキスト</span>
        </button>
        <button className={toolBtn} onClick={addArrow}>
          <span className="text-[18px]">➡</span>
          <span>矢印</span>
        </button>
        <button className={toolBtn} onClick={addLine}>
          <span className="text-[18px]">━</span>
          <span>線</span>
        </button>
        <button className={toolBtn} onClick={addCircle}>
          <span className="text-[18px]">○</span>
          <span>丸</span>
        </button>
        <button className={toolBtn} onClick={addRect}>
          <span className="text-[18px]">▢</span>
          <span>四角</span>
        </button>
        <button className={toolBtn} onClick={addTriangle}>
          <span className="text-[18px]">△</span>
          <span>三角</span>
        </button>
        <button className={toolBtn} onClick={addStar}>
          <span className="text-[18px]">★</span>
          <span>星</span>
        </button>
        <button className={toolBtn} onClick={addCheck}>
          <span className="text-[18px]">✓</span>
          <span>チェック</span>
        </button>
        <div className="w-px h-10 bg-white/20 shrink-0 mx-1" />
        <button className={toolBtn} onClick={undo} disabled={!canUndo}>
          <span className="text-[18px]">↩</span>
          <span>戻す</span>
        </button>
        <button className={toolBtn} onClick={deleteSelected} disabled={!selectedObject}>
          <span className="text-[18px]">🗑</span>
          <span>削除</span>
        </button>
      </div>
    </div>
  )
}
