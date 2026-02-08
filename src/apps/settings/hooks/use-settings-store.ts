import { createContext, useContext } from 'react'
import { create, useStore } from 'zustand'
import type { StoreApi } from 'zustand'
import type {
  SettingsPanelId,
  SidebarIconSize,
  WifiNetwork,
  BluetoothDevice,
  NotificationAppSetting,
  SoundSettings,
  DockSettings,
  DisplaySettings,
  AboutInfo,
  AccessibilitySettings,
  PrivacySettings,
  BatterySettings,
  KeyboardSettings,
} from '../settings.types'
import {
  MOCK_WIFI_NETWORKS,
  MOCK_BLUETOOTH_DEVICES,
  MOCK_NOTIFICATION_APPS,
  MOCK_APP_PERMISSIONS,
  MOCK_BATTERY_HISTORY,
  MOCK_ABOUT_INFO,
} from '../settings.constants'

interface SettingsState {
  activePanel: SettingsPanelId
  searchQuery: string

  wifiEnabled: boolean
  wifiNetworks: WifiNetwork[]

  bluetoothEnabled: boolean
  bluetoothDevices: BluetoothDevice[]

  doNotDisturb: boolean
  notificationApps: NotificationAppSetting[]

  sound: SoundSettings
  sidebarIconSize: SidebarIconSize
  dock: DockSettings
  display: DisplaySettings
  about: AboutInfo
  accessibility: AccessibilitySettings
  privacy: PrivacySettings
  battery: BatterySettings
  keyboard: KeyboardSettings
}

interface SettingsActions {
  setActivePanel: (panel: SettingsPanelId) => void
  setSearchQuery: (query: string) => void

  toggleWifi: () => void
  connectToNetwork: (networkId: string) => void

  toggleBluetooth: () => void
  toggleDeviceConnection: (deviceId: string) => void

  toggleDoNotDisturb: () => void
  toggleAppNotification: (appId: string) => void
  updateNotificationApp: (appId: string, updates: Partial<NotificationAppSetting>) => void

  updateSound: (updates: Partial<SoundSettings>) => void
  setSidebarIconSize: (size: SidebarIconSize) => void
  updateDock: (updates: Partial<DockSettings>) => void
  updateDisplay: (updates: Partial<DisplaySettings>) => void
  updateAccessibility: (updates: Partial<AccessibilitySettings>) => void

  toggleLocationServices: () => void
  toggleAnalytics: () => void
  toggleAppPermission: (appId: string) => void

  updateBattery: (updates: Partial<BatterySettings>) => void
  updateKeyboard: (updates: Partial<KeyboardSettings>) => void

  checkForUpdates: () => void
}

export type SettingsStore = SettingsState & SettingsActions
export type SettingsStoreApi = StoreApi<SettingsStore>

