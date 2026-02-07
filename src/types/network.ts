export type ConnectionType =
  | 'bluetooth'
  | 'cellular'
  | 'ethernet'
  | 'none'
  | 'wifi'
  | 'wimax'
  | 'other'
  | 'unknown'

export type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g'

export interface NetworkState {
  online: boolean
  type: ConnectionType
  effectiveType: EffectiveConnectionType
  downlink: number
  rtt: number
  saveData: boolean
  isConnectionApiSupported: boolean
}

export interface NetworkInformation extends EventTarget {
  readonly type?: ConnectionType
  readonly effectiveType: EffectiveConnectionType
  readonly downlink: number
  readonly rtt: number
  readonly saveData: boolean
  onchange: ((this: NetworkInformation, ev: Event) => void) | null
}

declare global {
  interface Navigator {
    connection?: NetworkInformation
    mozConnection?: NetworkInformation
    webkitConnection?: NetworkInformation
  }
}
