import { create } from 'zustand'
import type { FileNode, FileType } from '@/types'
import { MOCK_FILE_SYSTEM } from '@/apps/file-manager/file-manager.constants'
import * as fsApi from '@/services/api/fs-service'

function deepClone(node: FileNode): FileNode {
  return {
    ...node,
    children: node.children?.map(deepClone),
    createdAt: node.createdAt ? new Date(node.createdAt) : undefined,
    updatedAt: node.updatedAt ? new Date(node.updatedAt) : undefined,
  }
}

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

function updateTree(
  root: FileNode,
  targetPath: string,
  updater: (node: FileNode) => FileNode
): FileNode {
  if (root.path === targetPath) return updater({ ...root, children: root.children ? [...root.children] : undefined })

  if (!root.children) return root

  const needsUpdate = root.children.some(
    (child) => targetPath === child.path || targetPath.startsWith(child.path + '/')
  )
  if (!needsUpdate) return root

  return {
    ...root,
    children: root.children.map((child) => {
      if (targetPath === child.path || targetPath.startsWith(child.path + '/')) {
        return updateTree(child, targetPath, updater)
      }
      return child
    }),
  }
}

function updateDescendantPaths(node: FileNode, oldPath: string, newPath: string): FileNode {
  const updatedNode: FileNode = {
    ...node,
    path: node.path === oldPath ? newPath : node.path.replace(oldPath + '/', newPath + '/'),
  }
  if (node.children) {
    updatedNode.children = node.children.map((child) =>
      updateDescendantPaths(child, oldPath, newPath)
    )
  }
  return updatedNode
}

const emptyRoot: FileNode = {
  name: '/',
  path: '/',
  type: 'directory',
  children: [],
}

const isDesktopChild = (p: string) => p.startsWith('/Desktop/') && p.split('/').length === 3

function syncDesktopAfterChange(affectedPath: string, action: 'add' | 'remove' | 'rename', oldPath?: string) {
  import('@/stores/use-desktop-store').then(({ useDesktopStore }) => {
    const desktop = useDesktopStore.getState()

    if (action === 'add' && isDesktopChild(affectedPath)) {
      if (!desktop.getItemByFsPath(affectedPath)) {
        desktop.addItemFromFileSystem(affectedPath, desktop.getFreePosition())
      }
    }

    if (action === 'remove' && isDesktopChild(affectedPath)) {
      desktop.removeItemByFsPath(affectedPath)
    }

    if (action === 'rename' && oldPath) {
      if (isDesktopChild(oldPath) && isDesktopChild(affectedPath)) {
        const item = desktop.getItemByFsPath(oldPath)
        if (item) {
          const newName = affectedPath.split('/').pop()!
          desktop.renameItem(item.id, newName)
          desktop.updateItemFsPath(item.id, affectedPath)
        }
      } else if (isDesktopChild(oldPath)) {
        desktop.removeItemByFsPath(oldPath)
      } else if (isDesktopChild(affectedPath)) {
        if (!desktop.getItemByFsPath(affectedPath)) {
          desktop.addItemFromFileSystem(affectedPath, desktop.getFreePosition())
        }
      }
    }
  })
}

interface FileSystemState {
  root: FileNode
  nodeMap: Map<string, FileNode>
  isLoaded: boolean
  isLoading: boolean
  syncError: string | null
  trashItems: FileNode[]
  isTrashLoading: boolean
}

interface FileSystemActions {
  getNode: (path: string) => FileNode | null
  getChildren: (path: string) => FileNode[]
  getParentPath: (path: string) => string
  createNode: (parentPath: string, name: string, type: FileType) => FileNode | null
  renameNode: (path: string, newName: string) => FileNode | null
  deleteNode: (path: string) => boolean
  permanentDelete: (path: string) => boolean
  generateUniqueName: (parentPath: string, baseName: string) => string
  moveNode: (sourcePath: string, destParentPath: string) => { oldPath: string; newPath: string } | null
  copyNode: (sourcePath: string, destParentPath: string) => { oldPath: string; newPath: string } | null
  loadTree: () => Promise<void>
  fetchTrash: () => Promise<void>
  restoreFromTrash: (path: string) => Promise<void>
  emptyTrash: () => Promise<void>
  resetStore: () => void
}

