import React from 'react';

interface FillerWordHighlighterProps {
  text: string;
  className?: string;
}

export function FillerWordHighlighter({ text, className = '' }: FillerWordHighlighterProps) {
  const highlightFillerWords = (content: string): string => {
    if (!content) return '';
    
    // Enhanced filler word patterns including UM and UH with visual notation
    const fillerPatterns = [
      { pattern: /\b(um+|uhm+|uh+|er+|ah+|eh+)\b/gi, class: 'vocal-filler' },
      { pattern: /\b(like|so|you know|basically|actually|literally|well|okay|right)\b/gi, class: 'word-filler' },
      { pattern: /\b(kind of|sort of|i mean|i guess|you see|and stuff|or something)\b/gi, class: 'phrase-filler' },
      // Detect bracketed fillers added by the detection system
      { pattern: /\[(UM|UH|UHM|ER|AH|EH)\]/gi, class: 'detected-filler' },
      { pattern: /\[\d+ (UM|UH|filler|fillers) detected\]/gi, class: 'detection-note' },
      // Enhanced patterns for all caps filler notations
      { pattern: /\[([A-Z]{2,4})\]/gi, class: 'detected-filler' }
    ];
    
    let highlightedText = content;
    
    fillerPatterns.forEach(({ pattern, class: className }) => {
      highlightedText = highlightedText.replace(pattern, (match) => {
        const colorClass = 
          className === 'vocal-filler' ? 'bg-red-100 text-red-800 font-semibold border-l-2 border-red-400' :
          className === 'word-filler' ? 'bg-yellow-100 text-yellow-800' :
          className === 'phrase-filler' ? 'bg-orange-100 text-orange-800' :
          className === 'detected-filler' ? 'bg-purple-200 text-purple-900 font-bold border border-purple-400 shadow-sm' :
          className === 'detection-note' ? 'bg-blue-50 text-blue-700 text-xs font-medium border border-blue-300' :
          'bg-blue-100 text-blue-800 font-medium';
        
        return `<span class="${colorClass} px-1 py-0.5 rounded-sm mx-0.5" title="Detected filler word: ${match}">${match}</span>`;
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