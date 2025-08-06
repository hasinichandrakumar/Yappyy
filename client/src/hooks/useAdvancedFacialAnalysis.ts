import { useState, useRef, useCallback, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import * as tf from '@tensorflow/tfjs';
import { loadLayersModel } from '@tensorflow/tfjs-layers';

interface FacialMetrics {
  // Basic facial metrics
  confidence: number;
  emotionScores: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
  
  // Advanced facial metrics
  eyeAspectRatio: number;
  mouthAspectRatio: number;
  eyebrowPosition: number;
  smileIntensity: number;
  
  // Communication metrics
  engagementScore: number;
  naturalness: number;
  expressiveness: number;
  
  // Temporal metrics
  expressionVariability: number;
  expressionConsistency: number;
  microExpressions: Array<{
    type: string;
    timestamp: number;
    duration: number;
    intensity: number;
  }>;
}

interface AnalysisResult {
  metrics: FacialMetrics;
  recommendations: Array<{
    aspect: string;
    observation: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  timestamp: number;
}

export function useAdvancedFacialAnalysis() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<FacialMetrics | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Performance metrics collection
  const { metrics: performanceMetrics, updateMetrics, getCurrentStats, resetMetrics } = useMetricsCollection();
  const [processingStats, setProcessingStats] = useState({
    avgProcessingTime: 0,
    successRate: 0,
    frameRate: 0,
    confidenceScore: 0
  });
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize face-api.js and TensorFlow models
  const initialize = useCallback(async () => {
    try {
      // Load face-api.js models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models')
      ]);
      
      // Load custom TensorFlow.js model for enhanced emotion detection
      modelRef.current = await loadLayersModel('/models/emotion_detection/model.json');
      
      setIsInitialized(true);
      console.log('✅ Advanced facial analysis models loaded successfully');
    } catch (err) {
      setError('Failed to initialize facial analysis models');
      console.error('❌ Model initialization error:', err);
    }
  }, []);
  
  // Calculate eye aspect ratio for blink detection and eye openness
  const calculateEyeAspectRatio = useCallback((landmarks: any) => {
    const getDistance = (p1: any, p2: any) => {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };
    
    // Get eye landmarks
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    
    // Calculate vertical and horizontal distances
    const leftVertical = (getDistance(leftEye[1], leftEye[5]) + getDistance(leftEye[2], leftEye[4])) / 2;
    const leftHorizontal = getDistance(leftEye[0], leftEye[3]);
    const rightVertical = (getDistance(rightEye[1], rightEye[5]) + getDistance(rightEye[2], rightEye[4])) / 2;
    const rightHorizontal = getDistance(rightEye[0], rightEye[3]);
    
    // Return average EAR
    return ((leftVertical / leftHorizontal) + (rightVertical / rightHorizontal)) / 2;
  }, []);
  
  // Analyze facial features and expressions
  const analyzeFacialFeatures = useCallback(async (detection: any) => {
    if (!detection) return null;
    
    const landmarks = detection.landmarks;
    const expressions = detection.expressions;
    
    // Calculate advanced metrics
    const eyeAspectRatio = calculateEyeAspectRatio(landmarks);
    const mouthAspectRatio = calculateMouthAspectRatio(landmarks);
    const eyebrowPosition = calculateEyebrowPosition(landmarks);
    const smileIntensity = calculateSmileIntensity(landmarks);
    
    // Get emotion scores
    const emotionScores = {
      neutral: expressions.neutral,
      happy: expressions.happy,
      sad: expressions.sad,
      angry: expressions.angry,
      fearful: expressions.fearful,
      disgusted: expressions.disgusted,
      surprised: expressions.surprised
    };
    
    // Calculate engagement and expressiveness
    const engagementScore = calculateEngagementScore(eyeAspectRatio, mouthAspectRatio, emotionScores);
    const expressiveness = calculateExpressiveness(emotionScores, smileIntensity);
    const naturalness = calculateNaturalness(landmarks, expressions);
    
    return {
      confidence: detection.detection.score,
      emotionScores,
      eyeAspectRatio,
      mouthAspectRatio,
      eyebrowPosition,
      smileIntensity,
      engagementScore,
      naturalness,
      expressiveness,
      expressionVariability: 0, // Will be calculated over time
      expressionConsistency: 0, // Will be calculated over time
      microExpressions: [] // Will be detected over time
    };
  }, []);
  
  // Generate recommendations based on metrics
  const generateRecommendations = useCallback((metrics: FacialMetrics): Array<{
    aspect: string;
    observation: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }> => {
    const recommendations = [];
    
    // Check engagement
    if (metrics.engagementScore < 0.6) {
      recommendations.push({
        aspect: 'Engagement',
        observation: 'Your engagement level appears low',
        recommendation: 'Try to maintain more consistent eye contact and show more facial expressions',
        priority: 'high'
      });
    }
    
    // Check expressiveness
    if (metrics.expressiveness < 0.5) {
      recommendations.push({
        aspect: 'Expressiveness',
        observation: 'Your facial expressions could be more dynamic',
        recommendation: 'Practice varying your expressions to match your speech content',
        priority: 'medium'
      });
    }
    
    // Check naturalness
    if (metrics.naturalness < 0.7) {
      recommendations.push({
        aspect: 'Naturalness',
        observation: 'Your expressions may appear forced',
        recommendation: 'Focus on relaxing your facial muscles and letting expressions flow naturally',
        priority: 'medium'
      });
    }
    
    return recommendations;
  }, []);
  
  // Start real-time analysis
  const startAnalysis = useCallback(async () => {
    if (!isInitialized || !videoRef.current || isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    analysisIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const frameStartTime = performance.now();
      let frameSuccess = false;
      let detectionConfidence = 0;

      try {
        // Detect face and landmarks
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
          
        const frameEndTime = performance.now();
        const processTime = frameEndTime - frameStartTime;
          
        if (detection) {
          frameSuccess = true;
          detectionConfidence = detection.detection.score;
          
          // Analyze facial features
          const metrics = await analyzeFacialFeatures(detection);
          
          if (metrics) {
            // Update metrics with temporal analysis
            const updatedMetrics = await updateTemporalMetrics(metrics);
            setCurrentMetrics(updatedMetrics);
            
            // Update real-time performance metrics
            updateMetrics({
              processTime,
              confidence: detectionConfidence,
              success: true
            });
            
            // Update processing stats
            const stats = getCurrentStats();
            setProcessingStats({
              avgProcessingTime: stats.avgResponse,
              successRate: stats.successRate,
              frameRate: stats.frameRate,
              confidenceScore: detectionConfidence
            });
            
            // Generate recommendations
            const recommendations = generateRecommendations(updatedMetrics);
            
            // Add to analysis history
            setAnalysisHistory(prev => [...prev, {
              metrics: updatedMetrics,
              recommendations,
              timestamp: Date.now()
            }]);
          }
        }
      } catch (err) {
        console.error('Analysis error:', err);
      }
    }, 100); // Analyze every 100ms for smooth tracking
    
  }, [isInitialized, isAnalyzing, analyzeFacialFeatures, generateRecommendations]);
  
  // Stop analysis
  const stopAnalysis = useCallback(() => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
    setIsAnalyzing(false);
  }, []);
  
  // Calculate temporal metrics
  const updateTemporalMetrics = useCallback(async (currentMetrics: FacialMetrics) => {
    // Get recent history
    const recentHistory = analysisHistory.slice(-30); // Last 3 seconds
    
    if (recentHistory.length === 0) return currentMetrics;
    
    // Calculate expression variability
    const expressionVariability = calculateExpressionVariability(
      recentHistory.map(h => h.metrics.emotionScores)
    );
    
    // Calculate expression consistency
    const expressionConsistency = calculateExpressionConsistency(
      recentHistory.map(h => h.metrics.emotionScores)
    );
    
    // Detect micro expressions
    const microExpressions = detectMicroExpressions(
      recentHistory.map(h => ({
        emotions: h.metrics.emotionScores,
        timestamp: h.timestamp
      }))
    );
    
    return {
      ...currentMetrics,
      expressionVariability,
      expressionConsistency,
      microExpressions
    };
  }, [analysisHistory]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);
  
  return {
    isInitialized,
    isAnalyzing,
    currentMetrics,
    analysisHistory,
    error,
    videoRef,
    canvasRef,
    initialize,
    startAnalysis,
    stopAnalysis
  };
}

