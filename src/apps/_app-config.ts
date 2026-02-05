import type { AppConfig } from '@/types'

export function createAppConfig(config: AppConfig): AppConfig {
  return {
    showInDock: true,
    showOnDesktop: false,
    ...config,
  }
}
