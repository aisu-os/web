import { useSettingsStore } from '../../hooks/use-settings-store'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'

export default function GeneralPanel() {
  const about = useSettingsStore((s) => s.about)
  const checkForUpdates = useSettingsStore((s) => s.checkForUpdates)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">General</h1>

      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-2xl mb-3">
          ❄️
        </div>
        <h2 className="text-[16px] font-semibold text-white/90">{about.name}</h2>
        <p className="text-[12px] text-white/50">{about.version}</p>
      </div>

      <SettingsSection title="About">
        <SettingsRow label="Processor">
          <span className="text-[13px] text-white/60">{about.processor}</span>
        </SettingsRow>

        <SettingsRow label="Memory">
          <span className="text-[13px] text-white/60">{about.memory}</span>
        </SettingsRow>

        <SettingsRow label="Serial Number">
          <span className="text-[13px] text-white/60">{about.serialNumber}</span>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Storage">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-white/80">Storage</span>
            <span className="text-[11px] text-white/40">
              {about.storageUsed} GB of {about.storageTotal} GB used
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{ width: `${(about.storageUsed / about.storageTotal) * 100}%` }}
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Software Update">
        <SettingsRow
          label="Aisu OS"
          description={
            about.updateAvailable
              ? 'Update available'
              : 'Your system is up to date'
          }
        >
          <button
            onClick={checkForUpdates}
            className="px-3 py-1.5 text-[12px] rounded-md bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white/90 transition-colors"
          >
            Check for Updates
          </button>
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
