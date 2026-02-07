import type { UserProfile, SetupUserData } from '@/types'

const STORAGE_KEY = 'aisu_user'
const PASSWORD_KEY = 'aisu_password'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Yangi foydalanuvchi ro'yxatdan o'tkazish.
 * Hozircha localStorage ishlatadi — keyinchalik backend API bilan almashtiriladi.
 */
export async function registerUser(data: SetupUserData): Promise<UserProfile> {
  await delay(800)

  const user: UserProfile = {
    id: `user-${Date.now()}`,
    displayName: data.fullName,
    avatar: data.avatar,
    passwordEnabled: true,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  localStorage.setItem(PASSWORD_KEY, data.password)

  return user
}

/**
 * Mavjud foydalanuvchini olish.
 * null qaytarsa — setup oqimi boshlanadi.
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  await delay(100)

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null

  return JSON.parse(stored) as UserProfile
}

/**
 * Parolni tekshirish.
 */
export async function validatePassword(password: string): Promise<boolean> {
  await delay(200)

  const stored = localStorage.getItem(PASSWORD_KEY)
  return password === stored
}
