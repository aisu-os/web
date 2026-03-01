import { useFileSystemStore } from '@/stores/use-file-system-store'
import { useWindowStore } from '@/stores/use-window-store'
import { appRegistry } from '@/apps/_registry'

/**
 * MIME type prefix -> app ID mapping.
 * In the future, an app market or default app selection system
 * could manage this mapping dynamically.
 */
const MIME_APP_MAP: { prefix: string; appId: string; propKey: string }[] = [
  { prefix: 'image/', appId: 'image-viewer', propKey: 'filePath' },
  { prefix: 'text/', appId: 'text-editor', propKey: 'filePath' },
  // { prefix: 'audio/', appId: 'music-player', propKey: 'filePath' },
  // { prefix: 'video/', appId: 'video-player', propKey: 'filePath' },
]

/**
 * Global function to open a file.
 *
 * Determines the appropriate app based on file type (mimeType) and opens it.
 * Does nothing if no matching app is found or it's not registered
 * (in the future, an "Open With" dialog could be shown).
 *
 * @param filePath - Path of the file to open
 * @returns Opened window ID or null (if no app found)
 */
export function openFile(filePath: string): string | null {
  const node = useFileSystemStore.getState().getNode(filePath)
  if (!node) return null

  // Open directories in File Manager
  if (node.type === 'directory') {
    return useWindowStore.getState().openWindow('file-manager', { initialPath: filePath })
  }

  // Find matching app by MIME type
  const mimeType = node.mimeType ?? ''
  const match = MIME_APP_MAP.find((entry) => mimeType.startsWith(entry.prefix))

  if (!match) return null

  // Check if app exists in registry
  if (!appRegistry[match.appId]) return null

  return useWindowStore.getState().openWindow(match.appId, { [match.propKey]: filePath })
}
