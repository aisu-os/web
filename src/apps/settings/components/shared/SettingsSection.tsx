import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SettingsSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export default function SettingsSection({
  title,
  description,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h3 className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wider text-white/40">
          {title}
        </h3>
      )}

      {description && (
        <p className="mb-2 px-1 text-[11px] text-white/30">{description}</p>
      )}

      <div className="overflow-hidden rounded-xl bg-white/[0.04]">
        {children}
      </div>
    </div>
  )
}
