import { useSettingsStore } from '../../hooks/use-settings-store'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'
import SettingsToggle from '../shared/SettingsToggle'
import SettingsSlider from '../shared/SettingsSlider'

export default function AccessibilityPanel() {
  const accessibility = useSettingsStore((s) => s.accessibility)
  const updateAccessibility = useSettingsStore((s) => s.updateAccessibility)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Accessibility</h1>

      <SettingsSection title="Vision">
        <SettingsRow
          label="Reduce motion"
          description="Reduce the motion of user interface elements"
        >
          <SettingsToggle
            checked={accessibility.reduceMotion}
            onChange={(checked) => updateAccessibility({ reduceMotion: checked })}
          />
        </SettingsRow>

        <SettingsRow
          label="Increase contrast"
          description="Increase contrast between foreground and background colors"
        >
          <SettingsToggle
            checked={accessibility.increaseContrast}
            onChange={(checked) => updateAccessibility({ increaseContrast: checked })}
          />
        </SettingsRow>

        <SettingsRow
          label="Reduce transparency"
          description="Reduce transparency and blur effects"
        >
          <SettingsToggle
            checked={accessibility.reduceTransparency}
            onChange={(checked) => updateAccessibility({ reduceTransparency: checked })}
          />
        </SettingsRow>

        <SettingsRow
          label="Bold text"
          description="Use bold text for interface elements"
        >
          <SettingsToggle
            checked={accessibility.boldText}
            onChange={(checked) => updateAccessibility({ boldText: checked })}
          />
        </SettingsRow>

        <SettingsRow
          label="Differentiate without color"
          description="Add shapes or labels to items that use only color to convey information"
        >
          <SettingsToggle
            checked={accessibility.differentiateWithoutColor}
            onChange={(checked) => updateAccessibility({ differentiateWithoutColor: checked })}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Text">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] text-white/80">Text Size</span>
          </div>
          <SettingsSlider
            value={accessibility.textSize}
            onChange={(v) => updateAccessibility({ textSize: v })}
            leftLabel="A"
            rightLabel="A"
          />
        </div>
      </SettingsSection>
    </div>
  )
}
