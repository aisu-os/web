import type { DockItemConfig } from './dock.types'
import {
  AiChatIcon,
  TerminalIcon,
  FileManagerIcon,
  TextEditorIcon,
  ImageViewerIcon,
  AppMarketIcon,
  SettingsIcon,
} from './dock-icons'

// Sizing
export const DOCK_ICON_SIZE = 48
export const DOCK_ICON_SIZE_MAX = 72
export const DOCK_MAGNIFICATION_RANGE = 150
export const DOCK_PADDING_X = 8
export const DOCK_PADDING_Y = 4
export const DOCK_GAP = 4
export const DOCK_MARGIN_BOTTOM = 8

// Animation
export const DOCK_ENTRANCE_DELAY = 0.3
export const BOUNCE_DURATION = 0.5

// Dock items — Settings oxirida, separator bilan ajratiladi
export const DOCK_ITEMS: DockItemConfig[] = [
  { id: 'ai-chat', label: 'AI Chat', icon: AiChatIcon },
  { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
  { id: 'file-manager', label: 'File Manager', icon: FileManagerIcon },
  { id: 'text-editor', label: 'Text Editor', icon: TextEditorIcon },
  { id: 'image-viewer', label: 'Image Viewer', icon: ImageViewerIcon },
  { id: 'app-market', label: 'App Market', icon: AppMarketIcon },
]

export const DOCK_SETTINGS_ITEM: DockItemConfig = {
  id: 'settings',
  label: 'Settings',
  icon: SettingsIcon,
}
