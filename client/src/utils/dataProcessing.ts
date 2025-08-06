import * as tf from '@tensorflow/tfjs';

export interface ProcessedMetrics {
  wpm: number;
  eyeContact: number;
  confidence: number;
  fillerWords: { word: string; count: number }[];
  posture: number;
  voiceModulation: number;
}

export class DataProcessor {
  // Constants for calculations
  private static readonly SAMPLE_RATE = 44100;
  private static readonly FRAME_SIZE = 2048;
  private static readonly HOP_LENGTH = 512;
  private static readonly MEL_BANDS = 40;
  
  /**
   * Calculates Words Per Minute (WPM) from transcript and duration
   * @param transcript - The speech transcript
   * @param durationMs - Duration in milliseconds
   * @returns Accurate WPM calculation
   */
  static calculateWPM(transcript: string, durationMs: number): number {
    const words = transcript.trim().split(/\s+/).length;
    const minutes = durationMs / 60000; // Convert ms to minutes
    return Math.round(words / minutes);
  }

  /**
   * Calculates eye contact score from face landmarks
   * @param landmarks - Array of face landmarks from MediaPipe
   * @returns Eye contact score between 0 and 1
   */
  static calculateEyeContact(landmarks: any[]): number {
    if (!landmarks || landmarks.length === 0) return 0;

    // Extract eye landmarks
    const leftEye = landmarks.filter(l => l.type === 'leftEye');
    const rightEye = landmarks.filter(l => l.type === 'rightEye');
    
    // Calculate Eye Aspect Ratio (EAR)
    const leftEAR = this.calculateEyeAspectRatio(leftEye);
    const rightEAR = this.calculateEyeAspectRatio(rightEye);
    
    // Calculate gaze direction
    const gazeScore = this.calculateGazeScore(leftEye, rightEye);
    
    // Combine metrics with weights
    return Math.min(1, Math.max(0, 
      (leftEAR * 0.3) + 
      (rightEAR * 0.3) + 
      (gazeScore * 0.4)
    ));
  }

  /**
   * Calculates confidence score from multiple metrics
   * @param audioFeatures - Audio features from speech
   * @param poseData - Pose data from MediaPipe
   * @returns Confidence score between 0 and 1
   */
  static calculateConfidence(audioFeatures: Float32Array, poseData: any): number {
    // Calculate voice stability
    const voiceStability = this.calculateVoiceStability(audioFeatures);
    
    // Calculate posture confidence
    const postureConfidence = this.calculatePostureConfidence(poseData);
    
    // Calculate speech rate stability
    const speechRateStability = this.calculateSpeechRateStability(audioFeatures);
    
    // Combine metrics with weights
    return Math.min(1, Math.max(0,
      (voiceStability * 0.4) +
      (postureConfidence * 0.3) +
      (speechRateStability * 0.3)
    ));
  }

  /**
   * Detects and counts filler words in transcript
   * @param transcript - The speech transcript
   * @returns Array of filler words and their counts
   */
  static detectFillerWords(transcript: string): { word: string; count: number }[] {
    const fillerWords = [
      'um', 'uh', 'like', 'you know', 'sort of', 'kind of',
      'basically', 'literally', 'actually', 'well', 'so'
    ];
    
    const results: { [key: string]: number } = {};
    const words = transcript.toLowerCase().split(/\s+/);
    
    fillerWords.forEach(filler => {
      const count = words.filter(w => w === filler).length;
      if (count > 0) {
        results[filler] = count;
      }
    });
    
    return Object.entries(results).map(([word, count]) => ({ word, count }));
  }

