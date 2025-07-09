// MediaPipe Computer Vision Upgrades - Replace basic Canvas API
import { 
  FaceMesh, 
  Hands, 
  Pose, 
  Holistic,
  FACEMESH_CONTOURS,
  HAND_CONNECTIONS,
  POSE_CONNECTIONS 
} from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

export interface MediaPipeResults {
  faceLandmarks: any[];
  poseLandmarks: any[];
  handLandmarks: any[];
  emotions: EmotionAnalysis;
  gestureConfidence: number;
  eyeContactPrecision: number;
}

export interface EmotionAnalysis {
  confidence: number;
  engagement: number;
  authenticity: number;
  nervousness: number;
  enthusiasm: number;
  micro_expressions: MicroExpression[];
}

export interface MicroExpression {
  type: 'smile' | 'frown' | 'surprise' | 'concern' | 'focus';
  intensity: number;
  duration: number;
  timestamp: number;
}

// Advanced MediaPipe Vision System
export class MediaPipeVisionSystem {
  private holistic: Holistic;
  private camera: Camera;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isInitialized = false;

  constructor(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Initialize MediaPipe Holistic
    this.holistic = new Holistic({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
    });

    this.holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // Setup camera
    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        await this.holistic.send({ image: videoElement });
      },
      width: 640,
      height: 480
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.holistic.onResults((results) => {
      this.processResults(results);
    });

