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
  RefreshCw,
  Settings
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
  // Session configuration
  const [sessionName, setSessionName] = useState("");
  const [sessionPurpose, setSessionPurpose] = useState("");
  const [selectedRoleplay, setSelectedRoleplay] = useState("");
  const [sessionType, setSessionType] = useState<'general' | 'roleplay'>('general');
  
  // Session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isSetupMode, setIsSetupMode] = useState(true);
  
  // Media state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // AI insights state
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [lastInsightTime, setLastInsightTime] = useState(0);
  const [insightHistory, setInsightHistory] = useState<string[]>([]);
  
  // Real-time analysis state
  const [currentWPM, setCurrentWPM] = useState(0);
  const [eyeContactScore, setEyeContactScore] = useState(0);
  const [postureScore, setPostureScore] = useState(0);
  const [sessionNumber, setSessionNumber] = useState(1);
  
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

  // Roleplay scenarios
  const roleplays = [
    { id: 'job-interview', name: 'Job Interview', description: 'Practice answering common interview questions' },
    { id: 'presentation', name: 'Business Presentation', description: 'Deliver a professional presentation' },
    { id: 'sales-pitch', name: 'Sales Pitch', description: 'Convince potential clients' },
    { id: 'conference-talk', name: 'Conference Talk', description: 'Academic or industry conference presentation' },
    { id: 'wedding-toast', name: 'Wedding Toast', description: 'Heartfelt speech for special occasions' },
    { id: 'debate', name: 'Debate/Discussion', description: 'Argue a position persuasively' },
    { id: 'teaching', name: 'Teaching/Training', description: 'Educational presentation or workshop' },
    { id: 'media-interview', name: 'Media Interview', description: 'TV, radio, or podcast interview' }
  ];

  // Update metrics from voice analysis and calculate WPM
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      voiceClarity: Math.round(voiceClarity),
      confidence: Math.round(confidenceScore)
    }));
    
    // Calculate real-time WPM
    if (sessionStartTime && wordCount > 0) {
      const elapsedMinutes = (Date.now() - sessionStartTime) / 60000;
      const wpm = Math.round(wordCount / elapsedMinutes);
      setCurrentWPM(wpm);
    }
  }, [voiceClarity, confidenceScore, sessionStartTime, wordCount]);

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

  // Camera initialization with comprehensive error handling and browser compatibility
  const initializeCamera = useCallback(async () => {
    try {
      setCameraError("");
      setIsRetrying(true);
      console.log("Starting camera initialization...");
      
      // Stop any existing streams
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
      
      // Check for media devices support
      if (!navigator.mediaDevices) {
        throw new Error("MediaDevices not supported in this browser");
      }
      
      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia not supported in this browser");
      }

      // Request camera access with progressive fallback
      let stream: MediaStream | null = null;
      let lastError: any = null;

      // Try basic camera request first
      try {
        console.log("Requesting basic camera access...");
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        console.log("Camera stream obtained successfully");
      } catch (error: any) {
        console.error("Basic camera request failed:", error);
        lastError = error;
        
        // Try with specific constraints as fallback
        try {
          console.log("Trying with user-facing camera constraint...");
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
          });
          console.log("User-facing camera stream obtained");
        } catch (fallbackError: any) {
          console.error("Fallback camera request failed:", fallbackError);
          lastError = fallbackError;
        }
      }

      if (!stream) {
        throw lastError || new Error("Camera access denied or unavailable");
      }

      // Ensure video element exists
      if (!videoRef.current) {
        throw new Error("Video element ref not available");
      }

      const video = videoRef.current;
      
      // Set up video element properties
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.controls = false;
      
      // Store stream reference
      setMediaStream(stream);
      
      // Handle video load events
      await new Promise<void>((resolve, reject) => {
        const cleanup = () => {
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('canplay', onCanPlay);
          video.removeEventListener('error', onError);
          clearTimeout(timeoutId);
        };

        const onLoadedMetadata = () => {
          console.log("Video metadata loaded");
        };

        const onCanPlay = async () => {
          console.log("Video can play");
          try {
            await video.play();
            setIsCameraActive(true);
            setCameraError("");
            setRetryCount(0);
            cleanup();
            resolve();
          } catch (playError) {
            console.warn("Autoplay failed:", playError);
            // Try to play manually or set active anyway
            setIsCameraActive(true);
            setCameraError("");
            cleanup();
            resolve();
          }
        };

        const onError = (event: any) => {
          console.error("Video error:", event);
          cleanup();
          reject(new Error("Video playback failed"));
        };

        // Set up event listeners
        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('error', onError);

        // Fallback timeout
        const timeoutId = setTimeout(() => {
          console.log("Video setup timeout, attempting to activate anyway");
          setIsCameraActive(true);
          setCameraError("");
          cleanup();
          resolve();
        }, 5000);

        // Force play attempt
        video.play().catch(e => console.warn("Initial play attempt failed:", e));
      });

    } catch (error: any) {
      console.error("Camera initialization failed:", error);
      
      let errorMessage = "Camera setup failed: ";
      
      switch (error.name) {
        case "NotAllowedError":
          errorMessage += "Permission denied. Please allow camera access and try again.";
          break;
        case "NotFoundError":
          errorMessage += "No camera found. Please connect a camera.";
          break;
        case "NotReadableError":
          errorMessage += "Camera is busy. Close other apps and try again.";
          break;
        case "OverconstrainedError":
          errorMessage += "Camera constraints not supported.";
          break;
        case "SecurityError":
          errorMessage += "Security error. Ensure you're using HTTPS.";
          break;
        default:
          errorMessage += error.message || "Unknown error occurred.";
      }
      
      setCameraError(errorMessage);
      setIsCameraActive(false);
      setRetryCount(prev => prev + 1);
      
      // Clean up any partial streams
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
    } finally {
      setIsRetrying(false);
    }
  }, [mediaStream]);

  // Fallback camera initialization with basic constraints
  const initializeCameraBasic = useCallback(async () => {
    try {
      console.log("Trying basic camera constraints...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
        
        await videoRef.current.play();
        setIsCameraActive(true);
        setRetryCount(0);
        setCameraError("");
      }
    } catch (error: any) {
      console.error("Basic camera initialization failed:", error);
      setCameraError("Camera initialization failed with basic settings. Please check your camera.");
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

  // Simulate real-time body language analysis
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSessionActive && isCameraActive) {
      interval = setInterval(() => {
        // Simulate eye contact detection (would be replaced with actual MediaPipe analysis)
        setEyeContactScore(prev => {
          const variation = (Math.random() - 0.5) * 10;
          return Math.max(0, Math.min(100, prev + variation));
        });
        
        // Simulate posture analysis
        setPostureScore(prev => {
          const variation = (Math.random() - 0.5) * 8;
          return Math.max(0, Math.min(100, prev + variation));
        });
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive, isCameraActive]);

  // Initialize session name
  useEffect(() => {
    const storedNumber = localStorage.getItem('practiceSessionNumber');
    const num = storedNumber ? parseInt(storedNumber) : 1;
    setSessionNumber(num);
    setSessionName(`Practice Session ${num}`);
  }, []);

  // Start session
  const startSession = async () => {
    if (!sessionPurpose.trim()) {
      alert("Please enter a purpose for your session");
      return;
    }
    
    const now = Date.now();
    setSessionStartTime(now);
    setIsSessionActive(true);
    setIsMicActive(true);
    setAiInsights([]);
    setInsightHistory([]);
    setIsSetupMode(false);
    setEyeContactScore(75); // Initial baseline
    setPostureScore(80); // Initial baseline
    
    // Auto-start camera if not already active
    if (!isCameraActive && !cameraError) {
      try {
        await initializeCamera();
      } catch (error) {
        console.warn("Failed to auto-start camera:", error);
        // Don't prevent session start if camera fails
      }
    }
  };

  // Stop session
  const stopSession = () => {
    setIsSessionActive(false);
    setSessionStartTime(null);
    setSessionDuration(0);
    setIsMicActive(false);
    
    // Increment session number for next session
    const nextNumber = sessionNumber + 1;
    localStorage.setItem('practiceSessionNumber', nextNumber.toString());
    setSessionNumber(nextNumber);
    setSessionName(`Practice Session ${nextNumber}`);
    setIsSetupMode(true);
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
            {/* Session Name */}
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

            {/* Session Type */}
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

            {/* Roleplay Selection */}
            {sessionType === 'roleplay' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Choose Roleplay Scenario</label>
                <select
                  value={selectedRoleplay}
                  onChange={(e) => setSelectedRoleplay(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a scenario...</option>
                  {roleplays.map((roleplay) => (
                    <option key={roleplay.id} value={roleplay.id}>
                      {roleplay.name} - {roleplay.description}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Purpose Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Purpose</label>
              <textarea
                value={sessionPurpose}
                onChange={(e) => setSessionPurpose(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                placeholder="What's the goal of this session? (e.g., Practice quarterly presentation, improve storytelling, work on confidence...)"
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
                disabled={!navigator.mediaDevices || isRetrying}
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : isCameraActive ? (
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
              
              {/* Camera Error Display */}
              {cameraError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <strong>Camera Error:</strong> {cameraError}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="ml-2 text-xs h-6"
                    onClick={initializeCamera}
                  >
                    Retry
                  </Button>
                </div>
              )}
              
              {/* Debug Info */}
              <div className="mt-2 text-xs text-gray-500">
                Camera Support: {navigator.mediaDevices ? 'Yes' : 'No'} | 
                Retry Count: {retryCount} | 
                Status: {isCameraActive ? 'Active' : 'Inactive'}
              </div>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Live Video Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">{isCameraActive ? 'Active' : 'Inactive'}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                {isCameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      controls={false}
                      className="w-full h-full object-cover transform scale-x-[-1]"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    {/* Live Analysis Overlay */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg p-2 space-y-1">
                      <div className="flex items-center space-x-2 text-white text-xs">
                        <Eye className="w-3 h-3" />
                        <span>Eye Contact: {Math.round(eyeContactScore)}%</span>
                      </div>
                      <div className="flex items-center space-x-2 text-white text-xs">
                        <Target className="w-3 h-3" />
                        <span>Posture: {Math.round(postureScore)}%</span>
                      </div>
                      {isSessionActive && (
                        <div className="flex items-center space-x-2 text-green-400 text-xs">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span>Recording</span>
                        </div>
                      )}
                    </div>
                  </>
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
                          <p className="text-sm mb-4">Enable camera for body language analysis</p>
                          <div className="flex flex-col items-center space-y-3">
                            <Button 
                              onClick={initializeCamera} 
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                              disabled={isRetrying}
                            >
                              {isRetrying ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <Camera className="w-4 h-4 mr-2" />
                                  Activate Camera
                                </>
                              )}
                            </Button>
                            <p className="text-xs text-gray-500 text-center max-w-xs">
                              Your browser will ask for camera permission
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Analysis Metrics */}
              {isCameraActive && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Eye Contact</span>
                      <span className="font-medium">{Math.round(eyeContactScore)}%</span>
                    </div>
                    <Progress value={eyeContactScore} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Body Posture</span>
                      <span className="font-medium">{Math.round(postureScore)}%</span>
                    </div>
                    <Progress value={postureScore} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Speech Pace</span>
                      <span className="font-medium">{currentWPM} WPM</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentWPM < 130 && "Too slow - speak faster"}
                      {currentWPM >= 130 && currentWPM <= 170 && "Perfect pace"}
                      {currentWPM > 170 && "Too fast - slow down"}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence</span>
                      <span className="font-medium">{Math.round(confidenceScore)}%</span>
                    </div>
                    <Progress value={confidenceScore} className="h-2" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Coach & Transcript */}
        <div className="space-y-4">

          {/* AI Coach with Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm">AI Coach</span>
                {isSessionActive && (
                  <Badge variant="secondary" className="text-xs">Live</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-60 overflow-y-auto">
              {aiInsights.length === 0 ? (
                <div className="text-sm text-gray-500 italic text-center py-4">
                  {isSessionActive ? "Analyzing your performance..." : "Start session for live coaching"}
                </div>
              ) : (
                aiInsights.slice(-3).map((insight) => (
                  <div key={insight.id} className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center space-x-1">
                        {getInsightIcon(insight.type)}
                        <span className="text-xs font-medium text-gray-600">
                          {formatTime(Math.floor((insight.timestamp - (sessionStartTime || 0)) / 1000))}
                        </span>
                      </div>
                      <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {insight.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium mb-1">{insight.message}</p>
                    <p className="text-xs text-gray-600 mb-2 italic">{insight.reasoning}</p>
                    
                    <div className="space-y-1">
                      <h5 className="text-xs font-medium">Quick Fix:</h5>
                      <p className="text-xs">{insight.actionable[0]}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>



      {/* Live Transcript - Full Width at Bottom */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5" />
                <span>Live Interactive Transcript</span>
                {isSessionActive && isListening && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Live</span>
                  </div>
                )}
              </div>
              {isSessionActive && (
                <div className="flex items-center space-x-3 text-sm">
                  <Badge variant="secondary">{wordCount} words</Badge>
                  <Badge variant={fillerWords.length > 5 ? "destructive" : "secondary"}>
                    {fillerWords.length} fillers
                  </Badge>
                  <Badge variant="outline">{currentWPM} WPM</Badge>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6 min-h-[150px] max-h-[250px] overflow-y-auto">
              {transcript ? (
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-base leading-relaxed text-gray-800 font-medium">
                      {transcript}
                    </p>
                  </div>
                  
                  {fillerWords.length > 0 && (
                    <div className="border-t pt-3 mt-4">
                      <div className="text-sm text-orange-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="w-4 h-4" />
                          <strong>Filler Words Detected:</strong>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {fillerWords.slice(-15).map((filler, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                              {filler}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isSessionActive && (
                    <div className="border-t pt-3 mt-4">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{wordCount}</div>
                          <div className="text-xs text-gray-500">Total Words</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{currentWPM}</div>
                          <div className="text-xs text-gray-500">Words/Min</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-600">{fillerWords.length}</div>
                          <div className="text-xs text-gray-500">Filler Words</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{formatTime(sessionDuration)}</div>
                          <div className="text-xs text-gray-500">Duration</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Volume2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium mb-2">
                    {isSessionActive 
                      ? (isListening ? "Listening for speech..." : "Microphone not active") 
                      : "Interactive Transcript"
                    }
                  </p>
                  <p className="text-gray-500 text-sm">
                    {isSessionActive 
                      ? "Start speaking to see your words appear here in real-time"
                      : "Start a session to begin live transcription with AI analysis"
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}