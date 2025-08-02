import { useState, useCallback, useRef } from 'react';

interface FillerDetectionResult {
  totalFillers: number;
  fillerTypes: Record<string, number>;
  fillerTimestamps: Array<{
    word: string;
    timestamp: number;
    confidence: number;
  }>;
  detectionMethod: 'transcript' | 'audio' | 'hybrid';
}

export function useAdvancedFillerDetection() {
  const [fillerResults, setFillerResults] = useState<FillerDetectionResult>({
    totalFillers: 0,
    fillerTypes: {},
    fillerTimestamps: [],
    detectionMethod: 'hybrid'
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);

  // Enhanced filler word patterns with phonetic variations
  const fillerPatterns = {
    // Primary vocal fillers with variations
    um: [
      /\b(um|umm|ummm|uhm|uhmm)\b/gi,
      /\b(u+m+h*)\b/gi,
      /\b(mmm+)\b/gi
    ],
    uh: [
      /\b(uh|uhh|uhhh|er|err|ah|ahh)\b/gi,
      /\b(u+h+)\b/gi,
      /\b(e+r+)\b/gi,
      /\b(a+h+)\b/gi
    ],
    // Discourse markers
    like: [/\b(like)\b/gi],
    so: [/\b(so)\b/gi],
    well: [/\b(well)\b/gi],
    okay: [/\b(okay|ok)\b/gi],
    right: [/\b(right)\b/gi],
    actually: [/\b(actually)\b/gi],
    basically: [/\b(basically)\b/gi],
    literally: [/\b(literally)\b/gi],
    
    // Multi-word fillers
    youknow: [/\b(you know)\b/gi],
    imean: [/\b(i mean)\b/gi],
    kindof: [/\b(kind of|kinda)\b/gi],
    sortof: [/\b(sort of|sorta)\b/gi],
    iguess: [/\b(i guess)\b/gi],
    
    // Hesitation sounds
    hmm: [/\b(hmm|hm|mmm)\b/gi],
    eh: [/\b(eh|meh)\b/gi],
    oh: [/\b(oh|ohh)\b/gi]
  };

  // Audio-based filler detection using frequency analysis
  const initializeAudioAnalysis = useCallback((stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      source.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      frequencyDataRef.current = new Uint8Array(bufferLength);
      
      console.log('🎤 Advanced audio analysis initialized for filler detection');
    } catch (error) {
      console.warn('⚠️ Audio analysis initialization failed:', error);
    }
  }, []);

  // Detect vocal fillers using audio frequency analysis
  const analyzeAudioForFillers = useCallback(() => {
    if (!analyserRef.current || !frequencyDataRef.current) return null;

    analyserRef.current.getByteFrequencyData(frequencyDataRef.current);
    
    // Analyze frequency patterns typical of "um" and "uh" sounds
    // "Um" typically has energy around 100-300Hz with nasal resonance
    // "Uh" typically has energy around 200-500Hz with vowel formants
    
    const lowFreqEnergy = frequencyDataRef.current.slice(10, 30).reduce((a, b) => a + b, 0);
    const midFreqEnergy = frequencyDataRef.current.slice(30, 60).reduce((a, b) => a + b, 0);
    const totalEnergy = frequencyDataRef.current.reduce((a, b) => a + b, 0);
    
    // Calculate spectral characteristics
    const spectralCentroid = calculateSpectralCentroid(frequencyDataRef.current);
    const spectralRolloff = calculateSpectralRolloff(frequencyDataRef.current);
    
    // Pattern matching for filler sounds
    const isLikelyFiller = (
      lowFreqEnergy > midFreqEnergy * 0.7 && // Low frequency dominance
      spectralCentroid < 800 && // Lower spectral centroid
      spectralRolloff < 1500 && // Limited frequency range
      totalEnergy > 1000 // Sufficient volume
    );

    return {
      isLikelyFiller,
      confidence: isLikelyFiller ? Math.min(95, (lowFreqEnergy / totalEnergy) * 200) : 0,
      spectralFeatures: {
        centroid: spectralCentroid,
        rolloff: spectralRolloff,
        lowFreqRatio: lowFreqEnergy / totalEnergy
      }
    };
  }, []);

  // Helper function to calculate spectral centroid
  const calculateSpectralCentroid = (frequencyData: Uint8Array): number => {
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < frequencyData.length; i++) {
      numerator += i * frequencyData[i];
      denominator += frequencyData[i];
    }
    
    return denominator > 0 ? (numerator / denominator) * 20 : 0; // Convert to Hz approximation
  };

  // Helper function to calculate spectral rolloff
  const calculateSpectralRolloff = (frequencyData: Uint8Array): number => {
    const totalEnergy = frequencyData.reduce((a, b) => a + b, 0);
    const threshold = totalEnergy * 0.85; // 85% rolloff point
    
    let cumulativeEnergy = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      cumulativeEnergy += frequencyData[i];
      if (cumulativeEnergy >= threshold) {
        return i * 20; // Convert to Hz approximation
      }
    }
    
    return frequencyData.length * 20;
  };

  // Enhanced transcript-based filler detection
  const detectFillersInTranscript = useCallback((transcript: string, timestamp?: number): FillerDetectionResult => {
    const detectedFillers: Array<{
      word: string;
      timestamp: number;
      confidence: number;
    }> = [];

    const fillerCounts: Record<string, number> = {};

    // Process each filler category
    Object.entries(fillerPatterns).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        const matches = transcript.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const normalizedMatch = normalizeFillerWord(match.toLowerCase().trim());
            
            detectedFillers.push({
              word: normalizedMatch,
              timestamp: timestamp || Date.now(),
              confidence: calculateTranscriptConfidence(match, transcript)
            });

            fillerCounts[normalizedMatch] = (fillerCounts[normalizedMatch] || 0) + 1;
          });
        }
      });
    });

    return {
      totalFillers: detectedFillers.length,
      fillerTypes: fillerCounts,
      fillerTimestamps: detectedFillers,
      detectionMethod: 'transcript'
    };
  }, []);

  // Normalize filler word variations to standard forms
  const normalizeFillerWord = (word: string): string => {
    // Normalize "um" variations
    if (/^u+m+h*$/.test(word) || /^mmm+$/.test(word)) return 'um';
    
    // Normalize "uh" variations
    if (/^u+h+$/.test(word) || /^e+r+$/.test(word) || /^a+h+$/.test(word)) return 'uh';
    
    // Normalize multi-word fillers
    if (word.includes('you know')) return 'you know';
    if (word.includes('i mean')) return 'i mean';
    if (word.includes('kind of') || word === 'kinda') return 'kind of';
    if (word.includes('sort of') || word === 'sorta') return 'sort of';
    
    return word;
  };

  // Calculate confidence score for transcript-based detection
  const calculateTranscriptConfidence = (match: string, fullTranscript: string): number => {
    const matchLength = match.length;
    const isExactFiller = ['um', 'uh', 'er', 'ah'].includes(match.toLowerCase());
    const contextWords = fullTranscript.split(' ').length;
    
    let confidence = 75; // Base confidence
    
    // Higher confidence for exact vocal fillers
    if (isExactFiller) confidence += 20;
    
    // Lower confidence if it might be part of a real word
    if (matchLength < 2) confidence -= 10;
    
    // Adjust based on context
    if (contextWords > 10) confidence += 5; // More context = better detection
    
    return Math.min(95, Math.max(50, confidence));
  };

  // Hybrid detection combining audio and transcript analysis
  const performHybridDetection = useCallback((transcript: string, timestamp?: number) => {
    const transcriptResults = detectFillersInTranscript(transcript, timestamp);
    const audioResults = analyzeAudioForFillers();

    // Combine results with weighted scoring
    let combinedResults = { ...transcriptResults };
    
    if (audioResults?.isLikelyFiller) {
      // If audio analysis detected a potential filler, boost confidence of recent transcript detections
      combinedResults.fillerTimestamps = combinedResults.fillerTimestamps.map(filler => ({
        ...filler,
        confidence: Math.min(95, filler.confidence + 10)
      }));
      
      combinedResults.detectionMethod = 'hybrid';
    }

    setFillerResults(combinedResults);
    return combinedResults;
  }, [detectFillersInTranscript, analyzeAudioForFillers]);

  // Real-time filler detection for live speech
  const startRealTimeDetection = useCallback((stream: MediaStream) => {
    initializeAudioAnalysis(stream);
    
    // Set up continuous audio analysis
    const analysisInterval = setInterval(() => {
      analyzeAudioForFillers();
    }, 100); // Analyze every 100ms

    return () => {
      clearInterval(analysisInterval);
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, [initializeAudioAnalysis, analyzeAudioForFillers]);

  // Get detailed filler statistics
  const getFillerStatistics = useCallback(() => {
    const stats = {
      totalFillers: fillerResults.totalFillers,
      mostCommonFiller: Object.entries(fillerResults.fillerTypes)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none',
      fillerRate: 0,
      severityLevel: 'low' as 'low' | 'medium' | 'high',
      recommendations: [] as string[]
    };

    // Calculate filler rate and severity
    if (stats.totalFillers > 0) {
      if (stats.totalFillers <= 2) {
        stats.severityLevel = 'low';
        stats.recommendations.push('Great job keeping filler words to a minimum!');
      } else if (stats.totalFillers <= 5) {
        stats.severityLevel = 'medium';
        stats.recommendations.push('Try pausing instead of using filler words');
        stats.recommendations.push('Practice speaking more slowly to reduce fillers');
      } else {
        stats.severityLevel = 'high';
        stats.recommendations.push('Focus on eliminating "um" and "uh" sounds');
        stats.recommendations.push('Practice with deliberate pauses');
        stats.recommendations.push('Record yourself to become more aware of filler usage');
      }
    }

    return stats;
  }, [fillerResults]);

  return {
    fillerResults,
    detectFillersInTranscript,
    performHybridDetection,
    startRealTimeDetection,
    getFillerStatistics,
    analyzeAudioForFillers
  };
}