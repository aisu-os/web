import { createContext, useContext } from 'react'
import { create, useStore, type StoreApi } from 'zustand'
import type { FileType } from '@/types'
import type { ViewMode, SortKey, SortDirection } from '../file-manager.types'
import { useFileSystemStore } from '@/stores/use-file-system-store'
import { useWindowStore } from '@/stores/use-window-store'
import { setAppSetting } from '@/services/api/settings-service'

interface ContextMenuState {
  isOpen: boolean
  position: { x: number; y: number }
  targetPath?: string
}

interface FileManagerState {
  currentPath: string
  historyBack: string[]
  historyForward: string[]
  selectedPaths: string[]
  viewMode: ViewMode
  sortKey: SortKey
  sortDirection: SortDirection
  searchQuery: string
  isSidebarVisible: boolean
  showHiddenFiles: boolean
  columnSelections: string[]
  contextMenu: ContextMenuState
  editingPath: string | null
  editingMode: 'rename' | 'create' | null
}

interface FileManagerActions {
  navigateTo: (path: string) => void
  goBack: () => void
  goForward: () => void
  selectItem: (path: string, additive?: boolean) => void
  selectItems: (paths: string[]) => void
  clearSelection: () => void
  selectAll: (allPaths: string[]) => void
  setViewMode: (mode: ViewMode) => void
  setSortKey: (key: SortKey) => void
  toggleSortDirection: () => void
  setSearchQuery: (query: string) => void
  toggleSidebar: () => void
  toggleShowHiddenFiles: () => void
  setShowHiddenFiles: (show: boolean) => void
  setColumnSelection: (level: number, path: string) => void
  openContextMenu: (x: number, y: number, targetPath?: string) => void
  closeContextMenu: () => void
  startCreating: (type: FileType) => void
  startRenaming: (path: string) => void
  commitEditing: (name: string) => void
  cancelEditing: () => void
}

export type FileManagerStoreApi = StoreApi<FileManagerState & FileManagerActions>

