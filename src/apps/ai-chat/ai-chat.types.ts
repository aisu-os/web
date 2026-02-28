import type { AiProviderName, AiProviderConfig, AiMessage } from '@/types'

export type ChatView = 'chat' | 'welcome' | 'provider-config'

export interface Conversation {
  id: string
  title: string
  messages: AiMessage[]
  createdAt: Date
  updatedAt: Date
  providerId: string | null
}

export interface ProviderPreset {
  name: AiProviderName
  label: string
  icon: string
  defaultBaseUrl?: string
  models: string[]
  requiresApiKey: boolean
}

export interface AiChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  currentView: ChatView
  isSidebarVisible: boolean
  sidebarSearchQuery: string
  inputText: string
  isStreaming: boolean
  providerConfig: AiProviderConfig | null
  selectedPresetName: AiProviderName | null
}

export interface AiChatActions {
  createConversation: () => void
  selectConversation: (id: string) => void
  deleteConversation: (id: string) => void
  renameConversation: (id: string, title: string) => void
  sendMessage: (content: string) => void
  setInputText: (text: string) => void
  setCurrentView: (view: ChatView) => void
  toggleSidebar: () => void
  setSidebarSearchQuery: (query: string) => void
  setProviderConfig: (config: AiProviderConfig) => void
  selectPreset: (name: AiProviderName) => void
  clearProviderConfig: () => void
  getActiveConversation: () => Conversation | undefined
  getFilteredConversations: () => Conversation[]
}
