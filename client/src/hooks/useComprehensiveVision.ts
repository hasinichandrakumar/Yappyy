// Comprehensive Computer Vision Hook - Multiple Engine Analysis
import { useState, useRef, useCallback } from 'react';

interface ComprehensiveVisionAnalysis {
  handGestures: {
    leftHand: { confidence: number; gesture: string; landmarks: any[] };
    rightHand: { confidence: number; gesture: string; landmarks: any[] };
  };
  bodyPose: {
    posture: string;
    confidence: number;
    keyPoints: any[];
    postureScore: number;
  };
  facialExpression: {
    emotion: string;
    confidence: number;
    eyeContact: number;
    engagement: number;
  };
  overallPresence: number;
}

interface EngineStatus {
  engines: Array<{
    name: string;
    available: boolean;
  }>;
  primaryEngine: string;
  totalEngines: number;
  availableEngines: number;
}

interface ComprehensiveVisionState {
  isAnalyzing: boolean;
  analysis: ComprehensiveVisionAnalysis | null;
  engineStatus: EngineStatus | null;
  error: string | null;
}

export function useComprehensiveVision() {
  const [state, setState] = useState<ComprehensiveVisionState>({
    isAnalyzing: false,
    analysis: null,
    engineStatus: null,
    error: null
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Capture frame from video for analysis
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return null;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 data URL
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  // Analyze single frame with comprehensive CV stack
  const analyzeFrame = useCallback(async (imageData?: string): Promise<ComprehensiveVisionAnalysis | null> => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const frameData = imageData || captureFrame();
      if (!frameData) {
        throw new Error('No image data available for analysis');
      }

      console.log('🔍 Sending frame for comprehensive CV analysis...');

      const response = await fetch('/api/vision/analyze-comprehensive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: frameData })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      setState(prev => ({
        ...prev,
        analysis: result.analysis,
        engineStatus: result.engineStatus,
        isAnalyzing: false
      }));

      console.log('✅ Comprehensive CV analysis completed:', {
        primaryEngine: result.engineStatus?.primaryEngine,
        overallPresence: result.analysis?.overallPresence
      });

      return result.analysis;
    } catch (error: any) {
      console.error('Comprehensive CV analysis error:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Analysis failed',
        isAnalyzing: false
      }));
      return null;
    }
  }, [captureFrame]);

  // Start continuous analysis
  const startContinuousAnalysis = useCallback((intervalMs: number = 2000) => {
    const interval = setInterval(async () => {
      if (!state.isAnalyzing) {
        await analyzeFrame();
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [analyzeFrame, state.isAnalyzing]);

  // Initialize video stream
  const initializeVideo = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to initialize video stream:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Camera access denied or unavailable' 
      }));
      return false;
    }
  }, []);

  // Stop video stream
  const stopVideo = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  // Reset analysis state
  const reset = useCallback(() => {
    setState({
      isAnalyzing: false,
      analysis: null,
      engineStatus: null,
      error: null
    });
  }, []);

  // Get engine availability summary
  const getEnginesSummary = useCallback(() => {
    if (!state.engineStatus) return 'No engines initialized';
    
    const { availableEngines, totalEngines, primaryEngine } = state.engineStatus;
    return `${availableEngines}/${totalEngines} engines available (Primary: ${primaryEngine})`;
  }, [state.engineStatus]);

  return {
    // State
    isAnalyzing: state.isAnalyzing,
    analysis: state.analysis,
    engineStatus: state.engineStatus,
    error: state.error,
    
    // Actions
    analyzeFrame,
    startContinuousAnalysis,
    initializeVideo,
    stopVideo,
    reset,
    
    // Utilities
    captureFrame,
    getEnginesSummary,
    
    // Refs
    videoRef,
    canvasRef
  };
}