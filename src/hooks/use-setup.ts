import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '@/stores/use-auth-store'
import { registerUser } from '@/services/api/auth-service'
import { SETUP_STEPS, SETUP_TIMING, PRESET_AVATARS } from '@/shell/setup/setup.constants'
import type { SetupStep, SetupAccountData, SetupPasswordData, SetupUserData } from '@/types'

interface UseSetupReturn {
  isVisible: boolean
  isFadingOut: boolean

  currentStep: SetupStep
  currentStepIndex: number
  totalSteps: number
  canGoBack: boolean
  isTransitioning: boolean
  goNext: () => void
  goBack: () => void

  accountData: SetupAccountData
  passwordData: SetupPasswordData
  selectedAvatar: string | null
  uploadedAvatar: string | null

  updateAccountData: (data: Partial<SetupAccountData>) => void
  updatePasswordData: (data: Partial<SetupPasswordData>) => void
  selectAvatar: (gradient: string | null) => void
  uploadAvatar: (dataUrl: string, file: File | null) => void

  accountErrors: Partial<Record<keyof SetupAccountData, string>>
  passwordErrors: Partial<Record<keyof SetupPasswordData, string>>
  validateAccount: () => boolean
  validatePassword: () => boolean

  isSubmitting: boolean
  submitError: string | null
  completeSetup: () => Promise<void>

  createdUserName: string
}

function getBetaParams(): { token: string | null; email: string | null } {
  const params = new URLSearchParams(window.location.search)
  return {
    token: params.get('token'),
    email: params.get('email'),
  }
}

