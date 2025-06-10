import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [currentWPM, setCurrentWPM] = useState(0);
  const [fillerWords, setFillerWords] = useState<string[]>([]);

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

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        const now = Date.now();
        setSessionDuration(Math.floor((now - sessionStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime]);

  // Start session
  const startSession = () => {
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

  // Start/stop listening (placeholder)
  const startListening = () => setIsListening(true);
  const stopListening = () => setIsListening(false);

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
              <span>{sessionName || "Practice Session"}</span>
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
        {/* Video Feed with Integrated Analysis */}
        <div className="lg:col-span-2">
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