import { useState, useRef, useCallback } from 'react';

export interface FacialMetrics {
  emotionalExpression: {
    confidence: number;
    engagement: number;
    enthusiasm: number;
    nervousness: number;
    authenticity: number;
  };
  microExpressions: {
    eyebrowMovement: number;
    eyeMovement: number;
    mouthExpression: number;
    facialSymmetry: number;
  };
  communicationSignals: {
    eyeContactQuality: number;
    gazeFocus: number;
    blinkRate: number;
    facialStability: number;
  };
  overallPresence: {
    charisma: number;
    trustworthiness: number;
    professionalism: number;
    approachability: number;
  };
}

export interface FacialAnalysisResult {
  timestamp: number;
  facialMetrics: FacialMetrics;
  insights: string[];
  recommendations: string[];
  confidence: number;
}

export function useFacialAnalysis() {
  const [isActive, setIsActive] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<FacialAnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<FacialAnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return null;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64 image data
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const analyzeFacialFrame = useCallback(async (imageData: string): Promise<FacialAnalysisResult | null> => {
    try {
      let clientDetection = null;
      
      // Try client-side Face-api.js first for maximum accuracy
      try {
        const { clientFaceDetection, convertClientDetectionToMetrics } = await import('@/lib/face-detection');
        
        if (videoRef.current && clientFaceDetection.isReady()) {
          clientDetection = await clientFaceDetection.detectFace(videoRef.current);
        }
      } catch (clientError) {
        console.warn('Client-side face detection failed, continuing with server-side only:', clientError);
      }

      // Send both client detection and image data to backend
      const response = await fetch('/api/facial-analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          clientDetection: clientDetection,
          sessionId: Date.now().toString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // If we have client-side detection, enhance the results
        if (clientDetection) {
          try {
            const { convertClientDetectionToMetrics } = await import('@/lib/face-detection');
            const clientMetrics = convertClientDetectionToMetrics(clientDetection);
            
            // Blend client and server results for maximum accuracy
            if (data.analysis?.facialMetrics) {
              data.analysis.facialMetrics.emotionalExpression.confidence = Math.max(
                data.analysis.facialMetrics.emotionalExpression.confidence,
                clientMetrics.confidence
              );
              data.analysis.facialMetrics.emotionalExpression.engagement = Math.max(
                data.analysis.facialMetrics.emotionalExpression.engagement,
                clientMetrics.engagement
              );
            }
          } catch (enhancementError) {
            // Silently ignore enhancement errors to reduce console noise
          }
        }
        
        return data.analysis;
      } else {
        // Silently handle failed requests to reduce console noise
        return null;
      }
    } catch (error) {
      // Silently handle analysis errors to reduce console noise
      return null;
    }
  }, []);

  const startFacialAnalysis = useCallback(async (videoElement: HTMLVideoElement, analysisInterval: number = 3000) => {
    if (isActive) return;
    
    try {
      if (videoRef.current !== videoElement) {
        (videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = videoElement;
      }
      
      // Create hidden canvas for frame capture
      if (!canvasRef.current) {
        const canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
        (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = canvas;
      }
      
      setIsActive(true);
      setError(null);
      
      // Starting facial analysis
      
      // Start periodic facial analysis
      intervalRef.current = setInterval(async () => {
        const frameData = captureFrame();
        if (frameData) {
          const analysis = await analyzeFacialFrame(frameData);
          if (analysis) {
            setCurrentAnalysis(analysis);
            setAnalysisHistory(prev => [...prev.slice(-20), analysis]); // Keep last 20 analyses
            
            // Facial analysis update completed
          }
        }
      }, analysisInterval);
      
    } catch (error) {
      console.error('Failed to start facial analysis:', error);
      setError('Failed to initialize facial analysis');
      setIsActive(false);
    }
  }, [isActive, captureFrame, analyzeFacialFrame]);

  const stopFacialAnalysis = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Clean up hidden canvas
    if (canvasRef.current && canvasRef.current.parentNode) {
      canvasRef.current.parentNode.removeChild(canvasRef.current);
      (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current = null;
    }
    
    setIsActive(false);
    // Facial analysis stopped
  }, []);

  const getAverageFacialMetrics = useCallback((): FacialMetrics | null => {
    if (analysisHistory.length === 0) return null;
    
    const totalMetrics = analysisHistory.reduce((acc, analysis) => {
      const metrics = analysis.facialMetrics;
      return {
        emotionalExpression: {
          confidence: acc.emotionalExpression.confidence + metrics.emotionalExpression.confidence,
          engagement: acc.emotionalExpression.engagement + metrics.emotionalExpression.engagement,
          enthusiasm: acc.emotionalExpression.enthusiasm + metrics.emotionalExpression.enthusiasm,
          nervousness: acc.emotionalExpression.nervousness + metrics.emotionalExpression.nervousness,
          authenticity: acc.emotionalExpression.authenticity + metrics.emotionalExpression.authenticity
        },
        microExpressions: {
          eyebrowMovement: acc.microExpressions.eyebrowMovement + metrics.microExpressions.eyebrowMovement,
          eyeMovement: acc.microExpressions.eyeMovement + metrics.microExpressions.eyeMovement,
          mouthExpression: acc.microExpressions.mouthExpression + metrics.microExpressions.mouthExpression,
          facialSymmetry: acc.microExpressions.facialSymmetry + metrics.microExpressions.facialSymmetry
        },
        communicationSignals: {
          eyeContactQuality: acc.communicationSignals.eyeContactQuality + metrics.communicationSignals.eyeContactQuality,
          gazeFocus: acc.communicationSignals.gazeFocus + metrics.communicationSignals.gazeFocus,
          blinkRate: acc.communicationSignals.blinkRate + metrics.communicationSignals.blinkRate,
          facialStability: acc.communicationSignals.facialStability + metrics.communicationSignals.facialStability
        },
        overallPresence: {
          charisma: acc.overallPresence.charisma + metrics.overallPresence.charisma,
          trustworthiness: acc.overallPresence.trustworthiness + metrics.overallPresence.trustworthiness,
          professionalism: acc.overallPresence.professionalism + metrics.overallPresence.professionalism,
          approachability: acc.overallPresence.approachability + metrics.overallPresence.approachability
        }
      };
    }, {
      emotionalExpression: { confidence: 0, engagement: 0, enthusiasm: 0, nervousness: 0, authenticity: 0 },
      microExpressions: { eyebrowMovement: 0, eyeMovement: 0, mouthExpression: 0, facialSymmetry: 0 },
      communicationSignals: { eyeContactQuality: 0, gazeFocus: 0, blinkRate: 0, facialStability: 0 },
      overallPresence: { charisma: 0, trustworthiness: 0, professionalism: 0, approachability: 0 }
    });
    
    const count = analysisHistory.length;
    
    return {
      emotionalExpression: {
        confidence: Math.round(totalMetrics.emotionalExpression.confidence / count),
        engagement: Math.round(totalMetrics.emotionalExpression.engagement / count),
        enthusiasm: Math.round(totalMetrics.emotionalExpression.enthusiasm / count),
        nervousness: Math.round(totalMetrics.emotionalExpression.nervousness / count),
        authenticity: Math.round(totalMetrics.emotionalExpression.authenticity / count)
      },
      microExpressions: {
        eyebrowMovement: Math.round(totalMetrics.microExpressions.eyebrowMovement / count),
        eyeMovement: Math.round(totalMetrics.microExpressions.eyeMovement / count),
        mouthExpression: Math.round(totalMetrics.microExpressions.mouthExpression / count),
        facialSymmetry: Math.round(totalMetrics.microExpressions.facialSymmetry / count)
      },
      communicationSignals: {
        eyeContactQuality: Math.round(totalMetrics.communicationSignals.eyeContactQuality / count),
        gazeFocus: Math.round(totalMetrics.communicationSignals.gazeFocus / count),
        blinkRate: Math.round(totalMetrics.communicationSignals.blinkRate / count),
        facialStability: Math.round(totalMetrics.communicationSignals.facialStability / count)
      },
      overallPresence: {
        charisma: Math.round(totalMetrics.overallPresence.charisma / count),
        trustworthiness: Math.round(totalMetrics.overallPresence.trustworthiness / count),
        professionalism: Math.round(totalMetrics.overallPresence.professionalism / count),
        approachability: Math.round(totalMetrics.overallPresence.approachability / count)
      }
    };
  }, [analysisHistory]);

  const resetAnalysis = useCallback(() => {
    setCurrentAnalysis(null);
    setAnalysisHistory([]);
    setError(null);
  }, []);

  return {
    isActive,
    currentAnalysis,
    analysisHistory,
    error,
    startFacialAnalysis,
    stopFacialAnalysis,
    getAverageFacialMetrics,
    resetAnalysis
  };
}