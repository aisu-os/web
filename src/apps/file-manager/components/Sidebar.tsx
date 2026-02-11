import { cn } from '@/lib/cn'
import { useWindowStore } from '@/stores/use-window-store'
import { useFileManagerStore } from '../hooks/use-file-manager-store'
import { SIDEBAR_FAVORITES, SIDEBAR_TAGS } from '../file-manager.constants'
import { getSidebarIcon, TrashSidebarIcon } from '../file-manager-icons'
import SidebarItem from './SidebarItem'

const Sidebar = () => {
  const currentPath = useFileManagerStore((s) => s.currentPath)
  const navigateTo = useFileManagerStore((s) => s.navigateTo)

  return (
    <div
      className={cn(
        'w-[180px] shrink-0 overflow-y-auto',
        'bg-white/[0.03] backdrop-blur-xl',
        'border-r border-white/5',
        'py-2 px-2 flex flex-col gap-1'
      )}
    >
      {/* Favorites */}
      <div className="mb-1">
        <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Favorites
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {SIDEBAR_FAVORITES.map((fav) => {
          const IconComponent = getSidebarIcon(fav.icon)
          return (
            <SidebarItem
              key={fav.path}
              icon={<IconComponent size={16} />}
              label={fav.label}
              isActive={currentPath === fav.path || currentPath.startsWith(fav.path + '/')}
              onClick={() => navigateTo(fav.path)}
            />
          )
        })}
      </div>

      {/* Trash */}
      <div className="mt-4 mb-1">
        <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Trash
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        <SidebarItem
          icon={<TrashSidebarIcon size={16} />}
          label="Trash"
          isActive={false}
          onClick={() => useWindowStore.getState().openWindow('trash')}
        />
      </div>

      {/* Tags */}
      <div className="mt-4 mb-1">
        <span className="px-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Tags
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {SIDEBAR_TAGS.map((tag) => (
          <button
            key={tag.label}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-[5px] rounded-md text-[13px]',
              'text-white/50 hover:bg-white/5 hover:text-white/70 transition-colors'
            )}
          >
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: tag.color }}
            />
            <span className="truncate">{tag.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
