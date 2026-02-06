import type { SystemAppId } from '@/types'

export interface DockItemConfig {
  id: SystemAppId
  label: string
  icon: React.ComponentType<{ size?: number }>
}