export function createFileManagerStore(initialPath = '/Desktop', windowId?: string): FileManagerStoreApi {
  function syncPathToWindowProps(path: string): void {
    if (windowId) {
      useWindowStore.getState().setWindowProps(windowId, { initialPath: path })
    }
  }

  return create<FileManagerState & FileManagerActions>((set, get) => ({
    currentPath: initialPath,
    historyBack: [],
    historyForward: [],
    selectedPaths: [],
    viewMode: 'icon',
    sortKey: 'name',
    sortDirection: 'asc',
    searchQuery: '',
    isSidebarVisible: true,
    showHiddenFiles: false,
    columnSelections: buildColumnSelections(initialPath),
    contextMenu: {
      isOpen: false,
      position: { x: 0, y: 0 },
    },
    editingPath: null,
    editingMode: null,

    navigateTo: (path) => {
      const { currentPath } = get()
      if (path === currentPath) return
      set((state) => ({
        currentPath: path,
        historyBack: [...state.historyBack, currentPath],
        historyForward: [],
        selectedPaths: [],
        searchQuery: '',
        columnSelections: buildColumnSelections(path),
      }))
      syncPathToWindowProps(path)
    },

    goBack: () => {
      const { historyBack, currentPath } = get()
      if (historyBack.length === 0) return
      const prev = historyBack[historyBack.length - 1]
      set((state) => ({
        currentPath: prev,
        historyBack: state.historyBack.slice(0, -1),
        historyForward: [currentPath, ...state.historyForward],
        selectedPaths: [],
        searchQuery: '',
        columnSelections: buildColumnSelections(prev),
      }))
      syncPathToWindowProps(prev)
    },

    goForward: () => {
      const { historyForward, currentPath } = get()
      if (historyForward.length === 0) return
      const next = historyForward[0]
      set((state) => ({
        currentPath: next,
        historyBack: [...state.historyBack, currentPath],
        historyForward: state.historyForward.slice(1),
        selectedPaths: [],
        searchQuery: '',
        columnSelections: buildColumnSelections(next),
      }))
      syncPathToWindowProps(next)
    },

    selectItem: (path, additive = false) => {
      set((state) => {
        if (additive) {
          const exists = state.selectedPaths.includes(path)
          return {
            selectedPaths: exists
              ? state.selectedPaths.filter((p) => p !== path)
              : [...state.selectedPaths, path],
          }
        }
        return { selectedPaths: [path] }
      })
    },

    selectItems: (paths) => {
      set({ selectedPaths: paths })
    },

    clearSelection: () => {
      set({ selectedPaths: [] })
    },

    selectAll: (allPaths) => {
      set({ selectedPaths: allPaths })
    },

    setViewMode: (mode) => {
      set({ viewMode: mode })
    },

    setSortKey: (key) => {
      const { sortKey } = get()
      if (sortKey === key) {
        get().toggleSortDirection()
      } else {
        set({ sortKey: key, sortDirection: 'asc' })
      }
    },

    toggleSortDirection: () => {
      set((state) => ({
        sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
      }))
    },

    setSearchQuery: (query) => {
      set({ searchQuery: query })
    },

    toggleSidebar: () => {
      set((state) => ({ isSidebarVisible: !state.isSidebarVisible }))
    },

    toggleShowHiddenFiles: () => {
      const newValue = !get().showHiddenFiles
      set({ showHiddenFiles: newValue })
      setAppSetting('file-manager', 'showHiddenFiles', newValue).catch(() => {})
    },

    setShowHiddenFiles: (show) => {
      set({ showHiddenFiles: show })
    },

    setColumnSelection: (level, path) => {
      set((state) => {
        const newSelections = state.columnSelections.slice(0, level + 1)
        newSelections[level] = path
        return { columnSelections: newSelections }
      })
    },

    openContextMenu: (x, y, targetPath) => {
      set({
        contextMenu: {
          isOpen: true,
          position: { x, y },
          targetPath,
        },
      })
    },

    closeContextMenu: () => {
      set({
        contextMenu: {
          isOpen: false,
          position: { x: 0, y: 0 },
        },
      })
    },

    startCreating: (type) => {
      const { currentPath } = get()
      const fs = useFileSystemStore.getState()
      const baseName = type === 'directory' ? 'untitled folder' : 'untitled'
      const uniqueName = fs.generateUniqueName(currentPath, baseName)
      const newNode = fs.createNode(currentPath, uniqueName, type)
      if (!newNode) return

      set({
        editingPath: newNode.path,
        editingMode: 'create',
        selectedPaths: [newNode.path],
      })
    },

    startRenaming: (path) => {
      set({
        editingPath: path,
        editingMode: 'rename',
        selectedPaths: [path],
      })
    },

    commitEditing: (name) => {
      const { editingPath, editingMode } = get()
      if (!editingPath) return

      const fs = useFileSystemStore.getState()
      const trimmedName = name.trim()

      if (!trimmedName) {
        if (editingMode === 'create') {
          fs.deleteNode(editingPath)
          set({ editingPath: null, editingMode: null, selectedPaths: [] })
        } else {
          set({ editingPath: null, editingMode: null })
        }
        return
      }

      const node = fs.getNode(editingPath)
      if (!node) {
        set({ editingPath: null, editingMode: null })
        return
      }

      if (node.name === trimmedName) {
        set({ editingPath: null, editingMode: null })
        return
      }

      const result = fs.renameNode(editingPath, trimmedName)
      if (result) {
        set({ selectedPaths: [result.path], editingPath: null, editingMode: null })
      } else {
        // Nom takrorlangan — eski holatni saqlaymiz
        if (editingMode === 'create') {
          set({ editingPath: null, editingMode: null })
        } else {
          set({ editingPath: null, editingMode: null })
        }
      }
    },

    cancelEditing: () => {
      const { editingPath, editingMode } = get()
      if (editingMode === 'create' && editingPath) {
        useFileSystemStore.getState().deleteNode(editingPath)
        set({ editingPath: null, editingMode: null, selectedPaths: [] })
      } else {
        set({ editingPath: null, editingMode: null })
      }
    },
  }))
}

// Context for passing store instance to child components
export const FileManagerStoreContext = createContext<FileManagerStoreApi | null>(null)

export function useFileManagerStore<T>(selector: (state: FileManagerState & FileManagerActions) => T): T {
  const store = useContext(FileManagerStoreContext)
  if (!store) throw new Error('useFileManagerStore must be used within FileManagerStoreContext')
  return useStore(store, selector)
}

function buildColumnSelections(path: string): string[] {
  if (path === '/') return ['/']
  const segments = path.split('/').filter(Boolean)
  const selections: string[] = ['/']
  let current = ''
  for (const segment of segments) {
    current += '/' + segment
    selections.push(current)
  }
  return selections
}
