import { create } from 'zustand'
import type { ThemeConfig, ThemeMode } from '@/types'
import { WALLPAPERS } from '@/shell/desktop/desktop.constants'
import { saveWallpaper } from '@/services/api/auth-service'

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface ThemeStore {
  theme: ThemeConfig
  effectiveMode: 'light' | 'dark'
  setWallpaper: (wallpaper: string) => void
  setThemeMode: (mode: ThemeMode) => void
  setAccentColor: (color: string) => void
  randomizeWallpaper: () => void
}

function getRandomWallpaper(): string {
  return WALLPAPERS[Math.floor(Math.random() * WALLPAPERS.length)]
}

export const useThemeStore = create<ThemeStore>((set, get) => {
  // Listen for system theme changes
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const { theme } = get()
      if (theme.mode === 'auto') {
        set({ effectiveMode: getSystemPreference() })
      }
    })
  }

  return {
    theme: {
      mode: 'dark',
      wallpaper: getRandomWallpaper(),
      accentColor: '#0EA5E9',
    },
    effectiveMode: 'dark',
    setWallpaper: (wallpaper) => {
      saveWallpaper(wallpaper)
      set((state) => ({ theme: { ...state.theme, wallpaper } }))
    },
    setThemeMode: (mode) =>
      set((state) => ({
        theme: { ...state.theme, mode },
        effectiveMode: mode === 'auto' ? getSystemPreference() : mode,
      })),
    setAccentColor: (color) =>
      set((state) => ({ theme: { ...state.theme, accentColor: color } })),
    randomizeWallpaper: () => {
      const wallpaper = getRandomWallpaper()
      saveWallpaper(wallpaper)
      set((state) => ({ theme: { ...state.theme, wallpaper } }))
    },
  }
})
