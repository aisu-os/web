import { createContext, useContext } from 'react'
import { create, useStore, type StoreApi } from 'zustand'
import type { PortForward, SubdomainValidation } from '../port-forward.types'
import { RESERVED_SUBDOMAINS, MAX_FORWARDS, MOCK_FORWARDS } from '../port-forward.constants'
import { generateRandomSubdomain } from '../port-forward.utils'

interface PortForwardState {
  forwards: PortForward[]
  isCreating: boolean
  isSubmitting: boolean
  expandedForwardId: string | null
  formPort: string
  formSubdomain: string
  formError: string | null
}

interface PortForwardActions {
  openCreateDialog: () => void
  closeCreateDialog: () => void
  setFormPort: (value: string) => void
  setFormSubdomain: (value: string) => void
  createForward: () => Promise<void>
  deleteForward: (id: string) => void
  toggleExpanded: (id: string) => void
  copyUrl: (url: string) => void
  validateSubdomain: (subdomain: string) => SubdomainValidation
  validatePort: (port: string) => { isValid: boolean; error: string | null }
}

type PortForwardStore = PortForwardState & PortForwardActions
type PortForwardStoreApi = StoreApi<PortForwardStore>

export function createPortForwardStore(): PortForwardStoreApi {
  return create<PortForwardStore>((set, get) => ({
    forwards: MOCK_FORWARDS,
    isCreating: false,
    isSubmitting: false,
    expandedForwardId: null,
    formPort: '',
    formSubdomain: '',
    formError: null,

    openCreateDialog: () => set({ isCreating: true, formError: null }),

    closeCreateDialog: () =>
      set({ isCreating: false, formPort: '', formSubdomain: '', formError: null }),

    setFormPort: (value) => set({ formPort: value, formError: null }),

    setFormSubdomain: (value) => set({ formSubdomain: value, formError: null }),

    createForward: async () => {
      const { formPort, formSubdomain, forwards, validatePort, validateSubdomain } = get()

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

      if (forwards.length >= MAX_FORWARDS) {
        set({ formError: `Maksimum ${MAX_FORWARDS} ta port forward ruxsat etilgan` })
        return
      }

      const portNum = parseInt(formPort, 10)
      if (forwards.some((f) => f.containerPort === portNum)) {
        set({ formError: `Port ${portNum} allaqachon forwarded` })
        return
      }

      set({ isSubmitting: true })

      await new Promise((r) => setTimeout(r, 800))

      const subdomain = formSubdomain || generateRandomSubdomain()
      const newForward: PortForward = {
        id: crypto.randomUUID(),
        subdomain,
        url: `https://${subdomain}.t.aisu.run`,
        containerPort: portNum,
        protocol: 'http',
        status: 'active',
        createdAt: new Date(),
        requestCount: 0,
        lastRequestAt: null,
      }

      set((state) => ({
        forwards: [...state.forwards, newForward],
        isCreating: false,
        isSubmitting: false,
        formPort: '',
        formSubdomain: '',
        formError: null,
      }))
    },

    deleteForward: (id) =>
      set((state) => ({
        forwards: state.forwards.filter((f) => f.id !== id),
        expandedForwardId: state.expandedForwardId === id ? null : state.expandedForwardId,
      })),

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
      if (/--/.test(subdomain)) return { isValid: false, error: 'Ikki tire ketma-ket bo\'lmasin' }
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
      if (num < 1024) return { isValid: false, error: 'Port 1024 dan katta bo\'lishi kerak' }
      if (num > 65535) return { isValid: false, error: 'Port 65535 dan kichik bo\'lishi kerak' }
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
