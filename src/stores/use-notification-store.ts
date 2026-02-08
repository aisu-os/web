import { create } from 'zustand'
import type { Notification, NotificationInput } from '@/types'

const MAX_NOTIFICATIONS = 5
const DEFAULT_DURATION = 5000

interface NotificationStore {
  notifications: Notification[]
  add: (input: NotificationInput) => string
  remove: (id: string) => void
  update: (id: string, partial: Partial<NotificationInput>) => void
  clearAll: () => void
}

let counter = 0
const timers = new Map<string, ReturnType<typeof setTimeout>>()

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  add: (input) => {
    const id = `notif-${++counter}`
    const duration = input.duration ?? DEFAULT_DURATION

    const notification: Notification = {
      ...input,
      id,
      duration,
      createdAt: Date.now(),
    }

    set((state) => {
      const updated = [notification, ...state.notifications]
      // Eski notificationlarni o'chirish (limitdan oshsa)
      if (updated.length > MAX_NOTIFICATIONS) {
        const removed = updated.slice(MAX_NOTIFICATIONS)
        for (const r of removed) {
          const timer = timers.get(r.id)
          if (timer) {
            clearTimeout(timer)
            timers.delete(r.id)
          }
        }
        return { notifications: updated.slice(0, MAX_NOTIFICATIONS) }
      }
      return { notifications: updated }
    })

    // Auto-dismiss
    if (duration > 0) {
      const timer = setTimeout(() => {
        timers.delete(id)
        get().remove(id)
      }, duration)
      timers.set(id, timer)
    }

    return id
  },

  remove: (id) => {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  update: (id, partial) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, ...partial } : n
      ),
    }))
  },

  clearAll: () => {
    for (const timer of timers.values()) {
      clearTimeout(timer)
    }
    timers.clear()
    set({ notifications: [] })
  },
}))

// Standalone helper — hook ishlatmasdan istalgan joydan chaqirish mumkin
export const notify = {
  success: (title: string, options?: Partial<NotificationInput>) =>
    useNotificationStore.getState().add({ type: 'success', title, ...options }),

  error: (title: string, options?: Partial<NotificationInput>) =>
    useNotificationStore.getState().add({ type: 'error', title, duration: 0, ...options }),

  warning: (title: string, options?: Partial<NotificationInput>) =>
    useNotificationStore.getState().add({ type: 'warning', title, ...options }),

  info: (title: string, options?: Partial<NotificationInput>) =>
    useNotificationStore.getState().add({ type: 'info', title, ...options }),

  custom: (input: NotificationInput) =>
    useNotificationStore.getState().add(input),

  remove: (id: string) =>
    useNotificationStore.getState().remove(id),

  update: (id: string, partial: Partial<NotificationInput>) =>
    useNotificationStore.getState().update(id, partial),
}
