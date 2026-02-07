import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Z_INDEX } from '@/lib/constants'
import { useMenuBarStore } from '@/stores/use-menubar-store'
import { useDrag } from '@/hooks/use-drag'
import { VERSION_TEXT } from '@/shell/boot/boot.constants'
import AboutLogo from './AboutLogo'

const AboutDialog = () => {
  const isOpen = useMenuBarStore((s) => s.isAboutOpen)
  const closeAbout = useMenuBarStore((s) => s.closeAbout)
  const panelRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const dragStartRef = useRef({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!isOpen) {
      setPosition({ x: 0, y: 0 })
      positionRef.current = { x: 0, y: 0 }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAbout()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeAbout])

  const titlebarDrag = useDrag({
    shouldStart: (e) => {
      if ((e.target as HTMLElement).closest('[data-window-button]')) return false
      dragStartRef.current = { ...positionRef.current }
      return true
    },
    onDragMove: (dx, dy) => {
      const maxX = window.innerWidth - 140
      const maxY = window.innerHeight - 100
      const minX = -(window.innerWidth - 140)
      const minY = -(window.innerHeight / 2)

      const newPos = {
        x: Math.max(minX, Math.min(maxX, dragStartRef.current.x + dx)),
        y: Math.max(minY, Math.min(maxY, dragStartRef.current.y + dy)),
      }
      positionRef.current = newPos
      setPosition(newPos)
    },
  })

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      closeAbout()
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: Z_INDEX.aboutDialog }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={handleBackdropClick}
        >
          <div className="absolute inset-0 bg-black/40" />

          <motion.div
            ref={panelRef}
            className={cn(
              'relative w-[280px]',
              'rounded-xl overflow-hidden',
              'bg-black/30 backdrop-blur-2xl backdrop-saturate-150',
              'shadow-2xl shadow-black/40',
              'ring-1 ring-inset ring-white/10',
              'select-none',
              titlebarDrag.isDragging && 'cursor-grabbing',
            )}
            initial={{ opacity: 0, scale: 0.92, x: 0, y: 0 }}
            animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={titlebarDrag.isDragging ? { duration: 0 } : { duration: 0.15 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Titlebar */}
            <div className="flex items-center h-[38px] px-3 shrink-0">
              {/* Traffic lights */}
              <div className="group/traffic flex items-center gap-2 mr-3">
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={closeAbout}
                  className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF4136] transition-colors flex items-center justify-center"
                >
                  <svg className="w-[8px] h-[8px] opacity-0 group-hover/traffic:opacity-100 transition-opacity" viewBox="0 0 10 10">
                    <line x1="2" y1="2" x2="8" y2="8" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="8" y1="2" x2="2" y2="8" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="w-3 h-3 rounded-full bg-white/15" />
                <div className="w-3 h-3 rounded-full bg-white/15" />
              </div>

              {/* Drag zone */}
              <div
                className="flex-1 h-full cursor-grab active:cursor-grabbing"
                onMouseDown={titlebarDrag.handleMouseDown}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col items-center px-6 pb-6">
              <AboutLogo />

              <h1 className="mt-4 text-xl font-semibold text-white/90">
                aisu
              </h1>

              <p className="mt-1 text-sm text-white/50">
                AI Web OS
              </p>

              <p className="mt-3 text-xs text-white/40">
                {VERSION_TEXT}
              </p>

              <div className="w-full h-px bg-white/10 my-4" />

              <button
                className={cn(
                  'px-4 py-1.5 rounded-md text-[13px]',
                  'text-white/80',
                  'ring-1 ring-inset ring-white/15',
                  'hover:bg-white/10',
                  'transition-colors duration-150',
                )}
              >
                More Info...
              </button>

              <p className="mt-4 text-[11px] text-white/30 text-center">
                &copy; 2025 aisu. All rights reserved.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default AboutDialog
