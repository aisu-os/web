import { BootScreen } from '@/shell/boot'
import { LoginScreen } from '@/shell/login'
import { Desktop } from '@/shell/desktop'
import { useAuthStore } from '@/stores/use-auth-store'
import { isMobile, MobileBlocker } from '@/components/MobileBlocker'

function App() {
  const phase = useAuthStore((s) => s.phase)
  const initializeAuth = useAuthStore((s) => s.initializeAuth)

  if (isMobile) return <MobileBlocker />

  return (
    <>
      {phase === 'authenticated' && <Desktop isReady />}
      <LoginScreen />
      <BootScreen onComplete={initializeAuth} />
    </>
  )
}

export default App
