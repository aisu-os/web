import { createAppConfig } from '../_app-config'

export const notificationDemoConfig = createAppConfig({
  id: 'notification-demo',
  title: 'Notifications',
  icon: 'notification-demo',
  window: {
    defaultWidth: 480,
    defaultHeight: 520,
    minWidth: 400,
    minHeight: 400,
    resizable: true,
  },
  showInDock: true,
  showOnDesktop: false,
})
