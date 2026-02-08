import type { FileNode } from '@/types'

export function isImageFile(node: FileNode): boolean {
  if (node.type !== 'file') return false
  return (node.mimeType ?? '').startsWith('image/')
}

export function getImageFormat(mimeType: string): string {
  const formatMap: Record<string, string> = {
    'image/png': 'PNG',
    'image/jpeg': 'JPEG',
    'image/gif': 'GIF',
    'image/webp': 'WebP',
    'image/svg+xml': 'SVG',
    'image/bmp': 'BMP',
    'image/tiff': 'TIFF',
  }
  return formatMap[mimeType] ?? 'Image'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height}`
}

export function formatZoomPercent(zoom: number): string {
  return `${Math.round(zoom * 100)}%`
}

export function calculateFitZoom(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
  padding = 40
): number {
  const availW = containerWidth - padding
  const availH = containerHeight - padding
  if (availW <= 0 || availH <= 0) return 1
  const scaleX = availW / imageWidth
  const scaleY = availH / imageHeight
  return Math.min(scaleX, scaleY, 1)
}
