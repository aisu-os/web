import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'

interface LoginSwitchUserProps {
  onSubmit: (username: string, password: string) => void
  onBack: () => void
  onCreateNew: () => void
  error: string | null
  isLoading: boolean
  showBackButton: boolean
}

const UserIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const SmallUserIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const LockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const ArrowIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const LoginSwitchUser = ({
  onSubmit,
  onBack,
  onCreateNew,
  error,
  isLoading,
  showBackButton,
}: LoginSwitchUserProps) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [isEntering, setIsEntering] = useState(true)
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false)
    }, 900) // 0.3s delay + 0.5s animation
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => usernameRef.current?.focus(), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!error) return

    setIsShaking(true)
    setPassword('')

    const timer = setTimeout(() => {
      setIsShaking(false)
      usernameRef.current?.focus()
    }, 500)

    return () => clearTimeout(timer)
  }, [error])

  const handleSubmit = () => {
    if (!username.trim() || !password.trim() || isLoading) return
    onSubmit(username, password)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className={cn('login-switch', isEntering && 'login-switch--entering', isShaking && 'login-switch--shake')}>
      <div className="login-switch__icon">
        <UserIcon />
      </div>

      <div className="login-switch__title">Boshqa foydalanuvchi</div>

      {/* Username field */}
      <div
        className={cn(
          'login-switch__field',
          error && 'login-switch__field--error'
        )}
      >
        <div className="login-password__wrapper">
          <div className="login-password__icon">
            <SmallUserIcon />
          </div>
          <input
            ref={usernameRef}
            type="text"
            className="login-password__input"
            placeholder="Foydalanuvchi nomi"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Password field */}
      <div
        className={cn(
          'login-switch__field',
          error && 'login-switch__field--error'
        )}
      >
        <div className="login-password__wrapper">
          <div className="login-password__icon">
            <LockIcon />
          </div>
          <input
            type="password"
            className="login-password__input"
            placeholder="Parolni kiriting"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="button"
            className={cn(
              'login-password__submit',
              username.trim() &&
                password.trim() &&
                'login-password__submit--visible'
            )}
            onClick={handleSubmit}
            disabled={isLoading}
            tabIndex={-1}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      <div className="login-switch__actions">
        {showBackButton && (
          <button type="button" className="login-link" onClick={onBack}>
            ← Orqaga
          </button>
        )}
        <button type="button" className="login-link" onClick={onCreateNew}>
          Yangi foydalanuvchi yaratish
        </button>
      </div>
    </div>
  )
}

export default LoginSwitchUser
