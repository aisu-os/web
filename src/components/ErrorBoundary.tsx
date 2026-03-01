import { Component, type ErrorInfo, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  /** Xatolik darajasi — UI ni moslashtirish uchun */
  level?: 'app' | 'shell' | 'global'
  /** Oyna yopish callback — app darajasida ishlatiladi */
  onClose?: () => void
  /** Komponent nomi — xatolik xabarida ko'rsatish uchun */
  name?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[ErrorBoundary:${this.props.name ?? this.props.level ?? 'unknown'}]`,
      error,
      errorInfo.componentStack,
    )
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.fallback) {
      return this.props.fallback
    }

    const { level = 'app', onClose, name } = this.props
    const { error } = this.state

    if (level === 'global') {
      return <GlobalFallback error={error} onRetry={this.handleRetry} />
    }

    if (level === 'shell') {
      return <ShellFallback name={name} onRetry={this.handleRetry} />
    }

    return <AppFallback error={error} onRetry={this.handleRetry} onClose={onClose} />
  }
}

function AppFallback({
  error,
  onRetry,
  onClose,
}: {
  error: Error | null
  onRetry: () => void
  onClose?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1E1E2E] text-white/70 p-6 gap-4">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-white/80">Ilova xatoga uchradi</p>
        <p className="text-xs text-white/40 max-w-[280px] break-words">
          {error?.message ?? 'Kutilmagan xatolik yuz berdi'}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRetry}
          className={cn(
            'px-3 py-1.5 text-xs rounded-md transition-colors',
            'bg-white/10 hover:bg-white/15 text-white/70',
          )}
        >
          Qayta urinish
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              'px-3 py-1.5 text-xs rounded-md transition-colors',
              'bg-white/5 hover:bg-white/10 text-white/50',
            )}
          >
            Yopish
          </button>
        )}
      </div>
    </div>
  )
}

function ShellFallback({
  name,
  onRetry,
}: {
  name?: string
  onRetry: () => void
}) {
  return (
    <div className="flex items-center justify-center h-full">
      <button
        onClick={onRetry}
        className="text-xs text-white/30 hover:text-white/50 transition-colors px-2 py-1"
        title={`${name ?? 'Komponent'} xatoga uchradi. Bosing qayta yuklash uchun.`}
      >
        {name ?? 'Komponent'} — qayta yuklash
      </button>
    </div>
  )
}

function GlobalFallback({
  error,
  onRetry,
}: {
  error: Error | null
  onRetry: () => void
}) {
  return (
    <div className="fixed inset-0 bg-[#0D0D1A] flex flex-col items-center justify-center text-white/70 p-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-white/90">Tizim xatosi</h1>
          <p className="text-sm text-white/50">
            Kutilmagan xatolik yuz berdi. Tizimni qayta yuklashga urinib ko'ring.
          </p>
          <p className="text-xs text-white/30 break-words">
            {error?.message}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            className={cn(
              'px-4 py-2 text-sm rounded-lg transition-colors',
              'bg-white/10 hover:bg-white/15 text-white/80',
            )}
          >
            Qayta yuklash
          </button>
          <button
            onClick={() => window.location.reload()}
            className={cn(
              'px-4 py-2 text-sm rounded-lg transition-colors',
              'bg-white/5 hover:bg-white/10 text-white/50',
            )}
          >
            Sahifani yangilash
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorBoundary
