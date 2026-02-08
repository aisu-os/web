import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Z_INDEX } from '@/lib/constants'
import { useGetInfoStore } from '@/stores/use-get-info-store'
import { useFileSystemStore } from '@/stores/use-file-system-store'
import { useDrag } from '@/hooks/use-drag'
import { getFileIcon } from '@/apps/file-manager/file-manager-icons'
import {
  getFileKind,
  formatFileSize,
  formatDate,
  calculateFolderSize,
} from '@/apps/file-manager/file-manager.utils'

const GetInfoDialog = () => {
  const isOpen = useGetInfoStore((s) => s.isOpen)
  const targetPath = useGetInfoStore((s) => s.targetPath)
  const close = useGetInfoStore((s) => s.close)
  const getNode = useFileSystemStore((s) => s.getNode)
  const getParentPath = useFileSystemStore((s) => s.getParentPath)
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
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  const titlebarDrag = useDrag({
    shouldStart: (e) => {
      if ((e.target as HTMLElement).closest('[data-window-button]')) return false
      dragStartRef.current = { ...positionRef.current }
      return true
    },
    onDragMove: (dx, dy) => {
      const maxX = window.innerWidth - 150
      const maxY = window.innerHeight - 100
      const minX = -(window.innerWidth - 150)
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
      close()
    }
  }

  const node = targetPath ? getNode(targetPath) : null

  if (!node && isOpen) return null

  const parentPath = node ? getParentPath(node.path) : ''
  const kind = node ? getFileKind(node) : ''
  const size = node
    ? node.type === 'directory'
      ? calculateFolderSize(node)
      : (node.size ?? 0)
    : 0
  const itemCount =
    node?.type === 'directory' ? (node.children?.length ?? 0) : null
  const FileIcon = node ? getFileIcon(node) : null

  return createPortal(
    <AnimatePresence>
      {isOpen && node && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: Z_INDEX.getInfoDialog }}
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
              'relative w-[300px]',
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
            transition={
              titlebarDrag.isDragging ? { duration: 0 } : { duration: 0.15 }
            }
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Titlebar */}
            <div className="flex items-center h-[38px] px-3 shrink-0">
              <div className="group/traffic flex items-center gap-2 mr-3">
                <button
                  data-window-button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={close}
                  className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF4136] transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-[8px] h-[8px] opacity-0 group-hover/traffic:opacity-100 transition-opacity"
                    viewBox="0 0 10 10"
                  >
                    <line
                      x1="2"
                      y1="2"
                      x2="8"
                      y2="8"
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="8"
                      y1="2"
                      x2="2"
                      y2="8"
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div className="w-3 h-3 rounded-full bg-white/15" />
                <div className="w-3 h-3 rounded-full bg-white/15" />
              </div>

              <div
                className="flex-1 h-full cursor-grab active:cursor-grabbing"
                onMouseDown={titlebarDrag.handleMouseDown}
              />
            </div>

            {/* Header: Icon + Name + Kind */}
            <div className="flex flex-col items-center px-6 pb-4">
              {FileIcon && <FileIcon size={64} />}
              <h2 className="mt-3 text-sm font-semibold text-white/90 text-center max-w-[240px] break-words">
                {node.name}
              </h2>
              <p className="mt-0.5 text-xs text-white/50">{kind}</p>
            </div>

            {/* Divider */}
            <div className="mx-4 h-px bg-white/10" />

            {/* General Info */}
            <div className="px-4 py-3">
              <h3 className="text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-2">
                General
              </h3>
              <div className="grid grid-cols-[80px_1fr] gap-y-1.5 text-[12px]">
                <span className="text-white/50">Kind</span>
                <span className="text-white/80">{kind}</span>

                <span className="text-white/50">Size</span>
                <span className="text-white/80">
                  {formatFileSize(size)}
                  {itemCount !== null && ` (${itemCount} items)`}
                </span>

                <span className="text-white/50">Where</span>
                <span className="text-white/80 break-all">{parentPath}</span>

                <span className="text-white/50">Created</span>
                <span className="text-white/80">
                  {formatDate(node.createdAt)}
                </span>

                <span className="text-white/50">Modified</span>
                <span className="text-white/80">
                  {formatDate(node.updatedAt)}
                </span>
              </div>
            </div>

            <div className="pb-2" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default GetInfoDialog
