import { useRef, useState } from 'react'
import {
  motion,
  useTransform,
  useSpring,
  useAnimationControls,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion'
import type { DockItemConfig } from './dock.types'
import {
  DOCK_ICON_SIZE,
  DOCK_ICON_SIZE_MAX,
  DOCK_MAGNIFICATION_RANGE,
  BOUNCE_DURATION,
} from './dock.constants'
import DockTooltip from './DockTooltip'
import { useWindowStore } from '@/stores/use-window-store'

interface DockItemProps {
  item: DockItemConfig
  mouseX: MotionValue<number>
}

const DockItem = ({ item, mouseX }: DockItemProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimationControls()
  const openWindow = useWindowStore((s) => s.openWindow)
  const openCount = useWindowStore((s) =>
    s.windows.filter((w) => w.appId === item.id).length
  )
  const dotCount = Math.min(openCount, 3)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return Infinity
    return val - (bounds.x + bounds.width / 2)
  })

  const size = useTransform(
    distance,
    [-DOCK_MAGNIFICATION_RANGE, 0, DOCK_MAGNIFICATION_RANGE],
    [DOCK_ICON_SIZE, DOCK_ICON_SIZE_MAX, DOCK_ICON_SIZE],
  )

  const smoothSize = useSpring(size, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  const handleClick = async () => {
    controls.start({
      y: [0, -20, 0, -10, 0],
      transition: {
        duration: BOUNCE_DURATION,
        times: [0, 0.3, 0.55, 0.75, 1],
        ease: 'easeInOut',
      },
    })

    // App ochish
    openWindow(item.id)
  }

  const Icon = item.icon

  return (
    <motion.div
      ref={ref}
      style={{ width: smoothSize, height: smoothSize }}
      animate={controls}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center cursor-pointer rounded-xl transition-colors duration-200 hover:bg-white/10"
    >
      <AnimatePresence>
        {isHovered && <DockTooltip label={item.label} />}
      </AnimatePresence>
      <Icon size={DOCK_ICON_SIZE * 0.75} />
      {dotCount > 0 && (
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
          {Array.from({ length: dotCount }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-white/90"
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default DockItem
