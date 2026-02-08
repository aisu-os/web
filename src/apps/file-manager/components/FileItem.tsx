import { useRef, useCallback } from 'react'
import { cn } from '@/lib/cn'
import { DOUBLE_CLICK_DELAY } from '@/lib/constants'
import type { FileNode } from '@/types'
import { getFileIcon } from '../file-manager-icons'
import { formatFileSize, formatDate, getFileKind } from '../file-manager.utils'
import InlineEditInput from './InlineEditInput'
import { useDragSource } from '@/hooks/use-drag-source'
import { useDropTarget } from '@/hooks/use-drop-target'

function getSelectRange(name: string, type: 'file' | 'directory'): [number, number] | undefined {
  if (type === 'directory') return undefined
  const dotIndex = name.lastIndexOf('.')
  if (dotIndex > 0) return [0, dotIndex]
  return undefined
}

interface FileItemProps {
  node: FileNode
  variant: 'icon' | 'list' | 'compact'
  isSelected: boolean
  isEditing?: boolean
  onSelect: (path: string, additive: boolean) => void
  onOpen: (path: string) => void
  onContextMenu: (e: React.MouseEvent, path: string) => void
  onCommitEdit?: (name: string) => void
  onCancelEdit?: () => void
  windowId?: string
  selectedPaths?: string[]
}

const FileItem = ({
  node,
  variant,
  isSelected,
  isEditing = false,
  onSelect,
  onOpen,
  onContextMenu,
  onCommitEdit,
  onCancelEdit,
  windowId = '',
  selectedPaths = [],
}: FileItemProps) => {
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const IconComponent = getFileIcon(node)

  // Drag source
  const dragSource = useDragSource({
    source: { type: 'file-manager', windowId },
    getItems: () => {
      if (isSelected && selectedPaths.length > 1) {
        return selectedPaths.map((p) => ({
          name: p.split('/').pop() ?? '',
          path: p,
          type: node.type,
        }))
      }
      return [{
        name: node.name,
        path: node.path,
        type: node.type,
      }]
    },
    shouldStart: (e) => {
      if (isEditing) return false
      e.stopPropagation()
      return true
    },
    onDragEnd: (wasDragged) => {
      if (!wasDragged) {
        // Click logic
        if (clickTimer.current) {
          clearTimeout(clickTimer.current)
          clickTimer.current = null
          onOpen(node.path)
        } else {
          clickTimer.current = setTimeout(() => {
            clickTimer.current = null
          }, DOUBLE_CLICK_DELAY)
        }
      }
    },
  })

  // Drop target — faqat folder uchun
  const dropTarget = useDropTarget({
    target: { type: 'folder-item', path: node.path, windowId },
    elementRef: itemRef,
    accepts: (_source, items) => {
      if (node.type !== 'directory') return false
      if (items.some((i) => i.path === node.path)) return false
      if (items.some((i) => node.path.startsWith(i.path + '/'))) return false
      return true
    },
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return
    const additive = e.metaKey || e.ctrlKey
    if (!isSelected) {
      onSelect(node.path, additive)
    } else if (additive) {
      onSelect(node.path, true)
    }
    dragSource.handleMouseDown(e)
  }

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing) return
      e.preventDefault()
      e.stopPropagation()
      if (!isSelected) {
        onSelect(node.path, false)
      }
      onContextMenu(e, node.path)
    },
    [node.path, isEditing, isSelected, onSelect, onContextMenu]
  )

  const isDropOver = dropTarget.isOver && dropTarget.canDrop

  if (variant === 'icon') {
    return (
      <div
        ref={itemRef}
        data-file-item-path={node.path}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        className={cn(
          'flex flex-col items-center justify-start gap-1 p-2 rounded-lg cursor-default',
          'w-[90px] transition-colors',
          isSelected
            ? 'bg-white/10'
            : 'hover:bg-white/[0.04]',
          isDropOver && 'ring-2 ring-blue-400/60 bg-blue-400/10',
          dragSource.isDragging && 'opacity-40',
        )}
      >
        <IconComponent size={48} />
        {isEditing && onCommitEdit && onCancelEdit ? (
          <InlineEditInput
            initialValue={node.name}
            selectRange={getSelectRange(node.name, node.type)}
            onCommit={onCommitEdit}
            onCancel={onCancelEdit}
            className="text-[11px] text-center w-full"
          />
        ) : (
          <span
            className={cn(
              'text-[11px] text-center leading-tight w-full',
              'line-clamp-2 break-all',
              isSelected ? 'text-white' : 'text-white/70'
            )}
          >
            {node.name}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div
        ref={itemRef}
        data-file-item-path={node.path}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        className={cn(
          'flex items-center h-[28px] px-3 gap-2 cursor-default transition-colors',
          isSelected
            ? 'bg-[#2463EB]/80 text-white'
            : 'text-white/70 hover:bg-white/[0.03]',
          isDropOver && 'ring-2 ring-blue-400/60 bg-blue-400/10',
          dragSource.isDragging && 'opacity-40',
        )}
      >
        <span className="shrink-0">
          <IconComponent size={16} />
        </span>
        {isEditing && onCommitEdit && onCancelEdit ? (
          <InlineEditInput
            initialValue={node.name}
            selectRange={getSelectRange(node.name, node.type)}
            onCommit={onCommitEdit}
            onCancel={onCancelEdit}
            className="flex-1 text-[13px]"
          />
        ) : (
          <span className="flex-1 text-[13px] truncate">{node.name}</span>
        )}
        <span className="w-[160px] text-[11px] text-white/40 shrink-0 truncate">
          {formatDate(node.updatedAt)}
        </span>
        <span className="w-[80px] text-[11px] text-white/40 text-right shrink-0">
          {node.type === 'directory' ? '--' : formatFileSize(node.size)}
        </span>
        <span className="w-[120px] text-[11px] text-white/40 shrink-0 truncate">
          {getFileKind(node)}
        </span>
      </div>
    )
  }

  // compact variant (for column view)
  return (
    <div
      ref={itemRef}
      data-file-item-path={node.path}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      className={cn(
        'flex items-center h-[26px] px-2 gap-1.5 cursor-default transition-colors',
        isSelected
          ? 'bg-[#2463EB]/80 text-white'
          : 'text-white/70 hover:bg-white/[0.03]',
        isDropOver && 'ring-2 ring-blue-400/60 bg-blue-400/10',
        dragSource.isDragging && 'opacity-40',
      )}
    >
      <span className="shrink-0">
        <IconComponent size={16} />
      </span>
      {isEditing && onCommitEdit && onCancelEdit ? (
        <InlineEditInput
          initialValue={node.name}
          selectRange={getSelectRange(node.name, node.type)}
          onCommit={onCommitEdit}
          onCancel={onCancelEdit}
          className="flex-1 text-[12px]"
        />
      ) : (
        <span className="flex-1 text-[12px] truncate">{node.name}</span>
      )}
      {node.type === 'directory' && !isEditing && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="shrink-0 text-white/30">
          <path d="M3 1.5L6 4L3 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}

export default FileItem
