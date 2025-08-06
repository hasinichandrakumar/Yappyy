import React, { useEffect, useState } from 'react';
import { useMetricsProcessor } from '../hooks/useMetricsProcessor';

interface LiveFeedbackBoxProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

interface FeedbackMessage {
  type: 'wpm' | 'fillerWords' | 'eyeContact' | 'confidence';
  message: string;
  severity: 'success' | 'warning' | 'error';
  timestamp: number;
}

export function LiveFeedbackBox({ videoRef }: LiveFeedbackBoxProps) {
  const { metrics, startProcessing, stopProcessing } = useMetricsProcessor();
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
  
  useEffect(() => {
    if (videoRef.current) {
      startProcessing(videoRef.current);
    }
    return () => stopProcessing();
  }, [videoRef]);

  // Generate feedback based on metrics
  useEffect(() => {
    const newMessages: FeedbackMessage[] = [];
    const now = Date.now();

    // WPM Feedback
    if (metrics.wpm !== null) {
      if (metrics.wpm < 120) {
        newMessages.push({
          type: 'wpm',
          message: 'Try speaking a bit faster to maintain engagement',
          severity: 'warning',
          timestamp: now
        });
      } else if (metrics.wpm > 160) {
        newMessages.push({
          type: 'wpm',
          message: 'Slow down slightly for better clarity',
          severity: 'warning',
          timestamp: now
        });
      } else {
        newMessages.push({
          type: 'wpm',
          message: 'Great speaking pace!',
          severity: 'success',
          timestamp: now
        });
      }
    }

    // Eye Contact Feedback
    if (metrics.eyeContact !== null) {
      if (metrics.eyeContact < 0.6) {
        newMessages.push({
          type: 'eyeContact',
          message: 'Try to maintain more eye contact with the camera',
          severity: 'warning',
          timestamp: now
        });
      } else if (metrics.eyeContact > 0.8) {
        newMessages.push({
          type: 'eyeContact',
          message: 'Excellent eye contact!',
          severity: 'success',
          timestamp: now
        });
      }
    }

    // Confidence Feedback
    if (metrics.confidence !== null) {
      if (metrics.confidence < 0.6) {
        newMessages.push({
          type: 'confidence',
          message: 'Speak with more conviction and maintain good posture',
          severity: 'warning',
          timestamp: now
        });
      } else if (metrics.confidence > 0.8) {
        newMessages.push({
          type: 'confidence',
          message: 'Great confidence in your delivery!',
          severity: 'success',
          timestamp: now
        });
      }
    }

    // Filler Words Feedback
    if (metrics.fillerWords.length > 0) {
      const recentFillers = metrics.fillerWords
        .filter(fw => fw.count > 0)
        .slice(0, 3);
      
      if (recentFillers.length > 0) {
        newMessages.push({
          type: 'fillerWords',
          message: `Watch out for filler words: ${recentFillers.map(fw => fw.word).join(', ')}`,
          severity: 'warning',
          timestamp: now
        });
      }
    }

    // Update feedback messages, keeping only recent ones
    setFeedbackMessages(prev => 
      [...newMessages, ...prev]
        .filter(msg => now - msg.timestamp < 30000) // Keep last 30 seconds
        .slice(0, 5) // Keep only 5 most recent messages
    );
  }, [metrics]);

  return (
    <div className="fixed right-4 top-4 w-96 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3">
        <h2 className="text-lg font-semibold">Live AI Feedback</h2>
      </div>

      {/* Metrics Overview */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          {/* WPM */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Speaking Rate</div>
            <div className="text-xl font-semibold">
              {metrics.wpm !== null ? `${Math.round(metrics.wpm)} WPM` : '---'}
            </div>
          </div>

          {/* Eye Contact */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Eye Contact</div>
            <div className="text-xl font-semibold">
              {metrics.eyeContact !== null 
                ? `${Math.round(metrics.eyeContact * 100)}%` 
                : '---'}
            </div>
          </div>

          {/* Confidence */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Confidence</div>
            <div className="text-xl font-semibold">
              {metrics.confidence !== null 
                ? `${Math.round(metrics.confidence * 100)}%` 
                : '---'}
            </div>
          </div>

          {/* Filler Words */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Filler Words</div>
            <div className="text-xl font-semibold">
              {metrics.fillerWords.reduce((sum, fw) => sum + fw.count, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Live Feedback Messages */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {feedbackMessages.length > 0 ? (
          <ul className="space-y-3">
            {feedbackMessages.map((msg, index) => (
              <li 
                key={`${msg.type}-${msg.timestamp}-${index}`}
                className={`p-3 rounded-lg text-sm ${
                  msg.severity === 'success' ? 'bg-green-50 text-green-700' :
                  msg.severity === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-red-50 text-red-700'
                }`}
              >
                {msg.message}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500">
            Start speaking to see live feedback
          </div>
        )}
      </div>
    </div>
  );
}