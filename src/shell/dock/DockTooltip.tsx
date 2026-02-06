import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface DockTooltipProps {
  label: string
}

const DockTooltip = ({ label }: DockTooltipProps) => (
  <motion.div
    className={cn(
      'absolute -top-10 left-1/2 -translate-x-1/2',
      'px-3 py-1 rounded-md',
      'bg-black/70 backdrop-blur-md',
      'text-white text-xs font-medium whitespace-nowrap',
      'pointer-events-none',
      'border border-white/10',
      'shadow-lg shadow-black/20',
    )}
    initial={{ opacity: 0, y: 4, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 4, scale: 0.9 }}
    transition={{ duration: 0.15 }}
  >
    {label}
  </motion.div>
)

export default DockTooltip
