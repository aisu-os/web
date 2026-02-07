import { useState, useEffect } from 'react'
import BatteryIndicator from './BatteryIndicator'

const SystemTray = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 10_000)
    return () => clearInterval(interval)
  }, [])

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="flex h-full items-center gap-1 pr-3 text-[12px] font-medium text-white/90">
      <TrayIcon label="Wi-Fi">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
        </svg>
      </TrayIcon>

      <BatteryIndicator />

      <button className="flex items-center gap-1.5 rounded px-2 py-0.5 hover:bg-white/10 cursor-default outline-none">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </button>
    </div>
  )
}

const TrayIcon = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <button
    className="flex h-full items-center rounded px-1 hover:bg-white/10 cursor-default outline-none"
    aria-label={label}
  >
    {children}
  </button>
)

export default SystemTray
