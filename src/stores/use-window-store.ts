import { create } from 'zustand'
import type { WindowState, WindowPosition, WindowSize } from '@/types'
import { appRegistry } from '@/apps/_registry'
import { useProcessStore } from '@/stores/use-process-store'

interface WindowStore {
  windows: WindowState[]
  nextZIndex: number

  openWindow: (appId: string, props?: Record<string, unknown>) => string
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  unfocusProcessWindows: (processId: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  moveWindow: (id: string, position: WindowPosition) => void
  resizeWindow: (id: string, size: WindowSize) => void
  setWindowTitle: (id: string, title: string) => void

  // Additional data for windows opened from apps
  windowProps: Record<string, Record<string, unknown>>
  getWindowProps: (id: string) => Record<string, unknown> | undefined
  setWindowProps: (id: string, props: Record<string, unknown>) => void
  restoreWindows: (
    windows: WindowState[],
    windowProps: Record<string, Record<string, unknown>>,
    nextZIndex: number,
  ) => void
  clearAll: () => void
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

    // Single-instance: if app doesn't support multiple windows,
    // focus the existing window
    if (!config.multipleInstances) {
      const existingWindow = get().windows.find((w) => w.appId === appId)
      if (existingWindow) {
        get().focusWindow(existingWindow.id)
        const process = useProcessStore.getState().getProcess(existingWindow.processId)
        if (process?.isHidden) {
          useProcessStore.getState().unhideProcess(existingWindow.processId)
        }
        return existingWindow.id
      }
    }

    const id = `${appId}-${++windowCounter}`

    const processId = useProcessStore.getState().spawnProcess(appId)

    const existingCount = get().windows.filter((w) => w.appId === appId).length
    const offset = existingCount * 28

    const newWindow: WindowState = {
      id,
      appId,
      processId,
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
    const window = get().windows.find((w) => w.id === id)

    set((state) => {
      const remaining = state.windows.filter((w) => w.id !== id)
      const newProps = { ...state.windowProps }
      delete newProps[id]

      if (remaining.length > 0) {
        const visible = remaining.filter((w) => !w.isMinimized)
        const topWindow = visible.length > 0
          ? visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
          : null
        return {
          windows: remaining.map((w) => ({
            ...w,
            isFocused: topWindow ? w.id === topWindow.id : false,
          })),
          windowProps: newProps,
        }
      }

      return { windows: remaining, windowProps: newProps }
    })

    // If no other windows remain for this process, kill the process too
    if (window) {
      const remainingWindows = get().windows.filter(
        (w) => w.processId === window.processId
      )
      if (remainingWindows.length === 0) {
        useProcessStore.getState().killProcess(window.processId)
      }
    }
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

  unfocusProcessWindows: (processId) => {
    set((state) => {
      const updated = state.windows.map((w) =>
        w.processId === processId ? { ...w, isFocused: false } : w
      )
      // Focus the topmost remaining visible window
      const hiddenProcessIds = new Set(
        useProcessStore.getState().processes
          .filter((p) => p.isHidden || p.id === processId)
          .map((p) => p.id)
      )
      const visible = updated.filter(
        (w) => !w.isMinimized && !hiddenProcessIds.has(w.processId)
      )
      if (visible.length > 0) {
        const topWindow = visible.reduce((a, b) =>
          a.zIndex > b.zIndex ? a : b
        )
        return {
          windows: updated.map((w) => ({
            ...w,
            isFocused: w.id === topWindow.id,
          })),
        }
      }
      return { windows: updated }
    })
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

  setWindowTitle: (id, title) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, title } : w
      ),
    }))
  },

  getWindowProps: (id) => {
    return get().windowProps[id]
  },

  setWindowProps: (id, props) => {
    set((state) => ({
      windowProps: {
        ...state.windowProps,
        [id]: { ...state.windowProps[id], ...props },
      },
    }))
  },

  restoreWindows: (windows, windowProps, nextZIndex) => {
    // Update windowCounter — to prevent ID collisions
    let maxCounter = 0
    for (const w of windows) {
      const parts = w.id.split('-')
      const num = parseInt(parts[parts.length - 1], 10)
      if (!isNaN(num) && num > maxCounter) {
        maxCounter = num
      }
    }
    windowCounter = maxCounter

    set({ windows, windowProps, nextZIndex })
  },

  clearAll: () => {
    set({ windows: [], nextZIndex: 100, windowProps: {} })
  },
}))
