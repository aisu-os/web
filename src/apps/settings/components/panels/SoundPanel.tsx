import type { AlertSoundName } from '../../settings.types'
import { useSettingsStore } from '../../hooks/use-settings-store'
import { ALERT_SOUNDS } from '../../settings.constants'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'
import SettingsToggle from '../shared/SettingsToggle'
import SettingsSlider from '../shared/SettingsSlider'

export default function SoundPanel() {
  const sound = useSettingsStore((s) => s.sound)
  const updateSound = useSettingsStore((s) => s.updateSound)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Sound</h1>

      <SettingsSection title="Output">
        <SettingsRow label="Output Volume">
          <SettingsSlider
            value={sound.outputVolume}
            onChange={(value) => updateSound({ outputVolume: value })}
            leftLabel="🔇"
            rightLabel="🔊"
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Input">
        <SettingsRow label="Input Volume">
          <SettingsSlider
            value={sound.inputVolume}
            onChange={(value) => updateSound({ inputVolume: value })}
            leftLabel="🎤"
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Sound Effects">
        <SettingsRow label="Alert Volume">
          <SettingsSlider
            value={sound.alertVolume}
            onChange={(value) => updateSound({ alertVolume: value })}
          />
        </SettingsRow>

        <div>
          {ALERT_SOUNDS.map((soundName, index) => (
            <button
              key={soundName}
              type="button"
              className={`flex w-full items-center gap-2 px-4 py-2 border-b border-white/[0.06] ${
                index === ALERT_SOUNDS.length - 1 ? 'border-b-0' : ''
              } ${
                sound.selectedAlertSound === soundName
                  ? 'text-white'
                  : 'text-white/50'
              } cursor-pointer`}
              onClick={() => updateSound({ selectedAlertSound: soundName as AlertSoundName })}
            >
              {sound.selectedAlertSound === soundName && (
                <div className="h-2 w-2 rounded-full bg-blue-400" />
              )}
              <span className="text-[13px]">{soundName}</span>
            </button>
          ))}
        </div>

        <SettingsRow label="Play user interface sound effects">
          <SettingsToggle
            checked={sound.playFeedbackSounds}
            onChange={(checked) => updateSound({ playFeedbackSounds: checked })}
          />
        </SettingsRow>

        <SettingsRow label="Play sound on startup">
          <SettingsToggle
            checked={sound.playStartupSound}
            onChange={(checked) => updateSound({ playStartupSound: checked })}
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
