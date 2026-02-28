import type { WindowConfig } from './window'

export interface AppConfig {
  id: string
  title: string
  icon: string
  window: WindowConfig
  showInDock?: boolean
  showOnDesktop?: boolean
  multipleInstances?: boolean
  menuBar?: AppMenuBarConfig
}

export interface AppMenuBarConfig {
  menus: AppMenu[]
}

export interface AppMenu {
  label: string
  items: AppMenuItem[]
}

export interface AppMenuItem {
  label: string
  shortcut?: string
  action?: string
  separator?: boolean
  disabled?: boolean
  checked?: boolean
}

export type SystemAppId =
  | 'ai-chat'
  | 'terminal'
  | 'file-manager'
  | 'settings'
  | 'text-editor'
  | 'app-market'
  | 'image-viewer'
  | 'notification-demo'
  | 'trash'
  | 'port-forward'
