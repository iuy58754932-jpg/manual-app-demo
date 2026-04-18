import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

interface CanvasProps {
  canvasId: string
  onContainerReady: (container: HTMLDivElement) => void
}

export interface CanvasHandle {
  getContainer: () => HTMLDivElement | null
}

const CanvasComponent = forwardRef<CanvasHandle, CanvasProps>(({ canvasId, onContainerReady }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
  }))

  useEffect(() => {
    if (containerRef.current) {
      onContainerReady(containerRef.current)
    }
  }, [onContainerReady])

  return (
    <div ref={containerRef} className="flex-1 overflow-auto bg-bg p-2">
      <div className="shadow-[0_2px_12px_rgba(30,39,97,0.08)] mx-auto">
        <canvas id={canvasId} />
      </div>
    </div>
  )
})

CanvasComponent.displayName = 'CanvasComponent'
export default CanvasComponent
