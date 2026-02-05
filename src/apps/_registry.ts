// import { lazy } from 'react'
import type { AppConfig } from '@/types'

export interface AppRegistryEntry {
  config: AppConfig
  component: React.LazyExoticComponent<React.ComponentType>
}

// Ilovalar config'lari qo'shilganda shu yerga import qilinadi
// import { aiChatConfig } from './ai-chat/config'
// import { terminalConfig } from './terminal/config'
// import { fileManagerConfig } from './file-manager/config'
// import { settingsConfig } from './settings/config'
// import { textEditorConfig } from './text-editor/config'
// import { appMarketConfig } from './app-market/config'

export const appRegistry: Record<string, AppRegistryEntry> = {
  // Ilovalar implementatsiya qilinganda qo'shiladi:
  //
  // 'ai-chat': {
  //   config: aiChatConfig,
  //   component: lazy(() => import('./ai-chat/AiChat')),
  // },
  // 'terminal': {
  //   config: terminalConfig,
  //   component: lazy(() => import('./terminal/Terminal')),
  // },
  // 'file-manager': {
  //   config: fileManagerConfig,
  //   component: lazy(() => import('./file-manager/FileManager')),
  // },
  // 'settings': {
  //   config: settingsConfig,
  //   component: lazy(() => import('./settings/Settings')),
  // },
  // 'text-editor': {
  //   config: textEditorConfig,
  //   component: lazy(() => import('./text-editor/TextEditor')),
  // },
  // 'app-market': {
  //   config: appMarketConfig,
  //   component: lazy(() => import('./app-market/AppMarket')),
  // },
}
