import DesktopBackground from './DesktopBackground'
import { TopBar } from '@/shell/taskbar'
import { Dock } from '@/shell/dock'

interface DesktopProps {
  isReady: boolean
}

const Desktop = ({ isReady }: DesktopProps) => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <DesktopBackground isVisible={isReady} />

      <div className="relative z-1 flex flex-col w-full h-full">
        <TopBar isVisible={isReady} />

        <div className="flex-1" />

        <Dock isVisible={isReady} />
      </div>
    </div>
  )
}

export default Desktop
