import { motion, AnimatePresence } from 'framer-motion'
import { useDragDropStore } from '@/stores/use-drag-drop-store'
import { Z_INDEX } from '@/lib/constants'

const DragOverlay = () => {
  const session = useDragDropStore((s) => s.session)

  if (!session) return null

  const { items, cursorPosition, operation } = session
  const firstItem = items[0]
  if (!firstItem) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed pointer-events-none"
        style={{
          left: cursorPosition.x + 12,
          top: cursorPosition.y + 12,
          zIndex: Z_INDEX.dragOverlay,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.9, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center gap-2 bg-[#2A2A3E]/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-xl border border-white/10">
          {/* Icon */}
          <span className="text-base shrink-0">
            {firstItem.type === 'directory' ? '\u{1F4C1}' : '\u{1F4C4}'}
          </span>

          {/* Name */}
          <span className="text-[12px] text-white/80 truncate max-w-[160px]">
            {firstItem.name}
          </span>

          {/* Multi-item badge */}
          {items.length > 1 && (
            <span className="flex items-center justify-center min-w-[20px] h-[20px] rounded-full bg-blue-500 text-white text-[10px] font-bold px-1">
              {items.length}
            </span>
          )}

          {/* Copy badge */}
          {operation === 'copy' && (
            <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-green-500 text-white text-[11px] font-bold">
              +
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DragOverlay
