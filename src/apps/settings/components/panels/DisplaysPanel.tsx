import type { NightShiftSchedule } from '../../settings.types'
import { useSettingsStore } from '../../hooks/use-settings-store'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'
import SettingsToggle from '../shared/SettingsToggle'
import SettingsSlider from '../shared/SettingsSlider'
import SegmentedControl from '../shared/SegmentedControl'

const NIGHT_SHIFT_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'sunset-to-sunrise', label: 'Sunset to Sunrise' },
  { value: 'custom', label: 'Custom' },
]

export default function DisplaysPanel() {
  const display = useSettingsStore((s) => s.display)
  const updateDisplay = useSettingsStore((s) => s.updateDisplay)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Displays</h1>

      <SettingsSection title="Display">
        <SettingsRow label="Resolution">
          <span className="text-[13px] text-white/60">{display.resolution}</span>
        </SettingsRow>

        <SettingsRow label="Brightness">
          <SettingsSlider
            value={display.brightness}
            onChange={(value) => updateDisplay({ brightness: value })}
            leftLabel="☀️"
            rightLabel="☀️"
          />
        </SettingsRow>

        <SettingsRow label="Refresh Rate">
          <span className="text-[13px] text-white/60">{display.refreshRate}</span>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Night Shift">
        <SettingsRow label="Night Shift" description="Reduce blue light to ease eye strain">
          <SettingsToggle
            checked={display.nightShift}
            onChange={(checked) => updateDisplay({ nightShift: checked })}
          />
        </SettingsRow>

        <SettingsRow label="Schedule">
          <SegmentedControl
            options={NIGHT_SHIFT_OPTIONS}
            selected={display.nightShiftSchedule}
            onChange={(value) => updateDisplay({ nightShiftSchedule: value as NightShiftSchedule })}
            id="night-shift"
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
