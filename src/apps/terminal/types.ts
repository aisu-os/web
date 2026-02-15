export type TerminalStatus =
  | 'idle'
  | 'connecting'
  | 'starting-container'
  | 'connected'
  | 'disconnected'
  | 'error'

export interface TerminalSessionInfo {
  sessionId: string
  status: TerminalStatus
}

export type TerminalControlMessage =
  | { type: 'resize'; rows: number; cols: number }
  | { type: 'status'; status: string }
  | { type: 'ready'; sessionId: string }
  | { type: 'error'; message: string }