// Helper functions for metric calculations
function calculateMouthAspectRatio(landmarks: any) {
  if (!landmarks) return 0;
  
  // Get mouth landmarks
  const upperLip = landmarks.getMouth().slice(13, 16); // Upper lip points
  const lowerLip = landmarks.getMouth().slice(17, 20); // Lower lip points
  const leftCorner = landmarks.getMouth()[0];
  const rightCorner = landmarks.getMouth()[6];
  
  // Calculate vertical and horizontal distances
  const verticalDist = Math.abs(
    (upperLip.reduce((sum: number, p: any) => sum + p.y, 0) / upperLip.length) -
    (lowerLip.reduce((sum: number, p: any) => sum + p.y, 0) / lowerLip.length)
  );
  
  const horizontalDist = Math.abs(rightCorner.x - leftCorner.x);
  
  // Return mouth aspect ratio
  return horizontalDist !== 0 ? verticalDist / horizontalDist : 0;
}

function calculateEyebrowPosition(landmarks: any) {
  if (!landmarks) return 0;
  
  // Get eyebrow and eye landmarks
  const leftEyebrow = landmarks.getLeftEyeBrow();
  const rightEyebrow = landmarks.getRightEyeBrow();
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  
  // Calculate average distances between eyebrows and eyes
  const leftDistance = Math.abs(
    leftEyebrow.reduce((sum: number, p: any) => sum + p.y, 0) / leftEyebrow.length -
    leftEye.reduce((sum: number, p: any) => sum + p.y, 0) / leftEye.length
  );
  
  const rightDistance = Math.abs(
    rightEyebrow.reduce((sum: number, p: any) => sum + p.y, 0) / rightEyebrow.length -
    rightEye.reduce((sum: number, p: any) => sum + p.y, 0) / rightEye.length
  );
  
  // Normalize to 0-1 range (typical eyebrow-eye distance is 0.1-0.3 in normalized coordinates)
  return Math.min(1, ((leftDistance + rightDistance) / 2) / 0.3);
}

