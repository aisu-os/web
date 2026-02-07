export type CursorType =
  | 'default'
  | 'pointer'
  | 'text'
  | 'grab'
  | 'grabbing'
  | 'crosshair'
  | 'move'
  | 'not-allowed'
  | 'wait'
  | 'progress'
  | 'zoom-in'
  | 'zoom-out'
  | 'n-resize'
  | 's-resize'
  | 'e-resize'
  | 'w-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'col-resize'
  | 'row-resize'
  | 'none'

export interface CursorAsset {
  svg?: string
  url?: string
  hotspot: { x: number; y: number }
  width: number
  height: number
  animation?: {
    rotate?: boolean
    pulse?: boolean
  }
}

export interface CursorTheme {
  id: string
  name: string
  author: string
  version: string
  thumbnail?: string
  cursors: Partial<Record<CursorType, CursorAsset>>
  scale?: number
}

export interface CursorThemeMeta {
  id: string
  name: string
  author: string
  version: string
  thumbnail: string
  description: string
  downloadUrl: string
  price: 'free' | number
  downloads: number
  rating: number
}
