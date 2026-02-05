const BootLogo = () => (
  <div className="boot-logo">
    <div className="boot-logo__float">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        width={120}
        height={120}
      >
        <defs>
          <linearGradient id="iceG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#7DD3FC' }} />
            <stop offset="50%" style={{ stopColor: '#38BDF8' }} />
            <stop offset="100%" style={{ stopColor: '#0EA5E9' }} />
          </linearGradient>
          <linearGradient id="shineG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fff', stopOpacity: 0.8 }} />
            <stop offset="40%" style={{ stopColor: '#fff', stopOpacity: 0.05 }} />
            <stop offset="100%" style={{ stopColor: '#fff', stopOpacity: 0 }} />
          </linearGradient>
          <filter id="crystalGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <g transform="translate(60,58)" filter="url(#crystalGlow)">
          {/* Main hexagon */}
          <polygon
            points="0,-45 39,-22.5 39,22.5 0,45 -39,22.5 -39,-22.5"
            fill="url(#iceG)"
            stroke="#BAE6FD"
            strokeWidth="1.2"
            opacity="0.95"
          >
            <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite" />
          </polygon>
          {/* Inner hexagon */}
          <polygon
            points="0,-28 24,-14 24,14 0,28 -24,14 -24,-14"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="0.8"
            opacity="0.4"
          >
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
          </polygon>
          {/* Crystal lines */}
          <line x1="0" y1="-45" x2="0" y2="45" stroke="#E0F2FE" strokeWidth="1" opacity="0.4" />
          <line x1="-39" y1="-22.5" x2="39" y2="22.5" stroke="#E0F2FE" strokeWidth="1" opacity="0.4" />
          <line x1="-39" y1="22.5" x2="39" y2="-22.5" stroke="#E0F2FE" strokeWidth="1" opacity="0.4" />
          {/* Shine overlay */}
          <polygon
            points="0,-45 39,-22.5 39,22.5 0,45 -39,22.5 -39,-22.5"
            fill="url(#shineG)"
            opacity="0.35"
          />
          {/* Center sparkle */}
          <circle cx="0" cy="0" r="4" fill="#fff" opacity="0.85">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
          {/* Small sparkles */}
          <circle cx="-14" cy="-20" r="1.5" fill="#fff" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="18" cy="-10" r="1" fill="#fff" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="10" cy="16" r="1.5" fill="#fff" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />
          </circle>
          {/* Kawaii face — eyes */}
          <ellipse className="boot-eye-left" cx="-10" cy="-3" rx="4" ry="4.5" fill="#0C4A6E" />
          <ellipse className="boot-eye-right" cx="10" cy="-3" rx="4" ry="4.5" fill="#0C4A6E" />
          {/* Eye shine */}
          <circle cx="-8.5" cy="-5.5" r="1.8" fill="#fff" />
          <circle cx="11.5" cy="-5.5" r="1.8" fill="#fff" />
          <circle cx="-10.5" cy="-2" r="1" fill="#fff" opacity="0.8" />
          <circle cx="9.5" cy="-2" r="1" fill="#fff" opacity="0.8" />
          {/* Smile */}
          <path d="M-7,6 Q0,13 7,6" fill="none" stroke="#0C4A6E" strokeWidth="1.8" strokeLinecap="round" />
          {/* Blush */}
          <ellipse cx="-18" cy="5" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.35">
            <animate attributeName="opacity" values="0.25;0.45;0.25" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="18" cy="5" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.35">
            <animate attributeName="opacity" values="0.25;0.45;0.25" dur="3s" repeatCount="indefinite" />
          </ellipse>
        </g>
      </svg>
    </div>
  </div>
)

export default BootLogo
