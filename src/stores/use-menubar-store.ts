import { create } from 'zustand'
import type { AppMenuBarConfig } from '@/types'

interface MenuBarStore {
  activeMenu: string
  appName: string
  appMenuConfig: AppMenuBarConfig | null
  isAboutOpen: boolean

  setActiveMenu: (menuLabel: string) => void
  closeMenu: () => void
  setAppName: (name: string) => void
  setAppMenuConfig: (config: AppMenuBarConfig | null) => void
  openAbout: () => void
  closeAbout: () => void
}

export const useMenuBarStore = create<MenuBarStore>((set) => ({
  activeMenu: '',
  appName: 'aisu',
  appMenuConfig: null,
  isAboutOpen: false,

  setActiveMenu: (menuLabel) => set({ activeMenu: menuLabel }),
  closeMenu: () => set({ activeMenu: '' }),
  setAppName: (name) => set({ appName: name }),
  setAppMenuConfig: (config) => set({ appMenuConfig: config }),
  openAbout: () => set({ isAboutOpen: true }),
  closeAbout: () => set({ isAboutOpen: false }),
}))
