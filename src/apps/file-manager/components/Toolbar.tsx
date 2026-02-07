import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'
import { useFileManagerStore } from '../hooks/use-file-manager-store'
import { VIEW_MODES, SORT_OPTIONS } from '../file-manager.constants'

const Toolbar = () => {
  const goBack = useFileManagerStore((s) => s.goBack)
  const goForward = useFileManagerStore((s) => s.goForward)
  const historyBack = useFileManagerStore((s) => s.historyBack)
  const historyForward = useFileManagerStore((s) => s.historyForward)
  const viewMode = useFileManagerStore((s) => s.viewMode)
  const setViewMode = useFileManagerStore((s) => s.setViewMode)
  const sortKey = useFileManagerStore((s) => s.sortKey)
  const sortDirection = useFileManagerStore((s) => s.sortDirection)
  const setSortKey = useFileManagerStore((s) => s.setSortKey)
  const searchQuery = useFileManagerStore((s) => s.searchQuery)
  const setSearchQuery = useFileManagerStore((s) => s.setSearchQuery)

  const [isSortOpen, setIsSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const canGoBack = historyBack.length > 0
  const canGoForward = historyForward.length > 0

  return (
    <div
      className={cn(
        'flex items-center h-10 px-3 gap-2',
        'border-b border-white/5 shrink-0'
      )}
    >
      {/* Navigation */}
      <div className="flex items-center gap-0.5">
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
            <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={goForward}
          disabled={!canGoForward}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            canGoForward
              ? 'text-white/70 hover:text-white hover:bg-white/5'
              : 'text-white/20 cursor-not-allowed'
          )}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* View mode toggle */}
      <div className="flex items-center rounded-md bg-white/5 p-0.5">
        {VIEW_MODES.map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={cn(
              'px-2.5 py-1 rounded text-[11px] transition-colors',
              viewMode === mode
                ? 'bg-white/15 text-white'
                : 'text-white/40 hover:text-white/60'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Sort dropdown */}
      <div ref={sortRef} className="relative">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] transition-colors',
            'text-white/50 hover:text-white/70 hover:bg-white/5'
          )}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 3H10M3 6H9M4 9H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Sort
        </button>
        {isSortOpen && (
          <div
            className={cn(
              'absolute right-0 top-full mt-1 z-50',
              'w-40 py-1 rounded-lg',
              'bg-[#2A2A3E]/95 backdrop-blur-xl',
              'border border-white/10 shadow-xl'
            )}
          >
            {SORT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setSortKey(key)
                  setIsSortOpen(false)
                }}
                className={cn(
                  'w-full px-3 py-1.5 text-left text-[12px] transition-colors',
                  'flex items-center justify-between',
                  sortKey === key
                    ? 'text-white bg-white/5'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                {label}
                {sortKey === key && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d={sortDirection === 'asc' ? 'M2 7L5 3L8 7' : 'M2 3L5 7L8 3'}
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-md',
          'bg-white/5 border border-transparent',
          'focus-within:border-white/10 focus-within:bg-white/[0.07]',
          'transition-colors'
        )}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/40 shrink-0">
          <circle cx="5.5" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="bg-transparent outline-none text-[12px] text-white/80 placeholder:text-white/30 w-28"
        />
      </div>
    </div>
  )
}

export default Toolbar
