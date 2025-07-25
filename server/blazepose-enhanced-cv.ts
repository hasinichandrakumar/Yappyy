// Enhanced Computer Vision Engine - Free Implementation
// Uses MediaPipe BlazePose, enhanced eye tracking, and custom gesture recognition

import { Socket } from 'socket.io';

interface EnhancedPoseMetrics {
  posture: {
    spineAlignment: number; // 0-100 (100 = perfect posture)
    shoulderLevel: number; // 0-100 (100 = shoulders level)
    headPosition: number; // 0-100 (100 = head upright)
    overallPosture: number;
  };
  gestures: {
    handMovementFrequency: number; // gestures per minute
    gestureNaturalness: number; // 0-100
    openPalmFrequency: number; // percentage of time
    pointingFrequency: number; // instances per minute
    fidgetingScore: number; // 0-100 (0 = no fidgeting)
  };
  eyeContact: {
    gazeDirection: { x: number; y: number; z: number };
    eyeContactPercentage: number; // 0-100
    gazeStability: number; // 0-100
    blinkRate: number; // blinks per minute
    gazeDistribution: {
      center: number;
      left: number;
      right: number;
      up: number;
      down: number;
    };
  };
  facialExpression: {
    confidence: number; // 0-100
    engagement: number; // 0-100
    authenticity: number; // 0-100
    nervousness: number; // 0-100
    microExpressions: {
      eyebrowMovement: number;
      eyeMovement: number;
      mouthExpression: number;
      facialSymmetry: number;
    };
  };
  bodyLanguage: {
    energyLevel: number; // 0-100
    professionalism: number; // 0-100
    approachability: number; // 0-100
    authorityPresence: number; // 0-100
  };
}

interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

export class BlazePoseEnhancedCV {
  private poseHistory: PoseLandmark[][] = [];
  private faceHistory: FaceLandmark[][] = [];
  private gestureBuffer: any[] = [];
  private eyeGazeHistory: { x: number; y: number; timestamp: number }[] = [];
  private blinkHistory: number[] = [];
  private readonly maxHistoryLength = 300; // 30 seconds at 10fps

  // Public speaking specific gesture patterns
  private readonly gesturePatterns = {
    openPalm: {
      name: 'Open Palm',
      description: 'Confident, trustworthy gesture',
      landmarks: [8, 12, 16, 20], // fingertip landmarks
      score: (hands: any) => this.calculateOpenPalmScore(hands)
    },
    pointing: {
      name: 'Pointing',
      description: 'Directive gesture (use sparingly)',
      landmarks: [8], // index finger tip
      score: (hands: any) => this.calculatePointingScore(hands)
    },
    counting: {
      name: 'Counting',
      description: 'Enumeration gesture',
      landmarks: [4, 8, 12, 16, 20], // thumb and fingertips
      score: (hands: any) => this.calculateCountingScore(hands)
    },
    steeple: {
      name: 'Steeple',
      description: 'Authority and confidence',
      landmarks: [0, 1, 2, 3, 4], // finger bases
      score: (hands: any) => this.calculateSteepleScore(hands)
    },
    fidgeting: {
      name: 'Fidgeting',
      description: 'Nervous hand movements',
      landmarks: [0, 5, 9, 13, 17], // hand bases
      score: (hands: any) => this.calculateFidgetingScore(hands)
    }
  };

  // Enhanced pose landmark indices for body language analysis
  private readonly poseIndices = {
    nose: 0,
    leftEye: 1,
    rightEye: 2,
    leftEar: 3,
    rightEar: 4,
    leftShoulder: 11,
    rightShoulder: 12,
    leftElbow: 13,
    rightElbow: 14,
    leftWrist: 15,
    rightWrist: 16,
    leftHip: 23,
    rightHip: 24,
    neck: 10
  };

  processMediaPipeResults(results: any): EnhancedPoseMetrics {
    // Store current frame data
    if (results.poseLandmarks) {
      this.poseHistory.push(results.poseLandmarks);
      if (this.poseHistory.length > this.maxHistoryLength) {
        this.poseHistory.shift();
      }
    }

    if (results.faceLandmarks) {
      this.faceHistory.push(results.faceLandmarks);
      if (this.faceHistory.length > this.maxHistoryLength) {
        this.faceHistory.shift();
      }
    }

    if (results.leftHandLandmarks || results.rightHandLandmarks) {
      this.gestureBuffer.push({
        left: results.leftHandLandmarks,
        right: results.rightHandLandmarks,
        timestamp: Date.now()
      });
      if (this.gestureBuffer.length > this.maxHistoryLength) {
        this.gestureBuffer.shift();
      }
    }

    return {
      posture: this.analyzePosture(results.poseLandmarks),
      gestures: this.analyzeGestures(results.leftHandLandmarks, results.rightHandLandmarks),
      eyeContact: this.analyzeEyeContact(results.faceLandmarks),
      facialExpression: this.analyzeFacialExpression(results.faceLandmarks),
      bodyLanguage: this.analyzeBodyLanguage(results.poseLandmarks, results.faceLandmarks)
    };
  }

