import { cn } from '@/lib/cn'
import type { FileNode } from '@/types'
import { openFile } from '@/lib/open-file'
import { useFileManagerStore } from '../hooks/use-file-manager-store'
import FileItem from './FileItem'

interface ColumnPaneProps {
  items: FileNode[]
  level: number
  selectedPath?: string
}

const ColumnPane = ({ items, level, selectedPath }: ColumnPaneProps) => {
  const selectItem = useFileManagerStore((s) => s.selectItem)
  const setColumnSelection = useFileManagerStore((s) => s.setColumnSelection)
  const navigateTo = useFileManagerStore((s) => s.navigateTo)
  const openContextMenu = useFileManagerStore((s) => s.openContextMenu)
  const editingPath = useFileManagerStore((s) => s.editingPath)
  const commitEditing = useFileManagerStore((s) => s.commitEditing)
  const cancelEditing = useFileManagerStore((s) => s.cancelEditing)

  const handleSelect = (path: string, additive: boolean) => {
    selectItem(path, additive)
    const item = items.find((i) => i.path === path)
    if (item) {
      setColumnSelection(level + 1, path)
    }
  }

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
    <div
      className={cn(
        'w-[200px] min-w-[200px] shrink-0 overflow-y-auto',
        'border-r border-white/5',
        'py-1'
      )}
    >
      {items.map((item) => (
        <FileItem
          key={item.path}
          node={item}
          variant="compact"
          isSelected={item.path === selectedPath}
          isEditing={item.path === editingPath}
          onSelect={handleSelect}
          onOpen={handleOpen}
          onContextMenu={handleContextMenu}
          onCommitEdit={commitEditing}
          onCancelEdit={cancelEditing}
        />
      ))}
    </div>
  )
}

export default ColumnPane
