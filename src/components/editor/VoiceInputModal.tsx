import { useEffect, useState, useCallback } from 'react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'

interface VoiceInputModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (text: string) => void
}

export default function VoiceInputModal({ open, onClose, onSubmit }: VoiceInputModalProps) {
  const { supported, listening, transcript, interim, error, start, stop, reset } = useSpeechRecognition('ja-JP')
  const [editedText, setEditedText] = useState('')

  useEffect(() => {
    if (!open) {
      stop()
      reset()
      setEditedText('')
    }
  }, [open, stop, reset])

  // Keep edited text in sync with transcript (user can still edit manually)
  useEffect(() => {
    const combined = (transcript + (interim ? ' ' + interim : '')).trim()
    if (listening) {
      setEditedText(combined)
    } else if (transcript && !editedText) {
      setEditedText(transcript)
    }
  }, [transcript, interim, listening]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = useCallback(() => {
    if (listening) {
      stop()
    } else {
      reset()
      setEditedText('')
      start()
    }
  }, [listening, start, stop, reset])

  const handleSubmit = useCallback(() => {
    const text = editedText.trim()
    if (!text) return
    onSubmit(text)
    onClose()
  }, [editedText, onSubmit, onClose])

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
            <h3 className="text-[16px] font-bold text-text-primary">音声入力</h3>
            <p className="text-[10px] text-text-muted">話した内容がテキストになります</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted text-[22px] bg-transparent border-none cursor-pointer px-2"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center gap-4">
          {!supported ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">😔</p>
              <p className="text-[14px] font-bold text-text-primary mb-2">お使いのブラウザは対応していません</p>
              <p className="text-[11px] text-text-muted leading-relaxed">
                音声入力には Chrome / Safari / Edge<br />
                が必要です。
              </p>
            </div>
          ) : (
            <>
              {/* Mic button */}
              <button
                onClick={handleToggle}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-[40px] border-none cursor-pointer transition-all tap-feedback shadow-lg ${
                  listening
                    ? 'bg-error text-white animate-pulse'
                    : 'bg-gradient-to-br from-primary to-accent text-white hover:shadow-xl'
                }`}
                aria-label={listening ? '停止' : '開始'}
              >
                {listening ? '⏹' : '🎤'}
              </button>
              <p className="text-[12px] font-bold text-text-secondary">
                {listening ? '話してください...' : 'マイクをタップして開始'}
              </p>

              {/* Error */}
              {error && (
                <div className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-[11px] text-error">
                  ⚠️ {error}
                </div>
              )}

              {/* Transcript / editable */}
              <div className="w-full">
                <label className="block text-[11px] font-bold text-text-muted mb-1">
                  認識結果 {listening && <span className="text-error">●録音中</span>}
                </label>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  placeholder={listening ? '認識中...' : '話した内容がここに表示されます（手動編集も可）'}
                  rows={4}
                  className="w-full px-3 py-2 border-[1.5px] border-border rounded-lg text-[13px] outline-none focus:border-accent font-[inherit] resize-none"
                />
                {listening && interim && (
                  <p className="text-[10px] text-text-muted mt-1 italic">認識中: {interim}</p>
                )}
              </div>
            </>
          )}
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
            onClick={handleSubmit}
            disabled={!editedText.trim() || !supported}
            className="flex-1 py-3 rounded-xl text-[13px] font-bold bg-gradient-to-br from-primary to-accent text-white border-none cursor-pointer tap-feedback disabled:opacity-40"
          >
            テキストとして追加
          </button>
        </div>
      </div>
    </div>
  )
}
