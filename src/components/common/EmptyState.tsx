import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  children?: ReactNode  // CTAs go here
  variant?: 'files' | 'search' | 'default'
}

/** Decorative illustration matching the Kitchen theme */
function Illustration({ variant }: { variant: 'files' | 'search' | 'default' }) {
  if (variant === 'search') {
    return (
      <svg viewBox="0 0 160 120" className="w-40 h-28 mb-3">
        <circle cx="70" cy="55" r="32" fill="none" stroke="currentColor" strokeWidth="4" className="text-border dark:text-dark-border" />
        <line x1="92" y1="77" x2="118" y2="100" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-primary" />
        <path d="M 55 45 Q 70 35 85 45" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-accent" />
        <circle cx="58" cy="55" r="2.5" fill="currentColor" className="text-text-muted" />
        <circle cx="82" cy="55" r="2.5" fill="currentColor" className="text-text-muted" />
      </svg>
    )
  }

  // Default: paper + pencil illustration
  return (
    <svg viewBox="0 0 160 130" className="w-40 h-32 mb-3">
      {/* Back paper (tilted) */}
      <rect x="22" y="34" width="66" height="82" rx="5" fill="currentColor" className="text-bg-warm dark:text-dark-card-alt" transform="rotate(-6 55 75)" stroke="currentColor" strokeWidth="1.5" />
      {/* Front paper */}
      <rect x="32" y="28" width="66" height="82" rx="5" fill="currentColor" className="text-card dark:text-dark-card" />
      <rect x="32" y="28" width="66" height="82" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-border dark:text-dark-border" />
      {/* Title stripe */}
      <rect x="40" y="36" width="22" height="4" rx="2" fill="currentColor" className="text-primary" />
      {/* Text lines */}
      <rect x="40" y="46" width="50" height="2.5" rx="1" fill="currentColor" className="text-border dark:text-dark-border" />
      <rect x="40" y="52" width="50" height="2.5" rx="1" fill="currentColor" className="text-border dark:text-dark-border" />
      <rect x="40" y="58" width="30" height="2.5" rx="1" fill="currentColor" className="text-border dark:text-dark-border" />
      {/* Image placeholder */}
      <rect x="40" y="66" width="50" height="24" rx="3" fill="currentColor" className="text-bg-warm dark:text-dark-card-alt" stroke="currentColor" strokeWidth="1" />
      <circle cx="50" cy="77" r="2.5" fill="currentColor" className="text-primary" />
      <path d="M 44 86 L 56 75 L 66 82 L 86 68 L 86 88 L 44 88 Z" fill="currentColor" className="text-border dark:text-dark-border" opacity="0.7" />
      {/* Line on bottom */}
      <rect x="40" y="96" width="45" height="2.5" rx="1" fill="currentColor" className="text-border dark:text-dark-border" />
      {/* Pencil (crossing the paper) */}
      <g transform="translate(93 89) rotate(34)">
        <rect x="0" y="0" width="38" height="7" fill="currentColor" className="text-primary" />
        <rect x="-4" y="0" width="4" height="7" fill="currentColor" className="text-accent" />
        <polygon points="38,0 46,3.5 38,7" fill="currentColor" className="text-text-primary dark:text-dark-text" />
      </g>
      {/* Sparkles */}
      <text x="115" y="40" fontSize="14" fill="currentColor" fontWeight="700" className="text-primary">+</text>
      <text x="16" y="24" fontSize="10" fill="currentColor" fontWeight="700" className="text-accent">+</text>
      <text x="124" y="112" fontSize="10" fill="currentColor" fontWeight="700" className="text-border dark:text-dark-border">+</text>
    </svg>
  )
}

export default function EmptyState({
  title,
  description,
  children,
  variant = 'default',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="text-text-muted dark:text-dark-text-muted">
        <Illustration variant={variant} />
      </div>
      <h3 className="font-display text-[16px] font-bold text-text-primary dark:text-dark-text mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-[12px] text-text-muted dark:text-dark-text-muted mb-4 max-w-xs">
          {description}
        </p>
      )}
      {children && <div className="flex gap-2 mt-2 flex-wrap justify-center">{children}</div>}
    </div>
  )
}
