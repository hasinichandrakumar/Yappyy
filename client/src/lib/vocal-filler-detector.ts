// Advanced Vocal Filler Detection using Web Audio API
// This system analyzes raw audio frequency patterns to detect vocal fillers

export interface VocalFillerResult {
  detected: boolean;
  fillerType: string | null;
  confidence: number;
  timestamp: number;
  audioFeatures: {
    fundamentalFrequency: number;
    spectralCentroid: number;
    duration: number;
    volume: number;
  };
}

export class VocalFillerDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isActive = false;
  private onDetectionCallback: ((result: VocalFillerResult) => void) | null = null;
  
  // Frequency patterns for common vocal fillers (approximations)
  private readonly fillerPatterns = {
    'um': { minFreq: 150, maxFreq: 300, duration: 200, volume: 0.1 },
    'uh': { minFreq: 180, maxFreq: 350, duration: 150, volume: 0.1 },
    'er': { minFreq: 200, maxFreq: 400, duration: 180, volume: 0.1 },
    'ah': { minFreq: 250, maxFreq: 500, duration: 200, volume: 0.1 }
  };

  async initialize(): Promise<boolean> {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Get microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100
        } 
      });
      
      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.3;
      
      // Connect audio stream to analyser
      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.source.connect(this.analyser);
      
      console.log('🎤 Vocal filler detector initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize vocal filler detector:', error);
      return false;
    }
  }

  start(onDetection: (result: VocalFillerResult) => void): void {
    if (!this.analyser || !this.audioContext) {
      console.error('❌ Vocal filler detector not initialized');
      return;
    }

    this.onDetectionCallback = onDetection;
    this.isActive = true;
    this.analyze();
    console.log('🎯 Vocal filler detection started');
  }

  stop(): void {
    this.isActive = false;
    this.onDetectionCallback = null;
    console.log('⏹️ Vocal filler detection stopped');
  }

  destroy(): void {
    this.stop();
    
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyser = null;
    console.log('🧹 Vocal filler detector destroyed');
  }

  private analyze(): void {
    if (!this.isActive || !this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate audio features
    const audioFeatures = this.calculateAudioFeatures(dataArray);
    
    // Check for vocal filler patterns
    const detectionResult = this.detectFillerPattern(audioFeatures);
    
    if (detectionResult.detected && this.onDetectionCallback) {
      this.onDetectionCallback(detectionResult);
    }

    // Continue analysis
    requestAnimationFrame(() => this.analyze());
  }

  private calculateAudioFeatures(frequencyData: Uint8Array): VocalFillerResult['audioFeatures'] {
    let sum = 0;
    let weightedSum = 0;
    let totalMagnitude = 0;
    
    for (let i = 0; i < frequencyData.length; i++) {
      const magnitude = frequencyData[i];
      const frequency = (i * (this.audioContext!.sampleRate / 2)) / frequencyData.length;
      
      sum += magnitude;
      weightedSum += magnitude * frequency;
      totalMagnitude += magnitude;
    }

    const spectralCentroid = totalMagnitude > 0 ? weightedSum / totalMagnitude : 0;
    const averageVolume = sum / frequencyData.length;
    
    // Simple fundamental frequency estimation (find peak in low frequencies)
    let maxMagnitude = 0;
    let fundamentalFrequency = 0;
    
    for (let i = 1; i < Math.min(frequencyData.length / 4, 100); i++) {
      if (frequencyData[i] > maxMagnitude) {
        maxMagnitude = frequencyData[i];
        fundamentalFrequency = (i * (this.audioContext!.sampleRate / 2)) / frequencyData.length;
      }
    }

    return {
      fundamentalFrequency,
      spectralCentroid,
      duration: 100, // Approximate frame duration
      volume: averageVolume / 255 // Normalize to 0-1
    };
  }

  private detectFillerPattern(audioFeatures: VocalFillerResult['audioFeatures']): VocalFillerResult {
    const { fundamentalFrequency, volume } = audioFeatures;
    
    // Check if we have enough volume to consider speech
    if (volume < 0.05) {
      return {
        detected: false,
        fillerType: null,
        confidence: 0,
        timestamp: Date.now(),
        audioFeatures
      };
    }

    // Check against known filler patterns
    for (const [fillerType, pattern] of Object.entries(this.fillerPatterns)) {
      if (
        fundamentalFrequency >= pattern.minFreq &&
        fundamentalFrequency <= pattern.maxFreq &&
        volume >= pattern.volume
      ) {
        // Calculate confidence based on how well it matches the pattern
        const freqMatch = 1 - Math.abs(fundamentalFrequency - (pattern.minFreq + pattern.maxFreq) / 2) / 
                         ((pattern.maxFreq - pattern.minFreq) / 2);
        const volumeMatch = Math.min(volume / pattern.volume, 1);
        const confidence = (freqMatch * 0.7 + volumeMatch * 0.3) * 0.8; // Max 80% confidence
        
        if (confidence > 0.4) { // Threshold for detection
          return {
            detected: true,
            fillerType,
            confidence,
            timestamp: Date.now(),
            audioFeatures
          };
        }
      }
    }

    return {
      detected: false,
      fillerType: null,
      confidence: 0,
      timestamp: Date.now(),
      audioFeatures
    };
  }
}

export const createVocalFillerDetector = () => new VocalFillerDetector();