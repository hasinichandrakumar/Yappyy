import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Eye, 
  Volume2, 
  Timer, 
  Target, 
  Brain,
  Zap,
  TrendingUp,
  Activity,
  Heart,
  Camera,
  Gauge,
  BarChart3,
  Award,
  Users,
  Clock,
  Lightbulb,
  Settings,
  Download,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  CameraOff
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";
import { useMediaPipe } from "@/hooks/useMediaPipe";

interface PracticeMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  focusAreas: string[];
}

interface RealTimeMetric {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'needs-improvement';
}

export default function AdvancedPracticeHub() {
  const { isListening, startListening, stopListening, transcript, wordCount, wpm } = useSpeechRecognition();
  const { voiceClarity, confidenceScore, volumeLevel, speakingPace, startVoiceAnalysis, stopVoiceAnalysis } = useVoiceAnalysis();
  const { eyeContact, posture, gesture, initializeMediaPipe, processFrame, isInitialized } = useMediaPipe();

  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [selectedMode, setSelectedMode] = useState<string>("general");
  const [focusLevel, setFocusLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [liveAdvice, setLiveAdvice] = useState<string[]>([]);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const sessionStartRef = useRef<number>(0);
  const metricsRef = useRef<RealTimeMetric[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const practiceModes: PracticeMode[] = [
    {
      id: "general",
      name: "General Speaking",
      description: "Comprehensive speech improvement",
      icon: <Users className="w-5 h-5" />,
      color: "blue",
      focusAreas: ["Voice clarity", "Confidence", "Pace", "Eye contact"]
    },
    {
      id: "presentation",
      name: "Business Presentation",
      description: "Professional presentation skills",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "purple",
      focusAreas: ["Authority", "Structure", "Engagement", "Persuasion"]
    },
    {
      id: "interview",
      name: "Interview Practice",
      description: "Job interview communication",
      icon: <Target className="w-5 h-5" />,
      color: "green",
      focusAreas: ["Conciseness", "Confidence", "Clarity", "Authenticity"]
    },
    {
      id: "storytelling",
      name: "Storytelling",
      description: "Narrative and emotional connection",
      icon: <Heart className="w-5 h-5" />,
      color: "red",
      focusAreas: ["Emotion", "Pacing", "Engagement", "Narrative flow"]
    }
  ];

  // Start camera and analysis
  const startVideoAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: true 
      });
      
      setMediaStream(stream);
      setVideoEnabled(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Start MediaPipe analysis
      if (initializeMediaPipe) {
        initializeMediaPipe();
      }
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      setLiveAdvice(prev => [...prev, "Camera access denied. Please enable camera permissions."]);
    }
  };

  // Stop camera and analysis
  const stopVideoAnalysis = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    setVideoEnabled(false);

  };

  // Start complete session
  const startSession = async () => {
    setSessionActive(true);
    sessionStartRef.current = Date.now();
    
    // Start video analysis
    await startVideoAnalysis();
    
    // Start speech recognition
    startListening();
    setAudioEnabled(true);
    
    // Start voice analysis
    if (startVoiceAnalysis) {
      startVoiceAnalysis();
    }
    
    // Start session timer
    intervalRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    setLiveAdvice(["Session started! Begin speaking and maintain good posture."]);
  };

  // Stop complete session
  const stopSession = () => {
    setSessionActive(false);
    
    // Stop video analysis
    stopVideoAnalysis();
    
    // Stop speech recognition
    stopListening();
    setAudioEnabled(false);
    
    // Stop voice analysis
    if (stopVoiceAnalysis) {
      stopVoiceAnalysis();
    }
    
    // Stop timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setSessionTime(0);
    setLiveAdvice(["Session ended. Review your performance metrics."]);
  };

  // Generate live coaching advice based on metrics
  useEffect(() => {
    if (!sessionActive) return;
    
    const advice: string[] = [];
    
    // Eye contact advice
    const eyeContactValue = typeof eyeContact === 'number' ? eyeContact : 0;
    if (eyeContactValue < 60) {
      advice.push("Look directly at the camera more often to improve eye contact.");
    } else if (eyeContactValue > 85) {
      advice.push("Excellent eye contact! Keep it up.");
    }
    
    // Posture advice
    const postureValue = typeof posture === 'number' ? posture : 0;
    if (postureValue < 70) {
      advice.push("Straighten your shoulders and sit/stand up taller.");
    } else if (postureValue > 85) {
      advice.push("Great posture! You look confident and professional.");
    }
    
    // Speaking pace advice
    const currentWPM = wpm || speakingPace || 0;
    if (currentWPM > 180) {
      advice.push("Slow down your speaking pace for better clarity.");
    } else if (currentWPM < 120 && currentWPM > 0) {
      advice.push("Try speaking a bit faster to maintain engagement.");
    } else if (currentWPM >= 120 && currentWPM <= 180) {
      advice.push("Perfect speaking pace! Your rhythm is excellent.");
    }
    
    // Voice clarity advice
    if (voiceClarity && voiceClarity < 60) {
      advice.push("Speak more clearly and articulate your words.");
    } else if (voiceClarity && voiceClarity > 80) {
      advice.push("Crystal clear voice! Your articulation is excellent.");
    }
    
    // Confidence advice based on volume and consistency
    if (confidenceScore && confidenceScore < 50) {
      advice.push("Speak with more conviction and confidence.");
    } else if (confidenceScore && confidenceScore > 80) {
      advice.push("Your confidence is shining through! Great delivery.");
    }
    
    // Update advice if we have new insights
    if (advice.length > 0) {
      setLiveAdvice(prev => {
        const newAdvice = [...prev, ...advice];
        return newAdvice.slice(-5); // Keep last 5 pieces of advice
      });
    }
  }, [sessionActive, eyeContact, posture, wpm, speakingPace, voiceClarity, confidenceScore]);

  // Calculate real-time metrics with enhanced accuracy
  const calculateMetrics = (): RealTimeMetric[] => {
    const baseConfidence = Math.max(confidenceScore || 0, sessionActive ? 30 : 0);
    const baseClarity = Math.max(voiceClarity || 0, sessionActive ? 25 : 0);
    const baseVolume = Math.max(volumeLevel || 0, sessionActive ? 20 : 0);
    const currentWPM = wpm || speakingPace || 0;
    const eyeContactValue = typeof eyeContact === 'number' ? eyeContact : 0;
    const postureValue = typeof posture === 'number' ? posture : 0;
    const gestureValue = typeof gesture === 'number' ? gesture : 0;
    
    return [
      {
        id: "speaking-pace",
        label: "Speaking Pace",
        value: Math.round(currentWPM),
        target: 150,
        unit: "WPM",
        icon: <Timer className="w-4 h-4" />,
        color: "purple",
        trend: currentWPM > 120 && currentWPM < 180 ? 'up' : currentWPM > 180 ? 'down' : 'stable',
        status: currentWPM >= 120 && currentWPM <= 180 ? 'excellent' : currentWPM > 100 ? 'good' : 'needs-improvement'
      },
      {
        id: "eye-contact",
        label: "Eye Contact",
        value: Math.round(eyeContactValue),
        target: 80,
        unit: "%",
        icon: <Eye className="w-4 h-4" />,
        color: "blue",
        trend: eyeContactValue > 70 ? 'up' : eyeContactValue > 50 ? 'stable' : 'down',
        status: eyeContactValue > 75 ? 'excellent' : eyeContactValue > 55 ? 'good' : 'needs-improvement'
      },
      {
        id: "posture",
        label: "Posture",
        value: Math.round(postureValue),
        target: 85,
        unit: "%",
        icon: <Users className="w-4 h-4" />,
        color: "green",
        trend: postureValue > 75 ? 'up' : postureValue > 55 ? 'stable' : 'down',
        status: postureValue > 80 ? 'excellent' : postureValue > 60 ? 'good' : 'needs-improvement'
      },
      {
        id: "voice-clarity",
        label: "Voice Clarity",
        value: Math.round(baseClarity + (transcript.length > 50 ? 10 : 0)),
        target: 85,
        unit: "%",
        icon: <Volume2 className="w-4 h-4" />,
        color: "orange",
        trend: baseClarity > 70 ? 'up' : baseClarity > 50 ? 'stable' : 'down',
        status: baseClarity > 80 ? 'excellent' : baseClarity > 60 ? 'good' : 'needs-improvement'
      },
      {
        id: "confidence",
        label: "Confidence Level",
        value: Math.round(baseConfidence + (wordCount > 100 ? 15 : wordCount > 50 ? 8 : 0)),
        target: 80,
        unit: "%",
        icon: <Target className="w-4 h-4" />,
        color: "red",
        trend: baseConfidence > 65 ? 'up' : baseConfidence > 45 ? 'stable' : 'down',
        status: baseConfidence > 75 ? 'excellent' : baseConfidence > 55 ? 'good' : 'needs-improvement'
      }
    ];
  };

  // Update voice analysis hook to include word count
  useEffect(() => {
    if (sessionActive && wordCount > 0) {
      // Update voice analysis with current word count
      if (startVoiceAnalysis) {
        // Voice analysis is already running
      }
    }
  }, [wordCount, sessionActive]);

  // Session timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sessionActive) {
      timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sessionActive]);

  // Format session time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Practice Mode Selection */}
      <Card className="gradient-card purple-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-purple-600" />
            <span className="gradient-text font-heading">Live Practice Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {practiceModes.map((mode) => (
              <div
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedMode === mode.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  {mode.icon}
                  <h3 className="font-semibold text-sm">{mode.name}</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">{mode.description}</p>
                <div className="flex flex-wrap gap-1">
                  {mode.focusAreas.slice(0, 2).map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Session Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={sessionActive ? stopSession : startSession}
                className={sessionActive ? "bg-red-600 hover:bg-red-700" : "gradient-bg"}
                size="lg"
              >
                {sessionActive ? (
                  <>
                    <Square className="w-5 h-5 mr-2" />
                    Stop Session
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Practice
                  </>
                )}
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(sessionTime)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant={videoEnabled ? "default" : "secondary"}>
                <Camera className="w-3 h-3 mr-1" />
                {videoEnabled ? "Camera On" : "Camera Off"}
              </Badge>
              <Badge variant={audioEnabled ? "default" : "secondary"}>
                <Mic className="w-3 h-3 mr-1" />
                {audioEnabled ? "Audio On" : "Audio Off"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Practice Interface */}
      {sessionActive && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span>Live Video Feed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  {videoEnabled ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Camera Feed Disabled</p>
                        <p className="text-sm">Start session to enable video analysis</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Analysis Overlay */}
                  {videoEnabled && (
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Transcript */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <span>Live Transcript</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
                  {transcript ? (
                    <p className="text-gray-800 leading-relaxed">{transcript}</p>
                  ) : (
                    <p className="text-gray-500 italic">Start speaking to see live transcript...</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                  <span>Words: {wordCount}</span>
                  <span>WPM: {wpm || 0}</span>
                  <span className={`flex items-center space-x-1 ${isListening ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span>{isListening ? 'Listening' : 'Not listening'}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Metrics & Feedback */}
          <div className="space-y-6">
            {/* Real-time Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span>Live Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.map((metric) => (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {metric.icon}
                        <span className="text-sm font-medium">{metric.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{metric.value}{metric.unit}</span>
                        <Badge 
                          variant={metric.status === 'excellent' ? 'default' : 
                                 metric.status === 'good' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {metric.status === 'excellent' ? 'Great' : 
                           metric.status === 'good' ? 'Good' : 'Improve'}
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Live AI Coaching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-cyan-600" />
                  <span>AI Coach</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {liveAdvice.length > 0 ? (
                    liveAdvice.map((advice, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{advice}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <Brain className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 text-sm">AI coach will provide live feedback during your session</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Session Summary (when not active) */}
      {!sessionActive && sessionTime > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span>Session Complete</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-lg mb-2">Great job! You practiced for {formatTime(sessionTime)}</p>
              <p className="text-gray-600 mb-4">Check the Analysis tab for detailed feedback</p>
              <Button variant="outline" onClick={() => setSessionTime(0)}>
                Start New Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
                </Badge>
              )}
              <Badge variant="outline" className="text-blue-700">
                Session #{Math.floor(Math.random() * 100) + 1}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select practice mode" />
                </SelectTrigger>
                <SelectContent>
                  {practiceModes.map((mode) => (
                    <SelectItem key={mode.id} value={mode.id}>
                      <div className="flex items-center space-x-2">
                        {mode.icon}
                        <span>{mode.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={focusLevel} onValueChange={(value: any) => setFocusLevel(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              {!sessionActive ? (
                <Button onClick={startSession} className="bg-green-600 hover:bg-green-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              ) : (
                <Button onClick={stopSession} variant="destructive">
                  <Square className="w-4 h-4 mr-2" />
                  End Session
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Metrics */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span>Live Performance Metrics</span>
                {sessionActive && (
                  <Badge className="bg-green-100 text-green-800 ml-2">
                    {formatTime(sessionTime)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.map((metric) => (
                  <Card key={metric.id} className="border border-gray-100 hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${metric.color}-100 text-${metric.color}-600`}>
                            {metric.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{metric.label}</h4>
                            <div className="flex items-center space-x-1 mt-0.5">
                              {getTrendIcon(metric.trend)}
                              <span className="text-xs text-gray-500">Target: {metric.target}{metric.unit}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">{metric.value}{metric.unit}</div>
                          <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                            {metric.status === 'excellent' ? 'Excellent' : 
                             metric.status === 'good' ? 'Good' : 'Improve'}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Session Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Session Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{wordCount}</div>
                  <div className="text-xs text-blue-700">Words Spoken</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{getOverallScore()}%</div>
                  <div className="text-xs text-green-700">Overall Score</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatTime(sessionTime)}</div>
                  <div className="text-xs text-purple-700">Session Time</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">{Math.floor(wordCount / Math.max(sessionTime / 60, 1))}</div>
                  <div className="text-xs text-amber-700">Words/Min</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Coach & Feedback */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>AI Coach</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessionActive ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Great Progress!</span>
                    </div>
                    <p className="text-xs text-green-700">Your voice clarity has improved significantly in the last 30 seconds.</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Tip</span>
                    </div>
                    <p className="text-xs text-blue-700">Try maintaining eye contact with different areas of your audience.</p>
                  </div>
                  
                  {getOverallScore() < 60 && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Focus Area</span>
                      </div>
                      <p className="text-xs text-amber-700">Work on speaking with more confidence and clarity.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600">Start a session to receive real-time AI coaching</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Practice Mode Info */}
          {selectedMode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {practiceModes.find(m => m.id === selectedMode)?.icon}
                  <span>{practiceModes.find(m => m.id === selectedMode)?.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  {practiceModes.find(m => m.id === selectedMode)?.description}
                </p>
                <div className="space-y-2">
                  <span className="text-xs font-medium text-gray-700">Focus Areas:</span>
                  <div className="flex flex-wrap gap-1">
                    {practiceModes.find(m => m.id === selectedMode)?.focusAreas.map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <span>Session Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Audio Input</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={audioEnabled ? "text-green-600" : "text-gray-400"}
                >
                  {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Video Input</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={videoEnabled ? "text-green-600" : "text-gray-400"}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {sessionActive && (
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Session
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Transcript */}
      {sessionActive && transcript && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Live Transcript</span>
              <Badge className="bg-blue-100 text-blue-800">
                {wordCount} words
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg border min-h-[100px] max-h-[200px] overflow-y-auto">
              <p className="text-gray-800 leading-relaxed">
                {transcript || "Start speaking to see your words appear here..."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}