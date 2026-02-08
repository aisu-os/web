export type AppCategory =
  | 'productivity'
  | 'utilities'
  | 'entertainment'
  | 'developer-tools'
  | 'design'
  | 'education'
  | 'social'
  | 'music'

export type MarketView = 'home' | 'category' | 'detail' | 'search'

export interface MarketAppScreenshot {
  id: string
  url: string
  caption?: string
}

export interface MarketAppReview {
  id: string
  author: string
  rating: number
  date: string
  content: string
}

export interface MarketApp {
  id: string
  name: string
  developer: string
  icon: string
  category: AppCategory
  rating: number
  ratingCount: number
  description: string
  longDescription: string
  version: string
  size: string
  screenshots: MarketAppScreenshot[]
  reviews: MarketAppReview[]
  isFeatured?: boolean
  isInstalled: boolean
  price: 'free' | string
  tags: string[]
  updatedAt: string
}

export interface FeaturedBanner {
  id: string
  appId: string
  title: string
  subtitle: string
  gradient: string
}

export interface CategoryInfo {
  id: AppCategory
  label: string
  icon: string
  description: string
  color: string
}
