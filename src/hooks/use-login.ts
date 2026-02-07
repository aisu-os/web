import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import { LOGIN_TIMING } from '@/shell/login/login.constants'
import type { UserProfile } from '@/types'

interface UseLoginReturn {
  isVisible: boolean
  isFadingOut: boolean
  user: UserProfile | null
  error: string | null
  isLoading: boolean
  handleSubmit: (password: string) => void
}

export function useLogin(): UseLoginReturn {
  const phase = useAuthStore((s) => s.phase)
  const user = useAuthStore((s) => s.user)
  const error = useAuthStore((s) => s.error)
  const attemptLogin = useAuthStore((s) => s.attemptLogin)
  const clearError = useAuthStore((s) => s.clearError)

  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const prevPhaseRef = useRef(phase)

  // Phase o'zgarganda isVisible ni boshqarish
  useEffect(() => {
    const prevPhase = prevPhaseRef.current
    prevPhaseRef.current = phase

    if (phase === 'login') {
      setIsVisible(true)
      setIsFadingOut(false)
    }

    // login → authenticated o'tish
    if (prevPhase === 'login' && phase === 'authenticated') {
      setIsFadingOut(true)

      const timer = setTimeout(() => {
        setIsVisible(false)
        setIsFadingOut(false)
      }, LOGIN_TIMING.successDelay + LOGIN_TIMING.fadeOutDuration)

      return () => clearTimeout(timer)
    }
  }, [phase])

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
    handleSubmit,
  }
}
