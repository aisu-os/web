import { cn } from '@/lib/cn'
import MenuBar from './MenuBar'
import SystemTray from './SystemTray'

interface TopBarProps {
  isVisible?: boolean
}

const TopBar = ({ isVisible = true }: TopBarProps) => {
  return (
    <header
      className={cn(
        'relative z-50',
        'flex w-full h-7 items-center justify-between shrink-0',
        'bg-black/20 backdrop-blur-xl backdrop-saturate-150',
        'select-none',
        'transition-opacity duration-500',
        isVisible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <MenuBar />
      <SystemTray />
    </header>
  )
}

export default TopBar
