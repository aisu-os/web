export type ViewMode = 'icon' | 'list' | 'column'

export type SortKey = 'name' | 'dateModified' | 'size' | 'kind'

export type SortDirection = 'asc' | 'desc'

export interface SidebarFavorite {
  label: string
  path: string
  icon: string
}

export interface SidebarTag {
  label: string
  color: string
}
