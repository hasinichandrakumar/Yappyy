import { promises as fs } from 'fs';
import path from 'path';

export interface FillerDetectionResult {
  totalFillers: number;
  fillerTypes: Record<string, number>;
  fillerTimestamps: Array<{
    word: string;
    timestamp: number;
    confidence: number;
    position: number;
  }>;
  detectionMethod: 'transcript' | 'audio' | 'hybrid';
  accuracyScore: number;
  recommendations: string[];
}

export class AdvancedFillerDetectionEngine {
  private fillerPatterns = {
    // Enhanced vocal fillers with phonetic variations
    um: [
      /\b(?:um|umm|ummm|uhm|uhmm|mmm+)\b/gi,
      /\b(?:u+m+h*)\b/gi,
      /\b(?:mm+)\b/gi
    ],
    uh: [
      /\b(?:uh|uhh|uhhh|uhhhhh|er|err|erh|ah|ahh|eh|ehh)\b/gi,
      /\b(?:u+h+)\b/gi,
      /\b(?:e+r+)\b/gi,
      /\b(?:a+h+)\b/gi
    ],
    // Discourse markers
    like: [/\b(?:like)\b/gi],
    so: [/\b(?:so)\b/gi],
    well: [/\b(?:well)\b/gi],
    okay: [/\b(?:okay|ok)\b/gi],
    right: [/\b(?:right)\b/gi],
    actually: [/\b(?:actually)\b/gi],
    basically: [/\b(?:basically)\b/gi],
    literally: [/\b(?:literally)\b/gi],
    obviously: [/\b(?:obviously)\b/gi],
    
    // Multi-word fillers
    youknow: [/\b(?:you know)\b/gi],
    imean: [/\b(?:i mean)\b/gi],
    kindof: [/\b(?:kind of|kinda)\b/gi],
    sortof: [/\b(?:sort of|sorta)\b/gi],
    iguess: [/\b(?:i guess)\b/gi],
    yousee: [/\b(?:you see)\b/gi],
    
    // Hesitation sounds
    hmm: [/\b(?:hmm|hm|mmm+|mhm)\b/gi],
    eh: [/\b(?:eh|meh)\b/gi],
    oh: [/\b(?:oh|ohh|ohhh)\b/gi]
  };

  // Calculate spectral features for audio-based detection (placeholder for future implementation)
  private calculateSpectralFeatures(audioData?: ArrayBuffer): {
    hasVocalFillerSignature: boolean;
    confidence: number;
    spectralCentroid: number;
    spectralRolloff: number;
  } {
    // Placeholder for advanced audio analysis
    // In a real implementation, this would use Web Audio API or similar
    return {
      hasVocalFillerSignature: false,
      confidence: 0,
      spectralCentroid: 0,
      spectralRolloff: 0
    };
  }

