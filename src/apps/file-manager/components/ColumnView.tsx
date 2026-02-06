import { useMemo } from 'react'
import { useFileManagerStore } from '../hooks/use-file-manager-store'
import { useFileSystem } from '../hooks/use-file-system'
import { sortFileNodes } from '../file-manager.utils'
import ColumnPane from './ColumnPane'

const ColumnView = () => {
  const columnSelections = useFileManagerStore((s) => s.columnSelections)
  const sortKey = useFileManagerStore((s) => s.sortKey)
  const sortDirection = useFileManagerStore((s) => s.sortDirection)
  const searchQuery = useFileManagerStore((s) => s.searchQuery)
  const { getChildren, getNode } = useFileSystem()

  const columns = useMemo(() => {
    return columnSelections.map((path, index) => {
      const node = getNode(path)
      if (!node || node.type !== 'directory') return null

      let children = getChildren(path)
      if (searchQuery && index === columnSelections.length - 1) {
        children = children.filter((n) =>
          n.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      const sorted = sortFileNodes(children, sortKey, sortDirection)

      const selectedPath = columnSelections[index + 1]

      return {
        path,
        items: sorted,
        level: index,
        selectedPath,
      }
    }).filter(Boolean)
  }, [columnSelections, sortKey, sortDirection, searchQuery, getChildren, getNode])

  return (
    <div className="flex h-full overflow-x-auto">
      {columns.map((col) => (
        col && (
          <ColumnPane
            key={col.path}
            items={col.items}
            level={col.level}
            selectedPath={col.selectedPath}
          />
        )
      ))}
    </div>
  )
}

export default ColumnView
