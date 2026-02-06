import { motion, useMotionValue } from 'framer-motion'
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

interface DockProps {
  isVisible: boolean
}

const Dock = ({ isVisible }: DockProps) => {
  const mouseX = useMotionValue(Infinity)

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
        'fixed left-1/2 -translate-x-1/2',
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

      <DockItem item={DOCK_SETTINGS_ITEM} mouseX={mouseX} />
    </motion.div>
  )
}

export default Dock