    await this.camera.start();
    this.isInitialized = true;
    console.log('🎯 MediaPipe Vision System initialized');
  }

  private processResults(results: any): MediaPipeResults {
    // Clear canvas
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(results.image, 0, 0, this.canvas.width, this.canvas.height);

    // Process face landmarks for emotion detection
    const emotions = this.analyzeFacialEmotions(results.faceLandmarks);
    
    // Process pose for gesture analysis
    const gestureConfidence = this.analyzeGestures(results.poseLandmarks);
    
    // Process eye contact with precision
    const eyeContactPrecision = this.analyzeEyeContactPrecision(results.faceLandmarks);

    // Draw landmarks
    if (results.faceLandmarks) {
      drawConnectors(this.ctx, results.faceLandmarks, FACEMESH_CONTOURS, {
        color: '#C0C0C070',
        lineWidth: 1
      });
    }

    if (results.poseLandmarks) {
      drawConnectors(this.ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 2
      });
      drawLandmarks(this.ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 1
      });
    }

    if (results.leftHandLandmarks) {
      drawConnectors(this.ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
        color: '#CC0000',
        lineWidth: 2
      });
    }

    if (results.rightHandLandmarks) {
      drawConnectors(this.ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
        color: '#00CC00',
        lineWidth: 2
      });
    }

    this.ctx.restore();

    return {
      faceLandmarks: results.faceLandmarks || [],
      poseLandmarks: results.poseLandmarks || [],
      handLandmarks: [results.leftHandLandmarks, results.rightHandLandmarks].filter(Boolean),
      emotions,
      gestureConfidence,
      eyeContactPrecision
    };
  }

  private analyzeFacialEmotions(faceLandmarks: any[]): EmotionAnalysis {
    if (!faceLandmarks || faceLandmarks.length === 0) {
      return this.getDefaultEmotions();
    }

    // Advanced facial emotion analysis using landmark positions
    const leftEyebrow = this.getEyebrowPosition(faceLandmarks, 'left');
    const rightEyebrow = this.getEyebrowPosition(faceLandmarks, 'right');
    const mouthCorners = this.getMouthCorners(faceLandmarks);
    const eyeOpenness = this.getEyeOpenness(faceLandmarks);

    // Calculate emotion scores
    const smileIntensity = this.calculateSmileIntensity(mouthCorners);
    const eyebrowRaise = this.calculateEyebrowRaise(leftEyebrow, rightEyebrow);
    const alertness = this.calculateAlertness(eyeOpenness);

    // Detect micro-expressions
    const microExpressions = this.detectMicroExpressions(faceLandmarks);

    return {
      confidence: Math.min(100, 60 + smileIntensity * 20 + alertness * 20),
      engagement: Math.min(100, 50 + eyebrowRaise * 30 + alertness * 20),
      authenticity: Math.min(100, 70 + (smileIntensity > 0.3 ? 20 : 0) + (eyebrowRaise < 0.8 ? 10 : 0)),
      nervousness: Math.max(0, 100 - alertness * 50 - smileIntensity * 30),
      enthusiasm: Math.min(100, smileIntensity * 40 + eyebrowRaise * 35 + alertness * 25),
      micro_expressions: microExpressions
    };
  }

  private analyzeGestures(poseLandmarks: any[]): number {
    if (!poseLandmarks || poseLandmarks.length === 0) return 50;

    // Analyze hand and arm positions for gesture effectiveness
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];
    const leftElbow = poseLandmarks[13];
    const rightElbow = poseLandmarks[14];
    const leftWrist = poseLandmarks[15];
    const rightWrist = poseLandmarks[16];

    if (!leftShoulder || !rightShoulder) return 50;

    // Calculate gesture variety and effectiveness
    const armMovement = this.calculateArmMovement(
      leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist
    );
    
    const shoulderStability = this.calculateShoulderStability(leftShoulder, rightShoulder);
    const gestureSymmetry = this.calculateGestureSymmetry(leftWrist, rightWrist);

    return Math.min(100, armMovement * 40 + shoulderStability * 35 + gestureSymmetry * 25);
  }

  private analyzeEyeContactPrecision(faceLandmarks: any[]): number {
    if (!faceLandmarks || faceLandmarks.length === 0) return 30;

    // Precise eye contact analysis using facial landmarks
    const leftEye = this.getEyeCenter(faceLandmarks, 'left');
    const rightEye = this.getEyeCenter(faceLandmarks, 'right');
    const noseTip = faceLandmarks[1]; // Nose tip landmark

    if (!leftEye || !rightEye || !noseTip) return 30;

    // Calculate gaze direction relative to camera
    const gazeVector = this.calculateGazeVector(leftEye, rightEye, noseTip);
    const cameraAlignment = this.calculateCameraAlignment(gazeVector);

    return Math.min(100, Math.max(0, cameraAlignment * 100));
  }

  // Helper methods for detailed analysis
  private getEyebrowPosition(landmarks: any[], side: 'left' | 'right'): number {
    const eyebrowIndices = side === 'left' ? [70, 63, 105, 66, 107] : [296, 334, 293, 300, 276];
    const eyebrowPoints = eyebrowIndices.map(i => landmarks[i]).filter(Boolean);
    
    if (eyebrowPoints.length === 0) return 0.5;
    
    const avgY = eyebrowPoints.reduce((sum, point) => sum + point.y, 0) / eyebrowPoints.length;
    return 1 - avgY; // Higher y = lower position, so invert
  }

  private getMouthCorners(landmarks: any[]): { left: any, right: any } {
    return {
      left: landmarks[61],  // Left mouth corner
      right: landmarks[291] // Right mouth corner
    };
  }

  private getEyeOpenness(landmarks: any[]): number {
    // Calculate eye openness using eyelid landmarks
    const leftEyeTop = landmarks[159];
    const leftEyeBottom = landmarks[145];
    const rightEyeTop = landmarks[386];
    const rightEyeBottom = landmarks[374];

    if (!leftEyeTop || !leftEyeBottom || !rightEyeTop || !rightEyeBottom) return 0.5;

    const leftOpenness = Math.abs(leftEyeTop.y - leftEyeBottom.y);
    const rightOpenness = Math.abs(rightEyeTop.y - rightEyeBottom.y);

    return (leftOpenness + rightOpenness) / 2;
  }

  private calculateSmileIntensity(mouthCorners: { left: any, right: any }): number {
    if (!mouthCorners.left || !mouthCorners.right) return 0;

    const mouthCenter = landmarks[13]; // Upper lip center
    if (!mouthCenter) return 0;

    const leftLift = mouthCenter.y - mouthCorners.left.y;
    const rightLift = mouthCenter.y - mouthCorners.right.y;

    return Math.max(0, Math.min(1, (leftLift + rightLift) * 10));
  }

  private calculateEyebrowRaise(leftBrow: number, rightBrow: number): number {
    const avgBrowPosition = (leftBrow + rightBrow) / 2;
    return Math.max(0, Math.min(1, (avgBrowPosition - 0.5) * 2));
  }

  private calculateAlertness(eyeOpenness: number): number {
    return Math.max(0, Math.min(1, eyeOpenness * 20));
  }

  private detectMicroExpressions(landmarks: any[]): MicroExpression[] {
    const expressions: MicroExpression[] = [];
    const timestamp = Date.now();

    // Detect smile micro-expression
    const mouthCorners = this.getMouthCorners(landmarks);
    const smileIntensity = this.calculateSmileIntensity(mouthCorners);
    
    if (smileIntensity > 0.3) {
      expressions.push({
        type: 'smile',
        intensity: smileIntensity,
        duration: 500, // Estimated duration
        timestamp
      });
    }

    // Add more micro-expression detection logic here
    
    return expressions;
  }

  private calculateArmMovement(
    leftShoulder: any, rightShoulder: any, 
    leftElbow: any, rightElbow: any, 
    leftWrist: any, rightWrist: any
  ): number {
    // Calculate arm movement effectiveness
    if (!leftElbow || !rightElbow || !leftWrist || !rightWrist) return 0.5;

    const leftArmAngle = this.calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightArmAngle = this.calculateAngle(rightShoulder, rightElbow, rightWrist);

    // Effective gestures typically have varied arm angles
    const gestureVariety = Math.abs(leftArmAngle - rightArmAngle) / 180;
    return Math.min(1, gestureVariety);
  }

  private calculateShoulderStability(leftShoulder: any, rightShoulder: any): number {
    if (!leftShoulder || !rightShoulder) return 0.5;

    const shoulderLevel = Math.abs(leftShoulder.y - rightShoulder.y);
    return Math.max(0, 1 - shoulderLevel * 10); // Penalize tilted shoulders
  }

  private calculateGestureSymmetry(leftWrist: any, rightWrist: any): number {
    if (!leftWrist || !rightWrist) return 0.5;

    const heightDifference = Math.abs(leftWrist.y - rightWrist.y);
    return Math.max(0, 1 - heightDifference * 5);
  }

  private getEyeCenter(landmarks: any[], side: 'left' | 'right'): any {
    const eyeIndices = side === 'left' ? [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246] 
                                        : [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398];
    
    const eyePoints = eyeIndices.map(i => landmarks[i]).filter(Boolean);
    
    if (eyePoints.length === 0) return null;
    
    const avgX = eyePoints.reduce((sum, point) => sum + point.x, 0) / eyePoints.length;
    const avgY = eyePoints.reduce((sum, point) => sum + point.y, 0) / eyePoints.length;
    
    return { x: avgX, y: avgY };
  }

  private calculateGazeVector(leftEye: any, rightEye: any, noseTip: any): { x: number, y: number } {
    const eyeCenter = {
      x: (leftEye.x + rightEye.x) / 2,
      y: (leftEye.y + rightEye.y) / 2
    };

    return {
      x: noseTip.x - eyeCenter.x,
      y: noseTip.y - eyeCenter.y
    };
  }

  private calculateCameraAlignment(gazeVector: { x: number, y: number }): number {
    // Calculate how well the gaze aligns with the camera
    const magnitude = Math.sqrt(gazeVector.x * gazeVector.x + gazeVector.y * gazeVector.y);
    const normalizedGaze = {
      x: gazeVector.x / magnitude,
      y: gazeVector.y / magnitude
    };

    // Camera is assumed to be at (0, 0) relative to face
    const cameraVector = { x: 0, y: 0 };
    const alignment = 1 - Math.sqrt(normalizedGaze.x * normalizedGaze.x + normalizedGaze.y * normalizedGaze.y);
    
    return Math.max(0, Math.min(1, alignment));
  }

  private calculateAngle(p1: any, p2: any, p3: any): number {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360.0 - angle;
    }
    return angle;
  }

  private getDefaultEmotions(): EmotionAnalysis {
    return {
      confidence: 50,
      engagement: 50,
      authenticity: 50,
      nervousness: 50,
      enthusiasm: 50,
      micro_expressions: []
    };
  }

  public cleanup(): void {
    if (this.camera) {
      this.camera.stop();
    }
    this.isInitialized = false;
  }
}