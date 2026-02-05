export type AiProviderName =
  | 'anthropic'
  | 'openai'
  | 'google'
  | 'deepseek'
  | 'groq'
  | 'ollama'
  | (string & {})

export interface AiProviderConfig {
  name: AiProviderName
  apiKey: string
  model: string
  baseUrl?: string
}

export type AiMessageRole = 'user' | 'assistant' | 'system'

export interface AiMessage {
  id: string
  role: AiMessageRole
  content: string
  toolCalls?: AiToolCall[]
  createdAt: Date
}

export interface AiToolCall {
  id: string
  name: string
  input: Record<string, unknown>
  result?: string
  status: 'pending' | 'running' | 'completed' | 'error'
}

export interface AiStreamEvent {
  type: 'text_delta' | 'tool_use' | 'message_stop' | 'error'
  data: unknown
}
