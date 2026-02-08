import { cn } from '@/lib/cn'

interface RatingStarsProps {
  rating: number
  size?: 'xs' | 'sm' | 'md'
  showNumber?: boolean
}

const sizeMap = {
  xs: 10,
  sm: 12,
  md: 14,
}

const Star = ({
  fill,
  pixelSize,
}: {
  fill: 'full' | 'half' | 'empty'
  pixelSize: number
}) => {
  const id = `star-${fill}-${pixelSize}-${Math.random().toString(36).slice(2, 6)}`
  return (
    <svg width={pixelSize} height={pixelSize} viewBox="0 0 16 16" fill="none">
      {fill === 'half' && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M8 1.5L9.8 5.2L14 5.8L11 8.7L11.7 12.8L8 10.9L4.3 12.8L5 8.7L2 5.8L6.2 5.2L8 1.5Z"
        fill={
          fill === 'full'
            ? '#0EA5E9'
            : fill === 'half'
              ? `url(#${id})`
              : 'none'
        }
        stroke={fill === 'empty' ? 'rgba(255,255,255,0.2)' : '#0EA5E9'}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const RatingStars = ({ rating, size = 'sm', showNumber = false }: RatingStarsProps) => {
  const pixelSize = sizeMap[size]
  const stars: ('full' | 'half' | 'empty')[] = []

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push('full')
    } else if (rating >= i - 0.5) {
      stars.push('half')
    } else {
      stars.push('empty')
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((fill, i) => (
        <Star key={i} fill={fill} pixelSize={pixelSize} />
      ))}
      {showNumber && (
        <span
          className={cn(
            'ml-1 text-white/40',
            size === 'xs' && 'text-[10px]',
            size === 'sm' && 'text-[11px]',
            size === 'md' && 'text-[12px]'
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default RatingStars
