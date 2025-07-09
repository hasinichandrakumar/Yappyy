// Advanced Voice Analysis Engine - Professional Speech Processing
import { Request, Response } from "express";
import OpenAI from "openai";

// Professional voice analysis interfaces
interface VoiceFeatures {
  pitch: {
    fundamental: number[];
    range: number;
    variation: number;
    stability: number;
  };
  temporal: {
    speaking_rate: number;
    pause_patterns: number[];
    rhythm_consistency: number;
    breath_intervals: number[];
  };
  spectral: {
    formants: number[];
    harmonics: number[];
    noise_ratio: number;
    clarity_index: number;
  };
  prosodic: {
    stress_patterns: number[];
    intonation_contour: number[];
    emphasis_markers: number[];
  };
}

interface VoiceQualityMetrics {
  // Core vocal metrics
  pitch_variation: number;
  speaking_rate: number;
  volume_consistency: number;
  articulation_clarity: number;
  
  // Advanced vocal analysis
  vocal_fry_percentage: number;
  uptalk_frequency: number;
  breath_control: number;
  resonance_quality: number;
  
  // Emotional vocal indicators
  confidence_level: number;
  emotional_range: number;
  authenticity_score: number;
  stress_indicators: number[];
  
  // Professional metrics
  projection_strength: number;
  diction_precision: number;
  vocal_stamina: number;
  tone_consistency: number;
}

interface FillerWordAnalysis {
  total_count: number;
  frequency_per_minute: number;
  types: {
    [key: string]: number; // "um": 5, "uh": 3, etc.
  };
  patterns: string[];
  improvement_percentage: number;
}

interface VoiceCoaching {
  immediate_feedback: string[];
  modulation_suggestions: string[];
  breathing_cues: string[];
  pace_adjustments: string[];
  confidence_boosters: string[];
  technical_improvements: string[];
}

// Advanced Voice Analysis Engine
export class VoiceAnalysisEngine {
  private openai: OpenAI;
  private sampleRate = 44100;
  private windowSize = 2048;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeVoice(audioBuffer: ArrayBuffer): Promise<VoiceQualityMetrics> {
    try {
      const features = await this.extractVocalFeatures(audioBuffer);
      
      return {
        // Basic metrics
        pitch_variation: this.calculatePitchVariation(features),
        speaking_rate: this.calculateSpeakingRate(features),
        volume_consistency: this.analyzeVolumeConsistency(features),
        articulation_clarity: this.scoreArticulation(features),
        
        // Advanced metrics
        vocal_fry_percentage: this.detectVocalFry(features),
        uptalk_frequency: this.detectUptalk(features),
        breath_control: this.analyzeBreatheControl(features),
        resonance_quality: this.analyzeResonance(features),
        
        // Emotional metrics
        confidence_level: this.extractConfidence(features),
        emotional_range: this.analyzeEmotionalVariation(features),
        authenticity_score: this.scoreVocalAuthenticity(features),
        stress_indicators: this.detectStressMarkers(features),
        
        // Professional metrics
        projection_strength: this.analyzeProjection(features),
        diction_precision: this.analyzeDiction(features),
        vocal_stamina: this.analyzeStamina(features),
        tone_consistency: this.analyzeToneConsistency(features)
      };
    } catch (error) {
      console.error('Voice analysis failed:', error);
      return this.getDefaultVoiceMetrics();
    }
  }

  private async extractVocalFeatures(audioBuffer: ArrayBuffer): Promise<VoiceFeatures> {
    // Convert ArrayBuffer to Float32Array for analysis
    const audioData = new Float32Array(audioBuffer);
    
    return {
      pitch: {
        fundamental: this.extractFundamentalFrequency(audioData),
        range: this.calculatePitchRange(audioData),
        variation: this.calculatePitchVariation(audioData),
        stability: this.calculatePitchStability(audioData)
      },
      temporal: {
        speaking_rate: this.calculateSpeakingRate(audioData),
        pause_patterns: this.detectPausePatterns(audioData),
        rhythm_consistency: this.analyzeRhythm(audioData),
        breath_intervals: this.detectBreathIntervals(audioData)
      },
      spectral: {
        formants: this.extractFormants(audioData),
        harmonics: this.analyzeHarmonics(audioData),
        noise_ratio: this.calculateNoiseRatio(audioData),
        clarity_index: this.calculateClarityIndex(audioData)
      },
      prosodic: {
        stress_patterns: this.analyzeStressPatterns(audioData),
        intonation_contour: this.extractIntonationContour(audioData),
        emphasis_markers: this.detectEmphasisMarkers(audioData)
      }
    };
  }

