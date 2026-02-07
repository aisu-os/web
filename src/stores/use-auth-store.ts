import { create } from 'zustand'
import type { AuthPhase, UserProfile } from '@/types'
import { getCurrentUser } from '@/services/api/auth-service'
import { useProcessStore } from '@/stores/use-process-store'
import { useWindowStore } from '@/stores/use-window-store'

interface AuthStore {
  phase: AuthPhase
  user: UserProfile | null
  error: string | null
  isLoading: boolean
  requireInteraction: boolean
  bootCount: number

  initializeAuth: () => void
  attemptLogin: (password: string) => boolean
  completeLoading: () => void
  startLoading: () => void
  logout: () => void
  clearError: () => void
  completeSetup: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  phase: 'booting',
  user: null,
  error: null,
  isLoading: false,
  requireInteraction: false,
  bootCount: 0,

  initializeAuth: () => {
    getCurrentUser().then((user) => {
      if (!user) {
        set({ phase: 'setup', user: null })
        return
      }

      if (!user.passwordEnabled) {
        set({ phase: 'loading', user })
        return
      }

      set({ phase: 'login', user })
    })
  },

  attemptLogin: (password: string) => {
    const stored = localStorage.getItem('aisu_password')
    if (password === stored) {
      set({ phase: 'loading', error: null })
      return true
    }

    set({ error: "Noto'g'ri parol" })
    return false
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
    set({ phase: 'login', error: null, requireInteraction: true })
  },

  clearError: () => {
    set({ error: null })
  },
}))
