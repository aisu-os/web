import { useState, useCallback, useRef, useEffect } from 'react'
import { useDesktopStore } from '@/stores/use-desktop-store'
import type { MarqueeRect } from '@/types'

interface UseMarqueeSelectionOptions {
  containerRef: React.RefObject<HTMLElement | null>
}

export function useMarqueeSelection({ containerRef }: UseMarqueeSelectionOptions) {
  const [marqueeRect, setMarqueeRect] = useState<MarqueeRect | null>(null)
  const isActiveRef = useRef(false)
  const startRef = useRef({ x: 0, y: 0 })

  const selectItems = useDesktopStore((s) => s.selectItems)
  const clearSelection = useDesktopStore((s) => s.clearSelection)

  const rectsIntersect = useCallback(
    (a: MarqueeRect, b: { left: number; top: number; right: number; bottom: number }) => {
      return !(
        a.left > b.right ||
        a.left + a.width < b.left ||
        a.top > b.bottom ||
        a.top + a.height < b.top
      )
    }, []
  )

  const findIntersectingItems = useCallback(
    (rect: MarqueeRect): string[] => {
      const container = containerRef.current
      if (!container) return []

      const matchedIds: string[] = []
      const containerRect = container.getBoundingClientRect()
      const itemElements = container.querySelectorAll('[data-desktop-item-id]')

      itemElements.forEach((el) => {
        const itemId = el.getAttribute('data-desktop-item-id')
        if (!itemId) return

        const elRect = el.getBoundingClientRect()

        const relativeRect = {
          left: elRect.left - containerRect.left,
          top: elRect.top - containerRect.top,
          right: elRect.right - containerRect.left,
          bottom: elRect.bottom - containerRect.top,
        }

        if (rectsIntersect(rect, relativeRect)) {
          matchedIds.push(itemId)
        }
      })

      return matchedIds
    }, [containerRef, rectsIntersect]
  )

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button !== 0) return

    const target = e.target as HTMLElement
    if (target.closest('[data-desktop-item-id]')) return

    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()

    isActiveRef.current = true
    startRef.current = {
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    }

    if (!e.metaKey && !e.ctrlKey) {
      clearSelection()
    }
  }, [containerRef, clearSelection])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isActiveRef.current) return

    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()

    const currentX = e.clientX - containerRect.left
    const currentY = e.clientY - containerRect.top

    const rect: MarqueeRect = {
      left: Math.min(startRef.current.x, currentX),
      top: Math.min(startRef.current.y, currentY),
      width: Math.abs(currentX - startRef.current.x),
      height: Math.abs(currentY - startRef.current.y),
    }

    setMarqueeRect(rect)

    const intersecting = findIntersectingItems(rect)
    selectItems(intersecting)
  }, [containerRef, findIntersectingItems, selectItems])

  const handleMouseUp = useCallback(() => {
    isActiveRef.current = false
    setMarqueeRect(null)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [containerRef, handleMouseDown, handleMouseMove, handleMouseUp])

  return { marqueeRect }
}
