import { create } from 'zustand'
import type { AuthPhase, UserProfile } from '@/types'
import { MOCK_USER, MOCK_PASSWORD } from '@/shell/login/login.constants'

interface AuthStore {
  phase: AuthPhase
  user: UserProfile | null
  error: string | null
  isLoading: boolean

  initializeAuth: () => void
  attemptLogin: (password: string) => boolean
  completeLoading: () => void
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  phase: 'booting',
  user: null,
  error: null,
  isLoading: false,

  initializeAuth: () => {
    const user = MOCK_USER

    if (!user) {
      // Foydalanuvchi yo'q — keyinchalik OS setup oqimi
      set({ phase: 'login', user: null })
      return
    }

    if (!user.passwordEnabled) {
      // Parol o'chirilgan — loading orqali desktopga
      set({ phase: 'loading', user })
      return
    }

    // Parol kerak — login ekranini ko'rsatish
    set({ phase: 'login', user })
  },

  attemptLogin: (password: string) => {
    if (password === MOCK_PASSWORD) {
      set({ phase: 'loading', error: null })
      return true
    }

    set({ error: "Noto'g'ri parol" })
    return false
  },

  completeLoading: () => {
    set({ phase: 'authenticated' })
  },

  logout: () => {
    set({ phase: 'login', error: null })
  },

  clearError: () => {
    set({ error: null })
  },
}))
