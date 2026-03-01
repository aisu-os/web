import { createContext, useContext } from 'react'
import { create, useStore } from 'zustand'
import type { StoreApi } from 'zustand'
import type { TextEditorState, TextEditorActions } from '../text-editor.types'
import { detectLanguage } from '../text-editor.constants'
import { readFileContent, writeFileContent, createNode as apiCreateNode } from '@/services/api/fs-service'
import { useFileSystemStore } from '@/stores/use-file-system-store'
import { useWindowStore } from '@/stores/use-window-store'

export type TextEditorStoreApi = StoreApi<TextEditorState & TextEditorActions>

export function createTextEditorStore(initialFilePath?: string, windowId?: string): TextEditorStoreApi {
  const store = create<TextEditorState & TextEditorActions>((set, get) => ({
    filePath: null,
    fileName: 'Untitled',
    content: '',
    savedContent: '',
    isModified: false,
    isLoading: false,
    isSaving: false,
    error: null,
    language: 'Plain Text',
    wordWrap: true,
    showFind: false,
    findQuery: '',
    cursorLine: 1,
    cursorCol: 1,
    showSaveAs: false,
    saveAsError: null,

    loadFile: async (filePath: string) => {
      const node = useFileSystemStore.getState().getNode(filePath)
      if (!node || node.type !== 'file') return

      const language = detectLanguage(node.name)

      set({
        isLoading: true,
        error: null,
        filePath,
        fileName: node.name,
        language,
      })

      // Update window title and save filePath to windowProps
      if (windowId) {
        useWindowStore.getState().setWindowTitle(windowId, node.name)
        useWindowStore.getState().setWindowProps(windowId, { filePath })
      }

      try {
        const result = await readFileContent(filePath)
        set({
          content: result.content,
          savedContent: result.content,
          isModified: false,
          isLoading: false,
          cursorLine: 1,
          cursorCol: 1,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load file'
        set({
          isLoading: false,
          error: message,
        })
      }
    },

    setContent: (content: string) => {
      const { savedContent, fileName } = get()
      const isModified = content !== savedContent
      set({ content, isModified })

      // Update window title
      if (windowId) {
        const title = isModified ? `${fileName} — Edited` : fileName
        useWindowStore.getState().setWindowTitle(windowId, title)
      }
    },

    save: async () => {
      const { filePath, content, isSaving } = get()
      if (isSaving) return
      if (!filePath) {
        set({ showSaveAs: true })
        return
      }

      set({ isSaving: true, error: null })

      try {
        await writeFileContent(filePath, content)
        const { fileName } = get()
        set({
          savedContent: content,
          isModified: false,
          isSaving: false,
        })

        // Restore window title
        if (windowId) {
          useWindowStore.getState().setWindowTitle(windowId, fileName)
        }

        // Refresh file system tree (for size changes)
        useFileSystemStore.getState().refreshTree()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save file'
        set({
          isSaving: false,
          error: message,
        })
      }
    },

    newFile: () => {
      set({
        filePath: null,
        fileName: 'Untitled',
        content: '',
        savedContent: '',
        isModified: false,
        isLoading: false,
        isSaving: false,
        error: null,
        language: 'Plain Text',
        cursorLine: 1,
        cursorCol: 1,
      })

      if (windowId) {
        useWindowStore.getState().setWindowTitle(windowId, 'Untitled')
        useWindowStore.getState().setWindowProps(windowId, { filePath: undefined })
      }
    },

    toggleWordWrap: () => {
      set((s) => ({ wordWrap: !s.wordWrap }))
    },

    toggleFind: () => {
      set((s) => ({ showFind: !s.showFind, findQuery: s.showFind ? '' : s.findQuery }))
    },

    setFindQuery: (query: string) => {
      set({ findQuery: query })
    },

    setCursorPosition: (line: number, col: number) => {
      set({ cursorLine: line, cursorCol: col })
    },

    clearError: () => {
      set({ error: null })
    },

    openSaveAs: () => {
      set({ showSaveAs: true, saveAsError: null })
    },

    closeSaveAs: () => {
      set({ showSaveAs: false, saveAsError: null })
    },

    saveAs: async (parentPath: string, fileName: string) => {
      const { content, isSaving } = get()
      if (isSaving) return

      set({ isSaving: true, saveAsError: null })

      try {
        const createdNode = await apiCreateNode(parentPath, fileName, 'file')

        await writeFileContent(createdNode.path, content)

        const language = detectLanguage(fileName)

        set({
          filePath: createdNode.path,
          fileName: createdNode.name,
          savedContent: content,
          isModified: false,
          isSaving: false,
          showSaveAs: false,
          saveAsError: null,
          language,
        })

        if (windowId) {
          useWindowStore.getState().setWindowTitle(windowId, createdNode.name)
          useWindowStore.getState().setWindowProps(windowId, { filePath: createdNode.path })
        }

        useFileSystemStore.getState().refreshTree()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save file'
        set({
          isSaving: false,
          saveAsError: message,
        })
      }
    },
  }))

  if (initialFilePath) {
    store.getState().loadFile(initialFilePath)
  }

  return store
}

export const TextEditorStoreContext = createContext<TextEditorStoreApi | null>(null)

export function useTextEditorStore<T>(
  selector: (state: TextEditorState & TextEditorActions) => T
): T {
  const store = useContext(TextEditorStoreContext)
  if (!store) throw new Error('useTextEditorStore must be used within TextEditorStoreContext')
  return useStore(store, selector)
}
