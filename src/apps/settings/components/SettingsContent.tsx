import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSettingsStore } from '../hooks/use-settings-store'
import type { SettingsPanelId } from '../settings.types'

const WifiPanel = lazy(() => import('./panels/WifiPanel'))
const BluetoothPanel = lazy(() => import('./panels/BluetoothPanel'))
const NetworkPanel = lazy(() => import('./panels/NetworkPanel'))
const NotificationsPanel = lazy(() => import('./panels/NotificationsPanel'))
const SoundPanel = lazy(() => import('./panels/SoundPanel'))
const AppearancePanel = lazy(() => import('./panels/AppearancePanel'))
const DesktopDockPanel = lazy(() => import('./panels/DesktopDockPanel'))
const DisplaysPanel = lazy(() => import('./panels/DisplaysPanel'))
const WallpaperPanel = lazy(() => import('./panels/WallpaperPanel'))
const GeneralPanel = lazy(() => import('./panels/GeneralPanel'))
const AccessibilityPanel = lazy(() => import('./panels/AccessibilityPanel'))
const PrivacySecurityPanel = lazy(() => import('./panels/PrivacySecurityPanel'))
const BatteryPanel = lazy(() => import('./panels/BatteryPanel'))
const KeyboardPanel = lazy(() => import('./panels/KeyboardPanel'))

const panelComponents: Record<SettingsPanelId, React.LazyExoticComponent<React.ComponentType>> = {
  'wifi': WifiPanel,
  'bluetooth': BluetoothPanel,
  'network': NetworkPanel,
  'notifications': NotificationsPanel,
  'sound': SoundPanel,
  'appearance': AppearancePanel,
  'desktop-dock': DesktopDockPanel,
  'displays': DisplaysPanel,
  'wallpaper': WallpaperPanel,
  'general': GeneralPanel,
  'accessibility': AccessibilityPanel,
  'privacy-security': PrivacySecurityPanel,
  'battery': BatteryPanel,
  'keyboard': KeyboardPanel,
}

const SettingsContent = () => {
  const activePanel = useSettingsStore((s) => s.activePanel)
  const PanelComponent = panelComponents[activePanel]

  return (
    <div className="flex-1 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activePanel}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
          className="h-full overflow-y-auto px-6 py-5"
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-32">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              </div>
            }
          >
            <PanelComponent />
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default SettingsContent