  // Enhanced transcript-based filler detection
  detectFillersInTranscript(transcript: string, sessionDuration: number = 0): FillerDetectionResult {
    const detectedFillers: Array<{
      word: string;
      timestamp: number;
      confidence: number;
      position: number;
    }> = [];

    const fillerCounts: Record<string, number> = {};
    const words = transcript.toLowerCase().split(/\s+/);
    let wordPosition = 0;

    // Process each filler category with enhanced pattern matching
    Object.entries(this.fillerPatterns).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        let match;
        const regex = new RegExp(pattern.source, pattern.flags);
        
        while ((match = regex.exec(transcript.toLowerCase())) !== null) {
          const normalizedMatch = this.normalizeFillerWord(match[0]);
          const confidence = this.calculateTranscriptConfidence(match[0], transcript, category);
          
          // Calculate approximate timestamp based on word position
          const wordIndex = transcript.toLowerCase().substring(0, match.index).split(/\s+/).length - 1;
          const approximateTimestamp = sessionDuration > 0 ? 
            (wordIndex / words.length) * sessionDuration * 1000 : Date.now();

          detectedFillers.push({
            word: normalizedMatch,
            timestamp: approximateTimestamp,
            confidence,
            position: match.index
          });

          fillerCounts[normalizedMatch] = (fillerCounts[normalizedMatch] || 0) + 1;
        }
      });
    });

    // Sort by position in transcript
    detectedFillers.sort((a, b) => a.position - b.position);

    // Calculate accuracy score based on detection confidence
    const averageConfidence = detectedFillers.length > 0 
      ? detectedFillers.reduce((sum, filler) => sum + filler.confidence, 0) / detectedFillers.length
      : 0;

    // Generate recommendations based on detection results
    const recommendations = this.generateRecommendations(fillerCounts, detectedFillers.length, words.length);

    return {
      totalFillers: detectedFillers.length,
      fillerTypes: fillerCounts,
      fillerTimestamps: detectedFillers,
      detectionMethod: 'transcript',
      accuracyScore: averageConfidence,
      recommendations
    };
  }

  // Normalize filler word variations to standard forms
  private normalizeFillerWord(word: string): string {
    const cleanWord = word.toLowerCase().trim();
    
    // Normalize "um" variations
    if (/^u+m+h*$/.test(cleanWord) || /^mm+$/.test(cleanWord)) return 'um';
    
    // Normalize "uh" variations
    if (/^u+h+$/.test(cleanWord) || /^e+r+h*$/.test(cleanWord) || /^a+h+$/.test(cleanWord) || cleanWord === 'eh') return 'uh';
    
    // Normalize multi-word fillers
    if (cleanWord.includes('you know')) return 'you know';
    if (cleanWord.includes('i mean')) return 'i mean';
    if (cleanWord.includes('kind of') || cleanWord === 'kinda') return 'kind of';
    if (cleanWord.includes('sort of') || cleanWord === 'sorta') return 'sort of';
    if (cleanWord.includes('you see')) return 'you see';
    if (cleanWord.includes('i guess')) return 'i guess';
    
    return cleanWord;
  }

  // Calculate confidence score for transcript-based detection
  private calculateTranscriptConfidence(match: string, fullTranscript: string, category: string): number {
    const matchLength = match.length;
    const isVocalFiller = ['um', 'uh'].includes(category);
    const contextWords = fullTranscript.split(/\s+/).length;
    
    let confidence = 70; // Base confidence
    
    // Higher confidence for vocal fillers (um, uh)
    if (isVocalFiller) confidence += 20;
    
    // Higher confidence for exact matches
    if (['um', 'uh', 'er', 'ah'].includes(match.toLowerCase())) confidence += 15;
    
    // Lower confidence for very short matches that might be part of real words
    if (matchLength < 2) confidence -= 15;
    
    // Adjust based on context length (more context = better detection)
    if (contextWords > 20) confidence += 5;
    if (contextWords > 50) confidence += 5;
    
    // Penalty for potential false positives
    const surroundingContext = this.extractSurroundingContext(match, fullTranscript);
    if (this.isPotentialFalsePositive(match, surroundingContext)) {
      confidence -= 20;
    }
    
    return Math.min(95, Math.max(40, confidence));
  }

  // Extract surrounding context for better analysis
  private extractSurroundingContext(match: string, fullTranscript: string): string {
    const matchIndex = fullTranscript.toLowerCase().indexOf(match.toLowerCase());
    if (matchIndex === -1) return '';
    
    const start = Math.max(0, matchIndex - 50);
    const end = Math.min(fullTranscript.length, matchIndex + match.length + 50);
    
    return fullTranscript.substring(start, end);
  }

  // Check if a match might be a false positive
  private isPotentialFalsePositive(match: string, context: string): boolean {
    const cleanMatch = match.toLowerCase().trim();
    
    // Check if it's part of a larger word
    const wordBoundaryPattern = new RegExp(`\\b${cleanMatch}\\b`);
    if (!wordBoundaryPattern.test(context.toLowerCase())) {
      return true;
    }
    
    // Check for common false positives
    const falsePositivePatterns = [
      /\bum\w+/gi, // "umbrella", "number", etc.
      /\w+uh\w+/gi, // "somewhere", "something", etc.
      /\bso\s+(that|what|when|where|why)/gi, // "so that", "so what", etc.
    ];
    
    return falsePositivePatterns.some(pattern => pattern.test(context));
  }

  // Generate personalized recommendations based on filler analysis
  private generateRecommendations(fillerTypes: Record<string, number>, totalFillers: number, totalWords: number): string[] {
    const recommendations: string[] = [];
    const fillerRate = totalWords > 0 ? (totalFillers / totalWords) * 100 : 0;
    
    // General recommendations based on filler frequency
    if (totalFillers === 0) {
      recommendations.push("Excellent! No filler words detected. Your speech is clear and confident.");
    } else if (fillerRate < 2) {
      recommendations.push("Great job! Very few filler words detected. Your speech flows naturally.");
    } else if (fillerRate < 5) {
      recommendations.push("Good progress! Consider practicing with deliberate pauses instead of filler words.");
    } else {
      recommendations.push("Focus on reducing filler words by speaking more slowly and using intentional pauses.");
    }
    
    // Specific recommendations based on most common fillers
    const sortedFillers = Object.entries(fillerTypes).sort(([,a], [,b]) => b - a);
    
    if (sortedFillers.length > 0) {
      const [mostCommonFiller, count] = sortedFillers[0];
      
      if (mostCommonFiller === 'um' || mostCommonFiller === 'uh') {
        recommendations.push(`Try replacing "${mostCommonFiller}" sounds with brief, intentional pauses.`);
        recommendations.push("Practice breathing exercises to improve speech rhythm and reduce vocal fillers.");
      } else if (mostCommonFiller === 'like') {
        recommendations.push("Replace 'like' with more precise descriptive words or remove it entirely.");
      } else if (mostCommonFiller === 'you know') {
        recommendations.push("Instead of 'you know', try using specific examples or explanations.");
      } else if (mostCommonFiller === 'so') {
        recommendations.push("Use 'so' more strategically - only when making logical connections.");
      }
      
      if (count > 3) {
        recommendations.push("Record yourself practicing to become more aware of your most frequent filler words.");
      }
    }
    
    // Advanced recommendations for improvement
    if (totalFillers > 5) {
      recommendations.push("Practice the 'pause and breathe' technique when you feel the urge to use a filler.");
      recommendations.push("Focus on one sentence at a time to improve clarity and reduce hesitation.");
    }
    
    return recommendations.slice(0, 4); // Limit to 4 recommendations
  }

  // Hybrid detection combining multiple methods
  performHybridDetection(transcript: string, audioData?: ArrayBuffer, sessionDuration: number = 0): FillerDetectionResult {
    // Start with transcript-based detection
    const transcriptResults = this.detectFillersInTranscript(transcript, sessionDuration);
    
    // Future: Add audio analysis
    if (audioData) {
      const audioFeatures = this.calculateSpectralFeatures(audioData);
      
      // Adjust confidence scores based on audio analysis
      if (audioFeatures.hasVocalFillerSignature) {
        transcriptResults.fillerTimestamps = transcriptResults.fillerTimestamps.map(filler => ({
          ...filler,
          confidence: Math.min(95, filler.confidence + 10)
        }));
        
        transcriptResults.detectionMethod = 'hybrid';
        transcriptResults.accuracyScore = Math.min(95, transcriptResults.accuracyScore + 5);
      }
    }
    
    return transcriptResults;
  }

  // Get comprehensive filler statistics
  getFillerStatistics(detectionResult: FillerDetectionResult): {
    severityLevel: 'low' | 'medium' | 'high';
    mostProblematicFiller: string;
    improvementPotential: number;
    focusAreas: string[];
  } {
    const { totalFillers, fillerTypes } = detectionResult;
    
    let severityLevel: 'low' | 'medium' | 'high' = 'low';
    if (totalFillers > 8) severityLevel = 'high';
    else if (totalFillers > 3) severityLevel = 'medium';
    
    const mostProblematicFiller = Object.entries(fillerTypes)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';
    
    const improvementPotential = Math.min(100, (totalFillers * 10) + 20);
    
    const focusAreas: string[] = [];
    if (fillerTypes['um'] || fillerTypes['uh']) focusAreas.push('Vocal hesitation');
    if (fillerTypes['like'] > 2) focusAreas.push('Casual language');
    if (fillerTypes['you know'] || fillerTypes['i mean']) focusAreas.push('Conversational fillers');
    
    return {
      severityLevel,
      mostProblematicFiller,
      improvementPotential,
      focusAreas
    };
  }
}

// Export singleton instance
export const advancedFillerDetectionEngine = new AdvancedFillerDetectionEngine();