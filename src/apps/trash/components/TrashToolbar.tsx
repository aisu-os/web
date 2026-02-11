import { useState } from 'react'
import { cn } from '@/lib/cn'

interface TrashToolbarProps {
  itemCount: number
  selectedCount: number
  onPutBack: () => void
  onDelete: () => void
  onEmptyTrash: () => void
}

const TrashToolbar = ({
  itemCount,
  selectedCount,
  onPutBack,
  onDelete,
  onEmptyTrash,
}: TrashToolbarProps) => {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'h-10 px-3 shrink-0',
        'bg-white/[0.03]',
        'border-b border-white/5'
      )}
    >
      <span className="text-[12px] text-white/40">
        {itemCount === 0 ? 'No items' : `${itemCount} item${itemCount !== 1 ? 's' : ''} in Trash`}
      </span>

      <div className="flex items-center gap-1.5">
        {selectedCount > 0 && (
          <>
            <button
              onClick={onPutBack}
              className={cn(
                'px-2.5 py-1 rounded-md text-[12px]',
                'bg-white/5 text-white/70',
                'hover:bg-white/10 hover:text-white transition-colors'
              )}
            >
              Put Back
            </button>
            <button
              onClick={onDelete}
              className={cn(
                'px-2.5 py-1 rounded-md text-[12px]',
                'bg-red-500/10 text-red-400',
                'hover:bg-red-500/20 hover:text-red-300 transition-colors'
              )}
            >
              Delete
            </button>
          </>
        )}

        {itemCount > 0 && (
          <>
            {showConfirm ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-white/40">Are you sure?</span>
                <button
                  onClick={() => {
                    onEmptyTrash()
                    setShowConfirm(false)
                  }}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[12px]',
                    'bg-red-500/20 text-red-300',
                    'hover:bg-red-500/30 transition-colors'
                  )}
                >
                  Yes, Empty
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[12px]',
                    'bg-white/5 text-white/50',
                    'hover:bg-white/10 transition-colors'
                  )}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-[12px]',
                  'bg-white/5 text-white/50',
                  'hover:bg-red-500/10 hover:text-red-400 transition-colors'
                )}
              >
                Empty Trash
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TrashToolbar
