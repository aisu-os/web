import { create } from 'zustand'
import type { DragSource, DragItem, DragSession, DropTarget, DropTargetRegistration } from '@/types'
import { useFileSystemStore } from '@/stores/use-file-system-store'
import { useDesktopStore } from '@/stores/use-desktop-store'

// Drop target priority
const TARGET_PRIORITY: Record<DropTarget['type'], number> = {
  'folder-item': 3,
  'file-manager-content': 2,
  'desktop': 1,
}

function getDropTargetKey(target: DropTarget): string {
  if (target.type === 'desktop') return 'desktop'
  if (target.type === 'file-manager-content') return `fm:${target.windowId}:content`
  return `folder:${target.path}:${target.windowId ?? 'desktop'}`
}

interface DragDropState {
  session: DragSession | null
  dropTargets: Map<string, DropTargetRegistration>
}

interface DragDropActions {
  startDrag: (source: DragSource, items: DragItem[], cursorPos: { x: number; y: number }) => void
  updateCursor: (x: number, y: number, altKey: boolean) => void
  endDrag: () => void
  cancelDrag: () => void
  registerDropTarget: (registration: DropTargetRegistration) => void
  unregisterDropTarget: (id: string) => void
}

export const useDragDropStore = create<DragDropState & DragDropActions>((set, get) => ({
  session: null,
  dropTargets: new Map(),

  startDrag: (source, items, cursorPos) => {
    set({
      session: {
        source,
        items,
        operation: 'move',
        cursorPosition: cursorPos,
        activeDropTarget: null,
      },
    })
  },

  updateCursor: (x, y, altKey) => {
    const { session, dropTargets } = get()
    if (!session) return

    const operation = altKey ? 'copy' : 'move'

    // Hit-test: check all drop targets
    // Step 1: determine which targets contain the cursor
    let bestTarget: DropTarget | null = null
    let bestPriority = 0
    let cursorInsideFmContent = false

    for (const reg of dropTargets.values()) {
      const rect = reg.element.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        // Mark if cursor is inside FM content area
        if (reg.target.type === 'file-manager-content') {
          cursorInsideFmContent = true
        }

        // Check accepts filter
        if (!reg.accepts(session.source, session.items)) continue

        const priority = TARGET_PRIORITY[reg.target.type] ?? 0
        if (priority > bestPriority) {
          bestPriority = priority
          bestTarget = reg.target
        }
      }
    }

    // Step 2: if cursor is inside FM window and only desktop matched — block
    // (FM window is inside desktop div, so desktop also gets hit)
    if (bestTarget?.type === 'desktop' && cursorInsideFmContent) {
      bestTarget = null
    }

    set({
      session: {
        ...session,
        cursorPosition: { x, y },
        operation,
        activeDropTarget: bestTarget,
      },
    })
  },

  endDrag: () => {
    const { session } = get()
    if (!session || !session.activeDropTarget) {
      set({ session: null })
      return
    }

    const { source, items, activeDropTarget, operation } = session
    const fs = useFileSystemStore.getState()
    const desktop = useDesktopStore.getState()

    const isCopy = operation === 'copy'
    const fileOp = isCopy ? fs.copyNode : fs.moveNode

    for (const item of items) {
      let destPath: string

      if (activeDropTarget.type === 'desktop') {
        destPath = '/Desktop'
      } else if (activeDropTarget.type === 'file-manager-content') {
        destPath = activeDropTarget.path
      } else {
        // folder-item
        destPath = activeDropTarget.path
      }

      const result = fileOp(item.path, destPath)
      if (!result) continue

      // Desktop sync
      if (source.type === 'desktop' && !isCopy) {
        // Moved from desktop — remove from desktop
        desktop.removeItemByFsPath(item.path)
      }

      if (activeDropTarget.type === 'desktop') {
        // Dropping onto desktop — create new desktop item
        const cursorPos = session.cursorPosition
        desktop.addItemFromFileSystem(result.newPath, { x: cursorPos.x - 40, y: cursorPos.y - 40 })
      }
    }

    set({ session: null })
  },

  cancelDrag: () => {
    set({ session: null })
  },

  registerDropTarget: (registration) => {
    set((state) => {
      const newTargets = new Map(state.dropTargets)
      newTargets.set(registration.id, registration)
      return { dropTargets: newTargets }
    })
  },

  unregisterDropTarget: (id) => {
    set((state) => {
      const newTargets = new Map(state.dropTargets)
      newTargets.delete(id)
      return { dropTargets: newTargets }
    })
  },
}))

export { getDropTargetKey }
