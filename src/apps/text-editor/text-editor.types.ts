export interface TextEditorState {
  filePath: string | null
  fileName: string
  content: string
  savedContent: string
  isModified: boolean
  isLoading: boolean
  isSaving: boolean
  error: string | null
  language: string
  wordWrap: boolean
  showFind: boolean
  findQuery: string
  cursorLine: number
  cursorCol: number
}

export interface TextEditorActions {
  loadFile: (filePath: string) => Promise<void>
  setContent: (content: string) => void
  save: () => Promise<void>
  newFile: () => void
  toggleWordWrap: () => void
  toggleFind: () => void
  setFindQuery: (query: string) => void
  setCursorPosition: (line: number, col: number) => void
  clearError: () => void
}
