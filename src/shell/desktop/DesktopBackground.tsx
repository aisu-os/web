import { cn } from '@/lib/cn'
import { useThemeStore } from '@/stores/use-theme-store'
import { useWallpaper } from '@/hooks/use-wallpaper'

interface DesktopBackgroundProps {
  isVisible: boolean
}

const DesktopBackground = ({ isVisible }: DesktopBackgroundProps) => {
  const wallpaper = useThemeStore((s) => s.theme.wallpaper)
  const { isLoaded, backgroundStyle } = useWallpaper(wallpaper)

  return (
    <div
      className={cn(
        'absolute inset-0 opacity-0 transition-opacity duration-1000 ease-out will-change-[opacity]',
        isVisible && isLoaded && 'opacity-100'
      )}
      style={backgroundStyle}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.2)_100%)] pointer-events-none" />
    </div>
  )
}

export default DesktopBackground
