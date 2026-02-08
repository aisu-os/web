import { createAppConfig } from '../_app-config'

export const appMarketConfig = createAppConfig({
  id: 'app-market',
  title: 'App Market',
  icon: 'app-market',
  window: {
    defaultWidth: 920,
    defaultHeight: 640,
    minWidth: 680,
    minHeight: 480,
    resizable: true,
  },
  showInDock: true,
  showOnDesktop: false,
  menuBar: {
    menus: [
      {
        label: 'Store',
        items: [
          { label: 'Home', shortcut: '⌘1', action: 'nav:home' },
          { label: '', separator: true },
          { label: 'Search', shortcut: '⌘F', action: 'nav:search' },
          { label: '', separator: true },
          { label: 'Close Window', shortcut: '⌘W' },
        ],
      },
      {
        label: 'View',
        items: [
          { label: 'Show Sidebar', shortcut: '⌥⌘S', action: 'view:toggle-sidebar' },
          { label: '', separator: true },
          { label: 'Go Back', shortcut: '⌘[', action: 'nav:back' },
        ],
      },
      {
        label: 'Account',
        items: [
          { label: 'My Apps', disabled: true },
          { label: 'Purchased', disabled: true },
          { label: '', separator: true },
          { label: 'Sign In...', disabled: true },
        ],
      },
    ],
  },
})
