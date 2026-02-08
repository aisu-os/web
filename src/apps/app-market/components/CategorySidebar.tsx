import { cn } from '@/lib/cn'
import { useAppMarketStore } from '../hooks/use-app-market-store'

const CategorySidebar = () => {
  const categories = useAppMarketStore((s) => s.categories)
  const selectedCategory = useAppMarketStore((s) => s.selectedCategory)
  const currentView = useAppMarketStore((s) => s.currentView)
  const navigateToCategory = useAppMarketStore((s) => s.navigateToCategory)
  const navigateHome = useAppMarketStore((s) => s.navigateHome)

  return (
    <div
      className={cn(
        'w-[180px] shrink-0 overflow-y-auto',
        'bg-white/[0.03] backdrop-blur-xl',
        'border-r border-white/5',
        'py-2 px-2 flex flex-col gap-1'
      )}
    >
      {/* Discover */}
      <button
        onClick={navigateHome}
        className={cn(
          'flex items-center gap-2 w-full px-3 py-[5px] rounded-md text-[13px]',
          currentView === 'home'
            ? 'bg-white/10 text-white'
            : 'text-white/50 hover:bg-white/5 hover:text-white/70 transition-colors'
        )}
      >
        <span>🏠</span>
        <span className="truncate">Discover</span>
      </button>

      {/* Categories */}
      <div className="mt-3 mb-1">
        <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Categories
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigateToCategory(cat.id)}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-[5px] rounded-md text-[13px]',
              selectedCategory === cat.id
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:bg-white/5 hover:text-white/70 transition-colors'
            )}
          >
            <span>{cat.icon}</span>
            <span className="truncate">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategorySidebar
