import { create } from 'zustand'

interface GetInfoStore {
  isOpen: boolean
  targetPath: string | null
  open: (path: string) => void
  close: () => void
}

export const useGetInfoStore = create<GetInfoStore>((set) => ({
  isOpen: false,
  targetPath: null,
  open: (path) => set({ isOpen: true, targetPath: path }),
  close: () => set({ isOpen: false, targetPath: null }),
}))
