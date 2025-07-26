// Roboflow Computer Vision Integration - Enhanced Body Language and Gesture Analysis
// @ts-ignore: Ignore TypeScript errors for roboflow module
import roboflow from "roboflow";

interface RoboflowConfig {
  apiKey: string;
  model: string;
  version: number;
}

interface DetectionResult {
  predictions: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    class: string;
    class_id: number;
  }>;
  inference_id: string;
  time: number;
}

interface BodyLanguageMetrics {
  posture: {
    confidence: number;
    alignment: number;
    openness: number;
  };
  gestures: {
    handMovements: number;
    effectiveness: number;
    timing: number;
  };
  facial: {
    engagement: number;
    authenticity: number;
    eyeContact: number;
  };
  overall: {
    presence: number;
    confidence: number;
    professionalism: number;
  };
}

export class RoboflowVisionEngine {
  private models: Map<string, any> = new Map();
  private isInitialized = false;
  private rf: any; // Roboflow instance
  private isAvailable = false;
  private performanceMetrics = {
    totalFrames: 0,
    successfulAnalyses: 0,
    averageProcessingTime: 0,
    lastUpdated: new Date()
  };

  constructor() {
    this.initializeRoboflow();
  }

  private async initializeRoboflow(): Promise<void> {
    try {
      if (!process.env.ROBOFLOW_API_KEY) {
        console.warn('⚠️ Roboflow API key not found, using fallback computer vision');
        return;
      }

      // Initialize Roboflow with proper API - it's an object with methods
      if (roboflow && typeof roboflow.detectObject === 'function') {
        this.rf = roboflow;
        this.isAvailable = true;
        
        // Load specialized models for public speaking analysis
        await this.loadModels();
        this.isInitialized = true;
        console.log('🤖 Roboflow Computer Vision Engine initialized successfully');
      } else {
        throw new Error('Roboflow API methods not available');
      }
    } catch (error: any) {
      console.error('❌ Failed to initialize Roboflow:', error.message || error);
    }
  }

  private async loadModels(): Promise<void> {
    try {
      // Roboflow v0.2.0 uses direct API calls - models are loaded on-demand
      // Store reference to API methods for later use
      this.models.set('detectObject', this.rf.detectObject);
      this.models.set('classify', this.rf.classify);
      this.models.set('instanceSegmentation', this.rf.instanceSegmentation);
      
      console.log('📚 Roboflow API methods loaded successfully');
    } catch (error: any) {
      console.warn('⚠️ Failed to prepare Roboflow methods:', error.message || error);
    }
  }

  async analyzeFrame(imageData: string | Buffer): Promise<BodyLanguageMetrics> {
    // Always provide fallback metrics if Roboflow is not available
    if (!this.isInitialized || !this.isAvailable) {
      console.log('🛡️ Using fallback computer vision metrics (Roboflow not available)');
      return this.getFallbackMetrics();
    }

    try {
      // Check if we have valid image data
      if (!imageData) {
        console.warn('⚠️ No image data provided, using fallback metrics');
        return this.getFallbackMetrics();
      }

      const results = await Promise.all([
        this.analyzePosture(imageData),
        this.analyzeGestures(imageData),
        this.analyzeFacial(imageData)
      ]);

      const [posture, gestures, facial] = results;

      return {
        posture,
        gestures,
        facial,
        overall: {
          presence: Math.round((posture.confidence + gestures.effectiveness + facial.engagement) / 3),
          confidence: Math.round((posture.confidence + facial.eyeContact) / 2),
          professionalism: Math.round((posture.alignment + gestures.timing + facial.authenticity) / 3)
        }
      };
    } catch (error) {
      console.error('❌ Roboflow analysis failed:', error);
      return this.getFallbackMetrics();
    }
  }

  private async analyzePosture(imageData: string | Buffer): Promise<any> {
    const model = this.models.get('posture');
    if (!model) return this.getFallbackPosture();

    try {
      const detection: DetectionResult = await model.detect(imageData);
      
      // Analyze posture based on detection results
      const postureConfidence = this.calculatePostureConfidence(detection.predictions);
      const alignment = this.calculateAlignment(detection.predictions);
      const openness = this.calculateOpenness(detection.predictions);

      return {
        confidence: Math.min(95, Math.max(30, postureConfidence)),
        alignment: Math.min(95, Math.max(25, alignment)),
        openness: Math.min(95, Math.max(20, openness))
      };
    } catch (error) {
      console.warn('⚠️ Posture analysis failed, using fallback');
      return this.getFallbackPosture();
    }
  }

  private async analyzeGestures(imageData: string | Buffer): Promise<any> {
    const model = this.models.get('gestures');
    if (!model) return this.getFallbackGestures();

    try {
      const detection: DetectionResult = await model.detect(imageData);
      
      // Analyze hand gestures and movements
      const handMovements = this.calculateHandMovements(detection.predictions);
      const effectiveness = this.calculateGestureEffectiveness(detection.predictions);
      const timing = this.calculateGestureTiming(detection.predictions);

      return {
        handMovements: Math.min(95, Math.max(15, handMovements)),
        effectiveness: Math.min(95, Math.max(20, effectiveness)),
        timing: Math.min(95, Math.max(25, timing))
      };
    } catch (error) {
      console.warn('⚠️ Gesture analysis failed, using fallback');
      return this.getFallbackGestures();
    }
  }

  private async analyzeFacial(imageData: string | Buffer): Promise<any> {
    const model = this.models.get('facial');
    if (!model) return this.getFallbackFacial();

    try {
      const detection: DetectionResult = await model.detect(imageData);
      
      // Analyze facial expressions and eye contact
      const engagement = this.calculateEngagement(detection.predictions);
      const authenticity = this.calculateAuthenticity(detection.predictions);
      const eyeContact = this.calculateEyeContact(detection.predictions);

      return {
        engagement: Math.min(95, Math.max(25, engagement)),
        authenticity: Math.min(95, Math.max(30, authenticity)),
        eyeContact: Math.min(95, Math.max(20, eyeContact))
      };
    } catch (error) {
      console.warn('⚠️ Facial analysis failed, using fallback');
      return this.getFallbackFacial();
    }
  }

  // Advanced calculation methods for computer vision metrics
  private calculatePostureConfidence(predictions: any[]): number {
    // Analyze shoulder position, spine alignment, head position
    const shoulderDetections = predictions.filter(p => p.class.includes('shoulder'));
    const headDetections = predictions.filter(p => p.class.includes('head'));
    
    if (shoulderDetections.length >= 2 && headDetections.length >= 1) {
      const shoulderLevel = Math.abs(shoulderDetections[0].y - shoulderDetections[1].y);
      const headAlignment = headDetections[0].x;
      const confidenceScore = 85 - (shoulderLevel * 2) + (headAlignment > 0.4 && headAlignment < 0.6 ? 10 : 0);
      return confidenceScore;
    }
    
    return 0; // No confidence if limited detection
  }

  private calculateAlignment(predictions: any[]): number {
    // Calculate spine and body alignment
    const bodyDetections = predictions.filter(p => ['torso', 'spine', 'body'].some(part => p.class.includes(part)));
    
    if (bodyDetections.length > 0) {
      const centerAlignment = bodyDetections.reduce((sum, det) => sum + det.x, 0) / bodyDetections.length;
      const alignmentScore = 80 + (0.5 - Math.abs(centerAlignment - 0.5)) * 30;
      return alignmentScore;
    }
    
    return 0; // No authentic data available
  }

  private calculateOpenness(predictions: any[]): number {
    // Analyze body openness - arms, chest, stance
    const armDetections = predictions.filter(p => p.class.includes('arm'));
    const chestDetections = predictions.filter(p => p.class.includes('chest'));
    
    let opennessScore = 60;
    
    if (armDetections.length >= 2) {
      const armSpread = Math.abs(armDetections[0].x - armDetections[1].x);
      opennessScore += armSpread * 40; // More spread = more open
    }
    
    if (chestDetections.length > 0) {
      opennessScore += 15; // Visible chest indicates openness
    }
    
    return Math.min(90, opennessScore);
  }

  private calculateHandMovements(predictions: any[]): number {
    // Analyze hand position and movement patterns
    const handDetections = predictions.filter(p => p.class.includes('hand'));
    
    if (handDetections.length > 0) {
      const avgConfidence = handDetections.reduce((sum, det) => sum + det.confidence, 0) / handDetections.length;
      const movementScore = 50 + (avgConfidence * 40);
      return movementScore;
    }
    
    return 0; // No authentic data available
  }

  private calculateGestureEffectiveness(predictions: any[]): number {
    // Analyze purposeful vs fidgeting gestures
    const gestureDetections = predictions.filter(p => ['point', 'open_palm', 'descriptive'].some(g => p.class.includes(g)));
    const fidgetDetections = predictions.filter(p => ['fidget', 'nervous', 'repetitive'].some(f => p.class.includes(f)));
    
    let effectivenessScore = 55;
    effectivenessScore += gestureDetections.length * 10; // Purposeful gestures boost score
    effectivenessScore -= fidgetDetections.length * 8; // Fidgeting reduces score
    
    return Math.max(20, Math.min(95, effectivenessScore));
  }

  private calculateGestureTiming(predictions: any[]): number {
    // Analyze gesture timing and coordination
    const coordinatedGestures = predictions.filter(p => p.confidence > 0.7 && p.class.includes('coordinated'));
    const timingScore = 60 + (coordinatedGestures.length * 12);
    
    return Math.min(92, timingScore);
  }

