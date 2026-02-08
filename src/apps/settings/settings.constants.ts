import type {
  SettingsNavGroup,
  WifiNetwork,
  BluetoothDevice,
  NotificationAppSetting,
  AlertSoundName,
  AppPermission,
  BatteryUsageEntry,
  AboutInfo,
} from './settings.types'

// ── Sidebar Navigation ──

export const SETTINGS_NAV_GROUPS: SettingsNavGroup[] = [
  {
    id: 'connectivity',
    items: [
      {
        id: 'wifi',
        label: 'Wi-Fi',
        icon: '📶',
        keywords: ['wifi', 'wireless', 'internet', 'network'],
      },
      {
        id: 'bluetooth',
        label: 'Bluetooth',
        icon: '🔵',
        keywords: ['bluetooth', 'wireless', 'device', 'connect'],
      },
      {
        id: 'network',
        label: 'Network',
        icon: '🌐',
        keywords: ['network', 'ethernet', 'vpn', 'dns', 'ip'],
      },
    ],
  },
  {
    id: 'alerts',
    items: [
      {
        id: 'notifications',
        label: 'Notifications',
        icon: '🔔',
        keywords: ['notifications', 'alerts', 'banners', 'sounds'],
      },
      {
        id: 'sound',
        label: 'Sound',
        icon: '🔊',
        keywords: ['sound', 'volume', 'audio', 'speaker', 'microphone'],
      },
    ],
  },
  {
    id: 'personalization',
    items: [
      {
        id: 'general',
        label: 'General',
        icon: '⚙️',
        keywords: ['general', 'about', 'update', 'storage', 'info'],
      },
      {
        id: 'appearance',
        label: 'Appearance',
        icon: '🎨',
        keywords: ['appearance', 'dark', 'light', 'theme', 'accent', 'color'],
      },
      {
        id: 'desktop-dock',
        label: 'Desktop & Dock',
        icon: '🖥️',
        keywords: ['desktop', 'dock', 'size', 'position', 'magnification'],
      },
      {
        id: 'displays',
        label: 'Displays',
        icon: '🖥',
        keywords: ['display', 'brightness', 'resolution', 'night shift'],
      },
      {
        id: 'wallpaper',
        label: 'Wallpaper',
        icon: '🏞️',
        keywords: ['wallpaper', 'background', 'desktop', 'image'],
      },
    ],
  },
  {
    id: 'accessibility-group',
    items: [
      {
        id: 'accessibility',
        label: 'Accessibility',
        icon: '♿',
        keywords: ['accessibility', 'motion', 'contrast', 'text size', 'bold'],
      },
    ],
  },
  {
    id: 'security',
    items: [
      {
        id: 'privacy-security',
        label: 'Privacy & Security',
        icon: '🔒',
        keywords: ['privacy', 'security', 'location', 'analytics', 'permissions'],
      },
      {
        id: 'battery',
        label: 'Battery',
        icon: '🔋',
        keywords: ['battery', 'power', 'energy', 'charging'],
      },
    ],
  },
  {
    id: 'input',
    items: [
      {
        id: 'keyboard',
        label: 'Keyboard',
        icon: '⌨️',
        keywords: ['keyboard', 'typing', 'repeat', 'brightness', 'shortcuts'],
      },
    ],
  },
]

// ── Accent Colors ──

