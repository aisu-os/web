import { lazy } from 'react'
import type { AppConfig } from '@/types'

export interface AppRegistryEntry {
  config: AppConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.LazyExoticComponent<React.ComponentType<any>>
}

// Ilovalar config'lari qo'shilganda shu yerga import qilinadi
import { fileManagerConfig } from './file-manager/config'
import { imageViewerConfig } from './image-viewer/config'
// import { aiChatConfig } from './ai-chat/config'
// import { terminalConfig } from './terminal/config'
// import { settingsConfig } from './settings/config'
// import { textEditorConfig } from './text-editor/config'
// import { appMarketConfig } from './app-market/config'

export const appRegistry: Record<string, AppRegistryEntry> = {
  'file-manager': {
    config: fileManagerConfig,
    component: lazy(() => import('./file-manager/FileManager')),
  },
  'image-viewer': {
    config: imageViewerConfig,
    component: lazy(() => import('./image-viewer/ImageViewer')),
  },
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
