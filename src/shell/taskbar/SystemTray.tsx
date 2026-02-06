import { useState, useEffect } from 'react'

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

      <TrayIcon label="Battery">
        <svg width="16" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
          <line x1="23" y1="10" x2="23" y2="14" />
          <rect x="3" y="8" width="12" height="8" rx="1" fill="currentColor" opacity="0.4" />
        </svg>
      </TrayIcon>

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
