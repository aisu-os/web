import { useSettingsStore } from '../../hooks/use-settings-store'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'
import SettingsToggle from '../shared/SettingsToggle'

const SignalIcon = ({ strength }: { strength: 'strong' | 'medium' | 'weak' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
    <rect x="1" y="11" width="3" height="4" rx="0.5" fill="white" fillOpacity={strength === 'weak' ? 0.8 : 0.8} />
    <rect x="6" y="7" width="3" height="8" rx="0.5" fill="white" fillOpacity={strength === 'weak' ? 0.2 : 0.8} />
    <rect x="11" y="3" width="3" height="12" rx="0.5" fill="white" fillOpacity={strength === 'strong' ? 0.8 : 0.2} />
  </svg>
)

export default function WifiPanel() {
  const wifiEnabled = useSettingsStore((s) => s.wifiEnabled)
  const wifiNetworks = useSettingsStore((s) => s.wifiNetworks)
  const toggleWifi = useSettingsStore((s) => s.toggleWifi)
  const connectToNetwork = useSettingsStore((s) => s.connectToNetwork)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Wi-Fi</h1>

      <SettingsSection>
        <SettingsRow label="Wi-Fi">
          <SettingsToggle checked={wifiEnabled} onChange={toggleWifi} />
        </SettingsRow>
      </SettingsSection>

      {!wifiEnabled ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-[13px] text-white/30">Wi-Fi is turned off</p>
        </div>
      ) : (
        <SettingsSection title="Known Networks">
          {wifiNetworks.map((network, index) => (
            <div
              key={network.id}
              className={`flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] ${
                index === wifiNetworks.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <SignalIcon strength={network.signal} />
                <span className="text-[13px] text-white/80">{network.name}</span>
                {network.isSecured && (
                  <span className="text-[11px]">🔒</span>
                )}
              </div>

              <div>
                {network.isConnected ? (
                  <span className="text-[11px] text-green-400">Connected</span>
                ) : (
                  <button
                    type="button"
                    className="text-[12px] text-blue-400 hover:text-blue-300 cursor-pointer"
                    onClick={() => connectToNetwork(network.id)}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </SettingsSection>
      )}
    </div>
  )
}
