import '@xterm/xterm/css/xterm.css'

import { useRef, useEffect, useCallback } from 'react'
import { useTerminal } from '../hooks/use-terminal'
import { useTerminalWebSocket } from '../hooks/use-terminal-websocket'
import { useWindowStore } from '@/stores/use-window-store'
import type { TerminalStatus } from '../types'

const STATUS_MESSAGES: Record<TerminalStatus, string | null> = {
  idle: null,
  connecting: 'Connecting...',
  'starting-container': 'Starting container...',
  connected: null,
  disconnected: 'Disconnected',
  error: 'An error occurred',
}

interface TerminalScreenProps {
  windowId?: string
}

export default function TerminalScreen({ windowId }: TerminalScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const errorRef = useRef<string | null>(null)

  // Get saved sessionId from windowProps
  const savedSessionId = windowId
    ? (useWindowStore.getState().getWindowProps(windowId)?.sessionId as string | undefined)
    : undefined

  const { sendInput, sendResize, connect, disconnect, status } = useTerminalWebSocket({
    sessionId: savedSessionId,
    onData: (data) => {
      write(data)
    },
    onReady: (sessionId) => {
      // Save sessionId to windowProps — for session persistence
      if (windowId) {
        useWindowStore.getState().setWindowProps(windowId, { sessionId })
      }
      fit()
      // Status change closes overlay — focus after re-render + paint
      setTimeout(() => {
        focus()
      }, 100)
    },
    onError: (msg) => {
      errorRef.current = msg
    },
  })

  const { init, write, fit, focus, dispose } = useTerminal({
    onData: (data) => {
      sendInput(data)
    },
    onResize: (cols, rows) => {
      sendResize(cols, rows)
    },
  })

  const initTerminal = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return
      init(el)
    },
    [init],
  )

  // WebSocket connect + ResizeObserver
  useEffect(() => {
    connect()

    const container = containerRef.current
    if (container) {
      resizeObserverRef.current = new ResizeObserver(() => {
        fit()
      })
      resizeObserverRef.current.observe(container)
    }

    return () => {
      resizeObserverRef.current?.disconnect()
      disconnect()
      dispose()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const statusMessage = STATUS_MESSAGES[status]
  const showOverlay = status !== 'connected' && status !== 'idle'

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: '#1E1E2E' }}
    >
      <div
        ref={initTerminal}
        className="h-full w-full"
        style={{ padding: '4px 4px 4px 8px' }}
        onClick={focus}
      />

      {showOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1E1E2E]/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            {status !== 'error' && status !== 'disconnected' && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#585B70] border-t-[#89B4FA]" />
            )}
            <span className="text-sm text-[#BAC2DE]">
              {status === 'error' ? (errorRef.current ?? statusMessage) : statusMessage}
            </span>
            {(status === 'error' || status === 'disconnected') && (
              <button
                type="button"
                onClick={() => {
                  errorRef.current = null
                  connect()
                }}
                className="mt-1 rounded-md bg-[#313244] px-4 py-1.5 text-xs text-[#CDD6F4] transition-colors hover:bg-[#45475A]"
              >
                Reconnect
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
