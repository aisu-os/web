import { create } from 'zustand'
import type { CursorType, CursorTheme } from '@/types'
import { macosDefaultTheme } from '@/cursor/themes/macos-default'

interface CursorStore {
  theme: CursorTheme
  cursorType: CursorType
  isEnabled: boolean
  isVisible: boolean

  setCursorType: (type: CursorType) => void
  setTheme: (theme: CursorTheme) => void
  setEnabled: (enabled: boolean) => void
  setVisible: (visible: boolean) => void
  resetCursor: () => void
}

export const useCursorStore = create<CursorStore>((set) => ({
  theme: macosDefaultTheme,
  cursorType: 'default',
  isEnabled: true,
  isVisible: true,

  setCursorType: (cursorType) => set({ cursorType }),
  setTheme: (theme) => set({ theme }),
  setEnabled: (isEnabled) => set({ isEnabled }),
  setVisible: (isVisible) => set({ isVisible }),
  resetCursor: () => set({ cursorType: 'default' }),
}))
