import type { UserProfile } from '@/types'

// Bu flagni o'zgartirib ikkala holatni test qilish mumkin
export const MOCK_PASSWORD_ENABLED = true

export const MOCK_USER: UserProfile = {
  id: 'user-1',
  displayName: 'User',
  avatar: null,
  passwordEnabled: MOCK_PASSWORD_ENABLED,
}

export const MOCK_PASSWORD = '1234'

export const LOGIN_TIMING = {
  enterDelay: 200,
  avatarDuration: 800,
  clockDuration: 600,
  fieldDelay: 400,
  shakeDuration: 500,
  successDelay: 600,
  fadeOutDuration: 800,
  loadingDuration: 3000,
  loadingStatusInterval: 1000,
} as const

export const LOGIN_LOADING_MESSAGES = [
  'Ish stoli tayyorlanmoqda',
  'Ilovalar yuklanmoqda',
  'Fayllar sinxronlanmoqda',
  'Deyarli tayyor',
] as const
