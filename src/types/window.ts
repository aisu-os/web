export interface WindowPosition {
  x: number
  y: number
}

export interface WindowSize {
  width: number
  height: number
}

export interface WindowConfig {
  defaultWidth: number
  defaultHeight: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  resizable?: boolean
}

export interface WindowState {
  id: string
  appId: string
  processId: string
  title: string
  position: WindowPosition
  size: WindowSize
  isMinimized: boolean
  isMaximized: boolean
  isHidden: boolean
  isFocused: boolean
  zIndex: number
}
