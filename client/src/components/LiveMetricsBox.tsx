import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain,
  Timer,
  AlertTriangle,
  CheckCircle,
  Info,
  X
} from 'lucide-react';

interface LiveMetrics {
  wpm: number | null;
  eyeContact: number | null;
  confidence: number | null;
  fillerWords: number;
  volume: number | null;
  clarity: number | null;
  posture: number | null;
}

interface FeedbackMessage {
  id: string;
  type: 'wpm' | 'eyeContact' | 'confidence' | 'fillerWords' | 'volume' | 'general';
  message: string;
  severity: 'success' | 'warning' | 'info' | 'error';
  timestamp: number;
  actionable?: string;
}

interface LiveMetricsBoxProps {
  isRecording: boolean;
  metrics: LiveMetrics;
  onClose?: () => void;
  position?: 'floating' | 'sidebar';
}

export function LiveMetricsBox({ 
  isRecording, 
  metrics, 
  onClose, 
  position = 'floating' 
}: LiveMetricsBoxProps) {
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
  const [lastFeedbackTime, setLastFeedbackTime] = useState<number>(0);
  const [feedbackCount, setFeedbackCount] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate feedback every 20-30 seconds (random interval for natural feel)
  useEffect(() => {
    if (!isRecording) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const generatePeriodicFeedback = () => {
      const now = Date.now();
      const timeSinceLastFeedback = now - lastFeedbackTime;
      
      // Generate feedback every 20-30 seconds
      if (timeSinceLastFeedback >= 20000) {
        generateSmartFeedback(now);
        setLastFeedbackTime(now);
        setFeedbackCount(prev => prev + 1);
      }
    };

    // Check every 5 seconds but only generate feedback based on timing
    intervalRef.current = setInterval(generatePeriodicFeedback, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording, lastFeedbackTime, metrics]);

  // Smart feedback generation based on current metrics
  const generateSmartFeedback = (timestamp: number) => {
    const newMessages: FeedbackMessage[] = [];

    // WPM Analysis
    if (metrics.wpm !== null) {
      if (metrics.wpm < 100) {
        newMessages.push({
          id: `wpm-${timestamp}`,
          type: 'wpm',
          message: 'Your pace is quite slow. Try to speak a bit faster to maintain audience engagement.',
          severity: 'warning',
          timestamp,
          actionable: 'Aim for 120-150 words per minute'
        });
      } else if (metrics.wpm > 180) {
        newMessages.push({
          id: `wpm-${timestamp}`,
          type: 'wpm',
          message: 'You\'re speaking very quickly. Slow down slightly for better clarity.',
          severity: 'warning',
          timestamp,
          actionable: 'Take deeper breaths between sentences'
        });
      } else if (metrics.wpm >= 120 && metrics.wpm <= 160) {
        newMessages.push({
          id: `wpm-${timestamp}`,
          type: 'wpm',
          message: 'Perfect speaking pace! Your audience can follow along easily.',
          severity: 'success',
          timestamp
        });
      }
    }

    // Eye Contact Analysis
    if (metrics.eyeContact !== null) {
      if (metrics.eyeContact < 0.4) {
        newMessages.push({
          id: `eye-${timestamp}`,
          type: 'eyeContact',
          message: 'Try to maintain more eye contact with the camera to connect with your audience.',
          severity: 'warning',
          timestamp,
          actionable: 'Look directly at the camera lens for 3-5 seconds at a time'
        });
      } else if (metrics.eyeContact > 0.75) {
        newMessages.push({
          id: `eye-${timestamp}`,
          type: 'eyeContact',
          message: 'Excellent eye contact! You\'re creating a strong connection.',
          severity: 'success',
          timestamp
        });
      }
    }

    // Confidence Analysis
    if (metrics.confidence !== null) {
      if (metrics.confidence < 0.5) {
        newMessages.push({
          id: `confidence-${timestamp}`,
          type: 'confidence',
          message: 'Stand tall and project confidence. Your posture affects your voice.',
          severity: 'warning',
          timestamp,
          actionable: 'Keep shoulders back and chest open'
        });
      } else if (metrics.confidence > 0.8) {
        newMessages.push({
          id: `confidence-${timestamp}`,
          type: 'confidence',
          message: 'Great confidence! Your body language shows authority and presence.',
          severity: 'success',
          timestamp
        });
      }
    }

    // Filler Words Analysis
    if (metrics.fillerWords > 5) {
      newMessages.push({
        id: `filler-${timestamp}`,
        type: 'fillerWords',
        message: `You've used ${metrics.fillerWords} filler words. Try to pause instead of using "um" or "uh".`,
        severity: 'warning',
        timestamp,
        actionable: 'Practice silent pauses instead of filler words'
      });
    } else if (metrics.fillerWords <= 2) {
      newMessages.push({
        id: `filler-${timestamp}`,
        type: 'fillerWords',
        message: 'Excellent control over filler words! Your speech sounds polished.',
        severity: 'success',
        timestamp
      });
    }

    // Volume Analysis
    if (metrics.volume !== null) {
      if (metrics.volume < 0.3) {
        newMessages.push({
          id: `volume-${timestamp}`,
          type: 'volume',
          message: 'Speak louder to ensure your audience can hear you clearly.',
          severity: 'warning',
          timestamp,
          actionable: 'Project from your diaphragm, not your throat'
        });
      } else if (metrics.volume > 0.9) {
        newMessages.push({
          id: `volume-${timestamp}`,
          type: 'volume',
          message: 'Your volume might be too high. Adjust to a comfortable level.',
          severity: 'info',
          timestamp,
          actionable: 'Reduce volume slightly while maintaining energy'
        });
      }
    }

    // If no specific feedback, provide general encouragement
    if (newMessages.length === 0) {
      const encouragementMessages = [
        'Keep up the great work! Your delivery is improving.',
        'You\'re doing well! Stay focused and maintain your energy.',
        'Good progress! Remember to breathe and stay relaxed.',
        'Nice job! Your audience engagement skills are developing.',
        'Excellent effort! Keep practicing these techniques.'
      ];
      
      newMessages.push({
        id: `general-${timestamp}`,
        type: 'general',
        message: encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)],
        severity: 'info',
        timestamp
      });
    }

    // Add new messages and keep only the last 6 messages
    setFeedbackMessages(prev => 
      [...newMessages, ...prev].slice(0, 6)
    );
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return Info;
    }
  };



  const containerClass = position === 'floating' 
    ? 'fixed right-4 top-4 w-96 z-50'
    : 'w-full h-fit sticky top-4';

  return (
    <Card className={`${containerClass} bg-white shadow-lg border border-gray-200`}>
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Speaking Coach
          </CardTitle>
          <div className="flex items-center gap-2">
            {isRecording && (
              <Badge variant="secondary" className="bg-red-500 text-white animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                LIVE
              </Badge>
            )}
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Live Feedback Messages */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-700">Coaching Tips</h3>
            {isRecording && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Timer className="h-3 w-3" />
                Next tip in {Math.ceil((20000 - (Date.now() - lastFeedbackTime)) / 1000)}s
              </div>
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {feedbackMessages.length > 0 ? (
              feedbackMessages.map((message) => {
                const IconComponent = getSeverityIcon(message.severity);
                return (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg border text-sm ${getSeverityColor(message.severity)}`}
                  >
                    <div className="flex items-start gap-2">
                      <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium">{message.message}</p>
                        {message.actionable && (
                          <p className="text-xs mt-1 opacity-75">
                            💡 {message.actionable}
                          </p>
                        )}
                        <div className="text-xs opacity-60 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-6">
                {isRecording ? 
                  'AI coach is listening and analyzing...' : 
                  'Start practicing to receive coaching tips'
                }
              </div>
            )}
          </div>
        </div>

        {/* Coaching Summary */}
        {feedbackCount > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              {feedbackCount} coaching tip{feedbackCount !== 1 ? 's' : ''} provided
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}