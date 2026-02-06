import type { FileNode } from '@/types'
import type { SortKey, SortDirection } from './file-manager.types'

export function formatFileSize(bytes?: number): string {
  if (bytes === undefined) return '--'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export function getFileKind(node: FileNode): string {
  if (node.type === 'directory') return 'Folder'
  const ext = node.name.split('.').pop()?.toLowerCase()
  const kindMap: Record<string, string> = {
    ts: 'TypeScript Source',
    tsx: 'TypeScript JSX',
    js: 'JavaScript Source',
    json: 'JSON File',
    md: 'Markdown Document',
    txt: 'Plain Text',
    pdf: 'PDF Document',
    png: 'PNG Image',
    jpg: 'JPEG Image',
    jpeg: 'JPEG Image',
    mp3: 'MP3 Audio',
    mp4: 'MPEG-4 Video',
    mov: 'QuickTime Movie',
    zip: 'ZIP Archive',
    dmg: 'Disk Image',
    css: 'CSS Stylesheet',
    xlsx: 'Excel Spreadsheet',
    pptx: 'PowerPoint Presentation',
    m3u: 'Playlist File',
  }
  return kindMap[ext ?? ''] ?? 'Document'
}

export function formatDate(date?: Date): string {
  if (!date) return '--'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function sortFileNodes(
  nodes: FileNode[],
  key: SortKey,
  direction: SortDirection
): FileNode[] {
  const sorted = [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1

    switch (key) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'dateModified':
        return (a.updatedAt?.getTime() ?? 0) - (b.updatedAt?.getTime() ?? 0)
      case 'size':
        return (a.size ?? 0) - (b.size ?? 0)
      case 'kind':
        return getFileKind(a).localeCompare(getFileKind(b))
    }
  })
  return direction === 'desc' ? sorted.reverse() : sorted
}