  /**
   * Calculates posture score from pose landmarks
   * @param poseLandmarks - Pose landmarks from MediaPipe
   * @returns Posture score between 0 and 1
   */
  static calculatePosture(poseLandmarks: any[]): number {
    if (!poseLandmarks || poseLandmarks.length === 0) return 0;

    // Calculate shoulder alignment
    const shoulderAlignment = this.calculateShoulderAlignment(poseLandmarks);
    
    // Calculate spine alignment
    const spineAlignment = this.calculateSpineAlignment(poseLandmarks);
    
    // Calculate head position
    const headPosition = this.calculateHeadPosition(poseLandmarks);
    
    // Combine metrics with weights
    return Math.min(1, Math.max(0,
      (shoulderAlignment * 0.35) +
      (spineAlignment * 0.35) +
      (headPosition * 0.3)
    ));
  }

  /**
   * Calculates voice modulation score from audio features
   * @param audioFeatures - Audio features from speech
   * @returns Voice modulation score between 0 and 1
   */
  static calculateVoiceModulation(audioFeatures: Float32Array): number {
    // Calculate pitch variation
    const pitchVariation = this.calculatePitchVariation(audioFeatures);
    
    // Calculate volume variation
    const volumeVariation = this.calculateVolumeVariation(audioFeatures);
    
    // Calculate speaking rate variation
    const rateVariation = this.calculateSpeakingRateVariation(audioFeatures);
    
    // Combine metrics with weights
    return Math.min(1, Math.max(0,
      (pitchVariation * 0.4) +
      (volumeVariation * 0.3) +
      (rateVariation * 0.3)
    ));
  }

  // Helper methods for detailed calculations

  private static calculateEyeAspectRatio(eyeLandmarks: any[]): number {
    if (!eyeLandmarks || eyeLandmarks.length < 6) return 0;
    
    // Calculate vertical distances
    const v1 = this.euclideanDistance(eyeLandmarks[1], eyeLandmarks[5]);
    const v2 = this.euclideanDistance(eyeLandmarks[2], eyeLandmarks[4]);
    
    // Calculate horizontal distance
    const h = this.euclideanDistance(eyeLandmarks[0], eyeLandmarks[3]);
    
    if (h === 0) return 0;
    return ((v1 + v2) / (2.0 * h));
  }

  private static calculateGazeScore(leftEye: any[], rightEye: any[]): number {
    if (!leftEye || !rightEye || leftEye.length === 0 || rightEye.length === 0) return 0;
    
    // Calculate iris positions
    const leftIrisPosition = this.calculateIrisPosition(leftEye);
    const rightIrisPosition = this.calculateIrisPosition(rightEye);
    
    // Calculate deviation from center
    const leftDeviation = Math.abs(0.5 - leftIrisPosition);
    const rightDeviation = Math.abs(0.5 - rightIrisPosition);
    
    return 1 - ((leftDeviation + rightDeviation) / 2);
  }

  private static calculateVoiceStability(audioFeatures: Float32Array): number {
    if (!audioFeatures || audioFeatures.length === 0) return 0;
    
    // Calculate pitch stability
    const pitchStability = this.calculatePitchStability(audioFeatures);
    
    // Calculate amplitude stability
    const amplitudeStability = this.calculateAmplitudeStability(audioFeatures);
    
    return (pitchStability + amplitudeStability) / 2;
  }

  private static calculatePostureConfidence(poseData: any): number {
    if (!poseData) return 0;
    
    // Calculate shoulder confidence
    const shoulderConfidence = this.calculateShoulderConfidence(poseData);
    
    // Calculate spine confidence
    const spineConfidence = this.calculateSpineConfidence(poseData);
    
    return (shoulderConfidence + spineConfidence) / 2;
  }

  private static calculateSpeechRateStability(audioFeatures: Float32Array): number {
    if (!audioFeatures || audioFeatures.length === 0) return 0;
    
    // Calculate energy envelope
    const envelope = this.calculateEnergyEnvelope(audioFeatures);
    
    // Calculate rate variation
    const variation = this.calculateEnvelopeVariation(envelope);
    
    return 1 - Math.min(1, variation);
  }

