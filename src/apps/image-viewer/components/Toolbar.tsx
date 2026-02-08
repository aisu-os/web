import { cn } from '@/lib/cn'
import { useImageViewerStore } from '../hooks/use-image-viewer-store'
import { formatZoomPercent } from '../image-viewer.utils'

const Toolbar = () => {
  const imageInfo = useImageViewerStore((s) => s.imageInfo)
  const zoom = useImageViewerStore((s) => s.zoom)
  const zoomIn = useImageViewerStore((s) => s.zoomIn)
  const zoomOut = useImageViewerStore((s) => s.zoomOut)
  const rotateLeft = useImageViewerStore((s) => s.rotateLeft)
  const rotateRight = useImageViewerStore((s) => s.rotateRight)
  const isInfoPanelVisible = useImageViewerStore((s) => s.isInfoPanelVisible)
  const toggleInfoPanel = useImageViewerStore((s) => s.toggleInfoPanel)

  return (
    <div
      className={cn(
        'flex items-center h-10 px-3 gap-2',
        'border-b border-white/5 shrink-0'
      )}
    >
      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={zoomOut}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            'text-white/70 hover:text-white hover:bg-white/5'
          )}
          title="Zoom Out"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4 6H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>

        <span className="text-[11px] text-white/50 min-w-[40px] text-center tabular-nums">
          {formatZoomPercent(zoom)}
        </span>

        <button
          onClick={zoomIn}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            'text-white/70 hover:text-white hover:bg-white/5'
          )}
          title="Zoom In"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M4 6H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M6 4V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="w-px h-4 bg-white/10" />

      {/* Rotate controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={rotateLeft}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            'text-white/70 hover:text-white hover:bg-white/5'
          )}
          title="Rotate Left"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7A4.5 4.5 0 1 1 7 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M4.5 4.5L2.5 7L0.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={rotateRight}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            'text-white/70 hover:text-white hover:bg-white/5'
          )}
          title="Rotate Right"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11.5 7A4.5 4.5 0 1 0 7 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M9.5 4.5L11.5 7L13.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* File name (center) */}
      <div className="flex-1 text-center min-w-0">
        <span className="text-[12px] text-white/60 truncate block">
          {imageInfo?.name ?? 'Preview'}
        </span>
      </div>

      {/* Info panel toggle */}
      <button
        onClick={toggleInfoPanel}
        className={cn(
          'p-1.5 rounded-md transition-colors',
          isInfoPanelVisible
            ? 'text-white bg-white/10'
            : 'text-white/50 hover:text-white/70 hover:bg-white/5'
        )}
        title="Toggle Inspector"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="7" cy="5" r="0.75" fill="currentColor" />
          <path d="M7 7V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

export default Toolbar
