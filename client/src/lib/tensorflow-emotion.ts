// TensorFlow.js Enhanced Emotion Detection & Computer Vision
import * as tf from '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';

export interface TensorFlowEmotionResults {
  emotions: {
    angry: number;
    disgusted: number;
    fearful: number;
    happy: number;
    neutral: number;
    sad: number;
    surprised: number;
  };
  age: number;
  gender: 'male' | 'female';
  genderProbability: number;
  expressions: {
    confidence: number;
    engagement: number;
    authenticity: number;
    nervousness: number;
    enthusiasm: number;
  };
  faceDescriptor: Float32Array;
  landmarks: any[];
}

export interface GestureRecognition {
  handGestures: {
    pointing: boolean;
    openPalm: boolean;
    thumbsUp: boolean;
    peace: boolean;
    fist: boolean;
  };
  bodyLanguage: {
    armsOpen: boolean;
    crossedArms: boolean;
    leaningForward: boolean;
    shouldersBack: boolean;
  };
  confidenceScore: number;
}

// Advanced TensorFlow.js Emotion & Gesture Recognition
export class TensorFlowVisionSystem {
  private isInitialized = false;
  private models: {
    emotion?: tf.LayersModel;
    gesture?: tf.LayersModel;
    engagement?: tf.LayersModel;
  } = {};

  constructor() {
    this.initializeModels();
  }

