// Enhanced Practice Page with Advanced AI Analytics Stack
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Mic, Video, Square, Play, Pause, Edit3, Save, X, Trophy, FileText, Target, Eye, 
  Brain, Zap, Award, TrendingUp, Camera, Mic2, Activity, Users, Star 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Enhanced AI & Computer Vision Systems
import { RealTimeCoach, AdvancedSpeechMetrics } from '@/lib/advanced-speech-analytics';
import { MediaPipeVisionSystem, MediaPipeResults } from '@/lib/mediapipe-vision';
import { TensorFlowVisionSystem, TensorFlowEmotionResults, GestureRecognition } from '@/lib/tensorflow-emotion';
import { WebGazerEyeTracking, EyeContactAnalysis, GazeHeatmap } from '@/lib/webgazer-eye-tracking';
import { GamificationEngine, Achievement, UserProgress, AIPersonality } from '@/lib/gamification-engine';

interface EnhancedLiveFeedback {
  id: string;
  timestamp: number;
  category: 'voice' | 'body_language' | 'content' | 'emotion' | 'engagement';
  feedback: string;
  severity: 'excellent' | 'good' | 'warning' | 'critical';
  confidence: number;
  actionable: string;
}

interface ComprehensiveMetrics {
  // Voice Metrics
  voice: {
    clarity: number;
    pace: number;
    volume: number;
    pitchVariation: number;
    vocalFryDetection: boolean;
    uptalkPatterns: number;
  };
  
  // Content Metrics
  content: {
    coherenceRating: number;
    persuasivenessIndex: number;
    authenticityMeasure: number;
    fillerWords: string[];
    wordCount: number;
  };
  
  // Body Language Metrics
  bodyLanguage: {
    eyeContactScore: number;
    postureScore: number;
    gestureEffectiveness: number;
    facialExpressions: TensorFlowEmotionResults | null;
    gazeAnalysis: EyeContactAnalysis | null;
  };
  
  // Emotion & Engagement
  emotion: {
    confidence: number;
    engagement: number;
    authenticity: number;
    nervousness: number;
    enthusiasm: number;
  };
  
  // AI-Derived Insights
  insights: {
    overallScore: number;
    improvementAreas: string[];
    strengths: string[];
    nextSteps: string[];
  };
}

