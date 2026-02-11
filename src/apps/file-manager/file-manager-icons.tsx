import { useId } from 'react'
import type { FileNode } from '@/types'

interface IconProps {
  size?: number
}

export const FolderIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`folder-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <path
        d="M6 14C6 11.79 7.79 10 10 10H19L23 14H38C40.21 14 42 15.79 42 18V36C42 38.21 40.21 40 38 40H10C7.79 40 6 38.21 6 36V14Z"
        fill={`url(#folder-${id})`}
        opacity="0.2"
      />
      <path
        d="M6 18H42V36C42 38.21 40.21 40 38 40H10C7.79 40 6 38.21 6 36V18Z"
        fill={`url(#folder-${id})`}
        opacity="0.35"
      />
    </svg>
  )
}

export const DocumentIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`doc-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <path
        d="M12 6H30L36 12V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8C12 6.9 12.9 6 14 6H12Z"
        fill={`url(#doc-${id})`}
        opacity="0.15"
      />
      <path d="M12 8C12 6.9 12.9 6 14 6H30L36 12V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8Z" stroke={`url(#doc-${id})`} strokeWidth="1.5" fill="none" />
      <path d="M30 6V12H36" stroke={`url(#doc-${id})`} strokeWidth="1.5" fill="none" />
      <line x1="17" y1="20" x2="31" y2="20" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="17" y1="26" x2="29" y2="26" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="17" y1="32" x2="25" y2="32" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  )
}

export const ImageIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`img-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="32" height="32" rx="4" stroke={`url(#img-${id})`} strokeWidth="1.5" fill={`url(#img-${id})`} fillOpacity="0.1" />
      <circle cx="17" cy="17" r="3" fill="#FBBF24" opacity="0.7" />
      <path d="M8 32L16 24L22 29L30 19L40 28V36C40 38.21 38.21 40 36 40H12C9.79 40 8 38.21 8 36V32Z" fill={`url(#img-${id})`} opacity="0.2" />
    </svg>
  )
}

export const CodeIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`code-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <path d="M12 8C12 6.9 12.9 6 14 6H30L36 12V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8Z" stroke={`url(#code-${id})`} strokeWidth="1.5" fill={`url(#code-${id})`} fillOpacity="0.1" />
      <path d="M30 6V12H36" stroke={`url(#code-${id})`} strokeWidth="1.5" fill="none" />
      <path d="M20 22L16 26L20 30" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M28 22L32 26L28 30" stroke="#7DD3FC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  )
}

export const PdfIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`pdf-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>
      <path d="M12 8C12 6.9 12.9 6 14 6H30L36 12V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8Z" stroke={`url(#pdf-${id})`} strokeWidth="1.5" fill={`url(#pdf-${id})`} fillOpacity="0.1" />
      <path d="M30 6V12H36" stroke={`url(#pdf-${id})`} strokeWidth="1.5" fill="none" />
      <text x="24" y="31" textAnchor="middle" fontSize="9" fontWeight="600" fill="#F87171" opacity="0.8">PDF</text>
    </svg>
  )
}

export const SpreadsheetIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`sheet-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <path d="M12 8C12 6.9 12.9 6 14 6H30L36 12V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8Z" stroke={`url(#sheet-${id})`} strokeWidth="1.5" fill={`url(#sheet-${id})`} fillOpacity="0.1" />
      <path d="M30 6V12H36" stroke={`url(#sheet-${id})`} strokeWidth="1.5" fill="none" />
      <rect x="16" y="18" width="16" height="3" fill="#34D399" opacity="0.4" rx="0.5" />
      <rect x="16" y="23" width="16" height="3" fill="#34D399" opacity="0.3" rx="0.5" />
      <rect x="16" y="28" width="16" height="3" fill="#34D399" opacity="0.2" rx="0.5" />
      <line x1="22" y1="18" x2="22" y2="31" stroke="#34D399" strokeWidth="0.5" opacity="0.5" />
      <line x1="28" y1="18" x2="28" y2="31" stroke="#34D399" strokeWidth="0.5" opacity="0.5" />
    </svg>
  )
}

export const ArchiveIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`zip-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path d="M12 8C12 6.9 12.9 6 14 6H30L36 12V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8Z" stroke={`url(#zip-${id})`} strokeWidth="1.5" fill={`url(#zip-${id})`} fillOpacity="0.1" />
      <path d="M30 6V12H36" stroke={`url(#zip-${id})`} strokeWidth="1.5" fill="none" />
      <rect x="22" y="16" width="4" height="3" fill="#A78BFA" opacity="0.5" />
      <rect x="22" y="21" width="4" height="3" fill="#A78BFA" opacity="0.4" />
      <rect x="22" y="26" width="4" height="3" fill="#A78BFA" opacity="0.3" />
      <rect x="21" y="31" width="6" height="4" rx="1" stroke="#A78BFA" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  )
}

