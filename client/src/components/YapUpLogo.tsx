interface YapUpLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function YapUpLogo({ width = 200, height = 60, className = "" }: YapUpLogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 60" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#06B6D4", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#06B6D4", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Logo Icon - Speaking/Microphone with Sound Waves */}
      <g transform="translate(10, 15)">
        {/* Microphone */}
        <rect x="12" y="8" width="6" height="16" rx="3" fill="url(#iconGradient)"/>
        <rect x="10" y="26" width="10" height="4" rx="2" fill="url(#iconGradient)"/>
        <line x1="15" y1="30" x2="15" y2="34" stroke="url(#iconGradient)" strokeWidth="2"/>
        
        {/* Sound waves */}
        <path 
          d="M 25 15 Q 30 15 30 20 Q 30 25 25 25" 
          fill="none" 
          stroke="url(#iconGradient)" 
          strokeWidth="2" 
          opacity="0.8"
        />
        <path 
          d="M 28 12 Q 35 12 35 20 Q 35 28 28 28" 
          fill="none" 
          stroke="url(#iconGradient)" 
          strokeWidth="2" 
          opacity="0.6"
        />
        <path 
          d="M 31 9 Q 40 9 40 20 Q 40 31 31 31" 
          fill="none" 
          stroke="url(#iconGradient)" 
          strokeWidth="2" 
          opacity="0.4"
        />
      </g>
      
      {/* Text Logo */}
      <g transform="translate(65, 35)">
        {/* YapUp Text */}
        <text 
          x="0" 
          y="0" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="24" 
          fontWeight="700" 
          fill="url(#logoGradient)"
        >
          YapUp
        </text>
        {/* Tagline */}
        <text 
          x="0" 
          y="15" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="10" 
          fontWeight="400" 
          fill="#6B7280"
        >
          Master Your Voice
        </text>
      </g>
    </svg>
  );
}

// Icon-only version for smaller spaces
export function YapUpIcon({ width = 40, height = 40, className = "" }: YapUpLogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 40 40" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="iconOnlyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#06B6D4", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      <g transform="translate(5, 8)">
        {/* Microphone */}
        <rect x="12" y="4" width="6" height="16" rx="3" fill="url(#iconOnlyGradient)"/>
        <rect x="10" y="22" width="10" height="4" rx="2" fill="url(#iconOnlyGradient)"/>
        <line x1="15" y1="26" x2="15" y2="30" stroke="url(#iconOnlyGradient)" strokeWidth="2"/>
        
        {/* Sound waves */}
        <path 
          d="M 25 11 Q 30 11 30 16 Q 30 21 25 21" 
          fill="none" 
          stroke="url(#iconOnlyGradient)" 
          strokeWidth="2" 
          opacity="0.8"
        />
        <path 
          d="M 28 8 Q 35 8 35 16 Q 35 24 28 24" 
          fill="none" 
          stroke="url(#iconOnlyGradient)" 
          strokeWidth="2" 
          opacity="0.6"
        />
      </g>
    </svg>
  );
}