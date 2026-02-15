import { createAppConfig } from '../_app-config'

export const terminalConfig = createAppConfig({
  id: 'terminal',
  title: 'Terminal',
  icon: 'terminal',
  window: {
    defaultWidth: 720,
    defaultHeight: 480,
    minWidth: 400,
    minHeight: 280,
    resizable: true,
  },
  showInDock: true,
  showOnDesktop: false,
  menuBar: {
    menus: [
      {
        label: 'Shell',
        items: [
          { label: 'New Window', shortcut: '⌘N' },
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
          { label: '', separator: true },
          { label: 'Clear', shortcut: '⌘K', action: 'terminal:clear' },
        ],
      },
      {
        label: 'View',
        items: [
          { label: 'Bigger', shortcut: '⌘+', action: 'terminal:zoom-in' },
          { label: 'Smaller', shortcut: '⌘-', action: 'terminal:zoom-out' },
          { label: 'Default Size', shortcut: '⌘0', action: 'terminal:zoom-reset' },
        ],
      },
    ],
  },
})
