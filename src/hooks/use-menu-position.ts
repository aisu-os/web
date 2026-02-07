import { useState, useLayoutEffect, type RefObject } from 'react'

export function useMenuPosition(
  menuRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  position: { x: number; y: number },
) {
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) {
      setAdjustedPosition(position)
      return
    }

    const rect = menuRef.current.getBoundingClientRect()
    let { x, y } = position

    if (rect.right > window.innerWidth) {
      x = position.x - rect.width
    }
    if (rect.bottom > window.innerHeight) {
      y = position.y - rect.height
    }

    setAdjustedPosition({ x, y })
  }, [isOpen, position])

  return adjustedPosition
}
