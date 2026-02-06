import { useState } from 'react'
import { BootScreen } from '@/shell/boot'
import { Desktop } from '@/shell/desktop'
import { isMobile, MobileBlocker } from '@/components/MobileBlocker'

function App() {
  const [bootCompleted, setBootCompleted] = useState(false)

  if (isMobile) return <MobileBlocker />

  return (
    <>
      <Desktop isReady={bootCompleted} />
      <BootScreen onComplete={() => setBootCompleted(true)} />
    </>
  )
}

export default App
