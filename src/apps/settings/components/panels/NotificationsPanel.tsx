import { useSettingsStore } from '../../hooks/use-settings-store'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'
import SettingsToggle from '../shared/SettingsToggle'

export default function NotificationsPanel() {
  const doNotDisturb = useSettingsStore((s) => s.doNotDisturb)
  const notificationApps = useSettingsStore((s) => s.notificationApps)
  const toggleDoNotDisturb = useSettingsStore((s) => s.toggleDoNotDisturb)
  const toggleAppNotification = useSettingsStore((s) => s.toggleAppNotification)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Notifications</h1>

      <SettingsSection>
        <SettingsRow label="Do Not Disturb" description="Silence all notifications">
          <SettingsToggle checked={doNotDisturb} onChange={toggleDoNotDisturb} />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="App Notifications">
        {notificationApps.map((app) => (
          <SettingsRow key={app.id} label={`${app.icon} ${app.name}`}>
            <SettingsToggle
              checked={app.enabled}
              onChange={() => toggleAppNotification(app.id)}
            />
          </SettingsRow>
        ))}
      </SettingsSection>
    </div>
  )
}
