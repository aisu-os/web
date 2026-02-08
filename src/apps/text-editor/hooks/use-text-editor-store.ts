import { createContext, useContext } from 'react'
import { create, useStore } from 'zustand'
import type { StoreApi } from 'zustand'
import type { TextEditorState, TextEditorActions } from '../text-editor.types'
import { MOCK_FILE_CONTENTS, DEFAULT_CONTENT, detectLanguage } from '../text-editor.constants'
import { useFileSystemStore } from '@/stores/use-file-system-store'

export type TextEditorStoreApi = StoreApi<TextEditorState & TextEditorActions>

export function createTextEditorStore(initialFilePath?: string): TextEditorStoreApi {
  const store = create<TextEditorState & TextEditorActions>((set, get) => ({
    filePath: null,
    fileName: 'Untitled',
    content: '',
    savedContent: '',
    isModified: false,
    language: 'Plain Text',
    wordWrap: true,
    showFind: false,
    findQuery: '',
    cursorLine: 1,
    cursorCol: 1,

    loadFile: (filePath: string) => {
      const node = useFileSystemStore.getState().getNode(filePath)
      if (!node || node.type !== 'file') return

      const content = MOCK_FILE_CONTENTS[filePath] ?? DEFAULT_CONTENT
      const language = detectLanguage(node.name)

      set({
        filePath,
        fileName: node.name,
        content,
        savedContent: content,
        isModified: false,
        language,
        cursorLine: 1,
        cursorCol: 1,
      })
    },

    setContent: (content: string) => {
      const { savedContent } = get()
      set({
        content,
        isModified: content !== savedContent,
      })
    },

    save: () => {
      const { content } = get()
      set({
        savedContent: content,
        isModified: false,
      })
    },

    newFile: () => {
      set({
        filePath: null,
        fileName: 'Untitled',
        content: '',
        savedContent: '',
        isModified: false,
        language: 'Plain Text',
        cursorLine: 1,
        cursorCol: 1,
      })
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
