import { cn } from '@/lib/cn'
import { useSettingsStore } from '../hooks/use-settings-store'
import { SETTINGS_NAV_GROUPS } from '../settings.constants'
import type { SettingsNavItem } from '../settings.types'
import SearchField from './shared/SearchField'

const SettingsSidebar = () => {
  const activePanel = useSettingsStore((s) => s.activePanel)
  const searchQuery = useSettingsStore((s) => s.searchQuery)
  const setActivePanel = useSettingsStore((s) => s.setActivePanel)
  const setSearchQuery = useSettingsStore((s) => s.setSearchQuery)

  const handleItemClick = (item: SettingsNavItem) => {
    setActivePanel(item.id)
    setSearchQuery('')
  }

  const filteredItems = searchQuery.trim()
    ? SETTINGS_NAV_GROUPS.flatMap((g) => g.items).filter((item) => {
        const q = searchQuery.toLowerCase()
        return (
          item.label.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.includes(q))
        )
      })
    : null

  return (
    <div
      className={cn(
        'w-[220px] shrink-0 overflow-y-auto',
        'bg-white/[0.03] backdrop-blur-xl',
        'border-r border-white/5',
        'flex flex-col'
      )}
    >
      <div className="px-3 pt-3 pb-2">
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {filteredItems ? (
          <div className="flex flex-col gap-0.5">
            {filteredItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={activePanel === item.id}
                onClick={() => handleItemClick(item)}
              />
            ))}
            {filteredItems.length === 0 && (
              <p className="px-3 py-4 text-[12px] text-white/30 text-center">
                No results found
              </p>
            )}
          </div>
        ) : (
          SETTINGS_NAV_GROUPS.map((group, groupIndex) => (
            <div key={group.id}>
              {groupIndex > 0 && (
                <div className="mx-2 my-1.5 border-t border-white/[0.06]" />
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isActive={activePanel === item.id}
                    onClick={() => handleItemClick(item)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const SidebarItem = ({
  item,
  isActive,
  onClick,
}: {
  item: SettingsNavItem
  isActive: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-2.5 w-full px-3 py-[6px] rounded-md text-[13px] transition-colors',
      isActive
        ? 'bg-white/10 text-white'
        : 'text-white/50 hover:bg-white/5 hover:text-white/70'
    )}
  >
    <span className="text-[15px] w-5 text-center shrink-0">{item.icon}</span>
    <span className="truncate">{item.label}</span>
  </button>
)

export default SettingsSidebar