export function createSettingsStore(): SettingsStoreApi {
  return create<SettingsStore>((set) => ({
    activePanel: 'wifi',
    searchQuery: '',

    wifiEnabled: true,
    wifiNetworks: MOCK_WIFI_NETWORKS,

    bluetoothEnabled: true,
    bluetoothDevices: MOCK_BLUETOOTH_DEVICES,

    doNotDisturb: false,
    notificationApps: MOCK_NOTIFICATION_APPS,

    sound: {
      outputVolume: 75,
      inputVolume: 50,
      alertVolume: 60,
      selectedAlertSound: 'Breeze',
      playFeedbackSounds: true,
      playStartupSound: true,
    },

    sidebarIconSize: 'medium',

    dock: {
      size: 50,
      magnification: true,
      position: 'bottom',
      autoHide: false,
      showRecentApps: true,
      minimizeEffect: 'genie',
    },

    display: {
      brightness: 75,
      nightShift: false,
      nightShiftSchedule: 'off',
      resolution: '2560 x 1600 Retina',
      refreshRate: '120 Hz ProMotion',
    },

    about: MOCK_ABOUT_INFO,

    accessibility: {
      reduceMotion: false,
      increaseContrast: false,
      reduceTransparency: false,
      textSize: 50,
      boldText: false,
      differentiateWithoutColor: false,
    },

    privacy: {
      locationServices: true,
      analytics: false,
      appPermissions: MOCK_APP_PERMISSIONS,
    },

    battery: {
      currentLevel: 85,
      isCharging: true,
      lowPowerMode: false,
      optimizedCharging: true,
      showPercentage: true,
      usageHistory: MOCK_BATTERY_HISTORY,
    },

    keyboard: {
      keyRepeatRate: 65,
      delayUntilRepeat: 40,
      keyboardBrightness: 70,
      autoCorrect: true,
      autoCapitalize: true,
      smartQuotes: true,
    },

    // ── Actions ──

    setActivePanel: (panel) => set({ activePanel: panel }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    toggleWifi: () =>
      set((s) => ({ wifiEnabled: !s.wifiEnabled })),

    connectToNetwork: (networkId) =>
      set((s) => ({
        wifiNetworks: s.wifiNetworks.map((n) => ({
          ...n,
          isConnected: n.id === networkId,
        })),
      })),

    toggleBluetooth: () =>
      set((s) => ({ bluetoothEnabled: !s.bluetoothEnabled })),

    toggleDeviceConnection: (deviceId) =>
      set((s) => ({
        bluetoothDevices: s.bluetoothDevices.map((d) =>
          d.id === deviceId ? { ...d, isConnected: !d.isConnected } : d
        ),
      })),

    toggleDoNotDisturb: () =>
      set((s) => ({ doNotDisturb: !s.doNotDisturb })),

    toggleAppNotification: (appId) =>
      set((s) => ({
        notificationApps: s.notificationApps.map((app) =>
          app.id === appId ? { ...app, enabled: !app.enabled } : app
        ),
      })),

    updateNotificationApp: (appId, updates) =>
      set((s) => ({
        notificationApps: s.notificationApps.map((app) =>
          app.id === appId ? { ...app, ...updates } : app
        ),
      })),

    updateSound: (updates) =>
      set((s) => ({ sound: { ...s.sound, ...updates } })),

    setSidebarIconSize: (size) => set({ sidebarIconSize: size }),

    updateDock: (updates) =>
      set((s) => ({ dock: { ...s.dock, ...updates } })),

    updateDisplay: (updates) =>
      set((s) => ({ display: { ...s.display, ...updates } })),

    updateAccessibility: (updates) =>
      set((s) => ({ accessibility: { ...s.accessibility, ...updates } })),

    toggleLocationServices: () =>
      set((s) => ({
        privacy: { ...s.privacy, locationServices: !s.privacy.locationServices },
      })),

    toggleAnalytics: () =>
      set((s) => ({
        privacy: { ...s.privacy, analytics: !s.privacy.analytics },
      })),

    toggleAppPermission: (appId) =>
      set((s) => ({
        privacy: {
          ...s.privacy,
          appPermissions: s.privacy.appPermissions.map((app) =>
            app.id === appId ? { ...app, hasAccess: !app.hasAccess } : app
          ),
        },
      })),

    updateBattery: (updates) =>
      set((s) => ({ battery: { ...s.battery, ...updates } })),

    updateKeyboard: (updates) =>
      set((s) => ({ keyboard: { ...s.keyboard, ...updates } })),

    checkForUpdates: () =>
      set((s) => ({
        about: { ...s.about, updateAvailable: !s.about.updateAvailable },
      })),
  }))
}

export const SettingsStoreContext = createContext<SettingsStoreApi | null>(null)

export function useSettingsStore<T>(
  selector: (state: SettingsStore) => T
): T {
  const store = useContext(SettingsStoreContext)
  if (!store) throw new Error('useSettingsStore must be used within SettingsStoreContext')
  return useStore(store, selector)
}
