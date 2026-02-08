import { useThemeStore } from '@/stores/use-theme-store'
import { WALLPAPERS } from '@/shell/desktop/desktop.constants'
import { cn } from '@/lib/cn'
import SettingsSection from '../shared/SettingsSection'

export default function WallpaperPanel() {
  const currentWallpaper = useThemeStore((s) => s.theme.wallpaper)

  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-semibold text-white/90 mb-5">Wallpaper</h1>

      <div className="mb-5 rounded-xl overflow-hidden border border-white/10">
        <img
          src={currentWallpaper}
          alt="Current wallpaper"
          className="w-full h-[160px] object-cover"
        />
      </div>

      <SettingsSection title="Desktop Pictures">
        <div className="grid grid-cols-4 gap-3 p-4">
          {WALLPAPERS.map((url) => (
            <button
              key={url}
              onClick={() => useThemeStore.getState().setWallpaper(url)}
              className={cn(
                'aspect-video rounded-lg overflow-hidden border-2 transition-all',
                currentWallpaper === url
                  ? 'border-blue-400 ring-1 ring-blue-400/50'
                  : 'border-transparent hover:border-white/20'
              )}
            >
              <img
                src={url}
                alt="Wallpaper"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </SettingsSection>
    </div>
  )
}
