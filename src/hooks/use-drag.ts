import { useRef, useState, useEffect, useCallback } from 'react'

interface UseDragOptions {
  onDragStart?: () => void
  onDragMove: (dx: number, dy: number) => void
  onDragEnd?: (wasDragged: boolean) => void
  shouldStart?: (e: React.MouseEvent) => boolean
  threshold?: number
}

export function useDrag(options: UseDragOptions) {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const [isDragging, setIsDragging] = useState(false)
  const stateRef = useRef({ startX: 0, startY: 0, hasDragged: false, active: false })
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

    const threshold = opts.threshold ?? 0

    const handleMouseMove = (me: MouseEvent) => {
      const { startX, startY } = stateRef.current
      const dx = me.clientX - startX
      const dy = me.clientY - startY

      if (!stateRef.current.hasDragged) {
        if (Math.abs(dx) <= threshold && Math.abs(dy) <= threshold) return
        stateRef.current.hasDragged = true
        setIsDragging(true)
        optionsRef.current.onDragStart?.()
      }

      optionsRef.current.onDragMove(dx, dy)
    }

    const handleMouseUp = () => {
      const wasDragged = stateRef.current.hasDragged
      cleanup()
      setIsDragging(false)
      stateRef.current.active = false
      optionsRef.current.onDragEnd?.(wasDragged)
    }

    const cleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      cleanupRef.current = null
    }

    cleanupRef.current?.()
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    cleanupRef.current = cleanup

    if (threshold === 0) {
      stateRef.current.hasDragged = true
      setIsDragging(true)
      optionsRef.current.onDragStart?.()
    }
  }, [])

  return { handleMouseDown, isDragging }
}
