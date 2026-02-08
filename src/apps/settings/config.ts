import { createAppConfig } from '../_app-config'

export const settingsConfig = createAppConfig({
  id: 'settings',
  title: 'System Settings',
  icon: 'settings',
  window: {
    defaultWidth: 780,
    defaultHeight: 560,
    minWidth: 680,
    minHeight: 480,
    resizable: true,
  },
  showInDock: true,
  showOnDesktop: false,
  menuBar: {
    menus: [
      {
        label: 'Settings',
        items: [
          { label: 'Close Window', shortcut: '⌘W' },
        ],
      },
      {
        label: 'View',
        items: [
          { label: 'Search', shortcut: '⌘F', action: 'settings:search' },
        ],
      },
    ],
  },
})
