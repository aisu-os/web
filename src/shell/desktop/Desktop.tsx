import { useEffect, useRef } from 'react'
import DesktopBackground from './DesktopBackground'
import DesktopItemComponent from './DesktopItem'
import ContextMenu from './ContextMenu'
import AboutDialog from './AboutDialog'
import MarqueeSelection from './MarqueeSelection'
import { TopBar } from '@/shell/taskbar'
import { Dock } from '@/shell/dock'
import { Window } from '@/shell/window'
import { useDesktopStore } from '@/stores/use-desktop-store'
import { useWindowStore } from '@/stores/use-window-store'
import { useProcessStore } from '@/stores/use-process-store'
import { useMenuBarStore } from '@/stores/use-menubar-store'
import { appRegistry } from '@/apps/_registry'
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
  const windows = useWindowStore((s) => s.windows)
  const processes = useProcessStore((s) => s.processes)
  const setAppMenuConfig = useMenuBarStore((s) => s.setAppMenuConfig)
  const setAppName = useMenuBarStore((s) => s.setAppName)

  useEffect(() => {
    const hiddenProcessIds = new Set(
      processes.filter((p) => p.isHidden).map((p) => p.id)
    )
    const focusedWindow = windows.find(
      (w) => w.isFocused && !w.isMinimized && !hiddenProcessIds.has(w.processId)
    )

    if (focusedWindow) {
      const entry = appRegistry[focusedWindow.appId]
      setAppMenuConfig(entry?.config.menuBar ?? null)
      setAppName(entry?.config.title ?? 'aisu')
    } else {
      setAppMenuConfig(null)
      setAppName('aisu')
    }
  }, [windows, processes, setAppMenuConfig, setAppName])

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

          {windows.map((win) => (
            <Window key={win.id} windowState={win} />
          ))}
        </div>

        <Dock isVisible={isReady} />
      </div>

      <ContextMenu />
      <AboutDialog />
    </div>
  )
}

export default Desktop
