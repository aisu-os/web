import type { ReactNode } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationAction {
  label: string
  onClick: () => void
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  icon?: ReactNode
  actions?: NotificationAction[]
  progress?: number
  createdAt: number
}

export type NotificationInput = Omit<Notification, 'id' | 'createdAt'>
