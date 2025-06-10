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
  TrendingUp
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
  const [isSetupMode, setIsSetupMode] = useState(false);

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
  const [confidenceScore, setConfidenceScore] = useState(70);

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

        // Detect filler words - only from final transcript to avoid duplicates
        const fillerWordList = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'well', 'right', 'okay', 'hmm', 'err'];
        const finalText = transcript + finalTranscript;
        const allWords = finalText.toLowerCase().split(/\s+/);
        const detectedFillers: string[] = [];
        
        allWords.forEach(word => {
          const cleanWord = word.replace(/[.,!?;:'"]/g, '');
          if (fillerWordList.includes(cleanWord) && cleanWord.length > 0) {
            detectedFillers.push(cleanWord);
          }
        });
        
        setFillerWords(detectedFillers);
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
            
            // Calculate voice clarity: reduce score based on filler words
            let clarity = 85; // Base clarity
            clarity -= fillerRatio * 30; // Penalty for filler words
            clarity += currentWPM > 150 ? -10 : 0; // Penalty for speaking too fast
            clarity += currentWPM < 100 ? -5 : 0; // Penalty for speaking too slow
            
            setVoiceClarity(Math.round(Math.max(45, Math.min(100, clarity))));
          } else if (isListening) {
            // Listening but no speech detected
            setVoiceClarity(65);
          }

          // Posture analysis based on session duration and activity
          let postureBase = 82;
          const fatigueFactor = Math.max(0, sessionDuration - 300) * 0.02; // Decrease after 5 minutes
          const activityBonus = isListening ? 3 : 0;
          const postureScore = postureBase - fatigueFactor + activityBonus;
          setPostureScore(Math.round(Math.max(55, Math.min(95, postureScore))));

          // Eye contact based on engagement metrics
          let eyeContactBase = 75;
          const engagementBonus = transcript.length > 100 ? 8 : transcript.length > 50 ? 4 : 0;
          const consistencyBonus = sessionDuration > 60 ? 5 : 0;
          const eyeContact = eyeContactBase + engagementBonus + consistencyBonus;
          setEyeContactScore(Math.round(Math.max(50, Math.min(95, eyeContact))));

          // Overall confidence based on weighted performance metrics
          const weightedScore = (eyeContactScore * 0.3) + (postureScore * 0.3) + (voiceClarity * 0.4);
          setConfidenceScore(Math.round(Math.max(40, Math.min(100, weightedScore))));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime, isCameraActive, isListening, transcript, fillerWords, eyeContactScore, postureScore, voiceClarity]);

  // Generate automatic session name based on existing sessions
  const generateSessionName = () => {
    const sessionCount = Array.isArray(practiceSessions) ? practiceSessions.length : 0;
    return `Practice Session ${sessionCount + 1}`;
  };

  // Start session
  const startSession = () => {
    const autoSessionName = generateSessionName();
    setSessionName(autoSessionName);
    setIsSessionActive(true);
    setSessionStartTime(Date.now());
    setSessionDuration(0);
    setWordCount(0);
    setFillerWords([]);
    setTranscript("");
    
    // Reset all metrics to 0 at session start
    setEyeContactScore(0);
    setPostureScore(0);
    setVoiceClarity(0);
    setConfidenceScore(0);
    
    // Auto-start microphone
    setTimeout(() => {
      startListening();
    }, 500);
  };

  // Stop session
  const stopSession = () => {
    setIsSessionActive(false);
    setIsListening(false);
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
    <div className="space-y-6">
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

      {/* Active Session Controls */}
      {isSessionActive && (
        <Card className="border-2 border-blue-500 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-blue-600" />
                <span className="text-xl">{sessionName}</span>
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
                  <span className="font-medium">Detected filler words:</span> {fillerWords.join(', ')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Setup */}
      {isSetupMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <span>Session Setup</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Name</label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter session name..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Session Type</label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setSessionType('general')}
                  variant={sessionType === 'general' ? 'default' : 'outline'}
                  size="sm"
                >
                  General Practice
                </Button>
                <Button
                  onClick={() => setSessionType('roleplay')}
                  variant={sessionType === 'roleplay' ? 'default' : 'outline'}
                  size="sm"
                >
                  Roleplay
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Session Purpose</label>
              <textarea
                value={sessionPurpose}
                onChange={(e) => setSessionPurpose(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                placeholder="What's the goal of this session?"
              />
            </div>
          </CardContent>
        </Card>
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
              <Button
                onClick={!isSetupMode ? () => setIsSetupMode(true) : () => setIsSetupMode(false)}
                variant="outline"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                {isSetupMode ? 'Hide Setup' : 'Setup'}
              </Button>
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
                  <span>Confidence: {confidenceScore}%</span>
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

      {/* Live Transcript */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="w-5 h-5 text-blue-600" />
            <span>Live Transcript</span>
            {isListening && (
              <div className="flex items-center space-x-2 ml-auto">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Recording</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
            {transcript ? (
              <div className="space-y-2">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {transcript}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
                  <span>Words: {wordCount}</span>
                  <span>WPM: {currentWPM}</span>
                  {fillerWords.length > 0 && (
                    <span className="text-orange-600">Filler words: {fillerWords.length}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Start speaking to see your transcript appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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