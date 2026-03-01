import { useCallback, useRef } from 'react'
import { notify } from '@/stores/use-notification-store'
import { cn } from '@/lib/cn'

const buttons = [
  {
    label: 'Success',
    color: 'bg-emerald-500/20 hover:bg-emerald-500/30 ring-emerald-500/30 text-emerald-400',
    action: () => notify.success('Completed successfully', {
      message: 'File saved successfully.',
    }),
  },
  {
    label: 'Error',
    color: 'bg-red-500/20 hover:bg-red-500/30 ring-red-500/30 text-red-400',
    action: () => notify.error('An error occurred', {
      message: 'Problem connecting to server.',
    }),
  },
  {
    label: 'Warning',
    color: 'bg-amber-500/20 hover:bg-amber-500/30 ring-amber-500/30 text-amber-400',
    action: () => notify.warning('Attention!', {
      message: 'Disk space is running low.',
    }),
  },
  {
    label: 'Info',
    color: 'bg-blue-500/20 hover:bg-blue-500/30 ring-blue-500/30 text-blue-400',
    action: () => notify.info('Update available', {
      message: 'aisu v2.1 is ready to download.',
    }),
  },
] as const

const NotificationDemo = () => {
  const progressRef = useRef<string | null>(null)

  const handleWithActions = useCallback(() => {
    notify.info('New message received', {
      message: 'Ali sent you a message.',
      duration: 0,
      actions: [
        { label: 'Read', onClick: () => notify.success('Message read') },
        { label: 'Close', onClick: () => {} },
      ],
    })
  }, [])

  const handleProgress = useCallback(() => {
    if (progressRef.current) return
    const id = notify.info('Downloading...', {
      message: 'system-update.pkg',
      progress: 0,
      duration: 0,
    })
    progressRef.current = id
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        notify.update(id, { progress: 100, title: 'Downloaded!', type: 'success' })
        setTimeout(() => {
          notify.remove(id)
          progressRef.current = null
        }, 2000)
        return
      }
      notify.update(id, { progress })
    }, 400)
  }, [])

  const handlePersistent = useCallback(() => {
    notify.warning('Battery low', {
      message: '10% charge remaining. Connect your charger.',
      duration: 0,
    })
  }, [])

  return (
    <div className="h-full flex flex-col bg-black/20 text-white/90 select-none">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-[15px] font-semibold text-white/90">Notification Demo</h1>
        <p className="mt-1 text-[12px] text-white/40">
          Test the notification system
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {/* Basic types */}
        <Section title="Basic types">
          <div className="grid grid-cols-2 gap-2">
            {buttons.map((btn) => (
              <Button
                key={btn.label}
                label={btn.label}
                className={btn.color}
                onClick={btn.action}
              />
            ))}
          </div>
        </Section>

        {/* Additional features */}
        <Section title="Additional features">
          <div className="flex flex-col gap-2">
            <Button
              label="With actions"
              className="bg-violet-500/20 hover:bg-violet-500/30 ring-violet-500/30 text-violet-400"
              onClick={handleWithActions}
            />
            <Button
              label="Progress bar"
              className="bg-cyan-500/20 hover:bg-cyan-500/30 ring-cyan-500/30 text-cyan-400"
              onClick={handleProgress}
            />
            <Button
              label="Persistent"
              className="bg-orange-500/20 hover:bg-orange-500/30 ring-orange-500/30 text-orange-400"
              onClick={handlePersistent}
            />
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-white/30 mb-2">{title}</p>
      {children}
    </div>
  )
}

function Button({ label, className, onClick }: { label: string; className: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2.5 rounded-lg text-[13px] font-medium',
        'ring-1 ring-inset',
        'transition-colors duration-150',
        'cursor-default',
        className,
      )}
    >
      {label}
    </button>
  )
}

export default NotificationDemo
