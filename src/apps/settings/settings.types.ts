// ── Sidebar Navigation ──

export type SettingsPanelId =
  | 'wifi'
  | 'bluetooth'
  | 'network'
  | 'notifications'
  | 'sound'
  | 'appearance'
  | 'desktop-dock'
  | 'displays'
  | 'wallpaper'
  | 'general'
  | 'accessibility'
  | 'privacy-security'
  | 'battery'
  | 'keyboard'

export interface SettingsNavItem {
  id: SettingsPanelId
  label: string
  icon: string
  keywords: string[]
}

export interface SettingsNavGroup {
  id: string
  items: SettingsNavItem[]
}

// ── Wi-Fi ──

export interface WifiNetwork {
  id: string
  name: string
  signal: 'strong' | 'medium' | 'weak'
  isSecured: boolean
  isConnected: boolean
}

// ── Bluetooth ──

export type BluetoothDeviceType =
  | 'headphones'
  | 'keyboard'
  | 'mouse'
  | 'speaker'
  | 'phone'
  | 'other'

export interface BluetoothDevice {
  id: string
  name: string
  type: BluetoothDeviceType
  isConnected: boolean
  batteryLevel?: number
}

// ── Notifications ──

export interface NotificationAppSetting {
  id: string
  name: string
  icon: string
  enabled: boolean
  showInCenter: boolean
  showOnLockScreen: boolean
  playSound: boolean
}

// ── Sound ──

export type AlertSoundName =
  | 'Boop'
  | 'Breeze'
  | 'Bubble'
  | 'Crystal'
  | 'Funky'
  | 'Heroine'
  | 'Jump'
  | 'Mezzo'
  | 'Pebble'
  | 'Pluck'

export interface SoundSettings {
  outputVolume: number
  inputVolume: number
  alertVolume: number
  selectedAlertSound: AlertSoundName
  playFeedbackSounds: boolean
  playStartupSound: boolean
}

// ── Appearance ──

export type SidebarIconSize = 'small' | 'medium' | 'large'

// ── Desktop & Dock ──

export type DockPosition = 'left' | 'bottom' | 'right'
export type MinimizeEffect = 'genie' | 'scale'

export interface DockSettings {
  size: number
  magnification: boolean
  position: DockPosition
  autoHide: boolean
  showRecentApps: boolean
  minimizeEffect: MinimizeEffect
}

// ── Displays ──

export type NightShiftSchedule = 'off' | 'sunset-to-sunrise' | 'custom'

export interface DisplaySettings {
  brightness: number
  nightShift: boolean
  nightShiftSchedule: NightShiftSchedule
  resolution: string
  refreshRate: string
}

// ── General ──

export interface AboutInfo {
  name: string
  version: string
  processor: string
  memory: string
  serialNumber: string
  storageUsed: number
  storageTotal: number
  lastUpdate: string
  updateAvailable: boolean
}

// ── Accessibility ──

export interface AccessibilitySettings {
  reduceMotion: boolean
  increaseContrast: boolean
  reduceTransparency: boolean
  textSize: number
  boldText: boolean
  differentiateWithoutColor: boolean
}

// ── Privacy & Security ──

export interface AppPermission {
  id: string
  name: string
  icon: string
  hasAccess: boolean
}

export interface PrivacySettings {
  locationServices: boolean
  analytics: boolean
  appPermissions: AppPermission[]
}

// ── Battery ──

export interface BatteryUsageEntry {
  hour: string
  percentage: number
}

export interface BatterySettings {
  currentLevel: number
  isCharging: boolean
  lowPowerMode: boolean
  optimizedCharging: boolean
  showPercentage: boolean
  usageHistory: BatteryUsageEntry[]
}

// ── Keyboard ──

export interface KeyboardSettings {
  keyRepeatRate: number
  delayUntilRepeat: number
  keyboardBrightness: number
  autoCorrect: boolean
  autoCapitalize: boolean
  smartQuotes: boolean
}
