export interface SdkRequest {
  type: 'aisu-request'
  id: string
  action: string
  payload: Record<string, unknown>
}

export interface SdkResponse {
  type: 'aisu-response'
  id: string
  success: boolean
  payload?: Record<string, unknown>
  error?: SdkError
}

export interface SdkError {
  code: 'PERMISSION_DENIED' | 'NOT_FOUND' | 'SCOPE_VIOLATION' | 'RATE_LIMITED' | 'INTERNAL_ERROR'
  message: string
}

export interface SdkEvent {
  type: 'aisu-event'
  event: string
  payload: Record<string, unknown>
}
