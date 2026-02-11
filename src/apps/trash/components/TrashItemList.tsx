import { cn } from '@/lib/cn'
import type { FileNode } from '@/types'
import { getFileIcon } from '@/apps/file-manager/file-manager-icons'
import { formatFileSize, formatDate } from '@/apps/file-manager/file-manager.utils'

interface TrashItemListProps {
  items: FileNode[]
  isLoading: boolean
  selectedPaths: string[]
  onSelect: (path: string, meta: boolean) => void
}

const TrashItemList = ({ items, isLoading, selectedPaths, onSelect }: TrashItemListProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          <span className="text-[12px] text-white/30">Loading trash...</span>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-20">
            <path
              d="M14 16H34M18 16V14C18 12.9 18.9 12 20 12H28C29.1 12 30 12.9 30 14V16M20 22V34M28 22V34M16 16L17 38C17 39.1 17.9 40 19 40H29C30.1 40 31 39.1 31 38L32 16"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[13px] text-white/30">Trash is empty</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div
        className={cn(
          'grid grid-cols-[1fr_1fr_140px_80px] gap-2',
          'px-3 py-1.5 sticky top-0',
          'bg-[#1E1E2E] border-b border-white/5',
          'text-[11px] text-white/30 font-medium uppercase tracking-wider'
        )}
      >
        <span>Name</span>
        <span>Original Location</span>
        <span>Date Trashed</span>
        <span className="text-right">Size</span>
      </div>

      {/* Items */}
      {items.map((item) => {
        const isSelected = selectedPaths.includes(item.path)
        const IconComponent = getFileIcon(item)
        const originalDir = item.originalPath
          ? item.originalPath.split('/').slice(0, -1).join('/') || '/'
          : '--'

        return (
          <button
            key={item.path}
            onClick={(e) => onSelect(item.path, e.metaKey)}
            className={cn(
              'grid grid-cols-[1fr_1fr_140px_80px] gap-2 w-full',
              'px-3 py-1.5 text-left text-[13px]',
              'transition-colors',
              isSelected
                ? 'bg-[#2463EB]/30 text-white'
                : 'text-white/70 hover:bg-white/[0.03]'
            )}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="shrink-0">
                <IconComponent size={18} />
              </span>
              <span className="truncate">{item.name}</span>
            </span>
            <span className="truncate text-white/40">{originalDir}</span>
            <span className="text-white/40">{formatDate(item.trashedAt)}</span>
            <span className="text-right text-white/40">
              {item.type === 'directory' ? '--' : formatFileSize(item.size)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default TrashItemList