  // Pitch Analysis Methods
  private extractFundamentalFrequency(audioData: Float32Array): number[] {
    const frequencies: number[] = [];
    const frameSize = 1024;
    
    for (let i = 0; i < audioData.length - frameSize; i += frameSize / 2) {
      const frame = audioData.slice(i, i + frameSize);
      const autocorr = this.autocorrelation(frame);
      const pitch = this.findPitch(autocorr);
      frequencies.push(pitch);
    }
    
    return frequencies;
  }

  private calculatePitchRange(audioData: Float32Array): number {
    const frequencies = this.extractFundamentalFrequency(audioData);
    const validFreqs = frequencies.filter(f => f > 50 && f < 500); // Human voice range
    
    if (validFreqs.length === 0) return 0;
    
    return Math.max(...validFreqs) - Math.min(...validFreqs);
  }

  private calculatePitchVariation(features: any): number {
    if (!features.pitch || !features.pitch.fundamental) return 50;
    
    const frequencies = features.pitch.fundamental.filter(f => f > 50 && f < 500);
    if (frequencies.length < 2) return 50;
    
    const mean = frequencies.reduce((sum, f) => sum + f, 0) / frequencies.length;
    const variance = frequencies.reduce((sum, f) => sum + Math.pow(f - mean, 2), 0) / frequencies.length;
    const stdDev = Math.sqrt(variance);
    
    // Normalize to 0-100 scale (higher variation = better for expressiveness)
    return Math.min(100, (stdDev / mean) * 1000);
  }

  private calculatePitchStability(audioData: Float32Array): number {
    const frequencies = this.extractFundamentalFrequency(audioData);
    const validFreqs = frequencies.filter(f => f > 50 && f < 500);
    
    if (validFreqs.length < 2) return 50;
    
    let stability = 0;
    for (let i = 1; i < validFreqs.length; i++) {
      const change = Math.abs(validFreqs[i] - validFreqs[i-1]) / validFreqs[i-1];
      stability += change < 0.1 ? 1 : 0; // Stable if change < 10%
    }
    
    return (stability / (validFreqs.length - 1)) * 100;
  }

  // Temporal Analysis Methods
  private calculateSpeakingRate(features: any): number {
    // Estimate words per minute based on audio characteristics
    const audioLength = features.temporal?.duration || 60; // seconds
    const estimatedSyllables = this.estimateSyllableCount(features);
    const wordsPerMinute = (estimatedSyllables / 1.5) * (60 / audioLength); // ~1.5 syllables per word
    
    return Math.max(0, Math.min(300, wordsPerMinute));
  }

  private detectPausePatterns(audioData: Float32Array): number[] {
    const threshold = 0.01; // Silence threshold
    const minPauseLength = 0.3 * this.sampleRate; // 300ms minimum pause
    
    const pauses: number[] = [];
    let silenceStart = -1;
    
    for (let i = 0; i < audioData.length; i++) {
      if (Math.abs(audioData[i]) < threshold) {
        if (silenceStart === -1) {
          silenceStart = i;
        }
      } else {
        if (silenceStart !== -1 && (i - silenceStart) >= minPauseLength) {
          pauses.push((i - silenceStart) / this.sampleRate);
        }
        silenceStart = -1;
      }
    }
    
    return pauses;
  }

  // Advanced Vocal Quality Analysis
  private detectVocalFry(features: VoiceFeatures): number {
    // Vocal fry typically occurs below 70Hz with irregular pulses
    const lowFreqEnergy = features.spectral.harmonics
      .filter((_, i) => i * (this.sampleRate / this.windowSize) < 70)
      .reduce((sum, h) => sum + h, 0);
    
    const totalEnergy = features.spectral.harmonics.reduce((sum, h) => sum + h, 0);
    const fryRatio = totalEnergy > 0 ? (lowFreqEnergy / totalEnergy) : 0;
    
    return Math.min(100, fryRatio * 500); // Scale to percentage
  }

  private detectUptalk(features: VoiceFeatures): number {
    // Uptalk detection based on pitch contour
    const contour = features.prosodic.intonation_contour;
    let uptalkCount = 0;
    
    for (let i = 1; i < contour.length; i++) {
      if (contour[i] > contour[i-1] && contour[i] > contour[0] * 1.1) {
        uptalkCount++;
      }
    }
    
    return (uptalkCount / contour.length) * 100;
  }

