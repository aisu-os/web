import { useRef, useCallback } from 'react'

interface SettingsSliderProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  leftLabel?: string
  rightLabel?: string
  accentColor?: string
}

export default function SettingsSlider({
  value,
  min = 0,
  max = 100,
  onChange,
  leftLabel,
  rightLabel,
  accentColor,
}: SettingsSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const clampAndEmit = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return

      const rect = track.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const clamped = min + ratio * (max - min)

      onChange(Math.round(clamped * 100) / 100)
    },
    [min, max, onChange]
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      clampAndEmit(e.clientX)

      const handlePointerMove = (moveEvent: PointerEvent) => {
        clampAndEmit(moveEvent.clientX)
      }

      const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove)
        window.removeEventListener('pointerup', handlePointerUp)
      }

      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    },
    [clampAndEmit]
  )

  const percentage = ((value - min) / (max - min)) * 100
  const filledColor = accentColor ?? 'rgba(255, 255, 255, 0.3)'

  return (
    <div className="flex w-full items-center gap-2.5">
      {leftLabel && (
        <span className="flex-shrink-0 text-[11px] text-white/40">{leftLabel}</span>
      )}

      <div
        ref={trackRef}
        className="relative flex h-5 w-full cursor-pointer touch-none items-center"
        onPointerDown={handlePointerDown}
      >
        {/* Track background */}
        <div className="absolute h-[3px] w-full rounded-full bg-white/10" />

        {/* Track filled */}
        <div
          className="absolute h-[3px] rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: filledColor,
          }}
        />

        {/* Thumb */}
        <div
          className="absolute h-[18px] w-[18px] rounded-full bg-white shadow-md shadow-black/30"
          style={{
            left: `calc(${percentage}% - 9px)`,
          }}
        />
      </div>

      {rightLabel && (
        <span className="flex-shrink-0 text-[11px] text-white/40">{rightLabel}</span>
      )}
    </div>
  )
}
