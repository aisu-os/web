import { create } from 'zustand'
import type { FileNode, FileType } from '@/types'
import { MOCK_FILE_SYSTEM } from '@/apps/file-manager/file-manager.constants'

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

interface FileSystemState {
  root: FileNode
  nodeMap: Map<string, FileNode>
}

interface FileSystemActions {
  getNode: (path: string) => FileNode | null
  getChildren: (path: string) => FileNode[]
  getParentPath: (path: string) => string
  createNode: (parentPath: string, name: string, type: FileType) => FileNode | null
  renameNode: (path: string, newName: string) => FileNode | null
  deleteNode: (path: string) => boolean
  generateUniqueName: (parentPath: string, baseName: string) => string
}

const initialRoot = deepClone(MOCK_FILE_SYSTEM)

export const useFileSystemStore = create<FileSystemState & FileSystemActions>((set, get) => ({
  root: initialRoot,
  nodeMap: buildNodeMap(initialRoot),

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

    return true
  },
}))
