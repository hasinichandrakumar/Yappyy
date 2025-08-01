// Enhanced Filler Word Detector - Captures UM and UH that browser speech recognition misses
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

interface FillerDetectionResult {
  fillerWords: string[];
  timestamps: number[];
  confidence: number;
  totalFillers: number;
  umCount: number;
  uhCount: number;
  likeCount: number;
  soCount: number;
}

export class EnhancedFillerDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private isAnalyzing = false;
  private detectionBuffer: number[] = [];
  private fillerBuffer: string[] = [];

  constructor() {
    console.log('🎯 Enhanced Filler Detector initialized');
  }

  // Initialize audio analysis for direct filler detection
  async initializeAudioAnalysis(stream: MediaStream): Promise<boolean> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.3;
      source.connect(this.analyser);
      
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.isAnalyzing = true;
      
      // Start continuous analysis
      this.startContinuousAnalysis();
      
      console.log('🎵 Audio analysis for UM/UH detection initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize audio analysis:', error);
      return false;
    }
  }

  private startContinuousAnalysis() {
    if (!this.isAnalyzing || !this.analyser || !this.dataArray) return;

    const analyze = () => {
      if (!this.isAnalyzing) return;
      
      this.analyser!.getByteFrequencyData(this.dataArray!);
      
      // Analyze frequency patterns for UM/UH detection
      const umUhPattern = this.detectUmUhPattern(this.dataArray!);
      if (umUhPattern.detected) {
        this.fillerBuffer.push(umUhPattern.type);
        console.log(`🎯 AUDIO: ${umUhPattern.type} detected via frequency analysis`);
      }
      
      requestAnimationFrame(analyze);
    };
    
    analyze();
  }

  private detectUmUhPattern(frequencyData: Uint8Array): { detected: boolean; type: string } {
    // UM and UH have specific frequency characteristics
    // UM: typically 200-400Hz with nasal resonance
    // UH: typically 300-600Hz with lower resonance
    
    let lowFreqEnergy = 0;
    let midFreqEnergy = 0;
    let highFreqEnergy = 0;
    
    const binCount = frequencyData.length;
    
    for (let i = 0; i < binCount; i++) {
      const freq = (i * 22050) / binCount; // Convert to Hz (assuming 44.1kHz sample rate)
      
      if (freq >= 150 && freq <= 400) {
        lowFreqEnergy += frequencyData[i];
      } else if (freq >= 400 && freq <= 800) {
        midFreqEnergy += frequencyData[i];
      } else if (freq >= 800 && freq <= 1600) {
        highFreqEnergy += frequencyData[i];
      }
    }
    
    const totalEnergy = lowFreqEnergy + midFreqEnergy + highFreqEnergy;
    
    if (totalEnergy < 500) return { detected: false, type: '' }; // Too quiet
    
    const lowRatio = lowFreqEnergy / totalEnergy;
    const midRatio = midFreqEnergy / totalEnergy;
    
    // UM pattern: strong low frequencies, moderate mid
    if (lowRatio > 0.4 && midRatio > 0.25 && midRatio < 0.45) {
      return { detected: true, type: 'um' };
    }
    
    // UH pattern: moderate low, strong mid frequencies
    if (lowRatio > 0.25 && lowRatio < 0.45 && midRatio > 0.4) {
      return { detected: true, type: 'uh' };
    }
    
    return { detected: false, type: '' };
  }

  // Process audio buffer for offline filler detection
  async processAudioBuffer(audioBuffer: ArrayBuffer): Promise<FillerDetectionResult> {
    try {
      // Convert audio buffer to frequency analysis
      const audioData = new Uint8Array(audioBuffer);
      const fillerWords: string[] = [];
      const timestamps: number[] = [];
      
      // Analyze audio in chunks for filler patterns
      const chunkSize = 4096;
      let umCount = 0;
      let uhCount = 0;
      
      for (let i = 0; i < audioData.length; i += chunkSize) {
        const chunk = audioData.slice(i, i + chunkSize);
        const pattern = this.analyzeAudioChunk(chunk, i / audioData.length);
        
        if (pattern.detected) {
          fillerWords.push(pattern.type);
          timestamps.push(pattern.timestamp);
          
          if (pattern.type === 'um') umCount++;
          if (pattern.type === 'uh') uhCount++;
        }
      }
      
      return {
        fillerWords,
        timestamps,
        confidence: fillerWords.length > 0 ? 0.85 : 0,
        totalFillers: fillerWords.length,
        umCount,
        uhCount,
        likeCount: 0, // Will be detected from transcript
        soCount: 0 // Will be detected from transcript
      };
      
    } catch (error) {
      console.error('❌ Audio buffer processing failed:', error);
      return this.getEmptyResult();
    }
  }

  private analyzeAudioChunk(chunk: Uint8Array, timeRatio: number): { detected: boolean; type: string; timestamp: number } {
    // Simplified frequency analysis for chunk
    let lowEnergy = 0;
    let midEnergy = 0;
    
    for (let i = 0; i < chunk.length; i++) {
      const value = chunk[i];
      if (i < chunk.length / 3) {
        lowEnergy += value;
      } else if (i < (2 * chunk.length) / 3) {
        midEnergy += value;
      }
    }
    
    const totalEnergy = lowEnergy + midEnergy;
    if (totalEnergy < 200) return { detected: false, type: '', timestamp: 0 };
    
    const lowRatio = lowEnergy / totalEnergy;
    const midRatio = midEnergy / totalEnergy;
    
    const timestamp = timeRatio * 100; // Convert to percentage of audio
    
    if (lowRatio > 0.45 && midRatio > 0.3) {
      return { detected: true, type: 'um', timestamp };
    }
    
    if (midRatio > 0.5 && lowRatio > 0.25) {
      return { detected: true, type: 'uh', timestamp };
    }
    
    return { detected: false, type: '', timestamp: 0 };
  }

  // Enhanced transcript analysis for all filler types
  analyzeTranscriptFillers(transcript: string): FillerDetectionResult {
    if (!transcript || transcript.trim().length === 0) {
      return this.getEmptyResult();
    }

    const text = transcript.toLowerCase();
    const words = text.split(/\s+/);
    const fillerWords: string[] = [];
    const timestamps: number[] = [];
    
    let umCount = 0;
    let uhCount = 0;
    let likeCount = 0;
    let soCount = 0;

    // Define comprehensive filler patterns
    const fillerPatterns = [
      { pattern: /\bum\b/g, type: 'um' },
      { pattern: /\buh\b/g, type: 'uh' },
      { pattern: /\buhmm?\b/g, type: 'uhm' },
      { pattern: /\bumm+\b/g, type: 'umm' },
      { pattern: /\blike\b/g, type: 'like' },
      { pattern: /\bso\b(?!\s+(?:that|what|when|where|why|how|many|much))/g, type: 'so' },
      { pattern: /\byou know\b/g, type: 'you know' },
      { pattern: /\bbasically\b/g, type: 'basically' },
      { pattern: /\bactually\b/g, type: 'actually' },
      { pattern: /\bkind of\b/g, type: 'kind of' },
      { pattern: /\bsort of\b/g, type: 'sort of' }
    ];

    // Process each filler pattern
    fillerPatterns.forEach(({ pattern, type }) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        fillerWords.push(type);
        
        // Estimate timestamp based on position in text
        const position = match.index || 0;
        const timeRatio = position / text.length;
        timestamps.push(timeRatio * 100);
        
        // Count specific types
        if (type === 'um' || type === 'umm') umCount++;
        if (type === 'uh' || type === 'uhm') uhCount++;
        if (type === 'like') likeCount++;
        if (type === 'so') soCount++;
      }
      // Reset regex lastIndex for next iteration
      pattern.lastIndex = 0;
    });

    // Add fillers from audio analysis buffer
    this.fillerBuffer.forEach(filler => {
      fillerWords.push(filler);
      if (filler === 'um') umCount++;
      if (filler === 'uh') uhCount++;
    });

    return {
      fillerWords,
      timestamps,
      confidence: fillerWords.length > 0 ? 0.95 : 0,
      totalFillers: fillerWords.length,
      umCount,
      uhCount,
      likeCount,
      soCount
    };
  }

  // Get buffered fillers from real-time audio analysis
  getBufferedFillers(): string[] {
    const fillers = [...this.fillerBuffer];
    this.fillerBuffer = []; // Clear buffer
    return fillers;
  }

  // Stop analysis and cleanup
  stop() {
    this.isAnalyzing = false;
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
    this.dataArray = null;
    this.fillerBuffer = [];
  }

  private getEmptyResult(): FillerDetectionResult {
    return {
      fillerWords: [],
      timestamps: [],
      confidence: 0,
      totalFillers: 0,
      umCount: 0,
      uhCount: 0,
      likeCount: 0,
      soCount: 0
    };
  }
}