import { useMemo, useRef } from 'react'
import { cn } from '@/lib/cn'
import { useFileManagerStore } from '../hooks/use-file-manager-store'
import { useFileSystem } from '../hooks/use-file-system'
import { sortFileNodes } from '../file-manager.utils'
import { useDropTarget } from '@/hooks/use-drop-target'
import { useWindowId } from '../hooks/use-window-id'
import IconView from './IconView'
import ListView from './ListView'
import ColumnView from './ColumnView'

const ContentArea = () => {
  const contentRef = useRef<HTMLDivElement>(null)
  const currentPath = useFileManagerStore((s) => s.currentPath)
  const viewMode = useFileManagerStore((s) => s.viewMode)
  const sortKey = useFileManagerStore((s) => s.sortKey)
  const sortDirection = useFileManagerStore((s) => s.sortDirection)
  const searchQuery = useFileManagerStore((s) => s.searchQuery)
  const clearSelection = useFileManagerStore((s) => s.clearSelection)
  const openContextMenu = useFileManagerStore((s) => s.openContextMenu)
  const { getChildren } = useFileSystem()
  const windowId = useWindowId()

  const currentChildren = getChildren(currentPath)

  const filteredItems = useMemo(() => {
    let items = currentChildren
    if (searchQuery) {
      items = items.filter((n) =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return sortFileNodes(items, sortKey, sortDirection)
  }, [currentChildren, searchQuery, sortKey, sortDirection])

  const dropTarget = useDropTarget({
    target: { type: 'file-manager-content', windowId, path: currentPath },
    elementRef: contentRef,
    accepts: (source, items) => {
      if (source.type === 'file-manager' && source.windowId === windowId) {
        const allInSameFolder = items.every((i) => {
          const parent = i.path.substring(0, i.path.lastIndexOf('/')) || '/'
          return parent === currentPath
        })
        if (allInSameFolder) return false
      }
      return true
    },
  })

  const handleBackgroundClick = () => {
    clearSelection()
  }

  const handleBackgroundContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    clearSelection()
    openContextMenu(e.clientX, e.clientY)
  }

  const isDropOver = dropTarget.isOver && dropTarget.canDrop

  return (
    <div
      ref={contentRef}
      className={cn(
        'flex-1 overflow-auto relative',
        isDropOver && 'ring-2 ring-blue-400/40 ring-inset',
      )}
      onClick={handleBackgroundClick}
      onContextMenu={handleBackgroundContextMenu}
    >
      {filteredItems.length === 0 ? (
        <div className="flex items-center justify-center h-full text-white/30 text-[13px]">
          {searchQuery ? 'No items match your search' : 'This folder is empty'}
        </div>
      ) : viewMode === 'icon' ? (
        <IconView items={filteredItems} />
      ) : viewMode === 'list' ? (
        <ListView items={filteredItems} />
      ) : (
        <ColumnView />
      )}
    </div>
  )
}

export default ContentArea
