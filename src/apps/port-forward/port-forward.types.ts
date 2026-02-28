export type ForwardStatus = 'active' | 'port_closed'

export interface PortForward {
  id: string
  subdomain: string
  url: string
  containerPort: number
  protocol: 'http'
  status: ForwardStatus
  createdAt: Date
  requestCount: number
  lastRequestAt: Date | null
}

export interface SubdomainValidation {
  isValid: boolean
  error: string | null
}
