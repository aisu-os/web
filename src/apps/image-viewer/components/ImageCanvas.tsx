import { useRef, useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { useImageViewerStore } from '../hooks/use-image-viewer-store'
import { ZOOM_MIN, ZOOM_MAX } from '../image-viewer.constants'

const ImageCanvas = () => {
  const imageSrc = useImageViewerStore((s) => s.imageSrc)
  const imageInfo = useImageViewerStore((s) => s.imageInfo)
  const isLoading = useImageViewerStore((s) => s.isLoading)
  const error = useImageViewerStore((s) => s.error)
  const zoom = useImageViewerStore((s) => s.zoom)
  const rotation = useImageViewerStore((s) => s.rotation)
  const panX = useImageViewerStore((s) => s.panX)
  const panY = useImageViewerStore((s) => s.panY)
  const setZoom = useImageViewerStore((s) => s.setZoom)
  const setPan = useImageViewerStore((s) => s.setPan)
  const fitToWindow = useImageViewerStore((s) => s.fitToWindow)

  const containerRef = useRef<HTMLDivElement>(null)
  const isPanningRef = useRef(false)
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const [, setImageLoaded] = useState(false)

  // Fit to window on initial load
  useEffect(() => {
    if (imageInfo && containerRef.current) {
      const el = containerRef.current
      fitToWindow(el.clientWidth, el.clientHeight)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageInfo])

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      const newZoom = Math.max(ZOOM_MIN, Math.min(zoom + delta, ZOOM_MAX))
      setZoom(newZoom)
    },
    [zoom, setZoom]
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // Pan (drag)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      isPanningRef.current = true
      panStartRef.current = { x: e.clientX, y: e.clientY, panX, panY }

      const handleMouseMove = (me: MouseEvent) => {
        if (!isPanningRef.current) return
        const dx = me.clientX - panStartRef.current.x
        const dy = me.clientY - panStartRef.current.y
        setPan(panStartRef.current.panX + dx, panStartRef.current.panY + dy)
      }

      const handleMouseUp = () => {
        isPanningRef.current = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [panX, panY, setPan]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-white/30 text-sm">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400/60 text-sm">
        {error}
      </div>
    )
  }

  if (!imageSrc) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-white/20">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" />
          <circle cx="18" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M6 32L16 24L24 30L32 22L42 30"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[13px]">No image to display</span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'h-full w-full overflow-hidden cursor-grab active:cursor-grabbing',
        'bg-[#1a1a2e]'
      )}
      style={{
        backgroundImage: `
          linear-gradient(45deg, #222238 25%, transparent 25%),
          linear-gradient(-45deg, #222238 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #222238 75%),
          linear-gradient(-45deg, transparent 75%, #222238 75%)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="flex items-center justify-center h-full w-full"
        style={{
          transform: `translate(${panX}px, ${panY}px)`,
        }}
      >
        <img
          src={imageSrc}
          alt={imageInfo?.name ?? ''}
          className="max-w-none pointer-events-none"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
          }}
          onLoad={() => setImageLoaded(true)}
          draggable={false}
        />
      </div>
    </div>
  )
}

export default ImageCanvas
