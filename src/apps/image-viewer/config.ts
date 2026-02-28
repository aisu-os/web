import { createAppConfig } from '../_app-config'

export const imageViewerConfig = createAppConfig({
  id: 'image-viewer',
  title: 'Preview',
  icon: 'image-viewer',
  multipleInstances: true,
  window: {
    defaultWidth: 820,
    defaultHeight: 600,
    minWidth: 480,
    minHeight: 360,
    resizable: true,
  },
  showInDock: true,
  showOnDesktop: false,
  menuBar: {
    menus: [
      {
        label: 'File',
        items: [
          { label: 'Close Window', shortcut: '⌘W' },
        ],
      },
      {
        label: 'View',
        items: [
          { label: 'Zoom In', shortcut: '⌘+', action: 'view:zoom-in' },
          { label: 'Zoom Out', shortcut: '⌘-', action: 'view:zoom-out' },
          { label: 'Actual Size', shortcut: '⌘0', action: 'view:actual-size' },
          { label: 'Zoom to Fit', shortcut: '⌘9', action: 'view:fit' },
          { label: '', separator: true },
          { label: 'Rotate Left', shortcut: '⌘L', action: 'view:rotate-left' },
          { label: 'Rotate Right', shortcut: '⌘R', action: 'view:rotate-right' },
        ],
      },
      {
        label: 'Tools',
        items: [
          { label: 'Show Inspector', shortcut: '⌘I', action: 'tools:toggle-info' },
        ],
      },
    ],
  },
})
