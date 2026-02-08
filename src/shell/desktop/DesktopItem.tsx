import { useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useDesktopStore } from '@/stores/use-desktop-store'
import { useWindowStore } from '@/stores/use-window-store'
import { useDragSource } from '@/hooks/use-drag-source'
import { useDropTarget } from '@/hooks/use-drop-target'
import { DOUBLE_CLICK_DELAY } from '@/lib/constants'
import { DESKTOP_ICON_MAP } from './desktop-icons'
import { DESKTOP_ICON_SIZE } from './desktop.constants'
import InlineEditInput from '@/components/ui/InlineEditInput'
import type { DesktopItem as DesktopItemType } from '@/types'

interface DesktopItemProps {
  item: DesktopItemType
}

const DesktopItem = ({ item }: DesktopItemProps) => {
  const isSelected = useDesktopStore((s) => s.selectedIds.includes(item.id))
  const selectedIds = useDesktopStore((s) => s.selectedIds)
  const items = useDesktopStore((s) => s.items)
  const selectItem = useDesktopStore((s) => s.selectItem)
  const updateItemPosition = useDesktopStore((s) => s.updateItemPosition)
  const openContextMenu = useDesktopStore((s) => s.openContextMenu)
  const openWindow = useWindowStore((s) => s.openWindow)
  const editingItemId = useDesktopStore((s) => s.editingItemId)
  const commitEditing = useDesktopStore((s) => s.commitEditing)
  const cancelEditing = useDesktopStore((s) => s.cancelEditing)

  const isEditing = editingItemId === item.id

  const IconComponent = DESKTOP_ICON_MAP[item.icon] ?? DESKTOP_ICON_MAP['text-file']

  const dragStartPosRef = useRef({ x: 0, y: 0 })
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    }
  }, [])

  const handleOpenItem = useCallback(() => {
    if (item.type === 'directory') {
      openWindow('file-manager', { initialPath: item.fsPath })
    }
  }, [item.fsPath, item.type, openWindow])

  const dragSource = useDragSource({
    source: { type: 'desktop' },
    getItems: () => {
      if (isSelected && selectedIds.length > 1) {
        return selectedIds.map((id) => {
          const desktopItem = items.find((i) => i.id === id)
          if (!desktopItem) return null
          return {
            name: desktopItem.name,
            path: desktopItem.fsPath,
            type: desktopItem.type,
            desktopItemId: desktopItem.id,
          }
        }).filter(Boolean) as { name: string; path: string; type: 'file' | 'directory'; desktopItemId: string }[]
      }
      return [{
        name: item.name,
        path: item.fsPath,
        type: item.type,
        desktopItemId: item.id,
      }]
    },
    shouldStart: (e) => {
      if (isEditing) return false
      e.stopPropagation()

      const additive = e.metaKey || e.ctrlKey
      if (!isSelected) {
        selectItem(item.id, additive)
      } else if (additive) {
        selectItem(item.id, true)
      }

      dragStartPosRef.current = { x: item.position.x, y: item.position.y }
      return true
    },
    onDragMove: (dx, dy) => {
      updateItemPosition(item.id, {
        x: dragStartPosRef.current.x + dx,
        y: dragStartPosRef.current.y + dy,
      })
    },
    onDragEnd: (wasDragged, didDrop) => {
      if (didDrop) {
        return
      }
      if (wasDragged) {
        return
      }
      // Click / double-click
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
        clickTimerRef.current = null
        handleOpenItem()
      } else {
        clickTimerRef.current = setTimeout(() => {
          clickTimerRef.current = null
        }, DOUBLE_CLICK_DELAY)
      }
    },
  })

  // Drop target — faqat folder tipdagi elementlar uchun
  const dropTarget = useDropTarget({
    target: { type: 'folder-item', path: item.fsPath },
    elementRef: itemRef,
    accepts: (_source, dragItems) => {
      if (item.type !== 'directory') return false
      if (dragItems.some((i) => i.path === item.fsPath)) return false
      return true
    },
  })

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (isEditing) return
    e.preventDefault()
    e.stopPropagation()

    if (!isSelected) {
      selectItem(item.id)
    }

    openContextMenu(e.clientX, e.clientY, item.id)
  }, [item.id, isSelected, isEditing, selectItem, openContextMenu])

  const isDropOver = dropTarget.isOver && dropTarget.canDrop

  return (
    <motion.div
      ref={itemRef}
      className={cn(
        'absolute flex flex-col items-center w-[80px] cursor-default select-none',
        'rounded-lg p-1',
        isSelected && 'bg-white/10',
        dragSource.isDragging && 'opacity-50 z-50',
        isDropOver && 'ring-2 ring-blue-400/60 bg-blue-400/10',
      )}
      style={{
        left: item.position.x,
        top: item.position.y,
      }}
      onMouseDown={dragSource.handleMouseDown}
      onContextMenu={handleContextMenu}
      whileTap={isEditing ? undefined : { scale: 0.95 }}
      transition={{ duration: 0.1 }}
      data-desktop-item-id={item.id}
    >
      <div className={cn(
        'flex items-center justify-center rounded-lg',
        isSelected && 'ring-2 ring-blue-400/60 bg-blue-400/10',
      )}>
        <IconComponent size={DESKTOP_ICON_SIZE} />
      </div>

      {isEditing ? (
        <InlineEditInput
          initialValue={item.name}
          onCommit={commitEditing}
          onCancel={cancelEditing}
          className="mt-0.5 text-[11px] text-center w-full max-w-[76px]"
        />
      ) : (
        <span className={cn(
          'mt-0.5 text-[11px] font-medium leading-tight text-center',
          'max-w-[76px] truncate',
          'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]',
          isSelected && 'bg-[#2463EB] text-white rounded px-1',
        )}>
          {item.name}
        </span>
      )}
    </motion.div>
  )
}

export default DesktopItem
