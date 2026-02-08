import type { NotificationType } from '@/types'

const iconColors: Record<NotificationType, string> = {
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',
}

interface NotificationIconProps {
  type: NotificationType
}

const NotificationIcon = ({ type }: NotificationIconProps) => {
  const color = iconColors[type]

  if (type === 'success') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.5" opacity="0.9" />
        <path d="M6 10.5L8.5 13L14 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'error') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.5" opacity="0.9" />
        <path d="M7 7L13 13M13 7L7 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'warning') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L19 17H1L10 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" opacity="0.9" />
        <path d="M10 8V11.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="14" r="0.75" fill={color} />
      </svg>
    )
  }

  // info
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.5" opacity="0.9" />
      <path d="M10 9V14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="0.75" fill={color} />
    </svg>
  )
}

export default NotificationIcon
