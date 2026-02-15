import { useTextEditorStore } from '../hooks/use-text-editor-store'
import { cn } from '@/lib/cn'

const StatusBar = () => {
  const fileName = useTextEditorStore((s) => s.fileName)
  const language = useTextEditorStore((s) => s.language)
  const cursorLine = useTextEditorStore((s) => s.cursorLine)
  const cursorCol = useTextEditorStore((s) => s.cursorCol)
  const wordWrap = useTextEditorStore((s) => s.wordWrap)
  const content = useTextEditorStore((s) => s.content)
  const isSaving = useTextEditorStore((s) => s.isSaving)
  const error = useTextEditorStore((s) => s.error)

  const lineCount = content.split('\n').length

  return (
    <div
      className={cn(
        'flex items-center justify-between px-3 py-1',
        'border-t border-white/[0.06] bg-white/[0.02]',
        'text-[11px] text-white/40 select-none'
      )}
    >
      <div className="flex items-center gap-3">
        <span>{fileName}</span>
        <span>{language}</span>
        {isSaving && <span className="text-sky-400">Saving...</span>}
        {error && <span className="text-red-400 truncate max-w-[200px]">{error}</span>}
      </div>
      <div className="flex items-center gap-3">
        <span>{lineCount} lines</span>
        <span>
          Ln {cursorLine}, Col {cursorCol}
        </span>
        <span>{wordWrap ? 'Wrap' : 'No Wrap'}</span>
      </div>
    </div>
  )
}

export default StatusBar
