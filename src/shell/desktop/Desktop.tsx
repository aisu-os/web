import DesktopBackground from './DesktopBackground'

interface DesktopProps {
  isReady: boolean
}

const Desktop = ({ isReady }: DesktopProps) => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <DesktopBackground isVisible={isReady} />

      <div className="relative z-1 flex flex-col w-full h-full">
        {/* Kelajakda: taskbar, desktop ikonlari, dock */}
      </div>
    </div>
  )
}

export default Desktop
