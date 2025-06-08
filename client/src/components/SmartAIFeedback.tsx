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
  ArrowUpRight,
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

interface SmartAIFeedbackProps {
  demoMode?: boolean;
}

export default function SmartAIFeedback({ demoMode = true }: SmartAIFeedbackProps) {
  const { wpm, fillerWords, isListening, transcript } = useSpeechRecognition();
  const [currentFeedback, setCurrentFeedback] = useState<AIFeedback | null>(null);
  const [lastFillerCount, setLastFillerCount] = useState(0);
  const [lastWPMCheck, setLastWPMCheck] = useState(0);
  const [demoFeedbackIndex, setDemoFeedbackIndex] = useState(0);
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  // Debug logging
  useEffect(() => {
    console.log('SmartAIFeedback state:', { 
      demoMode, 
      isListening, 
      wpm, 
      transcriptLength: transcript.length,
      fillerWordsCount: fillerWords.length,
      currentFeedback: currentFeedback?.type 
    });
  }, [demoMode, isListening, wpm, transcript, fillerWords, currentFeedback]);

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

  // Demo feedback examples for demonstration
  const demoFeedbacks = [
    createFeedback('tip', 'Great Eye Contact', 'Excellent! You maintained strong eye contact during that phrase. Keep it up!', 'low', true, 4),
    createFeedback('improvement', 'Vary Your Pace', 'Try slowing down during key points to emphasize important information.', 'medium', true, 5),
    createFeedback('success', 'Perfect Gesture', 'That hand gesture perfectly complemented your message and added emphasis.', 'low', true, 3),
    createFeedback('warning', 'Reduce Filler Words', 'I noticed a few "um"s. Take brief pauses instead of using filler words.', 'medium', true, 6),
    createFeedback('tip', 'Strong Opening', 'Your opening hook captured attention effectively. Great start!', 'low', true, 4),
    createFeedback('improvement', 'Project Your Voice', 'Speak with more vocal energy to maintain audience engagement.', 'medium', true, 5)
  ];

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

  // Demo mode - cycle through feedback automatically
  useEffect(() => {
    if (!demoMode) return;
    
    // Show first feedback immediately in demo mode
    if (!currentFeedback) {
      showFeedback(demoFeedbacks[0]);
      setDemoFeedbackIndex(1);
    }
    
    const interval = setInterval(() => {
      const feedback = demoFeedbacks[demoFeedbackIndex];
      showFeedback(feedback);
      setDemoFeedbackIndex((prev) => (prev + 1) % demoFeedbacks.length);
    }, 5000); // Show new feedback every 5 seconds

    return () => clearInterval(interval);
  }, [demoMode, demoFeedbacks]);

  // Monitor speaking pace (only when not in demo mode)
  useEffect(() => {
    if (demoMode || !isListening || wpm === lastWPMCheck) return;
    
    console.log('Live feedback check:', { wpm, transcriptLength: transcript.length, isListening });
    setLastWPMCheck(wpm);

    // Lower thresholds for easier testing
    const wordCount = transcript.split(' ').length;
    
    if (wpm > 0 && wordCount > 3) {
      if (wpm < 100) {
        showFeedback(createFeedback(
          'warning',
          'Speaking Too Slowly',
          'Try to increase your pace slightly. Aim for 140-180 words per minute for better engagement.',
          'medium',
          true,
          4
        ));
      } else if (wpm > 250) {
        showFeedback(createFeedback(
          'warning',
          'Speaking Too Fast',
          'Slow down a bit! Your audience needs time to process your message. Aim for 140-180 WPM.',
          'high',
          true,
          5
        ));
      } else if (wpm >= 120 && wpm <= 200 && wordCount > 5) {
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
    
    // Immediate feedback for any speech activity
    if (wordCount >= 5 && wpm > 0 && !currentFeedback) {
      showFeedback(createFeedback(
        'tip',
        'Great Start!',
        'Good speaking technique detected. Keep maintaining your natural rhythm.',
        'low',
        true,
        4
      ));
    }
  }, [wpm, isListening, transcript, lastWPMCheck, demoMode]);

  // Monitor filler words (only when not in demo mode)
  useEffect(() => {
    if (demoMode || !isListening) return;

    const currentFillerCount = fillerWords.length;
    
    if (currentFillerCount > lastFillerCount) {
      const recentFiller = fillerWords[fillerWords.length - 1];
      
      // Trigger on any filler word for immediate feedback
      if (currentFillerCount >= 1) {
        showFeedback(createFeedback(
          'warning',
          'Filler Word Detected',
          `I noticed "${recentFiller}". Try pausing instead to maintain professional delivery.`,
          'medium',
          true,
          4
        ));
      }
    }
    
    setLastFillerCount(currentFillerCount);
  }, [fillerWords.length, isListening, lastFillerCount, fillerWords, demoMode]);

  // Simple speech detection test (fires when speech is first detected)
  useEffect(() => {
    if (demoMode || !isListening) return;

    const wordCount = transcript.split(' ').length;
    
    // Immediate feedback when speech starts
    if (wordCount >= 3 && !currentFeedback) {
      console.log('Triggering immediate speech detection feedback');
      showFeedback(createFeedback(
        'tip',
        'Speech Detected!',
        'Great! I can hear you speaking. Continue and I\'ll provide real-time coaching feedback.',
        'low',
        true,
        4
      ));
    }
    
    // Periodic encouragement for longer speeches
    if (wordCount > 0 && wordCount % 30 === 0 && currentFeedback?.type !== 'success') {
      if (wpm >= 100 && fillerWords.length < wordCount * 0.1) {
        showFeedback(createFeedback(
          'success',
          'Excellent Progress!',
          'You\'re maintaining good pace and clarity. Keep up the momentum!',
          'low',
          true,
          3
        ));
      }
    }
  }, [transcript, isListening, wpm, fillerWords.length, currentFeedback, demoMode]);

  const getIcon = (type: AIFeedback['type']) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'tip': return Lightbulb;
      case 'improvement': return ArrowUpRight;
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
        bg: 'bg-cyan-50 border-cyan-200',
        icon: 'text-cyan-600',
        badge: 'bg-cyan-100 text-cyan-800'
      };
      case 'improvement': return {
        bg: 'bg-cyan-50 border-cyan-200',
        icon: 'text-cyan-600',
        badge: 'bg-cyan-100 text-cyan-800'
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
      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="flex items-center justify-center p-8 text-gray-500 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg">
          <div className="text-center">
            <div className="relative">
              <Brain className={`w-8 h-8 mx-auto mb-3 text-cyan-400 ${demoMode || isListening ? 'animate-pulse' : ''}`} />
              {(demoMode || isListening) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
              )}
            </div>
            <p className="text-base font-medium text-gray-700">
              {demoMode ? 'AI Coach Demo Mode' : isListening ? 'AI Coach is analyzing...' : 'AI Coach is ready'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {demoMode ? 'Sample feedback will cycle automatically' : 'Live feedback will appear as you speak'}
            </p>
          </div>
        </CardContent>
      </Card>
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