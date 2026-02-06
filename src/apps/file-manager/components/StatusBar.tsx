import { cn } from '@/lib/cn'
import { useFileManagerStore } from '../hooks/use-file-manager-store'
import { useFileSystem } from '../hooks/use-file-system'

const StatusBar = () => {
  const currentPath = useFileManagerStore((s) => s.currentPath)
  const selectedPaths = useFileManagerStore((s) => s.selectedPaths)
  const { getChildren } = useFileSystem()

  const children = getChildren(currentPath)
  const itemCount = children.length
  const selectedCount = selectedPaths.length

  return (
    <div
      className={cn(
        'flex items-center justify-between h-6 px-3',
        'text-[11px] text-white/40',
        'border-t border-white/5 shrink-0'
      )}
    >
      <span>
        {itemCount} item{itemCount !== 1 ? 's' : ''}
        {selectedCount > 0 && `, ${selectedCount} selected`}
      </span>
      <span>128 GB available</span>
    </div>
  )
}

export default StatusBar
