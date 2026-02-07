import { useState, useEffect } from 'react'
import type { NetworkState, NetworkInformation } from '@/types'

const getConnection = (): NetworkInformation | undefined =>
  navigator.connection ?? navigator.mozConnection ?? navigator.webkitConnection

const DEFAULT_STATE: NetworkState = {
  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  type: 'unknown',
  effectiveType: '4g',
  downlink: -1,
  rtt: -1,
  saveData: false,
  isConnectionApiSupported: false,
}

function readConnectionState(connection: NetworkInformation): Partial<NetworkState> {
  return {
    type: connection.type ?? 'unknown',
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
    isConnectionApiSupported: true,
  }
}

export function useNetwork(): NetworkState {
  const [state, setState] = useState<NetworkState>(() => {
    const connection = getConnection()
    return {
      ...DEFAULT_STATE,
      online: navigator.onLine,
      ...(connection ? readConnectionState(connection) : {}),
    }
  })

  useEffect(() => {
    const connection = getConnection()

    const handleOnline = () => setState((prev) => ({ ...prev, online: true }))
    const handleOffline = () => setState((prev) => ({ ...prev, online: false }))

    const handleConnectionChange = () => {
      const conn = getConnection()
      if (conn) {
        setState((prev) => ({ ...prev, ...readConnectionState(conn) }))
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if (connection) {
      connection.addEventListener('change', handleConnectionChange)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [])

  return state
}
