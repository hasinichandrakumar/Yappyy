import { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useVoiceAnalysis } from '@/hooks/useVoiceAnalysis';
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
  roleplayContext?: string;
  audienceType?: string;
}

export default function SmartAIFeedback({ roleplayContext, audienceType }: SmartAIFeedbackProps = {}) {
  const { fillerWords, isListening, transcript, wordCount } = useSpeechRecognition();
  const { voiceClarity, confidenceScore, volumeLevel } = useVoiceAnalysis();
  const [currentFeedback, setCurrentFeedback] = useState<AIFeedback | null>(null);
  const [lastFillerCount, setLastFillerCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  // Debug logging
  useEffect(() => {
    console.log('SmartAIFeedback state:', { 
      isListening, 
      transcriptLength: transcript.length,
      fillerWordsCount: fillerWords.length,
      wordCount,
      voiceClarity,
      confidenceScore,
      currentFeedback: currentFeedback?.type 
    });
  }, [isListening, transcript, fillerWords, wordCount, voiceClarity, confidenceScore, currentFeedback]);

  const createFeedback = (
    type: AIFeedback['type'],
    title: string,
    message: string,
    priority: AIFeedback['priority'] = 'medium',
    autoHide: boolean = false,
    hideAfter: number = 5
  ): AIFeedback => ({
    id: Date.now().toString(),
    type,
    title,
    message,
    priority,
    timestamp: new Date(),
    autoHide,
    hideAfter
  });

  const showFeedback = (feedback: AIFeedback) => {
    setCurrentFeedback(feedback);
    
    if (feedback.autoHide && feedback.hideAfter) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setCurrentFeedback(null);
      }, feedback.hideAfter * 1000);
    }
  };

  // Track session start
  useEffect(() => {
    if (isListening && !sessionStartTime) {
      setSessionStartTime(new Date());
    } else if (!isListening && sessionStartTime) {
      setSessionStartTime(null);
    }
  }, [isListening, sessionStartTime]);

  // Monitor filler words
  useEffect(() => {
    if (isListening && fillerWords.length > lastFillerCount) {
      const newFillers = fillerWords.length - lastFillerCount;
      setLastFillerCount(fillerWords.length);
      
      if (fillerWords.length >= 3) {
        showFeedback(createFeedback(
          'warning',
          'Reduce Filler Words',
          `You've used ${fillerWords.length} filler words. Try pausing instead of saying "um" or "uh".`,
          'high',
          true,
          4
        ));
      }
    }
  }, [fillerWords, lastFillerCount, isListening]);

  // Monitor voice clarity
  useEffect(() => {
    if (isListening && voiceClarity < 40 && wordCount > 10) {
      showFeedback(createFeedback(
        'improvement',
        'Speak More Clearly',
        'Your voice clarity could be improved. Slow down and articulate your words more clearly.',
        'medium',
        true,
        5
      ));
    } else if (isListening && voiceClarity > 80 && wordCount > 20) {
      showFeedback(createFeedback(
        'success',
        'Great Clarity!',
        'Your voice is crystal clear. Keep up the excellent articulation!',
        'low',
        true,
        3
      ));
    }
  }, [voiceClarity, wordCount, isListening]);

  // Monitor confidence
  useEffect(() => {
    if (isListening && confidenceScore < 30 && wordCount > 15) {
      showFeedback(createFeedback(
        'tip',
        'Boost Your Confidence',
        'Your voice sounds uncertain. Stand tall, breathe deeply, and project confidence.',
        'medium',
        true,
        6
      ));
    } else if (isListening && confidenceScore > 85 && wordCount > 10) {
      showFeedback(createFeedback(
        'success',
        'Confident Delivery!',
        'You sound very confident and assured. Your audience can feel your authority.',
        'low',
        true,
        3
      ));
    }
  }, [confidenceScore, wordCount, isListening]);

  // Monitor volume levels
  useEffect(() => {
    if (isListening && volumeLevel < 20 && wordCount > 5) {
      showFeedback(createFeedback(
        'warning',
        'Speak Louder',
        'Your voice is too quiet. Project your voice so everyone can hear you clearly.',
        'high',
        true,
        4
      ));
    } else if (isListening && volumeLevel > 90 && wordCount > 5) {
      showFeedback(createFeedback(
        'warning',
        'Lower Your Volume',
        'You might be speaking too loudly. Find a comfortable volume for your audience.',
        'medium',
        true,
        4
      ));
    }
  }, [volumeLevel, wordCount, isListening]);

  // Provide periodic encouragement
  useEffect(() => {
    if (isListening && wordCount > 0 && wordCount % 50 === 0) {
      showFeedback(createFeedback(
        'tip',
        'Keep Going!',
        `You've spoken ${wordCount} words. You're doing great - maintain your momentum!`,
        'low',
        true,
        3
      ));
    }
  }, [wordCount, isListening]);

  // Context-specific feedback
  useEffect(() => {
    if (roleplayContext && isListening && wordCount > 30) {
      if (roleplayContext.includes('presentation') && fillerWords.length === 0) {
        showFeedback(createFeedback(
          'success',
          'Professional Presentation',
          'Excellent! No filler words detected in your presentation. Very professional.',
          'low',
          true,
          4
        ));
      } else if (roleplayContext.includes('interview') && confidenceScore > 70) {
        showFeedback(createFeedback(
          'success',
          'Interview Confidence',
          'You sound confident and composed - perfect for an interview setting.',
          'low',
          true,
          4
        ));
      }
    }
  }, [roleplayContext, wordCount, fillerWords, confidenceScore, isListening]);

  const getFeedbackIcon = (type: AIFeedback['type']) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'tip': return Lightbulb;
      case 'improvement': return ArrowUpRight;
      default: return Brain;
    }
  };

  const getFeedbackColor = (type: AIFeedback['type']) => {
    switch (type) {
      case 'warning': return 'border-red-200 bg-red-50';
      case 'success': return 'border-green-200 bg-green-50';
      case 'tip': return 'border-blue-200 bg-blue-50';
      case 'improvement': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getBadgeColor = (type: AIFeedback['type']) => {
    switch (type) {
      case 'warning': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'tip': return 'bg-blue-100 text-blue-800';
      case 'improvement': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentFeedback) {
    return (
      <div className="space-y-6">
        {/* Main Coach Status */}
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isListening ? 'bg-gradient-to-br from-green-400 to-blue-500 animate-pulse' : 'bg-gradient-to-br from-blue-400 to-purple-500'
          }`}>
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">AI Speaking Coach</h3>
          <p className="text-sm text-blue-700 mb-4">
            {isListening 
              ? "🎯 Analyzing your speech in real-time..." 
              : "Ready to provide personalized coaching feedback"
            }
          </p>
          
          {isListening && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-900">{wordCount}</div>
                <div className="text-xs text-blue-600">Words Spoken</div>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-900">{Math.round(voiceClarity)}%</div>
                <div className="text-xs text-blue-600">Voice Clarity</div>
              </div>
            </div>
          )}
        </div>

        {/* Coaching Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Voice Analysis</h4>
                <p className="text-xs text-gray-600">Clarity, tone, and projection</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Clarity</span>
                <span className={voiceClarity > 70 ? 'text-green-600' : voiceClarity > 40 ? 'text-yellow-600' : 'text-red-600'}>
                  {Math.round(voiceClarity)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    voiceClarity > 70 ? 'bg-green-500' : voiceClarity > 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(voiceClarity, 100)}%` }}
                ></div>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-purple-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Confidence Level</h4>
                <p className="text-xs text-gray-600">Authority and presence</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Confidence</span>
                <span className={confidenceScore > 70 ? 'text-green-600' : confidenceScore > 40 ? 'text-yellow-600' : 'text-red-600'}>
                  {Math.round(confidenceScore)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    confidenceScore > 70 ? 'bg-green-500' : confidenceScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(confidenceScore, 100)}%` }}
                ></div>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Filler Words</h4>
                <p className="text-xs text-gray-600">Um, uh, like, you know</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{fillerWords.length}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                fillerWords.length === 0 ? 'bg-green-100 text-green-800' :
                fillerWords.length <= 2 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {fillerWords.length === 0 ? 'Excellent' : 
                 fillerWords.length <= 2 ? 'Good' : 'Needs Work'}
              </span>
            </div>
          </Card>

          <Card className="p-4 border-orange-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Speech Progress</h4>
                <p className="text-xs text-gray-600">Session tracking</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Session Duration</span>
                <span>{sessionStartTime ? Math.floor((Date.now() - sessionStartTime.getTime()) / 1000) : 0}s</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Words Spoken</span>
                <span>{wordCount}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <h4 className="font-semibold text-sm mb-3 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-indigo-600" />
            Pro Speaking Tips
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-1 flex-shrink-0"></div>
              <span>Maintain steady eye contact with your audience</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-1 flex-shrink-0"></div>
              <span>Use strategic pauses instead of filler words</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-1 flex-shrink-0"></div>
              <span>Project your voice to reach the back row</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-1 flex-shrink-0"></div>
              <span>Vary your tone to keep audience engaged</span>
            </div>
          </div>
        </Card>

        {/* Performance Analytics */}
        <Card className="p-4 border-emerald-200">
          <h4 className="font-semibold text-sm mb-4 flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-2 text-emerald-600" />
            Performance Analytics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-lg font-bold text-emerald-700">
                {Math.round((voiceClarity + confidenceScore) / 2)}%
              </div>
              <div className="text-xs text-emerald-600">Overall Score</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">
                {fillerWords.length === 0 ? 'A+' : 
                 fillerWords.length <= 2 ? 'B+' : 
                 fillerWords.length <= 5 ? 'C+' : 'D'}
              </div>
              <div className="text-xs text-blue-600">Speech Grade</div>
            </div>
          </div>
        </Card>

        {/* Improvement Recommendations */}
        <Card className="p-4 border-amber-200">
          <h4 className="font-semibold text-sm mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-amber-600" />
            Improvement Focus Areas
          </h4>
          <div className="space-y-3">
            {voiceClarity < 60 && (
              <div className="p-3 bg-amber-50 rounded-lg border-l-3 border-amber-400">
                <div className="font-medium text-xs text-amber-800">Voice Clarity</div>
                <div className="text-xs text-amber-700 mt-1">
                  Practice speaking more slowly and enunciating consonants clearly
                </div>
              </div>
            )}
            {confidenceScore < 60 && (
              <div className="p-3 bg-red-50 rounded-lg border-l-3 border-red-400">
                <div className="font-medium text-xs text-red-800">Confidence Building</div>
                <div className="text-xs text-red-700 mt-1">
                  Stand tall, make eye contact, and speak with authority
                </div>
              </div>
            )}
            {fillerWords.length > 3 && (
              <div className="p-3 bg-orange-50 rounded-lg border-l-3 border-orange-400">
                <div className="font-medium text-xs text-orange-800">Reduce Filler Words</div>
                <div className="text-xs text-orange-700 mt-1">
                  Pause instead of using "um" or "uh" - silence is powerful
                </div>
              </div>
            )}
            {voiceClarity >= 60 && confidenceScore >= 60 && fillerWords.length <= 3 && (
              <div className="p-3 bg-green-50 rounded-lg border-l-3 border-green-400">
                <div className="font-medium text-xs text-green-800">Excellent Progress!</div>
                <div className="text-xs text-green-700 mt-1">
                  Your speaking skills are developing well. Keep practicing consistently.
                </div>
              </div>
            )}
          </div>
        </Card>

        {!isListening && (
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">
              🎤 Start speaking to receive personalized AI coaching feedback
            </p>
          </div>
        )}
      </div>
    );
  }

  const Icon = getFeedbackIcon(currentFeedback.type);

  return (
    <div className="space-y-4">
      <Card className={`${getFeedbackColor(currentFeedback.type)} border-l-4 shadow-sm animate-in fade-in slide-in-from-right-5 duration-300`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5 mt-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-sm">{currentFeedback.title}</h4>
                  <Badge className={`text-xs ${getBadgeColor(currentFeedback.type)}`}>
                    {currentFeedback.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{currentFeedback.message}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{currentFeedback.timestamp.toLocaleTimeString()}</span>
                  </div>
                  {currentFeedback.autoHide && (
                    <span className="text-xs text-gray-400">Auto-dismiss in {currentFeedback.hideAfter}s</span>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFeedback(null)}
              className="flex-shrink-0 h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}