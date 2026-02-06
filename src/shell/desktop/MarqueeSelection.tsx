import { cn } from '@/lib/cn'
import type { MarqueeRect } from '@/types'

interface MarqueeSelectionProps {
  rect: MarqueeRect | null
}

const MarqueeSelection = ({ rect }: MarqueeSelectionProps) => {
  if (!rect || rect.width < 2 || rect.height < 2) return null

  return (
    <div
      className={cn(
        'absolute pointer-events-none z-[100]',
        'border border-blue-400/60',
        'bg-blue-400/15',
        'rounded-[1px]',
      )}
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      }}
    />
  )
}

export default MarqueeSelection
