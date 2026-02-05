import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import { useBoot } from '@/hooks/use-boot'
import BootLogo from './BootLogo'
import { PARTICLE_COUNT, HEX_GRID_SPACING, VERSION_TEXT } from './boot.constants'
import './boot-screen.css'

interface BootScreenProps {
  onComplete?: () => void
}

function generateHexGrid(spacing: number) {
  const cols = Math.ceil(window.innerWidth / spacing) + 1
  const rows = Math.ceil(window.innerHeight / spacing) + 1
  const dots: Array<{ x: number; y: number; key: string }> = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offsetX = r % 2 === 0 ? 0 : spacing / 2
      dots.push({
        x: c * spacing + offsetX,
        y: r * spacing,
        key: `${r}-${c}`,
      })
    }
  }
  return dots
}

function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    key: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.25 + 0.05,
  }))
}

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const { isVisible, isFadingOut, statusText, isStatusFading } = useBoot({
    onComplete,
  })

  const hexDots = useMemo(() => generateHexGrid(HEX_GRID_SPACING), [])
  const particles = useMemo(() => generateParticles(PARTICLE_COUNT), [])

  if (!isVisible) return null

  return (
    <div className={cn('boot-screen', isFadingOut && 'boot-screen--fading')}>
      {/* Background aurora blobs */}
      <div className="boot-aurora">
        <div className="boot-aurora__blob" />
        <div className="boot-aurora__blob" />
        <div className="boot-aurora__blob" />
      </div>

      {/* Hex dot grid */}
      <div className="boot-hex-grid">
        {hexDots.map((dot) => (
          <div
            key={dot.key}
            className="boot-hex-grid__dot"
            style={{ left: dot.x, top: dot.y }}
          />
        ))}
      </div>

      {/* Floating ice particles */}
      <div className="boot-particles">
        {particles.map((p) => (
          <div
            key={p.key}
            className="boot-particle"
            style={
              {
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                bottom: -10,
                '--p-opacity': p.opacity,
                animationDuration: `${p.duration}s, 1s`,
                animationDelay: `${p.delay}s, ${p.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Main content */}
      <div className="boot-content">
        <div className="boot-crystal-rings">
          {/* Pulse rings */}
          <div className="boot-crystal-ring" />
          <div className="boot-crystal-ring" />
          <div className="boot-crystal-ring" />

          {/* Shimmer effect */}
          <div className="boot-shimmer" />

          {/* Sparkles */}
          <div className="boot-sparkles">
            <div className="boot-sparkle" />
            <div className="boot-sparkle" />
            <div className="boot-sparkle" />
            <div className="boot-sparkle" />
            <div className="boot-sparkle" />
            <div className="boot-sparkle" />
          </div>

          {/* SVG Logo */}
          <BootLogo />
        </div>

        {/* Brand text */}
        <div className="boot-brand">
          <div className="boot-brand__name">aisu</div>
          <div className="boot-brand__tagline">ai web os</div>
        </div>

        {/* Loading section */}
        <div className="boot-loading">
          <div className="boot-loading__track">
            <div className="boot-loading__fill" />
          </div>
          <div className="boot-loading__text">
            <span
              className={cn(
                'boot-loading__status',
                isStatusFading && 'boot-loading__status--fading'
              )}
            >
              {statusText}
            </span>
            <span className="boot-loading__dots" />
          </div>
        </div>
      </div>

      {/* Version text */}
      <div className="boot-version">{VERSION_TEXT}</div>
    </div>
  )
}

export default BootScreen
