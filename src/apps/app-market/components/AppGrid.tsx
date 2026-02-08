import { useAppMarketStore } from '../hooks/use-app-market-store'
import AppCard from './AppCard'

const AppGrid = () => {
  const selectedCategory = useAppMarketStore((s) => s.selectedCategory)
  const getAppsByCategory = useAppMarketStore((s) => s.getAppsByCategory)
  const categories = useAppMarketStore((s) => s.categories)

  const categoryInfo = categories.find((c) => c.id === selectedCategory)
  const apps = selectedCategory ? getAppsByCategory(selectedCategory) : []

  if (!categoryInfo) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/30 text-[13px]">
        Select a category
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{categoryInfo.icon}</span>
        <h2 className="text-[15px] font-semibold text-white/90">
          {categoryInfo.label}
        </h2>
        <span className="text-[11px] text-white/30 ml-2">
          {apps.length} app{apps.length !== 1 ? 's' : ''}
        </span>
      </div>
      {apps.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-white/30 text-[13px]">
          No apps in this category
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '8px',
          }}
        >
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AppGrid
