import { useRef, useCallback } from 'react'
import { cn } from '@/lib/cn'
import { useAiChatStore } from '../hooks/use-ai-chat-store'

const ChatInput = () => {
  const inputText = useAiChatStore((s) => s.inputText)
  const isStreaming = useAiChatStore((s) => s.isStreaming)
  const setInputText = useAiChatStore((s) => s.setInputText)
  const sendMessage = useAiChatStore((s) => s.sendMessage)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const canSend = inputText.trim().length > 0 && !isStreaming

  const handleResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [])

  const handleSend = useCallback(() => {
    const text = inputText.trim()
    if (!text || isStreaming) return
    sendMessage(text)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [inputText, isStreaming, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  return (
    <div className="border-t border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value)
            handleResize()
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none bg-white/[0.06] rounded-xl px-4 py-2.5 text-[13px] text-white/80 placeholder:text-white/30 outline-none border border-white/[0.06] focus:border-white/10 focus:bg-white/[0.08] transition-colors leading-relaxed"
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-colors',
            canSend
              ? 'bg-[#2463EB] hover:bg-[#3b75f0] cursor-pointer'
              : 'bg-white/[0.06] cursor-not-allowed opacity-40',
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
          >
            <path
              d="M12 19V5M5 12l7-7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ChatInput
