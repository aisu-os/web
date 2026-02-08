import { MOCK_NETWORK_INFO } from '../../settings.constants'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'

export default function NetworkPanel() {
  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Network</h1>

      <SettingsSection title="Status">
        <SettingsRow label="Status">
          <div className="flex items-center gap-1.5 text-[13px] text-green-400">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            Connected
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Details">
        <SettingsRow label="IP Address">
          <span className="text-[13px] text-white/60">{MOCK_NETWORK_INFO.ipAddress}</span>
        </SettingsRow>
        <SettingsRow label="Subnet Mask">
          <span className="text-[13px] text-white/60">{MOCK_NETWORK_INFO.subnetMask}</span>
        </SettingsRow>
        <SettingsRow label="Router">
          <span className="text-[13px] text-white/60">{MOCK_NETWORK_INFO.router}</span>
        </SettingsRow>
        <SettingsRow label="DNS">
          <span className="text-[13px] text-white/60">{MOCK_NETWORK_INFO.dns}</span>
        </SettingsRow>
        <SettingsRow label="MAC Address">
          <span className="text-[13px] text-white/60">{MOCK_NETWORK_INFO.macAddress}</span>
        </SettingsRow>
      </SettingsSection>
    </div>
  )
}
