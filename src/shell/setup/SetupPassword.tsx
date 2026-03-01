import { useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import type { SetupPasswordData } from '@/types'

interface SetupPasswordProps {
  data: SetupPasswordData
  errors: Partial<Record<keyof SetupPasswordData, string>>
  onChange: (data: Partial<SetupPasswordData>) => void
  onNext: () => void
}

const SetupPassword = ({ data, errors, onChange, onNext }: SetupPasswordProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 400)
    return () => clearTimeout(timer)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onNext()
  }

  return (
    <div className="setup-form">
      <h2 className="setup-step__title">Set Password</h2>
      <p className="setup-step__subtitle">
        Create a password to sign in to the system
      </p>

      <div className="setup-form__fields">
        <div className="setup-field">
          <label className="setup-field__label">Password</label>
          <div className="setup-field__password-wrapper">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              className={cn(
                'setup-field__input',
                errors.password && 'setup-field__input--error'
              )}
              placeholder="Enter password"
              value={data.password}
              onChange={(e) => onChange({ password: e.target.value })}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="setup-field__toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <span className="setup-field__error">{errors.password}</span>
          )}
        </div>

        <div className="setup-field">
          <label className="setup-field__label">Confirm Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'setup-field__input',
              errors.confirmPassword && 'setup-field__input--error'
            )}
            placeholder="Re-enter password"
            value={data.confirmPassword}
            onChange={(e) => onChange({ confirmPassword: e.target.value })}
            onKeyDown={handleKeyDown}
          />
          {errors.confirmPassword && (
            <span className="setup-field__error">{errors.confirmPassword}</span>
          )}
        </div>
      </div>

      <button
        type="button"
        className="setup-btn setup-btn--primary"
        onClick={onNext}
      >
        Continue
      </button>
    </div>
  )
}

export default SetupPassword
