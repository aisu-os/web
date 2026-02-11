import { createAppConfig } from '../_app-config'

export const trashConfig = createAppConfig({
  id: 'trash',
  title: 'Trash',
  icon: 'trash',
  window: {
    defaultWidth: 680,
    defaultHeight: 480,
    minWidth: 480,
    minHeight: 320,
    resizable: true,
  },
  showInDock: false,
  showOnDesktop: false,
})