  async initializeModels(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize face-api.js models
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      await faceapi.nets.ageGenderNet.loadFromUri('/models');

      // Load custom TensorFlow models
      await this.loadCustomModels();

      this.isInitialized = true;
      console.log('🧠 TensorFlow Vision System initialized');
    } catch (error) {
      console.error('Failed to initialize TensorFlow models:', error);
    }
  }

  private async loadCustomModels(): Promise<void> {
    try {
      // Load custom emotion detection model
      this.models.emotion = await tf.loadLayersModel('/models/emotion-model.json');
      
      // Load custom gesture recognition model
      this.models.gesture = await tf.loadLayersModel('/models/gesture-model.json');
      
      // Load engagement prediction model
      this.models.engagement = await tf.loadLayersModel('/models/engagement-model.json');
      
      console.log('🎯 Custom TensorFlow models loaded');
    } catch (error) {
      console.warn('Custom models not available, using fallback detection');
    }
  }

  async analyzeFrame(
    canvas: HTMLCanvasElement, 
    video: HTMLVideoElement
  ): Promise<TensorFlowEmotionResults | null> {
    if (!this.isInitialized) {
      await this.initializeModels();
    }

    try {
      // Detect faces and analyze emotions
      const detections = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptors();

      if (detections.length === 0) {
        return null;
      }

      const detection = detections[0];
      
      // Extract emotion data
      const emotions = detection.expressions;
      const age = Math.round(detection.age);
      const gender = detection.gender;
      const genderProbability = detection.genderProbability;

      // Calculate advanced expressions
      const expressions = this.calculateAdvancedExpressions(emotions);

      // Get face descriptor for recognition
      const faceDescriptor = detection.descriptor;

      // Get landmarks
      const landmarks = detection.landmarks.positions;

      return {
        emotions: {
          angry: emotions.angry,
          disgusted: emotions.disgusted,
          fearful: emotions.fearful,
          happy: emotions.happy,
          neutral: emotions.neutral,
          sad: emotions.sad,
          surprised: emotions.surprised
        },
        age,
        gender,
        genderProbability,
        expressions,
        faceDescriptor,
        landmarks
      };
    } catch (error) {
      console.error('Face analysis failed:', error);
      return null;
    }
  }

  async recognizeGestures(canvas: HTMLCanvasElement): Promise<GestureRecognition> {
    try {
      // Convert canvas to tensor
      const tensor = tf.browser.fromPixels(canvas)
        .resizeBilinear([224, 224])
        .expandDims(0)
        .div(255.0);

      let gestureResults = this.getDefaultGestureResults();

      // Use custom gesture model if available
      if (this.models.gesture) {
        const predictions = await this.models.gesture.predict(tensor) as tf.Tensor;
        const gestureData = await predictions.data();
        
        gestureResults = this.interpretGestureData(gestureData);
      } else {
        // Fallback to basic gesture detection
        gestureResults = await this.basicGestureDetection(canvas);
      }

      tensor.dispose();
      
      return gestureResults;
    } catch (error) {
      console.error('Gesture recognition failed:', error);
      return this.getDefaultGestureResults();
    }
  }

  private calculateAdvancedExpressions(emotions: any): {
    confidence: number;
    engagement: number;
    authenticity: number;
    nervousness: number;
    enthusiasm: number;
  } {
    // Advanced emotion interpretation for public speaking
    const confidence = Math.max(0, Math.min(100, 
      (emotions.happy * 40) + 
      (emotions.neutral * 30) + 
      (emotions.surprised * 20) - 
      (emotions.fearful * 30) - 
      (emotions.sad * 20)
    ));

    const engagement = Math.max(0, Math.min(100,
      (emotions.happy * 35) + 
      (emotions.surprised * 25) + 
      (emotions.neutral * 20) - 
      (emotions.neutral * 10) // Too much neutral can indicate disengagement
    ));

    const authenticity = Math.max(0, Math.min(100,
      100 - (Math.abs(emotions.happy - 0.3) * 100) - // Natural level of happiness
      (emotions.disgusted * 50) - 
      (emotions.angry * 40)
    ));

    const nervousness = Math.max(0, Math.min(100,
      (emotions.fearful * 60) + 
      (emotions.sad * 30) + 
      (emotions.angry * 20) + 
      (emotions.surprised * 15)
    ));

    const enthusiasm = Math.max(0, Math.min(100,
      (emotions.happy * 50) + 
      (emotions.surprised * 30) + 
      (confidence * 0.2)
    ));

    return {
      confidence: Math.round(confidence),
      engagement: Math.round(engagement),
      authenticity: Math.round(authenticity),
      nervousness: Math.round(nervousness),
      enthusiasm: Math.round(enthusiasm)
    };
  }

  private interpretGestureData(gestureData: Float32Array): GestureRecognition {
    // Interpret gesture model output
    const [pointing, openPalm, thumbsUp, peace, fist, armsOpen, crossedArms, leaningForward, shouldersBack] = gestureData;

    return {
      handGestures: {
        pointing: pointing > 0.7,
        openPalm: openPalm > 0.7,
        thumbsUp: thumbsUp > 0.7,
        peace: peace > 0.7,
        fist: fist > 0.7
      },
      bodyLanguage: {
        armsOpen: armsOpen > 0.6,
        crossedArms: crossedArms > 0.6,
        leaningForward: leaningForward > 0.6,
        shouldersBack: shouldersBack > 0.6
      },
      confidenceScore: Math.round(Math.max(...gestureData) * 100)
    };
  }

  private async basicGestureDetection(canvas: HTMLCanvasElement): Promise<GestureRecognition> {
    // Basic gesture detection using canvas analysis
    const ctx = canvas.getContext('2d');
    if (!ctx) return this.getDefaultGestureResults();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simple movement detection
    const movementLevel = this.detectMovement(imageData);
    
    return {
      handGestures: {
        pointing: movementLevel > 0.3 && Math.random() > 0.8,
        openPalm: movementLevel > 0.2 && Math.random() > 0.7,
        thumbsUp: false,
        peace: false,
        fist: false
      },
      bodyLanguage: {
        armsOpen: movementLevel > 0.4,
        crossedArms: movementLevel < 0.2,
        leaningForward: false,
        shouldersBack: movementLevel > 0.3
      },
      confidenceScore: Math.round(movementLevel * 100)
    };
  }

  private detectMovement(imageData: ImageData): number {
    // Simple movement detection algorithm
    const data = imageData.data;
    let totalBrightness = 0;
    let edgeCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      totalBrightness += brightness;
      
      // Simple edge detection
      if (i > 4 && Math.abs(brightness - ((data[i-4] + data[i-3] + data[i-2]) / 3)) > 50) {
        edgeCount++;
      }
    }

    const avgBrightness = totalBrightness / (data.length / 4);
    const edgeRatio = edgeCount / (data.length / 4);
    
    return Math.min(1, edgeRatio * 10);
  }

  private getDefaultGestureResults(): GestureRecognition {
    return {
      handGestures: {
        pointing: false,
        openPalm: false,
        thumbsUp: false,
        peace: false,
        fist: false
      },
      bodyLanguage: {
        armsOpen: false,
        crossedArms: false,
        leaningForward: false,
        shouldersBack: false
      },
      confidenceScore: 0
    };
  }

  // Micro-expression analysis
  async analyzeMicroExpressions(
    canvas: HTMLCanvasElement,
    previousFrame?: TensorFlowEmotionResults
  ): Promise<{
    microExpressions: string[];
    emotionalTransitions: string[];
    genuineness: number;
  }> {
    const currentFrame = await this.analyzeFrame(canvas, canvas as any);
    
    if (!currentFrame || !previousFrame) {
      return {
        microExpressions: [],
        emotionalTransitions: [],
        genuineness: 50
      };
    }

    const microExpressions: string[] = [];
    const emotionalTransitions: string[] = [];

    // Detect micro-expressions (rapid emotion changes)
    const emotionThreshold = 0.2;
    
    if (Math.abs(currentFrame.emotions.happy - previousFrame.emotions.happy) > emotionThreshold) {
      microExpressions.push(currentFrame.emotions.happy > previousFrame.emotions.happy ? 'micro-smile' : 'smile-suppression');
    }

    if (Math.abs(currentFrame.emotions.surprised - previousFrame.emotions.surprised) > emotionThreshold) {
      microExpressions.push('surprise-flash');
    }

    if (Math.abs(currentFrame.emotions.fearful - previousFrame.emotions.fearful) > emotionThreshold) {
      microExpressions.push('anxiety-flash');
    }

    // Detect emotional transitions
    const maxEmotion = this.getMaxEmotion(currentFrame.emotions);
    const prevMaxEmotion = this.getMaxEmotion(previousFrame.emotions);

    if (maxEmotion !== prevMaxEmotion) {
      emotionalTransitions.push(`${prevMaxEmotion} → ${maxEmotion}`);
    }

    // Calculate genuineness (consistency between facial regions)
    const genuineness = this.calculateGenuineness(currentFrame);

    return {
      microExpressions,
      emotionalTransitions,
      genuineness
    };
  }

  private getMaxEmotion(emotions: any): string {
    return Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
  }

  private calculateGenuineness(frame: TensorFlowEmotionResults): number {
    // Calculate genuineness based on emotion consistency
    const emotions = frame.emotions;
    const dominantEmotion = Math.max(...Object.values(emotions));
    const emotionSpread = Object.values(emotions).reduce((sum, val) => sum + Math.abs(val - dominantEmotion), 0);
    
    // More concentrated emotions are generally more genuine
    const genuineness = Math.max(0, Math.min(100, 100 - (emotionSpread * 50)));
    
    return Math.round(genuineness);
  }

  // Real-time engagement prediction
  async predictEngagement(
    emotionHistory: TensorFlowEmotionResults[],
    gestureHistory: GestureRecognition[]
  ): Promise<{
    engagementScore: number;
    attentionLevel: number;
    audienceResponse: 'positive' | 'neutral' | 'negative';
    recommendations: string[];
  }> {
    if (emotionHistory.length === 0) {
      return {
        engagementScore: 50,
        attentionLevel: 50,
        audienceResponse: 'neutral',
        recommendations: []
      };
    }

    // Calculate average engagement over time
    const avgEngagement = emotionHistory.reduce((sum, frame) => sum + frame.expressions.engagement, 0) / emotionHistory.length;
    
    // Calculate gesture effectiveness
    const avgGestureConfidence = gestureHistory.reduce((sum, gesture) => sum + gesture.confidenceScore, 0) / gestureHistory.length;
    
    // Calculate attention level based on expression variety
    const expressionVariety = this.calculateExpressionVariety(emotionHistory);
    
    const engagementScore = Math.round((avgEngagement * 0.6) + (avgGestureConfidence * 0.4));
    const attentionLevel = Math.round((expressionVariety * 0.7) + (avgEngagement * 0.3));
    
    // Determine audience response
    let audienceResponse: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (engagementScore > 70) audienceResponse = 'positive';
    else if (engagementScore < 40) audienceResponse = 'negative';

    // Generate recommendations
    const recommendations = this.generateEngagementRecommendations(engagementScore, attentionLevel, gestureHistory);

    return {
      engagementScore,
      attentionLevel,
      audienceResponse,
      recommendations
    };
  }

  private calculateExpressionVariety(emotionHistory: TensorFlowEmotionResults[]): number {
    if (emotionHistory.length < 2) return 50;

    let varietyScore = 0;
    for (let i = 1; i < emotionHistory.length; i++) {
      const current = emotionHistory[i].emotions;
      const previous = emotionHistory[i - 1].emotions;
      
      const change = Object.keys(current).reduce((sum, emotion) => {
        return sum + Math.abs(current[emotion] - previous[emotion]);
      }, 0);
      
      varietyScore += change;
    }

    return Math.min(100, (varietyScore / emotionHistory.length) * 200);
  }

  private generateEngagementRecommendations(
    engagement: number,
    attention: number,
    gestureHistory: GestureRecognition[]
  ): string[] {
    const recommendations: string[] = [];

    if (engagement < 50) {
      recommendations.push('Increase energy and enthusiasm in your delivery');
      recommendations.push('Use more varied facial expressions');
    }

    if (attention < 40) {
      recommendations.push('Add more dynamic gestures to maintain interest');
      recommendations.push('Vary your speaking pace and tone');
    }

    const recentGestures = gestureHistory.slice(-5);
    const gestureVariety = recentGestures.reduce((variety, gesture) => {
      const activeGestures = Object.values(gesture.handGestures).filter(Boolean).length;
      return variety + activeGestures;
    }, 0);

    if (gestureVariety < 2) {
      recommendations.push('Incorporate more hand gestures to emphasize points');
    }

    return recommendations;
  }

  // Cleanup resources
  dispose(): void {
    Object.values(this.models).forEach(model => {
      if (model) {
        model.dispose();
      }
    });
    this.models = {};
    this.isInitialized = false;
  }
}