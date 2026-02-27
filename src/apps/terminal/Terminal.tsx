import TerminalScreen from './components/TerminalScreen'

interface TerminalProps {
  windowId?: string
}

export default function Terminal({ windowId }: TerminalProps) {
  return <TerminalScreen windowId={windowId} />
}
