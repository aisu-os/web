import { cn } from '@/lib/cn'
import { useFileManagerStore } from '../hooks/use-file-manager-store'

const Breadcrumb = () => {
  const currentPath = useFileManagerStore((s) => s.currentPath)
  const navigateTo = useFileManagerStore((s) => s.navigateTo)

  const segments = currentPath === '/'
    ? [{ label: '/', path: '/' }]
    : currentPath.split('/').filter(Boolean).reduce<{ label: string; path: string }[]>(
        (acc, segment) => {
          const prevPath = acc.length > 0 ? acc[acc.length - 1].path : ''
          acc.push({ label: segment, path: prevPath + '/' + segment })
          return acc
        },
        []
      )

  return (
    <div
      className={cn(
        'flex items-center h-7 px-3 gap-1',
        'text-[12px] text-white/50',
        'border-b border-white/5 shrink-0 overflow-x-auto'
      )}
    >
      <button
        onClick={() => navigateTo('/')}
        className="hover:text-white/80 transition-colors shrink-0"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/40">
          <path d="M2 5.5L6 2L10 5.5V10.5H7.5V7.5H4.5V10.5H2V5.5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      </button>
      {segments.map((segment, index) => (
        <span key={segment.path} className="flex items-center gap-1 shrink-0">
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="text-white/20">
            <path d="M1.5 1.5L4.5 5L1.5 8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <button
            onClick={() => navigateTo(segment.path)}
            className={cn(
              'transition-colors',
              index === segments.length - 1
                ? 'text-white/80 font-medium'
                : 'text-white/50 hover:text-white/80'
            )}
          >
            {segment.label}
          </button>
        </span>
      ))}
    </div>
  )
}

export default Breadcrumb
