import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import {
  LOGIN_TIMING,
  LOGIN_LOADING_MESSAGES,
} from '@/shell/login/login.constants'
import type { UserProfile } from '@/types'

type LoginMode = 'known-user' | 'switch-user'

interface UseLoginReturn {
  isVisible: boolean
  isFadingOut: boolean
  user: UserProfile | null
  error: string | null
  isLoading: boolean
  isDesktopLoading: boolean
  loadingProgress: number
  loadingStatus: string
  requireInteraction: boolean
  handleSubmit: (password: string) => void
  startLoading: () => void
  loginMode: LoginMode
  switchToOtherUser: () => void
  switchToKnownUser: () => void
  handleUsernameSubmit: (username: string, password: string) => void
  goToSetup: () => void
}

export function useLogin(): UseLoginReturn {
  const phase = useAuthStore((s) => s.phase)
  const user = useAuthStore((s) => s.user)
  const error = useAuthStore((s) => s.error)
  const attemptLogin = useAuthStore((s) => s.attemptLogin)
  const clearError = useAuthStore((s) => s.clearError)
  const completeLoading = useAuthStore((s) => s.completeLoading)
  const requireInteraction = useAuthStore((s) => s.requireInteraction)
  const startLoading = useAuthStore((s) => s.startLoading)
  const attemptLoginWithUsername = useAuthStore((s) => s.attemptLoginWithUsername)
  const goToSetupAction = useAuthStore((s) => s.goToSetup)

  const [loginMode, setLoginMode] = useState<LoginMode>('known-user')
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDesktopLoading, setIsDesktopLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStatus, setLoadingStatus] = useState<string>(LOGIN_LOADING_MESSAGES[0])
  const prevPhaseRef = useRef(phase)

  // Phase o'zgarganda isVisible ni boshqarish
  useEffect(() => {
    const prevPhase = prevPhaseRef.current
    prevPhaseRef.current = phase

    if (phase === 'login') {
      setIsVisible(true)
      setIsFadingOut(false)
      setIsDesktopLoading(false)
      setLoadingProgress(0)
      setIsLoading(false)
      setLoginMode(user ? 'known-user' : 'switch-user')
    }

    // login → loading: progress bar boshlanadi
    if (phase === 'loading' && prevPhase !== 'loading') {
      setIsVisible(true)
      setIsDesktopLoading(true)
      setLoadingProgress(0)
      setLoadingStatus(LOGIN_LOADING_MESSAGES[0])
      setLoginMode('known-user')
    }

    // loading → authenticated o'tish
    if (prevPhase === 'loading' && phase === 'authenticated') {
      setIsFadingOut(true)

      const timer = setTimeout(() => {
        setIsVisible(false)
        setIsFadingOut(false)
        setIsDesktopLoading(false)
      }, LOGIN_TIMING.fadeOutDuration)

      return () => clearTimeout(timer)
    }

    // setup yoki booting ga o'tganda login ekranini yashirish
    if (phase === 'setup' || phase === 'booting') {
      setIsVisible(false)
      setIsFadingOut(false)
      setIsDesktopLoading(false)
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Loading progress animatsiyasi
  useEffect(() => {
    if (!isDesktopLoading || phase !== 'loading') return

    const duration = LOGIN_TIMING.loadingDuration
    const interval = 50 // 50ms oraliqda yangilash
    const steps = duration / interval
    let step = 0

    const progressTimer = setInterval(() => {
      step++
      // Easing: boshida tez, oxirida sekin
      const linear = step / steps
      const eased = 1 - Math.pow(1 - linear, 3) // easeOutCubic
      setLoadingProgress(Math.min(eased * 100, 100))

      if (step >= steps) {
        clearInterval(progressTimer)
        setLoadingProgress(100)

        // Progress 100% bo'lgandan keyin kichik delay va keyin authenticated
        setTimeout(() => {
          completeLoading()
        }, 400)
      }
    }, interval)

    return () => clearInterval(progressTimer)
  }, [isDesktopLoading, phase, completeLoading])

  // Loading status matnini almashtirib turish
  useEffect(() => {
    if (!isDesktopLoading || phase !== 'loading') return

    let index = 0
    const statusTimer = setInterval(() => {
      index = (index + 1) % LOGIN_LOADING_MESSAGES.length
      setLoadingStatus(LOGIN_LOADING_MESSAGES[index])
    }, LOGIN_TIMING.loadingStatusInterval)

    return () => clearInterval(statusTimer)
  }, [isDesktopLoading, phase])

  // Error 2 soniyadan keyin tozalanadi
  useEffect(() => {
    if (!error) return

    const timer = setTimeout(() => {
      clearError()
    }, 2000)

    return () => clearTimeout(timer)
  }, [error, clearError])

  const handleSubmit = useCallback(
    async (password: string) => {
      if (isLoading || !password.trim()) return

      setIsLoading(true)

      try {
        await attemptLogin(password)
      } finally {
        setIsLoading(false)
      }
    },
    [attemptLogin, isLoading]
  )

  const switchToOtherUser = useCallback(() => {
    clearError()
    setLoginMode('switch-user')
  }, [clearError])

  const switchToKnownUser = useCallback(() => {
    clearError()
    setLoginMode('known-user')
  }, [clearError])

  const handleUsernameSubmit = useCallback(
    async (username: string, password: string) => {
      if (isLoading || !username.trim() || !password.trim()) return

      setIsLoading(true)

      try {
        await attemptLoginWithUsername(username, password)
      } finally {
        setIsLoading(false)
      }
    },
    [attemptLoginWithUsername, isLoading]
  )

  const goToSetup = useCallback(() => {
    goToSetupAction()
  }, [goToSetupAction])

  return {
    isVisible,
    isFadingOut,
    user,
    error,
    isLoading,
    isDesktopLoading,
    loadingProgress,
    loadingStatus,
    requireInteraction,
    handleSubmit,
    startLoading,
    loginMode,
    switchToOtherUser,
    switchToKnownUser,
    handleUsernameSubmit,
    goToSetup,
  }
}
