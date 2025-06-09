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
          <stop offset="0%" style={{ stopColor: "#4F8EF7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5BA3F5", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4F8EF7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5BA3F5", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Logo Icon - Exclamation and Sound Waves */}
      <g transform="translate(10, 12)">
        {/* Exclamation mark */}
        <rect x="8" y="4" width="4" height="16" rx="2" fill="url(#iconGradient)"/>
        <circle cx="10" cy="26" r="2.5" fill="url(#iconGradient)"/>
        
        {/* Sound waves */}
        <path 
          d="M 18 8 Q 22 8 22 16 Q 22 24 18 24" 
          fill="none" 
          stroke="url(#iconGradient)" 
          strokeWidth="2.5" 
          opacity="0.8"
          strokeLinecap="round"
        />
        <path 
          d="M 23 6 Q 28 6 28 16 Q 28 26 23 26" 
          fill="none" 
          stroke="url(#iconGradient)" 
          strokeWidth="2.5" 
          opacity="0.6"
          strokeLinecap="round"
        />
        <path 
          d="M 28 4 Q 34 4 34 16 Q 34 28 28 28" 
          fill="none" 
          stroke="url(#iconGradient)" 
          strokeWidth="2.5" 
          opacity="0.4"
          strokeLinecap="round"
        />
      </g>
      
      {/* Text Logo */}
      <g transform="translate(55, 35)">
        {/* YapUp Text */}
        <text 
          x="0" 
          y="0" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="28" 
          fontWeight="600" 
          fill="url(#logoGradient)"
        >
          YapUp
        </text>
        {/* Tagline */}
        <text 
          x="0" 
          y="16" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="11" 
          fontWeight="400" 
          fill="#9CA3AF"
          letterSpacing="0.5px"
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
          <stop offset="0%" style={{ stopColor: "#4F8EF7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5BA3F5", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      <g transform="translate(8, 8)">
        {/* Exclamation mark */}
        <rect x="10" y="4" width="4" height="12" rx="2" fill="url(#iconOnlyGradient)"/>
        <circle cx="12" cy="20" r="2" fill="url(#iconOnlyGradient)"/>
        
        {/* Sound waves */}
        <path 
          d="M 18 7 Q 21 7 21 12 Q 21 17 18 17" 
          fill="none" 
          stroke="url(#iconOnlyGradient)" 
          strokeWidth="2" 
          opacity="0.8"
          strokeLinecap="round"
        />
        <path 
          d="M 21 5 Q 25 5 25 12 Q 25 19 21 19" 
          fill="none" 
          stroke="url(#iconOnlyGradient)" 
          strokeWidth="2" 
          opacity="0.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}