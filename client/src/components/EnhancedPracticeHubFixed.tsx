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
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript + interimTranscript;
        setTranscript(prev => prev + finalTranscript);
        
        // Count words and calculate WPM
        const words = fullTranscript.trim().split(/\s+/).filter(word => word.length > 0);
        setWordCount(words.length);
        
        if (speechStartTime.current > 0) {
          const elapsed = (Date.now() - speechStartTime.current) / 1000 / 60; // minutes
          const wpm = elapsed > 0 ? Math.round(words.length / elapsed) : 0;
          setCurrentWPM(wpm);
        }

        // Detect filler words
        const fillerWordList = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically'];
        const detectedFillers = words.filter(word => 
          fillerWordList.includes(word.toLowerCase().replace(/[.,!?]/g, ''))
        );
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
        
        // Simulate dynamic body metrics with realistic variations
        if (isCameraActive) {
          setEyeContactScore(prev => Math.max(50, Math.min(100, prev + (Math.random() - 0.5) * 8)));
          setPostureScore(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 6)));
          setVoiceClarity(prev => Math.max(70, Math.min(100, prev + (Math.random() - 0.5) * 4)));
          setConfidenceScore(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 5)));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime, isCameraActive]);

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
        {/* Video Feed with Body Metrics Overlay */}
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
          {isCameraActive && (
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
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <Button
                onClick={isSessionActive ? stopSession : startSession}
                variant={isSessionActive ? "destructive" : "default"}
                className={isSessionActive ? "" : "bg-green-600 hover:bg-green-700"}
              >
                {isSessionActive ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Session
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Session
                  </>
                )}
              </Button>
              
              <Button
                onClick={isListening ? stopListening : startListening}
                variant="outline"
                disabled={!isSessionActive}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Mute
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Unmute
                  </>
                )}
              </Button>
            </div>
            
            {isSessionActive && (
              <Badge variant="outline" className="text-blue-600">
                {formatTime(sessionDuration)}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}