import { createAppConfig } from '../_app-config'

export const portForwardConfig = createAppConfig({
  id: 'port-forward',
  title: 'Port Forward',
  icon: 'port-forward',
  window: {
    defaultWidth: 520,
    defaultHeight: 480,
    minWidth: 420,
    minHeight: 380,
    resizable: true,
  },
  showInDock: true,
  showOnDesktop: false,
})
