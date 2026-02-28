import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { PortForward } from '../port-forward.types'
import { formatRelativeTime, formatUptime } from '../port-forward.utils'
import { usePortForwardStore } from '../hooks/use-port-forward-store'

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="4.5" y="4.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M9.5 4.5V3C9.5 2.17 8.83 1.5 8 1.5H3C2.17 1.5 1.5 2.17 1.5 3V8C1.5 8.83 2.17 9.5 3 9.5H4.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M8.5 1.5H12.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.5 1.5L6.5 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M10.5 8V11.5C10.5 12.05 10.05 12.5 9.5 12.5H2.5C1.95 12.5 1.5 12.05 1.5 11.5V4.5C1.5 3.95 1.95 3.5 2.5 3.5H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const TrashSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 4H11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M4.5 4V3C4.5 2.45 4.95 2 5.5 2H8.5C9.05 2 9.5 2.45 9.5 3V4" stroke="currentColor" strokeWidth="1.2" />
    <path d="M3.5 4L4 11.5C4 12.05 4.45 12.5 5 12.5H9C9.55 12.5 10 12.05 10 11.5L10.5 4" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{label}</p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500, margin: 0 }}>{value}</p>
    </div>
  )
}

interface ForwardItemProps {
  forward: PortForward
}

const ForwardItem = ({ forward }: ForwardItemProps) => {
  const expandedForwardId = usePortForwardStore((s) => s.expandedForwardId)
  const toggleExpanded = usePortForwardStore((s) => s.toggleExpanded)
  const deleteForward = usePortForwardStore((s) => s.deleteForward)
  const copyUrl = usePortForwardStore((s) => s.copyUrl)

  const isExpanded = expandedForwardId === forward.id
  const isActive = forward.status === 'active'

  return (
    <div
      className={cn(
        'rounded-lg border border-white/5',
        'bg-white/[0.02] hover:bg-white/[0.04]',
        'transition-colors'
      )}
    >
      <div
        onClick={() => toggleExpanded(forward.id)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', cursor: 'default' }}
      >
        {/* Status dot */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isActive ? '#34D399' : 'rgba(255,255,255,0.2)',
              boxShadow: isActive ? '0 0 6px rgba(52,211,153,0.4)' : 'none',
            }}
          />
          {isActive && (
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#34D399',
              }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.8)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {forward.subdomain}.t.aisu.run
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            Port {forward.containerPort} &middot; {formatRelativeTime(forward.createdAt)}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button
            onClick={(e) => { e.stopPropagation(); copyUrl(forward.url) }}
            className="rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
            style={{ padding: 6 }}
            title="URL nusxalash"
          >
            <CopyIcon />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); window.open(forward.url, '_blank') }}
            className="rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
            style={{ padding: 6 }}
            title="Brauzerda ochish"
          >
            <ExternalLinkIcon />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); deleteForward(forward.id) }}
            className="rounded-md text-white/30 hover:text-red-400/70 hover:bg-red-500/10 transition-colors"
            style={{ padding: 6 }}
            title="O'chirish"
          >
            <TrashSmallIcon />
          </button>
        </div>
      </div>

      {/* Expandable detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '4px 12px 10px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <Stat label="So'rovlar" value={forward.requestCount.toLocaleString()} />
              <Stat label="Ishlash vaqti" value={formatUptime(forward.createdAt)} />
              <Stat
                label="Oxirgi so'rov"
                value={forward.lastRequestAt ? formatRelativeTime(forward.lastRequestAt) : 'Hali yo\'q'}
              />
            </div>
            <div style={{ padding: '0 12px 10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', flexShrink: 0, userSelect: 'none' }}>URL</span>
                <span style={{ fontSize: 11, color: 'rgba(56,189,248,0.7)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {forward.url}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ForwardItem
