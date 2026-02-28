import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import type { AiMessage } from '@/types'

interface MessageBubbleProps {
  message: AiMessage
}

function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()

  if (isToday) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

interface ContentPart {
  type: 'text' | 'code'
  content: string
  language?: string
}

function parseContent(content: string): ContentPart[] {
  const parts: ContentPart[] = []
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) })
    }
    parts.push({
      type: 'code',
      content: match[2],
      language: match[1] || undefined,
    })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) })
  }

  return parts
}

function renderTextWithInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="bg-white/[0.08] text-[#e8ab6a] rounded px-1.5 py-0.5 text-[12px] font-mono"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === 'user'
  const parts = useMemo(() => parseContent(message.content), [message.content])

  return (
    <div className={cn('flex mb-3', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] px-4 py-2.5',
          isUser
            ? 'bg-[#2463EB] rounded-2xl rounded-br-md'
            : 'bg-white/[0.06] rounded-2xl rounded-bl-md',
        )}
      >
        <div
          className={cn(
            'text-[13px] leading-relaxed',
            isUser ? 'text-white' : 'text-white/80',
          )}
        >
          {parts.map((part, i) => {
            if (part.type === 'code') {
              return (
                <div
                  key={i}
                  className="my-2 rounded-lg bg-black/30 overflow-hidden"
                >
                  {part.language && (
                    <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.04] border-b border-white/[0.06]">
                      <span className="text-[10px] text-white/30 uppercase tracking-wider">
                        {part.language}
                      </span>
                    </div>
                  )}
                  <pre className="p-3 overflow-x-auto">
                    <code className="text-[12px] font-mono text-white/70 leading-relaxed">
                      {part.content}
                    </code>
                  </pre>
                </div>
              )
            }
            return (
              <span key={i} className="whitespace-pre-wrap">
                {renderTextWithInlineCode(part.content)}
              </span>
            )
          })}
        </div>

        <span
          className={cn(
            'text-[10px] mt-1 block',
            isUser ? 'text-white/50 text-right' : 'text-white/30',
          )}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}

export default MessageBubble