export const AudioIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`audio-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <path d="M12 8C12 6.9 12.9 6 14 6H30L36 12V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8Z" stroke={`url(#audio-${id})`} strokeWidth="1.5" fill={`url(#audio-${id})`} fillOpacity="0.1" />
      <path d="M30 6V12H36" stroke={`url(#audio-${id})`} strokeWidth="1.5" fill="none" />
      <circle cx="21" cy="31" r="3" fill="#FB923C" opacity="0.5" />
      <path d="M24 31V19L30 17V28" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <circle cx="27" cy="28" r="2.5" fill="#FB923C" opacity="0.4" />
    </svg>
  )
}

export const VideoIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`video-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <path d="M12 8C12 6.9 12.9 6 14 6H30L36 12V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8Z" stroke={`url(#video-${id})`} strokeWidth="1.5" fill={`url(#video-${id})`} fillOpacity="0.1" />
      <path d="M30 6V12H36" stroke={`url(#video-${id})`} strokeWidth="1.5" fill="none" />
      <path d="M20 20V32L30 26Z" fill="#F472B6" opacity="0.5" />
    </svg>
  )
}

export const GenericFileIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`generic-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <path d="M12 8C12 6.9 12.9 6 14 6H30L36 12V40C36 41.1 35.1 42 34 42H14C12.9 42 12 41.1 12 40V8Z" stroke={`url(#generic-${id})`} strokeWidth="1.5" fill={`url(#generic-${id})`} fillOpacity="0.1" />
      <path d="M30 6V12H36" stroke={`url(#generic-${id})`} strokeWidth="1.5" fill="none" />
    </svg>
  )
}

// Sidebar ikonalari
export const DesktopSidebarIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="10" rx="1.5" stroke="#7DD3FC" strokeWidth="1.2" fill="none" />
    <line x1="5" y1="14" x2="11" y2="14" stroke="#7DD3FC" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const DocumentsSidebarIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M4 2H10L13 5V13C13 13.55 12.55 14 12 14H4C3.45 14 3 13.55 3 13V3C3 2.45 3.45 2 4 2Z" stroke="#7DD3FC" strokeWidth="1.2" fill="none" />
    <path d="M10 2V5H13" stroke="#7DD3FC" strokeWidth="1.2" fill="none" />
  </svg>
)

export const DownloadsSidebarIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 2V10" stroke="#7DD3FC" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M5 8L8 11L11 8" stroke="#7DD3FC" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 13H13" stroke="#7DD3FC" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const PicturesSidebarIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="#7DD3FC" strokeWidth="1.2" fill="none" />
    <circle cx="5.5" cy="6.5" r="1.2" fill="#7DD3FC" opacity="0.6" />
    <path d="M2 11L5.5 8L8 10L10.5 7L14 10" stroke="#7DD3FC" strokeWidth="1" strokeLinejoin="round" opacity="0.5" />
  </svg>
)

export const MusicSidebarIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="5" cy="12" r="2" stroke="#7DD3FC" strokeWidth="1.2" fill="none" />
    <path d="M7 12V3L13 2V10" stroke="#7DD3FC" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="11" cy="10" r="2" stroke="#7DD3FC" strokeWidth="1.2" fill="none" />
  </svg>
)

export const VideosSidebarIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#7DD3FC" strokeWidth="1.2" fill="none" />
    <path d="M6 6V10L10 8Z" fill="#7DD3FC" opacity="0.6" />
  </svg>
)

export const TrashSidebarIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M5 5.5L5.5 13C5.5 13.28 5.72 13.5 6 13.5H10C10.28 13.5 10.5 13.28 10.5 13L11 5.5" stroke="#7DD3FC" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 5.5H12" stroke="#7DD3FC" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M6.5 5.5V4C6.5 3.45 6.95 3 7.5 3H8.5C9.05 3 9.5 3.45 9.5 4V5.5" stroke="#7DD3FC" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SIDEBAR_ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  desktop: DesktopSidebarIcon,
  documents: DocumentsSidebarIcon,
  downloads: DownloadsSidebarIcon,
  pictures: PicturesSidebarIcon,
  music: MusicSidebarIcon,
  videos: VideosSidebarIcon,
  trash: TrashSidebarIcon,
}

export function getSidebarIcon(iconKey: string): React.ComponentType<IconProps> {
  return SIDEBAR_ICON_MAP[iconKey] ?? DocumentsSidebarIcon
}

export function getFileIcon(node: FileNode): React.ComponentType<IconProps> {
  if (node.type === 'directory') return FolderIcon

  const ext = node.name.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'pdf':
      return PdfIcon
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return ImageIcon
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
    case 'json':
    case 'html':
    case 'css':
      return CodeIcon
    case 'xlsx':
    case 'xls':
    case 'csv':
      return SpreadsheetIcon
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
    case 'dmg':
      return ArchiveIcon
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'm3u':
      return AudioIcon
    case 'mp4':
    case 'mov':
    case 'avi':
    case 'mkv':
    case 'webm':
      return VideoIcon
    case 'md':
    case 'txt':
    case 'doc':
    case 'docx':
    case 'pptx':
      return DocumentIcon
    default:
      return GenericFileIcon
  }
}
