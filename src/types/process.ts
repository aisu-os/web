export type ProcessStatus = 'running' | 'not-responding'

export interface ProcessState {
  id: string
  appId: string
  status: ProcessStatus
  isHidden: boolean
  launchedAt: number
}
