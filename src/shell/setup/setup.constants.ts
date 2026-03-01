import type { SetupStep } from '@/types'

export const SETUP_STEPS: readonly SetupStep[] = [
  'welcome',
  'account',
  'password',
  'avatar',
  'complete',
] as const

export const SETUP_STEP_TITLES: Record<SetupStep, string> = {
  welcome: 'Welcome',
  account: 'Create Account',
  password: 'Set Password',
  avatar: 'Choose Avatar',
  complete: 'Ready!',
} as const

export const SETUP_TIMING = {
  stepTransitionDuration: 400,
  fadeOutDuration: 800,
  completeDisplayDuration: 3000,
  restartDelay: 500,
} as const

export const PRESET_AVATARS = [
  { id: 'ice-crystal', gradient: 'linear-gradient(135deg, #7DD3FC, #0EA5E9)', emoji: '\u2744\uFE0F' },
  { id: 'aurora', gradient: 'linear-gradient(135deg, #A78BFA, #38BDF8)', emoji: '\uD83C\uDF0C' },
  { id: 'sunset', gradient: 'linear-gradient(135deg, #FDA4AF, #F472B6)', emoji: '\uD83C\uDF05' },
  { id: 'forest', gradient: 'linear-gradient(135deg, #6EE7B7, #34D399)', emoji: '\uD83C\uDF32' },
  { id: 'ocean', gradient: 'linear-gradient(135deg, #38BDF8, #0284C7)', emoji: '\uD83C\uDF0A' },
  { id: 'galaxy', gradient: 'linear-gradient(135deg, #818CF8, #6366F1)', emoji: '\u2728' },
  { id: 'flame', gradient: 'linear-gradient(135deg, #FCA5A5, #EF4444)', emoji: '\uD83D\uDD25' },
  { id: 'mint', gradient: 'linear-gradient(135deg, #99F6E4, #2DD4BF)', emoji: '\uD83C\uDF43' },
] as const

export type PresetAvatar = (typeof PRESET_AVATARS)[number]
