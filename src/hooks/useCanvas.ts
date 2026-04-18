import { useRef, useCallback, useEffect } from 'react'
import { fabric } from 'fabric'

const CANVAS_WIDTH = 595
const CANVAS_HEIGHT = 842

// Patch textbox styles on all objects to prevent Fabric.js v5 serialization bug
function patchStyles(canvas: fabric.Canvas | fabric.StaticCanvas) {
  canvas.getObjects().forEach((obj) => {
    if ((obj.type === 'textbox' || obj.type === 'i-text') && !(obj as any).styles) {
      (obj as any).styles = {}
    }
  })
}

function safeToJSON(canvas: fabric.Canvas): string {
  try {
    patchStyles(canvas)
    return JSON.stringify(canvas.toJSON())
  } catch {
    return '{}'
  }
}

export function useCanvas(
  canvasElId: string,
  onModified?: (json: string) => void,
  onSelectionChange?: (obj: fabric.Object | null) => void,
) {
  const canvasRef = useRef<fabric.Canvas | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const onModifiedRef = useRef(onModified)
  onModifiedRef.current = onModified
  const onSelectionChangeRef = useRef(onSelectionChange)
  onSelectionChangeRef.current = onSelectionChange

  const initCanvas = useCallback((container: HTMLDivElement) => {
    containerRef.current = container
    if (canvasRef.current) {
      try { canvasRef.current.dispose() } catch { /* already disposed */ }
      canvasRef.current = null
    }

    const canvas = new fabric.Canvas(canvasElId, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    })

    // Scale canvas to fit container
    const containerWidth = container.clientWidth - 16
    const scale = containerWidth / CANVAS_WIDTH
    canvas.setZoom(scale)
    canvas.setWidth(CANVAS_WIDTH * scale)
    canvas.setHeight(CANVAS_HEIGHT * scale)

    // Event listeners for modification tracking
    const handleModified = () => {
      if (onModifiedRef.current) {
        const json = safeToJSON(canvas)
        if (json !== '{}') {
          onModifiedRef.current(json)
        }
      }
    }
    canvas.on('object:modified', handleModified)
    canvas.on('object:added', handleModified)
    canvas.on('object:removed', handleModified)

    // Selection event listeners
    const handleSelectionCreated = (e: fabric.IEvent & { selected?: fabric.Object[] }) => {
      onSelectionChangeRef.current?.(e.selected?.[0] || canvas.getActiveObject() || null)
    }
    const handleSelectionUpdated = (e: fabric.IEvent & { selected?: fabric.Object[] }) => {
      onSelectionChangeRef.current?.(e.selected?.[0] || canvas.getActiveObject() || null)
    }
    const handleSelectionCleared = () => {
      onSelectionChangeRef.current?.(null)
    }
    canvas.on('selection:created', handleSelectionCreated)
    canvas.on('selection:updated', handleSelectionUpdated)
    canvas.on('selection:cleared', handleSelectionCleared)

    canvasRef.current = canvas
    return canvas
  }, [canvasElId])

  const loadFromJSON = useCallback((json: string | object) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = typeof json === 'string' ? JSON.parse(json) : json
    // Fix Fabric.js v5 bug: textbox objects need styles initialized
    if (data.objects) {
      data.objects.forEach((obj: Record<string, unknown>) => {
        if ((obj.type === 'textbox' || obj.type === 'i-text') && !obj.styles) {
          obj.styles = {}
        }
      })
    }
    canvas.loadFromJSON(data, () => {
      canvas.renderAll()
    })
  }, [])

  const toJSON = useCallback((): string => {
    const canvas = canvasRef.current
    if (!canvas) return '{}'
    return safeToJSON(canvas)
  }, [])

  const toDataURL = useCallback((): string => {
    const canvas = canvasRef.current
    if (!canvas) return ''
    const currentZoom = canvas.getZoom()
    canvas.setZoom(1)
    canvas.setWidth(CANVAS_WIDTH)
    canvas.setHeight(CANVAS_HEIGHT)
    const url = canvas.toDataURL({ format: 'jpeg', quality: 0.92, multiplier: 1 })
    canvas.setZoom(currentZoom)
    canvas.setWidth(CANVAS_WIDTH * currentZoom)
    canvas.setHeight(CANVAS_HEIGHT * currentZoom)
    return url
  }, [])

  const toThumbnail = useCallback((): string => {
    const canvas = canvasRef.current
    if (!canvas) return ''
    const currentZoom = canvas.getZoom()
    canvas.setZoom(1)
    canvas.setWidth(CANVAS_WIDTH)
    canvas.setHeight(CANVAS_HEIGHT)
    const url = canvas.toDataURL({ format: 'jpeg', quality: 0.5, multiplier: 0.2 })
    canvas.setZoom(currentZoom)
    canvas.setWidth(CANVAS_WIDTH * currentZoom)
    canvas.setHeight(CANVAS_HEIGHT * currentZoom)
    return url
  }, [])

  const addImage = useCallback((dataUrl: string) => {
    const canvas = canvasRef.current
    if (!canvas) return
    fabric.Image.fromURL(dataUrl, (img) => {
      const maxW = CANVAS_WIDTH * 0.6
      const maxH = CANVAS_HEIGHT * 0.4
      const scale = Math.min(maxW / (img.width || 1), maxH / (img.height || 1), 1)
      img.set({
        left: 40,
        top: 100,
        scaleX: scale,
        scaleY: scale,
      })
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
    })
  }, [])

  const addText = useCallback((text = 'テキストを入力') => {
    const canvas = canvasRef.current
    if (!canvas) return
    const textbox = new fabric.Textbox(text, {
      left: 40,
      top: 100,
      width: 300,
      fontSize: 16,
      fontFamily: 'Noto Sans JP',
      fill: '#1A1F36',
      editable: true,
      styles: {},
    })
    canvas.add(textbox)
    canvas.setActiveObject(textbox)
    canvas.renderAll()
  }, [])

  const deleteSelected = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const active = canvas.getActiveObjects()
    active.forEach((obj) => canvas.remove(obj))
    canvas.discardActiveObject()
    canvas.renderAll()
  }, [])

  const bringForward = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (active) {
      canvas.bringForward(active)
      canvas.renderAll()
    }
  }, [])

  const sendBackward = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (active) {
      canvas.sendBackwards(active)
      canvas.renderAll()
    }
  }, [])

  const duplicateSelected = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active) return
    active.clone((cloned: fabric.Object) => {
      cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 })
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
    })
  }, [])

  const getActiveObject = useCallback(() => {
    return canvasRef.current?.getActiveObject() ?? null
  }, [])

  const getActiveImageSrc = useCallback((): string | null => {
    const obj = canvasRef.current?.getActiveObject()
    if (!obj || obj.type !== 'image') return null
    const src = (obj as fabric.Image).getSrc()
    return src || null
  }, [])

  const replaceActiveImage = useCallback((newDataUrl: string) => {
    const canvas = canvasRef.current
    const oldImg = canvas?.getActiveObject() as fabric.Image | undefined
    if (!canvas || !oldImg || oldImg.type !== 'image') return

    // Preserve display geometry
    const oldDisplayW = (oldImg.width || 1) * (oldImg.scaleX || 1)
    const oldDisplayH = (oldImg.height || 1) * (oldImg.scaleY || 1)
    const angle = oldImg.angle || 0
    const left = oldImg.left || 0
    const top = oldImg.top || 0
    const flipX = oldImg.flipX || false
    const flipY = oldImg.flipY || false

    fabric.Image.fromURL(newDataUrl, (newImg) => {
      const newScaleX = oldDisplayW / (newImg.width || 1)
      const newScaleY = oldDisplayH / (newImg.height || 1)
      newImg.set({
        left, top, angle, flipX, flipY,
        scaleX: newScaleX,
        scaleY: newScaleY,
      })
      canvas.remove(oldImg)
      canvas.add(newImg)
      canvas.setActiveObject(newImg)
      canvas.renderAll()
    })
  }, [])

  const zoomIn = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const zoom = Math.min(canvas.getZoom() * 1.2, 3)
    canvas.setZoom(zoom)
    canvas.setWidth(CANVAS_WIDTH * zoom)
    canvas.setHeight(CANVAS_HEIGHT * zoom)
    canvas.renderAll()
  }, [])

  const zoomOut = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const zoom = Math.max(canvas.getZoom() / 1.2, 0.3)
    canvas.setZoom(zoom)
    canvas.setWidth(CANVAS_WIDTH * zoom)
    canvas.setHeight(CANVAS_HEIGHT * zoom)
    canvas.renderAll()
  }, [])

  const resetZoom = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !containerRef.current) return
    const containerWidth = containerRef.current.clientWidth - 16
    const scale = containerWidth / CANVAS_WIDTH
    canvas.setZoom(scale)
    canvas.setWidth(CANVAS_WIDTH * scale)
    canvas.setHeight(CANVAS_HEIGHT * scale)
    canvas.renderAll()
  }, [])

  useEffect(() => {
    return () => {
      try { canvasRef.current?.dispose() } catch { /* DOM already removed */ }
      canvasRef.current = null
    }
  }, [])

  return {
    canvasRef,
    initCanvas,
    loadFromJSON,
    toJSON,
    toDataURL,
    toThumbnail,
    addImage,
    addText,
    deleteSelected,
    bringForward,
    sendBackward,
    duplicateSelected,
    getActiveObject,
    getActiveImageSrc,
    replaceActiveImage,
    zoomIn,
    zoomOut,
    resetZoom,
  }
}
