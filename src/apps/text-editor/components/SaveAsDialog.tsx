import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { Z_INDEX } from '@/lib/constants'
import { useDrag } from '@/hooks/use-drag'
import { useFileSystemStore } from '@/stores/use-file-system-store'
import { useTextEditorStore } from '../hooks/use-text-editor-store'
import { FolderIcon } from '@/apps/file-manager/file-manager-icons'

const SaveAsDialog = () => {
  const showSaveAs = useTextEditorStore((s) => s.showSaveAs)
  const isSaving = useTextEditorStore((s) => s.isSaving)
  const saveAsError = useTextEditorStore((s) => s.saveAsError)
  const fileName = useTextEditorStore((s) => s.fileName)
  const closeSaveAs = useTextEditorStore((s) => s.closeSaveAs)
  const saveAs = useTextEditorStore((s) => s.saveAs)
  const getChildren = useFileSystemStore((s) => s.getChildren)

  const [currentPath, setCurrentPath] = useState('/')
  const [inputFileName, setInputFileName] = useState('Untitled.txt')

  const panelRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const dragStartRef = useRef({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (showSaveAs) {
      setCurrentPath('/')
      setInputFileName(fileName === 'Untitled' ? 'Untitled.txt' : fileName)
      setPosition({ x: 0, y: 0 })
      positionRef.current = { x: 0, y: 0 }
    }
  }, [showSaveAs, fileName])

  useEffect(() => {
    if (!showSaveAs) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeSaveAs()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSaveAs, closeSaveAs])

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
      closeSaveAs()
    }
  }

  const children = getChildren(currentPath)
  const folders = children
    .filter((c) => c.type === 'directory')
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleNavigateUp = () => {
    if (currentPath === '/') return
    const segments = currentPath.split('/')
    segments.pop()
    setCurrentPath(segments.join('/') || '/')
  }

  const handleFolderClick = (folderPath: string) => {
    setCurrentPath(folderPath)
  }

  const handleSave = () => {
    const trimmed = inputFileName.trim()
    if (!trimmed || isSaving) return
    saveAs(currentPath, trimmed)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  const currentFolderName = currentPath === '/' ? '/' : currentPath.split('/').pop()

  return createPortal(
    <AnimatePresence>
      {showSaveAs && (
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
              'relative w-[420px]',
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
                  onClick={closeSaveAs}
                  className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF4136] transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-[8px] h-[8px] opacity-0 group-hover/traffic:opacity-100 transition-opacity"
                    viewBox="0 0 10 10"
                  >
                    <line x1="2" y1="2" x2="8" y2="8" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="8" y1="2" x2="2" y2="8" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="w-3 h-3 rounded-full bg-white/15" />
                <div className="w-3 h-3 rounded-full bg-white/15" />
              </div>

              <div
                className="flex-1 h-full cursor-grab active:cursor-grabbing"
                onMouseDown={titlebarDrag.handleMouseDown}
              />

              <span className="text-[12px] text-white/50 font-medium absolute left-1/2 -translate-x-1/2">
                Save As
              </span>
            </div>

            {/* Current path */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-t border-white/[0.06] bg-white/[0.02]">
              <svg className="w-3.5 h-3.5 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
              <span className="text-[11px] text-white/50 truncate">{currentPath}</span>
            </div>

            {/* Directory browser */}
            <div className="h-[200px] overflow-y-auto border-t border-white/[0.06]">
              {currentPath !== '/' && (
                <button
                  onClick={handleNavigateUp}
                  className={cn(
                    'flex items-center gap-2 w-full px-4 py-1.5 text-left',
                    'hover:bg-white/[0.06] transition-colors'
                  )}
                >
                  <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                  <span className="text-[12px] text-white/50">..</span>
                </button>
              )}

              {folders.map((folder) => (
                <button
                  key={folder.path}
                  onClick={() => handleFolderClick(folder.path)}
                  className={cn(
                    'flex items-center gap-2 w-full px-4 py-1.5 text-left',
                    'hover:bg-white/[0.06] transition-colors'
                  )}
                >
                  <div className="shrink-0">
                    <FolderIcon size={18} />
                  </div>
                  <span className="text-[12px] text-white/80 truncate flex-1">{folder.name}</span>
                  <svg className="w-3 h-3 text-white/25 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ))}

              {folders.length === 0 && (
                <div className="flex items-center justify-center h-full text-[12px] text-white/30">
                  {currentPath === '/'
                    ? 'No folders available'
                    : `${currentFolderName} is empty`}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="mx-4 h-px bg-white/10" />

            {/* Filename input */}
            <div className="px-4 py-3">
              <label className="text-[11px] text-white/50 mb-1.5 block">Save as</label>
              <input
                type="text"
                value={inputFileName}
                onChange={(e) => setInputFileName(e.target.value)}
                onKeyDown={handleInputKeyDown}
                autoFocus
                className={cn(
                  'w-full bg-white/[0.06] rounded-md px-3 py-1.5',
                  'text-[13px] text-white/80 placeholder:text-white/30',
                  'outline-none ring-1 ring-inset ring-white/10',
                  'focus:ring-sky-500/50 transition-shadow'
                )}
                placeholder="filename.txt"
              />
            </div>

            {/* Error */}
            {saveAsError && (
              <div className="px-4 pb-2 text-[11px] text-red-400">
                {saveAsError}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2 px-4 pb-4">
              <button
                onClick={closeSaveAs}
                className={cn(
                  'px-4 py-1.5 rounded-md text-[12px] font-medium',
                  'text-white/60 bg-white/[0.06] ring-1 ring-inset ring-white/10',
                  'hover:bg-white/[0.1] transition-colors'
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!inputFileName.trim() || isSaving}
                className={cn(
                  'px-4 py-1.5 rounded-md text-[12px] font-medium',
                  'transition-colors',
                  !inputFileName.trim() || isSaving
                    ? 'bg-sky-500/30 text-white/40 cursor-not-allowed'
                    : 'bg-sky-500 text-white hover:bg-sky-400'
                )}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default SaveAsDialog
