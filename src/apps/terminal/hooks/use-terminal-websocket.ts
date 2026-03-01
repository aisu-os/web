import { useRef, useState, useCallback } from 'react'
import { BASE_URL } from '@/constants/app'
import { getToken } from '@/services/api/client'
import type { TerminalStatus, TerminalControlMessage } from '../types'

function getWsUrl(): string {
  const base = BASE_URL.replace(/^http/, 'ws')
  return `${base}/ws/terminal`
}

interface UseTerminalWebSocketOptions {
  sessionId?: string
  onData?: (data: Uint8Array) => void
  onReady?: (sessionId: string) => void
  onStatusChange?: (status: TerminalStatus) => void
  onError?: (message: string) => void
}

export function useTerminalWebSocket({
  sessionId: sessionIdProp,
  onData,
  onReady,
  onStatusChange,
  onError,
}: UseTerminalWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const [status, setStatus] = useState<TerminalStatus>('idle')

  const onDataRef = useRef(onData)
  const onReadyRef = useRef(onReady)
  const onStatusChangeRef = useRef(onStatusChange)
  const onErrorRef = useRef(onError)
  onDataRef.current = onData
  onReadyRef.current = onReady
  onStatusChangeRef.current = onStatusChange
  onErrorRef.current = onError

  const updateStatus = useCallback((newStatus: TerminalStatus) => {
    setStatus(newStatus)
    onStatusChangeRef.current?.(newStatus)
  }, [])

  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const connect = useCallback(() => {
    // Cancel previous pending connect
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current)
      connectTimeoutRef.current = null
    }

    // If connection already exists — skip
    if (wsRef.current) return

    const token = getToken()
    if (!token) {
      updateStatus('error')
      onErrorRef.current?.('Token not found')
      return
    }

    // StrictMode double-mount protection: delay before opening
    // First mount → connect → unmount → disconnect → second mount → connect
    // disconnect() closes WS but backend is async — small delay needed
    connectTimeoutRef.current = setTimeout(() => {
      connectTimeoutRef.current = null

      // Re-check inside timeout (disconnect may have been called)
      if (wsRef.current) return

      updateStatus('connecting')
      let url = `${getWsUrl()}?token=${encodeURIComponent(token)}`
      if (sessionIdProp) {
        url += `&session_id=${encodeURIComponent(sessionIdProp)}`
      }
      const ws = new WebSocket(url)
      ws.binaryType = 'arraybuffer'
      wsRef.current = ws

      ws.onopen = () => {
        // connected
      }

      ws.onmessage = (event: MessageEvent) => {
        if (event.data instanceof ArrayBuffer) {
          onDataRef.current?.(new Uint8Array(event.data))
        } else if (typeof event.data === 'string') {
          try {
            const msg = JSON.parse(event.data) as TerminalControlMessage
            if (msg.type === 'ready') {
              updateStatus('connected')
              onReadyRef.current?.(msg.sessionId)
            } else if (msg.type === 'status') {
              if (msg.status === 'starting-container') {
                updateStatus('starting-container')
              }
            } else if (msg.type === 'error') {
              updateStatus('error')
              onErrorRef.current?.(msg.message)
            }
          } catch {
            // Ignore non-JSON messages
          }
        }
      }

      ws.onclose = () => {
        if (wsRef.current === ws) {
          wsRef.current = null
          updateStatus('disconnected')
        }
      }

      ws.onerror = () => {
        if (wsRef.current === ws) {
          updateStatus('error')
          onErrorRef.current?.('WebSocket error')
        }
      }
    }, 50)
  }, [updateStatus])

  const sendInput = useCallback((data: string) => {
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      const encoder = new TextEncoder()
      ws.send(encoder.encode(data))
    }
  }, [])

  const sendResize = useCallback((cols: number, rows: number) => {
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'resize', rows, cols }))
    }
  }, [])

  const disconnect = useCallback(() => {
    // Cancel pending connect timeout
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current)
      connectTimeoutRef.current = null
    }
    const ws = wsRef.current
    if (ws) {
      wsRef.current = null
      ws.close()
    }
  }, [])

  return {
    status,
    connect,
    sendInput,
    sendResize,
    disconnect,
  }
}
