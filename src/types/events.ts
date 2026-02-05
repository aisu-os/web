export type SystemEventType =
  | 'window:opened'
  | 'window:closed'
  | 'window:focused'
  | 'app:launched'
  | 'app:terminated'
  | 'app:installed'
  | 'app:uninstalled'
  | 'theme:changed'
  | 'ai:message'
  | 'ai:tool_call'
  | 'notification:created'
  | 'permission:granted'
  | 'permission:revoked'

export interface SystemEvent<T = unknown> {
  type: SystemEventType
  payload: T
  timestamp: Date
}
