import { useState, useEffect } from 'react'
import BatteryIndicator from './BatteryIndicator'
import WifiIndicator from './WifiIndicator'

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
      <WifiIndicator />

      <BatteryIndicator />

      <button className="flex items-center gap-1.5 rounded px-2 py-0.5 hover:bg-white/10 cursor-default outline-none">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </button>
    </div>
  )
}

export default SystemTray
