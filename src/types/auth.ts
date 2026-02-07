export interface UserProfile {
  id: string
  displayName: string
  avatar: string | null
  passwordEnabled: boolean
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

export interface SetupUserData extends SetupAccountData {
  password: string
  avatar: string | null
}
