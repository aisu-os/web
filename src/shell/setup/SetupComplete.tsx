import { useEffect, useRef } from 'react'

interface SetupCompleteProps {
  userName: string
  isSubmitting: boolean
  error: string | null
  onComplete: () => Promise<void>
}

const SetupComplete = ({ userName, isSubmitting, error, onComplete }: SetupCompleteProps) => {
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    onComplete()
  }, [onComplete])

  return (
    <div className="setup-complete">
      <div className="setup-complete__icon">{'\u2728'}</div>

      <h2 className="setup-complete__title">Welcome, {userName}!</h2>

      <p className="setup-complete__subtitle">
        Your account has been created successfully.
        <br />
        System is restarting...
      </p>

      {isSubmitting && (
        <div className="setup-complete__loader">
          <div className="setup-complete__spinner" />
        </div>
      )}

      {error && (
        <div className="setup-complete__error">
          {error}
          <button
            type="button"
            className="setup-btn setup-btn--primary setup-btn--small"
            onClick={() => {
              hasStarted.current = false
              onComplete()
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default SetupComplete
