import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useBattery } from '@/hooks/use-battery'

const BatteryIndicator = () => {
  const { level, charging, chargingTime, dischargingTime, isSupported } = useBattery()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, right: 0 })

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    requestAnimationFrame(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    })

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleClick = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      })
    }
    setIsOpen((prev) => !prev)
  }

  const getFillColor = () => {
    if (charging) return '#34D399'
    if (level <= 10) return '#F87171'
    if (level <= 20) return '#FBBF24'
    return 'currentColor'
  }

  const fillWidth = isSupported ? (level / 100) * 14 : 14
  const fillColor = getFillColor()
  const fillOpacity = isSupported ? 0.7 : 0.4

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds <= 0) return ''
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    if (h > 0) return `${h}:${String(m).padStart(2, '0')} remaining`
    return `${m} min remaining`
  }

  const getStatusText = () => {
    if (!isSupported) return 'Battery Status Unavailable'
    if (charging && level >= 100) return 'Fully Charged'
    if (charging) return 'Charging'
    return 'Battery'
  }

  const getTimeText = () => {
    if (!isSupported) return null
    if (charging && level < 100) return formatTime(chargingTime)
    if (!charging) return formatTime(dischargingTime)
    return null
  }

  const getSourceText = () => {
    if (!isSupported) return null
    return charging ? 'Power Adapter' : 'Battery'
  }

  const timeText = getTimeText()

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center rounded px-1 hover:bg-white/10 cursor-default"
      onClick={handleClick}
    >
      <div className="flex items-center gap-0.5">
        <svg
          width="18"
          height="11"
          viewBox="0 0 22 11"
          fill="none"
          className="text-white/90"
        >
          <rect
            x="0.5"
            y="0.5"
            width="17"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <rect
            x="18.5"
            y="3"
            width="2"
            height="5"
            rx="0.8"
            fill="currentColor"
            opacity="0.4"
          />
          <rect
            x="2"
            y="2"
            width={Math.max(fillWidth, 0)}
            height="7"
            rx="1"
            fill={fillColor}
            opacity={fillOpacity}
          />
          {charging && (
            <path
              d="M10 0.5 L7.5 5 L9.5 5 L8 10.5 L11.5 5 L9.5 5 L11 0.5Z"
              fill="#FBBF24"
              stroke="#000"
              strokeWidth="0.3"
              opacity="0.9"
            />
          )}
        </svg>
        {isSupported && (
          <span className="text-[10.5px] font-medium text-white/80 tabular-nums min-w-[26px] text-right">
            {level}%
          </span>
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              onMouseDown={(e) => e.stopPropagation()}
              style={{ top: position.top, right: position.right }}
              className={cn(
                'fixed z-[9999]',
                'w-[264px]',
                'rounded-xl',
                'bg-black/30 backdrop-blur-2xl backdrop-saturate-150',
                'shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
                'ring-1 ring-inset ring-white/10',
                'select-none',
                'p-3',
              )}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
            >
              {/* Sarlavha */}
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[13px] font-semibold text-white/90">
                  {getStatusText()}
                </span>
                {isSupported && (
                  <span className="text-[13px] font-semibold text-white/90">
                    {level}%
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {isSupported && (
                <div className="mb-2.5">
                  <div className="h-[10px] w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: charging ? '#34D399' : level <= 10 ? '#F87171' : level <= 20 ? '#FBBF24' : '#FFFFFF' }}
                      initial={false}
                      animate={{ width: `${level}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  {timeText && (
                    <p className="text-[11px] text-white/50 mt-1">
                      {timeText}
                    </p>
                  )}
                </div>
              )}

              {/* Separator */}
              <div className="h-px bg-white/10 mb-2.5" />

              {/* Ma'lumotlar */}
              {isSupported ? (
                <div className="space-y-2">
                  <InfoRow label="Power Source" value={getSourceText()!} />
                  {charging && level < 100 && isFinite(chargingTime) && (
                    <InfoRow label="Time Until Full" value={formatTime(chargingTime)} />
                  )}
                  {!charging && isFinite(dischargingTime) && dischargingTime > 0 && (
                    <InfoRow label="Time Remaining" value={formatTime(dischargingTime)} />
                  )}
                  <InfoRow
                    label="Condition"
                    value="Normal"
                    valueColor="text-green-400/90"
                  />
                </div>
              ) : (
                <p className="text-[12px] text-white/40">
                  Battery information is not available in this browser.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}

const InfoRow = ({
  label,
  value,
  valueColor = 'text-white/70',
}: {
  label: string
  value: string
  valueColor?: string
}) => (
  <div className="flex items-center justify-between">
    <span className="text-[12px] text-white/50">{label}</span>
    <span className={cn('text-[12px]', valueColor)}>{value}</span>
  </div>
)

export default BatteryIndicator
