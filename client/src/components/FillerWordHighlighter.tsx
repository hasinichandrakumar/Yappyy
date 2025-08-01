import React from 'react';

interface FillerWordHighlighterProps {
  text: string;
  className?: string;
}

export function FillerWordHighlighter({ text, className = '' }: FillerWordHighlighterProps) {
  const highlightFillerWords = (content: string): string => {
    if (!content) return '';
    
    // Enhanced filler word patterns including UM and UH
    const fillerPatterns = [
      { pattern: /\b(um+|uhm+|uh+)\b/gi, class: 'vocal-filler' },
      { pattern: /\b(like|so|you know|basically|actually|literally)\b/gi, class: 'word-filler' },
      { pattern: /\b(kind of|sort of|i mean|i guess|you see)\b/gi, class: 'phrase-filler' },
      // Detect bracketed fillers added by the system
      { pattern: /\[(UM|UH|um|uh)\]/gi, class: 'detected-filler' },
      { pattern: /\[\d+ (UM|UH) detected\]/gi, class: 'detection-note' }
    ];
    
    let highlightedText = content;
    
    fillerPatterns.forEach(({ pattern, class: className }) => {
      highlightedText = highlightedText.replace(pattern, (match) => {
        const colorClass = 
          className === 'vocal-filler' ? 'bg-red-100 text-red-800 font-semibold' :
          className === 'word-filler' ? 'bg-yellow-100 text-yellow-800' :
          className === 'phrase-filler' ? 'bg-orange-100 text-orange-800' :
          className === 'detected-filler' ? 'bg-purple-200 text-purple-900 font-bold border border-purple-400 px-1 rounded' :
          'bg-blue-100 text-blue-800 font-medium';
        
        return `<span class="${colorClass} px-1 rounded-sm">${match}</span>`;
      });
    });
    
    return highlightedText;
  };

  return (
    <div 
      className={`prose prose-sm ${className}`}
      dangerouslySetInnerHTML={{ 
        __html: highlightFillerWords(text) 
      }}
    />
  );
}