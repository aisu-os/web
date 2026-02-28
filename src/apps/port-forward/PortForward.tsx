import { useEffect, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import {
  createPortForwardStore,
  PortForwardStoreContext,
  usePortForwardStore,
} from './hooks/use-port-forward-store'
import { MAX_FORWARDS } from './port-forward.constants'
import EmptyState from './components/EmptyState'
import ForwardItem from './components/ForwardItem'
import CreateForwardDialog from './components/CreateForwardDialog'

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const PortForwardInner = () => {
  const forwards = usePortForwardStore((s) => s.forwards)
  const isLoading = usePortForwardStore((s) => s.isLoading)
  const loadForwards = usePortForwardStore((s) => s.loadForwards)
  const openCreateDialog = usePortForwardStore((s) => s.openCreateDialog)
  const isCreating = usePortForwardStore((s) => s.isCreating)

  useEffect(() => {
    loadForwards()
  }, [loadForwards])

  const hasForwards = forwards.length > 0
  const isAtLimit = forwards.length >= MAX_FORWARDS

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', position: 'relative', overflow: 'hidden', userSelect: 'none', backgroundColor: '#1E1E2E', color: '#fff', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}
    >
      {/* Header */}
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48, padding: '0 16px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div>
          <h1 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: 0 }}>Port Forward</h1>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Local portlarni internetga ochish</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{forwards.length}/{MAX_FORWARDS}</span>
          <button
            onClick={openCreateDialog}
            disabled={isAtLimit}
            className={cn(
              'flex items-center rounded-lg',
              'bg-sky-500/15 text-sky-400 font-medium',
              'hover:bg-sky-500/25 transition-colors',
              isAtLimit && 'opacity-40 cursor-not-allowed hover:bg-sky-500/15'
            )}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 12 }}
          >
            <PlusIcon />
            Yangi
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Yuklanmoqda...</span>
        </div>
      ) : hasForwards ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {forwards.map((forward) => (
            <ForwardItem key={forward.id} forward={forward} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Create dialog overlay */}
      <AnimatePresence>
        {isCreating && <CreateForwardDialog />}
      </AnimatePresence>
    </div>
  )
}

interface PortForwardProps {
  windowId?: string
}

const PortForward = ({ windowId: _windowId = '' }: PortForwardProps) => {
  const store = useMemo(() => createPortForwardStore(), [])

  return (
    <PortForwardStoreContext.Provider value={store}>
      <PortForwardInner />
    </PortForwardStoreContext.Provider>
  )
}

export default PortForward
