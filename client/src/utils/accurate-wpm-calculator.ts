// Accurate WPM Calculator - Fixes calculation and data saving issues
export interface AccurateWPMData {
  currentWPM: number;
  averageWPM: number;
  peakWPM: number;
  totalWords: number;
  totalDuration: number; // in seconds
  timeSegments: { time: number; wpm: number; words: string[] }[];
  isValid: boolean;
  confidence: number; // 0-1, how confident we are in this calculation
}

export class AccurateWPMCalculator {
  private wordBuffer: { word: string; timestamp: number }[] = [];
  private sessionStartTime: number = 0;
  private sessionEndTime: number = 0;
  private isSessionActive: boolean = false;
  private minWordsForCalculation = 5; // Minimum words needed for accurate WPM
  private minDurationForCalculation = 10; // Minimum 10 seconds for accurate WPM
  
  constructor() {
    this.reset();
  }
  
  /**
   * Start a new WPM calculation session
   */
  startSession(): void {
    this.sessionStartTime = Date.now();
    this.isSessionActive = true;
    this.wordBuffer = [];
    console.log('🔄 WPM session started');
  }
  
  /**
   * End the current WPM calculation session
   */
  endSession(): void {
    this.sessionEndTime = Date.now();
    this.isSessionActive = false;
    console.log('⏹️ WPM session ended');
  }
  
  /**
   * Reset the calculator state
   */
  reset(): void {
    this.wordBuffer = [];
    this.sessionStartTime = 0;
    this.sessionEndTime = 0;
    this.isSessionActive = false;
  }
  
  /**
   * Add words to the calculation with timestamps
   */
  addWords(words: string[], timestamp?: number): void {
    const currentTime = timestamp || Date.now();
    
    words.forEach(word => {
      // Clean the word (remove punctuation, normalize)
      const cleanWord = this.cleanWord(word);
      if (cleanWord.length > 0) {
        this.wordBuffer.push({
          word: cleanWord,
          timestamp: currentTime
        });
      }
    });
  }
  
  /**
   * Add words from a transcript (for backward compatibility)
   */
  addTranscript(transcript: string, timestamp?: number): void {
    const words = transcript.trim().split(/\s+/).filter(word => word.length > 0);
    this.addWords(words, timestamp);
  }
  
  /**
   * Calculate accurate WPM data
   */
  calculateWPM(): AccurateWPMData {
    const now = Date.now();
    const sessionDuration = this.isSessionActive 
      ? (now - this.sessionStartTime) / 1000 
      : (this.sessionEndTime - this.sessionStartTime) / 1000;
    
    // Check if we have enough data for accurate calculation
    const hasEnoughWords = this.wordBuffer.length >= this.minWordsForCalculation;
    const hasEnoughDuration = sessionDuration >= this.minDurationForCalculation;
    const isValid = hasEnoughWords && hasEnoughDuration;
    
    if (!isValid) {
      return {
        currentWPM: 0,
        averageWPM: 0,
        peakWPM: 0,
        totalWords: this.wordBuffer.length,
        totalDuration: sessionDuration,
        timeSegments: [],
        isValid: false,
        confidence: 0
      };
    }
    
    // Calculate current WPM (words per minute)
    const totalWords = this.wordBuffer.length;
    const totalDurationMinutes = sessionDuration / 60;
    const averageWPM = Math.round(totalWords / totalDurationMinutes);
    
    // Calculate current WPM (last 30 seconds)
    const thirtySecondsAgo = now - 30000;
    const recentWords = this.wordBuffer.filter(item => item.timestamp > thirtySecondsAgo);
    const recentDuration = Math.min(30, sessionDuration);
    const currentWPM = recentDuration > 0 
      ? Math.round((recentWords.length / recentDuration) * 60)
      : averageWPM;
    
    // Calculate peak WPM from time segments
    const peakWPM = this.calculatePeakWPM();
    
    // Calculate confidence based on data quality
    const confidence = this.calculateConfidence(totalWords, sessionDuration);
    
    return {
      currentWPM: Math.max(0, currentWPM),
      averageWPM: Math.max(0, averageWPM),
      peakWPM: Math.max(0, peakWPM),
      totalWords,
      totalDuration: sessionDuration,
      timeSegments: this.calculateTimeSegments(),
      isValid: true,
      confidence
    };
  }
  
