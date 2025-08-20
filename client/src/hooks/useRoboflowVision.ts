// Roboflow Computer Vision React Hook - Enhanced Body Language Analysis
import { useState, useRef, useCallback } from 'react';

interface RoboflowAnalysis {
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

interface RoboflowVisionState {
  isAnalyzing: boolean;
  analysis: RoboflowAnalysis | null;
  frameCount: number;
  processingTime: number;
  error: string | null;
}

export function useRoboflowVision() {
  const [state, setState] = useState<RoboflowVisionState>({
    isAnalyzing: false,
    analysis: null,
    frameCount: 0,
    processingTime: 0,
    error: null
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize video stream for real-time analysis
  const initializeVideoStream = useCallback(async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia is not supported, skipping video stream initialization');
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' 
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      return true;
    } catch (error) {
      console.warn('Video stream initialization failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: null // Don't set error as this is often due to permissions
      }));
      return false;
    }
  }, []);

  // Capture frame from video stream
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return null;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  // Analyze single frame with Roboflow
  const analyzeSingleFrame = useCallback(async (frameData?: string): Promise<RoboflowAnalysis | null> => {
    try {
      const imageData = frameData || captureFrame();
      if (!imageData) return null;

      setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

      const response = await fetch('/api/roboflow/analyze-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData })
      });

      if (!response.ok) {
        console.warn(`Roboflow analysis failed with status: ${response.status}`);
        setState(prev => ({ ...prev, isAnalyzing: false }));
        return null;
      }

      const result = await response.json();
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        analysis: result.analysis,
        processingTime: result.processingTime,
        frameCount: prev.frameCount + 1
      }));

      return result.analysis;
    } catch (error: any) {
      console.warn('Frame analysis had issues:', error);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: null // Don't set error state for non-critical failures
      }));
      return null;
    }
  }, [captureFrame]);

  // Start real-time analysis stream
  const startRealTimeAnalysis = useCallback(async (intervalMs: number = 2000) => {
    // If video ref already has a stream (from practice page), use it directly
    if (videoRef.current && videoRef.current.srcObject) {
      console.log('🤖 Using existing video stream for Roboflow analysis');
    } else {
      // Otherwise initialize our own stream
      const streamInitialized = await initializeVideoStream();
      if (!streamInitialized) return false;
    }

    // Wait for video to be ready
    if (videoRef.current) {
      await new Promise(resolve => {
        const video = videoRef.current!;
        if (video.readyState >= 2) {
          resolve(null);
        } else {
          video.addEventListener('loadeddata', () => resolve(null), { once: true });
        }
      });
    }

    // Start periodic frame analysis
    intervalRef.current = setInterval(async () => {
      await analyzeSingleFrame();
    }, intervalMs);

    console.log('🤖 Roboflow real-time analysis started');
    return true;
  }, [initializeVideoStream, analyzeSingleFrame]);

  // Stop real-time analysis
  const stopRealTimeAnalysis = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isAnalyzing: false,
      frameCount: 0
    }));

    console.log('🤖 Roboflow real-time analysis stopped');
  }, []);

  // Batch analyze multiple frames for comprehensive assessment
  const analyzeBatch = useCallback(async (frames: string[]): Promise<RoboflowAnalysis | null> => {
    try {
      setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

      const response = await fetch('/api/roboflow/body-language-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          videoFrames: frames,
          sessionContext: {
            timestamp: new Date().toISOString(),
            analysisType: 'batch'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Batch analysis failed: ${response.status}`);
      }

      const result = await response.json();
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        analysis: result.analysis,
        processingTime: result.processingTime,
        frameCount: result.frameCount
      }));

      console.log(`🤖 Roboflow batch analysis: ${result.frameCount} frames in ${result.processingTime}ms`);
      return result.analysis;
    } catch (error: any) {
      console.error('Batch analysis failed:', error);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: error?.message || 'Batch analysis failed'
      }));
      return null;
    }
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/roboflow/performance');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      
      const result = await response.json();
      return result.metrics;
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      return null;
    }
  }, []);

  // Clean up resources
  const cleanup = useCallback(() => {
    stopRealTimeAnalysis();
    setState({
      isAnalyzing: false,
      analysis: null,
      frameCount: 0,
      processingTime: 0,
      error: null
    });
  }, [stopRealTimeAnalysis]);

  return {
    // State
    isAnalyzing: state.isAnalyzing,
    analysis: state.analysis,
    frameCount: state.frameCount,
    processingTime: state.processingTime,
    error: state.error,
    
    // Refs for video components
    videoRef,
    canvasRef,
    
    // Methods
    initializeVideoStream,
    analyzeSingleFrame,
    startRealTimeAnalysis,
    stopRealTimeAnalysis,
    analyzeBatch,
    getPerformanceMetrics,
    cleanup
  };
}