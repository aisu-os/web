import { cn } from '@/lib/cn'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchField({
  value,
  onChange,
  placeholder = 'Search',
}: SearchFieldProps) {
  return (
    <div className="relative flex items-center">
      <div
        className={cn(
          'flex items-center gap-2 bg-white/[0.06] rounded-lg px-2.5 py-1.5 w-full',
          'border border-transparent transition-colors',
          'focus-within:border-white/10 focus-within:bg-white/[0.08]'
        )}
      >
        {/* Search icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-white/30"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-[12px] text-white/80 placeholder:text-white/30"
        />

        {/* Clear button */}
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="shrink-0 text-white/30 hover:text-white/50 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
