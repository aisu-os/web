import type { FileType } from './file-system'
import type { AppMenuItem } from './app'

export interface DesktopItem {
  id: string
  name: string
  type: FileType
  icon: 'folder' | 'text-file' | 'image-file' | 'generic-file'
  position: { x: number; y: number }
}

export type ContextMenuItem = AppMenuItem

export interface MarqueeRect {
  left: number
  top: number
  width: number
  height: number
}
