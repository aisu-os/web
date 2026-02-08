import type { DesktopItem, ContextMenuItem } from '@/types'

export const WALLPAPERS = [
  'https://images.unsplash.com/photo-1494587416117-f102a2ac0a8d?w=1920&q=80',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&q=80',
  'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
  'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80',
  'https://images.unsplash.com/photo-1488866022916-f7f2a032cd21?w=1920&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
  'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80',
  'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&q=80',
] as const

export const FALLBACK_GRADIENT =
  'linear-gradient(135deg, #0B1120 0%, #0F172A 30%, #0C4A6E 70%, #0B1120 100%)'

export const DESKTOP_ICON_SIZE = 56

export const DEFAULT_DESKTOP_ITEMS: DesktopItem[] = [
  {
    id: 'folder-projects',
    name: 'Projects',
    type: 'directory',
    icon: 'folder',
    position: { x: 24, y: 48 },
    fsPath: '/Desktop/Projects',
  },
  {
    id: 'file-notes',
    name: 'notes.txt',
    type: 'file',
    icon: 'text-file',
    position: { x: 24, y: 152 },
    fsPath: '/Desktop/notes.txt',
  },
  {
    id: 'file-screenshot',
    name: 'screenshot.png',
    type: 'file',
    icon: 'image-file',
    position: { x: 24, y: 256 },
    fsPath: '/Desktop/screenshot.png',
  },
]

export const DESKTOP_CONTEXT_MENU_ITEMS: ContextMenuItem[] = [
  { label: 'New Folder', action: 'desktop:new-folder', shortcut: '⇧⌘N' },
  { label: 'New File', action: 'desktop:new-file' },
  { label: '', separator: true },
  { label: 'Get Info', action: 'desktop:get-info', shortcut: '⌘I', disabled: true },
  { label: '', separator: true },
  { label: 'Change Desktop Background...', action: 'desktop:change-wallpaper' },
  { label: '', separator: true },
  { label: 'Sort By', action: 'desktop:sort-by', disabled: true },
  { label: 'Clean Up', action: 'desktop:clean-up', disabled: true },
  { label: 'Select All', action: 'desktop:select-all', shortcut: '⌘A' },
]

export const ITEM_CONTEXT_MENU_ITEMS: ContextMenuItem[] = [
  { label: 'Open', action: 'item:open' },
  { label: '', separator: true },
  { label: 'Get Info', action: 'item:get-info', shortcut: '⌘I' },
  { label: 'Rename', action: 'item:rename' },
  { label: 'Duplicate', action: 'item:duplicate' },
  { label: '', separator: true },
  { label: 'Move to Trash', action: 'item:delete' },
]
