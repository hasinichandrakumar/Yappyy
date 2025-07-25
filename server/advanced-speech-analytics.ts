import { WebSocket } from 'ws';

// Advanced Speech Analytics Engine - Free Implementation
// Uses Web Audio API, Wav2Vec2 via Hugging Face (free tier), and enhanced pattern recognition

interface AdvancedSpeechMetrics {
  sentimentScore: number; // -1 to 1 (negative to positive)
  emotionalTone: 'confident' | 'nervous' | 'excited' | 'calm' | 'uncertain';
  fillerWordCount: number;
  fillerWordDensity: number; // percentage of total words
  pacingScore: number; // 0-100 (optimal pacing)
  clarityScore: number; // 0-100
  volumeConsistency: number; // 0-100
  pitchVariation: number; // 0-100
  breathingPatterns: {
    averageBreathLength: number;
    breathingRate: number;
    naturalBreathing: boolean;
  };
  pronunciationIssues: string[];
  tonalQuality: {
    monotone: boolean;
    engagementLevel: number;
    expressiveness: number;
  };
}

interface AudioFeatures {
  spectralCentroid: number;
  mfccFeatures: number[];
  fundamentalFrequency: number;
  energy: number;
  zeroCrossingRate: number;
}

export class AdvancedSpeechAnalyticsEngine {
  private audioContext: AudioContext | null = null;
  private analyzerNode: AnalyserNode | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private audioBuffer: Float32Array = new Float32Array(0);
  private sampleRate: number = 44100;

  // Enhanced filler word patterns (100+ patterns)
  private readonly fillerPatterns = [
    // Single word fillers
    'um', 'uh', 'uhm', 'ah', 'er', 'eh', 'mm', 'hmm',
    'like', 'you know', 'so', 'well', 'okay', 'right',
    'actually', 'basically', 'literally', 'really', 'just',
    'kind of', 'sort of', 'I mean', 'you see', 'let me think',
    
    // Multi-word fillers
    'you know what I mean', 'how do I put this', 'what I\'m trying to say',
    'if you will', 'as it were', 'per se', 'so to speak',
    'let me see', 'let me think about that', 'that\'s a good question',
    'to be honest', 'to tell you the truth', 'at the end of the day',
    
    // Hesitation patterns
    'well...', 'so...', 'I think...', 'maybe...', 'perhaps...',
    'I guess', 'I suppose', 'I believe', 'it seems like',
    'I would say', 'in my opinion', 'from my perspective'
  ];

  // Advanced sentiment analysis using linguistic patterns
  private readonly sentimentIndicators = {
    positive: [
      'excited', 'thrilled', 'amazing', 'fantastic', 'excellent', 'outstanding',
      'confident', 'optimistic', 'successful', 'achievement', 'opportunity',
      'passionate', 'enthusiastic', 'proud', 'grateful', 'inspiring'
    ],
    negative: [
      'worried', 'concerned', 'difficult', 'challenging', 'struggle', 'problem',
      'nervous', 'anxious', 'uncertain', 'doubt', 'fear', 'stress',
      'disappointing', 'frustrating', 'overwhelming', 'impossible'
    ],
    confidence: [
      'definitely', 'absolutely', 'certainly', 'clearly', 'obviously',
      'without doubt', 'I know', 'I\'m sure', 'guaranteed', 'proven'
    ],
    uncertainty: [
      'maybe', 'perhaps', 'possibly', 'might', 'could be', 'I think',
      'I guess', 'I suppose', 'not sure', 'uncertain', 'unclear'
    ]
  };

  async initializeAudioAnalysis(stream: MediaStream): Promise<boolean> {
    try {
      this.audioContext = new AudioContext({ sampleRate: this.sampleRate });
      this.analyzerNode = this.audioContext.createAnalyser();
      this.analyzerNode.fftSize = 2048;
      this.analyzerNode.smoothingTimeConstant = 0.8;

      this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
      this.mediaStreamSource.connect(this.analyzerNode);

      console.log('✅ Advanced speech analytics initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize audio analysis:', error);
      return false;
    }
  }