export const ACCENT_COLORS = [
  { name: 'Blue', value: '#0EA5E9' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Graphite', value: '#6B7280' },
] as const

// ── Alert Sounds ──

export const ALERT_SOUNDS: AlertSoundName[] = [
  'Boop',
  'Breeze',
  'Bubble',
  'Crystal',
  'Funky',
  'Heroine',
  'Jump',
  'Mezzo',
  'Pebble',
  'Pluck',
]

// ── Mock Data ──

export const MOCK_WIFI_NETWORKS: WifiNetwork[] = [
  { id: 'wifi-1', name: 'Aisu-Home-5G', signal: 'strong', isSecured: true, isConnected: true },
  { id: 'wifi-2', name: 'Aisu-Guest', signal: 'strong', isSecured: true, isConnected: false },
  { id: 'wifi-3', name: 'Neighbors-WiFi', signal: 'medium', isSecured: true, isConnected: false },
  { id: 'wifi-4', name: 'CoffeeShop_Free', signal: 'weak', isSecured: false, isConnected: false },
  { id: 'wifi-5', name: 'Office-Network', signal: 'medium', isSecured: true, isConnected: false },
]

export const MOCK_BLUETOOTH_DEVICES: BluetoothDevice[] = [
  { id: 'bt-1', name: 'AirPods Pro', type: 'headphones', isConnected: true, batteryLevel: 85 },
  { id: 'bt-2', name: 'Magic Keyboard', type: 'keyboard', isConnected: true, batteryLevel: 62 },
  { id: 'bt-3', name: 'Magic Mouse', type: 'mouse', isConnected: false, batteryLevel: 45 },
  { id: 'bt-4', name: 'HomePod mini', type: 'speaker', isConnected: false },
  { id: 'bt-5', name: 'iPhone 16 Pro', type: 'phone', isConnected: false, batteryLevel: 78 },
]

export const MOCK_NOTIFICATION_APPS: NotificationAppSetting[] = [
  { id: 'ai-chat', name: 'AI Chat', icon: '🤖', enabled: true, showInCenter: true, showOnLockScreen: true, playSound: true },
  { id: 'file-manager', name: 'File Manager', icon: '📁', enabled: true, showInCenter: true, showOnLockScreen: false, playSound: false },
  { id: 'app-market', name: 'App Market', icon: '🏪', enabled: true, showInCenter: true, showOnLockScreen: false, playSound: true },
  { id: 'terminal', name: 'Terminal', icon: '💻', enabled: false, showInCenter: false, showOnLockScreen: false, playSound: false },
  { id: 'text-editor', name: 'Text Editor', icon: '📝', enabled: true, showInCenter: true, showOnLockScreen: false, playSound: false },
]

export const MOCK_APP_PERMISSIONS: AppPermission[] = [
  { id: 'ai-chat', name: 'AI Chat', icon: '🤖', hasAccess: true },
  { id: 'file-manager', name: 'File Manager', icon: '📁', hasAccess: true },
  { id: 'terminal', name: 'Terminal', icon: '💻', hasAccess: true },
  { id: 'app-market', name: 'App Market', icon: '🏪', hasAccess: false },
  { id: 'image-viewer', name: 'Image Viewer', icon: '🖼️', hasAccess: false },
]

export const MOCK_BATTERY_HISTORY: BatteryUsageEntry[] = [
  { hour: '9 AM', percentage: 100 },
  { hour: '10 AM', percentage: 95 },
  { hour: '11 AM', percentage: 87 },
  { hour: '12 PM', percentage: 78 },
  { hour: '1 PM', percentage: 72 },
  { hour: '2 PM', percentage: 65 },
  { hour: '3 PM', percentage: 58 },
  { hour: '4 PM', percentage: 50 },
  { hour: '5 PM', percentage: 42 },
]

export const MOCK_ABOUT_INFO: AboutInfo = {
  name: 'Aisu OS',
  version: '1.0.0 (Sakura)',
  processor: 'Aisu M3 Pro',
  memory: '16 GB Unified Memory',
  serialNumber: 'AISU-2025-XXXX',
  storageUsed: 124.7,
  storageTotal: 512,
  lastUpdate: '2025-12-15',
  updateAvailable: false,
}

export const MOCK_NETWORK_INFO = {
  status: 'Connected',
  ipAddress: '192.168.1.42',
  subnetMask: '255.255.255.0',
  router: '192.168.1.1',
  dns: '8.8.8.8, 8.8.4.4',
  macAddress: 'AA:BB:CC:DD:EE:FF',
} as const
