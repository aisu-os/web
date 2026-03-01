import { useEffect, useRef } from 'react'
import { useDragDropStore, getDropTargetKey } from '@/stores/use-drag-drop-store'
import type { DragSource, DragItem, DropTarget } from '@/types'

interface UseDropTargetOptions {
  target: DropTarget
  elementRef: React.RefObject<HTMLElement | null>
  accepts?: (source: DragSource, items: DragItem[]) => boolean
}

export function useDropTarget(options: UseDropTargetOptions) {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const idRef = useRef(getDropTargetKey(options.target))

  // Update id when target changes
  useEffect(() => {
    idRef.current = getDropTargetKey(optionsRef.current.target)
  }, [options.target.type, options.target.path, options.target.windowId])

  useEffect(() => {
    const element = optionsRef.current.elementRef.current
    if (!element) return

    const id = idRef.current
    const accepts = optionsRef.current.accepts ?? (() => true)

    useDragDropStore.getState().registerDropTarget({
      id,
      element,
      target: optionsRef.current.target,
      accepts,
    })

    return () => {
      useDragDropStore.getState().unregisterDropTarget(id)
    }
  }, [options.target.type, options.target.path, options.target.windowId])

  // Check if cursor is over this drop target
  const session = useDragDropStore((s) => s.session)
  const activeDropTarget = session?.activeDropTarget

  const isOver = activeDropTarget !== null && activeDropTarget !== undefined &&
    getDropTargetKey(activeDropTarget) === idRef.current

  const canDrop = session !== null && isOver

  return { isOver, canDrop, isDragActive: session !== null }
}
