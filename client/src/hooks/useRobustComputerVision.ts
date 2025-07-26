import { useState, useRef, useCallback, useEffect } from "react";

interface ComputerVisionMetrics {
  posture: number;
  gesture: number;
  eyeContact: number;
  confidence: number;
  engagement: number;
  isActive: boolean;
}

interface ErrorState {
  hasError: boolean;
  errorMessage: string;
  lastErrorTime: number;
}

export function useRobustComputerVision() {
  const [metrics, setMetrics] = useState<ComputerVisionMetrics>({
    posture: 0,
    gesture: 0,
    eyeContact: 0,
    confidence: 0,
    engagement: 0,
    isActive: false
  });

  const [error, setError] = useState<ErrorState>({
    hasError: false,
    errorMessage: '',
    lastErrorTime: 0
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameCount = useRef(0);
  const successCount = useRef(0);

  // Safe error handling
  const handleError = useCallback((errorMessage: string, error?: Error) => {
    console.warn(`🛡️ Computer Vision Warning: ${errorMessage}`, error);
    setError({
      hasError: true,
      errorMessage,
      lastErrorTime: Date.now()
    });
    
    // Reset metrics to safe values
    setMetrics(prev => ({
      ...prev,
      isActive: false
    }));
  }, []);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error.hasError && Date.now() - error.lastErrorTime > 5000) {
      setError({
        hasError: false,
        errorMessage: '',
        lastErrorTime: 0
      });
    }
  }, [error]);

  // Safe facial analysis with robust error handling
  const analyzeFacialData = useCallback(async (imageData: string): Promise<ComputerVisionMetrics | null> => {
    try {
      const response = await fetch('/api/facial-analysis/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageData,
          options: { fallbackMode: true, timeout: 5000 }
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.analysis) {
        successCount.current++;
        return {
          posture: Math.round(result.analysis.posture || 0),
          gesture: Math.round(result.analysis.gesture || 0),
          eyeContact: Math.round(result.analysis.eyeContact || 0),
          confidence: Math.round(result.analysis.confidence || 0),
          engagement: Math.round(result.analysis.engagement || 0),
          isActive: true
        };
      }
      
      return null;
    } catch (error: any) {
      handleError('Facial analysis failed', error);
      return null;
    }
  }, [handleError]);

  // Capture frame safely from video
  const captureFrame = useCallback((): string | null => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        return null;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
        return null;
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64
      return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    } catch (error: any) {
      handleError('Frame capture failed', error);
      return null;
    }
  }, [handleError]);

  // Start computer vision analysis
  const startAnalysis = useCallback(async (video: HTMLVideoElement): Promise<boolean> => {
    try {
      if (!video) {
        handleError('No video element provided');
        return false;
      }

      videoRef.current = video;
      
      // Create canvas if not exists
      if (!canvasRef.current) {
        const canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        canvasRef.current = canvas;
      }

      setIsInitialized(true);
      setIsAnalyzing(true);
      frameCount.current = 0;
      successCount.current = 0;

      // Start periodic analysis every 3 seconds
      intervalRef.current = setInterval(async () => {
        if (!isAnalyzing) return;

        frameCount.current++;
        const frameData = captureFrame();
        
        if (frameData) {
          const result = await analyzeFacialData(frameData);
          if (result) {
            setMetrics(result);
          }
        }
      }, 3000);

      console.log('🛡️ Robust computer vision started successfully');
      return true;
    } catch (error: any) {
      handleError('Failed to start computer vision', error);
      return false;
    }
  }, [isAnalyzing, captureFrame, analyzeFacialData, handleError]);

  // Stop analysis
  const stopAnalysis = useCallback(() => {
    try {
      setIsAnalyzing(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setMetrics(prev => ({
        ...prev,
        isActive: false
      }));

      const successRate = frameCount.current > 0 ? (successCount.current / frameCount.current) * 100 : 0;
      console.log(`🛡️ Computer vision stopped. Success rate: ${successRate.toFixed(1)}% (${successCount.current}/${frameCount.current})`);
    } catch (error: any) {
      handleError('Failed to stop computer vision', error);
    }
  }, [handleError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnalysis();
      
      // Clean up canvas
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, [stopAnalysis]);

  // Get average metrics over time
  const getAverageMetrics = useCallback(() => {
    return {
      posture: metrics.posture,
      gesture: metrics.gesture, 
      eyeContact: metrics.eyeContact,
      confidence: metrics.confidence,
      engagement: metrics.engagement,
      successRate: frameCount.current > 0 ? (successCount.current / frameCount.current) * 100 : 0,
      totalFrames: frameCount.current
    };
  }, [metrics]);

  return {
    metrics,
    error,
    isInitialized,
    isAnalyzing,
    frameCount: frameCount.current,
    successCount: successCount.current,
    startAnalysis,
    stopAnalysis,
    getAverageMetrics,
    captureFrame
  };
}