export const useFileSystemStore = create<FileSystemState & FileSystemActions>((set, get) => ({
  root: emptyRoot,
  nodeMap: buildNodeMap(emptyRoot),
  isLoaded: false,
  isLoading: false,
  syncError: null,
  trashItems: [],
  isTrashLoading: false,

  loadTree: async () => {
    set({ isLoading: true, syncError: null })
    try {
      const tree = await fsApi.fetchFileTree()
      const nodeMap = buildNodeMap(tree)
      set({ root: tree, nodeMap, isLoaded: true, isLoading: false })
    } catch {
      // Fallback to mock data
      const fallback = deepClone(MOCK_FILE_SYSTEM)
      const nodeMap = buildNodeMap(fallback)
      set({
        root: fallback,
        nodeMap,
        isLoaded: true,
        isLoading: false,
        syncError: 'Failed to load file system from server',
      })
    }
    // Desktop itemlarni file system dan yuklash
    const { useDesktopStore } = await import('@/stores/use-desktop-store')
    useDesktopStore.getState().loadDesktopItems()
  },

  resetStore: () => {
    set({
      root: emptyRoot,
      nodeMap: buildNodeMap(emptyRoot),
      isLoaded: false,
      isLoading: false,
      syncError: null,
      trashItems: [],
      isTrashLoading: false,
    })
  },

  getNode: (path) => {
    return get().nodeMap.get(path) ?? null
  },

  getChildren: (path) => {
    const node = get().nodeMap.get(path)
    if (!node || node.type !== 'directory') return []
    return node.children ?? []
  },

  getParentPath: (path) => {
    if (path === '/') return '/'
    const segments = path.split('/')
    segments.pop()
    return segments.join('/') || '/'
  },

  generateUniqueName: (parentPath, baseName) => {
    const parent = get().nodeMap.get(parentPath)
    if (!parent || !parent.children) return baseName

    const existingNames = new Set(parent.children.map((c) => c.name.toLowerCase()))

    if (!existingNames.has(baseName.toLowerCase())) return baseName

    let counter = 2
    while (existingNames.has(`${baseName} ${counter}`.toLowerCase())) {
      counter++
    }
    return `${baseName} ${counter}`
  },

  createNode: (parentPath, name, type) => {
    const { root } = get()
    const parent = get().nodeMap.get(parentPath)
    if (!parent || parent.type !== 'directory') return null

    const newPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`
    const now = new Date()

    const newNode: FileNode = {
      name,
      path: newPath,
      type,
      size: type === 'file' ? 0 : undefined,
      children: type === 'directory' ? [] : undefined,
      createdAt: now,
      updatedAt: now,
    }

    const newRoot = updateTree(root, parentPath, (node) => ({
      ...node,
      children: [...(node.children ?? []), newNode],
      updatedAt: now,
    }))

    const newNodeMap = buildNodeMap(newRoot)
    set({ root: newRoot, nodeMap: newNodeMap })

    // Background API sync
    fsApi.createNode(parentPath, name, type).catch(() => {
      get().deleteNode(newPath)
      set({ syncError: `Failed to create ${name}` })
    })

    syncDesktopAfterChange(newPath, 'add')

    return newNodeMap.get(newPath) ?? null
  },

  renameNode: (path, newName) => {
    if (path === '/') return null
    const { root } = get()
    const node = get().nodeMap.get(path)
    if (!node) return null

    const parentPath = get().getParentPath(path)
    const parent = get().nodeMap.get(parentPath)
    if (!parent) return null

    // Agar nom o'zgarmagan bo'lsa
    if (node.name === newName) return node

    // Nom unikal ekanligini tekshirish
    const siblings = parent.children?.filter((c) => c.path !== path) ?? []
    if (siblings.some((c) => c.name.toLowerCase() === newName.toLowerCase())) return null

    const newPath = parentPath === '/' ? `/${newName}` : `${parentPath}/${newName}`
    const now = new Date()

    const newRoot = updateTree(root, parentPath, (parentNode) => ({
      ...parentNode,
      children: parentNode.children?.map((child) => {
        if (child.path !== path) return child
        const renamed = updateDescendantPaths(child, path, newPath)
        return { ...renamed, name: newName, updatedAt: now }
      }),
    }))

    const newNodeMap = buildNodeMap(newRoot)
    set({ root: newRoot, nodeMap: newNodeMap })

    // Background API sync
    fsApi.renameNode(path, newName).catch(() => {
      set({ syncError: `Failed to rename ${path}` })
    })

    syncDesktopAfterChange(newPath, 'rename', path)

    return newNodeMap.get(newPath) ?? null
  },

  deleteNode: (path) => {
    if (path === '/') return false
    const { root } = get()
    const parentPath = get().getParentPath(path)

    const newRoot = updateTree(root, parentPath, (parentNode) => ({
      ...parentNode,
      children: parentNode.children?.filter((child) => child.path !== path),
    }))

    const newNodeMap = buildNodeMap(newRoot)
    set({ root: newRoot, nodeMap: newNodeMap })

    syncDesktopAfterChange(path, 'remove')

    // Background API sync
    fsApi.deleteNode(path).then(() => {
      // Agar trash oldin yuklangan bo'lsa, yangilash
      if (get().trashItems.length > 0) {
        get().fetchTrash()
      }
    }).catch(() => {
      set({ syncError: `Failed to delete ${path}` })
    })

    return true
  },

  permanentDelete: (path) => {
    // trashItems dan optimistik olib tashlash
    set({ trashItems: get().trashItems.filter((item) => item.path !== path) })

    fsApi.deleteNode(path, true).catch(() => {
      set({ syncError: `Failed to permanently delete ${path}` })
      get().fetchTrash()
    })

    return true
  },

  moveNode: (sourcePath, destParentPath) => {
    if (sourcePath === '/') return null
    const { root } = get()
    const node = get().nodeMap.get(sourcePath)
    if (!node) return null

    const destParent = get().nodeMap.get(destParentPath)
    if (!destParent || destParent.type !== 'directory') return null

    // O'ziga yoki o'z bolasiga ko'chirish mumkin emas
    if (destParentPath === sourcePath || destParentPath.startsWith(sourcePath + '/')) return null

    // Bir xil joyga ko'chirish — no-op
    const sourceParentPath = get().getParentPath(sourcePath)
    if (sourceParentPath === destParentPath) return null

    // Nom takrorlanishini tekshirish
    const finalName = get().generateUniqueName(destParentPath, node.name)
    const newPath = destParentPath === '/' ? `/${finalName}` : `${destParentPath}/${finalName}`
    const now = new Date()

    // 1. Eski joydan olib tashlash
    let newRoot = updateTree(root, sourceParentPath, (parentNode) => ({
      ...parentNode,
      children: parentNode.children?.filter((child) => child.path !== sourcePath),
      updatedAt: now,
    }))

    // 2. Yo'llarni yangilash
    const movedNode = updateDescendantPaths(node, sourcePath, newPath)
    const finalNode = { ...movedNode, name: finalName, updatedAt: now }

    // 3. Yangi joyga qo'shish
    newRoot = updateTree(newRoot, destParentPath, (parentNode) => ({
      ...parentNode,
      children: [...(parentNode.children ?? []), finalNode],
      updatedAt: now,
    }))

    const newNodeMap = buildNodeMap(newRoot)
    set({ root: newRoot, nodeMap: newNodeMap })

    // Background API sync
    fsApi.moveNode(sourcePath, destParentPath).catch(() => {
      set({ syncError: `Failed to move ${sourcePath}` })
    })

    syncDesktopAfterChange(sourcePath, 'remove')
    syncDesktopAfterChange(newPath, 'add')

    return { oldPath: sourcePath, newPath }
  },

  copyNode: (sourcePath, destParentPath) => {
    if (sourcePath === '/') return null
    const { root } = get()
    const node = get().nodeMap.get(sourcePath)
    if (!node) return null

    const destParent = get().nodeMap.get(destParentPath)
    if (!destParent || destParent.type !== 'directory') return null

    const finalName = get().generateUniqueName(destParentPath, node.name)
    const newPath = destParentPath === '/' ? `/${finalName}` : `${destParentPath}/${finalName}`
    const now = new Date()

    // Deep copy bilan yangi node yaratish
    const copiedNode = deepClone(node)
    const movedNode = updateDescendantPaths(copiedNode, sourcePath, newPath)
    const finalNode = { ...movedNode, name: finalName, updatedAt: now, createdAt: now }

    // Yangi joyga qo'shish
    const newRoot = updateTree(root, destParentPath, (parentNode) => ({
      ...parentNode,
      children: [...(parentNode.children ?? []), finalNode],
      updatedAt: now,
    }))

    const newNodeMap = buildNodeMap(newRoot)
    set({ root: newRoot, nodeMap: newNodeMap })

    // Background API sync
    fsApi.copyNode(sourcePath, destParentPath).catch(() => {
      set({ syncError: `Failed to copy ${sourcePath}` })
    })

    syncDesktopAfterChange(newPath, 'add')

    return { oldPath: sourcePath, newPath }
  },

  fetchTrash: async () => {
    set({ isTrashLoading: true })
    try {
      const items = await fsApi.fetchTrash()
      set({ trashItems: items, isTrashLoading: false })
    } catch {
      set({ isTrashLoading: false, syncError: 'Failed to load trash' })
    }
  },

  restoreFromTrash: async (path) => {
    // Optimistik: trashItems dan olib tashlash
    const prev = get().trashItems
    set({ trashItems: prev.filter((item) => item.path !== path) })

    try {
      await fsApi.restoreNode(path)
      // Tree ni yangilash
      await get().loadTree()
    } catch {
      set({ trashItems: prev, syncError: `Failed to restore ${path}` })
    }
  },

  emptyTrash: async () => {
    const prev = get().trashItems
    set({ trashItems: [] })

    try {
      await fsApi.emptyTrash()
    } catch {
      set({ trashItems: prev, syncError: 'Failed to empty trash' })
    }
  },
}))
