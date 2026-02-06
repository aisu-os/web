import { create } from 'zustand'
import type { ProcessState } from '@/types'

interface ProcessStore {
  processes: ProcessState[]

  spawnProcess: (appId: string) => string
  killProcess: (processId: string) => void
  hideProcess: (processId: string) => void
  unhideProcess: (processId: string) => void
  getProcess: (processId: string) => ProcessState | undefined
  getProcessesByApp: (appId: string) => ProcessState[]
}

export const useProcessStore = create<ProcessStore>((set, get) => ({
  processes: [],

  spawnProcess: (appId) => {
    const id = crypto.randomUUID()
    const process: ProcessState = {
      id,
      appId,
      status: 'running',
      isHidden: false,
      launchedAt: Date.now(),
    }

    set((state) => ({
      processes: [...state.processes, process],
    }))

    return id
  },

  killProcess: (processId) => {
    set((state) => ({
      processes: state.processes.filter((p) => p.id !== processId),
    }))
  },

  hideProcess: (processId) => {
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === processId ? { ...p, isHidden: true } : p
      ),
    }))
  },

  unhideProcess: (processId) => {
    set((state) => ({
      processes: state.processes.map((p) =>
        p.id === processId ? { ...p, isHidden: false } : p
      ),
    }))
  },

  getProcess: (processId) => {
    return get().processes.find((p) => p.id === processId)
  },

  getProcessesByApp: (appId) => {
    return get().processes.filter((p) => p.appId === appId)
  },
}))
