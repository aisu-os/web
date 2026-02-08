import { createContext, useContext } from 'react'
import { create, useStore } from 'zustand'
import type { StoreApi } from 'zustand'
import type { ImageViewerState, ImageViewerActions } from '../image-viewer.types'
import {
  MOCK_IMAGE_URLS,
  MOCK_IMAGE_DIMENSIONS,
  FALLBACK_IMAGE_URL,
  ZOOM_MIN,
  ZOOM_MAX,
  ZOOM_STEP,
} from '../image-viewer.constants'
import { calculateFitZoom } from '../image-viewer.utils'
import { useFileSystemStore } from '@/stores/use-file-system-store'

export type ImageViewerStoreApi = StoreApi<ImageViewerState & ImageViewerActions>

export function createImageViewerStore(initialFilePath?: string): ImageViewerStoreApi {
  const store = create<ImageViewerState & ImageViewerActions>((set, get) => ({
    imageInfo: null,
    imageSrc: null,
    isLoading: false,
    error: null,
    zoom: 1,
    rotation: 0,
    panX: 0,
    panY: 0,
    isInfoPanelVisible: false,

    loadImage: (filePath: string) => {
      set({ isLoading: true, error: null })

      const node = useFileSystemStore.getState().getNode(filePath)
      if (!node || node.type !== 'file') {
        set({ isLoading: false, error: 'File not found' })
        return
      }

      const src = MOCK_IMAGE_URLS[filePath] ?? FALLBACK_IMAGE_URL
      const dimensions = MOCK_IMAGE_DIMENSIONS[filePath] ?? { width: 800, height: 600 }

      set({
        imageInfo: {
          name: node.name,
          path: node.path,
          mimeType: node.mimeType ?? 'image/png',
          size: node.size ?? 0,
          width: dimensions.width,
          height: dimensions.height,
        },
        imageSrc: src,
        isLoading: false,
        zoom: 1,
        rotation: 0,
        panX: 0,
        panY: 0,
      })
    },

    zoomIn: () => {
      set((s) => ({ zoom: Math.min(s.zoom + ZOOM_STEP, ZOOM_MAX) }))
    },

    zoomOut: () => {
      set((s) => ({ zoom: Math.max(s.zoom - ZOOM_STEP, ZOOM_MIN) }))
    },

    setZoom: (zoom: number) => {
      set({ zoom: Math.max(ZOOM_MIN, Math.min(zoom, ZOOM_MAX)) })
    },

    fitToWindow: (containerWidth: number, containerHeight: number) => {
      const { imageInfo } = get()
      if (!imageInfo) return
      const fitZoom = calculateFitZoom(
        imageInfo.width,
        imageInfo.height,
        containerWidth,
        containerHeight
      )
      set({ zoom: fitZoom, panX: 0, panY: 0 })
    },

    actualSize: () => {
      set({ zoom: 1, panX: 0, panY: 0 })
    },

    rotateLeft: () => {
      set((s) => ({ rotation: (s.rotation - 90 + 360) % 360 }))
    },

    rotateRight: () => {
      set((s) => ({ rotation: (s.rotation + 90) % 360 }))
    },

    setPan: (x: number, y: number) => {
      set({ panX: x, panY: y })
    },

    resetPan: () => {
      set({ panX: 0, panY: 0 })
    },

    toggleInfoPanel: () => {
      set((s) => ({ isInfoPanelVisible: !s.isInfoPanelVisible }))
    },
  }))

  if (initialFilePath) {
    store.getState().loadImage(initialFilePath)
  }

  return store
}

export const ImageViewerStoreContext = createContext<ImageViewerStoreApi | null>(null)

export function useImageViewerStore<T>(
  selector: (state: ImageViewerState & ImageViewerActions) => T
): T {
  const store = useContext(ImageViewerStoreContext)
  if (!store) throw new Error('useImageViewerStore must be used within ImageViewerStoreContext')
  return useStore(store, selector)
}
