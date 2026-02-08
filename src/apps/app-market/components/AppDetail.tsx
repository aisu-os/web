import { cn } from '@/lib/cn'
import { useAppMarketStore } from '../hooks/use-app-market-store'
import RatingStars from './RatingStars'
import InstallButton from './InstallButton'
import AppScreenshots from './AppScreenshots'
import AppReviews from './AppReviews'

const InfoCell = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
    <p className="text-[13px] text-white/70 mt-0.5">{value}</p>
  </div>
)

const AppDetail = () => {
  const selectedAppId = useAppMarketStore((s) => s.selectedAppId)
  const getAppById = useAppMarketStore((s) => s.getAppById)
  const categories = useAppMarketStore((s) => s.categories)

  const app = selectedAppId ? getAppById(selectedAppId) : undefined

  if (!app) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/30 text-[13px]">
        App not found
      </div>
    )
  }

  const categoryLabel = categories.find((c) => c.id === app.category)?.label ?? app.category

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="flex items-start gap-4 p-5">
        <div
          style={{ width: '80px', height: '80px', flexShrink: 0 }}
          className={cn(
            'rounded-2xl flex items-center justify-center text-5xl',
            'bg-white/[0.05] border border-white/5'
          )}
        >
          {app.icon}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h1 className="text-[18px] font-bold text-white/90">{app.name}</h1>
          <p className="text-[13px] text-white/40 mt-0.5">{app.developer}</p>
          <div className="flex items-center gap-3 mt-2">
            <RatingStars rating={app.rating} size="sm" showNumber />
            <span className="text-[11px] text-white/30">
              {app.ratingCount.toLocaleString()} ratings
            </span>
          </div>
        </div>
        <div className="pt-1">
          <InstallButton app={app} size="lg" />
        </div>
      </div>

      {/* Screenshots */}
      <AppScreenshots screenshots={app.screenshots} />

      {/* Description */}
      <div className="px-5 py-4 border-t border-white/5">
        <h3 className="text-[13px] font-semibold text-white/70 mb-2">Description</h3>
        <p className="text-[12px] text-white/50 leading-relaxed">
          {app.longDescription}
        </p>
      </div>

      {/* Info grid */}
      <div
        className="px-5 py-4 border-t border-white/5"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}
      >
        <InfoCell label="Version" value={app.version} />
        <InfoCell label="Size" value={app.size} />
        <InfoCell label="Category" value={categoryLabel} />
        <InfoCell label="Price" value={app.price === 'free' ? 'Free' : app.price} />
      </div>

      {/* Reviews */}
      <AppReviews reviews={app.reviews} />

      <div className="h-4" />
    </div>
  )
}

export default AppDetail
