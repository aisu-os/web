import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { usePortForwardStore } from '../hooks/use-port-forward-store'

const CreateForwardDialog = () => {
  const isCreating = usePortForwardStore((s) => s.isCreating)
  const isSubmitting = usePortForwardStore((s) => s.isSubmitting)
  const formPort = usePortForwardStore((s) => s.formPort)
  const formSubdomain = usePortForwardStore((s) => s.formSubdomain)
  const formError = usePortForwardStore((s) => s.formError)
  const closeCreateDialog = usePortForwardStore((s) => s.closeCreateDialog)
  const setFormPort = usePortForwardStore((s) => s.setFormPort)
  const setFormSubdomain = usePortForwardStore((s) => s.setFormSubdomain)
  const createForward = usePortForwardStore((s) => s.createForward)

  if (!isCreating) return null

  const previewSubdomain = formSubdomain || 'auto-generated'

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    fontSize: 13,
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.8)',
    outline: 'none',
    transition: 'border-color 0.15s, background-color 0.15s',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={closeCreateDialog}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'relative',
          zIndex: 10,
          width: 340,
          backgroundColor: 'rgba(42,42,62,0.95)',
          backdropFilter: 'blur(24px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          padding: 20,
        }}
      >
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 16 }}>
          Yangi Port Forward
        </h3>

        {/* Port input */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Local Port</label>
          <input
            type="number"
            value={formPort}
            onChange={(e) => setFormPort(e.target.value)}
            placeholder="masalan, 3000"
            min={1024}
            max={65535}
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)'
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
            }}
          />
        </div>

        {/* Subdomain input */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
            Subdomain <span style={{ color: 'rgba(255,255,255,0.2)' }}>(ixtiyoriy)</span>
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
              transition: 'border-color 0.15s, background-color 0.15s',
            }}
          >
            <input
              value={formSubdomain}
              onChange={(e) => setFormSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="auto-generated"
              maxLength={32}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: 13,
                backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.8)',
                outline: 'none',
                border: 'none',
              }}
            />
            <span style={{ paddingRight: 12, fontSize: 11, color: 'rgba(255,255,255,0.2)', flexShrink: 0, userSelect: 'none' }}>
              .t.aisu.run
            </span>
          </div>
        </div>

        {/* URL preview */}
        <div style={{
          marginBottom: 16,
          padding: '8px 12px',
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Public URL</span>
          <p style={{ fontSize: 12, color: 'rgba(56,189,248,0.7)', fontFamily: 'monospace', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            https://{previewSubdomain}.t.aisu.run
          </p>
        </div>

        {/* Error */}
        {formError && (
          <p style={{ fontSize: 11, color: 'rgba(248,113,113,0.8)', marginBottom: 12 }}>{formError}</p>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            onClick={closeCreateDialog}
            disabled={isSubmitting}
            className="rounded-lg text-white/40 hover:text-white/60 hover:bg-white/5 transition-colors"
            style={{ padding: '6px 12px', fontSize: 12 }}
          >
            Bekor
          </button>
          <button
            onClick={createForward}
            disabled={isSubmitting}
            className={cn(
              'rounded-lg font-medium',
              'bg-sky-500/20 text-sky-400',
              'hover:bg-sky-500/30 transition-colors',
              isSubmitting && 'opacity-50 cursor-wait'
            )}
            style={{ padding: '6px 16px', fontSize: 12 }}
          >
            {isSubmitting ? 'Yaratilmoqda...' : 'Yaratish'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CreateForwardDialog
