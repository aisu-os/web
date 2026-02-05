export interface MemoryEntry {
  id: string
  content: string
  category: string
  importance: number
  createdAt: Date
  updatedAt: Date
}

export interface MemorySearchResult {
  entry: MemoryEntry
  similarity: number
}
