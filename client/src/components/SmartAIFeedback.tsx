import { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Target,
  Clock,
  Volume2
} from 'lucide-react';

interface AIFeedback {
  id: string;
  type: 'warning' | 'success' | 'tip' | 'improvement';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  autoHide?: boolean;
  hideAfter?: number; // seconds
}

export default function SmartAIFeedback() {
  const { wpm, fillerWords, isListening, transcript } = useSpeechRecognition();
  const [currentFeedback, setCurrentFeedback] = useState<AIFeedback | null>(null);
  const [lastFillerCount, setLastFillerCount] = useState(0);
  const [lastWPMCheck, setLastWPMCheck] = useState(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const createFeedback = (
    type: AIFeedback['type'],
    title: string,
    message: string,
    priority: AIFeedback['priority'] = 'medium',
    autoHide: boolean = true,
    hideAfter: number = 5
  ): AIFeedback => ({
    id: `feedback-${Date.now()}-${Math.random()}`,
    type,
    title,
    message,
    priority,
    timestamp: new Date(),
    autoHide,
    hideAfter
  });

  const showFeedback = (feedback: AIFeedback) => {
    // Clear existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    setCurrentFeedback(feedback);

    // Auto-hide if specified
    if (feedback.autoHide && feedback.hideAfter) {
      hideTimeoutRef.current = setTimeout(() => {
        setCurrentFeedback(null);
      }, feedback.hideAfter * 1000);
    }
  };

  const hideFeedback = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setCurrentFeedback(null);
  };

  // Monitor speaking pace
  useEffect(() => {
    if (!isListening || wpm === lastWPMCheck) return;
    
    setLastWPMCheck(wpm);

    if (wpm > 0) {
      if (wpm < 120 && transcript.split(' ').length > 10) {
        showFeedback(createFeedback(
          'warning',
          'Speaking Too Slowly',
          'Try to increase your pace slightly. Aim for 140-180 words per minute for better engagement.',
          'medium',
          true,
          4
        ));
      } else if (wpm > 200 && transcript.split(' ').length > 15) {
        showFeedback(createFeedback(
          'warning',
          'Speaking Too Fast',
          'Slow down a bit! Your audience needs time to process your message. Aim for 140-180 WPM.',
          'high',
          true,
          5
        ));
      } else if (wpm >= 140 && wpm <= 180 && transcript.split(' ').length > 20) {
        showFeedback(createFeedback(
          'success',
          'Perfect Speaking Pace',
          'Excellent! You\'re speaking at an ideal pace that keeps your audience engaged.',
          'low',
          true,
          3
        ));
      }
    }
  }, [wpm, isListening, transcript, lastWPMCheck]);

  // Monitor filler words
  useEffect(() => {
    if (!isListening) return;

    const currentFillerCount = fillerWords.length;
    
    if (currentFillerCount > lastFillerCount) {
      const newFillers = currentFillerCount - lastFillerCount;
      const recentFiller = fillerWords[fillerWords.length - 1];
      
      if (currentFillerCount >= 3 && currentFillerCount % 2 === 0) {
        showFeedback(createFeedback(
          'warning',
          'Filler Words Detected',
          `Try to pause instead of using "${recentFiller}". Take a breath and continue with confidence.`,
          'medium',
          true,
          4
        ));
      }
    }
    
    setLastFillerCount(currentFillerCount);
  }, [fillerWords.length, isListening, lastFillerCount, fillerWords]);

  // Provide periodic encouragement
  useEffect(() => {
    if (!isListening) return;

    const wordCount = transcript.split(' ').length;
    
    // Every 50 words, provide encouraging feedback if no issues
    if (wordCount > 0 && wordCount % 50 === 0 && !currentFeedback) {
      if (wpm >= 140 && wpm <= 180 && fillerWords.length < wordCount * 0.05) {
        showFeedback(createFeedback(
          'success',
          'Great Job!',
          'You\'re maintaining excellent pace and clarity. Keep up the momentum!',
          'low',
          true,
          3
        ));
      }
    }
  }, [transcript, isListening, wpm, fillerWords.length, currentFeedback]);

  const getIcon = (type: AIFeedback['type']) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'tip': return Lightbulb;
      case 'improvement': return Target;
      default: return Brain;
    }
  };

  const getColors = (type: AIFeedback['type']) => {
    switch (type) {
      case 'warning': return {
        bg: 'bg-yellow-50 border-yellow-200',
        icon: 'text-yellow-600',
        badge: 'bg-yellow-100 text-yellow-800'
      };
      case 'success': return {
        bg: 'bg-green-50 border-green-200',
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-800'
      };
      case 'tip': return {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800'
      };
      case 'improvement': return {
        bg: 'bg-purple-50 border-purple-200',
        icon: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-800'
      };
      default: return {
        bg: 'bg-gray-50 border-gray-200',
        icon: 'text-gray-600',
        badge: 'bg-gray-100 text-gray-800'
      };
    }
  };

  if (!currentFeedback) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <div className="text-center">
          <Brain className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">AI Coach is listening...</p>
          <p className="text-xs text-gray-400 mt-1">Real-time feedback will appear here</p>
        </div>
      </div>
    );
  }

  const Icon = getIcon(currentFeedback.type);
  const colors = getColors(currentFeedback.type);

  return (
    <Card className={`${colors.bg} border transition-all duration-300 animate-in slide-in-from-top-2`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Icon className={`w-5 h-5 mt-0.5 ${colors.icon} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {currentFeedback.title}
                </h4>
                <Badge className={`text-xs ${colors.badge}`}>
                  {currentFeedback.type}
                </Badge>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {currentFeedback.message}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {currentFeedback.timestamp.toLocaleTimeString('en-US', { 
                  hour12: false, 
                  minute: '2-digit', 
                  second: '2-digit' 
                })}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={hideFeedback}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-gray-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}