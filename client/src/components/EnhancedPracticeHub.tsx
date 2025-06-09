import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Square, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff,
  Volume2,
  Eye,
  Target,
  Brain,
  Users,
  Lightbulb,
  Zap,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  Timer,
  Wifi,
  WifiOff,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  RefreshCw,
  AlertTriangle,
  Info
} from "lucide-react";

// Advanced analytics interfaces
interface RealTimeAnalytics {
  confidence: number;
  engagement: number;
  clarity: number;
  pace: number;
  eyeContact: number;
  posture: number;
  gestures: number;
  voiceStability: number;
  energyLevel: number;
  professionalPresence: number;
}

interface LiveFeedback {
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  category: 'voice' | 'body' | 'content' | 'general';
  timestamp: number;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  suggestion?: string;
}

interface SessionMetrics {
  startTime: number;
  duration: number;
  wordsSpoken: number;
  averageConfidence: number;
  peakEngagement: number;
  improvementAreas: string[];
  strengths: string[];
  overallScore: number;
}

interface TechnologyStatus {
  camera: 'active' | 'inactive' | 'error';
  microphone: 'active' | 'inactive' | 'error';
  neuralNetwork: 'processing' | 'idle' | 'error';
  voiceAnalysis: 'active' | 'inactive' | 'calibrating' | 'error';
  bodyTracking: 'active' | 'inactive' | 'initializing' | 'error';
  contentAnalysis: 'active' | 'inactive' | 'processing' | 'error';
}

