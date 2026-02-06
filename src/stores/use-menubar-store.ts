import { create } from 'zustand'
import type { AppMenuBarConfig } from '@/types'

interface MenuBarStore {
  activeMenu: string
  appMenuConfig: AppMenuBarConfig | null

  setActiveMenu: (menuLabel: string) => void
  closeMenu: () => void
  setAppMenuConfig: (config: AppMenuBarConfig | null) => void
}

export const useMenuBarStore = create<MenuBarStore>((set) => ({
  activeMenu: '',
  appMenuConfig: null,

  setActiveMenu: (menuLabel) => set({ activeMenu: menuLabel }),
  closeMenu: () => set({ activeMenu: '' }),
  setAppMenuConfig: (config) => set({ appMenuConfig: config }),
}))
