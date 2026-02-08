import type { FileType } from './file-system'

export type DragSourceType = 'desktop' | 'file-manager'
export type DragOperation = 'move' | 'copy'

export interface DragSource {
  type: DragSourceType
  windowId?: string
}

export interface DragItem {
  name: string
  path: string
  type: FileType
  desktopItemId?: string
}

export interface DropTarget {
  type: 'desktop' | 'file-manager-content' | 'folder-item'
  windowId?: string
  path: string
}

export interface DragSession {
  source: DragSource
  items: DragItem[]
  operation: DragOperation
  cursorPosition: { x: number; y: number }
  activeDropTarget: DropTarget | null
}

export interface DropTargetRegistration {
  id: string
  element: HTMLElement
  target: DropTarget
  accepts: (source: DragSource, items: DragItem[]) => boolean
}
