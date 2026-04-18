import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Toolbar from '../components/editor/Toolbar'
import CanvasComponent from '../components/editor/Canvas'
import PageNavigator from '../components/editor/PageNavigator'
import ObjectMenu from '../components/editor/ObjectMenu'
import PhotoEditorModal from '../components/editor/PhotoEditorModal'
import QrCodeModal from '../components/editor/QrCodeModal'
import DrawingControls from '../components/editor/DrawingControls'
import Modal from '../components/common/Modal'
import { showToast } from '../components/common/Toast'
import { useCanvas } from '../hooks/useCanvas'
import { useHistory } from '../hooks/useHistory'
import { useDatabase, type ManualPage, type Manual } from '../hooks/useDatabase'
import { templates } from '../data/templates'
import { resizeImage } from '../lib/imageUtils'
import { generatePDF, downloadPDF, printPDF, type PaperSize } from '../lib/pdf'

function generatePageId(): string {
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function EditorPage() {
  const { manualId } = useParams<{ manualId: string }>()
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template')
  const { saveManual, loadManual, createManual } = useDatabase()

  const [manual, setManual] = useState<Manual | null>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [title, setTitle] = useState('')
  const [objectMenuState, setObjectMenuState] = useState({ visible: false, x: 0, y: 0 })
  const [pdfModalOpen, setPdfModalOpen] = useState(false)
  const [pdfPaperSize, setPdfPaperSize] = useState<PaperSize>('A4')
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false)
  const [pendingPhotoDataUrl, setPendingPhotoDataUrl] = useState<string | null>(null)
  const [editingExistingImage, setEditingExistingImage] = useState(false)
  const [selectedObjectType, setSelectedObjectType] = useState<string | null>(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [drawingMode, setDrawingMode] = useState(false)
  const [brushColor, setBrushColor] = useState('#EF4444')
  const [brushWidth, setBrushWidth] = useState(4)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const editPhotoInputRef = useRef<HTMLInputElement>(null)
  const isInitialized = useRef(false)

  const { pushState, undo, redo, canUndo, canRedo, clear: clearHistory, isProgrammatic } = useHistory()

  const onModified = useCallback((json: string) => {
    pushState(json)
  }, [pushState])

  const handleSelectionChange = useCallback((obj: { type?: string } | null) => {
    setSelectedObjectType(obj?.type ?? null)
  }, [])

  const {
    initCanvas, loadFromJSON, toJSON, toThumbnail,
    addImage, addText, deleteSelected,
    bringForward, sendBackward, duplicateSelected,
    getActiveImageSrc, replaceActiveImage,
    setDrawingMode: setCanvasDrawingMode,
    zoomIn, zoomOut,
  } = useCanvas('editor-canvas', onModified, handleSelectionChange)

  // Save current page state back to manual
  const saveCurrentPageState = useCallback(() => {
    if (!manual) return
    const json = toJSON()
    const thumb = toThumbnail()
    setManual((prev) => {
      if (!prev) return prev
      const pages = [...prev.pages]
      if (pages[currentPageIndex]) {
        pages[currentPageIndex] = {
          ...pages[currentPageIndex],
          canvasJson: json,
          thumbnailDataUrl: thumb,
        }
      }
      return { ...prev, pages }
    })
  }, [manual, currentPageIndex, toJSON, toThumbnail])

  // Initialize manual from template or load existing
  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    if (manualId) {
      // Load existing manual
      loadManual(manualId).then((loaded) => {
        if (loaded) {
          setManual(loaded)
          setTitle(loaded.title)
        }
      })
    } else if (templateId) {
      // Create from template
      const tmpl = templates.find((t) => t.id === templateId)
      if (tmpl) {
        const pages: ManualPage[] = tmpl.pages.map((p, i) => ({
          id: generatePageId(),
          pageNumber: i + 1,
          canvasJson: JSON.stringify(p.canvasJson),
          thumbnailDataUrl: '',
        }))
        const newManual = createManual(tmpl.name, tmpl.industry, tmpl.id, pages)
        setManual(newManual)
        setTitle(tmpl.name)
      }
    }
  }, [manualId, templateId, loadManual, createManual])

  // Load canvas when manual or page changes
  useEffect(() => {
    if (!manual || !manual.pages[currentPageIndex]) return
    const pageData = manual.pages[currentPageIndex].canvasJson
    if (pageData) {
      isProgrammatic.current = true
      loadFromJSON(pageData)
      clearHistory()
      setTimeout(() => { isProgrammatic.current = false }, 100)
    }
  }, [manual?.id, currentPageIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleContainerReady = useCallback((container: HTMLDivElement) => {
    initCanvas(container)
  }, [initCanvas])

  const handleSelectPage = useCallback((index: number) => {
    saveCurrentPageState()
    setCurrentPageIndex(index)
  }, [saveCurrentPageState])

  const handleAddPage = useCallback(() => {
    saveCurrentPageState()
    setManual((prev) => {
      if (!prev) return prev
      const newPage: ManualPage = {
        id: generatePageId(),
        pageNumber: prev.pages.length + 1,
        canvasJson: JSON.stringify({ version: '5.3.0', objects: [], background: '#ffffff' }),
        thumbnailDataUrl: '',
      }
      return { ...prev, pages: [...prev.pages, newPage] }
    })
    setCurrentPageIndex((prev) => {
      if (!manual) return prev
      return manual.pages.length // New last page
    })
  }, [saveCurrentPageState, manual])

  const handleDeletePage = useCallback((index: number) => {
    if (!manual || manual.pages.length <= 1) return
    setManual((prev) => {
      if (!prev) return prev
      const pages = prev.pages.filter((_, i) => i !== index)
        .map((p, i) => ({ ...p, pageNumber: i + 1 }))
      return { ...prev, pages }
    })
    setCurrentPageIndex((prev) => Math.min(prev, (manual.pages.length - 2)))
  }, [manual])

  const handleSave = useCallback(async () => {
    if (!manual) return
    saveCurrentPageState()
    // Use setTimeout to allow state to update
    setTimeout(async () => {
      setManual((current) => {
        if (!current) return current
        const updated = {
          ...current,
          title: title || '無題のマニュアル',
          thumbnailDataUrl: current.pages[0]?.thumbnailDataUrl || '',
        }
        saveManual(updated).then(() => showToast('保存しました'))
        return updated
      })
    }, 50)
  }, [manual, title, saveCurrentPageState, saveManual])

  const handleAddPhoto = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await resizeImage(file)
      addImage(dataUrl)
      showToast('写真を追加しました')
    } catch {
      showToast('画像の読み込みに失敗しました')
    }
    e.target.value = ''
  }, [addImage])

  const handleAddEditedPhoto = useCallback(() => {
    editPhotoInputRef.current?.click()
  }, [])

  const handleEditPhotoFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await resizeImage(file)
      setPendingPhotoDataUrl(dataUrl)
      setPhotoEditorOpen(true)
    } catch {
      showToast('画像の読み込みに失敗しました')
    }
    e.target.value = ''
  }, [])

  const handleEditSelectedImage = useCallback(() => {
    const src = getActiveImageSrc()
    if (!src) {
      showToast('編集する画像を選択してください')
      return
    }
    setPendingPhotoDataUrl(src)
    setEditingExistingImage(true)
    setPhotoEditorOpen(true)
  }, [getActiveImageSrc])

  // ── QR Code ──
  const handleAddQr = useCallback(() => { setQrModalOpen(true) }, [])
  const handleQrAdd = useCallback((dataUrl: string) => {
    addImage(dataUrl)
    setQrModalOpen(false)
  }, [addImage])

  // ── Drawing Mode ──
  const handleToggleDraw = useCallback(() => {
    setDrawingMode((prev) => {
      const next = !prev
      setCanvasDrawingMode(next, brushColor, brushWidth)
      return next
    })
  }, [setCanvasDrawingMode, brushColor, brushWidth])

  const handleDrawColorChange = useCallback((c: string) => {
    setBrushColor(c)
    setCanvasDrawingMode(true, c, brushWidth)
  }, [setCanvasDrawingMode, brushWidth])

  const handleBrushWidthChange = useCallback((w: number) => {
    setBrushWidth(w)
    setCanvasDrawingMode(true, brushColor, w)
  }, [setCanvasDrawingMode, brushColor])

  const handleExitDraw = useCallback(() => {
    setDrawingMode(false)
    setCanvasDrawingMode(false)
  }, [setCanvasDrawingMode])

  const handlePhotoEditorComplete = useCallback((flattenedDataUrl: string) => {
    if (editingExistingImage) {
      replaceActiveImage(flattenedDataUrl)
      showToast('画像を更新しました')
    } else {
      addImage(flattenedDataUrl)
      showToast('編集した写真を追加しました')
    }
    setPhotoEditorOpen(false)
    setPendingPhotoDataUrl(null)
    setEditingExistingImage(false)
  }, [editingExistingImage, addImage, replaceActiveImage])

  const handlePhotoEditorCancel = useCallback(() => {
    setPhotoEditorOpen(false)
    setPendingPhotoDataUrl(null)
    setEditingExistingImage(false)
  }, [])

  const handleUndo = useCallback(() => {
    const currentJson = toJSON()
    const prevJson = undo(currentJson)
    if (prevJson) {
      isProgrammatic.current = true
      loadFromJSON(prevJson)
      setTimeout(() => { isProgrammatic.current = false }, 100)
    }
  }, [toJSON, undo, loadFromJSON, isProgrammatic])

  const handleRedo = useCallback(() => {
    const currentJson = toJSON()
    const nextJson = redo(currentJson)
    if (nextJson) {
      isProgrammatic.current = true
      loadFromJSON(nextJson)
      setTimeout(() => { isProgrammatic.current = false }, 100)
    }
  }, [toJSON, redo, loadFromJSON, isProgrammatic])

  const handlePDFExport = useCallback(async (action: 'download' | 'print') => {
    if (!manual) return
    setPdfGenerating(true)
    saveCurrentPageState()

    try {
      // Collect all page JSONs
      await new Promise((r) => setTimeout(r, 100))
      const pagesJson: string[] = []
      setManual((current) => {
        if (current) {
          current.pages.forEach((p) => pagesJson.push(p.canvasJson))
        }
        return current
      })

      await new Promise((r) => setTimeout(r, 50))
      const pdf = await generatePDF(pagesJson, pdfPaperSize)

      if (action === 'download') {
        downloadPDF(pdf, title || '無題のマニュアル')
        showToast('PDFをダウンロードしました')
      } else {
        printPDF(pdf)
      }
    } catch (err) {
      console.error(err)
      showToast('PDF生成に失敗しました')
    } finally {
      setPdfGenerating(false)
      setPdfModalOpen(false)
    }
  }, [manual, title, pdfPaperSize, saveCurrentPageState])

  if (!manual) {
    return (
      <div className="flex items-center justify-center h-64 text-text-muted">
        読み込み中...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-60px)]">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelected}
      />
      <input
        ref={editPhotoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleEditPhotoFileSelected}
      />

      {/* Title input + Save */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-border">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="マニュアルタイトルを入力"
          className="flex-1 text-[16px] font-bold border-none outline-none bg-transparent text-secondary font-[inherit] placeholder:text-text-muted"
        />
        <button
          onClick={handleSave}
          className="bg-accent text-white px-4 py-2 rounded-lg text-[13px] font-bold border-none cursor-pointer tap-feedback transition-all hover:bg-[#0E7490]"
        >
          保存
        </button>
        <button
          onClick={() => { saveCurrentPageState(); setPdfModalOpen(true) }}
          className="bg-secondary text-white px-4 py-2 rounded-lg text-[13px] font-bold border-none cursor-pointer tap-feedback transition-all hover:bg-[#161D4A]"
        >
          PDF
        </button>
      </div>

      {/* Toolbar */}
      <Toolbar
        onAddPhoto={handleAddPhoto}
        onAddEditedPhoto={handleAddEditedPhoto}
        onEditSelectedImage={handleEditSelectedImage}
        onAddQr={handleAddQr}
        onToggleDraw={handleToggleDraw}
        imageSelected={selectedObjectType === 'image'}
        drawingMode={drawingMode}
        onAddText={() => addText()}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDelete={deleteSelected}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Drawing controls (visible only when drawing mode is active) */}
      {drawingMode && (
        <DrawingControls
          color={brushColor}
          onColorChange={handleDrawColorChange}
          brushWidth={brushWidth}
          onBrushWidthChange={handleBrushWidthChange}
          onDone={handleExitDraw}
        />
      )}

      {/* Canvas area */}
      <div className="relative flex-1 overflow-hidden">
        <CanvasComponent
          canvasId="editor-canvas"
          onContainerReady={handleContainerReady}
        />
        <ObjectMenu
          visible={objectMenuState.visible}
          x={objectMenuState.x}
          y={objectMenuState.y}
          onDelete={() => { deleteSelected(); setObjectMenuState((s) => ({ ...s, visible: false })) }}
          onBringForward={() => { bringForward(); setObjectMenuState((s) => ({ ...s, visible: false })) }}
          onSendBackward={() => { sendBackward(); setObjectMenuState((s) => ({ ...s, visible: false })) }}
          onDuplicate={() => { duplicateSelected(); setObjectMenuState((s) => ({ ...s, visible: false })) }}
        />
      </div>

      {/* Page Navigator */}
      <PageNavigator
        pages={manual.pages}
        currentPage={currentPageIndex}
        onSelectPage={handleSelectPage}
        onAddPage={handleAddPage}
        onDeletePage={handleDeletePage}
      />

      {/* PDF Modal */}
      {/* Photo Editor Modal (Instagram-style) */}
      <PhotoEditorModal
        open={photoEditorOpen}
        photoDataUrl={pendingPhotoDataUrl}
        onComplete={handlePhotoEditorComplete}
        onCancel={handlePhotoEditorCancel}
      />

      {/* QR Code Modal */}
      <QrCodeModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        onAdd={handleQrAdd}
      />

      <Modal open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} title="PDF出力">
        <div className="space-y-4">
          {/* Paper size */}
          <div>
            <p className="text-[13px] font-bold text-text-secondary mb-2">用紙サイズ</p>
            <div className="flex gap-2">
              {(['A4', 'A3', 'B4'] as PaperSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setPdfPaperSize(size)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-bold border-2 cursor-pointer tap-feedback transition-all ${
                    pdfPaperSize === size
                      ? 'border-accent bg-sky text-primary'
                      : 'border-border bg-white text-text-secondary hover:border-accent'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Page preview */}
          <div>
            <p className="text-[13px] font-bold text-text-secondary mb-2">
              ページ数: {manual.pages.length}ページ
            </p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {manual.pages.map((page, i) => (
                <div key={page.id} className="shrink-0 w-16 h-22 rounded-lg border border-border overflow-hidden">
                  {page.thumbnailDataUrl ? (
                    <img src={page.thumbnailDataUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-bg flex items-center justify-center text-[10px] text-text-muted">
                      {i + 1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => handlePDFExport('download')}
              disabled={pdfGenerating}
              className="flex-1 bg-gradient-to-br from-primary to-accent text-white py-3 rounded-xl text-[14px] font-bold border-none cursor-pointer tap-feedback transition-all disabled:opacity-50"
            >
              {pdfGenerating ? '生成中...' : '📄 PDF出力'}
            </button>
            <button
              onClick={() => handlePDFExport('print')}
              disabled={pdfGenerating}
              className="flex-1 bg-secondary text-white py-3 rounded-xl text-[14px] font-bold border-none cursor-pointer tap-feedback transition-all disabled:opacity-50"
            >
              {pdfGenerating ? '生成中...' : '🖨 印刷'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
