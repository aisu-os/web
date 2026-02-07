import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import {
  LOGIN_TIMING,
  LOGIN_LOADING_MESSAGES,
} from '@/shell/login/login.constants'
import type { UserProfile } from '@/types'

interface UseLoginReturn {
  isVisible: boolean
  isFadingOut: boolean
  user: UserProfile | null
  error: string | null
  isLoading: boolean
  isDesktopLoading: boolean
  loadingProgress: number
  loadingStatus: string
  handleSubmit: (password: string) => void
}

export function useLogin(): UseLoginReturn {
  const phase = useAuthStore((s) => s.phase)
  const user = useAuthStore((s) => s.user)
  const error = useAuthStore((s) => s.error)
  const attemptLogin = useAuthStore((s) => s.attemptLogin)
  const clearError = useAuthStore((s) => s.clearError)
  const completeLoading = useAuthStore((s) => s.completeLoading)

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
    }

    // login → loading: progress bar boshlanadi
    if (phase === 'loading' && prevPhase !== 'loading') {
      setIsVisible(true)
      setIsDesktopLoading(true)
      setLoadingProgress(0)
      setLoadingStatus(LOGIN_LOADING_MESSAGES[0])
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
    (password: string) => {
      if (isLoading || !password.trim()) return

      setIsLoading(true)

      // Kichik delay — UX uchun loading effekt
      setTimeout(() => {
        attemptLogin(password)
        setIsLoading(false)
      }, 300)
    },
    [attemptLogin, isLoading]
  )

  return {
    isVisible,
    isFadingOut,
    user,
    error,
    isLoading,
    isDesktopLoading,
    loadingProgress,
    loadingStatus,
    handleSubmit,
  }
}
