import type { FileType } from './file-system'

export interface DesktopItem {
  id: string
  name: string
  type: FileType
  icon: 'folder' | 'text-file' | 'image-file' | 'generic-file'
  position: { x: number; y: number }
}

export interface ContextMenuItem {
  label: string
  action?: string
  shortcut?: string
  separator?: boolean
  disabled?: boolean
}

export interface MarqueeRect {
  left: number
  top: number
  width: number
  height: number
}
