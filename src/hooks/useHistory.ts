import { useRef, useCallback, useState } from 'react'

const MAX_HISTORY = 30

export function useHistory() {
  const undoStack = useRef<string[]>([])
  const redoStack = useRef<string[]>([])
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const isProgrammatic = useRef(false)

  const updateState = useCallback(() => {
    setCanUndo(undoStack.current.length > 0)
    setCanRedo(redoStack.current.length > 0)
  }, [])

  const pushState = useCallback((json: string) => {
    if (isProgrammatic.current) return
    undoStack.current.push(json)
    if (undoStack.current.length > MAX_HISTORY) {
      undoStack.current.shift()
    }
    redoStack.current = []
    updateState()
  }, [updateState])

  const undo = useCallback((currentJson: string): string | null => {
    if (undoStack.current.length === 0) return null
    const prev = undoStack.current.pop()!
    redoStack.current.push(currentJson)
    updateState()
    return prev
  }, [updateState])

  const redo = useCallback((currentJson: string): string | null => {
    if (redoStack.current.length === 0) return null
    const next = redoStack.current.pop()!
    undoStack.current.push(currentJson)
    updateState()
    return next
  }, [updateState])

  const clear = useCallback(() => {
    undoStack.current = []
    redoStack.current = []
    updateState()
  }, [updateState])

  return { pushState, undo, redo, canUndo, canRedo, clear, isProgrammatic }
}
