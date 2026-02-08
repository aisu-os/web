import { cn } from '@/lib/cn'
import { useImageViewerStore } from '../hooks/use-image-viewer-store'
import { formatFileSize, formatDimensions, getImageFormat } from '../image-viewer.utils'

const InfoPanel = () => {
  const imageInfo = useImageViewerStore((s) => s.imageInfo)
  const imageSrc = useImageViewerStore((s) => s.imageSrc)

  if (!imageInfo) {
    return (
      <div
        className={cn(
          'w-[240px] shrink-0 p-4',
          'border-l border-white/5',
          'text-white/30 text-[12px]',
          'flex items-center justify-center'
        )}
      >
        No image loaded
      </div>
    )
  }

  const infoRows = [
    { label: 'Name', value: imageInfo.name },
    { label: 'Kind', value: getImageFormat(imageInfo.mimeType) },
    { label: 'Size', value: formatFileSize(imageInfo.size) },
    { label: 'Dimensions', value: formatDimensions(imageInfo.width, imageInfo.height) },
    { label: 'Path', value: imageInfo.path },
    { label: 'Color Space', value: 'sRGB' },
    { label: 'Color Profile', value: 'Display P3' },
  ]

  return (
    <div
      className={cn(
        'w-[240px] shrink-0 overflow-y-auto',
        'border-l border-white/5',
        'bg-[#1E1E2E]'
      )}
    >
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-[13px] font-medium text-white/80">General Info</h3>
      </div>

      <div className="px-4 py-3 flex justify-center border-b border-white/5">
        <div className="w-[120px] h-[90px] rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
          <img
            src={imageSrc ?? ''}
            alt={imageInfo.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      <div className="px-4 py-2">
        {infoRows.map(({ label, value }) => (
          <div key={label} className="flex py-1.5 border-b border-white/[0.03] last:border-0">
            <span className="text-[11px] text-white/40 w-[80px] shrink-0">{label}</span>
            <span className="text-[11px] text-white/70 break-all">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfoPanel
