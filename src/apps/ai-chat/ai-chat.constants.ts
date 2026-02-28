import type { Conversation, ProviderPreset } from './ai-chat.types'
import type { AiMessage } from '@/types'

// ── Provider Presets ──

export const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    name: 'anthropic',
    label: 'Anthropic',
    icon: '🟠',
    models: ['claude-sonnet-4-20250514', 'claude-haiku-4-20250414', 'claude-opus-4-20250514'],
    requiresApiKey: true,
  },
  {
    name: 'openai',
    label: 'OpenAI',
    icon: '🟢',
    models: ['gpt-4o', 'gpt-4o-mini', 'o1', 'o3-mini'],
    requiresApiKey: true,
  },
  {
    name: 'google',
    label: 'Google',
    icon: '🔵',
    models: ['gemini-2.0-flash', 'gemini-2.0-pro', 'gemini-1.5-pro'],
    requiresApiKey: true,
  },
  {
    name: 'deepseek',
    label: 'DeepSeek',
    icon: '🟣',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    requiresApiKey: true,
  },
  {
    name: 'groq',
    label: 'Groq',
    icon: '⚡',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    requiresApiKey: true,
  },
  {
    name: 'ollama',
    label: 'Ollama',
    icon: '🦙',
    defaultBaseUrl: 'http://localhost:11434',
    models: ['llama3.2', 'mistral', 'codellama', 'phi3'],
    requiresApiKey: false,
  },
]

// ── Mock Messages Helper ──

function mockMsg(
  id: string,
  role: 'user' | 'assistant',
  content: string,
  minutesAgo: number,
): AiMessage {
  return {
    id,
    role,
    content,
    createdAt: new Date(Date.now() - minutesAgo * 60_000),
  }
}

// ── Mock Conversations ──

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'React Performance Optimization',
    providerId: null,
    createdAt: new Date(Date.now() - 3600_000 * 2),
    updatedAt: new Date(Date.now() - 60_000 * 5),
    messages: [
      mockMsg('m1', 'user', 'How can I optimize React rendering performance?', 30),
      mockMsg(
        'm2',
        'assistant',
        "There are several key strategies for optimizing React rendering performance:\n\n**1. Memoization**\nUse `React.memo()` for components that receive the same props frequently. Combine with `useMemo` and `useCallback` to prevent unnecessary recalculations.\n\n**2. Code Splitting**\nUse `React.lazy()` and `Suspense` to split your bundle and load components on demand.\n\n**3. Virtual Lists**\nFor long lists, use libraries like `react-window` or `@tanstack/virtual` to only render visible items.\n\n**4. State Management**\nKeep state as local as possible. Use Zustand selectors to prevent unnecessary re-renders from global store changes.\n\n**5. Key Optimization**\nUse stable, unique keys in lists rather than array indices.",
        28,
      ),
      mockMsg('m3', 'user', 'Can you show me a useMemo example?', 25),
      mockMsg(
        'm4',
        'assistant',
        "Here is a practical `useMemo` example:\n\n```typescript\nconst ExpensiveList = ({ items, filter }: Props) => {\n  const filteredItems = useMemo(\n    () => items.filter(item => item.name.includes(filter)),\n    [items, filter]\n  )\n\n  return (\n    <ul>\n      {filteredItems.map(item => (\n        <li key={item.id}>{item.name}</li>\n      ))}\n    </ul>\n  )\n}\n```\n\nThe `filteredItems` array is only recomputed when `items` or `filter` changes, avoiding expensive filtering on every render.",
        23,
      ),
    ],
  },
  {
    id: 'conv-2',
    title: 'TypeScript Utility Types',
    providerId: null,
    createdAt: new Date(Date.now() - 3600_000 * 24),
    updatedAt: new Date(Date.now() - 3600_000 * 3),
    messages: [
      mockMsg('m5', 'user', 'Explain the Partial and Required utility types', 200),
      mockMsg(
        'm6',
        'assistant',
        "`Partial<T>` makes all properties of `T` optional:\n\n```typescript\ninterface User {\n  name: string\n  email: string\n  age: number\n}\n\ntype PartialUser = Partial<User>\n// { name?: string; email?: string; age?: number }\n```\n\n`Required<T>` is the opposite — it makes all properties required:\n\n```typescript\ninterface Config {\n  theme?: string\n  lang?: string\n}\n\ntype FullConfig = Required<Config>\n// { theme: string; lang: string }\n```\n\nBoth are built-in and very useful for function parameters and update operations.",
        198,
      ),
    ],
  },
  {
    id: 'conv-3',
    title: 'Zustand vs Redux',
    providerId: null,
    createdAt: new Date(Date.now() - 3600_000 * 48),
    updatedAt: new Date(Date.now() - 3600_000 * 24),
    messages: [
      mockMsg(
        'm7',
        'user',
        'What are the main differences between Zustand and Redux?',
        2000,
      ),
      mockMsg(
        'm8',
        'assistant',
        "Key differences between Zustand and Redux:\n\n| Feature | Zustand | Redux |\n|---------|---------|-------|\n| Boilerplate | Minimal | Significant |\n| Bundle Size | ~1KB | ~7KB + toolkit |\n| Provider | Optional | Required |\n| DevTools | Plugin | Built-in |\n| Learning Curve | Low | Moderate |\n\n**Zustand** is simpler, smaller, and more flexible. It does not require a provider wrapper and actions are just functions on the store.\n\n**Redux** has a larger ecosystem, middleware support (thunks, sagas), and better debugging tools. It enforces a stricter architecture with reducers and actions.\n\nFor most modern React apps, Zustand is sufficient and much easier to work with.",
        1998,
      ),
    ],
  },
]

// ── Mock Responses ──

export const MOCK_RESPONSES: string[] = [
  "That's a great question! Let me think about this...\n\nBased on my analysis, here are the key points:\n\n**First**, you should consider the overall architecture of your application. A well-structured codebase is much easier to maintain and optimize.\n\n**Second**, always measure before optimizing. Use browser DevTools, React Profiler, and performance monitoring to identify actual bottlenecks.\n\n**Third**, consider the user experience impact. Not every optimization is worth the added complexity.\n\nWould you like me to elaborate on any of these points?",
  "I'd be happy to help with that! Here is my recommendation:\n\n1. Start by defining clear interfaces for your data structures\n2. Implement the core logic with proper error handling\n3. Add comprehensive tests before moving on\n4. Optimize for performance only when needed\n\n```typescript\ninterface Result<T> {\n  data: T | null\n  error: string | null\n  loading: boolean\n}\n```\n\nThis pattern gives you type safety and predictable state management.",
  "Interesting approach! Let me provide some context:\n\nThe key insight is that **simplicity beats complexity** in most cases. Here is why:\n\n- Simpler code is easier to debug\n- Simpler code is easier to test\n- Simpler code is easier to onboard new developers\n\nThat said, there are cases where additional complexity is justified — such as when you need to handle high concurrency or complex state machines.\n\nWhat specific use case are you working on? I can provide more targeted advice.",
]
