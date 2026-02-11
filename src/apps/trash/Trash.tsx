import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/cn'
import { useFileSystemStore } from '@/stores/use-file-system-store'
import TrashToolbar from './components/TrashToolbar'
import TrashItemList from './components/TrashItemList'

const Trash = () => {
  const fetchTrash = useFileSystemStore((s) => s.fetchTrash)
  const restoreFromTrash = useFileSystemStore((s) => s.restoreFromTrash)
  const permanentDelete = useFileSystemStore((s) => s.permanentDelete)
  const emptyTrash = useFileSystemStore((s) => s.emptyTrash)
  const trashItems = useFileSystemStore((s) => s.trashItems)
  const isTrashLoading = useFileSystemStore((s) => s.isTrashLoading)

  const [selectedPaths, setSelectedPaths] = useState<string[]>([])

  useEffect(() => {
    fetchTrash()
  }, [fetchTrash])

  const handleSelect = useCallback(
    (path: string, meta: boolean) => {
      setSelectedPaths((prev) => {
        if (meta) {
          return prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
        }
        return [path]
      })
    },
    []
  )

  const handlePutBack = useCallback(() => {
    for (const path of selectedPaths) {
      restoreFromTrash(path)
    }
    setSelectedPaths([])
  }, [selectedPaths, restoreFromTrash])

  const handleDelete = useCallback(() => {
    for (const path of selectedPaths) {
      permanentDelete(path)
    }
    setSelectedPaths([])
  }, [selectedPaths, permanentDelete])

  const handleEmptyTrash = useCallback(() => {
    emptyTrash()
    setSelectedPaths([])
  }, [emptyTrash])

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full',
        'bg-[#1E1E2E] text-white',
        'rounded-b-lg overflow-hidden select-none'
      )}
    >
      <TrashToolbar
        itemCount={trashItems.length}
        selectedCount={selectedPaths.length}
        onPutBack={handlePutBack}
        onDelete={handleDelete}
        onEmptyTrash={handleEmptyTrash}
      />
      <TrashItemList
        items={trashItems}
        isLoading={isTrashLoading}
        selectedPaths={selectedPaths}
        onSelect={handleSelect}
      />
    </div>
  )
}

export default Trash
