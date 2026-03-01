import { create } from 'zustand'
import type { DesktopItem, FileType } from '@/types'
import { useFileSystemStore } from '@/stores/use-file-system-store'
import { updateDesktopPositions } from '@/services/api/fs-service'

interface ContextMenuState {
  isOpen: boolean
  position: { x: number; y: number }
  targetItemId?: string
}

function getIconForType(type: FileType): DesktopItem['icon'] {
  return type === 'directory' ? 'folder' : 'generic-file'
}

function findFreePosition(items: DesktopItem[]): { x: number; y: number } {
  const occupied = new Set(items.map((i) => `${i.position.x},${i.position.y}`))
  const startX = 24
  const startY = 48
  const stepY = 104

  let x = startX
  let y = startY
  while (occupied.has(`${x},${y}`)) {
    y += stepY
    if (y > 800) {
      y = startY
      x += 100
    }
  }
  return { x, y }
}

function generateUniqueDesktopName(items: DesktopItem[], baseName: string): string {
  const names = new Set(items.map((i) => i.name.toLowerCase()))
  if (!names.has(baseName.toLowerCase())) return baseName
  let counter = 2
  while (names.has(`${baseName} ${counter}`.toLowerCase())) {
    counter++
  }
  return `${baseName} ${counter}`
}

let positionSyncTimer: ReturnType<typeof setTimeout> | null = null
const POSITION_SYNC_DELAY = 500

function schedulePositionSync(items: DesktopItem[]) {
  if (positionSyncTimer) clearTimeout(positionSyncTimer)
  positionSyncTimer = setTimeout(() => {
    positionSyncTimer = null
    const positions = items.map((item) => ({
      path: item.fsPath,
      x: Math.round(item.position.x),
      y: Math.round(item.position.y),
    }))
    updateDesktopPositions(positions).catch(() => {
      // Silent failure — position is correct in UI, may be stale after next reload
    })
  }, POSITION_SYNC_DELAY)
}

interface DesktopStore {
  items: DesktopItem[]
  updateItemPosition: (id: string, position: { x: number; y: number }) => void
  addItem: (item: DesktopItem) => void
  removeItem: (id: string) => void
  renameItem: (id: string, newName: string) => void
  loadDesktopItems: () => void

  selectedIds: string[]
  selectItem: (id: string, additive?: boolean) => void
  selectItems: (ids: string[]) => void
  clearSelection: () => void
  selectAll: () => void

  contextMenu: ContextMenuState
  openContextMenu: (x: number, y: number, targetItemId?: string) => void
  closeContextMenu: () => void

  editingItemId: string | null
  editingMode: 'rename' | 'create' | null
  startCreating: (type: FileType) => void
  startRenaming: (id: string) => void
  commitEditing: (name: string) => void
  cancelEditing: () => void

  addItemFromFileSystem: (fsPath: string, position: { x: number; y: number }) => void
  removeItemByFsPath: (fsPath: string) => void
  getItemByFsPath: (fsPath: string) => DesktopItem | undefined
  updateItemFsPath: (id: string, newFsPath: string) => void
  getFreePosition: () => { x: number; y: number }
}

