import { useEffect } from 'react'
import { useCursorStore } from '@/stores/use-cursor-store'
import type { CursorType } from '@/types'

const CURSOR_ATTR = 'data-cursor'

const CSS_CURSOR_MAP: Record<string, CursorType> = {
  'cursor-pointer': 'pointer',
  'cursor-default': 'default',
  'cursor-text': 'text',
  'cursor-grab': 'grab',
  'cursor-grabbing': 'grabbing',
  'cursor-not-allowed': 'not-allowed',
  'cursor-wait': 'wait',
  'cursor-crosshair': 'crosshair',
  'cursor-move': 'move',
  'cursor-n-resize': 'n-resize',
  'cursor-s-resize': 's-resize',
  'cursor-e-resize': 'e-resize',
  'cursor-w-resize': 'w-resize',
  'cursor-ne-resize': 'ne-resize',
  'cursor-nw-resize': 'nw-resize',
  'cursor-se-resize': 'se-resize',
  'cursor-sw-resize': 'sw-resize',
  'cursor-col-resize': 'col-resize',
  'cursor-row-resize': 'row-resize',
}

const INTERACTIVE_INPUT_TYPES = new Set([
  'submit', 'button', 'reset', 'checkbox', 'radio', 'range', 'file', 'color',
])

function detectCursorType(target: HTMLElement): CursorType {
  // 1. data-cursor atributi orqali explicit override
  const attrEl = target.closest(`[${CURSOR_ATTR}]`) as HTMLElement | null
  if (attrEl) {
    const value = attrEl.getAttribute(CURSOR_ATTR) as CursorType
    if (value) return value
  }

  // 2. Tailwind cursor classlarni tekshirish (element va ota-onalarida)
  let current: HTMLElement | null = target
  while (current) {
    for (const [className, cursorType] of Object.entries(CSS_CURSOR_MAP)) {
      if (current.classList.contains(className)) {
        return cursorType
      }
    }
    current = current.parentElement
  }

  // 3. Semantik elementlar
  const tagName = target.tagName.toLowerCase()

  if (tagName === 'input' || tagName === 'textarea') {
    const inputType = (target as HTMLInputElement).type
    if (!INTERACTIVE_INPUT_TYPES.has(inputType)) {
      return 'text'
    }
    return 'pointer'
  }

  if (
    tagName === 'a' ||
    tagName === 'button' ||
    tagName === 'select' ||
    target.getAttribute('role') === 'button' ||
    target.getAttribute('role') === 'link' ||
    target.getAttribute('tabindex') !== null
  ) {
    return 'pointer'
  }

  // 4. contenteditable
  if (target.isContentEditable) {
    return 'text'
  }

  return 'default'
}

export function useCursorHandlers() {
  const setCursorType = useCursorStore((s) => s.setCursorType)
  const isEnabled = useCursorStore((s) => s.isEnabled)

  useEffect(() => {
    if (!isEnabled) return

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return
      setCursorType(detectCursorType(target))
    }

    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    return () => document.removeEventListener('mouseover', handleMouseOver)
  }, [isEnabled, setCursorType])
}
