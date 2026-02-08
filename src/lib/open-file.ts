import { useFileSystemStore } from '@/stores/use-file-system-store'
import { useWindowStore } from '@/stores/use-window-store'
import { appRegistry } from '@/apps/_registry'

/**
 * MIME type prefix -> app ID mapping.
 * Kelajakda app market yoki default app tanlash tizimi
 * bu mapping'ni dinamik boshqarishi mumkin.
 */
const MIME_APP_MAP: { prefix: string; appId: string; propKey: string }[] = [
  { prefix: 'image/', appId: 'image-viewer', propKey: 'filePath' },
  { prefix: 'text/', appId: 'text-editor', propKey: 'filePath' },
  // { prefix: 'audio/', appId: 'music-player', propKey: 'filePath' },
  // { prefix: 'video/', appId: 'video-player', propKey: 'filePath' },
]

/**
 * Fayl ochish uchun global funksiya.
 *
 * Fayl turi (mimeType) ga qarab mos ilovani aniqlaydi va ochadi.
 * Agar mos ilova topilmasa yoki registry'da ro'yxatdan o'tmagan bo'lsa,
 * hech narsa qilmaydi (kelajakda "Open With" dialog ko'rsatish mumkin).
 *
 * @param filePath - Ochiladigan faylning yo'li
 * @returns Ochilgan oyna ID'si yoki null (agar ilova topilmasa)
 */
export function openFile(filePath: string): string | null {
  const node = useFileSystemStore.getState().getNode(filePath)
  if (!node) return null

  // Direktoriyalarni File Manager da ochish
  if (node.type === 'directory') {
    return useWindowStore.getState().openWindow('file-manager', { initialPath: filePath })
  }

  // MIME type bo'yicha mos ilovani topish
  const mimeType = node.mimeType ?? ''
  const match = MIME_APP_MAP.find((entry) => mimeType.startsWith(entry.prefix))

  if (!match) return null

  // Ilova registry'da mavjudligini tekshirish
  if (!appRegistry[match.appId]) return null

  return useWindowStore.getState().openWindow(match.appId, { [match.propKey]: filePath })
}