export const useDesktopStore = create<DesktopStore>((set, get) => ({
  items: [],

  loadDesktopItems: () => {
    const fs = useFileSystemStore.getState()
    const children = fs.getChildren('/Desktop')
    const { items: existingItems, editingItemId } = get()

    // Empty desktop — nothing on server
    if (children.length === 0) {
      // Preserve item in editing mode
      if (editingItemId) {
        const editingItem = existingItems.find((i) => i.id === editingItemId)
        set({ items: editingItem ? [editingItem] : [] })
      } else {
        set({ items: [] })
      }
      return
    }

    // Map existing items by fsPath (to preserve positions)
    const existingByFsPath = new Map(existingItems.map((i) => [i.fsPath, i]))

    // Merge strategy: new list based on server children
    const mergedItems: DesktopItem[] = []
    const nodesWithoutPos: typeof children = []

    for (const node of children) {
      const existing = existingByFsPath.get(node.path)
      if (existing) {
        // Existing item — preserve position, update name/type
        mergedItems.push({
          ...existing,
          id: `desktop:${node.path}`,
          name: node.name,
          type: node.type,
          icon: getIconForType(node.type),
        })
      } else if (node.desktopX != null && node.desktopY != null) {
        // New item from server with position
        mergedItems.push({
          id: `desktop:${node.path}`,
          name: node.name,
          type: node.type,
          icon: getIconForType(node.type),
          position: { x: node.desktopX, y: node.desktopY },
          fsPath: node.path,
        })
      } else {
        nodesWithoutPos.push(node)
      }
    }

    // Find free positions for new elements without positions
    for (const node of nodesWithoutPos) {
      const pos = findFreePosition(mergedItems)
      mergedItems.push({
        id: `desktop:${node.path}`,
        name: node.name,
        type: node.type,
        icon: getIconForType(node.type),
        position: pos,
        fsPath: node.path,
      })
    }

    // Preserve item in editing mode (if not yet visible on server)
    if (editingItemId) {
      const editingItem = existingItems.find((i) => i.id === editingItemId)
      if (editingItem && !mergedItems.some((i) => i.fsPath === editingItem.fsPath)) {
        mergedItems.push(editingItem)
      }
    }

    set({ items: mergedItems })

    // Save positions to backend for elements without positions
    if (nodesWithoutPos.length > 0) {
      schedulePositionSync(mergedItems)
    }
  },

  updateItemPosition: (id, position) =>
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, position } : item
      )
      schedulePositionSync(newItems)
      return { items: newItems }
    }),

  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })),

  renameItem: (id, newName) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, name: newName } : item
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

  editingItemId: null,
  editingMode: null,

  startCreating: (type) => {
    const { items } = get()
    const baseName = type === 'directory' ? 'untitled folder' : 'untitled'
    const uniqueName = generateUniqueDesktopName(items, baseName)
    const position = findFreePosition(items)

    const fsPath = `/Desktop/${uniqueName}`
    const newItem: DesktopItem = {
      id: `desktop:${fsPath}`,
      name: uniqueName,
      type,
      icon: getIconForType(type),
      position,
      fsPath,
    }

    // Also create in file system
    const fs = useFileSystemStore.getState()
    fs.createNode('/Desktop', uniqueName, type)

    set((state) => {
      const newItems = [...state.items, newItem]
      schedulePositionSync(newItems)
      return {
        items: newItems,
        editingItemId: newItem.id,
        editingMode: 'create',
        selectedIds: [newItem.id],
      }
    })
  },

  startRenaming: (id) => {
    set({
      editingItemId: id,
      editingMode: 'rename',
      selectedIds: [id],
    })
  },

  commitEditing: (name) => {
    const { editingItemId, editingMode, items } = get()
    if (!editingItemId) return

    const trimmedName = name.trim()
    const item = items.find((i) => i.id === editingItemId)
    if (!item) {
      set({ editingItemId: null, editingMode: null })
      return
    }

    if (!trimmedName) {
      if (editingMode === 'create') {
        // Empty name — cancel creation
        const fs = useFileSystemStore.getState()
        fs.deleteNode(item.fsPath)
        set((state) => ({
          items: state.items.filter((i) => i.id !== editingItemId),
          editingItemId: null,
          editingMode: null,
          selectedIds: [],
        }))
      } else {
        set({ editingItemId: null, editingMode: null })
      }
      return
    }

    if (item.name === trimmedName) {
      set({ editingItemId: null, editingMode: null })
      return
    }

    // Check for name uniqueness
    const siblings = items.filter((i) => i.id !== editingItemId)
    if (siblings.some((i) => i.name.toLowerCase() === trimmedName.toLowerCase())) {
      // Name is duplicate — finish editing, keep unchanged
      set({ editingItemId: null, editingMode: null })
      return
    }

    // Also rename in file system
    const fs = useFileSystemStore.getState()
    fs.renameNode(item.fsPath, trimmedName)

    const newFsPath = `/Desktop/${trimmedName}`
    set((state) => ({
      items: state.items.map((i) =>
        i.id === editingItemId ? { ...i, name: trimmedName, fsPath: newFsPath, id: `desktop:${newFsPath}` } : i
      ),
      editingItemId: null,
      editingMode: null,
    }))
  },

  cancelEditing: () => {
    const { editingItemId, editingMode, items } = get()
    if (editingMode === 'create' && editingItemId) {
      const item = items.find((i) => i.id === editingItemId)
      if (item) {
        const fs = useFileSystemStore.getState()
        fs.deleteNode(item.fsPath)
      }
      set((state) => ({
        items: state.items.filter((i) => i.id !== editingItemId),
        editingItemId: null,
        editingMode: null,
        selectedIds: [],
      }))
    } else {
      set({ editingItemId: null, editingMode: null })
    }
  },

  addItemFromFileSystem: (fsPath, position) => {
    const fs = useFileSystemStore.getState()
    const node = fs.getNode(fsPath)
    if (!node) return

    const { items } = get()
    // If already on desktop, don't add
    if (items.some((i) => i.fsPath === fsPath)) return

    const newItem: DesktopItem = {
      id: `desktop:${fsPath}`,
      name: node.name,
      type: node.type,
      icon: getIconForType(node.type),
      position,
      fsPath,
    }
    set((state) => {
      const newItems = [...state.items, newItem]
      schedulePositionSync(newItems)
      return { items: newItems }
    })
  },

  removeItemByFsPath: (fsPath) =>
    set((state) => ({
      items: state.items.filter((i) => i.fsPath !== fsPath),
      selectedIds: state.selectedIds.filter(
        (sid) => !state.items.find((i) => i.id === sid && i.fsPath === fsPath)
      ),
    })),

  getItemByFsPath: (fsPath) => {
    return get().items.find((i) => i.fsPath === fsPath)
  },

  updateItemFsPath: (id, newFsPath) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, fsPath: newFsPath } : item
      ),
    })),

  getFreePosition: () => findFreePosition(get().items),
}))
