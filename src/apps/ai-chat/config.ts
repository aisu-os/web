import { createAppConfig } from '../_app-config'

export const aiChatConfig = createAppConfig({
  id: 'ai-chat',
  title: 'AI Chat',
  icon: 'ai-chat',
  window: {
    defaultWidth: 860,
    defaultHeight: 600,
    minWidth: 580,
    minHeight: 420,
    resizable: true,
  },
  showInDock: true,
  showOnDesktop: false,
  menuBar: {
    menus: [
      {
        label: 'File',
        items: [
          { label: 'New Chat', shortcut: '⌘N', action: 'chat:new' },
          { label: '', separator: true },
          { label: 'Delete Chat', action: 'chat:delete' },
          { label: '', separator: true },
          { label: 'Close Window', shortcut: '⌘W' },
        ],
      },
      {
        label: 'Edit',
        items: [
          { label: 'Copy', shortcut: '⌘C' },
          { label: 'Paste', shortcut: '⌘V' },
          { label: 'Select All', shortcut: '⌘A' },
        ],
      },
      {
        label: 'View',
        items: [
          { label: 'Toggle Sidebar', shortcut: '⇧⌘S', action: 'view:sidebar' },
          { label: '', separator: true },
          { label: 'Provider Settings', shortcut: '⌘,', action: 'view:provider-config' },
        ],
      },
    ],
  },
})