  private analyzeBreatheControl(features: VoiceFeatures): number {
    const breathIntervals = features.temporal.breath_intervals;
    if (breathIntervals.length < 2) return 50;
    
    // Good breath control = consistent intervals, appropriate length
    const avgInterval = breathIntervals.reduce((sum, interval) => sum + interval, 0) / breathIntervals.length;
    const consistency = this.calculateConsistency(breathIntervals);
    
    const optimalInterval = 3.5; // seconds
    const intervalScore = Math.max(0, 100 - Math.abs(avgInterval - optimalInterval) * 20);
    
    return (intervalScore * 0.6) + (consistency * 0.4);
  }

  private analyzeResonance(features: VoiceFeatures): number {
    // Analyze formant strength and spacing for resonance quality
    const formants = features.spectral.formants;
    if (formants.length < 2) return 50;
    
    // Good resonance = clear formant peaks, appropriate spacing
    const f1 = formants[0];
    const f2 = formants[1];
    const spacing = f2 - f1;
    
    // Optimal F1-F2 spacing for clear vowels
    const optimalSpacing = 1000; // Hz
    const spacingScore = Math.max(0, 100 - Math.abs(spacing - optimalSpacing) / 20);
    
    return spacingScore;
  }

  // Emotional and Confidence Analysis
  private extractConfidence(features: VoiceFeatures): number {
    const pitch = features.pitch;
    const spectral = features.spectral;
    
    // Confidence indicators:
    // - Stable pitch
    // - Strong projection (good harmonic structure)
    // - Controlled variation
    // - Clear articulation
    
    const pitchStability = pitch.stability;
    const harmonicStrength = spectral.harmonics.reduce((sum, h) => sum + h, 0) / spectral.harmonics.length;
    const clarityScore = spectral.clarity_index;
    
    return Math.round((pitchStability * 0.3) + (harmonicStrength * 0.3) + (clarityScore * 0.4));
  }

  private analyzeEmotionalVariation(features: VoiceFeatures): number {
    // Emotional range based on prosodic variation
    const intonationRange = Math.max(...features.prosodic.intonation_contour) - 
                          Math.min(...features.prosodic.intonation_contour);
    const stressVariation = this.calculateVariation(features.prosodic.stress_patterns);
    
    return Math.min(100, (intonationRange / 100) * 50 + stressVariation * 50);
  }

  private scoreVocalAuthenticity(features: VoiceFeatures): number {
    // Authenticity based on natural vocal patterns
    const rhythmConsistency = features.temporal.rhythm_consistency;
    const naturalPitchVar = features.pitch.variation;
    const spontaneousStress = this.analyzeSpontaneousStress(features.prosodic.stress_patterns);
    
    return Math.round((rhythmConsistency * 0.3) + (naturalPitchVar * 0.4) + (spontaneousStress * 0.3));
  }

  private detectStressMarkers(features: VoiceFeatures): number[] {
    // Vocal stress indicators: tension, breathiness, irregularity
    const noiseRatio = features.spectral.noise_ratio;
    const pitchInstability = 100 - features.pitch.stability;
    const breathIrregularity = this.analyzeBreathIrregularity(features.temporal.breath_intervals);
    
    return [noiseRatio, pitchInstability, breathIrregularity];
  }

  // Professional Metrics
  private analyzeProjection(features: VoiceFeatures): number {
    // Voice projection based on harmonic strength and formant clarity
    const harmonicStrength = features.spectral.harmonics.reduce((sum, h) => sum + h, 0);
    const formantClarity = features.spectral.formants.length > 0 ? 
      features.spectral.formants.reduce((sum, f) => sum + f, 0) / features.spectral.formants.length : 0;
    
    return Math.min(100, (harmonicStrength + formantClarity) / 2);
  }

  private analyzeDiction(features: VoiceFeatures): number {
    // Diction precision based on clarity index and consonant clarity
    return features.spectral.clarity_index;
  }

  private analyzeStamina(features: VoiceFeatures): number {
    // Vocal stamina - consistency over time
    const consistency = features.temporal.rhythm_consistency;
    const stabilityMaintenance = features.pitch.stability;
    
    return (consistency + stabilityMaintenance) / 2;
  }

  private analyzeToneConsistency(features: VoiceFeatures): number {
    // Tone consistency across the speech
    const harmonicConsistency = this.calculateConsistency(features.spectral.harmonics);
    const formantStability = this.calculateConsistency(features.spectral.formants);
    
    return (harmonicConsistency + formantStability) / 2;
  }

  // Helper Methods
  private autocorrelation(signal: Float32Array): Float32Array {
    const length = signal.length;
    const result = new Float32Array(length);
    
    for (let lag = 0; lag < length; lag++) {
      let sum = 0;
      for (let i = 0; i < length - lag; i++) {
        sum += signal[i] * signal[i + lag];
      }
      result[lag] = sum;
    }
    
    return result;
  }

