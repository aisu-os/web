import { useRef } from 'react'
import DesktopBackground from './DesktopBackground'
import DesktopItemComponent from './DesktopItem'
import ContextMenu from './ContextMenu'
import MarqueeSelection from './MarqueeSelection'
import { TopBar } from '@/shell/taskbar'
import { Dock } from '@/shell/dock'
import { useDesktopStore } from '@/stores/use-desktop-store'
import { useMarqueeSelection } from '@/hooks/use-marquee-selection'

interface DesktopProps {
  isReady: boolean
}

const Desktop = ({ isReady }: DesktopProps) => {
  const desktopRef = useRef<HTMLDivElement>(null)
  const items = useDesktopStore((s) => s.items)
  const clearSelection = useDesktopStore((s) => s.clearSelection)
  const openContextMenu = useDesktopStore((s) => s.openContextMenu)
  const closeContextMenu = useDesktopStore((s) => s.closeContextMenu)

  const { marqueeRect } = useMarqueeSelection({ containerRef: desktopRef })

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = e.target as HTMLElement
    if (!target.closest('[data-desktop-item-id]')) {
      clearSelection()
      openContextMenu(e.clientX, e.clientY)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('[data-desktop-item-id]')) {
      closeContextMenu()
    }
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <DesktopBackground isVisible={isReady} />

      <div className="relative z-1 flex flex-col w-full h-full">
        <TopBar isVisible={isReady} />

        <div
          ref={desktopRef}
          className="relative flex-1"
          onContextMenu={handleContextMenu}
          onClick={handleClick}
        >
          {items.map((item) => (
            <DesktopItemComponent key={item.id} item={item} />
          ))}

          <MarqueeSelection rect={marqueeRect} />
        </div>

        <Dock isVisible={isReady} />
      </div>

      <ContextMenu />
    </div>
  )
}

export default Desktop
