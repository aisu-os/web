import { createAppConfig } from '../_app-config'

export const fileManagerConfig = createAppConfig({
  id: 'file-manager',
  title: 'File Manager',
  icon: 'file-manager',
  multipleInstances: true,
  window: {
    defaultWidth: 900,
    defaultHeight: 560,
    minWidth: 640,
    minHeight: 400,
    resizable: true,
  },
  showInDock: true,
  showOnDesktop: false,
  menuBar: {
    menus: [
      {
        label: 'File',
        items: [
          { label: 'New Finder Window', shortcut: '⌘N' },
          { label: 'New Folder', shortcut: '⇧⌘N' },
          { label: '', separator: true },
          { label: 'Open', shortcut: '⌘O' },
          { label: 'Close Window', shortcut: '⌘W' },
          { label: '', separator: true },
          { label: 'Get Info', shortcut: '⌘I' },
        ],
      },
      {
        label: 'Edit',
        items: [
          { label: 'Copy', shortcut: '⌘C', disabled: true },
          { label: 'Paste', shortcut: '⌘V', disabled: true },
          { label: 'Select All', shortcut: '⌘A' },
        ],
      },
      {
        label: 'View',
        items: [
          { label: 'as Icons', shortcut: '⌘1', action: 'view:icon' },
          { label: 'as List', shortcut: '⌘2', action: 'view:list' },
          { label: 'as Columns', shortcut: '⌘3', action: 'view:column' },
          { label: '', separator: true },
          { label: 'Show Sidebar', shortcut: '⌥⌘S', action: 'view:toggle-sidebar' },
        ],
      },
      {
        label: 'Go',
        items: [
          { label: 'Back', shortcut: '⌘[', action: 'go:back' },
          { label: 'Forward', shortcut: '⌘]', action: 'go:forward' },
          { label: '', separator: true },
          { label: 'Desktop', shortcut: '⇧⌘D', action: 'go:desktop' },
          { label: 'Documents', shortcut: '⇧⌘O', action: 'go:documents' },
          { label: 'Downloads', shortcut: '⌥⌘L', action: 'go:downloads' },
        ],
      },
    ],
  },
})
