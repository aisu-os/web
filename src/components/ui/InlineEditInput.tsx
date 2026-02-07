import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/cn'

interface InlineEditInputProps {
  initialValue: string
  selectRange?: [number, number]
  onCommit: (value: string) => void
  onCancel: () => void
  className?: string
}

const InlineEditInput = ({
  initialValue,
  selectRange,
  onCommit,
  onCancel,
  className,
}: InlineEditInputProps) => {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const committedRef = useRef(false)

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    input.focus()
    if (selectRange) {
      input.setSelectionRange(selectRange[0], selectRange[1])
    } else {
      input.select()
    }
  }, [selectRange])

  const commit = useCallback(() => {
    if (committedRef.current) return
    committedRef.current = true
    onCommit(value)
  }, [value, onCommit])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === 'Enter') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      committedRef.current = true
      onCancel()
    }
  }

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={commit}
      className={cn(
        'bg-white/10 border border-[#2463EB] rounded px-1 py-0',
        'text-white outline-none',
        'selection:bg-[#2463EB]/50',
        className
      )}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
    />
  )
}

export default InlineEditInput
