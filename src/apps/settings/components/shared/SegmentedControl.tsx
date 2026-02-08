import { motion } from 'framer-motion'

import { cn } from '@/lib/cn'

interface SegmentedControlProps {
  options: { value: string; label: string }[]
  selected: string
  onChange: (value: string) => void
  id?: string
}

export default function SegmentedControl({
  options,
  selected,
  onChange,
  id = 'segmented',
}: SegmentedControlProps) {
  return (
    <div className="inline-flex items-center rounded-lg bg-white/[0.06] p-[3px] gap-[2px]">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 py-1.5 text-[12px] rounded-md relative z-10 transition-colors',
            selected === opt.value
              ? 'text-white font-medium'
              : 'text-white/50 hover:text-white/70'
          )}
          style={{ position: 'relative' }}
        >
          {selected === opt.value && (
            <motion.div
              layoutId={`segment-${id}`}
              className="absolute inset-0 bg-white/[0.12] rounded-md"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
