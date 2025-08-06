import React from 'react';
import { useMetricsProcessor } from '../hooks/useMetricsProcessor';

interface MetricsDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function MetricsDisplay({ videoRef }: MetricsDisplayProps) {
  const { metrics, startProcessing, stopProcessing, isProcessing, error } = useMetricsProcessor();

  React.useEffect(() => {
    if (videoRef.current) {
      startProcessing(videoRef.current);
    }
    return () => {
      stopProcessing();
    };
  }, [videoRef]);

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Real-time Metrics</h2>
      
      {/* WPM */}
      <div className="mb-4">
        <label className="font-medium">Words Per Minute:</label>
        <span className="ml-2">
          {metrics.wpm !== null ? Math.round(metrics.wpm) : 'Calculating...'}
        </span>
      </div>

      {/* Eye Contact */}
      <div className="mb-4">
        <label className="font-medium">Eye Contact:</label>
        <span className="ml-2">
          {metrics.eyeContact !== null 
            ? `${(metrics.eyeContact * 100).toFixed(1)}%` 
            : 'Calculating...'}
        </span>
      </div>

      {/* Confidence */}
      <div className="mb-4">
        <label className="font-medium">Confidence:</label>
        <span className="ml-2">
          {metrics.confidence !== null 
            ? `${(metrics.confidence * 100).toFixed(1)}%` 
            : 'Calculating...'}
        </span>
      </div>

      {/* Filler Words */}
      <div className="mb-4">
        <label className="font-medium">Filler Words:</label>
        {metrics.fillerWords.length > 0 ? (
          <ul className="ml-4 list-disc">
            {metrics.fillerWords.map(({ word, count }) => (
              <li key={word}>
                "{word}": {count} times
              </li>
            ))}
          </ul>
        ) : (
          <span className="ml-2">None detected</span>
        )}
      </div>

      {/* Posture */}
      <div className="mb-4">
        <label className="font-medium">Posture:</label>
        <span className="ml-2">
          {metrics.posture !== null 
            ? `${(metrics.posture * 100).toFixed(1)}%` 
            : 'Calculating...'}
        </span>
      </div>

      {/* Voice Modulation */}
      <div className="mb-4">
        <label className="font-medium">Voice Modulation:</label>
        <span className="ml-2">
          {metrics.voiceModulation !== null 
            ? `${(metrics.voiceModulation * 100).toFixed(1)}%` 
            : 'Calculating...'}
        </span>
      </div>

      {/* Processing Status */}
      <div className="text-sm text-gray-500">
        Status: {isProcessing ? 'Processing...' : 'Idle'}
      </div>
    </div>
  );
}