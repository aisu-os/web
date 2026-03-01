import { useCallback } from 'react'
import { useFileSystemStore } from '@/stores/use-file-system-store'

export function useFileSystem() {
  // Subscribe to nodeMap — component re-renders when it changes
  const nodeMap = useFileSystemStore((s) => s.nodeMap)

  const getNode = useCallback(
    (path: string) => nodeMap.get(path) ?? null,
    [nodeMap]
  )

  const getChildren = useCallback(
    (path: string) => {
      const node = nodeMap.get(path)
      if (!node || node.type !== 'directory') return []
      return node.children ?? []
    },
    [nodeMap]
  )

  const getParentPath = useCallback(
    (path: string) => {
      if (path === '/') return '/'
      const segments = path.split('/')
      segments.pop()
      return segments.join('/') || '/'
    },
    []
  )

  return { getNode, getChildren, getParentPath }
}
