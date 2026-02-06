import { cn } from '@/lib/cn'
import type { AppMenuItem } from '@/types'

interface MenuItemProps {
  item: AppMenuItem
}

const MenuItem = ({ item }: MenuItemProps) => {
  if (item.separator) {
    return <div className="mx-2 my-1 h-px bg-white/10" />
  }

  return (
    <button
      disabled={item.disabled}
      className={cn(
        'flex w-full items-center justify-between rounded px-3 py-[3px] text-[13px]',
        'text-left tracking-wide outline-none',
        'transition-none',
        item.disabled
          ? 'cursor-default text-white/30'
          : 'cursor-default text-white/90 hover:bg-[#2463EB] hover:text-white focus-visible:bg-[#2463EB] focus-visible:text-white',
      )}
    >
      <span>{item.label}</span>
      {item.shortcut && (
        <span
          className={cn(
            'ml-6 text-[12px]',
            item.disabled ? 'text-white/20' : 'text-white/50',
          )}
        >
          {item.shortcut}
        </span>
      )}
    </button>
  )
}

export default MenuItem
