import { create } from 'zustand'
import type { ThemeConfig, ThemeMode } from '@/types'
import { WALLPAPERS } from '@/shell/desktop/desktop.constants'

interface ThemeStore {
  theme: ThemeConfig
  setWallpaper: (wallpaper: string) => void
  setThemeMode: (mode: ThemeMode) => void
  setAccentColor: (color: string) => void
  randomizeWallpaper: () => void
}

function getRandomWallpaper(): string {
  return WALLPAPERS[Math.floor(Math.random() * WALLPAPERS.length)]
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: {
    mode: 'dark',
    wallpaper: getRandomWallpaper(),
    accentColor: '#0EA5E9',
  },
  setWallpaper: (wallpaper) =>
    set((state) => ({ theme: { ...state.theme, wallpaper } })),
  setThemeMode: (mode) =>
    set((state) => ({ theme: { ...state.theme, mode } })),
  setAccentColor: (color) =>
    set((state) => ({ theme: { ...state.theme, accentColor: color } })),
  randomizeWallpaper: () =>
    set((state) => ({ theme: { ...state.theme, wallpaper: getRandomWallpaper() } })),
}))