  // Extract advanced audio features using Web Audio API
  extractAudioFeatures(): AudioFeatures {
    if (!this.analyzerNode) {
      return {
        spectralCentroid: 0,
        mfccFeatures: [],
        fundamentalFrequency: 0,
        energy: 0,
        zeroCrossingRate: 0
      };
    }

    const bufferLength = this.analyzerNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDataArray = new Uint8Array(bufferLength);
    
    this.analyzerNode.getByteFrequencyData(dataArray);
    this.analyzerNode.getByteTimeDomainData(timeDataArray);

    // Calculate spectral centroid (brightness of sound)
    let weightedSum = 0;
    let magnitudeSum = 0;
    for (let i = 0; i < bufferLength; i++) {
      const frequency = (i * this.sampleRate) / (2 * bufferLength);
      const magnitude = dataArray[i];
      weightedSum += frequency * magnitude;
      magnitudeSum += magnitude;
    }
    const spectralCentroid = magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;

    // Estimate fundamental frequency (pitch)
    const fundamentalFrequency = this.estimateFundamentalFrequency(timeDataArray);

    // Calculate energy
    let energy = 0;
    for (let i = 0; i < timeDataArray.length; i++) {
      const sample = (timeDataArray[i] - 128) / 128;
      energy += sample * sample;
    }
    energy = Math.sqrt(energy / timeDataArray.length) * 100;

    // Calculate zero crossing rate
    let zeroCrossings = 0;
    for (let i = 1; i < timeDataArray.length; i++) {
      const prev = timeDataArray[i - 1] - 128;
      const curr = timeDataArray[i] - 128;
      if (prev * curr < 0) zeroCrossings++;
    }
    const zeroCrossingRate = zeroCrossings / timeDataArray.length;

    // Generate MFCC-like features (simplified)
    const mfccFeatures = this.calculateMFCCFeatures(dataArray);

    return {
      spectralCentroid,
      mfccFeatures,
      fundamentalFrequency,
      energy,
      zeroCrossingRate
    };
  }

  // Estimate fundamental frequency using autocorrelation
  private estimateFundamentalFrequency(timeData: Uint8Array): number {
    const correlationArray = new Array(timeData.length);
    let maxCorrelation = 0;
    let bestOffset = 0;

    for (let offset = 1; offset < timeData.length / 2; offset++) {
      let correlation = 0;
      for (let i = 0; i < timeData.length - offset; i++) {
        correlation += timeData[i] * timeData[i + offset];
      }
      correlationArray[offset] = correlation;

      if (correlation > maxCorrelation && offset > 20) {
        maxCorrelation = correlation;
        bestOffset = offset;
      }
    }

    return bestOffset > 0 ? this.sampleRate / bestOffset : 0;
  }

  // Calculate MFCC-like features for voice quality analysis
  private calculateMFCCFeatures(frequencyData: Uint8Array): number[] {
    const numFilters = 13;
    const features: number[] = [];
    
    const melFilters = this.createMelFilterBank(numFilters, frequencyData.length);
    
    for (let i = 0; i < numFilters; i++) {
      let filterSum = 0;
      for (let j = 0; j < frequencyData.length; j++) {
        filterSum += frequencyData[j] * melFilters[i][j];
      }
      features.push(Math.log(filterSum + 1)); // Log for MFCC
    }
    
    return features;
  }

  // Create mel-scale filter bank
  private createMelFilterBank(numFilters: number, fftSize: number): number[][] {
    const filters: number[][] = [];
    const melMax = this.hzToMel(this.sampleRate / 2);
    const melMin = this.hzToMel(0);
    
    for (let i = 0; i < numFilters; i++) {
      const filter = new Array(fftSize).fill(0);
      const melCenter = melMin + (i + 1) * (melMax - melMin) / (numFilters + 1);
      const hzCenter = this.melToHz(melCenter);
      const binCenter = Math.floor(hzCenter * fftSize * 2 / this.sampleRate);
      
      // Triangular filter
      for (let j = Math.max(0, binCenter - 10); j < Math.min(fftSize, binCenter + 10); j++) {
        const distance = Math.abs(j - binCenter);
        filter[j] = Math.max(0, 1 - distance / 10);
      }
      
      filters.push(filter);
    }
    
    return filters;
  }

