// React Hook for Real-Time Eye Contact Detection
import { useState, useRef, useCallback, useEffect } from 'react';
import RealTimeEyeContact, { EyeContactMetrics, EyeContactCalibration } from '../utils/real-time-eye-contact';

export interface UseRealTimeEyeContactReturn {
  // Current metrics
  eyeContactPercentage: number;
  gazeDirection: { x: number; y: number; z: number };
  gazeStability: number;
  blinkRate: number;
  confidence: number;
  isLookingAtCamera: boolean;
  calibrationStatus: 'uncalibrated' | 'calibrating' | 'calibrated';
  
  // Control methods
  startDetection: (video: HTMLVideoElement) => Promise<void>;
  stopDetection: () => void;
  startCalibration: () => void;
  completeCalibration: () => void;
  
  // Status
  isActive: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Raw metrics for advanced usage
  currentMetrics: EyeContactMetrics;
  calibration: EyeContactCalibration;
}

export function useRealTimeEyeContact(): UseRealTimeEyeContactReturn {
  const [metrics, setMetrics] = useState<EyeContactMetrics>({
    eyeContactPercentage: 0,
    gazeDirection: { x: 0.5, y: 0.5, z: 0.5 },
    gazeStability: 0,
    blinkRate: 0,
    confidence: 0,
    isLookingAtCamera: false,
    calibrationStatus: 'uncalibrated'
  });
  
  const [isActive, setIsActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calibration, setCalibration] = useState<EyeContactCalibration>({
    centerGaze: { x: 0.5, y: 0.5, z: 0.5 },
    naturalBlinkRate: 0,
    gazeVariability: 0.1,
    isCalibrated: false
  });
  
  const eyeContactRef = useRef<RealTimeEyeContact | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Initialize eye contact detector
  useEffect(() => {
    const initializeEyeContact = async () => {
      try {
        eyeContactRef.current = new RealTimeEyeContact();
        
        // Safely override the updateMetrics method if it exists
        if (eyeContactRef.current && typeof eyeContactRef.current['updateMetrics'] === 'function') {
          const originalUpdateMetrics = eyeContactRef.current['updateMetrics'].bind(eyeContactRef.current);
          eyeContactRef.current['updateMetrics'] = (newMetrics: EyeContactMetrics) => {
            try {
              originalUpdateMetrics(newMetrics);
              setMetrics(newMetrics);
              
              // Update calibration status
              if (newMetrics.calibrationStatus === 'calibrated') {
                setCalibration(prev => ({ ...prev, isCalibrated: true }));
              }
            } catch (updateError) {
              console.warn('Eye contact metrics update failed:', updateError);
            }
          };
        }
        
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        console.warn('Eye contact detection initialization had issues:', err);
        setError(null); // Don't set error as this is non-critical
        setIsInitialized(false);
      }
    };
    
    initializeEyeContact().catch(err => {
      console.warn('Async eye contact initialization failed:', err);
    });
    
    // Cleanup on unmount
    return () => {
      try {
        if (eyeContactRef.current) {
          eyeContactRef.current.stopDetection();
        }
      } catch (cleanupError) {
        console.warn('Eye contact cleanup failed:', cleanupError);
      }
    };
  }, []);
  
  // Start eye contact detection
  const startDetection = useCallback(async (video: HTMLVideoElement) => {
    if (!eyeContactRef.current || !isInitialized) {
      setError('Eye contact detection not initialized');
      return;
    }
    
    try {
      videoRef.current = video;
      await eyeContactRef.current.startDetection(video);
      setIsActive(true);
      setError(null);
      
      console.log('👁️ Real-time eye contact detection started');
    } catch (err) {
      console.error('❌ Failed to start eye contact detection:', err);
      setError('Failed to start eye contact detection');
      setIsActive(false);
    }
  }, [isInitialized]);
  
  // Stop eye contact detection
  const stopDetection = useCallback(() => {
    if (eyeContactRef.current) {
      eyeContactRef.current.stopDetection();
      setIsActive(false);
      videoRef.current = null;
      console.log('👁️ Eye contact detection stopped');
    }
  }, []);
  
  // Start calibration
  const startCalibration = useCallback(() => {
    if (!eyeContactRef.current) {
      setError('Eye contact detection not initialized');
      return;
    }
    
    try {
      eyeContactRef.current.startCalibration();
      setMetrics(prev => ({ ...prev, calibrationStatus: 'calibrating' }));
      setError(null);
      
      console.log('🎯 Eye contact calibration started');
    } catch (err) {
      console.error('❌ Failed to start calibration:', err);
      setError('Failed to start calibration');
    }
  }, []);
  
  // Complete calibration
  const completeCalibration = useCallback(() => {
    if (!eyeContactRef.current) {
      setError('Eye contact detection not initialized');
      return;
    }
    
    try {
      eyeContactRef.current.completeCalibration();
      setMetrics(prev => ({ ...prev, calibrationStatus: 'calibrated' }));
      setCalibration(prev => ({ ...prev, isCalibrated: true }));
      setError(null);
      
      console.log('✅ Eye contact calibration completed');
    } catch (err) {
      console.error('❌ Failed to complete calibration:', err);
      setError('Failed to complete calibration');
    }
  }, []);
  
  // Get current metrics
  const getCurrentMetrics = useCallback((): EyeContactMetrics => {
    if (!eyeContactRef.current) {
      return metrics;
    }
    return eyeContactRef.current.getCurrentMetrics();
  }, [metrics]);
  
  return {
    // Current metrics
    eyeContactPercentage: metrics.eyeContactPercentage,
    gazeDirection: metrics.gazeDirection,
    gazeStability: metrics.gazeStability,
    blinkRate: metrics.blinkRate,
    confidence: metrics.confidence,
    isLookingAtCamera: metrics.isLookingAtCamera,
    calibrationStatus: metrics.calibrationStatus,
    
    // Control methods
    startDetection,
    stopDetection,
    startCalibration,
    completeCalibration,
    
    // Status
    isActive,
    isInitialized,
    error,
    
    // Raw metrics
    currentMetrics: metrics,
    calibration
  };
}

export default useRealTimeEyeContact;


























