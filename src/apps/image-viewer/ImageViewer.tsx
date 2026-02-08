import { useMemo, useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import {
  createImageViewerStore,
  ImageViewerStoreContext,
  useImageViewerStore,
} from './hooks/use-image-viewer-store'
import ImageCanvas from './components/ImageCanvas'
import Toolbar from './components/Toolbar'
import InfoPanel from './components/InfoPanel'

interface ImageViewerProps {
  filePath?: string
  windowId?: string
}

const ImageViewerInner = () => {
  const isInfoPanelVisible = useImageViewerStore((s) => s.isInfoPanelVisible)
  const zoomIn = useImageViewerStore((s) => s.zoomIn)
  const zoomOut = useImageViewerStore((s) => s.zoomOut)
  const rotateLeft = useImageViewerStore((s) => s.rotateLeft)
  const rotateRight = useImageViewerStore((s) => s.rotateRight)
  const actualSize = useImageViewerStore((s) => s.actualSize)
  const fitToWindow = useImageViewerStore((s) => s.fitToWindow)
  const toggleInfoPanel = useImageViewerStore((s) => s.toggleInfoPanel)

  const canvasContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.metaKey) return

      switch (e.key) {
        case '=':
        case '+':
          e.preventDefault()
          zoomIn()
          break
        case '-':
          e.preventDefault()
          zoomOut()
          break
        case '0':
          e.preventDefault()
          actualSize()
          break
        case '9': {
          e.preventDefault()
          const el = canvasContainerRef.current
          if (el) fitToWindow(el.clientWidth, el.clientHeight)
          break
        }
        case 'l':
          e.preventDefault()
          rotateLeft()
          break
        case 'r':
          e.preventDefault()
          rotateRight()
          break
        case 'i':
          e.preventDefault()
          toggleInfoPanel()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [zoomIn, zoomOut, actualSize, fitToWindow, rotateLeft, rotateRight, toggleInfoPanel])

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full',
        'bg-[#1E1E2E] text-white',
        'rounded-b-lg overflow-hidden select-none'
      )}
    >
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <div ref={canvasContainerRef} className="flex-1 overflow-hidden">
          <ImageCanvas />
        </div>
        {isInfoPanelVisible && <InfoPanel />}
      </div>
    </div>
  )
}

const ImageViewer = ({ filePath }: ImageViewerProps) => {
  const store = useMemo(
    () => createImageViewerStore(filePath),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <ImageViewerStoreContext.Provider value={store}>
      <ImageViewerInner />
    </ImageViewerStoreContext.Provider>
  )
}

export default ImageViewer
