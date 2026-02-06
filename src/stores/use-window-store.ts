import { create } from 'zustand'
import type { WindowState, WindowPosition, WindowSize } from '@/types'
import { appRegistry } from '@/apps/_registry'

interface WindowStore {
  windows: WindowState[]
  nextZIndex: number

  openWindow: (appId: string, props?: Record<string, unknown>) => string
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  moveWindow: (id: string, position: WindowPosition) => void
  resizeWindow: (id: string, size: WindowSize) => void

  // App-dan ochilgan oynalar uchun qo'shimcha ma'lumot
  windowProps: Record<string, Record<string, unknown>>
  getWindowProps: (id: string) => Record<string, unknown> | undefined
}

let windowCounter = 0

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  nextZIndex: 100,
  windowProps: {},

  openWindow: (appId, props) => {
    const entry = appRegistry[appId]
    if (!entry) return ''

    const { config } = entry
    const id = `${appId}-${++windowCounter}`

    const existingCount = get().windows.filter((w) => w.appId === appId).length
    const offset = existingCount * 28

    const newWindow: WindowState = {
      id,
      appId,
      title: config.title,
      position: {
        x: 120 + offset,
        y: 60 + offset,
      },
      size: {
        width: config.window.defaultWidth,
        height: config.window.defaultHeight,
      },
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      zIndex: get().nextZIndex,
    }

    set((state) => ({
      windows: [
        ...state.windows.map((w) => ({ ...w, isFocused: false })),
        newWindow,
      ],
      nextZIndex: state.nextZIndex + 1,
      windowProps: props
        ? { ...state.windowProps, [id]: props }
        : state.windowProps,
    }))

    return id
  },

  closeWindow: (id) => {
    set((state) => {
      const remaining = state.windows.filter((w) => w.id !== id)
      const newProps = { ...state.windowProps }
      delete newProps[id]

      if (remaining.length > 0) {
        const topWindow = remaining.reduce((a, b) =>
          a.zIndex > b.zIndex ? a : b
        )
        return {
          windows: remaining.map((w) => ({
            ...w,
            isFocused: w.id === topWindow.id,
          })),
          windowProps: newProps,
        }
      }

      return { windows: remaining, windowProps: newProps }
    })
  },

  focusWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => ({
        ...w,
        isFocused: w.id === id,
        zIndex: w.id === id ? state.nextZIndex : w.zIndex,
        isMinimized: w.id === id ? false : w.isMinimized,
      })),
      nextZIndex: state.nextZIndex + 1,
    }))
  },

  minimizeWindow: (id) => {
    set((state) => {
      const remaining = state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
      )
      const visible = remaining.filter((w) => !w.isMinimized)
      if (visible.length > 0) {
        const topWindow = visible.reduce((a, b) =>
          a.zIndex > b.zIndex ? a : b
        )
        return {
          windows: remaining.map((w) => ({
            ...w,
            isFocused: w.id === topWindow.id,
          })),
        }
      }
      return { windows: remaining }
    })
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: true } : w
      ),
    }))
  },

  restoreWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: false } : w
      ),
    }))
  },

  moveWindow: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    }))
  },

  resizeWindow: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size } : w
      ),
    }))
  },

  getWindowProps: (id) => {
    return get().windowProps[id]
  },
}))
