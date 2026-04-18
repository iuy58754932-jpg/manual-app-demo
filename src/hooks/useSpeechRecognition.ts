import { useEffect, useRef, useState, useCallback } from 'react'

// Web Speech API minimal types (browsers still prefix or expose via window)
// We define just enough to type-check our usage.
interface SRAlternative { transcript: string; confidence: number }
interface SRResult { 0: SRAlternative; isFinal: boolean; length: number }
interface SRResultList { [index: number]: SRResult; length: number }
interface SREvent extends Event { results: SRResultList; resultIndex: number }
interface SRErrorEvent extends Event { error: string }

interface SRInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: SREvent) => void) | null
  onerror: ((e: SRErrorEvent) => void) | null
  onstart: ((e: Event) => void) | null
  onend: ((e: Event) => void) | null
}

type SRConstructor = new () => SRInstance

function getRecognitionCtor(): SRConstructor | null {
  const w = window as unknown as {
    SpeechRecognition?: SRConstructor
    webkitSpeechRecognition?: SRConstructor
  }
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

export interface UseSpeechRecognitionResult {
  /** True when the browser supports Web Speech API */
  supported: boolean
  /** True while actively listening */
  listening: boolean
  /** Finalized transcript so far */
  transcript: string
  /** Unstable partial result (updates as user speaks) */
  interim: string
  /** Last error message, if any */
  error: string | null
  /** Start listening (must be called from a user gesture) */
  start: () => void
  /** Stop listening; keeps transcript */
  stop: () => void
  /** Clear transcript and error */
  reset: () => void
}

export function useSpeechRecognition(lang = 'ja-JP'): UseSpeechRecognitionResult {
  const Ctor = getRecognitionCtor()
  const supported = Ctor !== null

  const recRef = useRef<SRInstance | null>(null)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Ctor) return
    const rec = new Ctor()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = lang

    rec.onstart = () => { setListening(true); setError(null) }
    rec.onend = () => { setListening(false); setInterim('') }
    rec.onerror = (e: SRErrorEvent) => {
      setListening(false)
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError('マイクの使用が許可されていません')
      } else if (e.error === 'no-speech') {
        setError('音声が検出されませんでした')
      } else if (e.error === 'audio-capture') {
        setError('マイクが見つかりません')
      } else if (e.error === 'network') {
        setError('ネットワークエラーが発生しました')
      } else {
        setError(`エラー: ${e.error}`)
      }
    }
    rec.onresult = (e: SREvent) => {
      let finalText = ''
      let interimText = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i]
        const alt = result[0]
        if (result.isFinal) {
          finalText += alt.transcript
        } else {
          interimText += alt.transcript
        }
      }
      if (finalText) {
        setTranscript((prev) => (prev ? prev + ' ' : '') + finalText.trim())
      }
      setInterim(interimText)
    }

    recRef.current = rec
    return () => {
      try { rec.abort() } catch { /* ignore */ }
      recRef.current = null
    }
  }, [Ctor, lang])

  const start = useCallback(() => {
    if (!recRef.current) return
    try {
      recRef.current.start()
    } catch {
      // Already started — safe to ignore
    }
  }, [])

  const stop = useCallback(() => {
    if (!recRef.current) return
    try { recRef.current.stop() } catch { /* ignore */ }
  }, [])

  const reset = useCallback(() => {
    setTranscript('')
    setInterim('')
    setError(null)
  }, [])

  return { supported, listening, transcript, interim, error, start, stop, reset }
}
