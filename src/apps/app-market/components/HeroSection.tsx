import { useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useAppMarketStore } from '../hooks/use-app-market-store'

const HeroSection = () => {
  const featuredBanners = useAppMarketStore((s) => s.featuredBanners)
  const featuredIndex = useAppMarketStore((s) => s.featuredIndex)
  const nextFeatured = useAppMarketStore((s) => s.nextFeatured)
  const prevFeatured = useAppMarketStore((s) => s.prevFeatured)
  const setFeaturedIndex = useAppMarketStore((s) => s.setFeaturedIndex)
  const navigateToApp = useAppMarketStore((s) => s.navigateToApp)

  const banner = featuredBanners[featuredIndex]

  const advance = useCallback(() => {
    nextFeatured()
  }, [nextFeatured])

  useEffect(() => {
    const timer = setInterval(advance, 5000)
    return () => clearInterval(timer)
  }, [advance])

  if (!banner) return null

  return (
    <div className="relative mx-4 mt-4 rounded-xl overflow-hidden h-[180px] shrink-0 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full flex items-end p-6"
          style={{ background: banner.gradient }}
        >
          <div>
            <h2 className="text-[20px] font-bold text-white drop-shadow-md">
              {banner.title}
            </h2>
            <p className="text-[13px] text-white/70 mt-1 drop-shadow-sm">
              {banner.subtitle}
            </p>
            <button
              onClick={() => navigateToApp(banner.appId)}
              className={cn(
                'mt-3 px-4 py-1.5 rounded-full text-[12px] font-medium',
                'bg-white/20 backdrop-blur-sm text-white',
                'hover:bg-white/30 transition-colors'
              )}
            >
              View App
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          prevFeatured()
        }}
        className={cn(
          'absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full',
          'bg-black/30 backdrop-blur-sm text-white/60 hover:text-white',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        )}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          nextFeatured()
        }}
        className={cn(
          'absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full',
          'bg-black/30 backdrop-blur-sm text-white/60 hover:text-white',
          'opacity-0 group-hover:opacity-100 transition-opacity'
        )}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {featuredBanners.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation()
              setFeaturedIndex(i)
            }}
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-colors',
              i === featuredIndex ? 'bg-white' : 'bg-white/40'
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSection
