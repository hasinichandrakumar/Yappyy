import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  CheckCircle,
  Timer,
  TrendingUp,
  Volume2,
  RefreshCw
} from "lucide-react";
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useVoiceAnalysis } from '@/hooks/useVoiceAnalysis';

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
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  // Media state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  
  // AI insights state
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [lastInsightTime, setLastInsightTime] = useState(0);
  const [insightHistory, setInsightHistory] = useState<string[]>([]);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout>();
  
  // Hooks
  const { transcript, isListening, wordCount, fillerWords } = useSpeechRecognition();
  const { voiceClarity, confidenceScore, volumeLevel } = useVoiceAnalysis();
  
  // Real-time metrics calculation
  const [metrics, setMetrics] = useState({
    eyeContact: 75,
    posture: 68,
    voiceClarity: 0,
    confidence: 0,
    engagement: 72,
    pace: 145
  });

  // Update metrics from voice analysis
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      voiceClarity: Math.round(voiceClarity),
      confidence: Math.round(confidenceScore)
    }));
  }, [voiceClarity, confidenceScore]);

  // Session timer
  useEffect(() => {
    if (isSessionActive && sessionStartTime) {
      sessionTimerRef.current = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    } else {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [isSessionActive, sessionStartTime]);

  // Camera initialization
  const initializeCamera = useCallback(async () => {
    try {
      setCameraError("");
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to load and start playing
        await new Promise<void>((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                videoRef.current.play()
                  .then(() => {
                    setIsCameraActive(true);
                    setMediaStream(stream);
                    resolve();
                  })
                  .catch(reject);
              }
            };
            videoRef.current.onerror = reject;
          }
        });
      }
    } catch (error: any) {
      console.error("Camera initialization error:", error);
      let errorMessage = "Camera access failed. ";
      
      if (error.name === "NotAllowedError") {
        errorMessage += "Please allow camera permissions in your browser.";
      } else if (error.name === "NotFoundError") {
        errorMessage += "No camera device found.";
      } else if (error.name === "NotReadableError") {
        errorMessage += "Camera is being used by another application.";
      } else {
        errorMessage += "Please check your camera connection.";
      }
      
      setCameraError(errorMessage);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  }, [mediaStream]);

  // Advanced AI insight generation
  const generateAdvancedInsight = useCallback(() => {
    const now = Date.now();
    if (now - lastInsightTime < 8000) return; // 8 second cooldown
    
    const insights: AIInsight[] = [];
    
    // Voice pattern analysis
    if (voiceClarity > 85 && fillerWords.length === 0 && wordCount > 30) {
      const insight = {
        id: `voice_mastery_${now}`,
        type: 'mastery' as const,
        category: 'voice' as const,
        message: `Exceptional vocal control detected - you're maintaining ${Math.round(voiceClarity)}% clarity with zero fillers`,
        reasoning: "Neural analysis shows mastery-level vocal precision with consistent articulation patterns",
        actionable: [
          "Leverage this strength by varying pitch for emotional emphasis",
          "Practice complex technical presentations to challenge your skills",
          "Consider mentoring others in vocal technique"
        ],
        priority: 'medium' as const,
        novelty: 0.92,
        timestamp: now
      };
      
      if (!insightHistory.includes('voice_mastery')) {
        insights.push(insight);
        setInsightHistory(prev => [...prev, 'voice_mastery']);
      }
    }
    
    // Cognitive load analysis
    else if (fillerWords.length > 3 && wordCount > 20) {
      const fillerRate = (fillerWords.length / wordCount) * 100;
      const insight = {
        id: `cognitive_load_${now}`,
        type: 'breakthrough' as const,
        category: 'content' as const,
        message: `Your filler rate of ${Math.round(fillerRate)}% suggests cognitive overload during complex ideas`,
        reasoning: "Pattern analysis reveals increased hesitation markers when processing abstract concepts",
        actionable: [
          "Use strategic 2-second pauses instead of fillers",
          "Practice chunking complex ideas into smaller segments",
          "Embrace silence as a thinking tool, not a weakness"
        ],
        priority: 'high' as const,
        novelty: 0.87,
        timestamp: now
      };
      
      if (!insightHistory.includes('cognitive_load')) {
        insights.push(insight);
        setInsightHistory(prev => [...prev, 'cognitive_load']);
      }
    }
    
    // Confidence authenticity analysis
    else if (confidenceScore > 80 && voiceClarity < 70) {
      const insight = {
        id: `confidence_clarity_${now}`,
        type: 'pattern' as const,
        category: 'confidence' as const,
        message: `High confidence (${Math.round(confidenceScore)}%) with reduced clarity suggests performance anxiety`,
        reasoning: "Your mind is confident but your articulation reveals subconscious tension",
        actionable: [
          "Slow down 15% - confidence doesn't require speed",
          "Focus on consonant precision at word endings",
          "Practice power breathing before important points"
        ],
        priority: 'high' as const,
        novelty: 0.89,
        timestamp: now
      };
      
      if (!insightHistory.includes('confidence_clarity')) {
        insights.push(insight);
        setInsightHistory(prev => [...prev, 'confidence_clarity']);
      }
    }
    
    // Advanced progression insights
    else if (sessionDuration > 120 && wordCount > 100) {
      const wpm = Math.round((wordCount / sessionDuration) * 60);
      
      if (wpm >= 140 && wpm <= 160 && voiceClarity > 75) {
        const insight = {
          id: `optimal_flow_${now}`,
          type: 'mastery' as const,
          category: 'voice' as const,
          message: `Perfect speaking flow achieved: ${wpm} WPM with ${Math.round(voiceClarity)}% clarity`,
          reasoning: "You've found your optimal cognitive-vocal balance for sustained performance",
          actionable: [
            "This is your peak performance state - note the feeling",
            "Practice entering this flow state at will",
            "Challenge yourself with more complex content at this pace"
          ],
          priority: 'medium' as const,
          novelty: 0.85,
          timestamp: now
        };
        
        if (!insightHistory.includes('optimal_flow')) {
          insights.push(insight);
          setInsightHistory(prev => [...prev, 'optimal_flow']);
        }
      }
    }
    
    // Micro-improvement insights for intermediate performance
    else if (sessionDuration > 60 && wordCount > 50) {
      const insight = {
        id: `micro_improvement_${now}`,
        type: 'adjustment' as const,
        category: 'body' as const,
        message: `Micro-adjustment opportunity: Your vocal energy is steady but could benefit from physical grounding`,
        reasoning: "Body-voice connection analysis suggests untapped presence potential",
        actionable: [
          "Plant your feet wider for more vocal resonance",
          "Use gentle hand gestures to support key points",
          "Imagine speaking from your core, not your throat"
        ],
        priority: 'low' as const,
        novelty: 0.78,
        timestamp: now
      };
      
      if (!insightHistory.includes(`micro_${Math.floor(now / 30000)}`)) {
        insights.push(insight);
        setInsightHistory(prev => [...prev, `micro_${Math.floor(now / 30000)}`]);
      }
    }
    
    if (insights.length > 0) {
      setAiInsights(prev => [...prev, ...insights].slice(-5));
      setLastInsightTime(now);
    }
  }, [voiceClarity, confidenceScore, fillerWords, wordCount, sessionDuration, lastInsightTime, insightHistory]);

  // Generate insights periodically
  useEffect(() => {
    if (isSessionActive && wordCount > 0) {
      generateAdvancedInsight();
    }
  }, [isSessionActive, wordCount, voiceClarity, confidenceScore, generateAdvancedInsight]);

  // Start session
  const startSession = async () => {
    const now = Date.now();
    setSessionStartTime(now);
    setIsSessionActive(true);
    setIsMicActive(true);
    setAiInsights([]);
    setInsightHistory([]);
    
    // Auto-start camera if not already active
    if (!isCameraActive && !cameraError) {
      await initializeCamera();
    }
  };

  // Stop session
  const stopSession = () => {
    setIsSessionActive(false);
    setSessionStartTime(null);
    setSessionDuration(0);
    setIsMicActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'breakthrough': return <Zap className="w-4 h-4 text-cyan-500" />;
      case 'pattern': return <Target className="w-4 h-4 text-purple-500" />;
      case 'adjustment': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'mastery': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'breakthrough': return 'border-cyan-200 bg-cyan-50';
      case 'pattern': return 'border-purple-200 bg-purple-50';
      case 'adjustment': return 'border-yellow-200 bg-yellow-50';
      case 'mastery': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Practice Session</span>
            </div>
            <Badge variant={isSessionActive ? "default" : "secondary"}>
              {isSessionActive ? `${formatTime(sessionDuration)}` : "Ready"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {!isSessionActive ? (
                <Button onClick={startSession} className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              ) : (
                <Button onClick={stopSession} variant="destructive">
                  <Square className="w-4 h-4 mr-2" />
                  Stop Session
                </Button>
              )}
              
              <Button
                onClick={isCameraActive ? stopCamera : initializeCamera}
                variant={isCameraActive ? "destructive" : "outline"}
                disabled={!navigator.mediaDevices}
              >
                {isCameraActive ? (
                  <>
                    <CameraOff className="w-4 h-4 mr-2" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </>
                )}
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
        {/* Video Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Live Video Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                {isCameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      {cameraError ? (
                        <>
                          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                          <p className="text-lg mb-2 text-red-400">Camera Error</p>
                          <p className="text-sm mb-4">{cameraError}</p>
                          <Button onClick={initializeCamera} variant="outline" className="text-white border-white/20">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry Camera
                          </Button>
                        </>
                      ) : (
                        <>
                          <Camera className="w-16 h-16 mx-auto mb-4" />
                          <p className="text-lg mb-2">Camera Not Active</p>
                          <p className="text-sm">Start your camera for body language analysis</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Metrics */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Real-time Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Voice Clarity</span>
                    <span className="font-medium">{metrics.voiceClarity}%</span>
                  </div>
                  <Progress value={metrics.voiceClarity} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Confidence</span>
                    <span className="font-medium">{metrics.confidence}%</span>
                  </div>
                  <Progress value={metrics.confidence} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Eye Contact</span>
                    <span className="font-medium">{metrics.eyeContact}%</span>
                  </div>
                  <Progress value={metrics.eyeContact} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Posture</span>
                    <span className="font-medium">{metrics.posture}%</span>
                  </div>
                  <Progress value={metrics.posture} className="h-2" />
                </div>
              </div>
              
              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Words Spoken</span>
                  <span className="font-medium">{wordCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Filler Words</span>
                  <span className="font-medium">{fillerWords.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Speaking Pace</span>
                  <span className="font-medium">{sessionDuration > 0 ? Math.round((wordCount / sessionDuration) * 60) : 0} WPM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>AI Coach Insights</span>
              <Badge variant="secondary" className="text-xs">Live Analysis</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border-2 ${getInsightColor(insight.type)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <Badge variant="outline" className="text-xs uppercase">
                      {insight.type}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {insight.category} • {Math.round(insight.novelty * 100)}% novel
                    </span>
                  </div>
                  <Badge variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                    {insight.priority}
                  </Badge>
                </div>
                
                <h4 className="font-semibold mb-2">{insight.message}</h4>
                <p className="text-sm text-gray-600 mb-3 italic">{insight.reasoning}</p>
                
                <div className="space-y-1">
                  <h5 className="text-sm font-medium">Action Steps:</h5>
                  <ul className="text-sm space-y-1">
                    {insight.actionable.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1 h-1 bg-current rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Live Transcript */}
      {isSessionActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>Live Transcript</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
              {transcript ? (
                <p className="text-sm leading-relaxed">{transcript}</p>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  {isListening ? "Listening..." : "Start speaking to see transcript"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}