import { useSettingsStore } from '../../hooks/use-settings-store'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'
import SettingsToggle from '../shared/SettingsToggle'
import SettingsSlider from '../shared/SettingsSlider'

export default function KeyboardPanel() {
  const keyboard = useSettingsStore((s) => s.keyboard)
  const updateKeyboard = useSettingsStore((s) => s.updateKeyboard)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Keyboard</h1>

      <SettingsSection title="Key Repeat">
        <div className="px-4 py-3 space-y-4">
          <div>
            <p className="text-[13px] text-white/80 mb-2">Key Repeat Rate</p>
            <SettingsSlider
              value={keyboard.keyRepeatRate}
              onChange={(v) => updateKeyboard({ keyRepeatRate: v })}
              leftLabel="Slow"
              rightLabel="Fast"
            />
          </div>
          <div>
            <p className="text-[13px] text-white/80 mb-2">Delay Until Repeat</p>
            <SettingsSlider
              value={keyboard.delayUntilRepeat}
              onChange={(v) => updateKeyboard({ delayUntilRepeat: v })}
              leftLabel="Long"
              rightLabel="Short"
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Keyboard Brightness">
        <div className="px-4 py-3">
          <SettingsSlider
            value={keyboard.keyboardBrightness}
            onChange={(v) => updateKeyboard({ keyboardBrightness: v })}
            leftLabel="🔅"
            rightLabel="🔆"
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Text Input">
        <SettingsRow
          label="Auto-Correct"
          description="Automatically correct spelling mistakes"
        >
          <SettingsToggle
            checked={keyboard.autoCorrect}
            onChange={() => updateKeyboard({ autoCorrect: !keyboard.autoCorrect })}
          />
        </SettingsRow>

        <SettingsRow
          label="Auto-Capitalization"
          description="Capitalize the first letter of sentences"
        >
          <SettingsToggle
            checked={keyboard.autoCapitalize}
            onChange={() => updateKeyboard({ autoCapitalize: !keyboard.autoCapitalize })}
          />
        </SettingsRow>

        <SettingsRow
          label="Smart Quotes"
          description="Use typographic quotation marks"
        >
          <SettingsToggle
            checked={keyboard.smartQuotes}
            onChange={() => updateKeyboard({ smartQuotes: !keyboard.smartQuotes })}
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
