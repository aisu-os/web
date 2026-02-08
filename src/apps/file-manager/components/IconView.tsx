import type { FileNode } from '@/types'
import { useFileManagerStore } from '../hooks/use-file-manager-store'
import { useWindowId } from '../hooks/use-window-id'
import FileItem from './FileItem'

interface IconViewProps {
  items: FileNode[]
}

const IconView = ({ items }: IconViewProps) => {
  const selectedPaths = useFileManagerStore((s) => s.selectedPaths)
  const selectItem = useFileManagerStore((s) => s.selectItem)
  const navigateTo = useFileManagerStore((s) => s.navigateTo)
  const openContextMenu = useFileManagerStore((s) => s.openContextMenu)
  const editingPath = useFileManagerStore((s) => s.editingPath)
  const commitEditing = useFileManagerStore((s) => s.commitEditing)
  const cancelEditing = useFileManagerStore((s) => s.cancelEditing)
  const windowId = useWindowId()

  const handleOpen = (path: string) => {
    const item = items.find((i) => i.path === path)
    if (item?.type === 'directory') {
      navigateTo(path)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, path: string) => {
    openContextMenu(e.clientX, e.clientY, path)
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-1 p-4 content-start">
      {items.map((item) => (
        <FileItem
          key={item.path}
          node={item}
          variant="icon"
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
      ))}
    </div>
  )
}

export default IconView
