import { useId } from 'react'
import { cn } from '@/lib/cn'
import { usePortForwardStore } from '../hooks/use-port-forward-store'

const TunnelIllustration = () => {
  const id = useId()
  const gradId = `${id}-empty`
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="22" stroke={`url(#${gradId})`} strokeWidth="1.5" opacity="0.2" />
      <circle cx="32" cy="32" r="14" stroke={`url(#${gradId})`} strokeWidth="1.5" opacity="0.15" />
      <ellipse cx="32" cy="32" rx="22" ry="8" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.15" />
      <ellipse cx="32" cy="32" rx="8" ry="22" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.15" />
      <path d="M14 32H50" stroke={`url(#${gradId})`} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M44 26L50 32L44 38" stroke={`url(#${gradId})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
      <circle cx="20" cy="32" r="3" fill={`url(#${gradId})`} opacity="0.15" />
      <circle cx="44" cy="32" r="3" fill={`url(#${gradId})`} opacity="0.15" />
    </svg>
  )
}

const EmptyState = () => {
  const openCreateDialog = usePortForwardStore((s) => s.openCreateDialog)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ marginBottom: 16 }}>
        <TunnelIllustration />
      </div>
      <h2 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
        Port Forward yo'q
      </h2>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', maxWidth: 260, marginBottom: 20, lineHeight: 1.6 }}>
        Local portingizni public URL ga aylantiring. Dev serverlar, API lar va webhook lar uchun ideal.
      </p>
      <button
        onClick={openCreateDialog}
        className={cn(
          'rounded-lg',
          'bg-sky-500/15 text-sky-400 font-medium',
          'hover:bg-sky-500/25 transition-colors'
        )}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 12 }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Birinchi Forward yarating
      </button>
    </div>
  )
}

export default EmptyState
