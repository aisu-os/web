import { cn } from '@/lib/cn'
import type { AppMenuItem } from '@/types'
import MenuItem from './MenuItem'

interface MenuDropdownProps {
  items: AppMenuItem[]
  isVisible: boolean
}

const MenuDropdown = ({ items, isVisible }: MenuDropdownProps) => {
  if (!isVisible) return null

  return (
    <div
      className={cn(
        'absolute left-0 top-full z-50',
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
    </div>
  )
}

export default MenuDropdown
