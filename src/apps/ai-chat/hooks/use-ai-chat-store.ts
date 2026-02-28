import { createContext, useContext } from 'react'
import { create, useStore } from 'zustand'
import type { StoreApi } from 'zustand'
import type { AiChatState, AiChatActions, ChatView, Conversation } from '../ai-chat.types'
import type { AiProviderConfig, AiProviderName, AiMessage } from '@/types'
import { MOCK_CONVERSATIONS, MOCK_RESPONSES } from '../ai-chat.constants'

export type AiChatStore = AiChatState & AiChatActions
export type AiChatStoreApi = StoreApi<AiChatStore>

export function createAiChatStore(): AiChatStoreApi {
  return create<AiChatStore>((set, get) => ({
    // ── State ──
    conversations: MOCK_CONVERSATIONS,
    activeConversationId: null,
    currentView: 'welcome' as ChatView,
    isSidebarVisible: true,
    sidebarSearchQuery: '',
    inputText: '',
    isStreaming: false,
    providerConfig: null,
    selectedPresetName: null,

    // ── Conversation Actions ──

    createConversation: () => {
      const newConv: Conversation = {
        id: crypto.randomUUID(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        providerId: null,
      }

      set((s) => ({
        conversations: [newConv, ...s.conversations],
        activeConversationId: newConv.id,
        currentView: 'chat',
        inputText: '',
      }))
    },

    selectConversation: (id: string) => {
      set({
        activeConversationId: id,
        currentView: 'chat',
        inputText: '',
      })
    },

    deleteConversation: (id: string) => {
      const { conversations, activeConversationId } = get()
      const filtered = conversations.filter((c) => c.id !== id)
      const isActive = activeConversationId === id

      set({
        conversations: filtered,
        ...(isActive
          ? {
              activeConversationId: filtered[0]?.id ?? null,
              currentView: filtered.length > 0 ? 'chat' : 'welcome',
            }
          : {}),
      })
    },

    renameConversation: (id: string, title: string) => {
      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === id ? { ...c, title, updatedAt: new Date() } : c,
        ),
      }))
    },

    // ── Messaging ──

    sendMessage: (content: string) => {
      const { activeConversationId, isStreaming } = get()
      if (!activeConversationId || isStreaming) return

      const userMessage: AiMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        createdAt: new Date(),
      }

      set((s) => {
        const conversations = s.conversations.map((c) => {
          if (c.id !== activeConversationId) return c

          const isFirstMessage = c.messages.length === 0
          return {
            ...c,
            messages: [...c.messages, userMessage],
            updatedAt: new Date(),
            title: isFirstMessage
              ? content.slice(0, 40) + (content.length > 40 ? '...' : '')
              : c.title,
          }
        })

        return {
          conversations,
          inputText: '',
          isStreaming: true,
        }
      })

      // Mock streaming delay
      const delay = 800 + Math.random() * 1200
      setTimeout(() => {
        const responseContent =
          MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)]

        const assistantMessage: AiMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: responseContent,
          createdAt: new Date(),
        }

        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  messages: [...c.messages, assistantMessage],
                  updatedAt: new Date(),
                }
              : c,
          ),
          isStreaming: false,
        }))
      }, delay)
    },

    setInputText: (text: string) => {
      set({ inputText: text })
    },

    // ── UI Actions ──

    setCurrentView: (view: ChatView) => {
      set({ currentView: view })
    },

    toggleSidebar: () => {
      set((s) => ({ isSidebarVisible: !s.isSidebarVisible }))
    },

    setSidebarSearchQuery: (query: string) => {
      set({ sidebarSearchQuery: query })
    },

    // ── Provider Config ──

    setProviderConfig: (config: AiProviderConfig) => {
      const { activeConversationId } = get()
      set({
        providerConfig: config,
        currentView: activeConversationId ? 'chat' : 'welcome',
      })
    },

    selectPreset: (name: AiProviderName) => {
      set({ selectedPresetName: name })
    },

    clearProviderConfig: () => {
      set({ providerConfig: null, selectedPresetName: null })
    },

    // ── Computed ──

    getActiveConversation: () => {
      const { conversations, activeConversationId } = get()
      return conversations.find((c) => c.id === activeConversationId)
    },

    getFilteredConversations: () => {
      const { conversations, sidebarSearchQuery } = get()
      if (!sidebarSearchQuery.trim()) return conversations
      const query = sidebarSearchQuery.toLowerCase()
      return conversations.filter((c) => c.title.toLowerCase().includes(query))
    },
  }))
}

export const AiChatStoreContext = createContext<AiChatStoreApi | null>(null)

export function useAiChatStore<T>(selector: (state: AiChatStore) => T): T {
  const store = useContext(AiChatStoreContext)
  if (!store) throw new Error('useAiChatStore must be used within AiChatStoreContext')
  return useStore(store, selector)
}
