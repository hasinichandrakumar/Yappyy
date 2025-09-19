// Enhanced WebGazer Hook - Proper error handling and graceful fallbacks
import { useState, useRef, useCallback, useEffect } from 'react';

interface EyeTrackingResult {
  x: number;
  y: number;
  isLookingAtTarget: boolean;
  confidence: number;
  isWorking: boolean;
  error?: string;
}

interface WebGazerOptions {
  targetRegion?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  calibrationPoints?: number;
}

export function useEnhancedWebGazer(options: WebGazerOptions = {}) {
  const [eyeTrackingResult, setEyeTrackingResult] = useState<EyeTrackingResult>({
    x: 0,
    y: 0,
    isLookingAtTarget: false,
    confidence: 0,
    isWorking: false
  });
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalibrated, setIsCalibrated] = useState(false);
  
  const webgazer = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isProcessing = useRef(false);
  const targetRegion = useRef(options.targetRegion || {
    x: 0.3,
    y: 0.3,
    width: 0.4,
    height: 0.4
  });

  const initializeWebGazer = useCallback(async () => {
    if (isLoading || isInitialized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('👁️ Initializing Enhanced WebGazer...');
      
      // Try to load WebGazer
      const webgazerModule = await import('webgazer');
      
      if (!webgazerModule || !webgazerModule.default) {
        throw new Error('WebGazer not available');
      }
      
      const webgazerInstance = webgazerModule.default;
      
      // Initialize WebGazer with error handling
      await webgazerInstance.init();
      
      // Set up event handlers
      webgazerInstance.showVideoPreview(true);
      webgazerInstance.showPredictionPoints(true);
      
      // Set up gaze prediction callback
      webgazerInstance.setGazeListener((data: any, clock: any) => {
        if (isProcessing.current || !data) return;
        
        isProcessing.current = true;
        
        try {
          const x = data.x || 0;
          const y = data.y || 0;
          
          // Check if looking at target region
          const isLookingAtTarget = checkIfLookingAtTarget(x, y);
          
          // Calculate confidence based on data quality
          const confidence = calculateConfidence(data);
          
          setEyeTrackingResult({
            x,
            y,
            isLookingAtTarget,
            confidence,
            isWorking: true
          });
          
        } catch (error) {
          console.warn('🔧 WebGazer prediction processing failed:', error);
        } finally {
          isProcessing.current = false;
        }
      });
      
      webgazer.current = webgazerInstance;
      setIsInitialized(true);
      setEyeTrackingResult(prev => ({ ...prev, isWorking: true }));
      console.log('✅ Enhanced WebGazer initialized successfully');
      
    } catch (error: any) {
      console.warn('🔧 WebGazer initialization failed, using fallback:', error);
      setError(error.message);
      setEyeTrackingResult(prev => ({ ...prev, isWorking: false, error: error.message }));
      
      // Set up fallback analysis
      setupFallbackEyeTracking();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isInitialized]);

  const checkIfLookingAtTarget = useCallback((x: number, y: number) => {
    const target = targetRegion.current;
    const normalizedX = x / window.innerWidth;
    const normalizedY = y / window.innerHeight;
    
    return (
      normalizedX >= target.x &&
      normalizedX <= target.x + target.width &&
      normalizedY >= target.y &&
      normalizedY <= target.y + target.height
    );
  }, []);

  const calculateConfidence = useCallback((data: any) => {
    // Simple confidence calculation based on data quality
    if (!data || typeof data.x !== 'number' || typeof data.y !== 'number') {
      return 0;
    }
    
    // Check if coordinates are reasonable
    const isReasonable = data.x >= 0 && data.x <= window.innerWidth && 
                        data.y >= 0 && data.y <= window.innerHeight;
    
    return isReasonable ? 0.8 : 0.3;
  }, []);

  const setupFallbackEyeTracking = useCallback(() => {
    console.log('🔧 Setting up fallback eye tracking...');
    
    // Simulate eye tracking with random movement
    const fallbackInterval = setInterval(() => {
      if (!isInitialized) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const isLookingAtTarget = checkIfLookingAtTarget(x, y);
        
        setEyeTrackingResult({
          x,
          y,
          isLookingAtTarget,
          confidence: 0.5,
          isWorking: false
        });
      } else {
        clearInterval(fallbackInterval);
      }
    }, 100);

    return () => clearInterval(fallbackInterval);
  }, [isInitialized, checkIfLookingAtTarget]);

  const calibrate = useCallback(async (calibrationPoints: number = 9) => {
    if (!webgazer.current || !isInitialized) {
      console.warn('🔧 WebGazer not initialized, cannot calibrate');
      return false;
    }
    
    try {
      console.log('🎯 Starting WebGazer calibration...');
      
      // Start calibration
      await webgazer.current.begin();
      
      // Wait for calibration to complete
      await new Promise((resolve) => {
        const checkCalibration = () => {
          if (webgazer.current.isReady()) {
            setIsCalibrated(true);
            console.log('✅ WebGazer calibration completed');
            resolve(true);
          } else {
            setTimeout(checkCalibration, 1000);
          }
        };
        checkCalibration();
      });
      
      return true;
    } catch (error) {
      console.warn('🔧 WebGazer calibration failed:', error);
      return false;
    }
  }, [isInitialized]);

  const startEyeTracking = useCallback(async (videoElement?: HTMLVideoElement) => {
    if (!videoElement) {
      setError('Video element is required');
      return;
    }

    videoRef.current = videoElement;
    
    await initializeWebGazer();
    
    if (webgazer.current && isInitialized) {
      try {
        await webgazer.current.begin();
        console.log('✅ WebGazer eye tracking started');
      } catch (error) {
        console.warn('🔧 WebGazer start failed:', error);
        setupFallbackEyeTracking();
      }
    }
  }, [initializeWebGazer, isInitialized, setupFallbackEyeTracking]);

  const stopEyeTracking = useCallback(() => {
    if (webgazer.current) {
      try {
        webgazer.current.end();
        console.log('✅ WebGazer eye tracking stopped');
      } catch (error) {
        console.warn('🔧 WebGazer stop failed:', error);
      }
    }
    
    setEyeTrackingResult(prev => ({ ...prev, isWorking: false }));
  }, []);

  const setTargetRegion = useCallback((region: { x: number; y: number; width: number; height: number }) => {
    targetRegion.current = region;
  }, []);

  const cleanup = useCallback(() => {
    stopEyeTracking();
    
    if (webgazer.current) {
      try {
        webgazer.current.end();
        console.log('✅ WebGazer cleaned up');
      } catch (error) {
        console.warn('🔧 WebGazer cleanup failed:', error);
      }
    }
    
    webgazer.current = null;
    videoRef.current = null;
    setIsInitialized(false);
    setIsCalibrated(false);
    setError(null);
  }, [stopEyeTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    eyeTrackingResult,
    isInitialized,
    isLoading,
    isCalibrated,
    error,
    startEyeTracking,
    stopEyeTracking,
    calibrate,
    setTargetRegion,
    cleanup
  };
}
