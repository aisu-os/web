export interface UserProfile {
  id: string
  displayName: string
  avatar: string | null
  passwordEnabled: boolean
}

export type AuthPhase = 'booting' | 'login' | 'loading' | 'authenticated'
