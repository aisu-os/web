import { useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCursorStore } from '@/stores/use-cursor-store'

export const CursorOverlay = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)

  const theme = useCursorStore((s) => s.theme)
  const cursorType = useCursorStore((s) => s.cursorType)
  const isEnabled = useCursorStore((s) => s.isEnabled)
  const isVisible = useCursorStore((s) => s.isVisible)

  const asset = theme.cursors[cursorType] ?? theme.cursors.default

  const hotspot = useMemo(
    () => ({
      x: asset?.hotspot.x ?? 0,
      y: asset?.hotspot.y ?? 0,
    }),
    [asset],
  )

  const updatePosition = useCallback(() => {
    if (cursorRef.current) {
      const { x, y } = posRef.current
      cursorRef.current.style.transform = `translate3d(${x - hotspot.x}px, ${y - hotspot.y}px, 0)`
    }
    rafRef.current = requestAnimationFrame(updatePosition)
  }, [hotspot])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      useCursorStore.getState().setVisible(false)
    }

    const handleMouseEnter = () => {
      useCursorStore.getState().setVisible(true)
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)
    rafRef.current = requestAnimationFrame(updatePosition)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(rafRef.current)
    }
  }, [updatePosition])

  if (!isEnabled || !asset) return null

  const scale = theme.scale ?? 1

  const renderCursor = () => {
    if (asset.url) {
      return (
        <img
          src={asset.url}
          width={asset.width}
          height={asset.height}
          alt=""
          draggable={false}
        />
      )
    }
    if (asset.svg) {
      return <div dangerouslySetInnerHTML={{ __html: asset.svg }} />
    }
    return null
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none select-none"
      style={{
        zIndex: 99999,
        willChange: 'transform',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={cursorType}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            scale,
          }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{
            opacity: { duration: 0.08 },
            scale: { duration: 0.08 },
          }}
          style={{ width: asset.width, height: asset.height }}
        >
          {asset.animation?.rotate ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {renderCursor()}
            </motion.div>
          ) : (
            renderCursor()
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
