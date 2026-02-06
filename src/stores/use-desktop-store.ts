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

  selectedIds: string[]
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

  selectedIds: [],

  selectItem: (id, additive = false) =>
    set((state) => {
      if (additive) {
        return state.selectedIds.includes(id)
          ? { selectedIds: state.selectedIds.filter((sid) => sid !== id) }
          : { selectedIds: [...state.selectedIds, id] }
      }
      return { selectedIds: [id] }
    }),

  selectItems: (ids) =>
    set({ selectedIds: ids }),

  clearSelection: () =>
    set({ selectedIds: [] }),

  selectAll: () =>
    set((state) => ({
      selectedIds: state.items.map((i) => i.id),
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
