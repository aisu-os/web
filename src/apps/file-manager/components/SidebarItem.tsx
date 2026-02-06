import { cn } from '@/lib/cn'

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

const SidebarItem = ({ icon, label, isActive, onClick }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 w-full px-3 py-[5px] rounded-md text-[13px] transition-colors',
        isActive
          ? 'bg-white/10 text-white'
          : 'text-white/60 hover:bg-white/5 hover:text-white/80'
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}

export default SidebarItem