  private analyzePosture(poseLandmarks: PoseLandmark[]): EnhancedPoseMetrics['posture'] {
    if (!poseLandmarks || poseLandmarks.length === 0) {
      return {
        spineAlignment: 0,
        shoulderLevel: 0,
        headPosition: 0,
        overallPosture: 0
      };
    }

    const leftShoulder = poseLandmarks[this.poseIndices.leftShoulder];
    const rightShoulder = poseLandmarks[this.poseIndices.rightShoulder];
    const nose = poseLandmarks[this.poseIndices.nose];
    const neck = poseLandmarks[this.poseIndices.neck];

    // Calculate spine alignment (neck to shoulder center should be vertical)
    const shoulderCenter = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };

    const spineAngle = Math.atan2(neck.x - shoulderCenter.x, neck.y - shoulderCenter.y);
    const spineAlignment = Math.max(0, 100 - Math.abs(spineAngle) * 180 / Math.PI * 2);

    // Calculate shoulder level (shoulders should be horizontal)
    const shoulderSlope = Math.abs(leftShoulder.y - rightShoulder.y);
    const shoulderLevel = Math.max(0, 100 - shoulderSlope * 1000);

    // Calculate head position (head should be centered and upright)
    const headTilt = Math.abs(nose.x - shoulderCenter.x);
    const headPosition = Math.max(0, 100 - headTilt * 500);

    const overallPosture = (spineAlignment + shoulderLevel + headPosition) / 3;