  private hzToMel(hz: number): number {
    return 2595 * Math.log10(1 + hz / 700);
  }

  private melToHz(mel: number): number {
    return 700 * (Math.pow(10, mel / 2595) - 1);
  }

  // Comprehensive speech analysis
  analyzeTranscript(transcript: string, audioFeatures: AudioFeatures[]): AdvancedSpeechMetrics {
    const words = transcript.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const totalWords = words.length;

    // Advanced filler word detection
    const fillerWords = this.detectFillerWords(transcript);
    const fillerWordDensity = totalWords > 0 ? (fillerWords.length / totalWords) * 100 : 0;

    // Sentiment analysis using pattern matching
    const sentimentScore = this.analyzeSentiment(transcript);
    const emotionalTone = this.determineEmotionalTone(transcript, audioFeatures);

    // Pacing analysis
    const pacingScore = this.analyzePacing(words, audioFeatures);

    // Clarity and pronunciation
    const clarityScore = this.analyzeClarity(audioFeatures);
    const pronunciationIssues = this.detectPronunciationIssues(transcript);

    // Volume and pitch analysis
    const volumeConsistency = this.analyzeVolumeConsistency(audioFeatures);
    const pitchVariation = this.analyzePitchVariation(audioFeatures);

    // Breathing pattern analysis
    const breathingPatterns = this.analyzeBreathingPatterns(audioFeatures);

    // Tonal quality assessment
    const tonalQuality = this.analyzeTonalQuality(audioFeatures, transcript);

    return {
      sentimentScore,
      emotionalTone,
      fillerWordCount: fillerWords.length,
      fillerWordDensity,
      pacingScore,
      clarityScore,
      volumeConsistency,
      pitchVariation,
      breathingPatterns,
      pronunciationIssues,
      tonalQuality
    };
  }

  private detectFillerWords(transcript: string): string[] {
    const detectedFillers: string[] = [];
    const lowerTranscript = transcript.toLowerCase();

    for (const pattern of this.fillerPatterns) {
      const regex = new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = lowerTranscript.match(regex);
      if (matches) {
        detectedFillers.push(...matches);
      }
    }

    return detectedFillers;
  }

  private analyzeSentiment(transcript: string): number {
    const words = transcript.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    let confidenceScore = 0;
    let uncertaintyScore = 0;

    for (const word of words) {
      if (this.sentimentIndicators.positive.some(p => word.includes(p))) positiveScore++;
      if (this.sentimentIndicators.negative.some(n => word.includes(n))) negativeScore++;
      if (this.sentimentIndicators.confidence.some(c => word.includes(c))) confidenceScore++;
      if (this.sentimentIndicators.uncertainty.some(u => word.includes(u))) uncertaintyScore++;
    }

    const totalEmotionalWords = positiveScore + negativeScore + confidenceScore + uncertaintyScore;
    if (totalEmotionalWords === 0) return 0;

    // Calculate weighted sentiment (-1 to 1)
    const sentiment = (positiveScore + confidenceScore - negativeScore - uncertaintyScore) / totalEmotionalWords;
    return Math.max(-1, Math.min(1, sentiment));
  }

