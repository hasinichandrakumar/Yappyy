interface YapUpIconLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function YapUpIconLogo({ width = 64, height = 64, className = "" }: YapUpIconLogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 64 64" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="yapupIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4FC3F7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#29B6F6", stopOpacity: 1 }} />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1"/>
        </filter>
      </defs>
      
      {/* Background rounded square */}
      <rect 
        x="2" 
        y="2" 
        width="60" 
        height="60" 
        rx="12" 
        ry="12" 
        fill="url(#yapupIconGradient)"
        filter="url(#shadow)"
      />
      
      {/* Y Shape */}
      <g transform="translate(16, 12)">
        {/* Left arm of Y */}
        <path 
          d="M 0 0 L 10 18 L 14 18 L 6 4 L 6 0 Z" 
          fill="white"
        />
        {/* Right arm of Y */}
        <path 
          d="M 26 4 L 26 0 L 32 0 L 22 18 L 18 18 L 26 4 Z" 
          fill="white"
        />
        {/* Stem of Y */}
        <rect 
          x="10" 
          y="18" 
          width="12" 
          height="14" 
          fill="white"
        />
      </g>
      
      {/* Microphone base */}
      <g transform="translate(20, 42)">
        {/* Microphone stand */}
        <rect 
          x="10" 
          y="0" 
          width="4" 
          height="8" 
          fill="white"
        />
        {/* Microphone base */}
        <rect 
          x="6" 
          y="8" 
          width="12" 
          height="3" 
          rx="1.5" 
          fill="white"
        />
        {/* Sound hole */}
        <circle 
          cx="8" 
          cy="3" 
          r="1" 
          fill="url(#yapupIconGradient)"
        />
        <circle 
          cx="12" 
          cy="3" 
          r="1" 
          fill="url(#yapupIconGradient)"
        />
        <circle 
          cx="16" 
          cy="3" 
          r="1" 
          fill="url(#yapupIconGradient)"
        />
      </g>
    </svg>
  );
}

// Smaller version for favicon/small spaces
export function YapUpIconMini({ width = 32, height = 32, className = "" }: YapUpIconLogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 32 32" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="yapupMiniGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#4FC3F7", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#29B6F6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Background rounded square */}
      <rect 
        x="1" 
        y="1" 
        width="30" 
        height="30" 
        rx="6" 
        ry="6" 
        fill="url(#yapupMiniGradient)"
      />
      
      {/* Y Shape */}
      <g transform="translate(8, 6)">
        {/* Left arm of Y */}
        <path 
          d="M 0 0 L 5 9 L 7 9 L 3 2 L 3 0 Z" 
          fill="white"
        />
        {/* Right arm of Y */}
        <path 
          d="M 13 2 L 13 0 L 16 0 L 11 9 L 9 9 L 13 2 Z" 
          fill="white"
        />
        {/* Stem of Y */}
        <rect 
          x="5" 
          y="9" 
          width="6" 
          height="7" 
          fill="white"
        />
      </g>
      
      {/* Microphone base */}
      <g transform="translate(10, 21)">
        {/* Microphone stand */}
        <rect 
          x="5" 
          y="0" 
          width="2" 
          height="4" 
          fill="white"
        />
        {/* Microphone base */}
        <rect 
          x="3" 
          y="4" 
          width="6" 
          height="2" 
          rx="1" 
          fill="white"
        />
        {/* Sound holes */}
        <circle 
          cx="4" 
          cy="1.5" 
          r="0.5" 
          fill="url(#yapupMiniGradient)"
        />
        <circle 
          cx="6" 
          cy="1.5" 
          r="0.5" 
          fill="url(#yapupMiniGradient)"
        />
        <circle 
          cx="8" 
          cy="1.5" 
          r="0.5" 
          fill="url(#yapupMiniGradient)"
        />
      </g>
    </svg>
  );
}