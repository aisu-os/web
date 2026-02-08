import { cn } from '@/lib/cn'
import { useAppMarketStore } from '../hooks/use-app-market-store'
import type { MarketApp } from '../app-market.types'

interface InstallButtonProps {
  app: MarketApp
  size?: 'xs' | 'sm' | 'lg'
}

const sizeClasses = {
  xs: 'px-3 py-0.5 text-[11px]',
  sm: 'px-3.5 py-1 text-[12px]',
  lg: 'px-5 py-1.5 text-[13px]',
}

const InstallButton = ({ app, size = 'sm' }: InstallButtonProps) => {
  const installApp = useAppMarketStore((s) => s.installApp)
  const uninstallApp = useAppMarketStore((s) => s.uninstallApp)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (app.isInstalled) {
      uninstallApp(app.id)
    } else {
      installApp(app.id)
    }
  }

  const label = app.isInstalled
    ? 'Open'
    : app.price === 'free'
      ? 'Get'
      : app.price

  return (
    <button
      onClick={handleClick}
      className={cn(
        'rounded-full font-medium transition-colors shrink-0',
        sizeClasses[size],
        app.isInstalled
          ? 'border border-white/20 text-white/60 hover:text-white/80 hover:border-white/30'
          : 'bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/80'
      )}
    >
      {label}
    </button>
  )
}

export default InstallButton
