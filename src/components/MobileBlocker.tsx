const MOBILE_BREAKPOINT = 768

const isMobile = window.innerWidth < MOBILE_BREAKPOINT

export function MobileBlocker() {
  if (!isMobile) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0e1a] text-white px-6">
      {/* Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        width={80}
        height={80}
        className="mb-6"
      >
        <defs>
          <linearGradient id="mbIceG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#7DD3FC' }} />
            <stop offset="50%" style={{ stopColor: '#38BDF8' }} />
            <stop offset="100%" style={{ stopColor: '#0EA5E9' }} />
          </linearGradient>
        </defs>
        <g transform="translate(60,58)">
          <polygon
            points="0,-45 39,-22.5 39,22.5 0,45 -39,22.5 -39,-22.5"
            fill="url(#mbIceG)"
            stroke="#BAE6FD"
            strokeWidth="1.2"
            opacity="0.95"
          />
          <circle cx="0" cy="0" r="4" fill="#fff" opacity="0.85" />
          {/* Eyes */}
          <ellipse cx="-10" cy="-3" rx="4" ry="4.5" fill="#0C4A6E" />
          <ellipse cx="10" cy="-3" rx="4" ry="4.5" fill="#0C4A6E" />
          <circle cx="-8.5" cy="-5.5" r="1.8" fill="#fff" />
          <circle cx="11.5" cy="-5.5" r="1.8" fill="#fff" />
          {/* Sad mouth */}
          <path
            d="M-7,10 Q0,5 7,10"
            fill="none"
            stroke="#0C4A6E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <h1 className="text-xl font-semibold mb-2 text-sky-300">
        aisu
      </h1>

      <div className="text-center max-w-xs">
        <p className="text-sm text-white/80 leading-relaxed mb-4">
          This experience is designed for desktop browsers only.
        </p>
        <p className="text-xs text-white/50">
          Please visit this site from a desktop computer for the full experience.
        </p>
      </div>

      {/* Monitor icon */}
      <div className="mt-8 flex items-center gap-2 text-white/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span className="text-xs">Desktop only</span>
      </div>
    </div>
  )
}

export { isMobile }
