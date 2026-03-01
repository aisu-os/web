import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'

interface LoginPasswordFieldProps {
  onSubmit: (password: string) => void
  error: string | null
  isLoading: boolean
}

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

const LoginPasswordField = ({
  onSubmit,
  error,
  isLoading,
}: LoginPasswordFieldProps) => {
  const [password, setPassword] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [isEntering, setIsEntering] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  // Remove class after enter animation ends
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false)
    }, 1600) // 0.9s delay + 0.6s animation
    return () => clearTimeout(timer)
  }, [])

  // Autofocus
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Shake animation on error
  useEffect(() => {
    if (!error) return

    setIsShaking(true)
    setPassword('')

    const timer = setTimeout(() => {
      setIsShaking(false)
      inputRef.current?.focus()
    }, 500)

    return () => clearTimeout(timer)
  }, [error])

  const handleSubmit = () => {
    if (!password.trim() || isLoading) return
    onSubmit(password)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div
      className={cn(
        'login-password',
        isEntering && 'login-password--entering',
        isShaking && 'login-password--shake',
        error && 'login-password--error'
      )}
    >
      <div className="login-password__wrapper">
        <div className="login-password__icon">
          <LockIcon />
        </div>
        <input
          ref={inputRef}
          type="password"
          className="login-password__input"
          placeholder="Enter password"
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
            password.trim() && 'login-password__submit--visible'
          )}
          onClick={handleSubmit}
          disabled={isLoading}
          tabIndex={-1}
        >
          <ArrowIcon />
        </button>
      </div>

      {error && <div className="login-error">{error}</div>}
    </div>
  )
}

export default LoginPasswordField