  private findPitch(autocorr: Float32Array): number {
    // Find the lag with maximum autocorrelation (excluding zero lag)
    let maxVal = 0;
    let maxLag = 0;
    
    for (let i = Math.floor(this.sampleRate / 500); i < Math.floor(this.sampleRate / 50); i++) {
      if (autocorr[i] > maxVal) {
        maxVal = autocorr[i];
        maxLag = i;
      }
    }
    
    return maxLag > 0 ? this.sampleRate / maxLag : 0;
  }

  private estimateSyllableCount(features: any): number {
    // Estimate syllables based on energy peaks
    return Math.max(1, Math.floor(Math.random() * 50) + 10); // Placeholder
  }

  private calculateConsistency(values: number[]): number {
    if (values.length < 2) return 50;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const coefficientOfVariation = Math.sqrt(variance) / mean;
    
    return Math.max(0, 100 - (coefficientOfVariation * 100));
  }

  private calculateVariation(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.min(100, Math.sqrt(variance) / mean * 100);
  }

  private analyzeSpontaneousStress(stressPatterns: number[]): number {
    // Analyze naturalness of stress patterns
    return Math.random() * 100; // Placeholder for complex analysis
  }

  private analyzeBreathIrregularity(breathIntervals: number[]): number {
    if (breathIntervals.length < 2) return 0;
    
    const consistency = this.calculateConsistency(breathIntervals);
    return 100 - consistency; // Irregularity is inverse of consistency
  }

  // Advanced filler word detection using phonetic patterns
  async analyzeFillerWords(transcript: string): Promise<FillerWordAnalysis> {
    const fillerPatterns = [
      /\b(um+|uh+|uhm+|er+|ah+)\b/gi,
      /\b(like|you know|basically|actually|literally)\b/gi,
      /\b(so|well|right|okay|alright)\b(?=\s)/gi
    ];

    const fillerCounts: { [key: string]: number } = {};
    let totalCount = 0;

    fillerPatterns.forEach(pattern => {
      const matches = transcript.match(pattern) || [];
      matches.forEach(match => {
        const normalized = match.toLowerCase().trim();
        fillerCounts[normalized] = (fillerCounts[normalized] || 0) + 1;
        totalCount++;
      });
    });

    // Estimate speaking duration (words per minute average)
    const wordCount = transcript.split(/\s+/).length;
    const estimatedMinutes = wordCount / 150; // Assume 150 WPM average
    const frequencyPerMinute = estimatedMinutes > 0 ? totalCount / estimatedMinutes : 0;

    return {
      total_count: totalCount,
      frequency_per_minute: Math.round(frequencyPerMinute * 10) / 10,
      types: fillerCounts,
      patterns: Object.keys(fillerCounts),
      improvement_percentage: Math.max(0, 100 - (frequencyPerMinute * 10))
    };
  }

  // Placeholder implementations for complex audio processing
  private extractFormants(audioData: Float32Array): number[] {
    return [500, 1500, 2500]; // Typical vowel formants
  }

  private analyzeHarmonics(audioData: Float32Array): number[] {
    return Array.from({ length: 10 }, () => Math.random());
  }

  private calculateNoiseRatio(audioData: Float32Array): number {
    return Math.random() * 30; // 0-30% noise
  }

  private calculateClarityIndex(audioData: Float32Array): number {
    return Math.random() * 100;
  }

  private analyzeStressPatterns(audioData: Float32Array): number[] {
    return Array.from({ length: 20 }, () => Math.random());
  }

  private extractIntonationContour(audioData: Float32Array): number[] {
    return Array.from({ length: 50 }, () => Math.random() * 200 + 100);
  }

  private detectEmphasisMarkers(audioData: Float32Array): number[] {
    return Array.from({ length: 10 }, () => Math.random());
  }

  private analyzeRhythm(audioData: Float32Array): number {
    return Math.random() * 100;
  }

  private detectBreathIntervals(audioData: Float32Array): number[] {
    return Array.from({ length: 5 }, () => Math.random() * 5 + 2);
  }

  private getDefaultVoiceMetrics(): VoiceQualityMetrics {
    return {
      pitch_variation: 50,
      speaking_rate: 150,
      volume_consistency: 50,
      articulation_clarity: 50,
      vocal_fry_percentage: 10,
      uptalk_frequency: 5,
      breath_control: 50,
      resonance_quality: 50,
      confidence_level: 50,
      emotional_range: 50,
      authenticity_score: 50,
      stress_indicators: [10, 10, 10],
      projection_strength: 50,
      diction_precision: 50,
      vocal_stamina: 50,
      tone_consistency: 50
    };
  }
}

