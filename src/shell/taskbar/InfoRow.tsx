import { cn } from '@/lib/cn'

const InfoRow = ({
  label,
  value,
  valueColor = 'text-white/70',
}: {
  label: string
  value: string
  valueColor?: string
}) => (
  <div className="flex items-center justify-between">
    <span className="text-[12px] text-white/50">{label}</span>
    <span className={cn('text-[12px]', valueColor)}>{value}</span>
  </div>
)

export default InfoRow