    return {
      spineAlignment: Math.round(spineAlignment),
      shoulderLevel: Math.round(shoulderLevel),
      headPosition: Math.round(headPosition),
      overallPosture: Math.round(overallPosture)
    };
  }

  private analyzeGestures(leftHand: any, rightHand: any): EnhancedPoseMetrics['gestures'] {
    if (this.gestureBuffer.length === 0) {
      return {
        handMovementFrequency: 0,
        gestureNaturalness: 0,
        openPalmFrequency: 0,
        pointingFrequency: 0,
        fidgetingScore: 0
      };
    }

    // Calculate hand movement frequency
    const recentGestures = this.gestureBuffer.slice(-100); // Last 10 seconds
    const movementCount = this.calculateHandMovement(recentGestures);
    const handMovementFrequency = (movementCount / 10) * 60; // per minute

    // Analyze gesture types
    let openPalmCount = 0;
    let pointingCount = 0;
    let fidgetingScore = 0;

    for (const gesture of recentGestures) {
      if (gesture.left || gesture.right) {
        openPalmCount += this.calculateOpenPalmScore([gesture.left, gesture.right]);
        pointingCount += this.calculatePointingScore([gesture.left, gesture.right]);
        fidgetingScore += this.calculateFidgetingScore([gesture.left, gesture.right]);
      }
    }

    const openPalmFrequency = recentGestures.length > 0 ? (openPalmCount / recentGestures.length) * 100 : 0;
    const pointingFrequency = (pointingCount / 10) * 60; // per minute
    const avgFidgetingScore = recentGestures.length > 0 ? fidgetingScore / recentGestures.length : 0;

    // Calculate gesture naturalness based on variation and flow
    const gestureNaturalness = this.calculateGestureNaturalness(recentGestures);

    return {
      handMovementFrequency: Math.round(handMovementFrequency),
      gestureNaturalness: Math.round(gestureNaturalness),
      openPalmFrequency: Math.round(openPalmFrequency),
      pointingFrequency: Math.round(pointingFrequency),
      fidgetingScore: Math.round(100 - avgFidgetingScore) // Invert so higher is better
    };
  }

  private analyzeEyeContact(faceLandmarks: FaceLandmark[]): EnhancedPoseMetrics['eyeContact'] {
    if (!faceLandmarks || faceLandmarks.length === 0) {
      return {
        gazeDirection: { x: 0, y: 0, z: 0 },
        eyeContactPercentage: 0,
        gazeStability: 0,
        blinkRate: 0,
        gazeDistribution: {
          center: 0,
          left: 0,
          right: 0,
          up: 0,
          down: 0
        }
      };
    }

    // Enhanced eye tracking using facial landmarks
    const leftEye = this.getEyeCenter(faceLandmarks, 'left');
    const rightEye = this.getEyeCenter(faceLandmarks, 'right');
    const noseTip = faceLandmarks[1]; // Nose tip landmark

    // Calculate gaze direction
    const gazeDirection = this.calculateGazeDirection(leftEye, rightEye, noseTip);
    
    // Store gaze history
    this.eyeGazeHistory.push({
      x: gazeDirection.x,
      y: gazeDirection.y,
      timestamp: Date.now()
    });

    // Keep only recent history (30 seconds)
    const thirtySecondsAgo = Date.now() - 30000;
    this.eyeGazeHistory = this.eyeGazeHistory.filter(g => g.timestamp > thirtySecondsAgo);

    // Calculate eye contact percentage (looking at center area)
    const centerGazeCount = this.eyeGazeHistory.filter(g => 
      Math.abs(g.x) < 0.2 && Math.abs(g.y) < 0.2
    ).length;
    const eyeContactPercentage = this.eyeGazeHistory.length > 0 ? 
      (centerGazeCount / this.eyeGazeHistory.length) * 100 : 0;

    // Calculate gaze stability (less movement = more stable)
    const gazeStability = this.calculateGazeStability();

    // Detect blinks and calculate blink rate
    const blinkRate = this.detectBlinkRate(faceLandmarks);

    // Calculate gaze distribution
    const gazeDistribution = this.calculateGazeDistribution();

    return {
      gazeDirection,
      eyeContactPercentage: Math.round(eyeContactPercentage),
      gazeStability: Math.round(gazeStability),
      blinkRate: Math.round(blinkRate),
      gazeDistribution
    };
  }

  private analyzeFacialExpression(faceLandmarks: FaceLandmark[]): EnhancedPoseMetrics['facialExpression'] {
    if (!faceLandmarks || faceLandmarks.length === 0) {
      return {
        confidence: 0,
        engagement: 0,
        authenticity: 0,
        nervousness: 0,
        microExpressions: {
          eyebrowMovement: 0,
          eyeMovement: 0,
          mouthExpression: 0,
          facialSymmetry: 0
        }
      };
    }

    // Analyze facial features for emotions
    const mouthAnalysis = this.analyzeMouthExpression(faceLandmarks);
    const eyebrowAnalysis = this.analyzeEyebrowPosition(faceLandmarks);
    const eyeAnalysis = this.analyzeEyeExpression(faceLandmarks);
    const symmetryAnalysis = this.analyzeFacialSymmetry(faceLandmarks);

    // Calculate confidence based on facial features
    const confidence = this.calculateConfidenceFromFace(mouthAnalysis, eyebrowAnalysis, eyeAnalysis);
    
    // Calculate engagement (expressiveness and animation)
    const engagement = this.calculateEngagementFromFace(mouthAnalysis, eyebrowAnalysis);
    
    // Calculate authenticity (natural vs forced expressions)
    const authenticity = this.calculateAuthenticityFromFace(symmetryAnalysis, mouthAnalysis);
    
    // Calculate nervousness indicators
    const nervousness = this.calculateNervousnessFromFace(eyeAnalysis, mouthAnalysis);

    return {
      confidence: Math.round(confidence),
      engagement: Math.round(engagement),
      authenticity: Math.round(authenticity),
      nervousness: Math.round(nervousness),
      microExpressions: {
        eyebrowMovement: Math.round(eyebrowAnalysis.movement),
        eyeMovement: Math.round(eyeAnalysis.movement),
        mouthExpression: Math.round(mouthAnalysis.expression),
        facialSymmetry: Math.round(symmetryAnalysis.symmetry)
      }
    };
  }

  private analyzeBodyLanguage(poseLandmarks: PoseLandmark[], faceLandmarks: FaceLandmark[]): EnhancedPoseMetrics['bodyLanguage'] {
    if (!poseLandmarks) {
      return {
        energyLevel: 0,
        professionalism: 0,
        approachability: 0,
        authorityPresence: 0
      };
    }

    // Calculate energy level from movement and posture
    const movement = this.calculateBodyMovement(poseLandmarks);
    const postureEnergy = this.calculatePostureEnergy(poseLandmarks);
    const energyLevel = (movement + postureEnergy) / 2;

    // Calculate professionalism from posture and gestures - AUTHENTIC DATA ONLY
    const postureScore = this.analyzePosture(poseLandmarks).overallPosture;
    const gestureScore = this.gestureBuffer.length > 0 ? this.calculateGestureQuality() : 0; // Real gesture analysis only
    const professionalism = gestureScore > 0 ? (postureScore + gestureScore) / 2 : postureScore;

    // Calculate approachability from facial expressions and open gestures - AUTHENTIC DATA ONLY
    const facialWarmth = faceLandmarks ? this.calculateFacialWarmth(faceLandmarks) : 0; // Zero if no face data
    const openGestures = this.calculateOpenGestureFrequency();
    const approachability = facialWarmth > 0 && openGestures > 0 ? (facialWarmth + openGestures) / 2 : 0;

    // Calculate authority presence from posture and space usage
    const spaceUsage = this.calculateSpaceUsage(poseLandmarks);
    const postureAuthority = this.calculatePostureAuthority(poseLandmarks);
    const authorityPresence = (spaceUsage + postureAuthority) / 2;

    return {
      energyLevel: Math.round(energyLevel),
      professionalism: Math.round(professionalism),
      approachability: Math.round(approachability),
      authorityPresence: Math.round(authorityPresence)
    };
  }

  // Helper methods for gesture recognition
  private calculateOpenPalmScore(hands: any[]): number {
    if (!hands || hands.length === 0) return 0;
    
    let score = 0;
    for (const hand of hands) {
      if (hand && hand.length >= 21) {
        // Check if fingers are extended (open palm)
        const fingersExtended = this.countExtendedFingers(hand);
        if (fingersExtended >= 4) score += 1;
      }
    }
    return score;
  }

  private calculatePointingScore(hands: any[]): number {
    if (!hands || hands.length === 0) return 0;
    
    let score = 0;
    for (const hand of hands) {
      if (hand && hand.length >= 21) {
        // Check if only index finger is extended
        const indexExtended = this.isFingerExtended(hand, 1); // Index finger
        const otherFingersFolded = !this.isFingerExtended(hand, 2) && 
                                  !this.isFingerExtended(hand, 3) && 
                                  !this.isFingerExtended(hand, 4);
        if (indexExtended && otherFingersFolded) score += 1;
      }
    }
    return score;
  }

  private calculateFidgetingScore(hands: any[]): number {
    if (this.gestureBuffer.length < 10) return 0;
    
    // Calculate hand position variance over time
    const recentPositions = this.gestureBuffer.slice(-10);
    let variance = 0;
    
    for (let i = 1; i < recentPositions.length; i++) {
      const prev = recentPositions[i - 1];
      const curr = recentPositions[i];
      
      if (prev.left && curr.left) {
        variance += this.calculateHandPositionChange(prev.left, curr.left);
      }
      if (prev.right && curr.right) {
        variance += this.calculateHandPositionChange(prev.right, curr.right);
      }
    }
    
    return Math.min(100, variance * 10); // Scale fidgeting score
  }

  private calculateCountingScore(hands: any[]): number {
    // Implementation for counting gesture detection
    return 0;
  }

  private calculateSteepleScore(hands: any[]): number {
    // Implementation for steeple gesture detection
    return 0;
  }

  private calculateHandMovement(gestures: any[]): number {
    if (gestures.length < 2) return 0;
    
    let totalMovement = 0;
    for (let i = 1; i < gestures.length; i++) {
      const prev = gestures[i - 1];
      const curr = gestures[i];
      
      if (prev.left && curr.left) {
        totalMovement += this.calculateHandPositionChange(prev.left, curr.left);
      }
      if (prev.right && curr.right) {
        totalMovement += this.calculateHandPositionChange(prev.right, curr.right);
      }
    }
    
    return totalMovement;
  }

  private calculateGestureNaturalness(gestures: any[]): number {
    if (gestures.length === 0) return 0;
    
    // Analyze gesture flow and variation
    const movementVariation = this.calculateMovementVariation(gestures);
    const gestureRhythm = this.calculateGestureRhythm(gestures);
    
    return (movementVariation + gestureRhythm) / 2;
  }

  // Helper methods for eye tracking
  private getEyeCenter(faceLandmarks: FaceLandmark[], eye: 'left' | 'right'): FaceLandmark {
    // Simplified eye center calculation
    const eyeIndices = eye === 'left' ? [33, 7, 163, 144, 145, 153] : [362, 382, 381, 380, 374, 373];
    let x = 0, y = 0, z = 0;
    
    for (const index of eyeIndices) {
      if (faceLandmarks[index]) {
        x += faceLandmarks[index].x;
        y += faceLandmarks[index].y;
        z += faceLandmarks[index].z;
      }
    }
    
    return {
      x: x / eyeIndices.length,
      y: y / eyeIndices.length,
      z: z / eyeIndices.length
    };
  }

  private calculateGazeDirection(leftEye: FaceLandmark, rightEye: FaceLandmark, nose: FaceLandmark): { x: number; y: number; z: number } {
    // Calculate gaze direction based on eye and nose positions
    const eyeCenter = {
      x: (leftEye.x + rightEye.x) / 2,
      y: (leftEye.y + rightEye.y) / 2,
      z: (leftEye.z + rightEye.z) / 2
    };
    
    return {
      x: eyeCenter.x - nose.x,
      y: eyeCenter.y - nose.y,
      z: eyeCenter.z - nose.z
    };
  }

  private calculateGazeStability(): number {
    if (this.eyeGazeHistory.length < 10) return 0;
    
    const recent = this.eyeGazeHistory.slice(-10);
    let variance = 0;
    
    for (let i = 1; i < recent.length; i++) {
      const dx = recent[i].x - recent[i - 1].x;
      const dy = recent[i].y - recent[i - 1].y;
      variance += Math.sqrt(dx * dx + dy * dy);
    }
    
    return Math.max(0, 100 - variance * 100);
  }

  private detectBlinkRate(faceLandmarks: FaceLandmark[]): number {
    // Simplified blink detection - would need more sophisticated implementation
    const eyeAspectRatio = this.calculateEyeAspectRatio(faceLandmarks);
    
    if (eyeAspectRatio < 0.2) {
      this.blinkHistory.push(Date.now());
    }
    
    // Remove old blinks (older than 1 minute)
    const oneMinuteAgo = Date.now() - 60000;
    this.blinkHistory = this.blinkHistory.filter(b => b > oneMinuteAgo);
    
    return this.blinkHistory.length; // Blinks per minute
  }

  private calculateGazeDistribution(): EnhancedPoseMetrics['eyeContact']['gazeDistribution'] {
    if (this.eyeGazeHistory.length === 0) {
      return { center: 0, left: 0, right: 0, up: 0, down: 0 };
    }
    
    let center = 0, left = 0, right = 0, up = 0, down = 0;
    
    for (const gaze of this.eyeGazeHistory) {
      if (Math.abs(gaze.x) < 0.2 && Math.abs(gaze.y) < 0.2) center++;
      else if (gaze.x < -0.2) left++;
      else if (gaze.x > 0.2) right++;
      else if (gaze.y < -0.2) up++;
      else if (gaze.y > 0.2) down++;
    }
    
    const total = this.eyeGazeHistory.length;
    return {
      center: Math.round((center / total) * 100),
      left: Math.round((left / total) * 100),
      right: Math.round((right / total) * 100),
      up: Math.round((up / total) * 100),
      down: Math.round((down / total) * 100)
    };
  }

  // Additional helper methods
  private countExtendedFingers(hand: any[]): number {
    let count = 0;
    for (let i = 1; i <= 4; i++) {
      if (this.isFingerExtended(hand, i)) count++;
    }
    return count;
  }

  private isFingerExtended(hand: any[], fingerIndex: number): boolean {
    const tipIndex = fingerIndex * 4;
    const pipIndex = fingerIndex * 4 - 1;
    
    if (hand[tipIndex] && hand[pipIndex]) {
      return hand[tipIndex].y < hand[pipIndex].y; // Tip is above PIP joint
    }
    
    return false;
  }

  private calculateHandPositionChange(hand1: any[], hand2: any[]): number {
    if (!hand1 || !hand2 || hand1.length === 0 || hand2.length === 0) return 0;
    
    const wrist1 = hand1[0];
    const wrist2 = hand2[0];
    
    const dx = wrist2.x - wrist1.x;
    const dy = wrist2.y - wrist1.y;
    
    return Math.sqrt(dx * dx + dy * dy);
  }

  private calculateMovementVariation(gestures: any[]): number {
    if (!gestures || gestures.length < 2) return 0;
    
    // Calculate variation in gesture movements
    let totalVariation = 0;
    for (let i = 1; i < gestures.length; i++) {
      const prev = gestures[i - 1];
      const curr = gestures[i];
      
      if (prev && curr) {
        const variation = this.calculateHandPositionChange(prev.left || prev.right, curr.left || curr.right);
        totalVariation += variation;
      }
    }
    
    return gestures.length > 1 ? Math.round((totalVariation / (gestures.length - 1)) * 100) : 0;
  }

  private calculateGestureRhythm(gestures: any[]): number {
    if (!gestures || gestures.length < 3) return 0;
    
    // Calculate rhythm consistency from gesture timing
    let rhythmScore = 0;
    let intervals: number[] = [];
    
    for (let i = 1; i < gestures.length; i++) {
      if (gestures[i].timestamp && gestures[i - 1].timestamp) {
        intervals.push(gestures[i].timestamp - gestures[i - 1].timestamp);
      }
    }
    
    if (intervals.length > 0) {
      const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
      const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
      rhythmScore = Math.max(0, 100 - (Math.sqrt(variance) / avgInterval) * 100);
    }
    
    return Math.round(rhythmScore);
  }

  private analyzeMouthExpression(faceLandmarks: FaceLandmark[]): { expression: number } {
    if (!faceLandmarks || faceLandmarks.length < 468) return { expression: 0 };
    
    // Analyze mouth expression using key landmarks
    const mouthLeft = faceLandmarks[61];
    const mouthRight = faceLandmarks[291];
    const mouthTop = faceLandmarks[13];
    const mouthBottom = faceLandmarks[14];
    
    if (!mouthLeft || !mouthRight || !mouthTop || !mouthBottom) return { expression: 0 };
    
    const mouthWidth = Math.abs(mouthRight.x - mouthLeft.x);
    const mouthHeight = Math.abs(mouthTop.y - mouthBottom.y);
    const expressionScore = mouthWidth / mouthHeight;
    
    return { expression: Math.min(100, Math.round(expressionScore * 50)) };
  }

  private analyzeEyebrowPosition(faceLandmarks: FaceLandmark[]): { movement: number } {
    if (!faceLandmarks || faceLandmarks.length < 468) return { movement: 0 };
    
    // Analyze eyebrow position using landmarks
    const leftEyebrowOuter = faceLandmarks[46];
    const leftEyebrowInner = faceLandmarks[70];
    const rightEyebrowOuter = faceLandmarks[276];
    const rightEyebrowInner = faceLandmarks[300];
    
    if (!leftEyebrowOuter || !leftEyebrowInner || !rightEyebrowOuter || !rightEyebrowInner) return { movement: 0 };
    
    // Calculate eyebrow height and movement
    const leftHeight = Math.abs(leftEyebrowOuter.y - leftEyebrowInner.y);
    const rightHeight = Math.abs(rightEyebrowOuter.y - rightEyebrowInner.y);
    const movementScore = (leftHeight + rightHeight) * 100;
    
    return { movement: Math.min(100, Math.round(movementScore)) };
  }

  private analyzeEyeExpression(faceLandmarks: FaceLandmark[]): { movement: number } {
    if (!faceLandmarks || faceLandmarks.length < 468) return { movement: 0 };
    
    // Analyze eye expression using eye landmarks
    const leftEyeOuter = faceLandmarks[33];
    const leftEyeInner = faceLandmarks[133];
    const rightEyeOuter = faceLandmarks[362];
    const rightEyeInner = faceLandmarks[263];
    
    if (!leftEyeOuter || !leftEyeInner || !rightEyeOuter || !rightEyeInner) return { movement: 0 };
    
    // Calculate eye openness and expression
    const leftOpenness = Math.abs(leftEyeOuter.x - leftEyeInner.x);
    const rightOpenness = Math.abs(rightEyeOuter.x - rightEyeInner.x);
    const movementScore = (leftOpenness + rightOpenness) * 100;
    
    return { movement: Math.min(100, Math.round(movementScore)) };
  }

  private analyzeFacialSymmetry(faceLandmarks: FaceLandmark[]): { symmetry: number } {
    if (!faceLandmarks || faceLandmarks.length < 468) return { symmetry: 0 };
    
    // Analyze facial symmetry using paired landmarks
    const nose = faceLandmarks[1];
    const leftMouth = faceLandmarks[61];
    const rightMouth = faceLandmarks[291];
    const leftEye = faceLandmarks[33];
    const rightEye = faceLandmarks[263];
    
    if (!nose || !leftMouth || !rightMouth || !leftEye || !rightEye) return { symmetry: 0 };
    
    // Calculate symmetry based on distance from center
    const noseCenterX = nose.x;
    const leftMouthDistance = Math.abs(leftMouth.x - noseCenterX);
    const rightMouthDistance = Math.abs(rightMouth.x - noseCenterX);
    const leftEyeDistance = Math.abs(leftEye.x - noseCenterX);
    const rightEyeDistance = Math.abs(rightEye.x - noseCenterX);
    
    const mouthSymmetry = 1 - Math.abs(leftMouthDistance - rightMouthDistance);
    const eyeSymmetry = 1 - Math.abs(leftEyeDistance - rightEyeDistance);
    
    const symmetryScore = ((mouthSymmetry + eyeSymmetry) / 2) * 100;
    return { symmetry: Math.max(0, Math.min(100, Math.round(symmetryScore))) };
  }

  private calculateConfidenceFromFace(mouth: any, eyebrow: any, eye: any): number {
    return (mouth.expression + eyebrow.movement + eye.movement) / 3;
  }

  private calculateEngagementFromFace(mouth: any, eyebrow: any): number {
    return (mouth.expression + eyebrow.movement) / 2;
  }

  private calculateAuthenticityFromFace(symmetry: any, mouth: any): number {
    return (symmetry.symmetry + mouth.expression) / 2;
  }

  private calculateNervousnessFromFace(eye: any, mouth: any): number {
    return 100 - (eye.movement + mouth.expression) / 2;
  }

  private calculateShoulderEnergy(poseLandmarks: PoseLandmark[]): number {
    if (!poseLandmarks || poseLandmarks.length === 0) return 0;
    
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];
    const nose = poseLandmarks[0];
    
    if (!leftShoulder || !rightShoulder || !nose) return 0;
    
    // Calculate shoulder alignment and openness
    const shoulderHeight = Math.abs(leftShoulder.y - rightShoulder.y);
    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    const centerAlignment = Math.abs((leftShoulder.x + rightShoulder.x) / 2 - nose.x);
    
    // Lower height difference and better alignment = higher energy/confidence
    const alignmentScore = Math.max(0, 100 - shoulderHeight * 1000);
    const widthScore = Math.min(100, shoulderWidth * 200);
    const centerScore = Math.max(0, 100 - centerAlignment * 500);
    
    return Math.round((alignmentScore + widthScore + centerScore) / 3);
  }

  private calculateGestureQuality(): number {
    if (this.gestureBuffer.length === 0) return 0;
    
    // Calculate quality of gestures from actual gesture data
    let totalQuality = 0;
    let validGestures = 0;
    
    for (const gesture of this.gestureBuffer) {
      if (gesture.left || gesture.right) {
        // Calculate naturalness and effectiveness of gestures
        let gestureQuality = 0;
        
        if (gesture.left) {
          gestureQuality += this.calculateOpenPalmScore([gesture.left]) * 10;
        }
        if (gesture.right) {
          gestureQuality += this.calculateOpenPalmScore([gesture.right]) * 10;
        }
        
        totalQuality += gestureQuality;
        validGestures++;
      }
    }
    
    return validGestures > 0 ? Math.round(totalQuality / validGestures) : 0;
  }

  private calculateBodyMovement(poseLandmarks: PoseLandmark[]): number {
    if (!poseLandmarks || this.poseHistory.length < 2) return 0;
    
    // Calculate actual movement from pose history
    const current = poseLandmarks;
    const previous = this.poseHistory[this.poseHistory.length - 2];
    
    if (!previous) return 0;
    
    let totalMovement = 0;
    let validLandmarks = 0;
    
    for (let i = 0; i < Math.min(current.length, previous.length); i++) {
      if (current[i] && previous[i]) {
        const dx = current[i].x - previous[i].x;
        const dy = current[i].y - previous[i].y;
        totalMovement += Math.sqrt(dx * dx + dy * dy);
        validLandmarks++;
      }
    }
    
    return validLandmarks > 0 ? Math.round((totalMovement / validLandmarks) * 1000) : 0;
  }

  private calculatePostureEnergy(poseLandmarks: PoseLandmark[]): number {
    if (!poseLandmarks || poseLandmarks.length === 0) return 0;
    
    // Calculate energy from spine alignment and shoulder position
    const spine = this.analyzePosture(poseLandmarks);
    const shoulderEnergy = this.calculateShoulderEnergy(poseLandmarks);
    
    return Math.round((spine.overallPosture + shoulderEnergy) / 2);
  }

  private calculateFacialWarmth(faceLandmarks: FaceLandmark[]): number {
    if (!faceLandmarks || faceLandmarks.length < 468) return 0;
    
    // Calculate facial warmth from mouth and eyebrow positions
    const mouthCornerLeft = faceLandmarks[61];
    const mouthCornerRight = faceLandmarks[291];
    const mouthTop = faceLandmarks[13];
    const mouthBottom = faceLandmarks[14];
    
    if (!mouthCornerLeft || !mouthCornerRight || !mouthTop || !mouthBottom) return 0;
    
    // Calculate smile indicator
    const mouthWidth = Math.abs(mouthCornerRight.x - mouthCornerLeft.x);
    const mouthHeight = Math.abs(mouthTop.y - mouthBottom.y);
    const smileRatio = mouthWidth / mouthHeight;
    
    // Higher ratio indicates more smile/warmth
    return Math.min(100, Math.round(smileRatio * 50));
  }

  private calculateOpenGestureFrequency(): number {
    if (this.gestureBuffer.length === 0) return 0;
    
    // Calculate actual open gesture frequency from gesture buffer
    let openGestureCount = 0;
    for (const gesture of this.gestureBuffer) {
      if (gesture.left || gesture.right) {
        // Check for open palm gestures in stored data
        if (gesture.left) {
          openGestureCount += this.calculateOpenPalmScore([gesture.left]);
        }
        if (gesture.right) {
          openGestureCount += this.calculateOpenPalmScore([gesture.right]);
        }
      }
    }
    
    // Calculate frequency as percentage
    return this.gestureBuffer.length > 0 ? Math.round((openGestureCount / this.gestureBuffer.length) * 100) : 0;
  }

  private calculateSpaceUsage(poseLandmarks: PoseLandmark[]): number {
    if (!poseLandmarks || poseLandmarks.length === 0) return 0;
    
    // Calculate actual space usage from pose landmarks
    const leftShoulder = poseLandmarks[11];
    const rightShoulder = poseLandmarks[12];
    const leftHip = poseLandmarks[23];
    const rightHip = poseLandmarks[24];
    
    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return 0;
    
    const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
    const hipWidth = Math.abs(rightHip.x - leftHip.x);
    const bodyWidth = Math.max(shoulderWidth, hipWidth);
    
    // Normalize based on frame width (assuming 0-1 coordinate system)
    return Math.round(bodyWidth * 100);
  }

  private calculatePostureAuthority(poseLandmarks: PoseLandmark[]): number {
    if (!poseLandmarks || poseLandmarks.length === 0) return 0;
    
    const posture = this.analyzePosture(poseLandmarks);
    const spaceUsage = this.calculateSpaceUsage(poseLandmarks);
    
    // Authority comes from good posture and confident space usage
    return Math.round((posture.overallPosture * 0.7 + spaceUsage * 0.3));
  }

  private calculateEyeAspectRatio(faceLandmarks: FaceLandmark[]): number {
    if (!faceLandmarks || faceLandmarks.length < 468) return 0;
    
    // Calculate actual Eye Aspect Ratio for blink detection
    // Using MediaPipe face landmarks for left eye
    const leftEyeTop = faceLandmarks[159];
    const leftEyeBottom = faceLandmarks[145];
    const leftEyeLeft = faceLandmarks[33];
    const leftEyeRight = faceLandmarks[133];
    
    if (!leftEyeTop || !leftEyeBottom || !leftEyeLeft || !leftEyeRight) return 0;
    
    const eyeHeight = Math.abs(leftEyeTop.y - leftEyeBottom.y);
    const eyeWidth = Math.abs(leftEyeRight.x - leftEyeLeft.x);
    
    return eyeWidth > 0 ? eyeHeight / eyeWidth : 0;
  }

  // Real-time streaming method
  streamEnhancedAnalysis(socket: Socket, results: any): void {
    const metrics = this.processMediaPipeResults(results);
    
    socket.emit('enhanced-cv-metrics', {
      timestamp: Date.now(),
      metrics,
      analysisType: 'blazepose-enhanced'
    });
  }

  cleanup(): void {
    this.poseHistory = [];
    this.faceHistory = [];
    this.gestureBuffer = [];
    this.eyeGazeHistory = [];
    this.blinkHistory = [];
  }
}

export const blazePoseEnhancedCV = new BlazePoseEnhancedCV();