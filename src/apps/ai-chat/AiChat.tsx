import { useMemo, useEffect, useCallback } from 'react'
import {
  createAiChatStore,
  AiChatStoreContext,
  useAiChatStore,
} from './hooks/use-ai-chat-store'
import ChatSidebar from './components/ChatSidebar'
import ChatArea from './components/ChatArea'

const AiChatInner = () => {
  const isSidebarVisible = useAiChatStore((s) => s.isSidebarVisible)
  const createConversation = useAiChatStore((s) => s.createConversation)
  const toggleSidebar = useAiChatStore((s) => s.toggleSidebar)
  const setCurrentView = useAiChatStore((s) => s.setCurrentView)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'n') {
        e.preventDefault()
        createConversation()
        return
      }
      if (e.metaKey && e.shiftKey && e.key === 's') {
        e.preventDefault()
        toggleSidebar()
        return
      }
      if (e.metaKey && e.key === ',') {
        e.preventDefault()
        setCurrentView('provider-config')
        return
      }
    },
    [createConversation, toggleSidebar, setCurrentView],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="flex flex-col h-full w-full bg-[#1E1E2E] text-white rounded-b-lg overflow-hidden select-none">
      <div className="flex flex-1 overflow-hidden">
        {isSidebarVisible && <ChatSidebar />}
        <ChatArea />
      </div>
    </div>
  )
}

interface AiChatProps {
  windowId?: string
}

const AiChat = ({ windowId: _windowId = '' }: AiChatProps) => {
  const store = useMemo(() => createAiChatStore(), [])

  return (
    <AiChatStoreContext.Provider value={store}>
      <AiChatInner />
    </AiChatStoreContext.Provider>
  )
}

export default AiChat
