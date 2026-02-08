import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import {
  createAppMarketStore,
  AppMarketStoreContext,
  useAppMarketStore,
} from './hooks/use-app-market-store'
import Toolbar from './components/Toolbar'
import CategorySidebar from './components/CategorySidebar'
import HeroSection from './components/HeroSection'
import CategoryCards from './components/CategoryCards'
import TopCharts from './components/TopCharts'
import AppGrid from './components/AppGrid'
import AppDetail from './components/AppDetail'
import SearchResults from './components/SearchResults'

const HomePage = () => (
  <div className="flex-1 overflow-y-auto">
    <HeroSection />
    <CategoryCards />
    <TopCharts />
    <div className="h-6" />
  </div>
)

const ContentRouter = () => {
  const currentView = useAppMarketStore((s) => s.currentView)
  const selectedCategory = useAppMarketStore((s) => s.selectedCategory)
  const selectedAppId = useAppMarketStore((s) => s.selectedAppId)

  const key = `${currentView}-${selectedCategory}-${selectedAppId}`

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.15 }}
        className="flex-1 overflow-hidden flex flex-col"
      >
        {currentView === 'home' && <HomePage />}
        {currentView === 'category' && <AppGrid />}
        {currentView === 'detail' && <AppDetail />}
        {currentView === 'search' && <SearchResults />}
      </motion.div>
    </AnimatePresence>
  )
}

const AppMarketInner = () => {
  const isSidebarVisible = useAppMarketStore((s) => s.isSidebarVisible)

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full',
        'bg-[#1E1E2E] text-white',
        'rounded-b-lg overflow-hidden select-none'
      )}
    >
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        {isSidebarVisible && <CategorySidebar />}
        <ContentRouter />
      </div>
    </div>
  )
}

const AppMarket = () => {
  const store = useMemo(() => createAppMarketStore(), [])

  return (
    <AppMarketStoreContext.Provider value={store}>
      <AppMarketInner />
    </AppMarketStoreContext.Provider>
  )
}

export default AppMarket
