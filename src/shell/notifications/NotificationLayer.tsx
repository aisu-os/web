import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import { useNotificationStore } from '@/stores/use-notification-store'
import { Z_INDEX } from '@/lib/constants'
import NotificationItem from './NotificationItem'

const NotificationLayer = () => {
  const notifications = useNotificationStore((s) => s.notifications)

  return createPortal(
    <div
      className="fixed top-8 right-3 flex flex-col gap-2.5 pointer-events-none"
      style={{ zIndex: Z_INDEX.notifications }}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}

export default NotificationLayer
