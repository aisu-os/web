import type { DockPosition, MinimizeEffect } from '../../settings.types'
import { useSettingsStore } from '../../hooks/use-settings-store'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'
import SettingsToggle from '../shared/SettingsToggle'
import SettingsSlider from '../shared/SettingsSlider'
import SegmentedControl from '../shared/SegmentedControl'

const POSITION_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'right', label: 'Right' },
]

const MINIMIZE_OPTIONS = [
  { value: 'genie', label: 'Genie Effect' },
  { value: 'scale', label: 'Scale Effect' },
]

export default function DesktopDockPanel() {
  const dock = useSettingsStore((s) => s.dock)
  const updateDock = useSettingsStore((s) => s.updateDock)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Desktop & Dock</h1>

      <SettingsSection title="Dock">
        <SettingsRow label="Size">
          <SettingsSlider
            value={dock.size}
            onChange={(value) => updateDock({ size: value })}
            leftLabel="Small"
            rightLabel="Large"
          />
        </SettingsRow>

        <SettingsRow label="Magnification">
          <SettingsToggle
            checked={dock.magnification}
            onChange={(checked) => updateDock({ magnification: checked })}
          />
        </SettingsRow>

        <SettingsRow label="Position on screen">
          <SegmentedControl
            options={POSITION_OPTIONS}
            selected={dock.position}
            onChange={(value) => updateDock({ position: value as DockPosition })}
            id="dock-position"
          />
        </SettingsRow>

        <SettingsRow label="Automatically hide and show the Dock">
          <SettingsToggle
            checked={dock.autoHide}
            onChange={(checked) => updateDock({ autoHide: checked })}
          />
        </SettingsRow>

        <SettingsRow label="Show recent applications in Dock">
          <SettingsToggle
            checked={dock.showRecentApps}
            onChange={(checked) => updateDock({ showRecentApps: checked })}
          />
        </SettingsRow>

        <SettingsRow label="Minimize windows using">
          <SegmentedControl
            options={MINIMIZE_OPTIONS}
            selected={dock.minimizeEffect}
            onChange={(value) => updateDock({ minimizeEffect: value as MinimizeEffect })}
            id="minimize-effect"
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