function calculateSmileIntensity(landmarks: any) {
  if (!landmarks) return 0;
  
  const mouth = landmarks.getMouth();
  const leftCorner = mouth[0];
  const rightCorner = mouth[6];
  const upperLipCenter = mouth[14];
  
  // Calculate corner elevation relative to center
  const leftElevation = upperLipCenter.y - leftCorner.y;
  const rightElevation = upperLipCenter.y - rightCorner.y;
  
  // Average elevation normalized to 0-1 range (typical smile elevation is 0.05-0.15)
  return Math.min(1, ((leftElevation + rightElevation) / 2) / 0.15);
}

function calculateEngagementScore(
  eyeAspectRatio: number,
  mouthAspectRatio: number,
  emotions: any
) {
  if (!emotions) return 0;
  
  // Weights for different components
  const weights = {
    eyeContact: 0.3,
    expression: 0.4,
    mouthMovement: 0.3
  };
  
  // Calculate eye contact score from eye aspect ratio
  const eyeContactScore = Math.max(0, 1 - Math.abs(eyeAspectRatio - 0.3) / 0.3);
  
  // Calculate expression score (higher for positive emotions)
  const expressionScore = 
    (emotions.happy * 1.0) +
    (emotions.surprised * 0.7) +
    (emotions.neutral * 0.5) -
    (emotions.angry * 0.3) -
    (emotions.sad * 0.3);
  
  // Calculate mouth movement score
  const mouthMovementScore = Math.min(1, mouthAspectRatio / 0.8);
  
  // Weighted combination
  return Math.max(0, Math.min(1,
    eyeContactScore * weights.eyeContact +
    expressionScore * weights.expression +
    mouthMovementScore * weights.mouthMovement
  ));
}

