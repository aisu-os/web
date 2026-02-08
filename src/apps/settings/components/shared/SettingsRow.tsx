import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SettingsRowProps {
  label: string
  description?: string
  children?: ReactNode
}

export default function SettingsRow({
  label,
  description,
  children,
}: SettingsRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-white/[0.06] px-4 py-3',
        'last:border-b-0'
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[13px] text-white/80">{label}</div>
        {description && (
          <div className="mt-0.5 text-[11px] text-white/40">{description}</div>
        )}
      </div>

      {children && (
        <div className="ml-3 flex-shrink-0">{children}</div>
      )}
    </div>
  )
}
