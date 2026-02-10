export interface UserProfile {
  id: string
  username: string
  displayName: string
  email: string
  avatar: string | null
  role: string
  isActive: boolean
}

export type AuthPhase = 'booting' | 'setup' | 'login' | 'loading' | 'authenticated'

export type SetupStep = 'welcome' | 'account' | 'password' | 'avatar' | 'complete'

export interface SetupAccountData {
  fullName: string
  username: string
  email: string
}

export interface SetupPasswordData {
  password: string
  confirmPassword: string
}

export interface SetupUserData {
  email: string
  username: string
  displayName: string
  password: string
  avatarFile: File | null
  avatarEmoji: string | null
}
