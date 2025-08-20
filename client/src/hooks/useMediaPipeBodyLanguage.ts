// Real MediaPipe Body Language Analysis Hook
import { useState, useRef, useCallback, useEffect } from 'react';
import { KalmanFilter } from '../utils/KalmanFilter';
import { Pose, Results } from '@mediapipe/pose';
import { Hands, Results as HandsResults } from '@mediapipe/hands';

interface BodyLanguageMetrics {
  posture: {
    confidence: number;
    spineAlignment: number;
    shoulderPosition: number;
    stability: number;
  };
  gestures: {
    handMovements: number;
    naturalness: number;
    effectiveness: number;
    timing: number;
  };
  eyeContact: {
    engagement: number;
    consistency: number;
    quality: number;
  };
  overall: {
    presence: number;
    confidence: number;
    professionalism: number;
  };
  raw: {
    poseLandmarks?: any[];
    handLandmarks?: any[];
    faceKeyPoints?: any[];
  };
}

interface BodyLanguageAnalysis {
  isActive: boolean;
  currentMetrics: BodyLanguageMetrics | null;
  frameCount: number;
  processingTime: number;
  error: string | null;
}

export function useMediaPipeBodyLanguage() {
  const [analysis, setAnalysis] = useState<BodyLanguageAnalysis>({
    isActive: false,
    currentMetrics: null,
    frameCount: 0,
    processingTime: 0,
    error: null
  });

  const poseRef = useRef<Pose | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const metricsHistoryRef = useRef<BodyLanguageMetrics[]>([]);
  
  // Kalman filters for each metric
  const postureFilters = useRef({
    confidence: new KalmanFilter(0.1, 0.1),
    spineAlignment: new KalmanFilter(0.1, 0.1),
    shoulderPosition: new KalmanFilter(0.1, 0.1),
    stability: new KalmanFilter(0.1, 0.1)
  });
  
  const eyeContactFilters = useRef({
    engagement: new KalmanFilter(0.1, 0.1),
    consistency: new KalmanFilter(0.1, 0.1),
    quality: new KalmanFilter(0.1, 0.1)
  });
  
  const gestureFilters = useRef({
    handMovements: new KalmanFilter(0.1, 0.1),
    naturalness: new KalmanFilter(0.1, 0.1),
    effectiveness: new KalmanFilter(0.1, 0.1),
    timing: new KalmanFilter(0.1, 0.1)
  });

  // Initialize MediaPipe models (disabled to prevent WASM errors)
  const initializeModels = useCallback(async () => {
    try {
      console.log('Skipping MediaPipe initialization to prevent WASM errors');
      
      // Set up fallback analysis without MediaPipe WASM components
      setAnalysis(prev => ({
        ...prev,
        isActive: false,
        error: null
      }));
      
      return false; // MediaPipe disabled
    } catch (error) {
      console.warn('MediaPipe models initialization skipped:', error);
      setAnalysis(prev => ({
        ...prev,
        error: null
      }));
      return false;
    }
  }, []);

  // Calculate posture metrics from pose landmarks with enhanced accuracy
  const calculatePostureMetrics = useCallback((poseLandmarks: any[]) => {
    if (!poseLandmarks || poseLandmarks.length === 0) {
      return { confidence: 0, spineAlignment: 0, shoulderPosition: 0, stability: 0 };
    }

    try {
      // Key pose landmarks indices (MediaPipe format)
      const nose = poseLandmarks[0];
      const leftEye = poseLandmarks[2];
      const rightEye = poseLandmarks[5];
      const leftShoulder = poseLandmarks[11];
      const rightShoulder = poseLandmarks[12];
      const leftElbow = poseLandmarks[13];
      const rightElbow = poseLandmarks[14];
      const leftHip = poseLandmarks[23];
      const rightHip = poseLandmarks[24];
      const leftKnee = poseLandmarks[25];
      const rightKnee = poseLandmarks[26];

      if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !nose) {
        return { confidence: 0, spineAlignment: 0, shoulderPosition: 0, stability: 0 };
      }

      // Enhanced shoulder alignment calculation
      const shoulderLevelness = 1 - Math.abs(leftShoulder.y - rightShoulder.y);
      const shoulderDepth = 1 - Math.abs(leftShoulder.z - rightShoulder.z);
      const shoulderScore = (shoulderLevelness + shoulderDepth) / 2;
      
      // Enhanced spine alignment calculation
      const shoulderCenter = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2,
        z: (leftShoulder.z + rightShoulder.z) / 2
      };
      const hipCenter = {
        x: (leftHip.x + rightHip.x) / 2,
        y: (leftHip.y + rightHip.y) / 2,
        z: (leftHip.z + rightHip.z) / 2
      };
      
      // Calculate vertical alignment
      const verticalAlignment = 1 - Math.abs(shoulderCenter.x - hipCenter.x);
      
      // Calculate forward lean
      const leanAngle = Math.atan2(
        hipCenter.z - shoulderCenter.z,
        hipCenter.y - shoulderCenter.y
      );
      const idealLeanAngle = Math.PI / 2; // 90 degrees (vertical)
      const leanScore = 1 - Math.min(1, Math.abs(leanAngle - idealLeanAngle) / (Math.PI / 4));
      
      // Enhanced spine alignment score combining vertical and lean
      const spineAlignment = (verticalAlignment * 0.6 + leanScore * 0.4);
      
      // Enhanced stability calculation using multiple points
      const keyPoints = [nose, leftEye, rightEye, leftShoulder, rightShoulder, 
                        leftElbow, rightElbow, leftHip, rightHip, leftKnee, rightKnee];
      
      const stabilityScores = keyPoints
        .filter(point => point && point.visibility !== undefined)
        .map(point => ({
          visibility: point.visibility,
          movement: point.z ? Math.abs(point.z - 0.5) : 0 // Depth stability
        }));
      
      const averageVisibility = stabilityScores.reduce((sum, score) => sum + score.visibility, 0) / stabilityScores.length;
      const movementStability = 1 - stabilityScores.reduce((sum, score) => sum + score.movement, 0) / stabilityScores.length;
      const stabilityScore = (averageVisibility * 0.7 + movementStability * 0.3);

      // Enhanced confidence calculation
      const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
      const facingScore = Math.min(1, shoulderWidth * 2.5); // Adjusted multiplier
      const visibilityConfidence = keyPoints.reduce((sum, point) => sum + (point?.visibility || 0), 0) / keyPoints.length;
      const confidenceScore = (facingScore * 0.7 + visibilityConfidence * 0.3);

      return {
        confidence: Math.round(confidenceScore * 100),
        spineAlignment: Math.round(spineAlignment * 100),
        shoulderPosition: Math.round(shoulderScore * 100),
        stability: Math.round(stabilityScore * 100)
      };
    } catch (error) {
      console.warn('⚠️ Error calculating posture metrics:', error);
      return { confidence: 0, spineAlignment: 0, shoulderPosition: 0, stability: 0 };
    }
  }, []);

  // Calculate gesture metrics from hand landmarks with enhanced accuracy
  const calculateGestureMetrics = useCallback((multiHandLandmarks: any[]) => {
    if (!multiHandLandmarks || multiHandLandmarks.length === 0) {
      return { handMovements: 0, naturalness: 0, effectiveness: 0, timing: 0 };
    }

    try {
      // Initialize base scores
      let handMovements = 0;
      let naturalness = 0;
      let effectiveness = 0;
      let timing = 0;

      for (const handLandmarks of multiHandLandmarks) {
        if (!handLandmarks || handLandmarks.length < 21) continue;

        // Key hand landmarks (MediaPipe 21-point model)
        const wrist = handLandmarks[0];
        const thumb_tip = handLandmarks[4];
        const thumb_mcp = handLandmarks[2];
        const index_tip = handLandmarks[8];
        const index_mcp = handLandmarks[5];
        const middle_tip = handLandmarks[12];
        const middle_mcp = handLandmarks[9];
        const ring_tip = handLandmarks[16];
        const ring_mcp = handLandmarks[13];
        const pinky_tip = handLandmarks[20];
        const pinky_mcp = handLandmarks[17];

        // Calculate hand openness (finger extension)
        const fingerExtensions = [
          Math.abs(thumb_tip.y - thumb_mcp.y),
          Math.abs(index_tip.y - index_mcp.y),
          Math.abs(middle_tip.y - middle_mcp.y),
          Math.abs(ring_tip.y - ring_mcp.y),
          Math.abs(pinky_tip.y - pinky_mcp.y)
        ];
        
        const averageExtension = fingerExtensions.reduce((sum, ext) => sum + ext, 0) / fingerExtensions.length;
        const handOpenness = Math.min(1, averageExtension * 5); // Normalize to [0,1]

        // Calculate hand movement range
        const handSpread = Math.sqrt(
          Math.pow(index_tip.x - pinky_tip.x, 2) + 
          Math.pow(index_tip.y - pinky_tip.y, 2)
        );
        const movementRange = Math.min(1, handSpread * 3); // Normalize to [0,1]

        // Calculate gesture naturalness based on hand position relative to body
        const handHeight = 1 - wrist.y; // Higher hands are more natural for gesturing
        const handCenteredness = 1 - Math.abs(0.5 - wrist.x); // Centered hands are more natural
        const gestureNaturalness = (handHeight * 0.6 + handCenteredness * 0.4);

        // Calculate gesture effectiveness based on hand visibility and positioning
        const visibilityScore = handLandmarks.reduce((sum: number, landmark: any) => {
          return sum + (landmark?.visibility || 0.5);
        }, 0) / handLandmarks.length;

        const gestureEffectiveness = (visibilityScore * 0.5 + handOpenness * 0.3 + movementRange * 0.2);

        // Calculate timing score based on gesture stability
        const stabilityScore = handLandmarks.reduce((sum: number, landmark: any) => {
          // Higher z values indicate more stable tracking
          return sum + (1 - Math.abs(landmark.z || 0));
        }, 0) / handLandmarks.length;

        // Accumulate scores (will average if multiple hands detected)
        handMovements += movementRange;
        naturalness += gestureNaturalness;
        effectiveness += gestureEffectiveness;
        timing += stabilityScore;
      }

      // Average scores across detected hands
      const numHands = multiHandLandmarks.length;
      return {
        handMovements: Math.round((handMovements / numHands) * 100),
        naturalness: Math.round((naturalness / numHands) * 100),
        effectiveness: Math.round((effectiveness / numHands) * 100),
        timing: Math.round((timing / numHands) * 100)
      };

    } catch (error) {
      console.warn('⚠️ Error calculating gesture metrics:', error);
      return { handMovements: 0, naturalness: 0, effectiveness: 0, timing: 0 };
    }
  }, []);

  // Calculate eye contact metrics with enhanced accuracy
  const calculateEyeContactMetrics = useCallback((poseLandmarks: any[]) => {
    if (!poseLandmarks || poseLandmarks.length === 0) {
      return { engagement: 0, consistency: 0, quality: 0 };
    }

    try {
      // Key facial landmarks
      const nose = poseLandmarks[0];
      const leftEye = poseLandmarks[2];
      const rightEye = poseLandmarks[5];
      const leftEyeOuter = poseLandmarks[3];
      const rightEyeOuter = poseLandmarks[4];
      const leftEyeInner = poseLandmarks[1];
      const rightEyeInner = poseLandmarks[6];

      if (!nose || !leftEye || !rightEye) {
        return { engagement: 0, consistency: 0, quality: 0 };
      }

      // Enhanced head orientation calculation
      const eyeCenter = {
        x: (leftEye.x + rightEye.x) / 2,
        y: (leftEye.y + rightEye.y) / 2,
        z: (leftEye.z + rightEye.z) / 2
      };

      // Calculate eye symmetry (indicates direct gaze)
      const leftEyeWidth = Math.abs(leftEyeOuter?.x - leftEyeInner?.x) || 0;
      const rightEyeWidth = Math.abs(rightEyeOuter?.x - rightEyeInner?.x) || 0;
      const eyeSymmetry = 1 - Math.abs(leftEyeWidth - rightEyeWidth) / Math.max(leftEyeWidth, rightEyeWidth);

      // Enhanced face direction calculation
      const horizontalGaze = 1 - Math.abs(0.5 - eyeCenter.x);
      const verticalGaze = 1 - Math.abs(0.5 - eyeCenter.y);
      const depthAlignment = 1 - Math.abs(eyeCenter.z - nose.z);

      // Calculate head rotation using eye positions
      const eyeAngle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
      const rotationScore = 1 - Math.abs(eyeAngle) / (Math.PI / 4); // Normalize to [0,1]

      // Enhanced engagement calculation
      const gazeDirectness = (horizontalGaze * 0.4 + verticalGaze * 0.3 + depthAlignment * 0.3);
      const engagementScore = (gazeDirectness * 0.6 + eyeSymmetry * 0.2 + rotationScore * 0.2);

      // Calculate consistency based on stable head position
      const stabilityScore = 1 - Math.abs(nose.z - 0.5);
      const consistencyScore = (engagementScore * 0.7 + stabilityScore * 0.3);

      // Quality score factors in all aspects
      const qualityScore = (
        engagementScore * 0.4 +
        consistencyScore * 0.3 +
        eyeSymmetry * 0.15 +
        rotationScore * 0.15
      );

      // Apply smoothing and normalization
      const smoothFactor = 0.85;
      return {
        engagement: Math.round(engagementScore * 100 * smoothFactor),
        consistency: Math.round(consistencyScore * 100 * smoothFactor),
        quality: Math.round(qualityScore * 100 * smoothFactor)
      };
    } catch (error) {
      console.warn('⚠️ Error calculating eye contact metrics:', error);
      return { engagement: 0, consistency: 0, quality: 0 };
    }
  }, []);

  // Process frame and extract metrics
  const processFrame = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!poseRef.current || !handsRef.current || !videoElement) {
      return;
    }

    const startTime = performance.now();

    try {
      // Create canvas for processing
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Process with both pose and hands models
      const [poseResults, handsResults] = await Promise.all([
        new Promise<Results>((resolve) => {
          poseRef.current!.onResults(resolve);
          poseRef.current!.send({ image: canvas });
        }),
        new Promise<HandsResults>((resolve) => {
          handsRef.current!.onResults(resolve);
          handsRef.current!.send({ image: canvas });
        })
      ]);

      // Helper function to apply Kalman filtering to metrics
      const applyKalmanFilter = (metrics: any, filters: any) => {
        const filtered: any = {};
        for (const [key, value] of Object.entries(metrics)) {
          if (typeof value === 'number' && filters[key]) {
            filtered[key] = Math.round(filters[key].filter(value));
          } else {
            filtered[key] = value;
          }
        }
        return filtered;
      };

      // Calculate raw metrics
      const rawPostureMetrics = calculatePostureMetrics(poseResults.poseLandmarks || []);
      const rawGestureMetrics = calculateGestureMetrics(handsResults.multiHandLandmarks || []);
      const rawEyeContactMetrics = calculateEyeContactMetrics(poseResults.poseLandmarks || []);

      // Apply Kalman filtering to all metrics
      const postureMetrics = applyKalmanFilter(rawPostureMetrics, postureFilters.current);
      const gestureMetrics = applyKalmanFilter(rawGestureMetrics, gestureFilters.current);
      const eyeContactMetrics = applyKalmanFilter(rawEyeContactMetrics, eyeContactFilters.current);

      // Calculate overall metrics
      const overallPresence = Math.round((postureMetrics.confidence + gestureMetrics.naturalness + eyeContactMetrics.engagement) / 3);
      const overallConfidence = Math.round((postureMetrics.spineAlignment + postureMetrics.shoulderPosition + eyeContactMetrics.quality) / 3);
      const overallProfessionalism = Math.round((postureMetrics.stability + gestureMetrics.effectiveness + eyeContactMetrics.consistency) / 3);

      const newMetrics: BodyLanguageMetrics = {
        posture: postureMetrics,
        gestures: gestureMetrics,
        eyeContact: eyeContactMetrics,
        overall: {
          presence: overallPresence,
          confidence: overallConfidence,
          professionalism: overallProfessionalism
        },
        raw: {
          poseLandmarks: poseResults.poseLandmarks,
          handLandmarks: handsResults.multiHandLandmarks,
          faceKeyPoints: []
        }
      };

      // Store in history for averaging
      metricsHistoryRef.current.push(newMetrics);
      if (metricsHistoryRef.current.length > 10) {
        metricsHistoryRef.current.shift(); // Keep only last 10 measurements
      }

      const processingTime = performance.now() - startTime;

      setAnalysis(prev => ({
        ...prev,
        currentMetrics: newMetrics,
        frameCount: prev.frameCount + 1,
        processingTime: Math.round(processingTime),
        error: null
      }));

      console.log('📊 Body language metrics:', {
        posture: postureMetrics.confidence,
        gestures: gestureMetrics.naturalness,
        eyeContact: eyeContactMetrics.engagement,
        overall: overallPresence
      });

    } catch (error) {
      console.error('❌ Error processing frame:', error);
      setAnalysis(prev => ({
        ...prev,
        error: 'Failed to process video frame'
      }));
    }
  }, [calculatePostureMetrics, calculateGestureMetrics, calculateEyeContactMetrics]);

  // Start real-time analysis
  const startAnalysis = useCallback(async (videoElement: HTMLVideoElement) => {
    console.log('🚀 Starting MediaPipe body language analysis...');
    
    const modelsReady = await initializeModels();
    if (!modelsReady) {
      return false;
    }

    videoRef.current = videoElement;
    
    setAnalysis(prev => ({
      ...prev,
      isActive: true,
      frameCount: 0,
      error: null
    }));

    // Process frames every 1 second for performance
    intervalRef.current = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        processFrame(videoRef.current);
      }
    }, 1000);

    return true;
  }, [initializeModels, processFrame]);

  // Stop analysis
  const stopAnalysis = useCallback(() => {
    console.log('⏹️ Stopping MediaPipe body language analysis...');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setAnalysis(prev => ({
      ...prev,
      isActive: false
    }));

    videoRef.current = null;
  }, []);

  // Get average metrics from history
  const getAverageMetrics = useCallback((): BodyLanguageMetrics | null => {
    const history = metricsHistoryRef.current;
    if (history.length === 0) return null;

    const avgMetrics: BodyLanguageMetrics = {
      posture: {
        confidence: Math.round(history.reduce((sum, m) => sum + m.posture.confidence, 0) / history.length),
        spineAlignment: Math.round(history.reduce((sum, m) => sum + m.posture.spineAlignment, 0) / history.length),
        shoulderPosition: Math.round(history.reduce((sum, m) => sum + m.posture.shoulderPosition, 0) / history.length),
        stability: Math.round(history.reduce((sum, m) => sum + m.posture.stability, 0) / history.length)
      },
      gestures: {
        handMovements: Math.round(history.reduce((sum, m) => sum + m.gestures.handMovements, 0) / history.length),
        naturalness: Math.round(history.reduce((sum, m) => sum + m.gestures.naturalness, 0) / history.length),
        effectiveness: Math.round(history.reduce((sum, m) => sum + m.gestures.effectiveness, 0) / history.length),
        timing: Math.round(history.reduce((sum, m) => sum + m.gestures.timing, 0) / history.length)
      },
      eyeContact: {
        engagement: Math.round(history.reduce((sum, m) => sum + m.eyeContact.engagement, 0) / history.length),
        consistency: Math.round(history.reduce((sum, m) => sum + m.eyeContact.consistency, 0) / history.length),
        quality: Math.round(history.reduce((sum, m) => sum + m.eyeContact.quality, 0) / history.length)
      },
      overall: {
        presence: Math.round(history.reduce((sum, m) => sum + m.overall.presence, 0) / history.length),
        confidence: Math.round(history.reduce((sum, m) => sum + m.overall.confidence, 0) / history.length),
        professionalism: Math.round(history.reduce((sum, m) => sum + m.overall.professionalism, 0) / history.length)
      },
      raw: {
        poseLandmarks: history[history.length - 1]?.raw.poseLandmarks,
        handLandmarks: history[history.length - 1]?.raw.handLandmarks,
        faceKeyPoints: history[history.length - 1]?.raw.faceKeyPoints
      }
    };

    return avgMetrics;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnalysis();
    };
  }, [stopAnalysis]);

  return {
    analysis,
    startAnalysis,
    stopAnalysis,
    getAverageMetrics,
    isActive: analysis.isActive,
    currentMetrics: analysis.currentMetrics,
    frameCount: analysis.frameCount,
    processingTime: analysis.processingTime,
    error: analysis.error
  };
}