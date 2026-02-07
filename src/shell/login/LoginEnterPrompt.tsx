import { useEffect, useRef } from 'react'

interface LoginEnterPromptProps {
  onContinue: () => void
}

const LoginEnterPrompt = ({ onContinue }: LoginEnterPromptProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      buttonRef.current?.focus()
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onContinue()
    }
  }

  return (
    <div className="login-password">
      <button
        ref={buttonRef}
        onClick={onContinue}
        onKeyDown={handleKeyDown}
        className="login-enter-prompt"
      >
        Davom etish uchun bosing
      </button>
    </div>
  )
}

export default LoginEnterPrompt
