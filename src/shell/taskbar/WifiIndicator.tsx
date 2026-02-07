import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Z_INDEX } from '@/lib/constants'
import { useNetwork } from '@/hooks/use-network'
import { useClickOutside } from '@/hooks/use-click-outside'
import InfoRow from './InfoRow'
import type { NetworkState, EffectiveConnectionType } from '@/types'

const WifiIndicator = () => {
  const network = useNetwork()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, right: 0 })

  useClickOutside(containerRef, () => setIsOpen(false), { onEscape: true })

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

  const signalBars = getSignalBars(network)

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center rounded px-1 hover:bg-white/10 cursor-default"
      onClick={handleClick}
    >
      <WifiIcon strength={signalBars} online={network.online} />

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              onMouseDown={(e) => e.stopPropagation()}
              style={{ top: position.top, right: position.right, zIndex: Z_INDEX.dropdown }}
              className={cn(
                'fixed',
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
                  Wi-Fi
                </span>
                <span className={cn(
                  'text-[12px] font-medium',
                  network.online ? 'text-green-400/90' : 'text-red-400/90',
                )}>
                  {network.online ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {/* Signal bars */}
              <div className="flex items-end gap-[3px] mb-2.5 h-[20px]">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={cn(
                      'w-[5px] rounded-sm',
                      bar <= signalBars
                        ? (network.online ? 'bg-emerald-400' : 'bg-red-400')
                        : 'bg-white/15',
                    )}
                    style={{ height: `${bar * 5}px` }}
                  />
                ))}
              </div>

              {/* Separator */}
              <div className="h-px bg-white/10 mb-2.5" />

              {/* Ma'lumotlar */}
              <div className="space-y-2">
                <InfoRow
                  label="Status"
                  value={network.online ? 'Connected' : 'Disconnected'}
                  valueColor={network.online ? 'text-green-400/90' : 'text-red-400/90'}
                />

                {network.isConnectionApiSupported && (
                  <>
                    {network.type !== 'unknown' && (
                      <InfoRow label="Network Type" value={getTypeLabel(network.type)} />
                    )}
                    <InfoRow
                      label="Quality"
                      value={getQualityLabel(network.effectiveType)}
                      valueColor={getQualityColor(network.effectiveType)}
                    />
                    {network.downlink > 0 && (
                      <InfoRow label="Speed" value={`${network.downlink} Mbps`} />
                    )}
                    {network.rtt > 0 && (
                      <InfoRow label="Latency" value={`${network.rtt} ms`} />
                    )}
                  </>
                )}

                {!network.online && (
                  <p className="text-[12px] text-white/40 mt-1">
                    You are currently offline.
                  </p>
                )}

                {network.online && !network.isConnectionApiSupported && (
                  <p className="text-[12px] text-white/40 mt-1">
                    Detailed network info is not available in this browser.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}

function WifiIcon({ strength, online }: { strength: number; online: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/90"
    >
      <path d="M1.42 9a16 16 0 0 1 21.16 0" opacity={strength >= 4 ? 0.9 : 0.25} />
      <path d="M5 12.55a11 11 0 0 1 14.08 0" opacity={strength >= 3 ? 0.9 : 0.25} />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" opacity={strength >= 2 ? 0.9 : 0.25} />
      <circle cx="12" cy="20" r="1" fill="currentColor" opacity={online ? 0.9 : 0.25} />
      {!online && (
        <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      )}
    </svg>
  )
}

function getSignalBars(state: NetworkState): number {
  if (!state.online) return 0
  if (!state.isConnectionApiSupported) return 4

  switch (state.effectiveType) {
    case 'slow-2g': return 1
    case '2g': return 2
    case '3g': return 3
    case '4g': return 4
    default: return 4
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'wifi': return 'Wi-Fi'
    case 'cellular': return 'Cellular'
    case 'ethernet': return 'Ethernet'
    case 'bluetooth': return 'Bluetooth'
    case 'wimax': return 'WiMAX'
    case 'none': return 'None'
    case 'other': return 'Other'
    default: return 'Unknown'
  }
}

function getQualityLabel(effectiveType: EffectiveConnectionType): string {
  switch (effectiveType) {
    case 'slow-2g': return 'Very Slow'
    case '2g': return 'Slow'
    case '3g': return 'Good'
    case '4g': return 'Excellent'
    default: return 'Unknown'
  }
}

function getQualityColor(effectiveType: EffectiveConnectionType): string {
  switch (effectiveType) {
    case 'slow-2g': return 'text-red-400/90'
    case '2g': return 'text-orange-400/90'
    case '3g': return 'text-yellow-400/90'
    case '4g': return 'text-green-400/90'
    default: return 'text-white/70'
  }
}

export default WifiIndicator
