import type { PortForward } from './port-forward.types'

export const RESERVED_SUBDOMAINS = new Set([
  'www', 'api', 'admin', 'mail', 'ftp', 'ssh',
  'cdn', 'ns1', 'ns2', 'test', 'dev', 'staging',
  'app', 'dashboard', 'panel', 'control',
])

export const MAX_FORWARDS = 3

export const MOCK_FORWARDS: PortForward[] = [
  {
    id: 'pf-001',
    subdomain: 'myapp',
    url: 'https://myapp.t.aisu.run',
    containerPort: 3000,
    protocol: 'http',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    requestCount: 847,
    lastRequestAt: new Date(Date.now() - 30_000),
  },
  {
    id: 'pf-002',
    subdomain: 'api-dev',
    url: 'https://api-dev.t.aisu.run',
    containerPort: 8080,
    protocol: 'http',
    status: 'port_closed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    requestCount: 12453,
    lastRequestAt: new Date(Date.now() - 3600_000),
  },
]

export const SUBDOMAIN_ADJECTIVES = [
  'swift', 'calm', 'bold', 'warm', 'cool', 'fast', 'keen', 'neat',
]

export const SUBDOMAIN_NOUNS = [
  'fox', 'owl', 'elk', 'ray', 'bee', 'ant', 'ram', 'cod',
]
