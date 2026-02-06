import { useEffect, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import type { AppMenuItem } from '@/types'
import MenuItem from './MenuItem'

interface MenuDropdownProps {
  items: AppMenuItem[]
  isVisible: boolean
  anchorRef: RefObject<HTMLElement | null>
}

const MenuDropdown = ({ items, isVisible, anchorRef }: MenuDropdownProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom,
        left: rect.left,
      })
    }
  }, [isVisible, anchorRef])

  if (!isVisible) return null

  return createPortal(
    <div
      ref={dropdownRef}
      onMouseDown={(e) => e.stopPropagation()}
      style={{ top: position.top, left: position.left }}
      className={cn(
        'fixed z-[9999]',
        'min-w-[220px] w-max',
        'py-1 px-[3px]',
        'rounded-lg',
        'bg-black/30 backdrop-blur-2xl backdrop-saturate-150',
        'shadow-[0_10px_30px_rgba(0,0,0,0.4)]',
        'ring-1 ring-inset ring-white/10',
        'select-none',
      )}
    >
      {items.map((item, index) => (
        <MenuItem
          key={item.separator ? `sep-${index}` : item.label}
          item={item}
        />
      ))}
    </div>,
    document.body,
  )
}

export default MenuDropdown
