interface IconProps {
  size?: number
}

export const FolderIcon = ({ size = 56 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="deskFolderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5AC8FA" />
        <stop offset="100%" stopColor="#007AFF" />
      </linearGradient>
    </defs>
    <path
      d="M6 16C6 13.79 7.79 12 10 12H20L24 16H46C48.21 16 50 17.79 50 20V44C50 46.21 48.21 48 46 48H10C7.79 48 6 46.21 6 44V16Z"
      fill="url(#deskFolderGrad)"
      opacity="0.9"
    />
    <path
      d="M6 22H50V44C50 46.21 48.21 48 46 48H10C7.79 48 6 46.21 6 44V22Z"
      fill="url(#deskFolderGrad)"
    />
    <path d="M6 22H50V26H6V22Z" fill="white" opacity="0.2" />
  </svg>
)

export const TextFileIcon = ({ size = 56 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="deskTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F5F5F7" />
        <stop offset="100%" stopColor="#D1D1D6" />
      </linearGradient>
    </defs>
    <path
      d="M14 6H36L44 14V48C44 49.1 43.1 50 42 50H14C12.9 50 12 49.1 12 48V8C12 6.9 12.9 6 14 6Z"
      fill="url(#deskTextGrad)"
    />
    <path d="M36 6V14H44" fill="#C7C7CC" />
    <path d="M36 6L44 14H36V6Z" fill="#E5E5EA" />
    <line x1="18" y1="24" x2="38" y2="24" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <line x1="18" y1="30" x2="34" y2="30" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <line x1="18" y1="36" x2="30" y2="36" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
  </svg>
)

export const ImageFileIcon = ({ size = 56 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="deskImgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F5F5F7" />
        <stop offset="100%" stopColor="#D1D1D6" />
      </linearGradient>
    </defs>
    <path
      d="M14 6H36L44 14V48C44 49.1 43.1 50 42 50H14C12.9 50 12 49.1 12 48V8C12 6.9 12.9 6 14 6Z"
      fill="url(#deskImgGrad)"
    />
    <path d="M36 6V14H44" fill="#C7C7CC" />
    <path d="M36 6L44 14H36V6Z" fill="#E5E5EA" />
    <circle cx="23" cy="26" r="3" fill="#FBBF24" opacity="0.7" />
    <path
      d="M16 42L24 32L30 37L36 28L40 34V44C40 45 39 46 38 46H18C17 46 16 45 16 44V42Z"
      fill="#34D399"
      opacity="0.3"
    />
  </svg>
)

export const DESKTOP_ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  'folder': FolderIcon,
  'text-file': TextFileIcon,
  'image-file': ImageFileIcon,
}
