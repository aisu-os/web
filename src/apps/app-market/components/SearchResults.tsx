import { useAppMarketStore } from '../hooks/use-app-market-store'
import AppCard from './AppCard'

const SearchResults = () => {
  const searchQuery = useAppMarketStore((s) => s.searchQuery)
  const getFilteredApps = useAppMarketStore((s) => s.getFilteredApps)

  const filteredApps = getFilteredApps()

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <p className="text-[11px] text-white/30 mb-3">
        {filteredApps.length} result{filteredApps.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
      </p>
      {filteredApps.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-white/30 text-[13px]">
          No apps match your search
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '8px',
          }}
        >
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResults
