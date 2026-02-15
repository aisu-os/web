import { createContext, useContext } from 'react'
import { create, useStore } from 'zustand'
import type { StoreApi } from 'zustand'
import type { TextEditorState, TextEditorActions } from '../text-editor.types'
import { detectLanguage } from '../text-editor.constants'
import { readFileContent, writeFileContent } from '@/services/api/fs-service'
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

      // Oyna sarlavhasini yangilash
      if (windowId) {
        useWindowStore.getState().setWindowTitle(windowId, node.name)
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

      // Oyna sarlavhasini yangilash
      if (windowId) {
        const title = isModified ? `${fileName} — Edited` : fileName
        useWindowStore.getState().setWindowTitle(windowId, title)
      }
    },

    save: async () => {
      const { filePath, content, isSaving } = get()
      if (!filePath || isSaving) return

      set({ isSaving: true, error: null })

      try {
        await writeFileContent(filePath, content)
        const { fileName } = get()
        set({
          savedContent: content,
          isModified: false,
          isSaving: false,
        })

        // Oyna sarlavhasini qaytarish
        if (windowId) {
          useWindowStore.getState().setWindowTitle(windowId, fileName)
        }

        // Fayl tizimi daraxtini yangilash (hajm o'zgarishi uchun)
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
