import { useRef, useEffect } from 'react'
import { useAiChatStore } from '../hooks/use-ai-chat-store'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import WelcomeScreen from './WelcomeScreen'
import ProviderConfig from './ProviderConfig'

const StreamingIndicator = () => (
  <div className="flex justify-start mb-3">
    <div className="bg-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
)

const ConversationView = () => {
  const getActiveConversation = useAiChatStore((s) => s.getActiveConversation)
  const isStreaming = useAiChatStore((s) => s.isStreaming)
  const scrollRef = useRef<HTMLDivElement>(null)

  const conversation = getActiveConversation()

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages.length, isStreaming])

  if (!conversation) return null

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {conversation.messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <p className="text-[13px] text-white/30 mb-1">No messages yet</p>
            <p className="text-[11px] text-white/20">
              Type a message below to start the conversation
            </p>
          </div>
        )}
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isStreaming && <StreamingIndicator />}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  )
}

const ChatArea = () => {
  const currentView = useAiChatStore((s) => s.currentView)
  const activeConversationId = useAiChatStore((s) => s.activeConversationId)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {currentView === 'provider-config' && <ProviderConfig />}
      {currentView === 'welcome' && <WelcomeScreen />}
      {currentView === 'chat' && activeConversationId && <ConversationView />}
      {currentView === 'chat' && !activeConversationId && <WelcomeScreen />}
    </div>
  )
}

export default ChatArea
