import { useRef, useState, useEffect, useCallback } from 'react'
import { useDragDropStore } from '@/stores/use-drag-drop-store'
import { useCursorStore } from '@/stores/use-cursor-store'
import type { DragSource, DragItem } from '@/types'

interface UseDragSourceOptions {
  source: DragSource
  getItems: () => DragItem[]
  threshold?: number
  shouldStart?: (e: React.MouseEvent) => boolean
  onDragStart?: () => void
  onDragMove?: (dx: number, dy: number) => void
  onDragEnd?: (wasDragged: boolean, didDrop: boolean) => void
}

export function useDragSource(options: UseDragSourceOptions) {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const [isDragging, setIsDragging] = useState(false)
  const stateRef = useRef({
    startX: 0,
    startY: 0,
    hasDragged: false,
    active: false,
  })
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => {
      cleanupRef.current?.()
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return

    const opts = optionsRef.current
    if (opts.shouldStart && !opts.shouldStart(e)) return

    e.preventDefault()

    stateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      hasDragged: false,
      active: true,
    }

    const threshold = opts.threshold ?? 3

    const handleMouseMove = (me: MouseEvent) => {
      const { startX, startY } = stateRef.current
      const dx = me.clientX - startX
      const dy = me.clientY - startY

      if (!stateRef.current.hasDragged) {
        if (Math.abs(dx) <= threshold && Math.abs(dy) <= threshold) return
        stateRef.current.hasDragged = true

        const items = optionsRef.current.getItems()
        if (items.length === 0) {
          cleanup()
          return
        }

        useDragDropStore.getState().startDrag(
          optionsRef.current.source,
          items,
          { x: me.clientX, y: me.clientY }
        )
        useCursorStore.getState().setCursorType('grabbing')
        setIsDragging(true)
        optionsRef.current.onDragStart?.()
      }

      useDragDropStore.getState().updateCursor(me.clientX, me.clientY, me.altKey)

      if (stateRef.current.hasDragged) {
        const { startX, startY } = stateRef.current
        optionsRef.current.onDragMove?.(me.clientX - startX, me.clientY - startY)
      }
    }

    const handleMouseUp = () => {
      const wasDragged = stateRef.current.hasDragged
      const session = useDragDropStore.getState().session
      const didDrop = wasDragged && session?.activeDropTarget != null

      if (wasDragged && session?.activeDropTarget) {
        useDragDropStore.getState().endDrag()
      } else if (wasDragged) {
        useDragDropStore.getState().cancelDrag()
      }

      cleanup()
      stateRef.current.active = false
      setIsDragging(false)
      useCursorStore.getState().resetCursor()
      optionsRef.current.onDragEnd?.(wasDragged, didDrop)
    }

    const handleKeyDown = (ke: KeyboardEvent) => {
      if (ke.key === 'Escape') {
        useDragDropStore.getState().cancelDrag()
        cleanup()
        stateRef.current.active = false
        stateRef.current.hasDragged = false
        setIsDragging(false)
        useCursorStore.getState().resetCursor()
        optionsRef.current.onDragEnd?.(false, false)
      }
    }

    const cleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('keydown', handleKeyDown)
      cleanupRef.current = null
    }

    cleanupRef.current?.()
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('keydown', handleKeyDown)
    cleanupRef.current = cleanup
  }, [])

  return { handleMouseDown, isDragging }
}