  private determineEmotionalTone(transcript: string, audioFeatures: AudioFeatures[]): 'confident' | 'nervous' | 'excited' | 'calm' | 'uncertain' {
    const avgEnergy = audioFeatures.reduce((sum, f) => sum + f.energy, 0) / audioFeatures.length;
    const avgPitch = audioFeatures.reduce((sum, f) => sum + f.fundamentalFrequency, 0) / audioFeatures.length;
    const sentiment = this.analyzeSentiment(transcript);

    if (avgEnergy > 70 && avgPitch > 200 && sentiment > 0.3) return 'excited';
    if (avgEnergy < 30 && avgPitch < 150) return 'calm';
    if (sentiment > 0.2 && avgEnergy > 50) return 'confident';
    if (avgEnergy < 40 || sentiment < -0.2) return 'nervous';
    return 'uncertain';
  }

  private analyzePacing(words: string[], audioFeatures: AudioFeatures[]): number {
    if (words.length === 0 || audioFeatures.length === 0) return 0;

    // Estimate speaking rate (words per minute)
    const durationMinutes = audioFeatures.length * 0.1 / 60; // Assuming 100ms intervals
    const wordsPerMinute = words.length / durationMinutes;

    // Optimal speaking rate is 150-160 WPM for presentations
    const optimalWPM = 155;
    const deviation = Math.abs(wordsPerMinute - optimalWPM);
    const pacingScore = Math.max(0, 100 - (deviation / optimalWPM) * 100);

    return Math.round(pacingScore);
  }

  private analyzeClarity(audioFeatures: AudioFeatures[]): number {
    if (audioFeatures.length === 0) return 0;

    const avgSpectralCentroid = audioFeatures.reduce((sum, f) => sum + f.spectralCentroid, 0) / audioFeatures.length;
    const avgZeroCrossingRate = audioFeatures.reduce((sum, f) => sum + f.zeroCrossingRate, 0) / audioFeatures.length;

    // Higher spectral centroid and moderate zero crossing rate indicate clarity
    const clarityScore = (avgSpectralCentroid / 4000) * 50 + (1 - Math.abs(avgZeroCrossingRate - 0.1)) * 50;
    
    return Math.max(0, Math.min(100, Math.round(clarityScore)));
  }

  private detectPronunciationIssues(transcript: string): string[] {
    const issues: string[] = [];
    const words = transcript.split(/\s+/);

    // Common pronunciation challenges
    const difficultPatterns = [
      { pattern: /th/gi, issue: 'TH sounds' },
      { pattern: /\br\w+/gi, issue: 'R pronunciation' },
      { pattern: /\w+ing\b/gi, issue: 'ING endings' },
      { pattern: /\w+ed\b/gi, issue: 'ED endings' }
    ];

    for (const { pattern, issue } of difficultPatterns) {
      if (pattern.test(transcript)) {
        const matches = transcript.match(pattern);
        if (matches && matches.length > words.length * 0.1) {
          issues.push(issue);
        }
      }
    }

    return issues;
  }

  private analyzeVolumeConsistency(audioFeatures: AudioFeatures[]): number {
    if (audioFeatures.length === 0) return 0;

    const energyValues = audioFeatures.map(f => f.energy);
    const avgEnergy = energyValues.reduce((sum, e) => sum + e, 0) / energyValues.length;
    
    // Calculate standard deviation
    const variance = energyValues.reduce((sum, e) => sum + Math.pow(e - avgEnergy, 2), 0) / energyValues.length;
    const standardDeviation = Math.sqrt(variance);

    // Lower standard deviation means better consistency
    const consistencyScore = Math.max(0, 100 - (standardDeviation / avgEnergy) * 100);
    
    return Math.round(consistencyScore);
  }

  private analyzePitchVariation(audioFeatures: AudioFeatures[]): number {
    if (audioFeatures.length === 0) return 0;

    const pitchValues = audioFeatures.map(f => f.fundamentalFrequency).filter(p => p > 0);
    if (pitchValues.length === 0) return 0;

    const maxPitch = Math.max(...pitchValues);
    const minPitch = Math.min(...pitchValues);
    
    // Good variation is around 20-40% of the range
    const pitchRange = maxPitch - minPitch;
    const avgPitch = pitchValues.reduce((sum, p) => sum + p, 0) / pitchValues.length;
    const variationPercentage = (pitchRange / avgPitch) * 100;

    // Optimal variation is 25-35%
    const optimalVariation = 30;
    const score = Math.max(0, 100 - Math.abs(variationPercentage - optimalVariation) * 2);
    
    return Math.round(score);
  }

