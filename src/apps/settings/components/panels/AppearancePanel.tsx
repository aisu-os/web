import { useThemeStore } from '@/stores/use-theme-store'
import { ACCENT_COLORS } from '../../settings.constants'
import { useSettingsStore } from '../../hooks/use-settings-store'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'
import SegmentedControl from '../shared/SegmentedControl'
import ColorPicker from '../shared/ColorPicker'

const MODE_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
]

const SIDEBAR_SIZE_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]

export default function AppearancePanel() {
  const mode = useThemeStore((s) => s.theme.mode)
  const accentColor = useThemeStore((s) => s.theme.accentColor)
  const sidebarIconSize = useSettingsStore((s) => s.sidebarIconSize)
  const setSidebarIconSize = useSettingsStore((s) => s.setSidebarIconSize)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Appearance</h1>

      <SettingsSection title="Appearance">
        <SettingsRow label="Mode" description="Select light, dark, or auto appearance">
          <SegmentedControl
            options={MODE_OPTIONS}
            selected={mode}
            onChange={(value) => useThemeStore.getState().setThemeMode(value as 'light' | 'dark')}
            id="appearance-mode"
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Accent Color">
        <SettingsRow label="Accent color" description="Used for buttons, selections, and highlights">
          <ColorPicker
            colors={ACCENT_COLORS}
            selected={accentColor}
            onChange={(value) => useThemeStore.getState().setAccentColor(value)}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Sidebar">
        <SettingsRow label="Sidebar icon size">
          <SegmentedControl
            options={SIDEBAR_SIZE_OPTIONS}
            selected={sidebarIconSize}
            onChange={(value) => setSidebarIconSize(value as 'small' | 'medium' | 'large')}
            id="sidebar-size"
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
