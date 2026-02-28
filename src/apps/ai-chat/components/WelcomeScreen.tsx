import { useAiChatStore } from '../hooks/use-ai-chat-store'

const WelcomeScreen = () => {
  const createConversation = useAiChatStore((s) => s.createConversation)
  const setCurrentView = useAiChatStore((s) => s.setCurrentView)

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2463EB]/20 to-purple-500/20 flex items-center justify-center mb-6">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[#2463EB]"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5-1.34C8.47 21.51 10.18 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 12h.01M12 12h.01M16 12h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className="text-[18px] font-semibold text-white mb-2">
        Welcome to AI Chat
      </h2>

      <p className="text-[13px] text-white/40 text-center max-w-[360px] mb-8 leading-relaxed">
        Start a new conversation or configure your AI provider to begin
        chatting with your favorite models.
      </p>

      <div className="flex gap-3">
        <button
          onClick={createConversation}
          className="bg-[#2463EB] hover:bg-[#3b75f0] text-white text-[13px] font-medium rounded-lg px-5 py-2 transition-colors"
        >
          New Chat
        </button>
        <button
          onClick={() => setCurrentView('provider-config')}
          className="bg-white/[0.06] hover:bg-white/[0.08] text-white/70 text-[13px] font-medium rounded-lg px-5 py-2 transition-colors"
        >
          Provider Settings
        </button>
      </div>
    </div>
  )
}

export default WelcomeScreen