  private static euclideanDistance(point1: any, point2: any): number {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) +
      Math.pow(point2.y - point1.y, 2) +
      Math.pow(point2.z - point1.z, 2)
    );
  }

  private static calculateIrisPosition(eye: any[]): number {
    // Calculate iris position relative to eye corners
    const irisCenter = eye[0];
    const leftCorner = eye[1];
    const rightCorner = eye[2];
    
    const totalWidth = this.euclideanDistance(leftCorner, rightCorner);
    const irisOffset = this.euclideanDistance(leftCorner, irisCenter);
    
    return totalWidth === 0 ? 0 : irisOffset / totalWidth;
  }

  private static calculatePitchStability(audioFeatures: Float32Array): number {
    // Use autocorrelation to detect pitch stability
    const pitchArray = this.calculatePitchArray(audioFeatures);
    return 1 - this.calculateVariationCoefficient(pitchArray);
  }

  private static calculateAmplitudeStability(audioFeatures: Float32Array): number {
    // Calculate RMS amplitude variation
    const rmsArray = this.calculateRMSArray(audioFeatures);
    return 1 - this.calculateVariationCoefficient(rmsArray);
  }

  private static calculatePitchArray(audioFeatures: Float32Array): number[] {
    const pitchArray: number[] = [];
    for (let i = 0; i < audioFeatures.length - this.FRAME_SIZE; i += this.HOP_LENGTH) {
      const frame = audioFeatures.slice(i, i + this.FRAME_SIZE);
      pitchArray.push(this.estimatePitch(frame));
    }
    return pitchArray;
  }

  private static calculateRMSArray(audioFeatures: Float32Array): number[] {
    const rmsArray: number[] = [];
    for (let i = 0; i < audioFeatures.length - this.FRAME_SIZE; i += this.HOP_LENGTH) {
      const frame = audioFeatures.slice(i, i + this.FRAME_SIZE);
      rmsArray.push(this.calculateRMS(frame));
    }
    return rmsArray;
  }

  private static estimatePitch(frame: Float32Array): number {
    // Implement YIN pitch detection algorithm
    const acf = this.autoCorrelation(frame);
    const threshold = 0.1;
    
    let minIndex = Math.floor(this.SAMPLE_RATE / 800); // ~800Hz max pitch
    let maxIndex = Math.floor(this.SAMPLE_RATE / 50);  // ~50Hz min pitch
    
    let minValue = Infinity;
    let pitch = 0;
    
    for (let i = minIndex; i < maxIndex; i++) {
      if (acf[i] < minValue) {
        minValue = acf[i];
        pitch = this.SAMPLE_RATE / i;
      }
      if (acf[i] < threshold) break;
    }
    
    return pitch;
  }

  private static calculateRMS(frame: Float32Array): number {
    const sum = frame.reduce((acc, val) => acc + (val * val), 0);
    return Math.sqrt(sum / frame.length);
  }

  private static autoCorrelation(frame: Float32Array): Float32Array {
    const result = new Float32Array(frame.length);
    
    for (let lag = 0; lag < frame.length; lag++) {
      let sum = 0;
      for (let i = 0; i < frame.length - lag; i++) {
        sum += frame[i] * frame[i + lag];
      }
      result[lag] = sum / (frame.length - lag);
    }
    
    return result;
  }

  private static calculateVariationCoefficient(array: number[]): number {
    if (array.length === 0) return 0;
    
    const mean = array.reduce((a, b) => a + b) / array.length;
    const variance = array.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / array.length;
    const stdDev = Math.sqrt(variance);
    
    return mean === 0 ? 0 : stdDev / mean;
  }

  private static calculateEnergyEnvelope(audioFeatures: Float32Array): Float32Array {
    const envelope = new Float32Array(Math.floor(audioFeatures.length / this.HOP_LENGTH));
    
    for (let i = 0; i < envelope.length; i++) {
      const frame = audioFeatures.slice(i * this.HOP_LENGTH, (i + 1) * this.HOP_LENGTH);
      envelope[i] = this.calculateRMS(frame);
    }
    
    return envelope;
  }

  private static calculateEnvelopeVariation(envelope: Float32Array): number {
    return this.calculateVariationCoefficient(Array.from(envelope));
  }
}