import { useSettingsStore } from '../../hooks/use-settings-store'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'
import SettingsToggle from '../shared/SettingsToggle'

export default function PrivacySecurityPanel() {
  const privacy = useSettingsStore((s) => s.privacy)
  const toggleLocationServices = useSettingsStore((s) => s.toggleLocationServices)
  const toggleAnalytics = useSettingsStore((s) => s.toggleAnalytics)
  const toggleAppPermission = useSettingsStore((s) => s.toggleAppPermission)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Privacy & Security</h1>

      <SettingsSection title="Privacy">
        <SettingsRow
          label="Location Services"
          description="Allow apps to request your location"
        >
          <SettingsToggle
            checked={privacy.locationServices}
            onChange={() => toggleLocationServices()}
          />
        </SettingsRow>

        <SettingsRow
          label="Analytics & Improvements"
          description="Help improve Aisu by sharing anonymous usage data"
        >
          <SettingsToggle
            checked={privacy.analytics}
            onChange={() => toggleAnalytics()}
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="App Permissions">
        {privacy.appPermissions.map((app) => (
          <SettingsRow key={app.id} label={`${app.icon} ${app.name}`}>
            <SettingsToggle
              checked={app.hasAccess}
              onChange={() => toggleAppPermission(app.id)}
            />
          </SettingsRow>
        ))}
      </SettingsSection>
    </div>
  )
}
