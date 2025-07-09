// Fast WPM Calculator with Real-time Performance Optimization
export interface WPMData {
  currentWPM: number;
  averageWPM: number;
  peakWPM: number;
  recentWords: string[];
  timeSegments: { time: number; wpm: number; words: string[] }[];
}

export class FastWPMCalculator {
  private wordBuffer: { word: string; timestamp: number }[] = [];
  private recentSegments: { time: number; wpm: number; words: string[] }[] = [];
  private maxBufferSize = 100;
  private segmentDuration = 5000; // 5 seconds
  private minWordsForCalculation = 3;
  
  // Performance optimizations
  private lastCalculation = 0;
  private calculationInterval = 500; // Calculate every 500ms
  private cachedWPM: WPMData | null = null;
  
  constructor() {
    this.initializeCalculator();
  }
  
  private initializeCalculator(): void {
    // Pre-allocate arrays for better performance
    this.wordBuffer = [];
    this.recentSegments = [];
    this.cachedWPM = {
      currentWPM: 0,
      averageWPM: 0,
      peakWPM: 0,
      recentWords: [],
      timeSegments: []
    };
  }
  
  addWords(text: string): WPMData {
    const now = Date.now();
    
    // Parse new words efficiently
    const words = this.parseWords(text);
    
    // Add words to buffer with timestamps
    words.forEach(word => {
      this.wordBuffer.push({ word, timestamp: now });
    });
    
    // Limit buffer size for performance
    if (this.wordBuffer.length > this.maxBufferSize) {
      this.wordBuffer = this.wordBuffer.slice(-this.maxBufferSize);
    }
    
    // Calculate WPM only if enough time has passed (performance optimization)
    if (now - this.lastCalculation > this.calculationInterval) {
      this.cachedWPM = this.calculateWPM();
      this.lastCalculation = now;
    }
    
    return this.cachedWPM!;
  }
  
  private parseWords(text: string): string[] {
    // Fast word parsing - optimized for performance
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }
  
  private calculateWPM(): WPMData {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Filter recent words (last minute)
    const recentWords = this.wordBuffer.filter(item => item.timestamp > oneMinuteAgo);
    
    if (recentWords.length < this.minWordsForCalculation) {
      return {
        currentWPM: 0,
        averageWPM: 0,
        peakWPM: 0,
        recentWords: [],
        timeSegments: []
      };
    }
    
    // Calculate current WPM (words per minute)
    const timeSpan = now - recentWords[0].timestamp;
    const currentWPM = Math.round((recentWords.length / timeSpan) * 60000);
    
    // Calculate segments for more detailed analysis
    this.updateTimeSegments(recentWords, now);
    
    // Calculate average and peak WPM
    const segmentWPMs = this.recentSegments.map(s => s.wpm);
    const averageWPM = segmentWPMs.length > 0 
      ? Math.round(segmentWPMs.reduce((sum, wpm) => sum + wpm, 0) / segmentWPMs.length)
      : currentWPM;
    
    const peakWPM = segmentWPMs.length > 0 ? Math.max(...segmentWPMs) : currentWPM;
    
    return {
      currentWPM: Math.max(0, currentWPM),
      averageWPM: Math.max(0, averageWPM),
      peakWPM: Math.max(0, peakWPM),
      recentWords: recentWords.map(item => item.word),
      timeSegments: this.recentSegments.slice(-12) // Last 12 segments (1 minute)
    };
  }
  
  private updateTimeSegments(recentWords: { word: string; timestamp: number }[], now: number): void {
    const segmentStart = now - this.segmentDuration;
    const segmentWords = recentWords.filter(item => item.timestamp > segmentStart);
    
    if (segmentWords.length >= this.minWordsForCalculation) {
      const timeSpan = now - segmentWords[0].timestamp;
      const segmentWPM = Math.round((segmentWords.length / timeSpan) * 60000);
      
      this.recentSegments.push({
        time: now,
        wpm: segmentWPM,
        words: segmentWords.map(item => item.word)
      });
      
      // Keep only recent segments (last 2 minutes)
      const twoMinutesAgo = now - 120000;
      this.recentSegments = this.recentSegments.filter(segment => segment.time > twoMinutesAgo);
    }
  }
  
  getCurrentWPM(): number {
    return this.cachedWPM?.currentWPM || 0;
  }
  
  getAverageWPM(): number {
    return this.cachedWPM?.averageWPM || 0;
  }
  
  getPeakWPM(): number {
    return this.cachedWPM?.peakWPM || 0;
  }
  
  getRecentWords(): string[] {
    return this.cachedWPM?.recentWords || [];
  }
  
  getTimeSegments(): { time: number; wpm: number; words: string[] }[] {
    return this.cachedWPM?.timeSegments || [];
  }
  
  reset(): void {
    this.wordBuffer = [];
    this.recentSegments = [];
    this.lastCalculation = 0;
    this.cachedWPM = {
      currentWPM: 0,
      averageWPM: 0,
      peakWPM: 0,
      recentWords: [],
      timeSegments: []
    };
  }
  
  // Performance metrics
  getPerformanceStats(): {
    bufferSize: number;
    segmentCount: number;
    lastCalculation: number;
    cacheHit: boolean;
  } {
    return {
      bufferSize: this.wordBuffer.length,
      segmentCount: this.recentSegments.length,
      lastCalculation: this.lastCalculation,
      cacheHit: this.cachedWPM !== null
    };
  }
}

// Export singleton for better performance
export const fastWPMCalculator = new FastWPMCalculator();