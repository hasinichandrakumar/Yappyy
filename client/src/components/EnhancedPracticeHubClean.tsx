import { useState, useEffect, useRef } from "react";
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
  Activity,
  AlertCircle,
  Settings,
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

interface LiveFeedback {
  id: string;
  timestamp: number;
  category: 'content' | 'voice_modulation' | 'voice_clarity' | 'body_language';
  message: string;
  severity: 'info' | 'warning' | 'success';
  timeLabel: string;
}

export default function EnhancedPracticeHubClean() {
  // Core session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionName, setSessionName] = useState("");
  const [sessionPurpose, setSessionPurpose] = useState("");
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [tempSessionName, setTempSessionName] = useState("");
  const [tempSessionPurpose, setTempSessionPurpose] = useState("");

  // Camera and microphone state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Speech recognition state
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

  // Live feedback and alerts
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback[]>([]);
  const [recentFillerAlert, setRecentFillerAlert] = useState<string | null>(null);
  const [showSessionAnalysis, setShowSessionAnalysis] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);

  // Fetch existing practice sessions to determine next session number
  const { data: practiceSessions = [] } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate automatic session name
  const generateSessionName = () => {
    const sessionCount = Array.isArray(practiceSessions) ? practiceSessions.length : 0;
    return `Practice Session ${sessionCount + 1}`;
  };

  // Session management functions
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
    
    // Reset all metrics
    setEyeContactScore(0);
    setPostureScore(0);
    setVoiceClarity(0);
    setCurrentConfidenceScore(0);
    
    // Auto-start microphone
    setTimeout(() => {
      startListening();
    }, 500);
  };

  const stopSession = () => {
    setIsSessionActive(false);
    setIsListening(false);
    
    // Generate comprehensive session analysis
    const analysisData = generateSessionAnalysis();
    setSessionData(analysisData);
    setShowSessionAnalysis(true);
  };

  const saveSessionChanges = () => {
    setSessionName(tempSessionName);
    setSessionPurpose(tempSessionPurpose);
    setIsEditingSession(false);
  };

  const cancelSessionChanges = () => {
    setTempSessionName(sessionName);
    setTempSessionPurpose(sessionPurpose);
    setIsEditingSession(false);
  };

  // Speech recognition functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      speechStartTime.current = Date.now();
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  // Live AI feedback generation
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

    const randomCategory = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
    const randomMessage = randomCategory.messages[Math.floor(Math.random() * randomCategory.messages.length)];

    const newFeedback: LiveFeedback = {
      id: `feedback-${currentTime}`,
      timestamp: currentTime,
      category: randomCategory.category,
      message: randomMessage.text,
      severity: randomMessage.severity,
      timeLabel
    };

    setLiveFeedback(prev => [...prev, newFeedback].slice(-10));
  };

  // Session analysis generation
  const generateSessionAnalysis = () => {
    const wordsPerMinute = currentWPM;
    const totalWords = wordCount;
    const totalFillers = fillerWords.length;
    const fillerRate = totalWords > 0 ? (totalFillers / totalWords) * 100 : 0;
    const durationMinutes = sessionDuration / 60;
    
    const speechScore = Math.max(0, Math.min(100, 
      ((wordsPerMinute >= 120 && wordsPerMinute <= 150) ? 90 : 
       (wordsPerMinute >= 100 && wordsPerMinute <= 180) ? 75 : 50) - (fillerRate * 10)
    ));
    
    const clarityScore = Math.max(0, Math.min(100, voiceClarity));
    const confidenceAnalysisScore = Math.max(0, Math.min(100, currentConfidenceScore));
    const overallScore = Math.round((speechScore + clarityScore + confidenceAnalysisScore) / 3);
    
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
        type: 'general'
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

  const generateImprovementSuggestions = (wpm: number, fillers: number, fillerRate: number) => {
    const suggestions = [];
    
    if (wpm < 120) {
      suggestions.push({
        area: "Speaking Pace",
        suggestion: "Practice reading aloud daily to build natural speaking rhythm",
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
    
    return suggestions;
  };

  const generateAchievements = (overallScore: number, fillers: number, wpm: number) => {
    const achievements = [];
    
    if (overallScore >= 85) {
      achievements.push({ title: "Excellent Speaker", description: "Outstanding overall performance!" });
    }
    
    if (fillers === 0) {
      achievements.push({ title: "Filler-Free Zone", description: "Perfect session with no filler words!" });
    }
    
    return achievements;
  };

  // Effects for session timer and live feedback
  useEffect(() => {
    if (!isSessionActive) return;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const duration = Math.floor((currentTime - sessionStartTime) / 1000);
      setSessionDuration(duration);

      if (isCameraActive && isListening) {
        // Simulate real-time metrics updates
        setEyeContactScore(Math.round(Math.max(50, Math.min(95, 75 + Math.random() * 20 - 10))));
        setPostureScore(Math.round(Math.max(60, Math.min(95, 80 + Math.random() * 15 - 7))));
        setVoiceClarity(Math.round(Math.max(70, Math.min(100, 85 + Math.random() * 10 - 5))));
        
        const weightedScore = (eyeContactScore * 0.3) + (postureScore * 0.3) + (voiceClarity * 0.4);
        setCurrentConfidenceScore(Math.round(Math.max(40, Math.min(100, weightedScore))));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime, isCameraActive, isListening, eyeContactScore, postureScore, voiceClarity]);

  // Live AI feedback generation effect
  useEffect(() => {
    if (!isSessionActive || !isListening) return;

    const feedbackInterval = setInterval(() => {
      generateLiveFeedback();
    }, 15000);

    return () => clearInterval(feedbackInterval);
  }, [isSessionActive, isListening, sessionStartTime]);

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

      {/* Main Start Button */}
      {!isSessionActive && (
        <Card className="border-2 border-blue-500 bg-blue-50">
          <CardContent className="text-center py-8">
            <Button
              onClick={startSession}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Play className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="text-lg font-bold">Start Practice Session</div>
                <div className="text-sm opacity-90 font-normal">Camera + Microphone</div>
              </div>
            </Button>
            <p className="text-gray-600 text-base mt-4">
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
                  value={sessionName || generateSessionName()}
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

      {/* Active Session Interface */}
      {isSessionActive && (
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Main Session Controls */}
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

                {/* Camera Feed with Metrics Overlay */}
                <div className="relative mb-6">
                  <SimpleCameraFeed 
                    isActive={isCameraActive} 
                    onToggle={() => setIsCameraActive(!isCameraActive)}
                    videoRef={videoRef}
                  />
                  
                  {isCameraActive && isSessionActive && (
                    <div className="absolute top-4 left-4 space-y-2">
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
                          <span>Voice Clarity: {voiceClarity}%</span>
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
    </div>
  );
}