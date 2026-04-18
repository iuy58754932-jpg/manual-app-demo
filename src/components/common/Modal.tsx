import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-5"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-[440px] max-h-[80vh] overflow-y-auto shadow-[0_8px_32px_rgba(30,39,97,0.12)] animate-[modalIn_0.3s_ease]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-[16px] font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-muted text-[22px] bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  )
}
