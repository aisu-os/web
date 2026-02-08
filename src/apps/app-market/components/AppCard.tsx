import { cn } from '@/lib/cn'
import { useAppMarketStore } from '../hooks/use-app-market-store'
import type { MarketApp } from '../app-market.types'
import RatingStars from './RatingStars'
import InstallButton from './InstallButton'

interface AppCardProps {
  app: MarketApp
  compact?: boolean
  rank?: number
}

const AppCard = ({ app, compact = false, rank }: AppCardProps) => {
  const navigateToApp = useAppMarketStore((s) => s.navigateToApp)

  if (compact) {
    return (
      <button
        onClick={() => navigateToApp(app.id)}
        className={cn(
          'flex items-center gap-3 p-2 rounded-lg w-full text-left',
          'hover:bg-white/5 transition-colors'
        )}
      >
        {rank != null && (
          <span className="text-[14px] font-medium text-white/30 w-5 text-center shrink-0">
            {rank}
          </span>
        )}
        <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/5 flex items-center justify-center text-xl shrink-0">
          {app.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-white/80 truncate">{app.name}</p>
          <p className="text-[11px] text-white/40 truncate">{app.developer}</p>
        </div>
        <InstallButton app={app} size="xs" />
      </button>
    )
  }

  return (
    <button
      onClick={() => navigateToApp(app.id)}
      className={cn(
        'flex flex-col items-center gap-1.5 p-3 rounded-xl w-full',
        'hover:bg-white/[0.04] transition-colors group text-center'
      )}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-xl flex items-center justify-center text-3xl',
          'bg-white/[0.05] border border-white/5',
          'group-hover:border-white/10 transition-colors'
        )}
      >
        {app.icon}
      </div>
      <p className="text-[12px] text-white/80 truncate w-full">{app.name}</p>
      <RatingStars rating={app.rating} size="xs" />
      <InstallButton app={app} size="xs" />
    </button>
  )
}

export default AppCard
