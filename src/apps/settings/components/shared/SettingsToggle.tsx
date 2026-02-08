import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface SettingsToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  accentColor?: string
}

export default function SettingsToggle({
  checked,
  onChange,
  disabled = false,
  accentColor,
}: SettingsToggleProps) {
  const activeColor = accentColor ?? '#34C759'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-[26px] w-[44px] flex-shrink-0 rounded-full transition-colors duration-200',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )}
      style={{
        backgroundColor: checked ? activeColor : 'rgba(255, 255, 255, 0.15)',
      }}
    >
      <motion.div
        className="absolute top-[2px] left-[2px] h-[22px] w-[22px] rounded-full bg-white shadow-sm shadow-black/20"
        animate={{ x: checked ? 18 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}
