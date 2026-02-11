import { create } from 'zustand'
import type { AuthPhase, UserProfile } from '@/types'
import { clearToken } from '@/services/api/client'
import {
  getSavedUsername,
  fetchUserProfile,
  loginUser,
  clearSavedUsername,
} from '@/services/api/auth-service'
import { useProcessStore } from '@/stores/use-process-store'
import { useWindowStore } from '@/stores/use-window-store'
import { useThemeStore } from '@/stores/use-theme-store'
import { useFileSystemStore } from '@/stores/use-file-system-store'

interface AuthStore {
  phase: AuthPhase
  user: UserProfile | null
  error: string | null
  isLoading: boolean
  requireInteraction: boolean
  bootCount: number

  initializeAuth: () => void
  attemptLogin: (password: string) => Promise<void>
  attemptLoginWithUsername: (username: string, password: string) => Promise<void>
  completeLoading: () => void
  startLoading: () => void
  logout: () => void
  clearError: () => void
  completeSetup: () => void
  goToSetup: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  phase: 'booting',
  user: null,
  error: null,
  isLoading: false,
  requireInteraction: false,
  bootCount: 0,

  initializeAuth: () => {
    const savedUsername = getSavedUsername()

    if (savedUsername) {
      // Username bor — avatar, displayName, wallpaper olish (parol so'rash uchun)
      fetchUserProfile(savedUsername)
        .then((result) => {
          if (result) {
            if (result.wallpaper) {
              useThemeStore.getState().setWallpaper(result.wallpaper)
            }
            set({ phase: 'login', user: result.user })
          } else {
            clearSavedUsername()
            set({ phase: 'login', user: null })
          }
        })
        .catch(() => {
          set({ phase: 'login', user: null })
        })
      return
    }

    // Username yo'q — switch-user rejimi
    set({ phase: 'login', user: null })
  },

  attemptLogin: async (password: string) => {
    const { user } = get()
    if (!user) return

    const result = await loginUser(user.username, password)
    if (result.success) {
      if (result.wallpaper) {
        useThemeStore.getState().setWallpaper(result.wallpaper)
      }
      set({ phase: 'loading', error: null, user: result.user })
      useFileSystemStore.getState().loadTree()
    } else {
      set({ error: result.error ?? "Noto'g'ri parol" })
    }
  },

  attemptLoginWithUsername: async (username: string, password: string) => {
    const result = await loginUser(username, password)
    if (result.success) {
      if (result.wallpaper) {
        useThemeStore.getState().setWallpaper(result.wallpaper)
      }
      set({ phase: 'loading', error: null, user: result.user })
      useFileSystemStore.getState().loadTree()
    } else {
      set({ error: result.error ?? 'Xatolik yuz berdi' })
    }
  },

  completeSetup: () => {
    set((state) => ({
      phase: 'booting',
      user: null,
      bootCount: state.bootCount + 1,
    }))
  },

  completeLoading: () => {
    set({ phase: 'authenticated' })
  },

  startLoading: () => {
    set({ phase: 'loading', requireInteraction: false })
  },

  logout: () => {
    useWindowStore.getState().clearAll()
    useProcessStore.getState().clearAll()
    useFileSystemStore.getState().resetStore()
    clearToken()
    clearSavedUsername()
    set({ phase: 'login', user: null, error: null, requireInteraction: false })
  },

  clearError: () => {
    set({ error: null })
  },

  goToSetup: () => {
    set({ phase: 'setup', user: null })
  },
}))
