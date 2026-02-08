import { cn } from '@/lib/cn'
import type { FileNode } from '@/types'
import type { SortKey } from '../file-manager.types'
import { openFile } from '@/lib/open-file'
import { useFileManagerStore } from '../hooks/use-file-manager-store'
import { useWindowId } from '../hooks/use-window-id'
import FileItem from './FileItem'

interface ListViewProps {
  items: FileNode[]
}

const COLUMNS: { key: SortKey; label: string; className: string }[] = [
  { key: 'name', label: 'Name', className: 'flex-1 text-left' },
  { key: 'dateModified', label: 'Date Modified', className: 'w-[160px] text-left' },
  { key: 'size', label: 'Size', className: 'w-[80px] text-right' },
  { key: 'kind', label: 'Kind', className: 'w-[120px] text-left' },
]

const ListView = ({ items }: ListViewProps) => {
  const selectedPaths = useFileManagerStore((s) => s.selectedPaths)
  const selectItem = useFileManagerStore((s) => s.selectItem)
  const navigateTo = useFileManagerStore((s) => s.navigateTo)
  const openContextMenu = useFileManagerStore((s) => s.openContextMenu)
  const sortKey = useFileManagerStore((s) => s.sortKey)
  const sortDirection = useFileManagerStore((s) => s.sortDirection)
  const setSortKey = useFileManagerStore((s) => s.setSortKey)
  const editingPath = useFileManagerStore((s) => s.editingPath)
  const commitEditing = useFileManagerStore((s) => s.commitEditing)
  const cancelEditing = useFileManagerStore((s) => s.cancelEditing)
  const windowId = useWindowId()

  const handleOpen = (path: string) => {
    const item = items.find((i) => i.path === path)
    if (!item) return
    if (item.type === 'directory') {
      navigateTo(path)
    } else {
      openFile(path)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, path: string) => {
    openContextMenu(e.clientX, e.clientY, path)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center h-[28px] px-3 gap-2 border-b border-white/5 shrink-0">
        <div className="w-[16px] shrink-0" />
        {COLUMNS.map(({ key, label, className }) => (
          <button
            key={key}
            onClick={() => setSortKey(key)}
            className={cn(
              className,
              'text-[10px] uppercase tracking-wider font-medium transition-colors',
              sortKey === key ? 'text-white/60' : 'text-white/30 hover:text-white/50'
            )}
          >
            <span className="flex items-center gap-1">
              {label}
              {sortKey === key && (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d={sortDirection === 'asc' ? 'M1.5 5L4 2.5L6.5 5' : 'M1.5 3L4 5.5L6.5 3'}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {items.map((item, index) => (
          <div
            key={item.path}
            className={cn(index % 2 === 0 && 'bg-white/[0.01]')}
          >
            <FileItem
              node={item}
              variant="list"
              isSelected={selectedPaths.includes(item.path)}
              isEditing={item.path === editingPath}
              onSelect={selectItem}
              onOpen={handleOpen}
              onContextMenu={handleContextMenu}
              onCommitEdit={commitEditing}
              onCancelEdit={cancelEditing}
              windowId={windowId}
              selectedPaths={selectedPaths}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListView
