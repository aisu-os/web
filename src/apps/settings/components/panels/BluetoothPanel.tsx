import type { BluetoothDeviceType } from '../../settings.types'
import { useSettingsStore } from '../../hooks/use-settings-store'
import SettingsSection from '../shared/SettingsSection'
import SettingsRow from '../shared/SettingsRow'
import SettingsToggle from '../shared/SettingsToggle'

const DEVICE_ICONS: Record<BluetoothDeviceType, string> = {
  headphones: '🎧',
  keyboard: '⌨️',
  mouse: '🖱️',
  speaker: '🔊',
  phone: '📱',
  other: '📟',
}

export default function BluetoothPanel() {
  const bluetoothEnabled = useSettingsStore((s) => s.bluetoothEnabled)
  const bluetoothDevices = useSettingsStore((s) => s.bluetoothDevices)
  const toggleBluetooth = useSettingsStore((s) => s.toggleBluetooth)
  const toggleDeviceConnection = useSettingsStore((s) => s.toggleDeviceConnection)

  const connectedDevices = bluetoothDevices.filter((d) => d.isConnected)
  const nearbyDevices = bluetoothDevices.filter((d) => !d.isConnected)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Bluetooth</h1>

      <SettingsSection>
        <SettingsRow label="Bluetooth">
          <SettingsToggle checked={bluetoothEnabled} onChange={toggleBluetooth} />
        </SettingsRow>
      </SettingsSection>

      {!bluetoothEnabled ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-[13px] text-white/30">Bluetooth is turned off</p>
        </div>
      ) : (
        <>
          {connectedDevices.length > 0 && (
            <SettingsSection title="My Devices">
              {connectedDevices.map((device, index) => (
                <div
                  key={device.id}
                  className={`flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06] ${
                    index === connectedDevices.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <span className="text-[14px]">{DEVICE_ICONS[device.type]}</span>
                  <span className="text-[13px] text-white/80 flex-1">{device.name}</span>

                  {device.batteryLevel !== undefined && (
                    <span className="text-[11px] text-white/40">
                      🔋 {device.batteryLevel}%
                    </span>
                  )}

                  <button
                    type="button"
                    className="text-[12px] text-red-400 hover:text-red-300 cursor-pointer"
                    onClick={() => toggleDeviceConnection(device.id)}
                  >
                    Disconnect
                  </button>
                </div>
              ))}
            </SettingsSection>
          )}

          {nearbyDevices.length > 0 && (
            <SettingsSection title="Nearby Devices">
              {nearbyDevices.map((device, index) => (
                <div
                  key={device.id}
                  className={`flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06] ${
                    index === nearbyDevices.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <span className="text-[14px]">{DEVICE_ICONS[device.type]}</span>
                  <span className="text-[13px] text-white/80 flex-1">{device.name}</span>

                  {device.batteryLevel !== undefined && (
                    <span className="text-[11px] text-white/40">
                      🔋 {device.batteryLevel}%
                    </span>
                  )}

                  <button
                    type="button"
                    className="text-[12px] text-blue-400 hover:text-blue-300 cursor-pointer"
                    onClick={() => toggleDeviceConnection(device.id)}
                  >
                    Connect
                  </button>
                </div>
              ))}
            </SettingsSection>
          )}
        </>
      )}
    </div>
  )
}
