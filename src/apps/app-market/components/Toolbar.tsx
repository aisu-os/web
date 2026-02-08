import { useRef } from 'react'
import { cn } from '@/lib/cn'
import { useAppMarketStore } from '../hooks/use-app-market-store'

const Toolbar = () => {
  const goBack = useAppMarketStore((s) => s.goBack)
  const viewHistory = useAppMarketStore((s) => s.viewHistory)
  const searchQuery = useAppMarketStore((s) => s.searchQuery)
  const setSearchQuery = useAppMarketStore((s) => s.setSearchQuery)
  const clearSearch = useAppMarketStore((s) => s.clearSearch)
  const searchRef = useRef<HTMLInputElement>(null)

  const canGoBack = viewHistory.length > 0

  return (
    <div
      className={cn(
        'flex items-center h-10 px-3 gap-2',
        'border-b border-white/5 shrink-0'
      )}
    >
      {/* Back button */}
      <button
        onClick={goBack}
        disabled={!canGoBack}
        className={cn(
          'p-1.5 rounded-md transition-colors',
          canGoBack
            ? 'text-white/70 hover:text-white hover:bg-white/5'
            : 'text-white/20 cursor-not-allowed'
        )}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M9 3L5 7L9 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex-1" />

      {/* Search */}
      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-md',
          'bg-white/5 border border-transparent',
          'focus-within:border-white/10 focus-within:bg-white/[0.07]',
          'transition-colors'
        )}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="text-white/40 shrink-0"
        >
          <circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M8 8L10.5 10.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <input
          ref={searchRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search apps"
          className="bg-transparent outline-none text-[12px] text-white/80 placeholder:text-white/30 w-36"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 2L8 8M8 2L2 8"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Toolbar
