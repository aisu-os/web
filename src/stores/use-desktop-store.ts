import { create } from 'zustand'
import type { DesktopItem } from '@/types'
import { DEFAULT_DESKTOP_ITEMS } from '@/shell/desktop/desktop.constants'

interface ContextMenuState {
  isOpen: boolean
  position: { x: number; y: number }
  targetItemId?: string
}

interface DesktopStore {
  items: DesktopItem[]
  updateItemPosition: (id: string, position: { x: number; y: number }) => void

  selectedIds: Set<string>
  selectItem: (id: string, additive?: boolean) => void
  selectItems: (ids: string[]) => void
  clearSelection: () => void
  selectAll: () => void

  contextMenu: ContextMenuState
  openContextMenu: (x: number, y: number, targetItemId?: string) => void
  closeContextMenu: () => void
}

export const useDesktopStore = create<DesktopStore>((set) => ({
  items: DEFAULT_DESKTOP_ITEMS,

  updateItemPosition: (id, position) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, position } : item
      ),
    })),

  selectedIds: new Set<string>(),

  selectItem: (id, additive = false) =>
    set((state) => {
      if (additive) {
        const next = new Set(state.selectedIds)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return { selectedIds: next }
      }
      return { selectedIds: new Set([id]) }
    }),

  selectItems: (ids) =>
    set({ selectedIds: new Set(ids) }),

  clearSelection: () =>
    set({ selectedIds: new Set() }),

  selectAll: () =>
    set((state) => ({
      selectedIds: new Set(state.items.map((i) => i.id)),
    })),

  contextMenu: { isOpen: false, position: { x: 0, y: 0 } },

  openContextMenu: (x, y, targetItemId) =>
    set({
      contextMenu: { isOpen: true, position: { x, y }, targetItemId },
    }),

  closeContextMenu: () =>
    set({
      contextMenu: { isOpen: false, position: { x: 0, y: 0 }, targetItemId: undefined },
    }),
}))
