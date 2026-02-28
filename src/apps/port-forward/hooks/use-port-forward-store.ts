import { createContext, useContext } from 'react'
import { create, useStore, type StoreApi } from 'zustand'
import type { PortForward, SubdomainValidation } from '../port-forward.types'
import { RESERVED_SUBDOMAINS } from '../port-forward.constants'
import { apiGet, apiPost, apiDelete, ApiError } from '@/services/api/client'

// ── API response tiplari (snake_case) ──

interface ApiPortForward {
  id: string
  subdomain: string
  url: string
  container_port: number
  protocol: 'http'
  status: 'active' | 'port_closed'
  created_at: string
  request_count: number
  last_request_at: string | null
}

interface ApiPortForwardList {
  forwards: ApiPortForward[]
  total: number
}

function mapForward(api: ApiPortForward): PortForward {
  return {
    id: api.id,
    subdomain: api.subdomain,
    url: api.url,
    containerPort: api.container_port,
    protocol: api.protocol,
    status: api.status,
    createdAt: new Date(api.created_at),
    requestCount: api.request_count,
    lastRequestAt: api.last_request_at ? new Date(api.last_request_at) : null,
  }
}

// ── Store ──

interface PortForwardState {
  forwards: PortForward[]
  domain: string
  scheme: string
  isLoading: boolean
  isCreating: boolean
  isSubmitting: boolean
  expandedForwardId: string | null
  formPort: string
  formSubdomain: string
  formError: string | null
}

interface PortForwardActions {
  loadConfig: () => Promise<void>
  loadForwards: () => Promise<void>
  openCreateDialog: () => void
  closeCreateDialog: () => void
  setFormPort: (value: string) => void
  setFormSubdomain: (value: string) => void
  createForward: () => Promise<void>
  deleteForward: (id: string) => Promise<void>
  toggleExpanded: (id: string) => void
  copyUrl: (url: string) => void
  validateSubdomain: (subdomain: string) => SubdomainValidation
  validatePort: (port: string) => { isValid: boolean; error: string | null }
}

type PortForwardStore = PortForwardState & PortForwardActions
type PortForwardStoreApi = StoreApi<PortForwardStore>

export function createPortForwardStore(): PortForwardStoreApi {
  return create<PortForwardStore>((set, get) => ({
    forwards: [],
    domain: 't.localhost',
    scheme: 'http',
    isLoading: false,
    isCreating: false,
    isSubmitting: false,
    expandedForwardId: null,
    formPort: '',
    formSubdomain: '',
    formError: null,

    loadConfig: async () => {
      try {
        const config = await apiGet<{ domain: string; scheme: string }>('/port-forwards/config')
        set({ domain: config.domain, scheme: config.scheme })
      } catch {
        // default qiymatlarda qolamiz
      }
    },

    loadForwards: async () => {
      set({ isLoading: true })
      try {
        const data = await apiGet<ApiPortForwardList>('/port-forwards')
        set({ forwards: data.forwards.map(mapForward), isLoading: false })
      } catch {
        set({ isLoading: false })
      }
    },

    openCreateDialog: () => set({ isCreating: true, formError: null }),

    closeCreateDialog: () =>
      set({ isCreating: false, formPort: '', formSubdomain: '', formError: null }),

    setFormPort: (value) => set({ formPort: value, formError: null }),

    setFormSubdomain: (value) => set({ formSubdomain: value, formError: null }),

    createForward: async () => {
      const { formPort, formSubdomain, validatePort, validateSubdomain } = get()

      const portResult = validatePort(formPort)
      if (!portResult.isValid) {
        set({ formError: portResult.error })
        return
      }

      if (formSubdomain) {
        const subResult = validateSubdomain(formSubdomain)
        if (!subResult.isValid) {
          set({ formError: subResult.error })
          return
        }
      }

      set({ isSubmitting: true })

      try {
        const body: { container_port: number; subdomain?: string } = {
          container_port: parseInt(formPort, 10),
        }
        if (formSubdomain) {
          body.subdomain = formSubdomain
        }

        const apiForward = await apiPost<ApiPortForward>('/port-forwards', body)
        const forward = mapForward(apiForward)

        set((state) => ({
          forwards: [forward, ...state.forwards],
          isCreating: false,
          isSubmitting: false,
          formPort: '',
          formSubdomain: '',
          formError: null,
        }))
      } catch (err) {
        const message = err instanceof ApiError ? err.detail : 'Xatolik yuz berdi'
        set({ isSubmitting: false, formError: message })
      }
    },

    deleteForward: async (id) => {
      // Optimistic: darhol UI dan olib tashlaymiz
      const prev = get().forwards
      set((state) => ({
        forwards: state.forwards.filter((f) => f.id !== id),
        expandedForwardId: state.expandedForwardId === id ? null : state.expandedForwardId,
      }))

      try {
        await apiDelete(`/port-forwards/${id}`)
      } catch {
        // Xato bo'lsa, qayta tiklash
        set({ forwards: prev })
      }
    },

    toggleExpanded: (id) =>
      set((state) => ({
        expandedForwardId: state.expandedForwardId === id ? null : id,
      })),

    copyUrl: (url) => {
      navigator.clipboard.writeText(url)
    },

    validateSubdomain: (subdomain) => {
      if (subdomain.length < 3) return { isValid: false, error: 'Kamida 3 ta belgi kerak' }
      if (subdomain.length > 32) return { isValid: false, error: 'Maksimum 32 ta belgi' }
      if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(subdomain)) {
        return { isValid: false, error: 'Faqat kichik harflar, raqamlar va tire' }
      }
      if (/--/.test(subdomain)) return { isValid: false, error: "Ikki tire ketma-ket bo'lmasin" }
      if (RESERVED_SUBDOMAINS.has(subdomain)) return { isValid: false, error: 'Bu subdomain band' }
      const existing = get().forwards
      if (existing.some((f) => f.subdomain === subdomain)) {
        return { isValid: false, error: 'Bu subdomain allaqachon ishlatilmoqda' }
      }
      return { isValid: true, error: null }
    },

    validatePort: (port) => {
      const num = parseInt(port, 10)
      if (!port || isNaN(num)) return { isValid: false, error: 'Port raqamini kiriting' }
      if (num < 1024) return { isValid: false, error: "Port 1024 dan katta bo'lishi kerak" }
      if (num > 65535) return { isValid: false, error: "Port 65535 dan kichik bo'lishi kerak" }
      return { isValid: true, error: null }
    },
  }))
}

export const PortForwardStoreContext = createContext<PortForwardStoreApi | null>(null)

export function usePortForwardStore<T>(selector: (state: PortForwardStore) => T): T {
  const store = useContext(PortForwardStoreContext)
  if (!store) throw new Error('usePortForwardStore must be used within PortForwardStoreContext')
  return useStore(store, selector)
}
