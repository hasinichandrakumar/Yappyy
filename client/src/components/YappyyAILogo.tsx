import React from 'react';

interface YappyyAILogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function YappyyAILogo({ width = 64, height = 64, className = "" }: YappyyAILogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 64 64" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Main gradient for the background */}
        <linearGradient id="yappyyBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} /> {/* blue-500 */}
          <stop offset="100%" style={{ stopColor: "#6366F1", stopOpacity: 1 }} /> {/* indigo-500 */}
        </linearGradient>

        {/* Neural network connection gradient */}
        <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#60A5FA", stopOpacity: 1 }} /> {/* blue-400 */}
          <stop offset="100%" style={{ stopColor: "#A5B4FC", stopOpacity: 1 }} /> {/* indigo-300 */}
        </linearGradient>

        {/* Glow effect filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Soft shadow */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
        </filter>
      </defs>

      {/* Background Circle */}
      <circle 
        cx="32" 
        cy="32" 
        r="30" 
        fill="url(#yappyyBgGradient)"
        filter="url(#shadow)"
      />

      {/* Neural Network Design */}
      <g transform="translate(16, 16)" filter="url(#glow)">
        {/* Nodes */}
        <circle cx="8" cy="8" r="3" fill="white" />
        <circle cx="24" cy="8" r="3" fill="white" />
        <circle cx="8" cy="24" r="3" fill="white" />
        <circle cx="24" cy="24" r="3" fill="white" />
        <circle cx="16" cy="16" r="4" fill="white" /> {/* Central node */}

        {/* Connections */}
        <line x1="8" y1="8" x2="16" y2="16" stroke="url(#neuralGradient)" strokeWidth="1.5" />
        <line x1="24" y1="8" x2="16" y2="16" stroke="url(#neuralGradient)" strokeWidth="1.5" />
        <line x1="8" y1="24" x2="16" y2="16" stroke="url(#neuralGradient)" strokeWidth="1.5" />
        <line x1="24" y1="24" x2="16" y2="16" stroke="url(#neuralGradient)" strokeWidth="1.5" />

        {/* Pulse Animation Rings */}
        <circle cx="16" cy="16" r="6" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6">
          <animate 
            attributeName="r" 
            values="6;10" 
            dur="2s" 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="opacity" 
            values="0.6;0" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        </circle>
        <circle cx="16" cy="16" r="6" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6">
          <animate 
            attributeName="r" 
            values="6;10" 
            dur="2s" 
            begin="1s"
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="opacity" 
            values="0.6;0" 
            dur="2s" 
            begin="1s"
            repeatCount="indefinite" 
          />
        </circle>
      </g>

      {/* Microphone Icon Overlay */}
      <g transform="translate(24, 20)" fill="white" opacity="0.9">
        <path d="M8,0 C10.209139,0 12,1.790861 12,4 L12,12 C12,14.209139 10.209139,16 8,16 C5.790861,16 4,14.209139 4,12 L4,4 C4,1.790861 5.790861,0 8,0 Z" />
        <path d="M0,11 L0,12 C0,16.418278 3.581722,20 8,20 C12.418278,20 16,16.418278 16,12 L16,11 L14,11 L14,12 C14,15.3137085 11.3137085,18 8,18 C4.6862915,18 2,15.3137085 2,12 L2,11 L0,11 Z" />
        <rect x="7" y="20" width="2" height="4" />
      </g>
    </svg>
  );
}

export function YappyyAILogoMini({ width = 32, height = 32, className = "" }: YappyyAILogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 32 32" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="yappyyMiniBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#6366F1", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="miniNeuralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#60A5FA", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#A5B4FC", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Background Circle */}
      <circle 
        cx="16" 
        cy="16" 
        r="15" 
        fill="url(#yappyyMiniBgGradient)"
      />

      {/* Simplified Neural Network */}
      <g transform="translate(8, 8)">
        {/* Nodes */}
        <circle cx="4" cy="4" r="1.5" fill="white" />
        <circle cx="12" cy="4" r="1.5" fill="white" />
        <circle cx="4" cy="12" r="1.5" fill="white" />
        <circle cx="12" cy="12" r="1.5" fill="white" />
        <circle cx="8" cy="8" r="2" fill="white" />

        {/* Connections */}
        <line x1="4" y1="4" x2="8" y2="8" stroke="url(#miniNeuralGradient)" strokeWidth="1" />
        <line x1="12" y1="4" x2="8" y2="8" stroke="url(#miniNeuralGradient)" strokeWidth="1" />
        <line x1="4" y1="12" x2="8" y2="8" stroke="url(#miniNeuralGradient)" strokeWidth="1" />
        <line x1="12" y1="12" x2="8" y2="8" stroke="url(#miniNeuralGradient)" strokeWidth="1" />
      </g>

      {/* Mini Microphone */}
      <g transform="translate(12, 10)" fill="white" opacity="0.9">
        <path d="M4,0 C5.1045695,0 6,0.8954305 6,2 L6,6 C6,7.1045695 5.1045695,8 4,8 C2.8954305,8 2,7.1045695 2,6 L2,2 C2,0.8954305 2.8954305,0 4,0 Z" />
        <path d="M0,5.5 L0,6 C0,8.209139 1.790861,10 4,10 C6.209139,10 8,8.209139 8,6 L8,5.5 L7,5.5 L7,6 C7,7.6568542 5.6568542,9 4,9 C2.3431458,9 1,7.6568542 1,6 L1,5.5 L0,5.5 Z" />
        <rect x="3.5" y="10" width="1" height="2" />
      </g>
    </svg>
  );
}