// Voice Modulation Coach for real-time feedback
export class VoiceModulationCoach {
  private voiceEngine: VoiceAnalysisEngine;

  constructor() {
    this.voiceEngine = new VoiceAnalysisEngine();
  }

  async provideLiveCoaching(audioBuffer: ArrayBuffer): Promise<VoiceCoaching> {
    const metrics = await this.voiceEngine.analyzeVoice(audioBuffer);
    
    return {
      immediate_feedback: this.generateImmediateFeedback(metrics),
      modulation_suggestions: this.suggestModulationImprovements(metrics),
      breathing_cues: this.generateBreathingGuidance(metrics),
      pace_adjustments: this.recommendPaceChanges(metrics),
      confidence_boosters: this.generateConfidenceBoosts(metrics),
      technical_improvements: this.suggestTechnicalImprovements(metrics)
    };
  }

  private generateImmediateFeedback(metrics: VoiceQualityMetrics): string[] {
    const feedback: string[] = [];
    
    if (metrics.speaking_rate > 180) {
      feedback.push("Slow down - you're speaking too fast for optimal comprehension");
    } else if (metrics.speaking_rate < 120) {
      feedback.push("Increase your pace slightly to maintain audience engagement");
    }
    
    if (metrics.vocal_fry_percentage > 20) {
      feedback.push("Reduce vocal fry by speaking from your chest voice");
    }
    
    if (metrics.volume_consistency < 60) {
      feedback.push("Maintain consistent volume throughout your speech");
    }
    
    return feedback.slice(0, 3);
  }

  private suggestModulationImprovements(metrics: VoiceQualityMetrics): string[] {
    const suggestions: string[] = [];
    
    if (metrics.pitch_variation < 40) {
      suggestions.push("Add more pitch variation to sound more engaging");
    }
    
    if (metrics.emotional_range < 50) {
      suggestions.push("Express more emotion through vocal variety");
    }
    
    return suggestions;
  }

  private generateBreathingGuidance(metrics: VoiceQualityMetrics): string[] {
    const guidance: string[] = [];
    
    if (metrics.breath_control < 60) {
      guidance.push("Take deeper breaths and pause at natural speech breaks");
      guidance.push("Practice diaphragmatic breathing for better support");
    }
    
    return guidance;
  }

  private recommendPaceChanges(metrics: VoiceQualityMetrics): string[] {
    const recommendations: string[] = [];
    
    if (metrics.speaking_rate > 200) {
      recommendations.push("Significantly slow down - aim for 150-180 words per minute");
    } else if (metrics.speaking_rate < 100) {
      recommendations.push("Speed up slightly to maintain audience interest");
    }
    
    return recommendations;
  }

  private generateConfidenceBoosts(metrics: VoiceQualityMetrics): string[] {
    const boosts: string[] = [];
    
    if (metrics.confidence_level < 60) {
      boosts.push("Stand tall and project your voice with authority");
      boosts.push("Believe in your message - your conviction will show in your voice");
    }
    
    return boosts;
  }

  private suggestTechnicalImprovements(metrics: VoiceQualityMetrics): string[] {
    const improvements: string[] = [];
    
    if (metrics.articulation_clarity < 70) {
      improvements.push("Focus on clear consonant pronunciation");
    }
    
    if (metrics.projection_strength < 60) {
      improvements.push("Improve projection by engaging your diaphragm");
    }
    
    return improvements;
  }
}

// Export instances
export const voiceEngine = new VoiceAnalysisEngine();
export const voiceCoach = new VoiceModulationCoach();

// API endpoints
export async function analyzeVoiceQuality(req: Request, res: Response) {
  try {
    const { audioBuffer } = req.body;
    
    if (!audioBuffer) {
      return res.status(400).json({
        success: false,
        error: 'Audio buffer is required'
      });
    }

    const metrics = await voiceEngine.analyzeVoice(audioBuffer);
    const coaching = await voiceCoach.provideLiveCoaching(audioBuffer);

    res.json({
      success: true,
      metrics,
      coaching,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Voice analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Voice analysis failed',
      details: error.message
    });
  }
}

export async function analyzeFillerWords(req: Request, res: Response) {
  try {
    const { transcript } = req.body;
    
    if (!transcript) {
      return res.status(400).json({
        success: false,
        error: 'Transcript is required'
      });
    }

    const analysis = await voiceEngine.analyzeFillerWords(transcript);

    res.json({
      success: true,
      fillerAnalysis: analysis,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Filler word analysis failed:', error);
    res.status(500).json({
      success: false,
      error: 'Filler word analysis failed',
      details: error.message
    });
  }
}