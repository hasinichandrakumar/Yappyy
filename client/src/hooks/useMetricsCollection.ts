import { useState, useRef, useCallback, useEffect } from 'react';

interface MetricsData {
  processed: number;
  avgResponse: string;
  successRate: string;
  frameRate: number;
  confidence: number;
  timestamp: number;
}

export function useMetricsCollection() {
  const [metrics, setMetrics] = useState<MetricsData[]>([]);
  const frameCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const processedFramesRef = useRef(0);
  const successfulFramesRef = useRef(0);
  const responseTimesRef = useRef<number[]>([]);

  // Calculate real metrics based on actual processing
  const updateMetrics = useCallback((frameData: {
    processTime: number,
    confidence: number,
    success: boolean
  }) => {
    frameCountRef.current++;
    processedFramesRef.current++;
    
    if (frameData.success) {
      successfulFramesRef.current++;
    }
    
    responseTimesRef.current.push(frameData.processTime);
    if (responseTimesRef.current.length > 100) {
      responseTimesRef.current.shift(); // Keep last 100 measurements
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - startTimeRef.current;
    
    // Calculate real metrics
    const frameRate = (frameCountRef.current / elapsedTime) * 1000;
    const avgResponse = responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length;
    const successRate = (successfulFramesRef.current / processedFramesRef.current) * 100;

    setMetrics(prev => [...prev, {
      processed: processedFramesRef.current,
      avgResponse: `${avgResponse.toFixed(2)}ms`,
      successRate: `${successRate.toFixed(1)}%`,
      frameRate: parseFloat(frameRate.toFixed(1)),
      confidence: frameData.confidence,
      timestamp: currentTime
    }]);

    // Reset counters every 5 minutes to avoid overflow
    if (elapsedTime > 300000) {
      startTimeRef.current = currentTime;
      frameCountRef.current = 0;
      processedFramesRef.current = 0;
      successfulFramesRef.current = 0;
    }
  }, []);

  // Get current performance stats
  const getCurrentStats = useCallback(() => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTimeRef.current;
    
    return {
      frameRate: (frameCountRef.current / elapsedTime) * 1000,
      avgResponse: responseTimesRef.current.length > 0 
        ? responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length
        : 0,
      successRate: processedFramesRef.current > 0
        ? (successfulFramesRef.current / processedFramesRef.current) * 100
        : 0,
      totalProcessed: processedFramesRef.current
    };
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    setMetrics([]);
    frameCountRef.current = 0;
    startTimeRef.current = Date.now();
    processedFramesRef.current = 0;
    successfulFramesRef.current = 0;
    responseTimesRef.current = [];
  }, []);

  return {
    metrics,
    updateMetrics,
    getCurrentStats,
    resetMetrics
  };
}