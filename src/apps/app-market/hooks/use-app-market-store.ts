import { createContext, useContext } from 'react'
import { create, useStore } from 'zustand'
import type { StoreApi } from 'zustand'
import type {
  AppCategory,
  MarketView,
  MarketApp,
  FeaturedBanner,
  CategoryInfo,
} from '../app-market.types'
import { MOCK_APPS, FEATURED_BANNERS, CATEGORIES } from '../app-market.constants'

interface AppMarketState {
  currentView: MarketView
  viewHistory: { view: MarketView; category: AppCategory | null; appId: string | null }[]
  selectedCategory: AppCategory | null
  selectedAppId: string | null
  searchQuery: string
  apps: MarketApp[]
  featuredBanners: FeaturedBanner[]
  categories: CategoryInfo[]
  featuredIndex: number
  isSidebarVisible: boolean
}

interface AppMarketActions {
  navigateHome: () => void
  navigateToCategory: (category: AppCategory) => void
  navigateToApp: (appId: string) => void
  goBack: () => void
  setSearchQuery: (query: string) => void
  clearSearch: () => void
  nextFeatured: () => void
  prevFeatured: () => void
  setFeaturedIndex: (index: number) => void
  installApp: (appId: string) => void
  uninstallApp: (appId: string) => void
  toggleSidebar: () => void
  getAppById: (id: string) => MarketApp | undefined
  getAppsByCategory: (category: AppCategory) => MarketApp[]
  getFilteredApps: () => MarketApp[]
  getTopApps: (limit?: number) => MarketApp[]
}

export type AppMarketStore = AppMarketState & AppMarketActions
export type AppMarketStoreApi = StoreApi<AppMarketStore>

export function createAppMarketStore(): AppMarketStoreApi {
  return create<AppMarketStore>((set, get) => ({
    currentView: 'home',
    viewHistory: [],
    selectedCategory: null,
    selectedAppId: null,
    searchQuery: '',
    apps: MOCK_APPS,
    featuredBanners: FEATURED_BANNERS,
    categories: CATEGORIES,
    featuredIndex: 0,
    isSidebarVisible: true,

    navigateHome: () => {
      const { currentView, selectedCategory, selectedAppId } = get()
      if (currentView === 'home') return
      set((s) => ({
        currentView: 'home',
        viewHistory: [
          ...s.viewHistory,
          { view: currentView, category: selectedCategory, appId: selectedAppId },
        ],
        selectedCategory: null,
        selectedAppId: null,
        searchQuery: '',
      }))
    },

    navigateToCategory: (category) => {
      const { currentView, selectedCategory, selectedAppId } = get()
      set((s) => ({
        currentView: 'category',
        viewHistory: [
          ...s.viewHistory,
          { view: currentView, category: selectedCategory, appId: selectedAppId },
        ],
        selectedCategory: category,
        selectedAppId: null,
      }))
    },

    navigateToApp: (appId) => {
      const { currentView, selectedCategory, selectedAppId } = get()
      set((s) => ({
        currentView: 'detail',
        viewHistory: [
          ...s.viewHistory,
          { view: currentView, category: selectedCategory, appId: selectedAppId },
        ],
        selectedAppId: appId,
      }))
    },

    goBack: () => {
      const { viewHistory } = get()
      if (viewHistory.length === 0) return
      const prev = viewHistory[viewHistory.length - 1]
      set((s) => ({
        currentView: prev.view,
        selectedCategory: prev.category,
        selectedAppId: prev.appId,
        viewHistory: s.viewHistory.slice(0, -1),
        ...(prev.view !== 'search' ? { searchQuery: '' } : {}),
      }))
    },

    setSearchQuery: (query) => {
      const { currentView, selectedCategory, selectedAppId } = get()
      if (query.length > 0 && currentView !== 'search') {
        set((s) => ({
          searchQuery: query,
          currentView: 'search',
          viewHistory: [
            ...s.viewHistory,
            { view: currentView, category: selectedCategory, appId: selectedAppId },
          ],
        }))
      } else if (query.length === 0 && currentView === 'search') {
        get().goBack()
      } else {
        set({ searchQuery: query })
      }
    },

    clearSearch: () => {
      const { currentView } = get()
      if (currentView === 'search') {
        set({ searchQuery: '' })
        get().goBack()
      } else {
        set({ searchQuery: '' })
      }
    },

    nextFeatured: () => {
      const { featuredBanners, featuredIndex } = get()
      set({ featuredIndex: (featuredIndex + 1) % featuredBanners.length })
    },

    prevFeatured: () => {
      const { featuredBanners, featuredIndex } = get()
      set({
        featuredIndex:
          (featuredIndex - 1 + featuredBanners.length) % featuredBanners.length,
      })
    },

    setFeaturedIndex: (index) => set({ featuredIndex: index }),

    installApp: (appId) => {
      set((s) => ({
        apps: s.apps.map((app) =>
          app.id === appId ? { ...app, isInstalled: true } : app
        ),
      }))
    },

    uninstallApp: (appId) => {
      set((s) => ({
        apps: s.apps.map((app) =>
          app.id === appId ? { ...app, isInstalled: false } : app
        ),
      }))
    },

    toggleSidebar: () => set((s) => ({ isSidebarVisible: !s.isSidebarVisible })),

    getAppById: (id) => get().apps.find((app) => app.id === id),

    getAppsByCategory: (category) =>
      get().apps.filter((app) => app.category === category),

    getFilteredApps: () => {
      const { searchQuery, apps } = get()
      if (!searchQuery) return apps
      const q = searchQuery.toLowerCase()
      return apps.filter(
        (app) =>
          app.name.toLowerCase().includes(q) ||
          app.developer.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          app.tags.some((tag) => tag.includes(q))
      )
    },

    getTopApps: (limit = 6) =>
      [...get().apps].sort((a, b) => b.rating - a.rating).slice(0, limit),
  }))
}

export const AppMarketStoreContext = createContext<AppMarketStoreApi | null>(null)

export function useAppMarketStore<T>(
  selector: (state: AppMarketStore) => T
): T {
  const store = useContext(AppMarketStoreContext)
  if (!store) throw new Error('useAppMarketStore must be used within AppMarketStoreContext')
  return useStore(store, selector)
}
