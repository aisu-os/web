import { useEffect } from 'react'
import { BootScreen } from '@/shell/boot'
import { LoginScreen } from '@/shell/login'
import { SetupScreen } from '@/shell/setup'
import { Desktop } from '@/shell/desktop'
import { useAuthStore } from '@/stores/use-auth-store'
import { useCursorStore } from '@/stores/use-cursor-store'
import { isMobile, MobileBlocker } from '@/components/MobileBlocker'
import { CursorOverlay, useCursorHandlers } from '@/cursor'
import ErrorBoundary from '@/components/ErrorBoundary'
import '@/cursor/cursor.css'

function App() {
  const phase = useAuthStore((s) => s.phase)
  const initializeAuth = useAuthStore((s) => s.initializeAuth)
  const goToSetup = useAuthStore((s) => s.goToSetup)
  const bootCount = useAuthStore((s) => s.bootCount)
  const isCursorEnabled = useCursorStore((s) => s.isEnabled)

  useCursorHandlers()

  // NOTE(beta): URL da token bo'lsa, boot tugagandan so'ng avtomatik setup'ga o'tish
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('token') && phase === 'login') {
      goToSetup()
    }
  }, [phase, goToSetup])

  useEffect(() => {
    document.documentElement.classList.toggle('custom-cursor-active', isCursorEnabled)
    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [isCursorEnabled])

  if (isMobile) return <MobileBlocker />

  return (
    <ErrorBoundary level="global" name="App">
      {phase === 'authenticated' && <Desktop isReady />}
      <LoginScreen />
      <SetupScreen />
      <BootScreen key={bootCount} onComplete={initializeAuth} />
      <CursorOverlay />
    </ErrorBoundary>
  )
}

export default App
