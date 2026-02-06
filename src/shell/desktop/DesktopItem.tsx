import { useRef, useCallback, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useDesktopStore } from '@/stores/use-desktop-store'
import { DESKTOP_ICON_MAP } from './desktop-icons'
import { DESKTOP_ICON_SIZE } from './desktop.constants'
import type { DesktopItem as DesktopItemType } from '@/types'

interface DesktopItemProps {
  item: DesktopItemType
}

const DesktopItem = ({ item }: DesktopItemProps) => {
  const isSelected = useDesktopStore((s) => s.selectedIds.includes(item.id))
  const selectItem = useDesktopStore((s) => s.selectItem)
  const updateItemPosition = useDesktopStore((s) => s.updateItemPosition)
  const openContextMenu = useDesktopStore((s) => s.openContextMenu)

  const IconComponent = DESKTOP_ICON_MAP[item.icon] ?? DESKTOP_ICON_MAP['text-file']

  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0, itemX: 0, itemY: 0 })
  const hasDraggedRef = useRef(false)
  const dragCleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    return () => { dragCleanupRef.current?.() }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()

    dragCleanupRef.current?.()

    const additive = e.metaKey || e.ctrlKey
    if (!isSelected) {
      selectItem(item.id, additive)
    } else if (additive) {
      selectItem(item.id, true)
    }

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      itemX: item.position.x,
      itemY: item.position.y,
    }
    hasDraggedRef.current = false

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - dragStartRef.current.x
      const dy = moveEvent.clientY - dragStartRef.current.y

      if (!hasDraggedRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        hasDraggedRef.current = true
        setIsDragging(true)
      }

      if (hasDraggedRef.current) {
        updateItemPosition(item.id, {
          x: dragStartRef.current.itemX + dx,
          y: dragStartRef.current.itemY + dy,
        })
      }
    }

    const handleMouseUp = () => {
      cleanup()
      setIsDragging(false)
      hasDraggedRef.current = false
    }

    const cleanup = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      dragCleanupRef.current = null
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    dragCleanupRef.current = cleanup
  }, [item.id, item.position, isSelected, selectItem, updateItemPosition])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isSelected) {
      selectItem(item.id)
    }

    openContextMenu(e.clientX, e.clientY, item.id)
  }, [item.id, isSelected, selectItem, openContextMenu])

  return (
    <motion.div
      className={cn(
        'absolute flex flex-col items-center w-[80px] cursor-default select-none',
        'rounded-lg p-1',
        isSelected && 'bg-white/10',
        isDragging && 'opacity-80 z-50',
      )}
      style={{
        left: item.position.x,
        top: item.position.y,
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      data-desktop-item-id={item.id}
    >
      <div className={cn(
        'flex items-center justify-center rounded-lg',
        isSelected && 'ring-2 ring-blue-400/60 bg-blue-400/10',
      )}>
        <IconComponent size={DESKTOP_ICON_SIZE} />
      </div>

      <span className={cn(
        'mt-0.5 text-[11px] font-medium leading-tight text-center',
        'max-w-[76px] truncate',
        'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]',
        isSelected && 'bg-[#2463EB] text-white rounded px-1',
      )}>
        {item.name}
      </span>
    </motion.div>
  )
}

export default DesktopItem
