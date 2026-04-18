import { useState, useCallback, useEffect, createContext, useContext } from 'react'

interface ToastState {
  message: string
  visible: boolean
}

type ShowToast = (message: string) => void

const ToastContext = createContext<ShowToast>(() => {})

let globalShowToast: ShowToast = () => {}

export function useToast(): ShowToast {
  return useContext(ToastContext)
}

export function showToast(message: string) {
  globalShowToast(message)
}

export function Toaster() {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false })

  const show = useCallback((message: string) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000)
  }, [])

  useEffect(() => {
    globalShowToast = show
  }, [show])

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-secondary text-white px-6 py-3 rounded-[10px] text-[13px] font-medium z-[300] pointer-events-none whitespace-nowrap transition-all duration-300 ${
        toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      {toast.message}
    </div>
  )
}