  /**
   * Calculate WPM from a complete transcript and duration
   */
  static calculateFromTranscript(transcript: string, durationSeconds: number): number {
    if (!transcript || durationSeconds <= 0) return 0;
    
    // Clean and count words
    const words = transcript
      .trim()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .split(/\s+/)
      .filter(word => word.length > 0);
    
    const wordCount = words.length;
    const durationMinutes = durationSeconds / 60;
    
    // Only calculate if we have meaningful data
    if (wordCount < 5 || durationMinutes < 0.1) return 0;
    
    return Math.round(wordCount / durationMinutes);
  }
  
  /**
   * Clean a word for consistent counting
   */
  private cleanWord(word: string): string {
    return word
      .toLowerCase()
      .replace(/[^\w]/g, '') // Remove non-word characters
      .trim();
  }
  
  /**
   * Calculate peak WPM from time segments
   */
  private calculatePeakWPM(): number {
    const segments = this.calculateTimeSegments();
    if (segments.length === 0) return 0;
    
    return Math.max(...segments.map(segment => segment.wpm));
  }
  
  /**
   * Calculate time segments for detailed analysis
   */
  private calculateTimeSegments(): { time: number; wpm: number; words: string[] }[] {
    const segments: { time: number; wpm: number; words: string[] }[] = [];
    const segmentDuration = 10000; // 10 seconds per segment
    const now = Date.now();
    
    // Create segments
    for (let i = 0; i < 6; i++) { // 6 segments = 1 minute
      const segmentStart = now - (60000 - (i * segmentDuration));
      const segmentEnd = segmentStart + segmentDuration;
      
      const segmentWords = this.wordBuffer.filter(item => 
        item.timestamp >= segmentStart && item.timestamp < segmentEnd
      );
      
      const segmentWPM = segmentWords.length > 0 
        ? Math.round((segmentWords.length / (segmentDuration / 1000)) * 60)
        : 0;
      
      segments.push({
        time: segmentStart,
        wpm: segmentWPM,
        words: segmentWords.map(item => item.word)
      });
    }
    
    return segments.reverse(); // Return in chronological order
  }
  
  /**
   * Calculate confidence in the WPM calculation
   */
  private calculateConfidence(wordCount: number, durationSeconds: number): number {
    let confidence = 0;
    
    // More words = higher confidence
    if (wordCount >= 20) confidence += 0.4;
    else if (wordCount >= 10) confidence += 0.3;
    else if (wordCount >= 5) confidence += 0.2;
    
    // Longer duration = higher confidence
    if (durationSeconds >= 60) confidence += 0.4;
    else if (durationSeconds >= 30) confidence += 0.3;
    else if (durationSeconds >= 10) confidence += 0.2;
    
    // Consistent speaking = higher confidence
    const segments = this.calculateTimeSegments();
    if (segments.length > 0) {
      const wpmValues = segments.map(s => s.wpm).filter(wpm => wpm > 0);
      if (wpmValues.length > 1) {
        const variance = this.calculateVariance(wpmValues);
        const consistency = Math.max(0, 1 - (variance / 10000)); // Lower variance = higher consistency
        confidence += consistency * 0.2;
      }
    }
    
    return Math.min(1, confidence);
  }
  
  /**
   * Calculate variance of WPM values
   */
  private calculateVariance(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  /**
   * Get current session statistics
   */
  getSessionStats(): {
    wordCount: number;
    duration: number;
    isActive: boolean;
    startTime: number;
  } {
    const now = Date.now();
    const duration = this.isSessionActive 
      ? (now - this.sessionStartTime) / 1000 
      : (this.sessionEndTime - this.sessionStartTime) / 1000;
    
    return {
      wordCount: this.wordBuffer.length,
      duration,
      isActive: this.isSessionActive,
      startTime: this.sessionStartTime
    };
  }
  
  /**
   * Export data for saving to database
   */
  exportForSaving(): {
    averageWPM: number;
    totalWords: number;
    totalDuration: number;
    isValid: boolean;
    confidence: number;
    timeSegments: any[];
  } {
    const wpmData = this.calculateWPM();
    
    return {
      averageWPM: wpmData.averageWPM,
      totalWords: wpmData.totalWords,
      totalDuration: wpmData.totalDuration,
      isValid: wpmData.isValid,
      confidence: wpmData.confidence,
      timeSegments: wpmData.timeSegments
    };
  }
}

export default AccurateWPMCalculator;