export function useSetup(): UseSetupReturn {
  const phase = useAuthStore((s) => s.phase)
  const completeSetupAction = useAuthStore((s) => s.completeSetup)

  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const betaParams = getBetaParams()

  const [accountData, setAccountData] = useState<SetupAccountData>({
    fullName: '',
    username: '',
    email: betaParams.email ?? '',
  })
  const [passwordData, setPasswordData] = useState<SetupPasswordData>({
    password: '',
    confirmPassword: '',
  })
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [selectedAvatarEmoji, setSelectedAvatarEmoji] = useState<string | null>(null)
  const [uploadedAvatarFile, setUploadedAvatarFile] = useState<File | null>(null)
  const [uploadedAvatarPreview, setUploadedAvatarPreview] = useState<string | null>(null)

  const [accountErrors, setAccountErrors] = useState<Partial<Record<keyof SetupAccountData, string>>>({})
  const [passwordErrors, setPasswordErrors] = useState<Partial<Record<keyof SetupPasswordData, string>>>({})

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const currentStep = SETUP_STEPS[currentStepIndex]
  const completedRef = useRef(false)

  useEffect(() => {
    if (phase === 'setup') {
      setIsVisible(true)
      setIsFadingOut(false)
      setCurrentStepIndex(0)
      completedRef.current = false
    }
  }, [phase])

  const validateAccount = useCallback((): boolean => {
    const errors: Partial<Record<keyof SetupAccountData, string>> = {}

    if (!accountData.fullName.trim()) {
      errors.fullName = 'Full name is required'
    }
    if (!accountData.username.trim()) {
      errors.username = 'Username is required'
    } else if (accountData.username.length < 3) {
      errors.username = 'Must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_-]+$/.test(accountData.username)) {
      errors.username = 'Only letters, numbers, _ and - are allowed'
    }
    if (!accountData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) {
      errors.email = 'Invalid email format'
    }

    setAccountErrors(errors)
    return Object.keys(errors).length === 0
  }, [accountData])

  const validatePassword = useCallback((): boolean => {
    const errors: Partial<Record<keyof SetupPasswordData, string>> = {}

    if (!passwordData.password) {
      errors.password = 'Password is required'
    } else if (passwordData.password.length < 4) {
      errors.password = 'Must be at least 4 characters'
    }
    if (passwordData.password !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }, [passwordData])

  const goNext = useCallback(() => {
    if (currentStep === 'account' && !validateAccount()) return
    if (currentStep === 'password' && !validatePassword()) return

    if (currentStepIndex < SETUP_STEPS.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStepIndex((i) => i + 1)
        setIsTransitioning(false)
      }, SETUP_TIMING.stepTransitionDuration)
    }
  }, [currentStepIndex, currentStep, validateAccount, validatePassword])

  const goBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStepIndex((i) => i - 1)
        setIsTransitioning(false)
      }, SETUP_TIMING.stepTransitionDuration)
    }
  }, [currentStepIndex])

  const updateAccountData = useCallback((data: Partial<SetupAccountData>) => {
    setAccountData((prev) => ({ ...prev, ...data }))
    setAccountErrors((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(data) as Array<keyof SetupAccountData>) {
        delete next[key]
      }
      return next
    })
  }, [])

  const updatePasswordData = useCallback((data: Partial<SetupPasswordData>) => {
    setPasswordData((prev) => ({ ...prev, ...data }))
    setPasswordErrors((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(data) as Array<keyof SetupPasswordData>) {
        delete next[key]
      }
      return next
    })
  }, [])

  const selectAvatar = useCallback((gradient: string | null) => {
    setSelectedAvatar(gradient)
    if (gradient) {
      // Find matching emoji for gradient
      const preset = PRESET_AVATARS.find((a) => a.gradient === gradient)
      setSelectedAvatarEmoji(preset?.emoji ?? null)
      setUploadedAvatarFile(null)
      setUploadedAvatarPreview(null)
    } else {
      setSelectedAvatarEmoji(null)
    }
  }, [])

  const uploadAvatar = useCallback((dataUrl: string, file: File | null) => {
    if (!dataUrl || !file) {
      // Remove
      setUploadedAvatarFile(null)
      setUploadedAvatarPreview(null)
    } else {
      setUploadedAvatarFile(file)
      setUploadedAvatarPreview(dataUrl)
    }
    setSelectedAvatar(null)
    setSelectedAvatarEmoji(null)
  }, [])

  const completeSetup = useCallback(async () => {
    if (completedRef.current) return
    completedRef.current = true

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const userData: SetupUserData = {
        email: accountData.email,
        username: accountData.username,
        displayName: accountData.fullName,
        password: passwordData.password,
        avatarFile: uploadedAvatarFile,
        avatarEmoji: selectedAvatarEmoji,
        betaToken: betaParams.token,
      }

      await registerUser(userData)

      // NOTE(beta): Registratsiya muvaffaqiyatli — URL dan token/email parametrlarini tozalash
      if (betaParams.token) {
        window.history.replaceState({}, '', window.location.pathname)
      }

      setTimeout(() => {
        setIsFadingOut(true)

        setTimeout(() => {
          setIsVisible(false)
          setIsFadingOut(false)
          completeSetupAction()
        }, SETUP_TIMING.fadeOutDuration)
      }, SETUP_TIMING.completeDisplayDuration)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
      setIsSubmitting(false)
      completedRef.current = false
    }
  }, [accountData, passwordData, uploadedAvatarFile, selectedAvatarEmoji, completeSetupAction])

  return {
    isVisible,
    isFadingOut,
    currentStep,
    currentStepIndex,
    totalSteps: SETUP_STEPS.length,
    canGoBack: currentStepIndex > 0 && currentStep !== 'welcome' && currentStep !== 'complete',
    isTransitioning,
    goNext,
    goBack,
    accountData,
    passwordData,
    selectedAvatar,
    uploadedAvatar: uploadedAvatarPreview,
    updateAccountData,
    updatePasswordData,
    selectAvatar,
    uploadAvatar,
    accountErrors,
    passwordErrors,
    validateAccount,
    validatePassword,
    isSubmitting,
    submitError,
    completeSetup,
    createdUserName: accountData.fullName,
  }
}
