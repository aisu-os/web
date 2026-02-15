import { useCallback } from 'react'
import { useTextEditorStore } from '../hooks/use-text-editor-store'
import { cn } from '@/lib/cn'

const Toolbar = () => {
  const isModified = useTextEditorStore((s) => s.isModified)
  const isSaving = useTextEditorStore((s) => s.isSaving)
  const showFind = useTextEditorStore((s) => s.showFind)
  const findQuery = useTextEditorStore((s) => s.findQuery)
  const newFile = useTextEditorStore((s) => s.newFile)
  const save = useTextEditorStore((s) => s.save)
  const toggleFind = useTextEditorStore((s) => s.toggleFind)
  const setFindQuery = useTextEditorStore((s) => s.setFindQuery)

  const handleNew = useCallback(() => newFile(), [newFile])
  const handleSave = useCallback(() => save(), [save])
  const handleToggleFind = useCallback(() => toggleFind(), [toggleFind])

  return (
    <div className="flex flex-col border-b border-white/[0.06]">
      <div className="flex items-center gap-1 px-3 py-1.5">
        <button
          onClick={handleNew}
          className={cn(
            'px-2.5 py-1 rounded text-[11px] font-medium',
            'text-white/60 hover:text-white/90 hover:bg-white/[0.06]',
            'transition-colors'
          )}
        >
          New
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || !isModified}
          className={cn(
            'px-2.5 py-1 rounded text-[11px] font-medium',
            'transition-colors',
            isSaving
              ? 'text-white/40 cursor-wait'
              : isModified
                ? 'text-sky-400 hover:text-sky-300 hover:bg-sky-400/10'
                : 'text-white/40 cursor-default'
          )}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <div className="flex-1" />
        <button
          onClick={handleToggleFind}
          className={cn(
            'px-2.5 py-1 rounded text-[11px] font-medium',
            'transition-colors',
            showFind
              ? 'text-sky-400 bg-sky-400/10'
              : 'text-white/60 hover:text-white/90 hover:bg-white/[0.06]'
          )}
        >
          Find
        </button>
      </div>

      {showFind && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-t border-white/[0.06] bg-white/[0.02]">
          <svg
            className="w-3.5 h-3.5 text-white/40 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={findQuery}
            onChange={(e) => setFindQuery(e.target.value)}
            placeholder="Find..."
            autoFocus
            className={cn(
              'flex-1 bg-transparent text-[12px] text-white/80',
              'placeholder:text-white/30 outline-none'
            )}
          />
          {findQuery && (
            <button
              onClick={() => setFindQuery('')}
              className="text-white/40 hover:text-white/70 text-[11px]"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Toolbar