function calculateExpressiveness(emotions: any, smileIntensity: number) {
  if (!emotions) return 0;
  
  // Calculate variance of emotion intensities
  const emotionValues = Object.values(emotions) as number[];
  const mean = emotionValues.reduce((a, b) => a + b, 0) / emotionValues.length;
  const variance = emotionValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / emotionValues.length;
  
  // Combine with smile intensity
  return Math.min(1, (Math.sqrt(variance) * 0.7 + smileIntensity * 0.3));
}

function calculateNaturalness(landmarks: any, expressions: any) {
  if (!landmarks || !expressions) return 0;
  
  // Check for sudden changes in expressions
  const expressionValues = Object.values(expressions) as number[];
  const maxExpressionDiff = Math.max(...expressionValues) - Math.min(...expressionValues);
  
  // Check for asymmetry in facial features
  const asymmetryScore = calculateFacialAsymmetry(landmarks);
  
  // Combine scores (lower values mean more natural)
  const naturalness = 1 - (maxExpressionDiff * 0.5 + asymmetryScore * 0.5);
  
  return Math.max(0, Math.min(1, naturalness));
}

function calculateExpressionVariability(emotionHistory: any[]) {
  if (!emotionHistory || emotionHistory.length < 2) return 0;
  
  // Calculate changes in emotions over time
  const changes = emotionHistory.slice(1).map((curr, i) => {
    const prev = emotionHistory[i];
    return Object.keys(curr).reduce((sum, emotion) => {
      return sum + Math.abs(curr[emotion] - prev[emotion]);
    }, 0);
  });
  
  // Average change normalized to 0-1 range
  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
  return Math.min(1, avgChange / 0.5); // 0.5 is typical maximum change between frames
}

function calculateExpressionConsistency(emotionHistory: any[]) {
  if (!emotionHistory || emotionHistory.length < 2) return 0;
  
  // Find dominant emotion for each frame
  const dominantEmotions = emotionHistory.map(emotions => {
    return Object.entries(emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  });
  
  // Calculate how often dominant emotion stays the same
  let consistencyCount = 0;
  for (let i = 1; i < dominantEmotions.length; i++) {
    if (dominantEmotions[i] === dominantEmotions[i - 1]) {
      consistencyCount++;
    }
  }
  
  return consistencyCount / (dominantEmotions.length - 1);
}

// Helper function for naturalness calculation
function calculateFacialAsymmetry(landmarks: any) {
  if (!landmarks) return 0;
  
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const leftBrow = landmarks.getLeftEyeBrow();
  const rightBrow = landmarks.getRightEyeBrow();
  const mouth = landmarks.getMouth();
  
  // Calculate asymmetry scores for different features
  const eyeAsymmetry = Math.abs(
    calculateFeatureSize(leftEye) - calculateFeatureSize(rightEye)
  );
  
  const browAsymmetry = Math.abs(
    calculateFeatureSize(leftBrow) - calculateFeatureSize(rightBrow)
  );
  
  const mouthAsymmetry = calculateMouthAsymmetry(mouth);
  
  // Combine asymmetry scores
  return (eyeAsymmetry + browAsymmetry + mouthAsymmetry) / 3;
}

function calculateFeatureSize(points: any[]) {
  if (!points || points.length < 2) return 0;
  
  // Calculate bounding box of feature
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  
  return width * height;
}

function calculateMouthAsymmetry(mouthPoints: any[]) {
  if (!mouthPoints || mouthPoints.length < 8) return 0;
  
  const center = mouthPoints[14]; // Upper lip center
  const leftSide = mouthPoints.slice(0, 7);
  const rightSide = mouthPoints.slice(7, 14);
  
  // Calculate average distance from center to points on each side
  const leftAvgDist = leftSide.reduce((sum, p) => 
    sum + Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2)), 0
  ) / leftSide.length;
  
  const rightAvgDist = rightSide.reduce((sum, p) => 
    sum + Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2)), 0
  ) / rightSide.length;
  
  // Return normalized asymmetry score
  return Math.abs(leftAvgDist - rightAvgDist) / ((leftAvgDist + rightAvgDist) / 2);
}

function detectMicroExpressions(emotionHistory: any[]) {
  // Detect rapid changes in expressions
  return []; // Placeholder
}