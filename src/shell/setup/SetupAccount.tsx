import { useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'
import type { SetupAccountData } from '@/types'

interface SetupAccountProps {
  data: SetupAccountData
  errors: Partial<Record<keyof SetupAccountData, string>>
  onChange: (data: Partial<SetupAccountData>) => void
  onNext: () => void
}

const SetupAccount = ({ data, errors, onChange, onNext }: SetupAccountProps) => {
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => firstInputRef.current?.focus(), 400)
    return () => clearTimeout(timer)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onNext()
  }

  return (
    <div className="setup-form">
      <h2 className="setup-step__title">Hisobingizni yarating</h2>
      <p className="setup-step__subtitle">
        Shaxsiy ma'lumotlaringizni kiriting
      </p>

      <div className="setup-form__fields">
        <div className="setup-field">
          <label className="setup-field__label">Ism Familiya</label>
          <input
            ref={firstInputRef}
            type="text"
            className={cn(
              'setup-field__input',
              errors.fullName && 'setup-field__input--error'
            )}
            placeholder="Ism Familiya"
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            onKeyDown={handleKeyDown}
          />
          {errors.fullName && (
            <span className="setup-field__error">{errors.fullName}</span>
          )}
        </div>

        <div className="setup-field">
          <label className="setup-field__label">Foydalanuvchi nomi</label>
          <input
            type="text"
            className={cn(
              'setup-field__input',
              errors.username && 'setup-field__input--error'
            )}
            placeholder="username"
            value={data.username}
            onChange={(e) => onChange({ username: e.target.value })}
            onKeyDown={handleKeyDown}
          />
          {errors.username && (
            <span className="setup-field__error">{errors.username}</span>
          )}
        </div>

        <div className="setup-field">
          <label className="setup-field__label">Email</label>
          <input
            type="email"
            className={cn(
              'setup-field__input',
              errors.email && 'setup-field__input--error'
            )}
            placeholder="email@example.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            onKeyDown={handleKeyDown}
          />
          {errors.email && (
            <span className="setup-field__error">{errors.email}</span>
          )}
        </div>
      </div>

      <button
        type="button"
        className="setup-btn setup-btn--primary"
        onClick={onNext}
      >
        Davom etish
      </button>
    </div>
  )
}

export default SetupAccount
