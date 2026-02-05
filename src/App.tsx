import { useState } from 'react'
import { BootScreen } from '@/shell/boot'
import { Desktop } from '@/shell/desktop'

function App() {
  const [bootCompleted, setBootCompleted] = useState(false)

  return (
    <>
      <Desktop isReady={bootCompleted} />
      <BootScreen onComplete={() => setBootCompleted(true)} />
    </>
  )
}

export default App
