import { useState, useCallback, useEffect, useRef } from 'react'
import {
  searchUnsplash,
  fetchImageAsDataUrl,
  trackDownload,
  isUnsplashConfigured,
  type UnsplashPhoto,
} from '../../lib/unsplash'
import { showToast } from '../common/Toast'

interface ImageSearchModalProps {
  open: boolean
  onClose: () => void
  onSelect: (dataUrl: string) => void
}

// Suggested keywords (English works best on Unsplash)
const SUGGESTIONS = [
  'office', 'meeting', 'kitchen', 'cleaning',
  'safety', 'construction', 'food', 'medical',
]

export default function ImageSearchModal({ open, onClose, onSelect }: ImageSearchModalProps) {
  const [query, setQuery] = useState('')
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) {
      // Reset state + focus input
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      // Clear on close
      setQuery('')
      setPhotos([])
      setError(null)
      setHasSearched(false)
      setDownloadingId(null)
    }
  }, [open])

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    setLoading(true)
    setError(null)
    setHasSearched(true)
    try {
      const result = await searchUnsplash(trimmed)
      setPhotos(result.results)
      if (result.results.length === 0) {
        setError('検索結果がありません。別のキーワードをお試しください。')
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg === 'UNSPLASH_NOT_CONFIGURED') {
        setError('Unsplash APIキーが未設定です。開発者にお問い合わせください。')
      } else if (msg === 'UNSPLASH_AUTH_FAILED') {
        setError('APIキーが無効です。')
      } else if (msg === 'UNSPLASH_RATE_LIMITED') {
        setError('検索回数の上限に達しました。しばらくお待ちください。')
      } else {
        setError('検索に失敗しました。通信をご確認ください。')
      }
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSelect = useCallback(async (photo: UnsplashPhoto) => {
    setDownloadingId(photo.id)
    try {
      // Use 'regular' size (~1080px width) — good balance of quality vs size
      const dataUrl = await fetchImageAsDataUrl(photo.urls.regular)
      // Track download per Unsplash ToS
      trackDownload(photo.links.download_location)
      onSelect(dataUrl)
      showToast('画像を追加しました')
      onClose()
    } catch {
      showToast('画像の取得に失敗しました')
    } finally {
      setDownloadingId(null)
    }
  }, [onSelect, onClose])

  const handleSuggestionClick = useCallback((keyword: string) => {
    setQuery(keyword)
    runSearch(keyword)
  }, [runSearch])

  if (!open) return null

  const configured = isUnsplashConfigured()

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[440px] h-[80vh] max-h-[640px] overflow-hidden flex flex-col shadow-[0_8px_32px_rgba(30,39,97,0.12)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="text-[16px] font-bold text-text-primary">画像を検索</h3>
            <p className="text-[10px] text-text-muted">Unsplash（商用利用OK）</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted text-[22px] bg-transparent border-none cursor-pointer px-2"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* Search form / config warning */}
        <div className="px-4 py-3 border-b border-border shrink-0">
          {!configured ? (
            <div className="text-[12px] text-error bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="font-bold mb-1">⚠️ APIキー未設定</p>
              <p className="text-[11px]">
                .env ファイルに <code className="bg-white px-1 rounded">VITE_UNSPLASH_ACCESS_KEY</code> を設定してください。
              </p>
              <p className="text-[11px] mt-1">
                取得先: <a href="https://unsplash.com/developers" target="_blank" rel="noopener noreferrer" className="underline">unsplash.com/developers</a>
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') runSearch(query) }}
                  placeholder="例: office, meeting, kitchen..."
                  className="flex-1 px-3 py-2 border-[1.5px] border-border rounded-lg text-[13px] outline-none focus:border-accent font-[inherit]"
                />
                <button
                  onClick={() => runSearch(query)}
                  disabled={loading || !query.trim()}
                  className="bg-accent text-white px-4 py-2 rounded-lg text-[13px] font-bold border-none cursor-pointer disabled:opacity-50 tap-feedback"
                >
                  {loading ? '...' : '検索'}
                </button>
              </div>
              {!hasSearched && (
                <div className="mt-3">
                  <p className="text-[10px] text-text-muted mb-1.5">おすすめキーワード:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => handleSuggestionClick(kw)}
                        className="text-[11px] bg-sky text-primary px-2.5 py-1 rounded-full border-none cursor-pointer hover:bg-ice tap-feedback"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-3 bg-bg">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-text-muted">
              <div className="w-10 h-10 border-4 border-border border-t-accent rounded-full animate-spin mb-3" />
              <p className="text-[13px]">検索中...</p>
            </div>
          )}
          {!loading && error && (
            <div className="text-center py-12 text-text-muted">
              <p className="text-[13px]">{error}</p>
            </div>
          )}
          {!loading && !error && !hasSearched && configured && (
            <div className="text-center py-12 text-text-muted">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-[13px]">キーワードを入力して検索してください</p>
              <p className="text-[11px] mt-2">※ 英語での検索がおすすめです</p>
            </div>
          )}
          {!loading && !error && photos.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {photos.map((p) => {
                const isDownloading = downloadingId === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    disabled={downloadingId !== null}
                    className="relative w-full aspect-square overflow-hidden rounded-lg bg-white cursor-pointer border-2 border-transparent hover:border-accent tap-feedback transition-all disabled:opacity-50"
                  >
                    <img
                      src={p.urls.thumb}
                      alt={p.alt_description || ''}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                      <p className="text-white text-[9px] truncate">📷 {p.user.name}</p>
                    </div>
                    {isDownloading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer attribution (Unsplash ToS) */}
        <div className="px-4 py-2 border-t border-border text-[10px] text-text-muted text-center shrink-0 bg-white">
          画像提供:{' '}
          <a
            href="https://unsplash.com?utm_source=manual_app&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Unsplash
          </a>
          {' '}— 商用利用可・帰属表示不要
        </div>
      </div>
    </div>
  )
}
