import { useRef, useCallback, useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { WindowState } from '@/types'
import { useWindowStore } from '@/stores/use-window-store'
import { appRegistry } from '@/apps/_registry'

interface WindowProps {
  windowState: WindowState
}

const MIN_WIDTH = 400
const MIN_HEIGHT = 300

const Window = ({ windowState }: WindowProps) => {
  const {
    id,
    appId,
    processId,
    title,
    position,
    size,
    isMinimized,
    isMaximized,
    isHidden,
    isFocused,
    zIndex,
  } = windowState

  const closeWindow = useWindowStore((s) => s.closeWindow)
  const focusWindow = useWindowStore((s) => s.focusWindow)
  const hideProcess = useWindowStore((s) => s.hideProcess)
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow)
  const restoreWindow = useWindowStore((s) => s.restoreWindow)
  const moveWindow = useWindowStore((s) => s.moveWindow)
  const resizeWindow = useWindowStore((s) => s.resizeWindow)
  const windowProps = useWindowStore((s) => s.getWindowProps(id))

  const dragRef = useRef({ startX: 0, startY: 0, winX: 0, winY: 0 })
  const resizeRef = useRef({ startX: 0, startY: 0, startW: 0, startH: 0, dir: '' })
  const [isDragging, setIsDragging] = useState(false)

  const entry = appRegistry[appId]
  if (!entry) return null

  const AppComponent = entry.component
  const config = entry.config
  const minW = config.window.minWidth ?? MIN_WIDTH
  const minH = config.window.minHeight ?? MIN_HEIGHT

  const handleMouseDownTitlebar = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-window-button]')) return
      e.preventDefault()
      focusWindow(id)

      if (isMaximized) return

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        winX: position.x,
        winY: position.y,
      }
      setIsDragging(true)

      const handleMouseMove = (me: MouseEvent) => {
        const dx = me.clientX - dragRef.current.startX
        const dy = me.clientY - dragRef.current.startY
        const newY = Math.max(0, dragRef.current.winY + dy)
        moveWindow(id, {
          x: dragRef.current.winX + dx,
          y: newY,
        })
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [id, position, isMaximized, focusWindow, moveWindow]
  )

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault()
      e.stopPropagation()
      focusWindow(id)

      if (isMaximized) return

      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: size.width,
        startH: size.height,
        dir: direction,
      }
      const handleMouseMove = (me: MouseEvent) => {
        const dx = me.clientX - resizeRef.current.startX
        const dy = me.clientY - resizeRef.current.startY
        const dir = resizeRef.current.dir

        let newW = resizeRef.current.startW
        let newH = resizeRef.current.startH
        let newX = position.x
        let newY = position.y

        if (dir.includes('e')) newW = Math.max(minW, resizeRef.current.startW + dx)
        if (dir.includes('s')) newH = Math.max(minH, resizeRef.current.startH + dy)
        if (dir.includes('w')) {
          const possibleW = resizeRef.current.startW - dx
          if (possibleW >= minW) {
            newW = possibleW
            newX = position.x + dx
          }
        }
        if (dir.includes('n')) {
          const possibleH = resizeRef.current.startH - dy
          if (possibleH >= minH) {
            newH = possibleH
            newY = Math.max(0, position.y + dy)
          }
        }

        resizeWindow(id, { width: newW, height: newH })
        if (dir.includes('w') || dir.includes('n')) {
          moveWindow(id, { x: newX, y: newY })
        }
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [id, size, position, isMaximized, minW, minH, focusWindow, resizeWindow, moveWindow]
  )

  const handleDoubleClickTitlebar = useCallback(() => {
    if (isMaximized) {
      restoreWindow(id)
    } else {
      maximizeWindow(id)
    }
  }, [id, isMaximized, maximizeWindow, restoreWindow])

  const handleFocus = useCallback(() => {
    if (!isFocused) focusWindow(id)
  }, [id, isFocused, focusWindow])

  // Keyboard - Escape close ni oldini olish uchun
  useEffect(() => {
    if (!isFocused) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && e.metaKey) {
        closeWindow(id)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [id, isFocused, closeWindow])

  const computedStyle = isMaximized
    ? {
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex,
      }
    : {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }

  const isVisible = !isMinimized && !isHidden

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          'absolute flex flex-col',
          'rounded-xl overflow-hidden',
          'shadow-2xl shadow-black/40',
          isFocused
            ? 'ring-1 ring-white/15'
            : 'ring-1 ring-white/5',
          isDragging && 'cursor-grabbing',
        )}
        style={{
          ...computedStyle,
          visibility: isVisible ? 'visible' : 'hidden',
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.15 }}
        onMouseDown={handleFocus}
        onContextMenu={(e) => e.stopPropagation()}
      >
          {/* Titlebar */}
          <div
            className={cn(
              'flex items-center h-[38px] px-3 shrink-0 select-none',
              'bg-[#2A2A3E]',
              !isFocused && 'bg-[#252535]',
            )}
            onMouseDown={handleMouseDownTitlebar}
            onDoubleClick={handleDoubleClickTitlebar}
          >
            {/* Traffic lights */}
            <div className="group/traffic flex items-center gap-2 mr-3" data-window-button>
              <button
                onClick={() => closeWindow(id)}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors flex items-center justify-center',
                  isFocused ? 'bg-[#FF5F57] hover:bg-[#FF4136]' : 'bg-white/15',
                )}
                data-window-button
              >
                {isFocused && (
                  <svg className="w-[8px] h-[8px] opacity-0 group-hover/traffic:opacity-100 transition-opacity" viewBox="0 0 10 10">
                    <line x1="2" y1="2" x2="8" y2="8" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="8" y1="2" x2="2" y2="8" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => hideProcess(processId)}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors flex items-center justify-center',
                  isFocused ? 'bg-[#FFBD2E] hover:bg-[#FFAA00]' : 'bg-white/15',
                )}
                data-window-button
              >
                {isFocused && (
                  <svg className="w-[8px] h-[8px] opacity-0 group-hover/traffic:opacity-100 transition-opacity" viewBox="0 0 10 10">
                    <line x1="1.5" y1="5" x2="8.5" y2="5" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => (isMaximized ? restoreWindow(id) : maximizeWindow(id))}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors flex items-center justify-center',
                  isFocused ? 'bg-[#28CA41] hover:bg-[#1AAB29]' : 'bg-white/15',
                )}
                data-window-button
              >
                {isFocused && (
                  <svg className="w-[6px] h-[6px] opacity-0 group-hover/traffic:opacity-100 transition-opacity" viewBox="0 0 10 10">
                    {isMaximized ? (
                      <>
                        <polyline points="3,7 3,3 7,3" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="7,3 7,7 3,7" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    ) : (
                      <>
                        <polyline points="1,6 1,1 6,1" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="9,4 9,9 4,9" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </>
                    )}
                  </svg>
                )}
              </button>
            </div>

            {/* Title */}
            <div className="flex-1 text-center">
              <span
                className={cn(
                  'text-[13px] font-medium',
                  isFocused ? 'text-white/80' : 'text-white/40',
                )}
              >
                {title}
              </span>
            </div>

            {/* Spacer to balance traffic lights */}
            <div className="w-[60px]" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden bg-[#1E1E2E]">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full text-white/30 text-sm">
                  Loading...
                </div>
              }
            >
              <AppComponent {...(windowProps ?? {})} />
            </Suspense>
          </div>

          {/* Resize handles */}
          {config.window.resizable !== false && !isMaximized && (
            <>
              <div className="absolute top-0 left-0 right-0 h-1 cursor-n-resize" onMouseDown={(e) => handleResizeStart(e, 'n')} />
              <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize" onMouseDown={(e) => handleResizeStart(e, 's')} />
              <div className="absolute top-0 bottom-0 left-0 w-1 cursor-w-resize" onMouseDown={(e) => handleResizeStart(e, 'w')} />
              <div className="absolute top-0 bottom-0 right-0 w-1 cursor-e-resize" onMouseDown={(e) => handleResizeStart(e, 'e')} />
              <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
              <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
              <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
              <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" onMouseDown={(e) => handleResizeStart(e, 'se')} />
            </>
          )}
      </motion.div>
    </AnimatePresence>
  )
}

export default Window