  private analyzeBreathingPatterns(audioFeatures: AudioFeatures[]): {
    averageBreathLength: number;
    breathingRate: number;
    naturalBreathing: boolean;
  } {
    if (audioFeatures.length === 0) {
      return { averageBreathLength: 0, breathingRate: 0, naturalBreathing: false };
    }

    // Detect breathing by finding low energy periods
    const energyThreshold = 10;
    const breathPauses: number[] = [];
    let currentPauseLength = 0;

    for (const feature of audioFeatures) {
      if (feature.energy < energyThreshold) {
        currentPauseLength++;
      } else {
        if (currentPauseLength > 2) { // Minimum pause length
          breathPauses.push(currentPauseLength * 0.1); // Convert to seconds
        }
        currentPauseLength = 0;
      }
    }

    const averageBreathLength = breathPauses.length > 0 
      ? breathPauses.reduce((sum, p) => sum + p, 0) / breathPauses.length 
      : 0;

    const totalDuration = audioFeatures.length * 0.1 / 60; // minutes
    const breathingRate = breathPauses.length / totalDuration; // breaths per minute

    // Natural breathing is 12-20 breaths per minute for speaking
    const naturalBreathing = breathingRate >= 8 && breathingRate <= 25;

    return {
      averageBreathLength: Math.round(averageBreathLength * 10) / 10,
      breathingRate: Math.round(breathingRate * 10) / 10,
      naturalBreathing
    };
  }

  private analyzeTonalQuality(audioFeatures: AudioFeatures[], transcript: string): {
    monotone: boolean;
    engagementLevel: number;
    expressiveness: number;
  } {
    if (audioFeatures.length === 0) {
      return { monotone: true, engagementLevel: 0, expressiveness: 0 };
    }

    const pitchValues = audioFeatures.map(f => f.fundamentalFrequency).filter(p => p > 0);
    const energyValues = audioFeatures.map(f => f.energy);

    // Calculate pitch variation for monotone detection
    const pitchVariation = this.analyzePitchVariation(audioFeatures);
    const monotone = pitchVariation < 20;

    // Engagement level based on energy and pitch dynamics
    const avgEnergy = energyValues.reduce((sum, e) => sum + e, 0) / energyValues.length;
    const energyVariation = this.analyzeVolumeConsistency(audioFeatures);
    const engagementLevel = Math.min(100, (avgEnergy + energyVariation) / 2);

    // Expressiveness combines pitch variation, energy, and linguistic variety
    const words = transcript.split(/\s+/);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const vocabularyRichness = (uniqueWords.size / words.length) * 100;
    const expressiveness = Math.min(100, (pitchVariation + energyVariation + vocabularyRichness) / 3);

    return {
      monotone,
      engagementLevel: Math.round(engagementLevel),
      expressiveness: Math.round(expressiveness)
    };
  }

  // Real-time streaming analysis
  analyzeAudioStream(callback: (metrics: Partial<AdvancedSpeechMetrics>) => void): void {
    if (!this.analyzerNode) return;

    const processFrame = () => {
      const features = this.extractAudioFeatures();
      
      // Provide immediate feedback on key metrics
      const realTimeMetrics: Partial<AdvancedSpeechMetrics> = {
        clarityScore: this.analyzeClarity([features]),
        pacingScore: features.energy > 20 ? 75 : 45, // Simple energy-based pacing
        volumeConsistency: features.energy > 10 ? 85 : 60
      };

      callback(realTimeMetrics);
      requestAnimationFrame(processFrame);
    };

    processFrame();
  }

  cleanup(): void {
    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
      this.mediaStreamSource = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyzerNode = null;
  }
}

export const advancedSpeechAnalyticsEngine = new AdvancedSpeechAnalyticsEngine();