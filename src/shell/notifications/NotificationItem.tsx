import { useCallback } from 'react'
import { motion } from 'framer-motion'
import type { Notification, NotificationType } from '@/types'
import { useNotificationStore } from '@/stores/use-notification-store'
import { cn } from '@/lib/cn'
import NotificationIcon from './NotificationIcon'

const accentColors: Record<NotificationType, string> = {
  success: 'bg-emerald-400',
  error: 'bg-red-400',
  warning: 'bg-amber-400',
  info: 'bg-blue-400',
}

const progressColors: Record<NotificationType, string> = {
  success: 'bg-emerald-400/80',
  error: 'bg-red-400/80',
  warning: 'bg-amber-400/80',
  info: 'bg-blue-400/80',
}

interface NotificationItemProps {
  notification: Notification
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const remove = useNotificationStore((s) => s.remove)

  const handleClose = useCallback(() => {
    remove(notification.id)
  }, [remove, notification.id])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'group/notif pointer-events-auto w-[360px]',
        'rounded-xl overflow-hidden',
        'bg-black/50 backdrop-blur-2xl backdrop-saturate-150',
        'shadow-2xl shadow-black/30',
        'ring-1 ring-inset ring-white/[0.08]',
        'flex flex-row',
      )}
    >
      {/* Chap rang chizig'i */}
      <div className={cn('w-[3px] shrink-0', accentColors[notification.type])} />

      {/* Asosiy kontent */}
      <div className="flex-1 min-w-0 p-3">
        <div className="flex items-start gap-2.5">
          {/* Ikonka */}
          <div className="shrink-0 mt-0.5">
            {notification.icon ?? <NotificationIcon type={notification.type} />}
          </div>

          {/* Matn */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white/90 leading-tight truncate">
              {notification.title}
            </p>
            {notification.message && (
              <p className="mt-0.5 text-[12px] text-white/50 leading-snug line-clamp-2">
                {notification.message}
              </p>
            )}

            {/* Action tugmalar */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                {notification.actions.map((action) => (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-medium',
                      'text-white/70 hover:text-white/90',
                      'bg-white/[0.06] hover:bg-white/[0.12]',
                      'ring-1 ring-inset ring-white/[0.08]',
                      'transition-colors duration-150',
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Yopish tugmasi */}
          <button
            onClick={handleClose}
            className={cn(
              'shrink-0 w-5 h-5 rounded-full',
              'flex items-center justify-center',
              'text-white/30 hover:text-white/70',
              'hover:bg-white/10',
              'opacity-0 group-hover/notif:opacity-100',
              'transition-all duration-150',
            )}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        {notification.progress !== undefined && (
          <div className="mt-2.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className={cn('h-full rounded-full', progressColors[notification.type])}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, notification.progress))}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default NotificationItem
