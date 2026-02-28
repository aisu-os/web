import { cn } from '@/lib/cn'
import { useAiChatStore } from '../hooks/use-ai-chat-store'

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHour = Math.floor(diffMs / 3600_000)
  const diffDay = Math.floor(diffMs / 86400_000)

  if (diffMin < 1) return 'Now'
  if (diffMin < 60) return `${diffMin}m`
  if (diffHour < 24) return `${diffHour}h`
  if (diffDay < 7) return `${diffDay}d`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const ChatSidebar = () => {
  const activeConversationId = useAiChatStore((s) => s.activeConversationId)
  const sidebarSearchQuery = useAiChatStore((s) => s.sidebarSearchQuery)
  const setSidebarSearchQuery = useAiChatStore((s) => s.setSidebarSearchQuery)
  const createConversation = useAiChatStore((s) => s.createConversation)
  const selectConversation = useAiChatStore((s) => s.selectConversation)
  const deleteConversation = useAiChatStore((s) => s.deleteConversation)
  const setCurrentView = useAiChatStore((s) => s.setCurrentView)
  const getFilteredConversations = useAiChatStore((s) => s.getFilteredConversations)

  const conversations = getFilteredConversations()

  return (
    <div className="w-[240px] shrink-0 flex flex-col overflow-hidden bg-white/[0.03] border-r border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="text-[13px] font-semibold text-white/70">Chats</span>
        <button
          onClick={createConversation}
          className="w-6 h-6 rounded-md flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
          title="New Chat"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={sidebarSearchQuery}
            onChange={(e) => setSidebarSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-white/[0.06] rounded-lg pl-7 pr-3 py-1.5 text-[12px] text-white/70 placeholder:text-white/30 outline-none border border-transparent focus:border-white/10 transition-colors"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2">
        {conversations.length === 0 && (
          <div className="px-3 py-6 text-center">
            <p className="text-[11px] text-white/30">No conversations</p>
          </div>
        )}
        {conversations.map((conv) => {
          const isActive = conv.id === activeConversationId
          const lastMessage = conv.messages[conv.messages.length - 1]

          return (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={cn(
                'group flex flex-col gap-0.5 px-3 py-2 rounded-lg cursor-pointer transition-colors mb-0.5',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/70',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium truncate flex-1">
                  {conv.title}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-white/30 shrink-0">
                    {formatRelativeTime(conv.updatedAt)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteConversation(conv.id)
                    }}
                    className="w-4 h-4 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all"
                    title="Delete"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {lastMessage && (
                <span className="text-[11px] text-white/30 truncate">
                  {lastMessage.content.slice(0, 60)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Provider Settings Button */}
      <div className="px-3 py-2 border-t border-white/5">
        <button
          onClick={() => setCurrentView('provider-config')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[12px]">Provider Settings</span>
        </button>
      </div>
    </div>
  )
}

export default ChatSidebar
