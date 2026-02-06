import { useRef, useCallback } from 'react'
import { cn } from '@/lib/cn'
import type { FileNode } from '@/types'
import { getFileIcon } from '../file-manager-icons'
import { formatFileSize, formatDate, getFileKind } from '../file-manager.utils'

interface FileItemProps {
  node: FileNode
  variant: 'icon' | 'list' | 'compact'
  isSelected: boolean
  onSelect: (path: string, additive: boolean) => void
  onOpen: (path: string) => void
  onContextMenu: (e: React.MouseEvent, path: string) => void
}

const FileItem = ({
  node,
  variant,
  isSelected,
  onSelect,
  onOpen,
  onContextMenu,
}: FileItemProps) => {
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const IconComponent = getFileIcon(node)

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (clickTimer.current) {
        clearTimeout(clickTimer.current)
        clickTimer.current = null
        onOpen(node.path)
      } else {
        clickTimer.current = setTimeout(() => {
          clickTimer.current = null
          onSelect(node.path, e.metaKey || e.ctrlKey)
        }, 250)
      }
    },
    [node.path, onSelect, onOpen]
  )

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isSelected) {
        onSelect(node.path, false)
      }
      onContextMenu(e, node.path)
    },
    [node.path, isSelected, onSelect, onContextMenu]
  )

  if (variant === 'icon') {
    return (
      <div
        data-file-item-path={node.path}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={cn(
          'flex flex-col items-center justify-start gap-1 p-2 rounded-lg cursor-default',
          'w-[90px] transition-colors',
          isSelected
            ? 'bg-white/10'
            : 'hover:bg-white/[0.04]'
        )}
      >
        <IconComponent size={48} />
        <span
          className={cn(
            'text-[11px] text-center leading-tight w-full',
            'line-clamp-2 break-all',
            isSelected ? 'text-white' : 'text-white/70'
          )}
        >
          {node.name}
        </span>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div
        data-file-item-path={node.path}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        className={cn(
          'flex items-center h-[28px] px-3 gap-2 cursor-default transition-colors',
          isSelected
            ? 'bg-[#2463EB]/80 text-white'
            : 'text-white/70 hover:bg-white/[0.03]'
        )}
      >
        <span className="shrink-0">
          <IconComponent size={16} />
        </span>
        <span className="flex-1 text-[13px] truncate">{node.name}</span>
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
      data-file-item-path={node.path}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={cn(
        'flex items-center h-[26px] px-2 gap-1.5 cursor-default transition-colors',
        isSelected
          ? 'bg-[#2463EB]/80 text-white'
          : 'text-white/70 hover:bg-white/[0.03]'
      )}
    >
      <span className="shrink-0">
        <IconComponent size={16} />
      </span>
      <span className="flex-1 text-[12px] truncate">{node.name}</span>
      {node.type === 'directory' && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="shrink-0 text-white/30">
          <path d="M3 1.5L6 4L3 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}

export default FileItem
