import { useId } from 'react'

interface IconProps {
  size?: number
}

export const AiChatIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  const gradId = `${id}-aichat`
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <rect x="6" y="8" width="36" height="26" rx="6" stroke={`url(#${gradId})`} strokeWidth="2" fill="none" />
      <path d="M18 34L14 40V34" stroke={`url(#${gradId})`} strokeWidth="2" strokeLinejoin="round" />
      {/* Sparkle */}
      <circle cx="17" cy="21" r="1.5" fill="#7DD3FC" />
      <circle cx="24" cy="21" r="1.5" fill="#7DD3FC" />
      <circle cx="31" cy="21" r="1.5" fill="#7DD3FC" />
      <path d="M24 13L25 16L28 16L25.5 18L26.5 21L24 19L21.5 21L22.5 18L20 16L23 16Z" fill="#BAE6FD" opacity="0.6" />
    </svg>
  )
}

export const TerminalIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  const gradId = `${id}-term`
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <rect x="5" y="8" width="38" height="32" rx="5" stroke={`url(#${gradId})`} strokeWidth="2" fill="none" />
      <rect x="5" y="8" width="38" height="8" rx="5" fill={`url(#${gradId})`} opacity="0.15" />
      <circle cx="11" cy="12" r="1.5" fill="#F87171" opacity="0.8" />
      <circle cx="16" cy="12" r="1.5" fill="#FBBF24" opacity="0.8" />
      <circle cx="21" cy="12" r="1.5" fill="#34D399" opacity="0.8" />
      <path d="M14 24L20 28L14 32" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="24" y1="32" x2="34" y2="32" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

export const FileManagerIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  const gradId = `${id}-folder`
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <path
        d="M6 14C6 11.7909 7.79086 10 10 10H19L23 14H38C40.2091 14 42 15.7909 42 18V36C42 38.2091 40.2091 40 38 40H10C7.79086 40 6 38.2091 6 36V14Z"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M6 18H42V36C42 38.2091 40.2091 40 38 40H10C7.79086 40 6 38.2091 6 36V18Z"
        fill={`url(#${gradId})`}
        opacity="0.1"
      />
    </svg>
  )
}

export const TextEditorIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  const gradId = `${id}-editor`
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <rect x="8" y="6" width="32" height="36" rx="4" stroke={`url(#${gradId})`} strokeWidth="2" fill="none" />
      <path d="M8 14H40" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.3" />
      <line x1="14" y1="20" x2="34" y2="20" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="14" y1="26" x2="30" y2="26" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="14" y1="32" x2="26" y2="32" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  )
}

export const ImageViewerIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  const gradId = `${id}-imgview`
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <rect x="6" y="8" width="36" height="32" rx="4" stroke={`url(#${gradId})`} strokeWidth="2" fill="none" />
      <circle cx="16" cy="18" r="3" fill="#FBBF24" opacity="0.7" />
      <path d="M6 32L16 24L24 30L32 20L42 28V36C42 38.2091 40.2091 40 38 40H10C7.79086 40 6 38.2091 6 36V32Z" fill={`url(#${gradId})`} opacity="0.15" />
      <path d="M16 24L24 30L32 20L42 28" stroke="#7DD3FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  )
}

export const AppMarketIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  const gradId = `${id}-market`
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="13" height="13" rx="3" stroke={`url(#${gradId})`} strokeWidth="2" fill={`url(#${gradId})`} fillOpacity="0.15" />
      <rect x="27" y="8" width="13" height="13" rx="3" stroke={`url(#${gradId})`} strokeWidth="2" fill={`url(#${gradId})`} fillOpacity="0.1" />
      <rect x="8" y="27" width="13" height="13" rx="3" stroke={`url(#${gradId})`} strokeWidth="2" fill={`url(#${gradId})`} fillOpacity="0.1" />
      <rect x="27" y="27" width="13" height="13" rx="3" stroke={`url(#${gradId})`} strokeWidth="2" fill={`url(#${gradId})`} fillOpacity="0.15" />
    </svg>
  )
}

export const SettingsIcon = ({ size = 48 }: IconProps) => {
  const id = useId()
  const gradId = `${id}-settings`
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <path
        d="M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M24 6L26.5 10.5L31.5 9L30 14L35.5 16L31.5 19L34 24L30 23L30 28.5L26.5 25.5L24 30L21.5 25.5L18 28.5L18 23L14 24L16.5 19L12.5 16L18 14L16.5 9L21.5 10.5L24 6Z"
        stroke={`url(#${gradId})`}
        strokeWidth="1.5"
        fill={`url(#${gradId})`}
        fillOpacity="0.08"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="4" stroke="#7DD3FC" strokeWidth="1" opacity="0.4" fill="none" />
    </svg>
  )
}
