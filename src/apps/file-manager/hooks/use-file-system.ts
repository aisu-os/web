import { useMemo } from 'react'
import type { FileNode } from '@/types'
import { MOCK_FILE_SYSTEM } from '../file-manager.constants'

function buildNodeMap(root: FileNode): Map<string, FileNode> {
  const map = new Map<string, FileNode>()

  function traverse(node: FileNode) {
    map.set(node.path, node)
    if (node.children) {
      for (const child of node.children) {
        traverse(child)
      }
    }
  }

  traverse(root)
  return map
}

export function useFileSystem() {
  const nodeMap = useMemo(() => buildNodeMap(MOCK_FILE_SYSTEM), [])

  const getNode = (path: string): FileNode | null => {
    return nodeMap.get(path) ?? null
  }

  const getChildren = (path: string): FileNode[] => {
    const node = nodeMap.get(path)
    if (!node || node.type !== 'directory') return []
    return node.children ?? []
  }

  const getParentPath = (path: string): string => {
    if (path === '/') return '/'
    const segments = path.split('/')
    segments.pop()
    return segments.join('/') || '/'
  }

  return { getNode, getChildren, getParentPath }
}