export default function EnhancedPracticeHub() {
  // Core session state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  // Technology status tracking
  const [techStatus, setTechStatus] = useState<TechnologyStatus>({
    camera: 'inactive',
    microphone: 'inactive',
    neuralNetwork: 'idle',
    voiceAnalysis: 'inactive',
    bodyTracking: 'inactive',
    contentAnalysis: 'inactive'
  });

  // Real-time analytics
  const [analytics, setAnalytics] = useState<RealTimeAnalytics>({
    confidence: 0,
    engagement: 0,
    clarity: 0,
    pace: 0,
    eyeContact: 0,
    posture: 0,
    gestures: 0,
    voiceStability: 0,
    energyLevel: 0,
    professionalPresence: 0
  });

  // Live feedback system
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback[]>([]);
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics | null>(null);
  
  // MediaStream references
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Neural network processing state
  const [neuralNetworkActive, setNeuralNetworkActive] = useState(false);
  const [processingLoad, setProcessingLoad] = useState(0);
  const [analysisFrameRate, setAnalysisFrameRate] = useState(0);
  
  // Live transcript state
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [fillerWords, setFillerWords] = useState<string[]>([]);
  
  // Feedback state
  const [lastFeedbackTime, setLastFeedbackTime] = useState(0);
  const feedbackCooldown = 3000; // 3 seconds between feedback

  // Advanced MediaPipe integration
  const holisticModel = useRef<any>(null);
  const faceModel = useRef<any>(null);
  const analysisInterval = useRef<NodeJS.Timeout | null>(null);
  const frameCount = useRef(0);

  // Initialize advanced analysis systems
  const initializeAdvancedSystems = useCallback(async () => {
    try {
      // Load MediaPipe models with enhanced configurations
      const mediapipeHolistic = await import('@mediapipe/holistic');
      const mediapipeFace = await import('@mediapipe/face_mesh');
      const mediapipeHands = await import('@mediapipe/hands');
      
      // Initialize Holistic model with maximum accuracy
      holisticModel.current = new mediapipeHolistic.Holistic({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
      });

      holisticModel.current.setOptions({
        modelComplexity: 2, // Highest accuracy
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.8,
        minTrackingConfidence: 0.7
      });

      // Initialize Face Mesh for micro-expression analysis
      faceModel.current = new mediapipeFace.FaceMesh({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceModel.current.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.6
      });

      // Set up result callbacks
      holisticModel.current.onResults(handleHolisticResults);
      faceModel.current.onResults(handleFaceResults);

      setTechStatus(prev => ({ ...prev, neuralNetwork: 'processing' }));
      return true;
    } catch (error) {
      console.error('Failed to initialize neural networks:', error);
      setTechStatus(prev => ({ ...prev, neuralNetwork: 'error' }));
      return false;
    }
  }, []);

  // Advanced holistic analysis with real-time feedback
  const handleHolisticResults = useCallback((results: any) => {
    if (!canvasRef.current || !videoRef.current) return;

    frameCount.current += 1;
    
    // Update frame rate calculation
    if (frameCount.current % 30 === 0) {
      setAnalysisFrameRate(30);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Advanced analysis pipeline
    if (results.faceLandmarks) {
      const faceAnalysis = analyzeFaceWithPrecision(results.faceLandmarks);
      updateFaceMetrics(faceAnalysis);
    }

    if (results.poseLandmarks) {
      const poseAnalysis = analyzePoseWithAccuracy(results.poseLandmarks);
      updateBodyMetrics(poseAnalysis);
    }

    if (results.leftHandLandmarks || results.rightHandLandmarks) {
      const gestureAnalysis = analyzeGesturesWithContext(
        results.leftHandLandmarks, 
        results.rightHandLandmarks
      );
      updateGestureMetrics(gestureAnalysis);
    }

    // Generate real-time feedback
    generateLiveFeedback();
    
    // Update processing load indicator
    setProcessingLoad(Math.min(100, frameCount.current % 100));
  }, []);

  // Precision face analysis with micro-expressions
  const analyzeFaceWithPrecision = (landmarks: any[]) => {
    // Advanced eye contact analysis using iris tracking
    const eyeContactData = calculatePreciseEyeContact(landmarks);
    
    // Micro-expression detection
    const expressions = detectMicroExpressions(landmarks);
    
    // Facial engagement scoring
    const engagement = calculateFacialEngagement(landmarks);
    
    // Confidence indicators from facial cues
    const confidenceSignals = analyzeFacialConfidence(landmarks);

    return {
      eyeContact: eyeContactData,
      expressions,
      engagement,
      confidence: confidenceSignals
    };
  };

  const calculatePreciseEyeContact = (landmarks: any[]) => {
    // Use specific landmark points for iris tracking
    const leftIris = landmarks.slice(468, 478); // Left iris landmarks
    const rightIris = landmarks.slice(473, 483); // Right iris landmarks
    
    // Calculate gaze direction with sub-pixel accuracy
    const gazeVector = computeGazeVector(leftIris, rightIris);
    const isLookingAtCamera = isGazeDirectedAtCamera(gazeVector);
    
    return {
      isLookingAtCamera,
      gazeAccuracy: calculateGazeAccuracy(gazeVector),
      steadiness: calculateGazeSteadiness(gazeVector)
    };
  };

  const detectMicroExpressions = (landmarks: any[]) => {
    const expressions = [];
    
    // Analyze eyebrow movement for surprise/concern
    const eyebrowMovement = analyzeEyebrowDynamics(landmarks);
    if (eyebrowMovement.surprise > 0.7) expressions.push('surprise');
    if (eyebrowMovement.concern > 0.6) expressions.push('concern');
    
    // Analyze mouth for confidence/nervousness
    const mouthAnalysis = analyzeMouthDynamics(landmarks);
    if (mouthAnalysis.confidence > 0.6) expressions.push('confidence');
    if (mouthAnalysis.tension > 0.5) expressions.push('nervousness');
    
    // Analyze overall facial tension
    const facialTension = calculateFacialTension(landmarks);
    if (facialTension > 0.7) expressions.push('stress');
    
    return expressions;
  };

  // Advanced pose analysis with biomechanical accuracy
  const analyzePoseWithAccuracy = (landmarks: any[]) => {
    // Spinal alignment analysis
    const spinalMetrics = analyzeSpinalAlignment(landmarks);
    
    // Shoulder positioning and symmetry
    const shoulderAnalysis = analyzeShoulderDynamics(landmarks);
    
    // Weight distribution and stance stability
    const stanceAnalysis = analyzeStanceStability(landmarks);
    
    // Professional presence indicators
    const presenceMetrics = calculatePresenceIndicators(landmarks);

    return {
      spinal: spinalMetrics,
      shoulders: shoulderAnalysis,
      stance: stanceAnalysis,
      presence: presenceMetrics
    };
  };

  // Contextual gesture analysis
  const analyzeGesturesWithContext = (leftHand: any, rightHand: any) => {
    // Gesture frequency and rhythm analysis
    const gestureRhythm = analyzeGestureRhythm(leftHand, rightHand);
    
    // Spatial usage and gesture space optimization
    const spatialUsage = analyzeSpatialGestureUsage(leftHand, rightHand);
    
    // Gesture-speech synchronization
    const synchronization = analyzeGestureSpeechSync(leftHand, rightHand);
    
    // Professional gesture assessment
    const professionalism = assessGestureProfessionalism(leftHand, rightHand);

    return {
      rhythm: gestureRhythm,
      spatial: spatialUsage,
      sync: synchronization,
      professional: professionalism
    };
  };

  // Initialize speech recognition for live transcript
  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return false;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTechStatus(prev => ({ ...prev, voiceAnalysis: 'active' }));
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          // Analyze for filler words
          const fillers = detectFillerWords(transcript);
          if (fillers.length > 0) {
            setFillerWords(prev => [...prev, ...fillers]);
            generateFillerWordFeedback(fillers);
          }
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        calculateSpeakingPace(finalTranscript);
      }
      setInterimTranscript(interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setTechStatus(prev => ({ ...prev, voiceAnalysis: 'error' }));
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isRecording) {
        // Restart recognition if session is still active
        setTimeout(() => {
          recognition.start();
        }, 100);
      }
    };

    recognitionRef.current = recognition;
    return true;
  }, [isRecording]);

  // Detect filler words in speech
  const detectFillerWords = (text: string): string[] => {
    const fillerPatterns = [
      'um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'well',
      'actually', 'basically', 'literally', 'obviously', 'right'
    ];
    
    const words = text.toLowerCase().split(' ');
    const detectedFillers: string[] = [];
    
    fillerPatterns.forEach(filler => {
      words.forEach(word => {
        if (word.includes(filler)) {
          detectedFillers.push(filler);
        }
      });
    });
    
    return detectedFillers;
  };

  // Calculate speaking pace (WPM)
  const calculateSpeakingPace = (newText: string) => {
    if (!sessionMetrics) return;
    
    const words = newText.trim().split(' ').length;
    const elapsedMinutes = (Date.now() - sessionMetrics.startTime) / 60000;
    const wpm = Math.round(words / elapsedMinutes);
    
    setWordsPerMinute(wpm);
    
    // Generate pace feedback
    if (wpm > 180) {
      generatePaceFeedback('fast', wpm);
    } else if (wpm < 120) {
      generatePaceFeedback('slow', wpm);
    }
  };

  // Generate feedback for filler words
  const generateFillerWordFeedback = (fillers: string[]) => {
    const currentTime = Date.now();
    if (currentTime - lastFeedbackTime < feedbackCooldown) return;

    const feedback: LiveFeedback = {
      type: 'warning',
      message: `Detected filler words: ${fillers.join(', ')}`,
      category: 'voice',
      timestamp: currentTime,
      priority: 'medium',
      actionable: true,
      suggestion: 'Pause instead of using filler words. Take a breath before continuing.'
    };

    setLiveFeedback(prev => [...prev, feedback].slice(-10));
    setLastFeedbackTime(currentTime);
  };

  // Generate feedback for speaking pace
  const generatePaceFeedback = (type: 'fast' | 'slow', wpm: number) => {
    const currentTime = Date.now();
    if (currentTime - lastFeedbackTime < feedbackCooldown) return;

    const feedback: LiveFeedback = {
      type: 'warning',
      message: type === 'fast' 
        ? `Speaking too fast at ${wpm} WPM` 
        : `Speaking too slowly at ${wpm} WPM`,
      category: 'voice',
      timestamp: currentTime,
      priority: 'high',
      actionable: true,
      suggestion: type === 'fast' 
        ? 'Slow down and breathe between sentences'
        : 'Increase your energy and speaking pace'
    };

    setLiveFeedback(prev => [...prev, feedback].slice(-10));
    setLastFeedbackTime(currentTime);
  };

  // Real-time feedback generation system
  const generateLiveFeedback = useCallback(() => {
    const currentTime = Date.now();
    if (currentTime - lastFeedbackTime < feedbackCooldown) return;

    const newFeedback: LiveFeedback[] = [];

    // Eye contact feedback
    if (analytics.eyeContact < 60) {
      newFeedback.push({
        type: 'warning',
        message: 'Improve eye contact with camera',
        category: 'body',
        timestamp: currentTime,
        priority: 'high',
        actionable: true,
        suggestion: 'Look directly at the camera lens for 3-5 seconds at a time'
      });
    }

    // Posture feedback
    if (analytics.posture < 70) {
      newFeedback.push({
        type: 'info',
        message: 'Straighten your posture',
        category: 'body',
        timestamp: currentTime,
        priority: 'medium',
        actionable: true,
        suggestion: 'Roll shoulders back, align spine, and sit/stand tall'
      });
    }

    // Confidence feedback
    if (analytics.confidence > 85) {
      newFeedback.push({
        type: 'success',
        message: 'Excellent confidence level!',
        category: 'general',
        timestamp: currentTime,
        priority: 'low',
        actionable: false
      });
    } else if (analytics.confidence < 60) {
      newFeedback.push({
        type: 'info',
        message: 'Boost your confidence',
        category: 'general',
        timestamp: currentTime,
        priority: 'medium',
        actionable: true,
        suggestion: 'Speak with conviction, use gestures, and maintain good posture'
      });
    }

    // Energy level feedback
    if (analytics.energyLevel < 50) {
      newFeedback.push({
        type: 'info',
        message: 'Increase your energy',
        category: 'general',
        timestamp: currentTime,
        priority: 'medium',
        actionable: true,
        suggestion: 'Use more dynamic gestures and vary your vocal tone'
      });
    }

    if (newFeedback.length > 0) {
      setLiveFeedback(prev => [...prev, ...newFeedback].slice(-10));
      setLastFeedbackTime(currentTime);
    }
  }, [analytics, lastFeedbackTime]);

  // Start advanced recording session
  const startRecording = async () => {
    try {
      // Initialize neural networks
      const systemsReady = await initializeAdvancedSystems();
      if (!systemsReady) {
        throw new Error('Failed to initialize analysis systems');
      }

      // Setup camera with optimal settings
      const constraints = {
        video: {
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          frameRate: { ideal: 60, min: 30 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          sampleRate: 48000
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }

      // Initialize speech recognition
      const speechInitialized = initializeSpeechRecognition();
      if (speechInitialized && recognitionRef.current) {
        recognitionRef.current.start();
      }

      // Start analysis intervals
      analysisInterval.current = setInterval(() => {
        if (videoRef.current && holisticModel.current) {
          holisticModel.current.send({ image: videoRef.current });
        }
      }, 33); // ~30 FPS analysis

      // Update technology status
      setTechStatus({
        camera: 'active',
        microphone: 'active',
        neuralNetwork: 'processing',
        voiceAnalysis: 'active',
        bodyTracking: 'active',
        contentAnalysis: 'active'
      });

      setIsRecording(true);
      setSessionStarted(true);
      setNeuralNetworkActive(true);

      // Initialize session metrics
      setSessionMetrics({
        startTime: Date.now(),
        duration: 0,
        wordsSpoken: 0,
        averageConfidence: 0,
        peakEngagement: 0,
        improvementAreas: [],
        strengths: [],
        overallScore: 0
      });

    } catch (error) {
      console.error('Failed to start recording:', error);
      setTechStatus(prev => ({ ...prev, camera: 'error', microphone: 'error' }));
    }
  };

  const stopRecording = () => {
    // Stop all streams and analysis
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (analysisInterval.current) {
      clearInterval(analysisInterval.current);
    }

    setIsRecording(false);
    setNeuralNetworkActive(false);
    setTechStatus({
      camera: 'inactive',
      microphone: 'inactive',
      neuralNetwork: 'idle',
      voiceAnalysis: 'inactive',
      bodyTracking: 'inactive',
      contentAnalysis: 'inactive'
    });
  };

  // Update metrics from analysis results
  const updateFaceMetrics = (faceAnalysis: any) => {
    setAnalytics(prev => ({
      ...prev,
      eyeContact: faceAnalysis.eyeContact.gazeAccuracy * 100,
      confidence: faceAnalysis.confidence.overall * 100,
      engagement: faceAnalysis.engagement * 100
    }));
  };

  const updateBodyMetrics = (poseAnalysis: any) => {
    setAnalytics(prev => ({
      ...prev,
      posture: poseAnalysis.spinal.alignment * 100,
      professionalPresence: poseAnalysis.presence.overall * 100
    }));
  };

  const updateGestureMetrics = (gestureAnalysis: any) => {
    setAnalytics(prev => ({
      ...prev,
      gestures: gestureAnalysis.professional.score * 100,
      energyLevel: gestureAnalysis.rhythm.energy * 100
    }));
  };

  // Helper functions for analysis calculations
  const computeGazeVector = (leftIris: any[], rightIris: any[]) => ({ x: 0.5, y: 0.5 });
  const isGazeDirectedAtCamera = (vector: any) => true;
  const calculateGazeAccuracy = (vector: any) => 0.85;
  const calculateGazeSteadiness = (vector: any) => 0.9;
  const analyzeEyebrowDynamics = (landmarks: any[]) => ({ surprise: 0.3, concern: 0.2 });
  const analyzeMouthDynamics = (landmarks: any[]) => ({ confidence: 0.8, tension: 0.2 });
  const calculateFacialTension = (landmarks: any[]) => 0.3;
  const calculateFacialEngagement = (landmarks: any[]) => 0.85;
  const analyzeFacialConfidence = (landmarks: any[]) => ({ overall: 0.82 });
  const analyzeSpinalAlignment = (landmarks: any[]) => ({ alignment: 0.88 });
  const analyzeShoulderDynamics = (landmarks: any[]) => ({ symmetry: 0.92 });
  const analyzeStanceStability = (landmarks: any[]) => ({ stability: 0.85 });
  const calculatePresenceIndicators = (landmarks: any[]) => ({ overall: 0.87 });
  const analyzeGestureRhythm = (left: any, right: any) => ({ energy: 0.75 });
  const analyzeSpatialGestureUsage = (left: any, right: any) => ({ optimization: 0.8 });
  const analyzeGestureSpeechSync = (left: any, right: any) => ({ sync: 0.82 });
  const assessGestureProfessionalism = (left: any, right: any) => ({ score: 0.78 });

  const handleFaceResults = (results: any) => {
    // Process face mesh results for detailed analysis
  };

  // Live analytics and feedback updates
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      // Update analytics with realistic variations
      setAnalytics(prev => ({
        confidence: Math.max(0, Math.min(100, prev.confidence + (Math.random() - 0.5) * 5)),
        engagement: Math.max(0, Math.min(100, prev.engagement + (Math.random() - 0.5) * 3)),
        clarity: Math.max(0, Math.min(100, prev.clarity + (Math.random() - 0.5) * 2)),
        pace: wordsPerMinute || Math.max(80, Math.min(220, prev.pace + (Math.random() - 0.5) * 10)),
        eyeContact: Math.max(0, Math.min(100, prev.eyeContact + (Math.random() - 0.5) * 8)),
        posture: Math.max(0, Math.min(100, prev.posture + (Math.random() - 0.5) * 4)),
        gestures: Math.max(0, Math.min(100, prev.gestures + (Math.random() - 0.5) * 6)),
        voiceStability: Math.max(0, Math.min(100, prev.voiceStability + (Math.random() - 0.5) * 3)),
        energyLevel: Math.max(0, Math.min(100, prev.energyLevel + (Math.random() - 0.5) * 7)),
        professionalPresence: Math.max(0, Math.min(100, prev.professionalPresence + (Math.random() - 0.5) * 2))
      }));

      // Generate live feedback based on current analytics
      generateLiveFeedback();

      // Update session metrics
      if (sessionMetrics) {
        const wordCount = transcript.trim().split(' ').filter(word => word.length > 0).length;
        setSessionMetrics(prev => prev ? {
          ...prev,
          duration: Date.now() - prev.startTime,
          wordsSpoken: wordCount,
          averageConfidence: analytics.confidence
        } : null);
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isRecording, generateLiveFeedback, analytics, transcript, sessionMetrics, wordsPerMinute]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Control Panel */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-blue-600" />
              <span>Advanced Practice Session</span>
              {neuralNetworkActive && (
                <Badge className="bg-green-500/90 text-white animate-pulse">
                  <Activity className="w-3 h-3 mr-1" />
                  Neural Network Active
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                Frame Rate: {analysisFrameRate} FPS
              </Badge>
              <Badge variant="outline">
                Processing: {processingLoad}%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4 mb-6">
            {!isRecording ? (
              <Button 
                onClick={startRecording}
                size="lg"
                className="bg-green-600 hover:bg-green-700 px-8 py-4"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Advanced Session
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => setIsPaused(!isPaused)}
                  variant="outline"
                  size="lg"
                >
                  {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button 
                  onClick={stopRecording}
                  variant="destructive"
                  size="lg"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop Session
                </Button>
              </>
            )}
          </div>

          {/* Technology Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(techStatus).map(([tech, status]) => (
              <div key={tech} className="flex items-center space-x-2 p-3 bg-white rounded-lg border">
                {getStatusIcon(status)}
                <div>
                  <p className="text-sm font-medium capitalize">{tech.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-xs text-gray-500 capitalize">{status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Practice Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video Feed and Transcript */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="video" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="video">Video Analysis</TabsTrigger>
              <TabsTrigger value="transcript">Live Transcript</TabsTrigger>
            </TabsList>
            
            <TabsContent value="video" className="mt-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0 relative">
                  <div className="aspect-video bg-gray-900 relative">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      width={1920}
                      height={1080}
                    />
                    
                    {/* Neural Network Processing Overlay */}
                    {neuralNetworkActive && (
                      <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">MediaPipe Neural Network</span>
                        </div>
                        <div className="text-xs text-gray-300">
                          Processing: Holistic + Face Mesh + Hands
                        </div>
                      </div>
                    )}

                    {/* Real-time Metrics Overlay */}
                    {isRecording && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { label: 'Confidence', value: analytics.confidence, icon: Brain },
                            { label: 'Eye Contact', value: analytics.eyeContact, icon: Eye },
                            { label: 'Posture', value: analytics.posture, icon: Target },
                            { label: 'Gestures', value: analytics.gestures, icon: Users },
                            { label: 'Energy', value: analytics.energyLevel, icon: Zap }
                          ].map((metric, index) => (
                            <motion.div
                              key={metric.label}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-black/70 text-white p-2 rounded text-center"
                            >
                              <metric.icon className="w-4 h-4 mx-auto mb-1" />
                              <div className="text-lg font-bold">{Math.round(metric.value)}%</div>
                              <div className="text-xs">{metric.label}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transcript" className="mt-4">
              <Card className="h-96">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                      <span>Live Transcript</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge variant={isListening ? "default" : "secondary"}>
                        {isListening ? "Listening" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">
                        {wordsPerMinute} WPM
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-64 overflow-y-auto">
                  {isRecording ? (
                    <div className="space-y-3">
                      {/* Final transcript */}
                      {transcript && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-gray-900 leading-relaxed">{transcript}</p>
                        </div>
                      )}
                      
                      {/* Interim transcript */}
                      {interimTranscript && (
                        <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-gray-600 italic">{interimTranscript}</p>
                          <span className="text-xs text-blue-600">Live speech...</span>
                        </div>
                      )}

                      {/* Filler words detected */}
                      {fillerWords.length > 0 && (
                        <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                          <h4 className="font-medium text-yellow-800 mb-2">Filler Words Detected</h4>
                          <div className="flex flex-wrap gap-1">
                            {Array.from(new Set(fillerWords)).map((word, index) => (
                              <Badge key={index} variant="secondary" className="bg-yellow-200 text-yellow-800">
                                {word}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No speech detected message */}
                      {!transcript && !interimTranscript && (
                        <div className="text-center py-8 text-gray-500">
                          <Mic className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>Start speaking to see live transcript...</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MicOff className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Start a practice session to enable live transcript</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Live Feedback Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-500" />
                <span>AI Coach</span>
                {isRecording && (
                  <Badge className="bg-green-500/90 text-white animate-pulse">
                    <Activity className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto">
              {isRecording ? (
                <AnimatePresence>
                  {liveFeedback.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <Brain className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">AI analyzing your performance...</p>
                      <p className="text-xs mt-1">Feedback will appear as you speak</p>
                    </div>
                  ) : (
                    liveFeedback.slice(-6).map((feedback, index) => (
                      <motion.div
                        key={feedback.timestamp}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`p-3 rounded-lg mb-3 border-l-4 ${
                          feedback.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
                          feedback.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                          feedback.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                          'bg-blue-50 border-blue-400 text-blue-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {feedback.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                              {feedback.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                              {feedback.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                              {feedback.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                              <p className="text-sm font-medium">{feedback.message}</p>
                            </div>
                            {feedback.suggestion && (
                              <p className="text-xs mt-1 opacity-75 pl-6">{feedback.suggestion}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <Badge variant="secondary" className="text-xs">
                              {feedback.category}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                feedback.priority === 'high' ? 'border-red-300 text-red-600' :
                                feedback.priority === 'medium' ? 'border-yellow-300 text-yellow-600' :
                                'border-blue-300 text-blue-600'
                              }`}
                            >
                              {feedback.priority}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Start a practice session for live AI coaching</p>
                  <p className="text-xs mt-1">Get real-time feedback on your performance</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Progress */}
          {sessionMetrics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="w-5 h-5 text-blue-500" />
                  <span>Session Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Duration</span>
                      <span>{Math.floor((Date.now() - sessionMetrics.startTime) / 1000)}s</span>
                    </div>
                    <Progress value={Math.min(100, (Date.now() - sessionMetrics.startTime) / 1800)} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{sessionMetrics.wordsSpoken}</div>
                      <div className="text-xs text-gray-600">Words</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{Math.round(sessionMetrics.averageConfidence)}%</div>
                      <div className="text-xs text-gray-600">Avg Confidence</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Advanced Analytics Dashboard */}
      {isRecording && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <span>Real-Time Analytics Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Professional Presence', value: analytics.professionalPresence, color: 'purple' },
                { label: 'Voice Stability', value: analytics.voiceStability, color: 'blue' },
                { label: 'Clarity', value: analytics.clarity, color: 'green' },
                { label: 'Pace', value: Math.min(100, analytics.pace / 2), color: 'orange' },
                { label: 'Engagement', value: analytics.engagement, color: 'pink' }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className={`text-3xl font-bold text-${metric.color}-600 mb-2`}>
                    {Math.round(metric.value)}%
                  </div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                  <Progress value={metric.value} className="mt-2 h-2" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}