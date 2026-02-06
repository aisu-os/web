import { motion, useMotionValue, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import {
  DOCK_ITEMS,
  DOCK_SETTINGS_ITEM,
  DOCK_ENTRANCE_DELAY,
  DOCK_PADDING_X,
  DOCK_PADDING_Y,
  DOCK_GAP,
  DOCK_MARGIN_BOTTOM,
} from './dock.constants'
import DockItem from './DockItem'
import DockSeparator from './DockSeparator'
import { useWindowStore } from '@/stores/use-window-store'

interface DockProps {
  isVisible: boolean
}

const Dock = ({ isVisible }: DockProps) => {
  const mouseX = useMotionValue(Infinity)
  const windows = useWindowStore((s) => s.windows)

  const hiddenProcesses = windows
    .filter((w) => w.isHidden)
    .map((w) => ({
      processId: w.processId,
      dockItem: DOCK_ITEMS.find((item) => item.id === w.appId),
    }))
    .filter((p) => p.dockItem != null)

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      initial={{ y: 100, opacity: 0 }}
      animate={isVisible ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 170,
        damping: 26,
        delay: isVisible ? DOCK_ENTRANCE_DELAY : 0,
      }}
      className={cn(
        'fixed left-1/2 -translate-x-1/2 z-[9999]',
        'flex items-end',
        'bg-black/20 backdrop-blur-xl backdrop-saturate-150',
        'rounded-2xl',
        'border border-white/10',
        'shadow-xl shadow-black/20',
      )}
      style={{
        bottom: DOCK_MARGIN_BOTTOM,
        paddingLeft: DOCK_PADDING_X,
        paddingRight: DOCK_PADDING_X,
        paddingTop: DOCK_PADDING_Y,
        paddingBottom: DOCK_PADDING_Y,
        gap: DOCK_GAP,
      }}
    >
      {DOCK_ITEMS.map((item) => (
        <DockItem key={item.id} item={item} mouseX={mouseX} />
      ))}

      <DockSeparator />

      <AnimatePresence>
        {hiddenProcesses.map((proc) => (
          <motion.div
            key={`hidden-${proc.processId}`}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <DockItem item={proc.dockItem!} mouseX={mouseX} hiddenProcessId={proc.processId} />
          </motion.div>
        ))}
      </AnimatePresence>

      <DockItem item={DOCK_SETTINGS_ITEM} mouseX={mouseX} />
    </motion.div>
  )
}

export default Dock