export default function EnhancedPracticePage() {
  // Session State
  const [isRecording, setIsRecording] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionPurpose, setSessionPurpose] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPurpose, setIsEditingPurpose] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [transcript, setTranscript] = useState<string>('');

  // Enhanced Metrics & Feedback
  const [metrics, setMetrics] = useState<ComprehensiveMetrics>({
    voice: { clarity: 0, pace: 0, volume: 0, pitchVariation: 0, vocalFryDetection: false, uptalkPatterns: 0 },
    content: { coherenceRating: 0, persuasivenessIndex: 0, authenticityMeasure: 0, fillerWords: [], wordCount: 0 },
    bodyLanguage: { eyeContactScore: 0, postureScore: 0, gestureEffectiveness: 0, facialExpressions: null, gazeAnalysis: null },
    emotion: { confidence: 0, engagement: 0, authenticity: 0, nervousness: 0, enthusiasm: 0 },
    insights: { overallScore: 0, improvementAreas: [], strengths: [], nextSteps: [] }
  });

  const [liveFeedback, setLiveFeedback] = useState<EnhancedLiveFeedback[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [selectedAICoach, setSelectedAICoach] = useState<AIPersonality | null>(null);
  const [gazeHeatmap, setGazeHeatmap] = useState<GazeHeatmap | null>(null);

  // Enhanced UI State
  const [activeTab, setActiveTab] = useState("live");
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [showGazeHeatmap, setShowGazeHeatmap] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Refs for Advanced Systems
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Advanced AI Systems
  const realTimeCoach = useRef<RealTimeCoach | null>(null);
  const mediaPipeSystem = useRef<MediaPipeVisionSystem | null>(null);
  const tensorFlowSystem = useRef<TensorFlowVisionSystem | null>(null);
  const webGazerTracking = useRef<WebGazerEyeTracking | null>(null);
  const gamificationEngine = useRef<GamificationEngine | null>(null);

  // Initialize Advanced Systems
  useEffect(() => {
    const initializeSystems = async () => {
      try {
        // Initialize Gamification Engine
        gamificationEngine.current = new GamificationEngine();
        setUserProgress(gamificationEngine.current.getUserProgress());

        // Initialize AI Coach
        realTimeCoach.current = new RealTimeCoach();

        // Initialize TensorFlow Vision System
        tensorFlowSystem.current = new TensorFlowVisionSystem();
        await tensorFlowSystem.current.initializeModels();

        // Initialize WebGazer Eye Tracking
        webGazerTracking.current = new WebGazerEyeTracking();

        console.log('🚀 Enhanced AI systems initialized');
      } catch (error) {
        console.error('Failed to initialize AI systems:', error);
        toast({
          title: "System Initialization",
          description: "Some advanced features may be limited",
          variant: "default"
        });
      }
    };

    initializeSystems();

    // Initialize session name
    const initializeSessionName = async () => {
      if (!sessionName) {
        try {
          const response = await fetch('/api/practice-sessions');
          const sessions = await response.json();
          const sessionNumber = Array.isArray(sessions) ? sessions.length + 1 : 1;
          setSessionName(`Session ${sessionNumber}`);
        } catch (error) {
          setSessionName("Session 1");
        }
      }
    };
    initializeSessionName();

    return () => {
      // Cleanup systems
      tensorFlowSystem.current?.dispose();
      webGazerTracking.current?.cleanup();
    };
  }, []);

  // Initialize MediaPipe when video is ready
  useEffect(() => {
    const initializeMediaPipe = async () => {
      if (videoRef.current && canvasRef.current && !mediaPipeSystem.current) {
        try {
          mediaPipeSystem.current = new MediaPipeVisionSystem(videoRef.current, canvasRef.current);
          await mediaPipeSystem.current.initialize();
          console.log('📹 MediaPipe Vision System initialized');
        } catch (error) {
          console.error('MediaPipe initialization failed:', error);
        }
      }
    };

    if (isRecording) {
      initializeMediaPipe();
    }
  }, [isRecording]);

  // Real-time analysis loop
  useEffect(() => {
    if (!isRecording) return;

    const analysisInterval = setInterval(async () => {
      await performComprehensiveAnalysis();
    }, 1000); // Run comprehensive analysis every second

    return () => clearInterval(analysisInterval);
  }, [isRecording]);

  // Comprehensive real-time analysis
  const performComprehensiveAnalysis = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      // Run all analysis systems in parallel
      const [
        mediaPipeResults,
        tensorFlowResults,
        gazeAnalysis,
        advancedMetrics
      ] = await Promise.all([
        mediaPipeSystem.current?.processResults ? Promise.resolve(null) : Promise.resolve(null),
        tensorFlowSystem.current?.analyzeFrame(canvasRef.current!, videoRef.current!) || Promise.resolve(null),
        webGazerTracking.current?.analyzeEyeContact({ x: 320, y: 240, width: 100, height: 100 }) || Promise.resolve(null),
        realTimeCoach.current?.analyzeFrame(canvasRef.current!.getContext('2d')!.getImageData(0, 0, 640, 480)) || Promise.resolve(null)
      ]);

      // Update comprehensive metrics
      updateComprehensiveMetrics(tensorFlowResults, gazeAnalysis, advancedMetrics);

      // Generate intelligent feedback
      generateIntelligentFeedback(tensorFlowResults, gazeAnalysis);

      // Update gamification progress
      checkAchievementProgress();

    } catch (error) {
      console.error('Analysis failed:', error);
    }
  }, []);

  const updateComprehensiveMetrics = useCallback((
    tensorFlowResults: TensorFlowEmotionResults | null,
    gazeAnalysis: EyeContactAnalysis | null,
    advancedMetrics: AdvancedSpeechMetrics | null
  ) => {
    setMetrics(prev => ({
      ...prev,
      bodyLanguage: {
        ...prev.bodyLanguage,
        facialExpressions: tensorFlowResults,
        gazeAnalysis: gazeAnalysis,
        eyeContactScore: gazeAnalysis?.eyeContactPercentage || prev.bodyLanguage.eyeContactScore,
        gestureEffectiveness: advancedMetrics?.gesture_effectiveness || prev.bodyLanguage.gestureEffectiveness
      },
      emotion: {
        confidence: tensorFlowResults?.expressions.confidence || prev.emotion.confidence,
        engagement: tensorFlowResults?.expressions.engagement || prev.emotion.engagement,
        authenticity: tensorFlowResults?.expressions.authenticity || prev.emotion.authenticity,
        nervousness: tensorFlowResults?.expressions.nervousness || prev.emotion.nervousness,
        enthusiasm: tensorFlowResults?.expressions.enthusiasm || prev.emotion.enthusiasm
      },
      voice: {
        ...prev.voice,
        clarity: advancedMetrics?.clarity_score || prev.voice.clarity,
        pace: advancedMetrics?.speaking_rate || prev.voice.pace,
        pitchVariation: advancedMetrics?.pitch_variation || prev.voice.pitchVariation
      },
      content: {
        ...prev.content,
        coherenceRating: advancedMetrics?.coherence_rating || prev.content.coherenceRating,
        persuasivenessIndex: advancedMetrics?.persuasiveness_index || prev.content.persuasivenessIndex,
        authenticityMeasure: advancedMetrics?.authenticity_measure || prev.content.authenticityMeasure
      }
    }));
  }, []);

  const generateIntelligentFeedback = useCallback((
    tensorFlowResults: TensorFlowEmotionResults | null,
    gazeAnalysis: EyeContactAnalysis | null
  ) => {
    const feedbackItems: EnhancedLiveFeedback[] = [];
    const timestamp = Date.now();

    // Eye contact feedback
    if (gazeAnalysis && gazeAnalysis.eyeContactPercentage < 50) {
      feedbackItems.push({
        id: `eyecontact-${timestamp}`,
        timestamp,
        category: 'body_language',
        feedback: `Eye contact at ${Math.round(gazeAnalysis.eyeContactPercentage)}% - look directly at the camera more`,
        severity: 'warning',
        confidence: gazeAnalysis.attentionScore / 100,
        actionable: 'Focus your gaze on the camera lens for better connection'
      });
    }

    // Emotion feedback
    if (tensorFlowResults && tensorFlowResults.expressions.confidence < 50) {
      feedbackItems.push({
        id: `confidence-${timestamp}`,
        timestamp,
        category: 'emotion',
        feedback: `Low confidence detected - try speaking with more conviction`,
        severity: 'warning',
        confidence: 0.8,
        actionable: 'Stand tall, speak clearly, and believe in your message'
      });
    }

    // Positive reinforcement
    if (tensorFlowResults && tensorFlowResults.expressions.engagement > 80) {
      feedbackItems.push({
        id: `engagement-${timestamp}`,
        timestamp,
        category: 'emotion',
        feedback: 'Excellent engagement! Your audience is captivated',
        severity: 'excellent',
        confidence: 0.9,
        actionable: 'Keep maintaining this level of energy and enthusiasm'
      });
    }

    // Add to live feedback (keep only recent items)
    setLiveFeedback(prev => {
      const updated = [...prev, ...feedbackItems];
      return updated.slice(-10); // Keep only last 10 items
    });
  }, []);

  const checkAchievementProgress = useCallback(() => {
    if (!gamificationEngine.current) return;

    const sessionMetrics = {
      eyeContactScore: metrics.bodyLanguage.eyeContactScore,
      postureScore: metrics.bodyLanguage.postureScore,
      clarity: metrics.voice.clarity,
      fillerWords: metrics.content.fillerWords,
      coherenceRating: metrics.content.coherenceRating
    };

    const userStats = {
      totalSessions: userProgress?.stats.totalSessions || 0,
      averageScore: userProgress?.stats.averageScore || 0
    };

    const newAchievements = gamificationEngine.current.checkAchievements(sessionMetrics, userStats);
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      
      // Show achievement notifications
      newAchievements.forEach(achievement => {
        toast({
          title: "🏆 Achievement Unlocked!",
          description: `${achievement.name}: ${achievement.description}`,
          duration: 5000
        });
      });
    }
  }, [metrics, userProgress, toast]);

  // Start enhanced recording with all systems
  const startRecording = useCallback(async () => {
    try {
      // Request camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Initialize eye tracking calibration
      if (webGazerTracking.current && !webGazerTracking.current.isCalibrationComplete()) {
        setIsCalibrating(true);
        await webGazerTracking.current.initialize();
        setIsCalibrating(false);
      }

      setIsRecording(true);

      // Start session timer
      const startTime = Date.now();
      const timer = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      console.log('🎬 Enhanced recording session started');

    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Recording Failed",
        description: "Please allow camera and microphone access",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Stop recording and generate comprehensive summary
  const stopRecording = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);

    // Generate comprehensive session summary
    await generateSessionSummary();

    toast({
      title: "Session Complete",
      description: "Generating your comprehensive analysis...",
      duration: 3000
    });
  }, []);

  const generateSessionSummary = useCallback(async () => {
    try {
      // Calculate overall insights
      const overallScore = Math.round(
        (metrics.voice.clarity * 0.25) +
        (metrics.bodyLanguage.eyeContactScore * 0.25) +
        (metrics.emotion.confidence * 0.25) +
        (metrics.content.coherenceRating * 0.25)
      );

      const improvementAreas = [];
      const strengths = [];

      // Analyze strengths and improvement areas
      if (metrics.voice.clarity < 70) improvementAreas.push("Voice clarity and articulation");
      else strengths.push("Clear and articulate voice");

      if (metrics.bodyLanguage.eyeContactScore < 60) improvementAreas.push("Eye contact with audience");
      else strengths.push("Strong eye contact");

      if (metrics.emotion.confidence < 60) improvementAreas.push("Speaking confidence");
      else strengths.push("Confident delivery");

      setMetrics(prev => ({
        ...prev,
        insights: {
          overallScore,
          improvementAreas,
          strengths,
          nextSteps: [
            "Practice with the identified improvement areas",
            "Record more sessions to track progress",
            "Try different speaking scenarios"
          ]
        }
      }));

      // Update gamification progress
      if (gamificationEngine.current) {
        gamificationEngine.current.updateProgress({
          duration: sessionDuration,
          overallScore,
          eyeContactScore: metrics.bodyLanguage.eyeContactScore,
          clarity: metrics.voice.clarity
        });
        setUserProgress(gamificationEngine.current.getUserProgress());
      }

    } catch (error) {
      console.error('Failed to generate session summary:', error);
    }
  }, [metrics, sessionDuration]);

  // Generate gaze heatmap
  const generateGazeHeatmap = useCallback(() => {
    if (webGazerTracking.current) {
      const heatmap = webGazerTracking.current.generateGazeHeatmap(30000); // Last 30 seconds
      setGazeHeatmap(heatmap);
      setShowGazeHeatmap(true);
    }
  }, []);

  // Recalibrate eye tracking
  const recalibrateEyeTracking = useCallback(async () => {
    if (webGazerTracking.current) {
      setIsCalibrating(true);
      await webGazerTracking.current.recalibrate();
      setIsCalibrating(false);
      toast({
        title: "Calibration Complete",
        description: "Eye tracking accuracy improved",
        duration: 2000
      });
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Enhanced Header with AI Coach Selection */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="text-2xl font-bold"
                    />
                    <Button size="sm" onClick={() => setIsEditingName(false)}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {sessionName}
                    </h1>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditingName(true)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                {isEditingPurpose ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Textarea
                      value={sessionPurpose}
                      onChange={(e) => setSessionPurpose(e.target.value)}
                      placeholder="What's your goal for this session?"
                      className="min-h-[60px]"
                    />
                    <Button size="sm" onClick={() => setIsEditingPurpose(false)}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg text-gray-600">
                      {sessionPurpose || "Click to set your session goal"}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditingPurpose(true)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* AI Coach Selection */}
              <div className="flex items-center gap-4">
                {selectedAICoach && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">{selectedAICoach.avatar}</span>
                    <div>
                      <p className="font-semibold text-sm">{selectedAICoach.name}</p>
                      <p className="text-xs text-gray-600">{selectedAICoach.type}</p>
                    </div>
                  </div>
                )}
                
                {/* Recording Controls */}
                <div className="flex gap-2">
                  {!isRecording ? (
                    <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                      <Mic className="w-5 h-5 mr-2" />
                      Start Practice
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="outline">
                      <Square className="w-5 h-5 mr-2" />
                      Stop ({Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')})
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Calibration Alert */}
        {isCalibrating && (
          <Alert className="border-blue-200 bg-blue-50">
            <Eye className="h-4 w-4" />
            <AlertDescription>
              Calibrating eye tracking for precise gaze analysis. Please look at the blue dots and click on them.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Video Feed and Live Metrics */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Video Feed */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-75"
                  />
                  
                  {/* Live Status Indicators */}
                  {isRecording && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge variant="destructive" className="animate-pulse">
                        <Activity className="w-3 h-3 mr-1" />
                        LIVE
                      </Badge>
                      <Badge variant="secondary">
                        {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
                      </Badge>
                    </div>
                  )}

                  {/* Real-time Metrics Overlay */}
                  {isRecording && (
                    <div className="absolute top-4 right-4 space-y-2">
                      <div className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>Eye Contact: {Math.round(metrics.bodyLanguage.eyeContactScore)}%</span>
                        </div>
                      </div>
                      <div className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>Confidence: {Math.round(metrics.emotion.confidence)}%</span>
                        </div>
                      </div>
                      <div className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Engagement: {Math.round(metrics.emotion.engagement)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Metrics Dashboard */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Analytics Dashboard
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
                    >
                      {showAdvancedMetrics ? 'Simple' : 'Advanced'} View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generateGazeHeatmap}
                      disabled={!isRecording}
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Gaze Heatmap
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={recalibrateEyeTracking}
                    >
                      Recalibrate
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="live">Live Metrics</TabsTrigger>
                    <TabsTrigger value="voice">Voice Analysis</TabsTrigger>
                    <TabsTrigger value="body">Body Language</TabsTrigger>
                    <TabsTrigger value="emotion">Emotions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="live" className="space-y-4">
                    {/* Real-time Voice Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="p-4">
                        <div className="text-center">
                          <Mic2 className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                          <p className="text-2xl font-bold">{Math.round(metrics.voice.clarity)}%</p>
                          <p className="text-sm text-gray-600">Clarity</p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <Zap className="w-6 h-6 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold">{Math.round(metrics.voice.pace)}</p>
                          <p className="text-sm text-gray-600">WPM</p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <Eye className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                          <p className="text-2xl font-bold">{Math.round(metrics.bodyLanguage.eyeContactScore)}%</p>
                          <p className="text-sm text-gray-600">Eye Contact</p>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <div className="text-center">
                          <Star className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                          <p className="text-2xl font-bold">{Math.round(metrics.emotion.confidence)}%</p>
                          <p className="text-sm text-gray-600">Confidence</p>
                        </div>
                      </Card>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Voice Clarity</span>
                          <span>{Math.round(metrics.voice.clarity)}%</span>
                        </div>
                        <Progress value={metrics.voice.clarity} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Body Language</span>
                          <span>{Math.round((metrics.bodyLanguage.eyeContactScore + metrics.bodyLanguage.postureScore) / 2)}%</span>
                        </div>
                        <Progress value={(metrics.bodyLanguage.eyeContactScore + metrics.bodyLanguage.postureScore) / 2} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Engagement</span>
                          <span>{Math.round(metrics.emotion.engagement)}%</span>
                        </div>
                        <Progress value={metrics.emotion.engagement} className="h-2" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="voice" className="space-y-4">
                    {showAdvancedMetrics ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold">Pitch Variation</p>
                          <Progress value={metrics.voice.pitchVariation} className="mt-2" />
                          <p className="text-sm text-gray-600 mt-1">{Math.round(metrics.voice.pitchVariation)}% variety</p>
                        </div>
                        <div>
                          <p className="font-semibold">Vocal Fry Detection</p>
                          <Badge variant={metrics.voice.vocalFryDetection ? "destructive" : "secondary"} className="mt-2">
                            {metrics.voice.vocalFryDetection ? "Detected" : "Clear"}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-semibold">Uptalk Patterns</p>
                          <p className="text-lg font-bold mt-1">{metrics.voice.uptalkPatterns}</p>
                          <p className="text-sm text-gray-600">instances detected</p>
                        </div>
                        <div>
                          <p className="font-semibold">Filler Words</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {metrics.content.fillerWords.slice(-5).map((word, idx) => (
                              <Badge key={idx} variant="outline">{word}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Mic2 className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                        <p className="text-lg font-semibold">Voice Analysis Active</p>
                        <p className="text-gray-600">Advanced metrics will appear during recording</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="body" className="space-y-4">
                    {metrics.bodyLanguage.facialExpressions ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-semibold">Eye Contact Distribution</p>
                            <div className="mt-2 space-y-1">
                              {metrics.bodyLanguage.gazeAnalysis?.focusRegions && Object.entries(metrics.bodyLanguage.gazeAnalysis.focusRegions).map(([region, percentage]) => (
                                <div key={region} className="flex justify-between text-sm">
                                  <span className="capitalize">{region.replace(/([A-Z])/g, ' $1')}</span>
                                  <span>{Math.round(percentage)}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold">Facial Expressions</p>
                            <div className="mt-2 space-y-1">
                              {Object.entries(metrics.bodyLanguage.facialExpressions.emotions).map(([emotion, intensity]) => (
                                <div key={emotion} className="flex justify-between text-sm">
                                  <span className="capitalize">{emotion}</span>
                                  <span>{Math.round(intensity * 100)}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Gesture Recognition Results */}
                        <div>
                          <p className="font-semibold">Gesture Effectiveness</p>
                          <Progress value={metrics.bodyLanguage.gestureEffectiveness} className="mt-2" />
                          <p className="text-sm text-gray-600 mt-1">{Math.round(metrics.bodyLanguage.gestureEffectiveness)}% effective gestures</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Camera className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                        <p className="text-lg font-semibold">Body Language Analysis</p>
                        <p className="text-gray-600">Computer vision analysis will appear during recording</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="emotion" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(metrics.emotion).map(([emotion, value]) => (
                        <div key={emotion}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize">{emotion}</span>
                            <span>{Math.round(value)}%</span>
                          </div>
                          <Progress value={value} className="h-3" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Micro-expressions */}
                    {metrics.bodyLanguage.facialExpressions?.expressions && (
                      <div>
                        <p className="font-semibold mb-2">Emotional Intelligence</p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm">
                            Your authenticity score is {Math.round(metrics.emotion.authenticity)}%. 
                            {metrics.emotion.authenticity > 80 ? ' Excellent genuine expression!' : 
                             metrics.emotion.authenticity > 60 ? ' Good natural delivery.' : 
                             ' Try to be more natural and relaxed.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Live Feedback and Achievements Panel */}
          <div className="space-y-4">
            
            {/* Live AI Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Live AI Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {liveFeedback.length > 0 ? liveFeedback.map((feedback) => (
                      <Alert key={feedback.id} className={`
                        ${feedback.severity === 'excellent' ? 'border-green-200 bg-green-50' :
                          feedback.severity === 'good' ? 'border-blue-200 bg-blue-50' :
                          feedback.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                          'border-red-200 bg-red-50'}
                      `}>
                        <AlertDescription>
                          <div className="flex justify-between items-start mb-1">
                            <Badge variant="outline" className="capitalize">
                              {feedback.category.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {Math.round(feedback.confidence * 100)}% confidence
                            </span>
                          </div>
                          <p className="text-sm font-medium">{feedback.feedback}</p>
                          <p className="text-xs text-gray-600 mt-1">{feedback.actionable}</p>
                        </AlertDescription>
                      </Alert>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        <Brain className="w-8 h-8 mx-auto mb-2" />
                        <p>AI feedback will appear during your practice session</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.slice(-3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <span className="text-2xl">{achievement.reward.badge}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{achievement.name}</p>
                          <p className="text-xs text-gray-600">{achievement.description}</p>
                          <Badge variant="secondary" className="mt-1">
                            +{achievement.reward.points} points
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Award className="w-8 h-8 mx-auto mb-2" />
                    <p>Achievements will unlock as you practice</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Progress */}
            {userProgress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Level {userProgress.level}</span>
                      <span>{userProgress.currentExp} / {userProgress.expToNextLevel + userProgress.currentExp} XP</span>
                    </div>
                    <Progress value={(userProgress.currentExp / (userProgress.expToNextLevel + userProgress.currentExp)) * 100} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{userProgress.totalPoints}</p>
                      <p className="text-xs text-gray-600">Total Points</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{userProgress.streaks.dailyPractice}</p>
                      <p className="text-xs text-gray-600">Day Streak</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold mb-2">Session Stats</p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Total Sessions:</span>
                        <span>{userProgress.stats.totalSessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Practice Time:</span>
                        <span>{Math.round(userProgress.stats.totalMinutes / 60)}h {userProgress.stats.totalMinutes % 60}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Score:</span>
                        <span>{Math.round(userProgress.stats.averageScore)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Gaze Heatmap Modal */}
        {showGazeHeatmap && gazeHeatmap && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowGazeHeatmap(false)}>
            <Card className="max-w-2xl w-full m-4" onClick={e => e.stopPropagation()}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gaze Heatmap Analysis</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowGazeHeatmap(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{Math.round(gazeHeatmap.centerFocus)}%</p>
                      <p className="text-sm text-gray-600">Center Focus</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{Math.round(gazeHeatmap.peripheralDistraction)}%</p>
                      <p className="text-sm text-gray-600">Peripheral Distraction</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-2">Hotspots Detected: {gazeHeatmap.hotspots.length}</p>
                    <div className="bg-gray-100 p-4 rounded text-sm">
                      {gazeHeatmap.centerFocus > 70 ? 
                        "Excellent focus! You maintained strong attention on the center area." :
                        gazeHeatmap.centerFocus > 50 ?
                        "Good focus with some wandering. Try to keep your gaze more centered." :
                        "Scattered attention detected. Practice maintaining focus on your main target area."
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}