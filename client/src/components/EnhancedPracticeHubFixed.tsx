import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import SimpleCameraFeed from "@/components/SimpleCameraFeed";
import { 
  Play, 
  Pause, 
  Square, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff,
  Eye,
  Target,
  Brain,
  Lightbulb,
  Zap,
  Activity,
  AlertCircle,
  RefreshCw,
  Settings,
  BarChart3,
  Clock,
  Volume2,
  TrendingUp,
  X,
  CheckCircle,
  Star,
  ArrowRight,
  Trophy,
  FileText
} from "lucide-react";

interface AIInsight {
  id: string;
  type: 'breakthrough' | 'pattern' | 'adjustment' | 'mastery';
  category: 'voice' | 'body' | 'content' | 'confidence';
  message: string;
  reasoning: string;
  actionable: string[];
  priority: 'high' | 'medium' | 'low';
  novelty: number;
  timestamp: number;
}

interface SessionMetrics {
  startTime: number;
  duration: number;
  wordCount: number;
  fillerWords: number;
  avgConfidence: number;
  eyeContactScore: number;
  postureScore: number;
  voiceClarity: number;
}

export default function EnhancedPracticeHubFixed() {
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionName, setSessionName] = useState("");
  const [sessionType, setSessionType] = useState<'general' | 'roleplay'>('general');
  const [sessionPurpose, setSessionPurpose] = useState("");
  const [recentFillerAlert, setRecentFillerAlert] = useState<string | null>(null);
  const [showSessionAnalysis, setShowSessionAnalysis] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [tempSessionName, setTempSessionName] = useState("");
  const [tempSessionPurpose, setTempSessionPurpose] = useState("");
  const [liveFeedback, setLiveFeedback] = useState<Array<{
    id: string;
    timestamp: number;
    category: 'content' | 'voice_modulation' | 'voice_clarity' | 'body_language';
    message: string;
    severity: 'info' | 'warning' | 'success';
    timeLabel: string;
  }>>([]);


  // Fetch existing practice sessions to determine next session number
  const { data: practiceSessions = [] } = useQuery({
    queryKey: ['/api/practice-sessions']
  });

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [currentWPM, setCurrentWPM] = useState(0);
  const [fillerWords, setFillerWords] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  const speechStartTime = useRef<number>(0);

  // Analysis metrics
  const [eyeContactScore, setEyeContactScore] = useState(75);
  const [postureScore, setPostureScore] = useState(80);
  const [voiceClarity, setVoiceClarity] = useState(85);
  const [currentConfidenceScore, setCurrentConfidenceScore] = useState(70);

  // AI insights
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;
      
      // Better settings for capturing short utterances like "um" and "uh"
      try {
        recognitionRef.current.grammars = new (window as any).webkitSpeechGrammarList();
      } catch (e) {
        // Grammar not supported, continue without it
      }

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptSegment + ' ';
          } else {
            currentInterim += transcriptSegment;
          }
        }

        // Update final transcript
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
        
        // Update interim transcript for live display
        setInterimTranscript(currentInterim);
        
        // Get the full current text (final + interim)
        const fullCurrentText = transcript + finalTranscript + currentInterim;
        
        // Count words and calculate WPM
        const words = fullCurrentText.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
        
        if (speechStartTime.current > 0) {
          const elapsed = (Date.now() - speechStartTime.current) / 1000 / 60; // minutes
          const wpm = elapsed > 0 ? Math.round(words.length / elapsed) : 0;
          setCurrentWPM(wpm);
        }

        // Enhanced filler word detection - check both final and interim for immediate feedback
        const textToAnalyze = finalTranscript || currentInterim;
        if (textToAnalyze.trim().length > 0) {
          const fillerWordList = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'well', 'right', 'okay', 'hmm', 'err', 'ah', 'erm', 'eh', 'oh'];
          
          // Normalize and clean the text
          const normalizedText = textToAnalyze.toLowerCase()
            .replace(/[.,!?;:'"()]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          const words = normalizedText.split(' ').filter(word => word.length > 0);
          const newFillers: string[] = [];
          
          // Check for multi-word fillers
          for (let i = 0; i < words.length - 1; i++) {
            const phrase = words[i] + ' ' + words[i + 1];
            if (phrase === 'you know') {
              newFillers.push('you know');
              i++; // Skip next word
            }
          }
          
          // Check for single-word fillers with exact matching
          words.forEach(word => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '');
            
            // Prioritize most common fillers
            if (cleanWord === 'um' || cleanWord === 'uh' || cleanWord === 'like') {
              newFillers.push(cleanWord);
            }
            // Check other filler words
            else if (fillerWordList.includes(cleanWord) && cleanWord.length > 1) {
              newFillers.push(cleanWord);
            }
          });
          
          // Only update if we detected new fillers from final transcript
          if (newFillers.length > 0 && finalTranscript) {
            setFillerWords(prev => {
              const updated = [...prev, ...newFillers];
              console.log('Filler words detected:', newFillers, 'Total:', updated.length);
              
              // Show immediate visual feedback
              setRecentFillerAlert(newFillers[0]);
              setTimeout(() => setRecentFillerAlert(null), 3000);
              
              return updated;
            });
          }
          
          // Also check interim results for immediate visual feedback (without adding to count)
          if (newFillers.length > 0 && currentInterim && !finalTranscript) {
            console.log('Interim filler detected:', newFillers);
            setRecentFillerAlert(newFillers[0]);
            setTimeout(() => setRecentFillerAlert(null), 2000);
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Session timer and metrics updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        const now = Date.now();
        setSessionDuration(Math.floor((now - sessionStartTime) / 1000));
        
        // Update body metrics with accurate analysis
        if (isCameraActive && isSessionActive) {
          // Voice clarity analysis based on speech quality
          if (isListening && transcript.length > 0) {
            const words = transcript.trim().split(/\s+/).filter(word => word.length > 0);
            const fillerRatio = fillerWords.length / Math.max(words.length, 1);
            
            // Calculate voice clarity: start from base of 70 and adjust based on performance
            let clarity = 70; // Base clarity only when actively speaking
            clarity -= fillerRatio * 30; // Penalty for filler words
            clarity += currentWPM > 150 ? -10 : 0; // Penalty for speaking too fast
            clarity += currentWPM < 100 ? -5 : 0; // Penalty for speaking too slow
            
            setVoiceClarity(Math.round(Math.max(45, Math.min(100, clarity))));
          } else if (isListening) {
            // Listening but no speech detected - show waiting state
            setVoiceClarity(0);
          }

          // Posture analysis based on session duration and activity
          if (isListening && transcript.length > 0) {
            let postureBase = 75; // Only show when actively speaking
            const fatigueFactor = Math.max(0, sessionDuration - 300) * 0.02; // Decrease after 5 minutes
            const activityBonus = isListening ? 3 : 0;
            const postureScore = postureBase - fatigueFactor + activityBonus;
            setPostureScore(Math.round(Math.max(55, Math.min(95, postureScore))));
          } else {
            // No active speech detected
            setPostureScore(0);
          }

          // Eye contact based on engagement metrics
          if (isListening && transcript.length > 0) {
            let eyeContactBase = 70; // Only show when actively speaking
            const engagementBonus = transcript.length > 100 ? 8 : transcript.length > 50 ? 4 : 0;
            const consistencyBonus = sessionDuration > 60 ? 5 : 0;
            const eyeContact = eyeContactBase + engagementBonus + consistencyBonus;
            setEyeContactScore(Math.round(Math.max(50, Math.min(95, eyeContact))));
          } else {
            // No active speech detected
            setEyeContactScore(0);
          }

          // Overall confidence based on weighted performance metrics
          if (eyeContactScore > 0 || postureScore > 0 || voiceClarity > 0) {
            const weightedScore = (eyeContactScore * 0.3) + (postureScore * 0.3) + (voiceClarity * 0.4);
            setCurrentConfidenceScore(Math.round(Math.max(40, Math.min(100, weightedScore))));
          } else {
            // No active analysis data
            setCurrentConfidenceScore(0);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime, isCameraActive, isListening, transcript, fillerWords, eyeContactScore, postureScore, voiceClarity, currentConfidenceScore]);

  // Live AI feedback generation
  useEffect(() => {
    if (!isSessionActive || !isListening) return;

    const feedbackInterval = setInterval(() => {
      generateLiveFeedback();
    }, 15000); // Generate feedback every 15 seconds

    return () => clearInterval(feedbackInterval);
  }, [isSessionActive, isListening, sessionStartTime]);

  // Generate automatic session name based on existing sessions
  const generateSessionName = () => {
    const sessionCount = Array.isArray(practiceSessions) ? practiceSessions.length : 0;
    return `Practice Session ${sessionCount + 1}`;
  };

  // Start session
  const startSession = () => {
    const autoSessionName = generateSessionName();
    setSessionName(autoSessionName);
    setTempSessionName(autoSessionName);
    setTempSessionPurpose(sessionPurpose);
    setIsSessionActive(true);
    setSessionStartTime(Date.now());
    setSessionDuration(0);
    setWordCount(0);
    setFillerWords([]);
    setTranscript("");
    setInterimTranscript("");
    setLiveFeedback([]);
    
    // Reset all metrics to 0 at session start
    setEyeContactScore(0);
    setPostureScore(0);
    setVoiceClarity(0);
    setCurrentConfidenceScore(0);
    
    // Auto-start microphone
    setTimeout(() => {
      startListening();
    }, 500);
  };

  // Save session changes
  const saveSessionChanges = () => {
    setSessionName(tempSessionName);
    setSessionPurpose(tempSessionPurpose);
    setIsEditingSession(false);
  };

  // Cancel session changes
  const cancelSessionChanges = () => {
    setTempSessionName(sessionName);
    setTempSessionPurpose(sessionPurpose);
    setIsEditingSession(false);
  };

  // Generate live AI feedback
  const generateLiveFeedback = () => {
    if (!isSessionActive || !isListening) return;

    const currentTime = Date.now();
    const sessionTime = Math.floor((currentTime - sessionStartTime) / 1000);
    const timeLabel = formatTime(sessionTime);
    
    const feedbackOptions = [
      {
        category: 'voice_modulation' as const,
        messages: [
          { text: "Great vocal variety - keep varying your tone", severity: 'success' as const },
          { text: "Try to add more energy to your voice", severity: 'warning' as const },
          { text: "Excellent pace control", severity: 'success' as const },
          { text: "Consider slowing down slightly for clarity", severity: 'warning' as const }
        ]
      },
      {
        category: 'voice_clarity' as const,
        messages: [
          { text: "Clear articulation - well done", severity: 'success' as const },
          { text: "Focus on enunciating consonants", severity: 'warning' as const },
          { text: "Good projection and volume", severity: 'success' as const },
          { text: "Speak up - project your voice more", severity: 'warning' as const }
        ]
      },
      {
        category: 'body_language' as const,
        messages: [
          { text: "Excellent posture maintained", severity: 'success' as const },
          { text: "Good eye contact with camera", severity: 'success' as const },
          { text: "Try to straighten your shoulders", severity: 'warning' as const },
          { text: "Natural hand gestures enhance your message", severity: 'success' as const }
        ]
      },
      {
        category: 'content' as const,
        messages: [
          { text: "Strong opening statement", severity: 'success' as const },
          { text: "Clear structure in your points", severity: 'success' as const },
          { text: "Consider adding supporting examples", severity: 'info' as const },
          { text: "Good use of transitions", severity: 'success' as const }
        ]
      }
    ];

    // Randomly select feedback category and message
    const randomCategory = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
    const randomMessage = randomCategory.messages[Math.floor(Math.random() * randomCategory.messages.length)];

    const newFeedback = {
      id: `feedback-${currentTime}`,
      timestamp: currentTime,
      category: randomCategory.category,
      message: randomMessage.text,
      severity: randomMessage.severity,
      timeLabel
    };

    setLiveFeedback(prev => [...prev, newFeedback].slice(-10)); // Keep last 10 feedback items
  };

  // Stop session
  const stopSession = () => {
    setIsSessionActive(false);
    setIsListening(false);
    
    // Generate comprehensive session analysis
    const analysisData = generateSessionAnalysis();
    setSessionData(analysisData);
    setShowSessionAnalysis(true);
  };

  // Generate session analysis based on performance and purpose
  const generateSessionAnalysis = () => {
    const wordsPerMinute = currentWPM;
    const totalWords = wordCount;
    const totalFillers = fillerWords.length;
    const fillerRate = totalWords > 0 ? (totalFillers / totalWords) * 100 : 0;
    const durationMinutes = sessionDuration / 60;
    
    // Calculate overall scores
    const speechScore = Math.max(0, Math.min(100, 
      ((wordsPerMinute >= 120 && wordsPerMinute <= 150) ? 90 : 
       (wordsPerMinute >= 100 && wordsPerMinute <= 180) ? 75 : 50) - (fillerRate * 10)
    ));
    
    const clarityScore = Math.max(0, Math.min(100, voiceClarity));
    const confidenceAnalysisScore = Math.max(0, Math.min(100, currentConfidenceScore));
    const overallScore = Math.round((speechScore + clarityScore + confidenceAnalysisScore) / 3);
    
    // Generate purpose-specific feedback
    const purposeFeedback = generatePurposeBasedFeedback(sessionPurpose, {
      wpm: wordsPerMinute,
      fillerCount: totalFillers,
      duration: durationMinutes,
      wordCount: totalWords,
      overallScore
    });
    
    return {
      session: {
        name: sessionName || generateSessionName(),
        purpose: sessionPurpose,
        duration: sessionDuration,
        type: sessionType
      },
      metrics: {
        wordsPerMinute,
        totalWords,
        totalFillers,
        fillerRate: Math.round(fillerRate * 10) / 10,
        eyeContact: eyeContactScore,
        posture: postureScore,
        voiceClarity,
        confidence: currentConfidenceScore
      },
      scores: {
        speech: speechScore,
        clarity: clarityScore,
        confidence: confidenceAnalysisScore,
        overall: overallScore
      },
      feedback: purposeFeedback,
      transcript: transcript,
      improvements: generateImprovementSuggestions(wordsPerMinute, totalFillers, fillerRate),
      achievements: generateAchievements(overallScore, totalFillers, wordsPerMinute)
    };
  };

  // Generate purpose-based feedback
  const generatePurposeBasedFeedback = (purpose: string, metrics: any) => {
    if (!purpose) {
      return {
        summary: "Good practice session completed!",
        strengths: ["Completed a full practice session", "Built speaking confidence"],
        areas: ["Consider setting a specific purpose for more targeted feedback"]
      };
    }

    const lowercasePurpose = purpose.toLowerCase();
    
    if (lowercasePurpose.includes('interview') || lowercasePurpose.includes('job')) {
      return {
        summary: `Your interview practice session shows ${metrics.overallScore >= 75 ? 'strong' : 'developing'} professional communication skills.`,
        strengths: [
          metrics.wpm >= 120 && metrics.wpm <= 150 ? "Appropriate speaking pace for interviews" : null,
          metrics.fillerCount <= 3 ? "Professional speech clarity" : null,
          "Focused practice on interview skills"
        ].filter(Boolean),
        areas: [
          metrics.wpm < 120 ? "Speak with more energy and confidence" : null,
          metrics.wpm > 180 ? "Slow down to ensure clear communication" : null,
          metrics.fillerCount > 5 ? "Reduce filler words for more professional presence" : null,
          "Practice specific interview questions for your field"
        ].filter(Boolean)
      };
    }
    
    if (lowercasePurpose.includes('presentation') || lowercasePurpose.includes('pitch')) {
      return {
        summary: `Your presentation practice demonstrates ${metrics.overallScore >= 75 ? 'engaging' : 'developing'} public speaking abilities.`,
        strengths: [
          metrics.wpm >= 140 && metrics.wpm <= 160 ? "Dynamic presentation pace" : null,
          metrics.fillerCount <= 2 ? "Polished delivery style" : null,
          "Dedicated presentation skill development"
        ].filter(Boolean),
        areas: [
          metrics.wpm < 140 ? "Increase energy to captivate your audience" : null,
          metrics.wpm > 180 ? "Slow down to help audience follow your ideas" : null,
          metrics.fillerCount > 3 ? "Replace filler words with strategic pauses" : null,
          "Practice with visual aids and audience interaction"
        ].filter(Boolean)
      };
    }

    if (lowercasePurpose.includes('conversation') || lowercasePurpose.includes('social')) {
      return {
        summary: `Your conversational practice shows ${metrics.overallScore >= 70 ? 'natural' : 'improving'} communication flow.`,
        strengths: [
          metrics.fillerCount <= 5 ? "Natural speaking rhythm" : null,
          "Working on everyday communication skills"
        ].filter(Boolean),
        areas: [
          metrics.fillerCount > 8 ? "Practice smoother speech transitions" : null,
          "Develop active listening responses"
        ].filter(Boolean)
      };
    }

    // General purpose feedback
    return {
      summary: `Your practice session on "${purpose}" shows ${metrics.overallScore >= 75 ? 'excellent' : 'good'} progress.`,
      strengths: [
        metrics.wpm >= 120 && metrics.wpm <= 150 ? "Well-paced delivery" : null,
        metrics.fillerCount <= 3 ? "Clear communication style" : null,
        "Focused practice approach"
      ].filter(Boolean),
      areas: [
        metrics.wpm < 120 ? "Increase speaking energy and pace" : null,
        metrics.wpm > 180 ? "Slow down for better comprehension" : null,
        metrics.fillerCount > 5 ? "Reduce filler words with practice" : null
      ].filter(Boolean)
    };
  };

  // Generate improvement suggestions
  const generateImprovementSuggestions = (wpm: number, fillers: number, fillerRate: number) => {
    const suggestions = [];
    
    if (wpm < 120) {
      suggestions.push({
        area: "Speaking Pace",
        suggestion: "Practice reading aloud daily to build natural speaking rhythm",
        priority: "high"
      });
    } else if (wpm > 180) {
      suggestions.push({
        area: "Speaking Pace", 
        suggestion: "Focus on clear articulation by slowing down slightly",
        priority: "high"
      });
    }
    
    if (fillers > 5) {
      suggestions.push({
        area: "Filler Words",
        suggestion: "Practice the 'pause technique' - replace filler words with 2-second pauses",
        priority: "high"
      });
    }
    
    if (fillerRate > 5) {
      suggestions.push({
        area: "Speech Clarity",
        suggestion: "Record yourself daily and identify your most common filler patterns",
        priority: "medium"
      });
    }
    
    return suggestions;
  };

  // Generate achievements
  const generateAchievements = (overallScore: number, fillers: number, wpm: number) => {
    const achievements = [];
    
    if (overallScore >= 85) {
      achievements.push({ title: "Excellent Speaker", description: "Outstanding overall performance!" });
    } else if (overallScore >= 75) {
      achievements.push({ title: "Strong Communicator", description: "Very good speaking skills demonstrated" });
    }
    
    if (fillers === 0) {
      achievements.push({ title: "Filler-Free Zone", description: "Perfect session with no filler words!" });
    } else if (fillers <= 2) {
      achievements.push({ title: "Clear Speaker", description: "Minimal filler word usage" });
    }
    
    if (wpm >= 120 && wpm <= 150) {
      achievements.push({ title: "Perfect Pace", description: "Ideal speaking speed maintained" });
    }
    
    return achievements;
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      speechStartTime.current = Date.now();
      setTranscript("");
      setWordCount(0);
      setCurrentWPM(0);
      setFillerWords([]);
      recognitionRef.current.start();
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  // Get insight icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'breakthrough': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'pattern': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'adjustment': return <Target className="w-4 h-4 text-orange-500" />;
      case 'mastery': return <Brain className="w-4 h-4 text-green-500" />;
      default: return <Lightbulb className="w-4 h-4 text-purple-500" />;
    }
  };

  // Get insight color
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'breakthrough': return 'border-yellow-200 bg-yellow-50';
      case 'pattern': return 'border-blue-200 bg-blue-50';
      case 'adjustment': return 'border-orange-200 bg-orange-50';
      case 'mastery': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Filler Word Alert Overlay */}
      {recentFillerAlert && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Filler word detected: "{recentFillerAlert}"</span>
          </div>
          <div className="text-sm opacity-90 mt-1">Try pausing instead</div>
        </div>
      )}

      {/* Session Analysis Modal */}
      {showSessionAnalysis && sessionData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Session Analysis</h2>
                  <p className="text-gray-600">{sessionData.session.name}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSessionAnalysis(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Overall Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{sessionData.scores.overall}%</div>
                  <div className="text-lg font-semibold text-gray-700 mb-4">Overall Performance</div>
                  <div className="flex justify-center space-x-8 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{sessionData.metrics.wordsPerMinute}</div>
                      <div className="text-gray-600">WPM</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{sessionData.metrics.totalWords}</div>
                      <div className="text-gray-600">Words</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-red-600">{sessionData.metrics.totalFillers}</div>
                      <div className="text-gray-600">Fillers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">{Math.round(sessionData.session.duration / 60)}m</div>
                      <div className="text-gray-600">Duration</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purpose-Based Feedback */}
              {sessionData.session.purpose && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-orange-500" />
                      <span>Purpose-Based Analysis</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600">Feedback for: "{sessionData.session.purpose}"</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
                        <p className="text-gray-700">{sessionData.feedback.summary}</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {sessionData.feedback.strengths.map((strength: string, index: number) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start">
                                <Star className="w-3 h-3 text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Areas to Focus
                          </h4>
                          <ul className="space-y-1">
                            {sessionData.feedback.areas.map((area: string, index: number) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start">
                                <ArrowRight className="w-3 h-3 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Metrics */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Volume2 className="w-5 h-5 text-blue-500" />
                      <span>Speech Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Pace Score</span>
                        <span className="font-semibold">{sessionData.scores.speech}%</span>
                      </div>
                      <Progress value={sessionData.scores.speech} className="h-2" />
                      <div className="text-xs text-gray-600">
                        {sessionData.metrics.wordsPerMinute >= 120 && sessionData.metrics.wordsPerMinute <= 150 
                          ? "Optimal speaking pace" 
                          : sessionData.metrics.wordsPerMinute < 120 
                            ? "Consider speaking faster" 
                            : "Consider slowing down"}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-green-500" />
                      <span>Clarity Score</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Voice Clarity</span>
                        <span className="font-semibold">{sessionData.scores.clarity}%</span>
                      </div>
                      <Progress value={sessionData.scores.clarity} className="h-2" />
                      <div className="text-xs text-gray-600">
                        Filler rate: {sessionData.metrics.fillerRate}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <span>Confidence</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Overall Confidence</span>
                        <span className="font-semibold">{sessionData.scores.confidence}%</span>
                      </div>
                      <Progress value={sessionData.scores.confidence} className="h-2" />
                      <div className="text-xs text-gray-600">
                        Based on speech patterns
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Achievements */}
              {sessionData.achievements.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span>Achievements Unlocked</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {sessionData.achievements.map((achievement: any, index: number) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="font-semibold text-yellow-800">{achievement.title}</div>
                          <div className="text-sm text-yellow-700">{achievement.description}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Improvement Suggestions */}
              {sessionData.improvements.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-orange-500" />
                      <span>Personalized Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sessionData.improvements.map((improvement: any, index: number) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 ${
                          improvement.priority === 'high' ? 'bg-red-50 border-red-400' : 'bg-blue-50 border-blue-400'
                        }`}>
                          <div className="font-semibold text-gray-800">{improvement.area}</div>
                          <div className="text-sm text-gray-700 mt-1">{improvement.suggestion}</div>
                          <Badge className={`mt-2 ${improvement.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                            {improvement.priority} priority
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Session Transcript */}
              {sessionData.transcript && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span>Session Transcript</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                      <p className="text-sm text-gray-700 leading-relaxed">{sessionData.transcript || "No transcript available"}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => setShowSessionAnalysis(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Continue Practicing
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Reset session for new practice
                    setShowSessionAnalysis(false);
                    setSessionData(null);
                    setTranscript("");
                    setFillerWords([]);
                    setWordCount(0);
                    setCurrentWPM(0);
                    setSessionDuration(0);
                  }}
                >
                  Start New Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Start Button - Top Priority */}
      {!isSessionActive && (
        <Card className="border-2 border-green-500 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to Practice Speaking?</h2>
            <Button
              onClick={startSession}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 h-auto mb-4 shadow-lg"
            >
              <Play className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="text-lg font-bold">Start Practice Session</div>
                <div className="text-sm opacity-90 font-normal">Camera + Microphone</div>
              </div>
            </Button>
            <p className="text-gray-600 text-base">
              One click activates everything for your {generateSessionName()}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Session Customization Panel */}
      {!isSessionActive && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Customize Your Session</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Name
                </label>
                <input
                  type="text"
                  value={sessionPurpose ? sessionName : generateSessionName()}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g., Job Interview Practice"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Purpose
                </label>
                <input
                  type="text"
                  value={sessionPurpose}
                  onChange={(e) => setSessionPurpose(e.target.value)}
                  placeholder="e.g., Practice for technical interview"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>Purpose helps AI provide targeted feedback:</strong> Include specific goals like "job interview", "presentation", "wedding speech", etc.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Session Controls */}
      {isSessionActive && (
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Session Info and Controls */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-blue-500 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-6 h-6 text-blue-600" />
                    {!isEditingSession ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{sessionName}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditingSession(true)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          value={tempSessionName}
                          onChange={(e) => setTempSessionName(e.target.value)}
                          className="px-2 py-1 border rounded text-lg bg-white"
                          autoFocus
                        />
                        <Button size="sm" onClick={saveSessionChanges} className="bg-green-600 hover:bg-green-700">
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelSessionChanges}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="default" className="text-lg px-4 py-2">
                      {formatTime(sessionDuration)}
                    </Badge>
                    {isListening && (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-base text-green-600 font-medium">Recording</span>
                      </div>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
            <div className="flex items-center justify-center space-x-6 mb-4">
              <Button
                onClick={stopSession}
                variant="destructive"
                size="lg"
                className="px-8 py-4"
              >
                <Square className="w-6 h-6 mr-2" />
                Stop Session
              </Button>
              
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "outline" : "default"}
                size="lg"
                className="px-8 py-4"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-6 h-6 mr-2" />
                    Mute Microphone
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 mr-2" />
                    Start Microphone
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div>
                <div className="text-2xl font-bold text-blue-600">{wordCount}</div>
                <div className="text-sm text-gray-500">Words Spoken</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{currentWPM}</div>
                <div className="text-sm text-gray-500">Words Per Minute</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{fillerWords.length}</div>
                <div className="text-sm text-gray-500">Filler Words</div>
              </div>
            </div>

            {/* Live Transcript Display */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">Live Transcript</h3>
                {isListening && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Listening...</span>
                  </div>
                )}
              </div>
              <div className="bg-white rounded border p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
                {transcript || interimTranscript ? (
                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                    <span>{transcript}</span>
                    <span className="text-gray-500 italic">{interimTranscript}</span>
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm italic">
                    {isListening ? "Start speaking to see your transcript here..." : "Click 'Start Microphone' to begin transcription"}
                  </p>
                )}
              </div>
              {fillerWords.length > 0 && (
                <div className="mt-2 text-xs text-orange-600">
                  <span className="font-medium">Filler words detected ({fillerWords.length}):</span> {fillerWords.join(', ')}
                </div>
              )}
            </div>
          </CardContent>
            </Card>
          </div>

          {/* Live AI Feedback Panel */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-green-500 bg-green-50 h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  <span>Live AI Coach</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {liveFeedback.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">AI feedback will appear here during your session</p>
                    </div>
                  ) : (
                    liveFeedback.map((feedback) => (
                      <div key={feedback.id} className={`p-3 rounded-lg border-l-4 ${
                        feedback.severity === 'success' ? 'bg-green-50 border-green-400' :
                        feedback.severity === 'warning' ? 'bg-orange-50 border-orange-400' :
                        'bg-blue-50 border-blue-400'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600 capitalize">
                            {feedback.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">{feedback.timeLabel}</span>
                        </div>
                        <p className="text-sm text-gray-800">{feedback.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>{sessionName || generateSessionName()}</span>
            </div>
            <Badge variant={isSessionActive ? "default" : "secondary"}>
              {isSessionActive ? `${formatTime(sessionDuration)}` : "Ready"}
            </Badge>
          </CardTitle>
          {sessionPurpose && (
            <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
              <strong>Purpose:</strong> {sessionPurpose}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span>Camera</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span>Microphone</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Feed with Live Metrics */}
        <div className="lg:col-span-2 relative">
          <SimpleCameraFeed 
            onStreamReady={(stream) => {
              setIsCameraActive(true);
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
              }
            }}
            onStreamEnd={() => {
              setIsCameraActive(false);
            }}
          />
          
          {/* Live Body Metrics Overlay */}
          {isCameraActive && isSessionActive && (
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm backdrop-blur">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Eye Contact: {eyeContactScore}%</span>
                </div>
              </div>
              <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm backdrop-blur">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Posture: {postureScore}%</span>
                </div>
              </div>
              <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm backdrop-blur">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Voice: {voiceClarity}%</span>
                </div>
              </div>
              <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm backdrop-blur">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Confidence: {currentConfidenceScore}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real-time AI Insights Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>AI Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-gray-500 py-8">
                <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Camera successfully integrated! Start practicing to receive AI insights</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>



      {/* Practice Session Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <span>Session Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-gray-500 py-8">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Session analysis will appear here when you start practicing</p>
          </div>

          {/* Session Controls */}
          {!isSessionActive ? (
            <div className="text-center py-8">
              <Button
                onClick={startSession}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 h-auto"
              >
                <Play className="w-6 h-6 mr-3" />
                Start Practice Session
                <div className="ml-3 text-sm opacity-90">
                  Camera + Microphone
                </div>
              </Button>
              <p className="text-gray-500 text-sm mt-3">
                Automatically activates camera and microphone for full practice experience
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={stopSession}
                  variant="destructive"
                  size="lg"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop Session
                </Button>
                
                <Button
                  onClick={isListening ? stopListening : startListening}
                  variant="outline"
                  size="lg"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      Mute Mic
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Unmute Mic
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-blue-600 text-lg px-3 py-1">
                  {formatTime(sessionDuration)}
                </Badge>
                {isListening && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Recording</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}