// Client-side Face Detection using Face-api.js for Maximum Accuracy
import * as faceapi from 'face-api.js';

export interface ClientFaceDetection {
  confidence: number;
  expressions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
  landmarks: Array<{x: number, y: number}>;
  age: number;
  gender: {
    value: string;
    probability: number;
  };
  descriptor: Float32Array;
}

class ClientFaceDetectionEngine {
  private isInitialized: boolean = false;
  private modelLoadPromise: Promise<void> | null = null;

  constructor() {
    this.initializeModels();
  }

  private async initializeModels(): Promise<void> {
    if (this.modelLoadPromise) {
      return this.modelLoadPromise;
    }

    this.modelLoadPromise = this.loadFaceApiModels();
    return this.modelLoadPromise;
  }

  private async loadFaceApiModels(): Promise<void> {
    try {
      console.log('🧠 Loading Face-api.js models...');
      
      // Load models from CDN for accuracy
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
      ]);
      
      this.isInitialized = true;
      console.log('✅ Face-api.js models loaded successfully');
      
    } catch (error) {
      console.warn('⚠️ Failed to load Face-api.js models:', error);
      // Continue without Face-api.js - backend TensorFlow.js will handle analysis
    }
  }

  async detectFace(videoElement: HTMLVideoElement): Promise<ClientFaceDetection | null> {
    try {
      await this.ensureModelsLoaded();
      
      if (!this.isInitialized || !videoElement.videoWidth || !videoElement.videoHeight) {
        return null;
      }

      console.log('🎭 Running Face-api.js client-side detection...');
      
      // Run comprehensive face analysis
      const detections = await faceapi
        .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptors();

      if (!detections || detections.length === 0) {
        console.log('👤 No faces detected by Face-api.js');
        return null;
      }

      // Use the most confident detection
      const detection = detections[0];
      
      // Extract landmarks as simple coordinates
      const landmarks = detection.landmarks.positions.map(point => ({
        x: point.x,
        y: point.y
      }));

      const result: ClientFaceDetection = {
        confidence: detection.detection.score,
        expressions: {
          neutral: detection.expressions.neutral,
          happy: detection.expressions.happy,
          sad: detection.expressions.sad,
          angry: detection.expressions.angry,
          fearful: detection.expressions.fearful,
          disgusted: detection.expressions.disgusted,
          surprised: detection.expressions.surprised
        },
        landmarks,
        age: Math.round(detection.age),
        gender: {
          value: detection.gender,
          probability: detection.genderProbability
        },
        descriptor: detection.descriptor
      };

      console.log(`✅ Face-api.js detection complete - Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      return result;
      
    } catch (error) {
      console.warn('⚠️ Face-api.js detection failed:', error);
      return null;
    }
  }

  async detectFaceFromCanvas(canvas: HTMLCanvasElement): Promise<ClientFaceDetection | null> {
    try {
      await this.ensureModelsLoaded();
      
      if (!this.isInitialized) {
        return null;
      }

      // Run face detection on canvas
      const detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptors();

      if (!detections || detections.length === 0) {
        return null;
      }

      const detection = detections[0];
      
      const landmarks = detection.landmarks.positions.map(point => ({
        x: point.x / canvas.width,  // Normalize to 0-1
        y: point.y / canvas.height
      }));

      return {
        confidence: detection.detection.score,
        expressions: {
          neutral: detection.expressions.neutral,
          happy: detection.expressions.happy,
          sad: detection.expressions.sad,
          angry: detection.expressions.angry,
          fearful: detection.expressions.fearful,
          disgusted: detection.expressions.disgusted,
          surprised: detection.expressions.surprised
        },
        landmarks,
        age: Math.round(detection.age),
        gender: {
          value: detection.gender,
          probability: detection.genderProbability
        },
        descriptor: detection.descriptor
      };
      
    } catch (error) {
      console.warn('⚠️ Canvas face detection failed:', error);
      return null;
    }
  }

  private async ensureModelsLoaded(): Promise<void> {
    if (!this.isInitialized && this.modelLoadPromise) {
      await this.modelLoadPromise;
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  getModelStatus(): string {
    return this.isInitialized ? 'loaded' : 'loading';
  }
}

// Export singleton instance
export const clientFaceDetection = new ClientFaceDetectionEngine();

// Utility function to convert detection to metrics format
export function convertClientDetectionToMetrics(detection: ClientFaceDetection) {
  return {
    confidence: Math.round(detection.confidence * 100),
    engagement: Math.round((detection.expressions.happy + detection.expressions.surprised + (1 - detection.expressions.sad)) * 33.33),
    enthusiasm: Math.round((detection.expressions.happy + detection.expressions.surprised * 0.5) * 50),
    nervousness: Math.round((detection.expressions.fearful + detection.expressions.surprised * 0.3) * 50),
    authenticity: Math.round((1 - Math.abs(detection.expressions.happy - 0.3)) * 100), // Natural happiness level
    eyeContactQuality: Math.round(detection.confidence * 85), // Based on face detection confidence
    facialStability: Math.round((1 - (detection.expressions.surprised + detection.expressions.fearful)) * 90),
    charisma: Math.round((detection.expressions.happy + detection.confidence) * 45),
    trustworthiness: Math.round((detection.confidence + (1 - detection.expressions.angry)) * 50),
    professionalism: Math.round((detection.confidence + (1 - detection.expressions.surprised * 0.5)) * 50),
    approachability: Math.round((detection.expressions.happy + (1 - detection.expressions.angry)) * 50)
  };
}