  private calculateEngagement(predictions: any[]): number {
    // Analyze facial engagement indicators
    const smileDetections = predictions.filter(p => p.class.includes('smile'));
    const eyeDetections = predictions.filter(p => p.class.includes('eye'));
    const alertDetections = predictions.filter(p => p.class.includes('alert'));
    
    let engagementScore = 50;
    engagementScore += smileDetections.length * 15;
    engagementScore += eyeDetections.length * 10;
    engagementScore += alertDetections.length * 12;
    
    return Math.min(95, engagementScore);
  }

  private calculateAuthenticity(predictions: any[]): number {
    // Analyze natural vs forced expressions
    const naturalExpressions = predictions.filter(p => p.class.includes('natural'));
    const forcedExpressions = predictions.filter(p => p.class.includes('forced'));
    
    let authenticityScore = 65;
    authenticityScore += naturalExpressions.length * 12;
    authenticityScore -= forcedExpressions.length * 10;
    
    return Math.max(30, Math.min(95, authenticityScore));
  }

  private calculateEyeContact(predictions: any[]): number {
    // Analyze eye contact direction and quality
    const eyeContactDetections = predictions.filter(p => p.class.includes('eye_contact'));
    const lookingAwayDetections = predictions.filter(p => p.class.includes('looking_away'));
    
    let eyeContactScore = 55;
    eyeContactScore += eyeContactDetections.length * 18;
    eyeContactScore -= lookingAwayDetections.length * 12;
    
    return Math.max(20, Math.min(95, eyeContactScore));
  }

  // Fallback metrics when Roboflow is unavailable
  private getFallbackMetrics(): BodyLanguageMetrics {
    console.log('🛡️ Returning zero fallback metrics (authentic data only)');
    return {
      posture: this.getFallbackPosture(),
      gestures: this.getFallbackGestures(),
      facial: this.getFallbackFacial(),
      overall: {
        presence: 0,
        confidence: 0,
        professionalism: 0
      }
    };
  }

  private getFallbackPosture(): any {
    return {
      confidence: 0,
      alignment: 0,
      openness: 0
    };
  }

  private getFallbackGestures(): any {
    return {
      handMovements: 0,
      effectiveness: 0,
      timing: 0
    };
  }

  private getFallbackFacial(): any {
    return {
      engagement: 0,
      authenticity: 0,
      eyeContact: 0
    };
  }

  // Custom model training capabilities
  async trainCustomModel(trainingData: any[], modelName: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        throw new Error('Roboflow not initialized');
      }

      console.log(`🔬 Training custom Roboflow model: ${modelName}`);
      
      // Create new dataset
      const dataset = this.rf.workspace("public-speaking-analysis").project(modelName);
      
      // Upload training data
      for (const data of trainingData) {
        await dataset.upload(data.image, data.annotations);
      }

      // Start training
      await dataset.train();
      
      console.log(`✅ Custom model ${modelName} training initiated`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to train custom model ${modelName}:`, error);
      return false;
    }
  }

  // Performance monitoring
  getPerformanceMetrics(): any {
    return {
      modelsLoaded: this.models.size,
      isInitialized: this.isInitialized,
      apiStatus: this.isInitialized ? 'connected' : 'fallback',
      lastAnalysis: new Date().toISOString()
    };
  }
}

export const roboflowVision = new RoboflowVisionEngine();

// API endpoint for Roboflow computer vision analysis
export async function analyzeVideoFrame(req: any, res: any) {
  try {
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'Image data required' });
    }

    const startTime = Date.now();
    const analysis = await roboflowVision.analyzeFrame(imageData);
    const processingTime = Date.now() - startTime;

    console.log(`🤖 Roboflow analysis completed in ${processingTime}ms`);

    res.json({
      success: true,
      analysis,
      processingTime,
      timestamp: new Date().toISOString(),
      engine: 'roboflow-enhanced'
    });
  } catch (error: any) {
    console.error('❌ Roboflow analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      fallback: true,
      message: error?.message || 'Unknown error'
    });
  }
}

// Training endpoint for custom models
export async function trainCustomVisionModel(req: any, res: any) {
  try {
    const { trainingData, modelName } = req.body;
    
    if (!trainingData || !modelName) {
      return res.status(400).json({ error: 'Training data and model name required' });
    }

    const success = await roboflowVision.trainCustomModel(trainingData, modelName);
    
    res.json({
      success,
      modelName,
      message: success ? 'Training initiated' : 'Training failed',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Model training error:', error);
    res.status(500).json({ 
      error: 'Training failed',
      message: error?.message || 'Unknown error'
    });
  }
}