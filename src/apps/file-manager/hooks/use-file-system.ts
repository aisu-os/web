import { useFileSystemStore } from '@/stores/use-file-system-store'

export function useFileSystem() {
  const getNode = useFileSystemStore((s) => s.getNode)
  const getChildren = useFileSystemStore((s) => s.getChildren)
  const getParentPath = useFileSystemStore((s) => s.getParentPath)

  return { getNode, getChildren, getParentPath }
}
