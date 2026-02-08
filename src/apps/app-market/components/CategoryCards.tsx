import { cn } from '@/lib/cn'
import { useAppMarketStore } from '../hooks/use-app-market-store'

const CategoryCards = () => {
  const categories = useAppMarketStore((s) => s.categories)
  const navigateToCategory = useAppMarketStore((s) => s.navigateToCategory)

  return (
    <div className="px-4 mt-6">
      <h3 className="text-[13px] font-semibold text-white/60 uppercase tracking-wider mb-3">
        Categories
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigateToCategory(cat.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2.5 rounded-xl',
              'bg-white/[0.03] border border-white/5',
              'hover:bg-white/[0.06] hover:border-white/10',
              'transition-colors'
            )}
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="text-[12px] text-white/70 truncate">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryCards
