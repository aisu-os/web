import { useEffect, useRef, type RefObject } from 'react'

interface UseClickOutsideOptions {
  onContextMenu?: boolean
  onEscape?: boolean
}

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
  options?: UseClickOutsideOptions,
) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callbackRef.current()
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') callbackRef.current()
    }

    requestAnimationFrame(() => {
      document.addEventListener('mousedown', handleMouseDown)
      if (options?.onContextMenu) {
        document.addEventListener('contextmenu', handleMouseDown)
      }
      if (options?.onEscape) {
        document.addEventListener('keydown', handleKeyDown)
      }
    })

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      if (options?.onContextMenu) {
        document.removeEventListener('contextmenu', handleMouseDown)
      }
      if (options?.onEscape) {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [ref, options?.onContextMenu, options?.onEscape])
}
