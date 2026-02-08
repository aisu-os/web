import { cn } from '@/lib/cn'
import { useSettingsStore } from '../../hooks/use-settings-store'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'
import SettingsToggle from '../shared/SettingsToggle'

export default function BatteryPanel() {
  const battery = useSettingsStore((s) => s.battery)
  const updateBattery = useSettingsStore((s) => s.updateBattery)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Battery</h1>

      {/* Battery status display */}
      <div className="flex items-center gap-4 mb-6 px-1">
        <div className="relative">
          <div className="w-16 h-8 rounded-lg border-2 border-white/40 relative flex items-center px-1">
            <div
              className={cn(
                'h-5 rounded-sm',
                battery.currentLevel > 20 ? 'bg-green-400' : 'bg-red-400'
              )}
              style={{ width: `${battery.currentLevel}%` }}
            />
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-white/40 rounded-r-sm" />
          </div>
        </div>
        <div>
          <p className="text-[18px] font-semibold text-white/90">{battery.currentLevel}%</p>
          <p className="text-[12px] text-white/40">
            {battery.isCharging ? 'Charging' : 'On Battery'}
          </p>
        </div>
      </div>

      <SettingsSection title="Usage">
        <div className="px-4 py-3 space-y-2">
          {battery.usageHistory.map((entry) => (
            <div key={entry.hour} className="flex items-center gap-3">
              <span className="text-[11px] text-white/40 w-12 shrink-0 text-right">
                {entry.hour}
              </span>
              <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400/60 rounded-full"
                  style={{ width: `${entry.percentage}%` }}
                />
              </div>
              <span className="text-[11px] text-white/40 w-8">{entry.percentage}%</span>
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Settings">
        <SettingsRow
          label="Low Power Mode"
          description="Temporarily reduces background activity to save energy"
        >
          <SettingsToggle
            checked={battery.lowPowerMode}
            onChange={() => updateBattery({ lowPowerMode: !battery.lowPowerMode })}
          />
        </SettingsRow>

        <SettingsRow
          label="Optimized Battery Charging"
          description="Learns your charging habits to reduce battery aging"
        >
          <SettingsToggle
            checked={battery.optimizedCharging}
            onChange={() => updateBattery({ optimizedCharging: !battery.optimizedCharging })}
          />
        </SettingsRow>

        <SettingsRow label="Show battery percentage in menu bar">
          <SettingsToggle
            checked={battery.showPercentage}
            onChange={() => updateBattery({ showPercentage: !battery.showPercentage })}
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
