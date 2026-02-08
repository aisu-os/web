export interface TextEditorState {
  filePath: string | null
  fileName: string
  content: string
  savedContent: string
  isModified: boolean
  language: string
  wordWrap: boolean
  showFind: boolean
  findQuery: string
  cursorLine: number
  cursorCol: number
}

export interface TextEditorActions {
  loadFile: (filePath: string) => void
  setContent: (content: string) => void
  save: () => void
  newFile: () => void
  toggleWordWrap: () => void
  toggleFind: () => void
  setFindQuery: (query: string) => void
  setCursorPosition: (line: number, col: number) => void
}
