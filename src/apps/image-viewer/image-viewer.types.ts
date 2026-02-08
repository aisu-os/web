export interface ImageInfo {
  name: string
  path: string
  mimeType: string
  size: number
  width: number
  height: number
}

export interface ImageViewerState {
  imageInfo: ImageInfo | null
  imageSrc: string | null
  isLoading: boolean
  error: string | null

  zoom: number
  rotation: number
  panX: number
  panY: number
  isInfoPanelVisible: boolean
}

export interface ImageViewerActions {
  loadImage: (filePath: string) => void

  zoomIn: () => void
  zoomOut: () => void
  setZoom: (zoom: number) => void
  fitToWindow: (containerWidth: number, containerHeight: number) => void
  actualSize: () => void

  rotateLeft: () => void
  rotateRight: () => void

  setPan: (x: number, y: number) => void
  resetPan: () => void

  toggleInfoPanel: () => void
}
