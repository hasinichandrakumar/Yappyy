import { useState, useCallback, useRef } from 'react';

// Advanced Analytics Hook - FREE Implementation
// Integrates advanced speech analytics and enhanced computer vision

interface AdvancedSpeechMetrics {
  sentimentScore: number;
  emotionalTone: 'confident' | 'nervous' | 'excited' | 'calm' | 'uncertain';
  fillerWordCount: number;
  fillerWordDensity: number;
  pacingScore: number;
  clarityScore: number;
  volumeConsistency: number;
  pitchVariation: number;
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

interface EnhancedComputerVisionMetrics {
  posture: {
    spineAlignment: number;
    shoulderLevel: number;
    headPosition: number;
    overallPosture: number;
  };
  gestures: {
    handMovementFrequency: number;
    gestureNaturalness: number;
    openPalmFrequency: number;
    pointingFrequency: number;
    fidgetingScore: number;
  };
  eyeContact: {
    gazeDirection: { x: number; y: number; z: number };
    eyeContactPercentage: number;
    gazeStability: number;
    blinkRate: number;
    gazeDistribution: {
      center: number;
      left: number;
      right: number;
      up: number;
      down: number;
    };
  };
  facialExpression: {
    confidence: number;
    engagement: number;
    authenticity: number;
    nervousness: number;
    microExpressions: {
      eyebrowMovement: number;
      eyeMovement: number;
      mouthExpression: number;
      facialSymmetry: number;
    };
  };
  bodyLanguage: {
    energyLevel: number;
    professionalism: number;
    approachability: number;
    authorityPresence: number;
  };
}

interface MultiModalMetrics {
  speech: AdvancedSpeechMetrics | null;
  computerVision: EnhancedComputerVisionMetrics | null;
  overallScore: number;
  recommendations: string[];
  processingTime: number;
}

export function useAdvancedAnalytics() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speechMetrics, setSpeechMetrics] = useState<AdvancedSpeechMetrics | null>(null);
  const [cvMetrics, setCvMetrics] = useState<EnhancedComputerVisionMetrics | null>(null);
  const [multiModalMetrics, setMultiModalMetrics] = useState<MultiModalMetrics | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  
  // Analytics state tracking
  const audioFeaturesBuffer = useRef<any[]>([]);
  const mediaPipeResultsBuffer = useRef<any[]>([]);

  // Advanced Speech Analytics
  const analyzeSpeech = useCallback(async (transcript: string, audioFeatures?: any[]) => {
    if (!transcript || transcript.length === 0) {
      setSpeechMetrics(null);
      return null;
    }

    try {
      setIsAnalyzing(true);
      setAnalyticsError(null);

      const response = await fetch('/api/advanced-speech-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          audioFeatures: audioFeatures || audioFeaturesBuffer.current,
          sessionId: Date.now().toString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Speech analysis failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.metrics) {
        setSpeechMetrics(data.metrics);
        console.log('🎤 Advanced Speech Analytics Results:', data.metrics);
        return data.metrics;
      } else {
        console.log('ℹ️ No speech analysis available:', data.message);
        setSpeechMetrics(null);
        return null;
      }
    } catch (error) {
      console.error('❌ Speech analysis error:', error);
      setAnalyticsError('Speech analysis failed');
      setSpeechMetrics(null);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Enhanced Computer Vision Analytics
  const analyzeComputerVision = useCallback(async (mediaPipeResults?: any) => {
    if (!mediaPipeResults) {
      setCvMetrics(null);
      return null;
    }

    try {
      setIsAnalyzing(true);
      setAnalyticsError(null);

      const response = await fetch('/api/enhanced-computer-vision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mediaPipeResults,
          sessionId: Date.now().toString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Computer vision analysis failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.metrics) {
        setCvMetrics(data.metrics);
        console.log('👁️ Enhanced Computer Vision Results:', data.metrics);
        return data.metrics;
      } else {
        console.log('ℹ️ No computer vision analysis available:', data.message);
        setCvMetrics(null);
        return null;
      }
    } catch (error) {
      console.error('❌ Computer vision analysis error:', error);
      setAnalyticsError('Computer vision analysis failed');
      setCvMetrics(null);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Real-Time Multi-Modal Analysis
  const analyzeMultiModal = useCallback(async (transcript: string, audioFeatures?: any[], mediaPipeResults?: any) => {
    try {
      setIsAnalyzing(true);
      setAnalyticsError(null);

      const response = await fetch('/api/real-time-multimodal-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          audioFeatures: audioFeatures || audioFeaturesBuffer.current,
          mediaPipeResults: mediaPipeResults || mediaPipeResultsBuffer.current.slice(-1)[0],
          sessionId: Date.now().toString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Multi-modal analysis failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.metrics) {
        setMultiModalMetrics(data.metrics);
        setSpeechMetrics(data.metrics.speech);
        setCvMetrics(data.metrics.computerVision);
        console.log('🚀 Multi-Modal Analytics Results:', {
          overallScore: data.metrics.overallScore,
          processingTime: data.metrics.processingTime,
          recommendations: data.metrics.recommendations.length
        });
        return data.metrics;
      } else {
        console.log('ℹ️ Multi-modal analysis unavailable');
        return null;
      }
    } catch (error) {
      console.error('❌ Multi-modal analysis error:', error);
      setAnalyticsError('Multi-modal analysis failed');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Gesture Recognition
  const analyzeGestures = useCallback(async (handLandmarks?: any) => {
    try {
      const response = await fetch('/api/gesture-recognition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handLandmarks,
          sessionId: Date.now().toString()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('👋 Gesture Recognition Results:', data.analysis);
        return data.analysis;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Gesture recognition error:', error);
      return null;
    }
  }, []);

  // Audio Quality Enhancement
  const enhanceAudioQuality = useCallback(async (audioBuffer?: any) => {
    try {
      const response = await fetch('/api/audio-quality-enhancement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioBuffer,
          sessionId: Date.now().toString()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('🎵 Audio Enhancement Results:', data.metrics);
        return data.metrics;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Audio enhancement error:', error);
      return null;
    }
  }, []);

  // Buffer management for real-time analysis
  const updateAudioFeatures = useCallback((features: any) => {
    audioFeaturesBuffer.current.push(features);
    // Keep only recent features (last 300 = 30 seconds at 10fps)
    if (audioFeaturesBuffer.current.length > 300) {
      audioFeaturesBuffer.current.shift();
    }
  }, []);

  const updateMediaPipeResults = useCallback((results: any) => {
    mediaPipeResultsBuffer.current.push(results);
    // Keep only recent results (last 300 = 30 seconds at 10fps)
    if (mediaPipeResultsBuffer.current.length > 300) {
      mediaPipeResultsBuffer.current.shift();
    }
  }, []);

  // Analytics status helpers
  const hasActiveSpeechAnalytics = speechMetrics !== null;
  const hasActiveComputerVision = cvMetrics !== null;
  const hasMultiModalAnalytics = multiModalMetrics !== null;

  // Performance metrics
  const getAnalyticsPerformance = useCallback(() => {
    return {
      speechAnalytics: hasActiveSpeechAnalytics,
      computerVision: hasActiveComputerVision,
      multiModal: hasMultiModalAnalytics,
      audioFeaturesCount: audioFeaturesBuffer.current.length,
      mediaPipeResultsCount: mediaPipeResultsBuffer.current.length,
      lastProcessingTime: multiModalMetrics?.processingTime || 0,
      overallScore: multiModalMetrics?.overallScore || 0
    };
  }, [hasActiveSpeechAnalytics, hasActiveComputerVision, hasMultiModalAnalytics, multiModalMetrics]);

  // Clear analytics data
  const clearAnalytics = useCallback(() => {
    setSpeechMetrics(null);
    setCvMetrics(null);
    setMultiModalMetrics(null);
    setAnalyticsError(null);
    audioFeaturesBuffer.current = [];
    mediaPipeResultsBuffer.current = [];
  }, []);

  return {
    // Analytics methods
    analyzeSpeech,
    analyzeComputerVision,
    analyzeMultiModal,
    analyzeGestures,
    enhanceAudioQuality,
    
    // Buffer management
    updateAudioFeatures,
    updateMediaPipeResults,
    
    // Analytics results
    speechMetrics,
    cvMetrics,
    multiModalMetrics,
    
    // Status and performance
    isAnalyzing,
    analyticsError,
    hasActiveSpeechAnalytics,
    hasActiveComputerVision,
    hasMultiModalAnalytics,
    getAnalyticsPerformance,
    
    // Utilities
    clearAnalytics
  };
}