import { useState, useEffect, useCallback } from 'react'
import { generateQrDataUrl } from '../../lib/qrcode'
import { showToast } from '../common/Toast'

interface QrCodeModalProps {
  open: boolean
  onClose: () => void
  onAdd: (dataUrl: string) => void
}

const SIZES = [
  { label: '小', value: 200 },
  { label: '中', value: 400 },
  { label: '大', value: 600 },
] as const

export default function QrCodeModal({ open, onClose, onAdd }: QrCodeModalProps) {
  const [text, setText] = useState('')
  const [size, setSize] = useState<number>(400)
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!open) {
      setText('')
      setPreviewDataUrl(null)
      setError(null)
    }
  }, [open])

  // Debounced preview generation
  useEffect(() => {
    if (!open || !text.trim()) {
      setPreviewDataUrl(null)
      setError(null)
      return
    }
    let cancelled = false
    setGenerating(true)
    const t = setTimeout(async () => {
      try {
        const url = await generateQrDataUrl(text, { size: 400 })
        if (!cancelled) {
          setPreviewDataUrl(url)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : String(e)
          setError(msg === 'QR_EMPTY_TEXT' ? '' : 'QRコードの生成に失敗しました')
          setPreviewDataUrl(null)
        }
      } finally {
        if (!cancelled) setGenerating(false)
      }
    }, 300)
    return () => { cancelled = true; clearTimeout(t) }
  }, [text, open])

  const handleAdd = useCallback(async () => {
    if (!text.trim()) return
    try {
      const url = await generateQrDataUrl(text, { size })
      onAdd(url)
      onClose()
      showToast('QRコードを追加しました')
    } catch {
      showToast('QRコードの生成に失敗しました')
    }
  }, [text, size, onAdd, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[440px] max-h-[85vh] overflow-hidden flex flex-col shadow-[0_8px_32px_rgba(30,39,97,0.12)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="text-[16px] font-bold text-text-primary">QRコードを作成</h3>
            <p className="text-[10px] text-text-muted">URL / テキストを入れて生成</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted text-[22px] bg-transparent border-none cursor-pointer px-2"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4">
          <label className="block text-[12px] font-bold text-text-secondary mb-1">内容</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com または テキスト"
            rows={3}
            className="w-full px-3 py-2 border-[1.5px] border-border rounded-lg text-[13px] outline-none focus:border-accent font-[inherit] resize-none"
          />

          <label className="block text-[12px] font-bold text-text-secondary mb-1 mt-4">サイズ</label>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s.value}
                onClick={() => setSize(s.value)}
                className={`flex-1 py-2 rounded-lg text-[12px] font-bold border-2 cursor-pointer tap-feedback transition-all ${
                  size === s.value
                    ? 'border-accent bg-sky text-primary'
                    : 'border-border bg-white text-text-muted'
                }`}
              >
                {s.label}（{s.value}px）
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="mt-5 bg-bg rounded-xl p-4 flex items-center justify-center min-h-[180px]">
            {generating && !previewDataUrl && (
              <p className="text-[12px] text-text-muted">生成中...</p>
            )}
            {!generating && !text.trim() && (
              <div className="text-center text-text-muted">
                <p className="text-3xl mb-1">🔳</p>
                <p className="text-[11px]">内容を入力するとプレビュー表示</p>
              </div>
            )}
            {error && (
              <p className="text-[12px] text-error">{error}</p>
            )}
            {previewDataUrl && !error && (
              <img src={previewDataUrl} alt="QR preview" className="w-40 h-40 rounded-lg border border-border" />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-t border-border flex gap-2 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-[13px] font-bold bg-white border-[1.5px] border-border text-text-secondary cursor-pointer tap-feedback"
          >
            キャンセル
          </button>
          <button
            onClick={handleAdd}
            disabled={!text.trim() || !previewDataUrl}
            className="flex-1 py-3 rounded-xl text-[13px] font-bold bg-gradient-to-br from-primary to-accent text-white border-none cursor-pointer tap-feedback disabled:opacity-40"
          >
            キャンバスに追加
          </button>
        </div>
      </div>
    </div>
  )
}
