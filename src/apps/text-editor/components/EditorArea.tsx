import { useCallback, useRef, useEffect, useMemo } from 'react'
import { useTextEditorStore } from '../hooks/use-text-editor-store'
import { cn } from '@/lib/cn'

const EditorArea = () => {
  const content = useTextEditorStore((s) => s.content)
  const wordWrap = useTextEditorStore((s) => s.wordWrap)
  const findQuery = useTextEditorStore((s) => s.findQuery)
  const setContent = useTextEditorStore((s) => s.setContent)
  const setCursorPosition = useTextEditorStore((s) => s.setCursorPosition)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  const lines = useMemo(() => content.split('\n'), [content])

  const findMatchCount = useMemo(() => {
    if (!findQuery) return 0
    const escaped = findQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'gi')
    return (content.match(regex) ?? []).length
  }, [content, findQuery])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value)
    },
    [setContent]
  )

  const updateCursorPosition = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const pos = textarea.selectionStart
    const textBefore = textarea.value.substring(0, pos)
    const line = textBefore.split('\n').length
    const lastNewline = textBefore.lastIndexOf('\n')
    const col = pos - lastNewline

    setCursorPosition(line, col)
  }, [setCursorPosition])

  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current
    const lineNumbers = lineNumbersRef.current
    if (textarea && lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop
    }
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.addEventListener('scroll', handleScroll)
    return () => textarea.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Line numbers */}
      <div
        ref={lineNumbersRef}
        className={cn(
          'flex flex-col items-end py-2 px-2',
          'bg-white/[0.02] border-r border-white/[0.06]',
          'text-[12px] leading-[20px] text-white/20 select-none',
          'overflow-hidden font-mono min-w-[40px]'
        )}
      >
        {lines.map((_, i) => (
          <div key={i} className="shrink-0">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onKeyUp={updateCursorPosition}
        onMouseUp={updateCursorPosition}
        onFocus={updateCursorPosition}
        spellCheck={false}
        className={cn(
          'flex-1 resize-none p-2 bg-transparent',
          'text-[13px] leading-[20px] text-white/80 font-mono',
          'outline-none selection:bg-sky-500/30',
          wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
        )}
      />

      {/* Find match count */}
      {findQuery && (
        <div className="absolute top-2 right-4 text-[11px] text-white/40 bg-white/[0.06] px-2 py-0.5 rounded">
          {findMatchCount === 0 ? 'No results' : `${findMatchCount} found`}
        </div>
      )}
    </div>
  )
}

export default EditorArea
