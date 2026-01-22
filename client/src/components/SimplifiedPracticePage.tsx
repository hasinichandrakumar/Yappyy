// Simplified Practice Page - Clean interface with essential features
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mic, Square, Edit3, Save, Eye, 
  Activity, TrendingUp, FileText, Users,
  Video, Play, Pause, RotateCcw, Download,
  Library, Camera, Briefcase, GraduationCap,
  Heart, Target, BookOpen, BarChart3, Award,
  Presentation, Building, Lightbulb, CheckCircle,
  AlertTriangle, Info, Volume2, VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SessionDataViewer } from '@/components/SessionDataViewer';
import { useRoboflowVision } from '@/hooks/useRoboflowVision';
import { useFacialAnalysis } from '@/hooks/useFacialAnalysis';
import { useRobustComputerVision } from '@/hooks/useRobustComputerVision';
import { useAdvancedFillerDetection } from '@/hooks/useAdvancedFillerDetection';
import { useEnhancedMediaPipe } from '@/hooks/useEnhancedMediaPipe';
import { useEnhancedTensorFlow } from '@/hooks/useEnhancedTensorFlow';
import { useEnhancedWebGazer } from '@/hooks/useEnhancedWebGazer';
import AuthenticAnalysisPage from './AuthenticAnalysisPage';
import VideoPlaybackViewer from './VideoPlaybackViewer';
import RecordingLibrary from './RecordingLibrary';

import { 
  videoRecordingManager, 
  sessionRecordingStorage, 
  VideoRecordingData 
} from '@/lib/video-recording';
import { DeepgramSpeechService } from '@/lib/deepgramSpeech';
import { useMediaPipeBodyLanguage } from '@/hooks/useMediaPipeBodyLanguage';
import useRealTimeEyeContact from '@/hooks/useRealTimeEyeContact';
import AccurateWPMCalculator from '../utils/accurate-wpm-calculator';
import IncrementalFillerDetector from '../utils/incremental-filler-detector';

import { FillerWordHighlighter } from './FillerWordHighlighter';
import { LiveMetricsBox } from './LiveMetricsBox';

interface SimplifiedMetrics {
  eyeContact: number;
  confidence: number;
  engagement: number;
  wordsPerMinute: number;
  fillerWordCount: number;
  clarity: number;
  voice: {
    clarity: number;
    pace: number;
    volume: number;
    intonation: number;
    fillerCount: number;
    pauseEffectiveness: number;
    pitchVariation: number;
    vocalFryDetection: boolean;
    uptalkPatterns: number;
  };
  bodyLanguage: {
    eyeContactScore: number;
    facialExpressions: number;
    overallPresence: number;
  };
}

interface LiveFeedback {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: number;
}

// Session purpose options that correlate with template categories
const SESSION_PURPOSE_OPTIONS = [
  { 
    value: 'business-presentation', 
    label: 'Business Presentation', 
    icon: Briefcase,
    description: 'Professional presentations, pitches, and reports'
  },
  { 
    value: 'academic-presentation', 
    label: 'Academic Presentation', 
    icon: GraduationCap,
    description: 'School projects, research, and educational talks'
  },
  { 
    value: 'job-interview', 
    label: 'Job Interview', 
    icon: Users,
    description: 'Interview preparation and career discussions'
  },
  { 
    value: 'sales-presentation', 
    label: 'Sales Pitch', 
    icon: BarChart3,
    description: 'Sales presentations and product demos'
  },
  { 
    value: 'wedding-speech', 
    label: 'Wedding Speech', 
    icon: Heart,
    description: 'Wedding toasts, ceremonies, and celebrations'
  },
  { 
    value: 'motivational-speech', 
    label: 'Motivational Speech', 
    icon: Target,
    description: 'Inspirational talks and team motivation'
  },
  { 
    value: 'keynote-presentation', 
    label: 'Keynote/TED Talk', 
    icon: Presentation,
    description: 'Conference keynotes and thought leadership'
  },
  { 
    value: 'team-meeting', 
    label: 'Team Meeting', 
    icon: Building,
    description: 'Team updates, project discussions, and meetings'
  },
  { 
    value: 'storytelling', 
    label: 'Storytelling', 
    icon: BookOpen,
    description: 'Narrative presentations and creative speaking'
  },
  { 
    value: 'networking-pitch', 
    label: 'Networking Pitch', 
    icon: Lightbulb,
    description: 'Elevator pitches and networking introductions'
  },
  { 
    value: 'general-presentation', 
    label: 'General Practice', 
    icon: FileText,
    description: 'General speaking practice and skill building'
  }
];

// Enhanced Speech Recognition System
class RobustSpeechRecognition {
  private recognition: any = null;
  private isListening = false;
  private onTranscriptUpdate: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onError: ((error: string) => void) | null = null;
  private onStatusChange: ((status: 'idle' | 'starting' | 'active' | 'error') => void) | null = null;
  private currentTranscript = '';
  private interimTranscript = '';
  private shouldBeListening = false;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    console.log('🔧 Initializing robust speech recognition...');
    
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('⚠️ Speech recognition not supported in this browser');
      this.handleError('Speech recognition not supported in this browser');
      return false;
    }

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      // Configure for optimal performance
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3;
      
      // Set up event handlers
      this.recognition.onstart = () => {
        console.log('🎤 Speech recognition started');
        this.isListening = true;
        this.retryCount = 0; // Reset retry count on successful start
        if (this.onStatusChange) {
          this.onStatusChange('active');
        }
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          console.log('🎤 Speech result:', {
            transcript,
            isFinal: result.isFinal,
            confidence: result[0].confidence
          });

          if (result.isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimText += transcript;
          }
        }

        // Update transcripts
        if (finalTranscript) {
          this.currentTranscript += finalTranscript;
        }
        this.interimTranscript = interimText;

        // Call callback with full transcript
        const fullTranscript = this.currentTranscript + this.interimTranscript;
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(fullTranscript, finalTranscript.length > 0);
        }
      };

      this.recognition.onerror = (event: any) => {
        // Only log as error for critical issues, use warn for recoverable errors
        if (event.error === 'not-allowed' || event.error === 'audio-capture' || event.error === 'service-not-allowed') {
          console.error('❌ Speech recognition error:', event.error);
        } else {
          console.warn('⚠️ Speech recognition warning:', event.error);
        }
        this.isListening = false;
        
        // Handle specific error types
        let errorMessage = event.error;
        if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Please allow microphone permissions.';
        } else if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please speak clearly.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'Audio capture failed. Please check your microphone.';
        } else if (event.error === 'network') {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (event.error === 'aborted') {
          errorMessage = 'Speech recognition was aborted.';
        } else if (event.error === 'service-not-allowed') {
          errorMessage = 'Speech recognition service not allowed.';
        }
        
        if (this.onError) {
          this.onError(errorMessage);
        }
        
        if (this.onStatusChange) {
          this.onStatusChange('error');
        }
        
        // Auto-retry for certain errors
        if (this.shouldBeListening && this.retryCount < this.maxRetries && 
            (event.error === 'no-speech' || event.error === 'network')) {
          this.retryCount++;
          console.log(`🔄 Retrying speech recognition (attempt ${this.retryCount}/${this.maxRetries})...`);
          setTimeout(() => {
            if (this.shouldBeListening) {
              this.start();
            }
          }, 1000);
        }
      };

      this.recognition.onend = () => {
        console.log('🎤 Speech recognition ended');
        this.isListening = false;
        
        // Auto-restart if we should still be listening
        if (this.shouldBeListening && this.retryCount < this.maxRetries) {
          console.log('🔄 Auto-restarting speech recognition...');
          setTimeout(() => {
            if (this.shouldBeListening) {
              this.start();
            }
          }, 100);
        }
      };

      console.log('✅ Speech recognition initialized successfully');
      return true;
    } catch (error) {
      console.warn('⚠️ Failed to initialize speech recognition:', error);
      this.handleError('Failed to initialize speech recognition');
      return false;
    }
  }

  private handleError(error: string) {
    if (this.onError) {
      this.onError(error);
    }
    if (this.onStatusChange) {
      this.onStatusChange('error');
    }
  }

  public start() {
    if (!this.recognition) {
      console.warn('⚠️ Speech recognition not initialized');
      this.handleError('Speech recognition not initialized');
      return false;
    }

    try {
      this.shouldBeListening = true;
      if (this.onStatusChange) {
        this.onStatusChange('starting');
      }
      this.recognition.start();
      console.log('🎤 Starting speech recognition...');
      return true;
    } catch (error) {
      console.warn('⚠️ Failed to start speech recognition:', error);
      this.handleError('Failed to start speech recognition');
      return false;
    }
  }

  public stop() {
    this.shouldBeListening = false;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        console.log('🎤 Stopping speech recognition...');
      } catch (error) {
        console.warn('⚠️ Error stopping speech recognition:', error);
      }
    }
    if (this.onStatusChange) {
      this.onStatusChange('idle');
    }
  }

  public reset() {
    this.currentTranscript = '';
    this.interimTranscript = '';
    this.retryCount = 0;
    console.log('🔄 Speech recognition transcripts reset');
  }

  public setCallbacks(
    onTranscriptUpdate: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onStatusChange?: (status: 'idle' | 'starting' | 'active' | 'error') => void
  ) {
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.onError = onError;
    this.onStatusChange = onStatusChange || null;
  }

  public getCurrentTranscript() {
    return this.currentTranscript + this.interimTranscript;
  }

  public isActive() {
    return this.isListening;
  }

  public getState() {
    return this.recognition?.state || 'inactive';
  }
}

export default function SimplifiedPracticePage() {
  // Core session state
  const [isRecording, setIsRecording] = useState(false);
  const [sessionName, setSessionName] = useState("Session 1");
  const [showAnalysisPage, setShowAnalysisPage] = useState(false);
  const [sessionPurpose, setSessionPurpose] = useState("general-presentation");
  const [sessionNumber, setSessionNumber] = useState(1);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPurpose, setIsEditingPurpose] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [currentWPM, setCurrentWPM] = useState(0);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [showLiveTranscript, setShowLiveTranscript] = useState(true);
  const [showLiveMetrics, setShowLiveMetrics] = useState(true);
  const [savedSessionData, setSavedSessionData] = useState<any>(null);

  // Height sync between left recording area and right AI coach card
  const recordingSectionRef = useRef<HTMLDivElement | null>(null);
  const [coachHeight, setCoachHeight] = useState<number>(0);

  useEffect(() => {
    const updateCoachHeight = () => {
      const left = recordingSectionRef.current;
      if (!left) return;
      const height = left.offsetHeight;
      if (height && height !== coachHeight) {
        setCoachHeight(height);
      }
    };

    updateCoachHeight();
    const ro = new ResizeObserver(() => updateCoachHeight());
    if (recordingSectionRef.current) {
      ro.observe(recordingSectionRef.current);
    }
    window.addEventListener('resize', updateCoachHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateCoachHeight);
    };
  }, [coachHeight]);

  // Video recording state
  const [currentRecording, setCurrentRecording] = useState<VideoRecordingData | null>(null);
  const [showVideoPlayback, setShowVideoPlayback] = useState(false);
  const [showRecordingLibrary, setShowRecordingLibrary] = useState(false);
  const [videoRecordingEnabled, setVideoRecordingEnabled] = useState(true);
  const [isVideoInitialized, setIsVideoInitialized] = useState(false);

  // AUTHENTIC METRICS ONLY - All start at 0 until real analysis data is available
  const [metrics, setMetrics] = useState<SimplifiedMetrics>({
    eyeContact: 0,
    confidence: 0,
    engagement: 0,
    wordsPerMinute: 0,
    fillerWordCount: 0,
    clarity: 0,
    voice: {
      clarity: 0,
      pace: 0,
      volume: 0,
      intonation: 0,
      fillerCount: 0,
      pauseEffectiveness: 0,
      pitchVariation: 0,
      vocalFryDetection: false,
      uptalkPatterns: 0
    },
    bodyLanguage: {
      eyeContactScore: 0,
      facialExpressions: 0,
      overallPresence: 0
    }
  });

  // Live feedback
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback[]>([]);
  const [isAICoachActive, setIsAICoachActive] = useState(false);
  
  // Enhanced analytics state
  const [enhancedAnalytics, setEnhancedAnalytics] = useState<any>(null);
  
  // Vocal filler detection state
  const [vocalFillerBuffer, setVocalFillerBuffer] = useState<string[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);
  const volumeWindowRef = useRef<number[]>([]);
  const pitchWindowRef = useRef<number[]>([]);
  const [vocalFillerRecorder, setVocalFillerRecorder] = useState<MediaRecorder | null>(null);
  const [isListeningForFillers, setIsListeningForFillers] = useState(false);

  // Eye contact tracking state
  // Removed old eye contact state - now using real-time eye contact system
  const [eyeContactScore, setEyeContactScore] = useState(0);
  
  // Robust speech recognition state
  const [speechRecognitionStatus, setSpeechRecognitionStatus] = useState<'idle' | 'starting' | 'active' | 'error'>('idle');
  const robustSpeechRecognitionRef = useRef<RobustSpeechRecognition | null>(null);
  
  // Enhanced WPM tracking
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [lastWordCount, setLastWordCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const wpmUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [wpmUpdateCount, setWpmUpdateCount] = useState(0); // Debug counter
  const [transcriptUpdateCount, setTranscriptUpdateCount] = useState(0); // Debug counter

  // Roboflow computer vision integration
  const {
    isAnalyzing: isRoboflowAnalyzing,
    analysis: roboflowAnalysis,
    frameCount: roboflowFrameCount,
    processingTime: roboflowProcessingTime,
    error: roboflowError,
    videoRef: roboflowVideoRef,
    canvasRef: roboflowCanvasRef,
    startRealTimeAnalysis,
    stopRealTimeAnalysis,
    analyzeSingleFrame,
    cleanup: cleanupRoboflow
  } = useRoboflowVision();

  // Facial analysis integration
  const {
    isActive: isFacialAnalysisActive,
    currentAnalysis: facialAnalysis,
    startFacialAnalysis,
    stopFacialAnalysis,
    getAverageFacialMetrics,
    error: facialAnalysisError
  } = useFacialAnalysis();

  // Robust computer vision system with error handling
  const {
    metrics: computerVisionMetrics,
    error: computerVisionError,
    isInitialized: isComputerVisionInitialized,
    isAnalyzing: isComputerVisionAnalyzing,
    frameCount: computerVisionFrameCount,
    successCount: computerVisionSuccessCount,
    startAnalysis: startComputerVisionAnalysis,
    stopAnalysis: stopComputerVisionAnalysis,
    getAverageMetrics: getAverageComputerVisionMetrics
  } = useRobustComputerVision();

  // Add advanced filler detection hook
  const {
    fillerResults,
    performHybridDetection,
    startRealTimeDetection,
    getFillerStatistics
  } = useAdvancedFillerDetection();

  // Enhanced AI capabilities
  const {
    result: mediaPipeResult,
    isInitialized: isMediaPipeInitialized,
    isLoading: isMediaPipeLoading,
    error: mediaPipeError,
    startAnalysis: startMediaPipeAnalysis,
    stopAnalysis: stopMediaPipeAnalysis,
    cleanup: cleanupMediaPipe
  } = useEnhancedMediaPipe({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  const {
    emotionResult,
    isInitialized: isTensorFlowInitialized,
    isLoading: isTensorFlowLoading,
    error: tensorFlowError,
    startEmotionAnalysis,
    stopEmotionAnalysis,
    cleanup: cleanupTensorFlow
  } = useEnhancedTensorFlow({
    confidenceThreshold: 0.6
  });

  const {
    eyeTrackingResult,
    isInitialized: isWebGazerInitialized,
    isLoading: isWebGazerLoading,
    isCalibrated,
    error: webGazerError,
    startEyeTracking,
    stopEyeTracking,
    calibrate,
    setTargetRegion,
    cleanup: cleanupWebGazer
  } = useEnhancedWebGazer({
    targetRegion: {
      x: 0.3,
      y: 0.3,
      width: 0.4,
      height: 0.4
    },
    calibrationPoints: 9
  });



  // Update metrics with enhanced AI results
  useEffect(() => {
    if (isRecording) {
      // Update metrics with MediaPipe results (including fallback data)
      if (mediaPipeResult) {
        console.log('📊 Updating metrics with MediaPipe results:', mediaPipeResult);
        setMetrics(prev => ({
          ...prev,
          eyeContact: mediaPipeResult.eyeContact || prev.eyeContact,
          bodyLanguage: {
            ...prev.bodyLanguage,
            eyeContactScore: mediaPipeResult.eyeContact || prev.bodyLanguage.eyeContactScore,
            postureScore: mediaPipeResult.posture || prev.bodyLanguage.postureScore,
            gestureScore: mediaPipeResult.gesture || prev.bodyLanguage.gestureScore,
            overallPresence: Math.round((mediaPipeResult.posture + mediaPipeResult.gesture + mediaPipeResult.eyeContact) / 3) || prev.bodyLanguage.overallPresence
          },
          confidence: mediaPipeResult.confidence ? Math.round(mediaPipeResult.confidence * 100) : prev.confidence
        }));
      }

      // Update metrics with TensorFlow emotion results
      if (emotionResult.isWorking) {
        setMetrics(prev => ({
          ...prev,
          confidence: Math.round(emotionResult.confidence * 100) || prev.confidence,
          engagement: emotionResult.emotion === 'happy' || emotionResult.emotion === 'surprised' ? 90 : 
                     emotionResult.emotion === 'neutral' ? 70 : 50,
          bodyLanguage: {
            ...prev.bodyLanguage,
            facialExpressions: Math.round(emotionResult.confidence * 100) || prev.bodyLanguage.facialExpressions
          }
        }));
      }

      // Update metrics with WebGazer eye tracking results
      if (eyeTrackingResult.isWorking) {
        setMetrics(prev => ({
          ...prev,
          eyeContact: Math.round(eyeTrackingResult.confidence * 100) || prev.eyeContact,
          bodyLanguage: {
            ...prev.bodyLanguage,
            eyeContactScore: Math.round(eyeTrackingResult.confidence * 100) || prev.bodyLanguage.eyeContactScore
          }
        }));
      }
    }
  }, [isRecording, mediaPipeResult, emotionResult, eyeTrackingResult]);

  // Enhanced WPM calculation function
  const calculateAccurateWPM = useCallback((currentTranscript: string, currentTime: number) => {
    console.log('🔍 WPM calculation debug:', {
      sessionStartTime,
      transcriptLength: currentTranscript.trim().length,
      currentTime
    });

    if (!sessionStartTime || currentTranscript.trim().length === 0) {
      console.log('❌ WPM calculation skipped - no session start time or empty transcript');
      return 0;
    }

    // Clean the transcript for accurate word counting
    const cleanTranscript = currentTranscript
      .replace(/[.,!?;:'"()]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    const words = cleanTranscript.split(/\s+/).filter(word => word.length > 0);
    const currentWordCount = words.length;
    
    // Calculate time elapsed since session start
    const timeElapsed = (currentTime - sessionStartTime) / 1000; // Convert to seconds
    const timeInMinutes = timeElapsed / 60;
    
    console.log('🔍 WPM calculation details:', {
      currentWordCount,
      timeElapsed: timeElapsed.toFixed(1),
      timeInMinutes: timeInMinutes.toFixed(2),
      sessionStartTime,
      currentTime
    });
    
    // Only calculate WPM if we have meaningful data
    if (timeInMinutes < 0.1 || currentWordCount < 3) {
      console.log('❌ WPM calculation skipped - insufficient data');
      return 0;
    }
    
    const wpm = Math.round(currentWordCount / timeInMinutes);
    
    console.log(`📊 Accurate WPM calculation: ${currentWordCount} words in ${timeElapsed.toFixed(1)}s (${timeInMinutes.toFixed(2)} min) = ${wpm} WPM`);
    
    return wpm;
  }, [sessionStartTime]);

  // Calculate average WPM from history
  const getAverageWPM = useCallback(() => {
    if (wpmHistory.length === 0) return 0;
    const sum = wpmHistory.reduce((acc, wpm) => acc + wpm, 0);
    return Math.round(sum / wpmHistory.length);
  }, [wpmHistory]);

  // Enhanced filler word detection function with accurate counting
  const detectFillerWords = (text: string) => {
    if (!text || text.trim().length === 0) {
      return { count: 0, words: [] };
    }

    // Define filler words with proper categorization to avoid duplicates
    const singleWordFillers = [
      'um', 'uh', 'ah', 'er', 'erm', 'hmm', 'hm',
      'like', 'basically', 'actually', 'literally',
      'right', 'okay', 'so', 'well', 'now', 'then', 'just', 'really', 'very',
      'totally', 'completely', 'absolutely', 'definitely',
      'obviously', 'clearly', 'honestly', 'frankly',
      'i', 'guess', 'think', 'feel', 'believe', 'suppose', 'reckon', 'assume',
      'essentially', 'fundamentally', 'figuratively',
      'sort', 'kind', 'type', 'way',
      'alright', 'all', 'quite', 'rather',
      'truthfully', 'seriously', 'genuinely',
      'simply', 'merely', 'only',
      'even', 'still', 'yet', 'however',
      'though', 'although', 'nevertheless',
      'anyway', 'anyhow', 'regardless'
    ];

    const multiWordFillers = [
      'you know', 'i mean', 'kind of', 'sort of', 'i guess', 'you see',
      'you know what', 'you know what i mean', 'i dont know', 'what i mean',
      'the thing is', 'blah blah blah'
    ];

    const lowerText = text.toLowerCase();
    const detectedFillers: string[] = [];
    const processedPositions = new Set<number>(); // Track processed positions to avoid duplicates

    // Process multi-word fillers first (to avoid partial matches)
    multiWordFillers.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      let match;
      while ((match = regex.exec(lowerText)) !== null) {
        // Check if this position hasn't been processed yet
        const startPos = match.index;
        const endPos = startPos + match[0].length;
        let isDuplicate = false;
        
        for (let i = startPos; i < endPos; i++) {
          if (processedPositions.has(i)) {
            isDuplicate = true;
            break;
          }
        }
        
        if (!isDuplicate) {
          detectedFillers.push(match[0]);
          // Mark these positions as processed
          for (let i = startPos; i < endPos; i++) {
            processedPositions.add(i);
          }
        }
      }
    });

    // Process single-word fillers
    singleWordFillers.forEach(word => {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      let match;
      while ((match = regex.exec(lowerText)) !== null) {
        // Check if this position hasn't been processed yet
        const startPos = match.index;
        const endPos = startPos + match[0].length;
        let isDuplicate = false;
        
        for (let i = startPos; i < endPos; i++) {
          if (processedPositions.has(i)) {
            isDuplicate = true;
            break;
          }
        }
        
        if (!isDuplicate) {
          detectedFillers.push(match[0]);
          // Mark these positions as processed
          for (let i = startPos; i < endPos; i++) {
            processedPositions.add(i);
          }
        }
      }
    });

    // Handle repeated fillers (ummm, uhhh, etc.)
    const repeatedPattern = /\b(um+|uh+|ah+|er+)\b/gi;
    let repeatedMatch;
    while ((repeatedMatch = repeatedPattern.exec(lowerText)) !== null) {
      const startPos = repeatedMatch.index;
      const endPos = startPos + repeatedMatch[0].length;
      let isDuplicate = false;
      
      for (let i = startPos; i < endPos; i++) {
        if (processedPositions.has(i)) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        detectedFillers.push(repeatedMatch[0]);
        // Mark these positions as processed
        for (let i = startPos; i < endPos; i++) {
          processedPositions.add(i);
        }
      }
    }

    const totalFillers = detectedFillers.length;
    
    if (totalFillers > 0) {
      console.log(`🔍 Filler words detected: ${totalFillers} total - ${detectedFillers.join(', ')}`);
    }

    return { count: totalFillers, words: detectedFillers };
  };

  // Real-time eye contact detection using MediaPipe Face Mesh (Primary system)
  // The old measureEyeContact function has been replaced with the new real-time system

  // Fetch authentic eye contact and expression data from maximum authentic analysis
  useEffect(() => {
    if (!isRecording) return;

    const fetchAuthenticMetrics = async () => {
      try {
        const response = await fetch('/api/maximum-authentic-analysis');
        const data = await response.json();
        
        if (data.success && data.results && data.results.vision) {
          // Extract authentic facial analysis data from Enhanced-Local analysis engine
          const visionData = data.results.vision;
          
          // Extract eye contact from nested structure
          const eyeContactValue = visionData.eyeContact?.eyeContactPercentage || 
                                 visionData.eyeContact?.audienceEngagement || 0;
          
          // Extract confidence and engagement from facial expression analysis
          const confidenceValue = visionData.facialExpression?.confidence || 0;
          const engagementValue = visionData.facialExpression?.engagement || 0;
          
          if (eyeContactValue > 0 || confidenceValue > 0 || engagementValue > 0) {
            setMetrics(prev => ({
              ...prev,
              eyeContact: eyeContactValue,
              confidence: confidenceValue,
              engagement: engagementValue,
              bodyLanguage: {
                ...prev.bodyLanguage,
                eyeContactScore: eyeContactValue,
                facialExpressions: engagementValue,
                overallPresence: confidenceValue
              }
            }));
            
            console.log('✅ Updated metrics with Enhanced-Local authentic data:', {
              eyeContact: eyeContactValue,
              engagement: engagementValue,
              confidence: confidenceValue,
              source: 'Enhanced-Local analysis engine'
            });
          }
        }
      } catch (error) {
        console.log('📊 Maximum authentic analysis unavailable');
      }
    };

    // Fetch immediately and then every 3 seconds during recording
    fetchAuthenticMetrics();
    const interval = setInterval(fetchAuthenticMetrics, 3000);
    
    return () => clearInterval(interval);
  }, [isRecording]);

  // Robustly determine next session number on load
  useEffect(() => {
    const determineNextSessionNumber = async () => {
      // 1) Try server-provided next number
      try {
        const res = await fetch('/api/sessions/next-number');
        if (res.ok) {
          const data = await res.json();
          const n = Number(data?.sessionNumber);
          if (Number.isFinite(n) && n > 0) {
            setSessionNumber(n);
            setSessionName(`Session ${n}`);
            return;
          }
        }
      } catch {}

      // 2) Fallback: count existing practice sessions
      try {
        const res2 = await fetch('/api/practice-sessions');
        if (res2.ok) {
          const sessions = await res2.json();
          const count = Array.isArray(sessions) ? sessions.length : 0;
          const n = Math.max(1, count + 1);
          setSessionNumber(n);
          setSessionName(`Session ${n}`);
          return;
        }
      } catch {}

      // 3) Final default
      setSessionNumber(1);
      setSessionName('Session 1');
    };

    determineNextSessionNumber();
  }, []);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const metricsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<string>('');
  const interimTranscriptRef = useRef<string>('');
  const audioAnalyzerRef = useRef<AnalyserNode | null>(null);
  const wpmCalculatorRef = useRef<AccurateWPMCalculator | null>(null);
  const fillerDetectorRef = useRef<IncrementalFillerDetector | null>(null);
  const { toast } = useToast();

  // Setup speech recognition - now using only the robust system
  const setupSpeechRecognition = useCallback(() => {
    try {
      console.log('🔧 Setting up robust speech recognition...');
      
      // Ensure robust speech recognition is initialized
      if (!robustSpeechRecognitionRef.current) {
        console.log('🔧 Creating robust speech recognition instance...');
        robustSpeechRecognitionRef.current = new RobustSpeechRecognition();
        
        // Set up callbacks
        robustSpeechRecognitionRef.current.setCallbacks(
          (transcript: string, isFinal: boolean) => {
            console.log('📝 Transcript update:', { transcript: transcript.substring(0, 100) + '...', isFinal });
            
            // Update state
            setTranscript(transcript);
            transcriptRef.current = transcript;
            
            // Increment transcript update counter
            setTranscriptUpdateCount(prev => prev + 1);
            
            // WPM calculation
            if (transcript.trim().length > 0) {
              const words = transcript.trim().split(/\s+/).filter(word => word.length > 0);
              let wpm = 0;
              if (sessionDuration > 0 && words.length >= 3) {
                const timeInMinutes = sessionDuration / 60;
                wpm = Math.round(words.length / timeInMinutes);
              } else if (words.length >= 3) {
                wpm = words.length;
              }
              
              if (wpm > 0) {
                setWpmUpdateCount(prev => prev + 1);
                setMetrics(prev => ({
                  ...prev,
                  wordsPerMinute: wpm,
                  voice: {
                    ...prev.voice,
                    pace: wpm
                  }
                }));
                setWpmHistory(prev => [...prev.slice(-9), wpm]);
              }
            }
            
            // Detect filler words
            if (transcript.trim().length > 0) {
              const fillerResult = detectFillerWords(transcript);
              setMetrics(prev => ({
                ...prev,
                fillerWordCount: fillerResult.count,
                voice: {
                  ...prev.voice,
                  fillerCount: fillerResult.count
                }
              }));
              
              if (fillerResult.count > 0) {
                console.log(`🎯 Filler words detected: ${fillerResult.count} - ${fillerResult.words.join(', ')}`);
              }
            }
          },
          (error: string) => {
            console.warn('⚠️ Speech recognition error:', error);
            setSpeechRecognitionStatus('error');
            // Only show toast for critical errors
            if (error.includes('not-allowed') || error.includes('audio-capture') || error.includes('service-not-allowed')) {
              toast({
                title: "Speech Recognition Error",
                description: `Error: ${error}. Please check microphone permissions.`,
                variant: "destructive"
              });
            }
          },
          (status: 'idle' | 'starting' | 'active' | 'error') => {
            console.log('🎤 Speech recognition status changed:', status);
            setSpeechRecognitionStatus(status);
          }
        );
      }
      
      console.log('✅ Robust speech recognition setup complete');
      return true;
    } catch (error) {
      console.warn('⚠️ Failed to setup speech recognition:', error);
      return false;
    }
  }, [sessionDuration, toast]);

  // Initialize robust speech recognition on component mount
  useEffect(() => {
    try {
      setupSpeechRecognition();
    } catch (error) {
      console.warn('⚠️ Failed to setup speech recognition on mount:', error);
    }
  }, [setupSpeechRecognition]);

  // Video recording refs
  const recordingVideoRef = useRef<HTMLVideoElement>(null);
  const deepgramServiceRef = useRef<DeepgramSpeechService | null>(null);
  const [isSpeechFallbackActive, setIsSpeechFallbackActive] = useState<boolean>(false);
  // MediaPipe body language analysis
  const {
    startAnalysis: startBodyAnalysis,
    stopAnalysis: stopBodyAnalysis,
    currentMetrics: bodyMetrics,
    isActive: isBodyAnalysisActive
  } = useMediaPipeBodyLanguage();

  // Real-time eye contact detection (Primary system)
  const {
    eyeContactPercentage,
    gazeDirection,
    gazeStability,
    blinkRate,
    confidence: eyeContactConfidence,
    isLookingAtCamera,
    calibrationStatus,
    startDetection: startEyeContactDetection,
    stopDetection: stopEyeContactDetection,
    startCalibration: startEyeContactCalibration,
    completeCalibration: completeEyeContactCalibration,
    isActive: isEyeContactActive,
    isInitialized: isEyeContactInitialized,
    error: eyeContactError
  } = useRealTimeEyeContact();

  // Comprehensive filler word highlighting with 60+ patterns + custom fillers
  const highlightFillerWords = (text: string) => {
    const fillerWords = [
      // Classic vocal fillers
      'um', 'uh', 'uhm', 'umm', 'er', 'err', 'ah', 'eh', 'mm', 'hmm', 'hm',
      
      // Custom vocal fillers - USER REQUESTED
      'blah', 'bleh', 'meh', 'huh', 'erm', 'urm',
      
      // Discourse markers
      'like', 'so', 'well', 'okay', 'ok', 'right', 'yeah', 'yes', 'yep', 'sure',
      
      // Intensifiers used as fillers
      'actually', 'basically', 'literally', 'obviously', 'essentially', 'definitely',
      'absolutely', 'totally', 'really', 'very', 'quite', 'pretty', 'super',
      
      // Hedging words
      'just', 'maybe', 'perhaps', 'probably', 'possibly', 'kinda', 'sorta',
      
      // Transition & emphasis fillers
      'anyway', 'anyhow', 'exactly', 'precisely', 'indeed', 'certainly', 'surely',
      'clearly', 'honestly', 'frankly', 'seriously', 'truly', 'genuinely',
      
      // Time & casual fillers
      'now', 'then', 'next', 'first', 'second', 'finally', 'lastly',
      'dude', 'man', 'guys', 'folks', 'people', 'thing', 'stuff', 'things',
      
      // Multi-word patterns
      'you know', 'i mean', 'kind of', 'sort of', 'i guess', 'you see',
      'you know what', 'i dont know', 'what i mean', 'the thing is', 'blah blah blah'
    ];

    let highlightedText = text;
    
    // Highlight multi-word fillers first
    const multiWordFillers = ['you know', 'i mean', 'kind of', 'sort of', 'i guess', 'you see'];
    multiWordFillers.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span style="background-color: #fecaca; padding: 2px 4px; border-radius: 3px; color: #dc2626; font-weight: 500;">$&</span>`);
    });
    
    // Then highlight single word fillers  
    const singleFillers = fillerWords.filter(word => !multiWordFillers.includes(word));
    singleFillers.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span style="background-color: #fecaca; padding: 2px 4px; border-radius: 3px; color: #dc2626; font-weight: 500;">$&</span>`);
    });
    
    return highlightedText;
  };

  // Save session name function
  const saveSessionName = () => {
    setIsEditingName(false);
    toast({
      title: "Session Name Updated",
      description: `Session renamed to "${sessionName}"`,
    });
  };

  // Save session purpose function
  const saveSessionPurpose = () => {
    setIsEditingPurpose(false);
    toast({
      title: "Session Purpose Updated",
      description: "AI will use this to provide targeted feedback",
    });
  };

  // Initialize session name
  useEffect(() => {
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
  }, [sessionName]);

  // Deepgram fallback starter
  const startDeepgramFallback = useCallback(async () => {
    try {
      if (deepgramServiceRef.current) return; // already active
      deepgramServiceRef.current = new DeepgramSpeechService((analytics) => {
        // Append transcript incrementally
        const chunkText = analytics.transcript?.trim();
        if (chunkText) {
          setTranscript(prev => {
            const combined = (prev + ' ' + chunkText).trim();
            transcriptRef.current = combined;
            return combined;
          });
        }

        // Update live metrics - use absolute count, not accumulation
        setMetrics(prev => ({
          ...prev,
          wordsPerMinute: analytics.speakingRate || prev.wordsPerMinute,
          fillerWordCount: analytics.fillerWords?.length || 0, // Use absolute count
          voice: {
            ...prev.voice,
            pace: analytics.speakingRate || prev.voice.pace,
            fillerCount: analytics.fillerWords?.length || 0 // Use absolute count
          }
        }));
      });
      await deepgramServiceRef.current.startRecording();
      setIsSpeechFallbackActive(true);
      console.log('✅ Deepgram/Whisper fallback activated');
    } catch (e) {
      console.error('❌ Failed to start Deepgram/Whisper fallback:', e);
    }
  }, []);

  // Enhanced comprehensive live insights system with improved effectiveness
  const lastFeedbackTimeRef = useRef<number>(0);
  const lastFeedbackMessageRef = useRef<string>('');

  // Helper function to add feedback and manage AI coach state
  const addFeedback = useCallback((message: string, type: 'success' | 'warning' | 'info') => {
    setLiveFeedback(prev => [...prev.slice(-4), {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now()
    }]);
    lastFeedbackTimeRef.current = Date.now();
    lastFeedbackMessageRef.current = message;
    
    // Reset AI coach active state after a short delay
    setTimeout(() => setIsAICoachActive(false), 2000);
  }, []);

  useEffect(() => {
    if (!isRecording) return;

    const generateLiveInsights = () => {
      const currentWPM = metrics.wordsPerMinute;
      const fillerCount = metrics.fillerWordCount;
      const confidence = metrics.confidence;
      const eyeContact = metrics.eyeContact;
      const engagement = metrics.engagement;
      const sessionMinutes = sessionDuration / 60;
      const timeSinceLastFeedback = (Date.now() - lastFeedbackTimeRef.current) / 1000;

      // Only generate feedback if enough time has passed (15 seconds minimum)
      if (timeSinceLastFeedback < 15) return;

      // Set AI coach as active when generating feedback
      setIsAICoachActive(true);

      console.log('🤖 Generating live AI feedback:', {
        sessionDuration,
        currentWPM,
        fillerCount,
        eyeContact,
        timeSinceLastFeedback
      });

      // Starting feedback to get users engaged
      if (sessionDuration >= 3 && sessionDuration < 10 && !lastFeedbackMessageRef.current.includes('Welcome')) {
        addFeedback('🎯 Recording started! Begin speaking naturally for live AI analysis', 'info');
        return;
      }

      // Voice and Speech Analytics (improved thresholds)
      if (currentWPM > 0 && sessionDuration >= 10) {
        if (currentWPM >= 130 && currentWPM <= 170 && !lastFeedbackMessageRef.current.includes('Perfect pace')) {
          addFeedback(`🎯 Perfect pace at ${currentWPM} WPM! This is ideal for presentations`, 'success');
          return;
        } else if (currentWPM > 200 && !lastFeedbackMessageRef.current.includes('too fast')) {
          addFeedback(`⚡ Speaking quite fast at ${currentWPM} WPM - try taking deeper breaths and pausing between sentences`, 'warning');
          return;
        } else if (currentWPM < 110 && currentWPM > 30 && sessionMinutes > 0.5 && !lastFeedbackMessageRef.current.includes('increase energy')) {
          addFeedback(`💪 Try increasing energy and enthusiasm - current pace: ${currentWPM} WPM`, 'info');
          return;
        }
      }

      // Transcript length feedback  
      const transcriptLength = transcript.trim().length;
      if (sessionDuration >= 15 && transcriptLength < 50 && !lastFeedbackMessageRef.current.includes('Keep talking')) {
        addFeedback('🗣️ Keep talking! I\'m analyzing your speech patterns and will provide insights', 'info');
        return;
      }

      // Filler Word Analysis (improved sensitivity)
      if (sessionMinutes > 0.8) {
        const fillersPerMinute = fillerCount / sessionMinutes;
        if (fillersPerMinute > 4 && !lastFeedbackMessageRef.current.includes('filler')) {
          addFeedback(`⚠️ ${Math.round(fillersPerMinute)} fillers/min detected - try pausing instead of using "um", "uh", "like"`, 'warning');
          return;
        } else if (fillersPerMinute <= 1 && fillerCount > 2 && !lastFeedbackMessageRef.current.includes('clean speech')) {
          addFeedback('✨ Excellent! Very clean speech with minimal fillers - you sound professional', 'success');
          return;
        }
      }

      // Computer Vision Feedback (only when real data available)
      if (eyeContact > 75 && !lastFeedbackMessageRef.current.includes('eye contact')) {
        addFeedback('👁️ Excellent eye contact! You\'re engaging your audience well', 'success');
        return;
      } else if (eyeContact > 0 && eyeContact < 45 && !lastFeedbackMessageRef.current.includes('Look at')) {
        addFeedback('👀 Try looking at the camera more - aim for 60%+ eye contact for better engagement', 'info');
        return;
      }

      // Confidence feedback (when available)
      if (confidence > 85 && !lastFeedbackMessageRef.current.includes('confident')) {
        addFeedback('💪 Great confidence! Your posture and presence look strong', 'success');
        return;
      }

      // Engagement encouragement
      if (sessionDuration >= 30 && sessionDuration < 35 && !lastFeedbackMessageRef.current.includes('doing great')) {
        addFeedback('🌟 You\'re doing great! Keep practicing for better results', 'info');
        return;
      }

      // Professional tips (every 30 seconds)
      if (sessionDuration >= 45 && sessionDuration % 30 < 2 && timeSinceLastFeedback > 25) {
        const practicalTips = [
          '💡 Use hand gestures to emphasize key points and appear more confident',
          '🎵 Vary your vocal pitch to maintain audience interest and avoid monotone', 
          '⏸️ Use strategic pauses for impact - silence can be powerful',
          '🫁 Project your voice from your diaphragm for better resonance',
          '🧘 Keep shoulders relaxed and spine straight for better posture',
          '🎯 Focus on one main point per sentence for clarity',
          '👥 Imagine speaking to one person to feel more connected',
          '📝 Use the rule of three - groups of three are memorable'
        ];
        
        const tipIndex = Math.floor((sessionDuration - 45) / 30) % practicalTips.length;
        const randomTip = practicalTips[tipIndex];
        
        if (!lastFeedbackMessageRef.current.includes(randomTip.substring(0, 10))) {
          addFeedback(randomTip, 'info');
          return;
        }
      }

      // Session progress milestones
      if (sessionDuration >= 60 && sessionDuration < 65 && !lastFeedbackMessageRef.current.includes('minute')) {
        addFeedback('⏰ Great! You\'ve been practicing for a full minute. Your speaking skills are improving!', 'success');
        return;
      }

      // Volume and energy feedback (when available)
      if (metrics.voice && metrics.voice.volume > 80 && !lastFeedbackMessageRef.current.includes('volume')) {
        addFeedback('🔊 Great volume! You\'re projecting your voice well and sounding confident', 'success');
        return;
      }

      // Engagement and enthusiasm feedback
      if (engagement > 80 && !lastFeedbackMessageRef.current.includes('enthusiasm')) {
        addFeedback('🔥 Excellent enthusiasm! Your energy is contagious and engaging', 'success');
        return;
      }

      // General encouragement if no specific feedback was given
      if (sessionDuration >= 20 && timeSinceLastFeedback > 20) {
        const encouragements = [
          '🎯 Keep going! You\'re building great speaking skills',
          '💪 Your practice is paying off - stay focused',
          '🌟 Every word you speak is improving your confidence',
          '🚀 You\'re developing into a strong communicator',
          '🎭 Remember to breathe naturally and stay relaxed',
          '📈 Your progress is visible - keep up the great work!',
          '🎪 You\'re becoming a more confident speaker with each session',
          '💎 Your communication skills are shining through'
        ];
        
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        addFeedback(encouragement, 'info');
      }
    };

    // Start feedback after 1.5s, then update every 15s
    const initialTimeout = setTimeout(generateLiveInsights, 1500);
    const interval = setInterval(generateLiveInsights, 15000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isRecording, metrics, sessionDuration, transcript, addFeedback]);

  // Initialize video recording system on component mount
  useEffect(() => {
    const initVideo = async () => {
      if (videoRecordingEnabled) {
        await initializeVideoRecording();
      }
    };
    initVideo();
  }, []);

  // Initialize video recording
  const initializeVideoRecording = async (): Promise<boolean> => {
    if (!videoRecordingEnabled || !recordingVideoRef.current) return false;
    
    try {
      const initialized = await videoRecordingManager.initializeRecording(recordingVideoRef.current);
      if (initialized) {
        console.log('✅ Video recording system initialized');
        setIsVideoInitialized(true);
        toast({
          title: "Video Recording Ready",
          description: "High-quality video recording is active",
          duration: 2000
        });
      }
      return initialized;
    } catch (error) {
      console.error('❌ Failed to initialize video recording:', error);
      setIsVideoInitialized(false);
      toast({
        title: "Video Recording Unavailable",
        description: "Session will record audio only",
        variant: "destructive"
      });
      return false;
    }
  };

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      console.log('🎬 Starting practice session...');
      console.log('🔍 Debug: startRecording function called');
      console.log('🔍 Debug: isRecording state:', isRecording);
      console.log('🔍 Debug: robustSpeechRecognitionRef.current:', robustSpeechRecognitionRef.current);
      
      // Set recording state immediately to show button change
      setIsRecording(true);
      console.log('✅ Recording state set immediately');
      
      // Reset AI coach feedback tracking for new session
      lastFeedbackTimeRef.current = 0;
      lastFeedbackMessageRef.current = '';
      setLiveFeedback([]);
      console.log('🔄 AI coach feedback reset for new session');
      
      // Initialize video recording first and wait for it to be ready
      let videoInitialized = false;
      try {
        videoInitialized = await initializeVideoRecording();
        console.log('📹 Video initialization result:', videoInitialized);
      } catch (videoError) {
        console.warn('⚠️ Video initialization failed, continuing with audio only:', videoError);
        videoInitialized = false;
      }

      // Initialize session start time for accurate WPM calculation
      setSessionStartTime(Date.now());
      setWpmHistory([]);
      setLastWordCount(0);
      console.log('⏱️ Session start time initialized for accurate WPM tracking');
      
      // Start robust speech recognition
      if (robustSpeechRecognitionRef.current) {
        console.log('🎤 Starting robust speech recognition...');
        setSpeechRecognitionStatus('starting');
        
        // Reset transcripts and metrics
        robustSpeechRecognitionRef.current.reset();
        setTranscript('');
        setInterimTranscript('');
        transcriptRef.current = '';
        interimTranscriptRef.current = '';
        
        // Reset filler word count for new session
        setMetrics(prev => ({
          ...prev,
          fillerWordCount: 0,
          voice: {
            ...prev.voice,
            fillerCount: 0
          }
        }));
        
        // Start recognition
        try {
          const success = robustSpeechRecognitionRef.current.start();
          if (success) {
            setSpeechRecognitionStatus('active');
            console.log('✅ Robust speech recognition started successfully');
          } else {
            setSpeechRecognitionStatus('error');
            console.warn('⚠️ Failed to start robust speech recognition - will retry automatically');
          }
        } catch (error) {
          console.warn('⚠️ Speech recognition start error:', error);
          setSpeechRecognitionStatus('error');
        }
      } else {
        console.warn('⚠️ Robust speech recognition not initialized - will initialize automatically');
        setSpeechRecognitionStatus('error');
      }

      // Start session timer with enhanced WPM tracking
      const sessionStartTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
        setSessionDuration(elapsedSeconds);
        
        // Real-time WPM update every second
        if (transcript.trim().length > 0) {
          const currentTime = Date.now();
          const accurateWPM = calculateAccurateWPM(transcript, currentTime);
          
          if (accurateWPM > 0) {
            setMetrics(prev => ({ 
              ...prev, 
              wordsPerMinute: accurateWPM,
              voice: {
                ...prev.voice,
                pace: accurateWPM
              }
            }));
          }
        }
        
        // Debug: Log live metrics status
        console.log('🔄 Live metrics update:', {
          elapsedSeconds,
          transcriptLength: transcript.length,
          wordCount: transcript.split(' ').filter(w => w.length > 0).length,
          currentWPM: metrics.wordsPerMinute,
          isRecording
        });
      }, 1000);

      // Get media stream for the entire session (don't duplicate getUserMedia calls)
      let stream = streamRef.current;
      if (!stream) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
              sampleRate: 44100,
              channelCount: 1
            },
            // Start with lightweight video constraints for fastest device start, upgrade after playback
            video: {
              width: { ideal: 640, min: 480 },
              height: { ideal: 360, min: 270 },
              frameRate: { ideal: 24, min: 20 },
              facingMode: 'user'
            }
          });
          streamRef.current = stream;
          console.log('✅ Media stream obtained successfully');
        } catch (mediaError) {
          console.warn('⚠️ Video stream failed, trying audio only:', mediaError);
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                sampleRate: 44100,
                channelCount: 1
              }
            });
            streamRef.current = stream;
            console.log('✅ Audio-only stream obtained successfully');
          } catch (audioError) {
            console.warn('⚠️ Failed to get any media stream:', audioError);
            toast({
              title: "Media Access Failed",
              description: "Please allow microphone access to start recording.",
              variant: "destructive"
            });
            setIsRecording(false);
            return;
          }
        }
      }
      
      // Start video recording if initialized - ensure MediaRecorder is ready
      if (videoInitialized && recordingVideoRef.current) {
        // Wait a bit longer to ensure MediaRecorder is fully ready
        setTimeout(async () => {
          try {
            // Double-check initialization if needed
            let recordingReady = true;
            if (!videoRecordingManager.isReady()) {
              console.log('🔄 Re-initializing video recording...');
              recordingReady = await videoRecordingManager.initializeRecording(recordingVideoRef.current!);
            }
            
            if (recordingReady) {
              const recordingStarted = videoRecordingManager.startRecording();
              if (recordingStarted) {
                console.log('🎬 Video recording started successfully');
              } else {
                console.warn('⚠️ Video recording failed to start - will record audio only');
              }
            } else {
              console.warn('⚠️ Video recording not ready - will record audio only');
            }
          } catch (error) {
            console.warn('⚠️ Video recording error:', error);
          }
        }, 500);
      }

      // Set up video display
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        (videoRef.current as any).playsInline = true;
        await videoRef.current.play().catch(() => undefined);

        // Upgrade to HD once playback is flowing (keeps startup snappy, restores quality)
        const vTrack = stream.getVideoTracks()[0];
        if (vTrack && vTrack.applyConstraints) {
          setTimeout(() => {
            vTrack.applyConstraints({
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 }
            }).catch(() => undefined);
          }, 1200);
        }

        // Prepare Roboflow video binding and canvas immediately
        if (roboflowVideoRef.current) {
          roboflowVideoRef.current.srcObject = stream;
          if (canvasRef.current && roboflowCanvasRef && (roboflowCanvasRef as any).current !== undefined) {
            (roboflowCanvasRef as any).current = canvasRef.current;
          }
        }

        // Kick off all heavy pipelines in parallel once frames flow
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        const startupTasks = [
          startRealTimeAnalysis(1500),
          videoRef.current ? startFacialAnalysis(videoRef.current) : Promise.resolve(),
          videoRef.current ? startComputerVisionAnalysis(videoRef.current).catch(() => false) : Promise.resolve(false),
          videoRef.current ? startBodyAnalysis(videoRef.current) : Promise.resolve(false),
          // Enhanced AI capabilities - always try to start MediaPipe
          videoRef.current ? startMediaPipeAnalysis(videoRef.current).catch((error) => {
            console.warn('⚠️ MediaPipe analysis failed, using fallback:', error);
            return false;
          }) : Promise.resolve(false),
          videoRef.current && isTensorFlowInitialized ? startEmotionAnalysis(videoRef.current).catch(() => false) : Promise.resolve(false),
          videoRef.current && isWebGazerInitialized ? startEyeTracking(videoRef.current).catch(() => false) : Promise.resolve(false)
        ];
        Promise.allSettled(startupTasks).then(() => {
          console.log('✅ Vision pipelines and enhanced AI systems initialized');
        });
      }

      // Setup Web Audio API for direct vocal filler detection
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyserNode = audioCtx.createAnalyser();
        
        analyserNode.fftSize = 2048;
        analyserNode.smoothingTimeConstant = 0.3;
        source.connect(analyserNode);
        
        setAudioContext(audioCtx);
        setAnalyzer(analyserNode);
        audioAnalyzerRef.current = analyserNode;
        
        console.log('🎵 Web Audio API initialized for vocal filler detection');
        
        // Start audio analysis for volume/intonation (and legacy filler hints)
        let analyzeInterval: NodeJS.Timeout;
        const startAnalysis = () => {
          analyzeInterval = setInterval(() => {
            if (audioAnalyzerRef.current) {
              const analyser = audioAnalyzerRef.current;
              const timeSize = analyser.fftSize;
              // Time-domain data for RMS volume and autocorrelation pitch
              const timeData = new Uint8Array(timeSize);
              analyser.getByteTimeDomainData(timeData);
              let sumSquares = 0;
              for (let i = 0; i < timeSize; i++) {
                const v = (timeData[i] - 128) / 128;
                sumSquares += v * v;
              }
              const rms = Math.sqrt(sumSquares / timeSize);
              volumeWindowRef.current.push(rms);
              if (volumeWindowRef.current.length > 18) volumeWindowRef.current.shift();
              const avgRms = volumeWindowRef.current.reduce((a, b) => a + b, 0) / volumeWindowRef.current.length;
              const volumePercent = Math.min(100, Math.max(0, Math.round(avgRms * 140)));

              // Autocorrelation pitch estimation
              const buf = new Float32Array(timeSize);
              for (let i = 0; i < timeSize; i++) buf[i] = (timeData[i] - 128) / 128;
              let bestOffset = -1;
              let bestCorr = 0;
              const maxLag = Math.min(1024, timeSize - 1);
              for (let lag = 32; lag < maxLag; lag++) {
                let corr = 0;
                for (let i = 0; i < timeSize - lag; i++) corr += buf[i] * buf[i + lag];
                if (corr > bestCorr) { bestCorr = corr; bestOffset = lag; }
              }
              let pitchHz = 0;
              const sr = audioContext?.sampleRate || 44100;
              if (bestOffset > 0 && bestCorr > 0.01) pitchHz = Math.round(sr / bestOffset);
              if (pitchHz > 50 && pitchHz < 500) {
                pitchWindowRef.current.push(pitchHz);
                if (pitchWindowRef.current.length > 18) pitchWindowRef.current.shift();
              }
              const mean = pitchWindowRef.current.reduce((a, b) => a + b, 0) / Math.max(1, pitchWindowRef.current.length);
              const variance = pitchWindowRef.current.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / Math.max(1, pitchWindowRef.current.length);
              const std = Math.sqrt(variance);
              const intonationPercent = Math.min(100, Math.max(0, Math.round((std / 60) * 100)));

              // Calculate voice clarity based on volume consistency and pitch stability
              const volumeConsistency = 100 - Math.abs(volumePercent - 50) * 0.5; // Penalize extreme volumes
              const pitchStability = 100 - Math.min(100, std * 2); // Penalize pitch variation
              const clarityScore = Math.round((volumeConsistency + pitchStability) / 2);
              
              // Calculate confidence indicators
              const steadyVolume = volumePercent > 20 && volumePercent < 80 ? 100 : 50;
              const goodPitchRange = pitchHz > 100 && pitchHz < 300 ? 100 : 70;
              const confidenceScore = Math.round((steadyVolume + goodPitchRange + clarityScore) / 3);
              
              setMetrics(prev => ({
                ...prev,
                voice: {
                  ...prev.voice,
                  volume: volumePercent,
                  intonation: intonationPercent,
                  pitchVariation: Math.min(100, Math.max(0, Math.round((std / 40) * 100))),
                  clarity: clarityScore,
                  pace: prev.voice.pace || 0, // Keep existing pace
                  fillerCount: prev.voice.fillerCount || 0, // Keep existing filler count
                  pauseEffectiveness: prev.voice.pauseEffectiveness || 0, // Keep existing pause effectiveness
                  vocalFryDetection: std < 10, // Detect vocal fry (low pitch variation)
                  uptalkPatterns: pitchHz > 250 ? 100 : 0 // Detect uptalk (high pitch)
                },
                clarity: clarityScore, // Update top-level clarity
                confidence: confidenceScore // Update top-level confidence
              }));
            }
          }, 100); // Check every 100ms for vocal patterns
        };
        
        startAnalysis();
        
        // Store interval for cleanup
        return () => {
          if (analyzeInterval) {
            clearInterval(analyzeInterval);
          }
        };
      } catch (audioError) {
        console.warn('⚠️ Web Audio API unavailable:', audioError);
      }

      // Setup dedicated vocal filler recorder for direct audio capture
      try {
        const vocalRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        
        let audioChunks: BlobPart[] = [];
        
        vocalRecorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
            
            // Process the audio blob for vocal filler detection
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            audioChunks = []; // Reset for next chunk
            
            try {
              // Send audio to backend for vocal filler analysis
              // Convert audio blob to base64 for enhanced filler detection
              const arrayBuffer = await audioBlob.arrayBuffer();
              const bytes = new Uint8Array(arrayBuffer);
              let binary = '';
              for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64Audio = btoa(binary);
              
              const response = await fetch('/api/detect-enhanced-fillers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  audioBuffer: base64Audio
                })
              });
              
              if (response.ok) {
                const result = await response.json();
                const detection = result.detection;
                if (detection && detection.totalFillers > 0) {
                  console.log('🎯 AUDIO UM/UH DETECTION:', detection);
                  
                  // Reset filler buffer to prevent accumulation of fake data
                  setVocalFillerBuffer([]); // Reset to prevent 422+ accumulation
                  
                  // Track actual filler count without accumulating arrays
                  setMetrics(prev => ({
                    ...prev,
                    fillerWordCount: detection.totalFillers || 0, // Use real count, not accumulated
                    voice: { ...prev.voice, fillerCount: detection.totalFillers || 0 }
                  }));
                }
              }
            } catch (error) {
              console.warn('⚠️ Vocal filler analysis failed:', error);
            }
          }
        };
        
        setVocalFillerRecorder(vocalRecorder);
        setIsListeningForFillers(true);
        
        // Start recording in 2-second chunks for vocal filler detection
        vocalRecorder.start();
        const vocalRecorderInterval = setInterval(() => {
          if (vocalRecorder.state === 'recording') {
            vocalRecorder.stop();
            setTimeout(() => {
              if (isRecording) {
                vocalRecorder.start();
              }
            }, 100);
          }
        }, 2000);
        
        // Store interval for cleanup
        return () => {
          clearInterval(vocalRecorderInterval);
        };
        
        console.log('🎵 Dedicated vocal filler recorder initialized');
      } catch (recorderError) {
        console.warn('⚠️ Vocal filler recorder unavailable:', recorderError);
      }

      // Start robust speech recognition
      try {
        console.log('🎤 Starting robust speech recognition...');
        
        if (robustSpeechRecognitionRef.current) {
          const success = robustSpeechRecognitionRef.current.start();
          if (success) {
            console.log('✅ Robust speech recognition started successfully');
          } else {
            console.warn('⚠️ Failed to start robust speech recognition, using fallback');
            await startDeepgramFallback();
          }
        } else {
          console.warn('⚠️ No robust speech recognition available, starting fallback');
          await startDeepgramFallback();
        }
      } catch (e: any) {
        console.warn('⚠️ Speech recognition start failed, using fallback:', e.message || e);
        await startDeepgramFallback();
      }

      // Recording state already set at the beginning
      console.log('✅ All systems initialized - recording active');

      // Initialize accurate WPM calculator
      if (!wpmCalculatorRef.current) {
        wpmCalculatorRef.current = new AccurateWPMCalculator();
        console.log('📊 WPM calculator initialized');
      }
      wpmCalculatorRef.current.startSession();
      console.log('📊 WPM calculator session started');

      // Initialize incremental filler detector
      if (!fillerDetectorRef.current) {
        fillerDetectorRef.current = new IncrementalFillerDetector();
        console.log('🎯 Filler detector initialized');
      }
      fillerDetectorRef.current.reset();
      console.log('🎯 Filler detector reset');

      // Start real-time eye contact detection
      if (videoRef.current && isEyeContactInitialized) {
        try {
          await startEyeContactDetection(videoRef.current);
          console.log('👁️ Real-time eye contact detection started');
        } catch (error) {
          console.warn('⚠️ Failed to start eye contact detection:', error);
          // Fallback: use simple face detection
          console.log('🔄 Using fallback eye contact detection');
        }
      } else {
        console.log('⚠️ Eye contact detection not available - video or initialization issue');
      }

      // Initialize metrics and refs with starting values when recording begins
      setMetrics({
        eyeContact: 0,
        confidence: 0,
        engagement: 0,
        wordsPerMinute: 0,
        fillerWordCount: 0,
        clarity: 0,
        voice: {
          clarity: 0,
          pace: 0,
          volume: 0,
          intonation: 0,
          fillerCount: 0,
          pauseEffectiveness: 0,
          pitchVariation: 0,
          vocalFryDetection: false,
          uptalkPatterns: 0
        },
        bodyLanguage: {
          eyeContactScore: 0,
          facialExpressions: 0,
          overallPresence: 0
        }
      });
      
      // Reset transcript refs
      transcriptRef.current = '';
      interimTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');

      // Update metrics with real MediaPipe/facial data when available
      metricsTimerRef.current = setInterval(async () => {
        // Calculate WPM using accurate calculator
        if (wpmCalculatorRef.current && sessionDuration > 0) {
          try {
            const wpmData = wpmCalculatorRef.current.calculateWPM();
            const currentWPM = wpmData.currentWPM;
            const wordCount = wpmData.totalWords;
            
            setMetrics(prev => ({
              ...prev,
              wordsPerMinute: currentWPM,
              voice: {
                ...prev.voice,
                pace: currentWPM
              }
            }));
            
            // Update state for display
            setCurrentWPM(currentWPM);
            setWordCount(wordCount);
            
            console.log('✅ WPM updated:', { wpm: currentWPM, wordCount, confidence: wpmData.confidence });
          } catch (error) {
            console.log('⚠️ WPM calculation failed:', error);
          }
        }
        
        setMetrics(prev => ({
          ...prev,
          // Use real-time eye contact as primary system, with fallback
          eyeContact: eyeContactPercentage > 0 ? eyeContactPercentage : prev.eyeContact,
          confidence: Math.max(
            facialAnalysis?.facialMetrics?.emotionalExpression?.confidence || 0,
            computerVisionMetrics?.confidence || 0,
            prev.confidence || 0
          ),
          engagement: Math.max(
            facialAnalysis?.facialMetrics?.emotionalExpression?.engagement || 0,
            computerVisionMetrics?.engagement || 0,
            prev.engagement || 0
          ),
          clarity: Math.max(
            facialAnalysis?.facialMetrics?.emotionalExpression?.authenticity || 0,
            prev.clarity || 0
          ),
          bodyLanguage: {
            ...prev.bodyLanguage,
            // Use real-time eye contact as primary system, with fallback
            eyeContactScore: eyeContactPercentage > 0 ? eyeContactPercentage : prev.bodyLanguage.eyeContactScore,
            facialExpressions: bodyMetrics?.gestures?.naturalness || prev.bodyLanguage.facialExpressions || 0,
            overallPresence: bodyMetrics?.overall?.presence || prev.bodyLanguage.overallPresence || 0
          }
        }));
      }, 1000);

      // All computer vision systems already started above in the stream initialization
      console.log('✅ All computer vision systems initialized during stream setup');

      console.log('📹 Recording started with robust computer vision integration:', {
        computerVision: isComputerVisionInitialized,
        roboflow: isRoboflowAnalyzing,
        facialAnalysis: isFacialAnalysisActive,
        videoRecording: videoRecordingEnabled
      });

      // Start advanced voice analysis
      try {
        console.log('🎤 Starting advanced voice analysis...');
        const voiceAnalysisInterval = await startRealTimeVoiceAnalysis();
        if (voiceAnalysisInterval) {
          // Store interval for cleanup
          return () => {
            clearInterval(voiceAnalysisInterval);
          };
        }
      } catch (error) {
        console.warn('⚠️ Advanced voice analysis failed to start:', error);
      }
    } catch (error: any) {
      console.warn('⚠️ Failed to start recording:', error);
      
      // Provide more specific error messages
      let errorMessage = "Please allow camera and microphone access";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Camera and microphone permissions were denied. Please check your browser settings and allow access.";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No camera or microphone found on this device.";
      } else if (error.name === 'NotSupportedError') {
        errorMessage = "This browser does not support video/audio recording.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Camera or microphone is already in use by another application.";
      } else if (error.name === 'SecurityError') {
        errorMessage = "Recording requires HTTPS (except on localhost).";
      } else if (error.message) {
        errorMessage = `Recording failed: ${error.message}`;
      }
      
      // Reset recording state on failure
      setIsRecording(false);
      toast({
        title: "Recording Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [setupSpeechRecognition, toast, transcript, interimTranscript]);

  // Advanced Voice Analysis Functions
  const performAdvancedVoiceAnalysis = useCallback(async (audioBlob: Blob, transcript: string) => {
    try {
      console.log('🎤 Starting advanced voice analysis...');
      
      // Convert audio blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64Audio = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
      
      // Call free voice analysis API
      const voiceAnalysisResponse = await fetch('/api/free-voice-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBuffer: base64Audio,
          transcript: transcript,
          duration: sessionDuration
        })
      });
      
      if (voiceAnalysisResponse.ok) {
        const voiceAnalysis = await voiceAnalysisResponse.json();
        console.log('🎤 Free voice analysis result:', voiceAnalysis);
        
        // Update metrics with advanced voice analysis
        setMetrics(prev => ({
          ...prev,
          voice: {
            ...prev.voice,
            clarity: Math.min(100, Math.max(0, voiceAnalysis.clarity?.score || prev.voice.clarity || 0)),
            sentiment: Math.min(100, Math.max(0, voiceAnalysis.sentiment?.score || 0)),
            professionalism: Math.min(100, Math.max(0, voiceAnalysis.professionalism?.score || 0))
          }
        }));
      }
      
      // Call advanced speech analysis API
      const speechAnalysisResponse = await fetch('/api/advanced-speech-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript,
          duration: sessionDuration,
          audioBuffer: base64Audio
        })
      });
      
      if (speechAnalysisResponse.ok) {
        const speechAnalysis = await speechAnalysisResponse.json();
        console.log('🎤 Advanced speech analysis result:', speechAnalysis);
        
        // Update metrics with speech analysis
        setMetrics(prev => ({
          ...prev,
          confidence: Math.min(100, Math.max(0, speechAnalysis.confidence || prev.confidence || 0)),
          clarity: Math.min(100, Math.max(0, speechAnalysis.clarity || prev.clarity || 0)),
          voice: {
            ...prev.voice,
            pace: Math.min(200, Math.max(0, speechAnalysis.pace || prev.voice.pace || 0)),
            volume: Math.min(100, Math.max(0, speechAnalysis.volume || prev.voice.volume || 0)),
            intonation: Math.min(100, Math.max(0, speechAnalysis.intonation || prev.voice.intonation || 0))
          }
        }));
      }
      
      // Call comprehensive voice analysis API
      const comprehensiveResponse = await fetch('/api/speech-emotion/comprehensive-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript,
          audioBuffer: base64Audio,
          duration: sessionDuration
        })
      });
      
      if (comprehensiveResponse.ok) {
        const comprehensiveAnalysis = await comprehensiveResponse.json();
        console.log('🎤 Comprehensive voice analysis result:', comprehensiveAnalysis);
        
        // Update metrics with comprehensive analysis
        setMetrics(prev => ({
          ...prev,
          engagement: Math.min(100, Math.max(0, comprehensiveAnalysis.engagement || prev.engagement || 0)),
          voice: {
            ...prev.voice,
            emotionalRange: Math.min(100, Math.max(0, comprehensiveAnalysis.emotionalRange || 0)),
            expressiveness: Math.min(100, Math.max(0, comprehensiveAnalysis.expressiveness || 0)),
            voiceWarmth: Math.min(100, Math.max(0, comprehensiveAnalysis.voiceWarmth || 0))
          }
        }));
      }
      
    } catch (error) {
      console.error('❌ Advanced voice analysis failed:', error);
    }
  }, [sessionDuration]);

  // Real-time voice analysis during recording
  const startRealTimeVoiceAnalysis = useCallback(async () => {
    if (!vocalFillerRecorder) return;
    
    // Start periodic voice analysis every 10 seconds
    const voiceAnalysisInterval = setInterval(async () => {
      if (isRecording && vocalFillerRecorder && vocalFillerRecorder.state === 'recording' && transcript.length > 10) {
        try {
          // Only perform analysis if we have meaningful transcript data
          console.log('🎤 Performing real-time voice analysis with transcript length:', transcript.length);
          await performAdvancedVoiceAnalysis(new Blob([], { type: 'audio/webm' }), transcript);
        } catch (error) {
          console.warn('⚠️ Real-time voice analysis failed:', error);
        }
      }
    }, 10000); // Every 10 seconds
    
    return voiceAnalysisInterval;
  }, [isRecording, transcript, performAdvancedVoiceAnalysis, vocalFillerRecorder]);

  // Stop recording
  const stopRecording = useCallback(async () => {
    // Stop video recording and save to storage
    let recordingData: VideoRecordingData | null = null;
    try {
      recordingData = await videoRecordingManager.stopRecording();
      if (recordingData) {
        console.log('🎬 Video recording stopped and processed');
      }
    } catch (error) {
      console.warn('⚠️ Error stopping video recording:', error);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Stop robust speech recognition
    if (robustSpeechRecognitionRef.current) {
      robustSpeechRecognitionRef.current.stop();
      setSpeechRecognitionStatus('idle');
      console.log('🎤 Robust speech recognition stopped');
    }
    
    // Clean up WPM tracking
    setSessionStartTime(null);
    setWpmHistory([]);
    setLastWordCount(0);
    console.log('📊 WPM tracking cleaned up');

    // Stop Deepgram/Whisper fallback if active
    if (deepgramServiceRef.current) {
      try {
        await deepgramServiceRef.current.stopRecording();
      } catch {}
      deepgramServiceRef.current = null;
      setIsSpeechFallbackActive(false);
    }

    // Clean up Web Audio API
    if (audioContext) {
      try {
        await audioContext.close();
        setAudioContext(null);
        setAnalyzer(null);
        audioAnalyzerRef.current = null;
        console.log('🎵 Web Audio API cleaned up');
      } catch (error) {
        console.warn('⚠️ Error cleaning up audio context:', error);
      }
    }

    // Clean up timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (metricsTimerRef.current) {
      clearInterval(metricsTimerRef.current);
      metricsTimerRef.current = null;
    }

    // Stop vocal filler recorder
    if (vocalFillerRecorder && vocalFillerRecorder.state === 'recording') {
      vocalFillerRecorder.stop();
      setVocalFillerRecorder(null);
    }
    setIsListeningForFillers(false);

    // Perform final advanced voice analysis
    try {
      if (transcript.length > 10) {
        console.log('🎤 Performing final voice analysis with transcript length:', transcript.length);
        const finalAudioBlob = new Blob([], { type: 'audio/webm' });
        await performAdvancedVoiceAnalysis(finalAudioBlob, transcript);
        console.log('✅ Final voice analysis completed');
      } else {
        console.log('⚠️ Skipping final voice analysis - insufficient transcript data');
      }
    } catch (error) {
      console.warn('⚠️ Final voice analysis failed:', error);
    }
    
    // Clear any remaining intervals
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // End WPM calculator session
    if (wpmCalculatorRef.current) {
      wpmCalculatorRef.current.endSession();
      console.log('📊 WPM calculator session ended');
    }

    // Stop Roboflow computer vision analysis
    try {
      stopRealTimeAnalysis();
      console.log('🤖 Roboflow computer vision analysis stopped');
    } catch (error) {
      console.warn('⚠️ Error stopping Roboflow analysis');
    }

    // Stop facial analysis
    try {
      stopFacialAnalysis();
      console.log('🎭 Facial analysis stopped');
    } catch (error) {
      console.warn('⚠️ Error stopping facial analysis');
    }

      // Stop computer vision analysis
  try {
    stopComputerVisionAnalysis();
    console.log('🛡️ Computer vision analysis stopped');
  } catch (error) {
    console.warn('⚠️ Error stopping computer vision analysis');
  }

  // Stop body analysis
  try {
    stopBodyAnalysis();
    console.log('🏃 Body analysis stopped');
  } catch (error) {
    console.warn('⚠️ Error stopping body analysis');
  }

  // Stop enhanced AI systems
  try {
    if (isMediaPipeInitialized) {
      stopMediaPipeAnalysis();
      console.log('🎯 MediaPipe body language analysis stopped');
    }
  } catch (error) {
    console.warn('⚠️ Error stopping MediaPipe analysis');
  }

  try {
    if (isTensorFlowInitialized) {
      stopEmotionAnalysis();
      console.log('🧠 TensorFlow emotion analysis stopped');
    }
  } catch (error) {
    console.warn('⚠️ Error stopping TensorFlow analysis');
  }

  try {
    if (isWebGazerInitialized) {
      stopEyeTracking();
      console.log('👁️ WebGazer eye tracking stopped');
    }
  } catch (error) {
    console.warn('⚠️ Error stopping WebGazer analysis');
  }

  // Stop eye contact detection
  try {
    stopEyeContactDetection();
    console.log('👁️ Eye contact detection stopped');
  } catch (error) {
    console.warn('⚠️ Error stopping eye contact detection');
  }

    setIsRecording(false);
    setIsVideoInitialized(false);

    // Reset metrics to 0 after recording stops
    setTimeout(() => {
      setMetrics({
        eyeContact: 0,
        confidence: 0,
        engagement: 0,
        wordsPerMinute: 0,
        fillerWordCount: 0,
        clarity: 0,
        voice: {
          clarity: 0,
          pace: 0,
          volume: 0,
          intonation: 0,
          fillerCount: 0,
          pauseEffectiveness: 0,
          pitchVariation: 0,
          vocalFryDetection: false,
          uptalkPatterns: 0
        },
        bodyLanguage: {
          eyeContactScore: 0,
          facialExpressions: 0,
          overallPresence: 0
        }
      });
    }, 1000); // Small delay to allow final session save

    // AI-powered transcript analysis functions
    const calculatePurposeAlignment = (transcript: string, purpose: string): number => {
      if (!transcript || !purpose) return 0;
      
      const words = transcript.toLowerCase().split(/\s+/);
      const purposeWords = purpose.toLowerCase().split(/\s+/);
      
      // Calculate keyword overlap
      let matches = 0;
      purposeWords.forEach(word => {
        if (words.includes(word) && word.length > 3) matches++;
      });
      
      return Math.min(100, (matches / Math.max(purposeWords.length, 1)) * 100);
    };

    const getPurposeStrengths = (transcript: string, purpose: string): string[] => {
      if (!transcript || !purpose) return [];
      
      const strengths: string[] = [];
      if (transcript.length > 50) strengths.push("Good content length");
      if (transcript.includes('.')) strengths.push("Proper sentence structure");
      if (transcript.includes('?')) strengths.push("Engaging questions");
      if (transcript.includes('example') || transcript.includes('instance')) strengths.push("Uses examples");
      
      return strengths.slice(0, 3);
    };

    const getPurposeImprovements = (transcript: string, purpose: string): string[] => {
      if (!transcript || !purpose) return [];
      
      const improvements: string[] = [];
      if (transcript.length < 100) improvements.push("Add more content");
      if (!transcript.includes('.')) improvements.push("Improve sentence structure");
      if (!transcript.includes('example')) improvements.push("Include examples");
      
      return improvements.slice(0, 3);
    };

    const getPurposeInsights = (transcript: string, purpose: string): string => {
      if (!transcript || !purpose) return "No transcript available for analysis";
      return `Analysis for ${purpose}: Content shows ${transcript.length > 100 ? 'good' : 'basic'} development with room for improvement.`;
    };

    const analyzeContentStructure = (transcript: string): number => {
      if (!transcript) return 0;
      const hasOpening = /^(hello|hi|good morning|good afternoon|welcome|today)/i.test(transcript);
      const hasClosing = /(thank you|questions|conclusion|end|finally)/i.test(transcript);
      const hasTransitions = /(first|second|next|finally|however|therefore)/i.test(transcript);
      
      return (hasOpening ? 30 : 0) + (hasClosing ? 30 : 0) + (hasTransitions ? 40 : 0);
    };

    const analyzeIntroduction = (transcript: string): number => {
      if (!transcript) return 0;
      const hasGreeting = /^(hello|hi|good morning|good afternoon|welcome)/i.test(transcript);
      const hasPurpose = /(today|purpose|talk about|discuss)/i.test(transcript);
      return (hasGreeting ? 50 : 0) + (hasPurpose ? 50 : 0);
    };

    const analyzeBody = (transcript: string): number => {
      if (!transcript) return 0;
      const hasContent = transcript.length > 50;
      const hasStructure = /(first|second|next|finally|however|therefore)/i.test(transcript);
      return (hasContent ? 60 : 0) + (hasStructure ? 40 : 0);
    };

    const analyzeConclusion = (transcript: string): number => {
      if (!transcript) return 0;
      const hasClosing = /(thank you|questions|conclusion|end|finally|summary)/i.test(transcript);
      return hasClosing ? 100 : 0;
    };

    const analyzeTransitions = (transcript: string): number => {
      if (!transcript) return 0;
      const transitions = (transcript.match(/(first|second|next|finally|however|therefore|in addition|moreover)/gi) || []).length;
      return Math.min(100, transitions * 20);
    };

    const analyzePersuasiveness = (transcript: string, purpose: string): number => {
      if (!transcript) return 0;
      const strongWords = (transcript.match(/(must|should|will|can|because|evidence|proven|results)/gi) || []).length;
      const hasExamples = /(for example|such as|instance|case)/i.test(transcript);
      return Math.min(100, strongWords * 10 + (hasExamples ? 30 : 0));
    };

    const analyzeArguments = (transcript: string): number => {
      if (!transcript) return 0;
      const hasBecause = /because/i.test(transcript);
      const hasEvidence = /(evidence|proven|study|research)/i.test(transcript);
      return (hasBecause ? 50 : 0) + (hasEvidence ? 50 : 0);
    };

    const analyzeEvidence = (transcript: string): number => {
      if (!transcript) return 0;
      const evidenceWords = (transcript.match(/(evidence|proven|study|research|data|statistics)/gi) || []).length;
      return Math.min(100, evidenceWords * 25);
    };

    const analyzeEmotionalAppeals = (transcript: string): number => {
      if (!transcript) return 0;
      const emotionalWords = (transcript.match(/(feel|emotion|heart|passion|excited|important)/gi) || []).length;
      return Math.min(100, emotionalWords * 15);
    };

    const analyzeCallToAction = (transcript: string): number => {
      if (!transcript) return 0;
      const actionWords = (transcript.match(/(call|action|contact|visit|join|sign)/gi) || []).length;
      return Math.min(100, actionWords * 20);
    };

    const analyzeAudienceEngagement = (transcript: string): number => {
      if (!transcript) return 0;
      const hasQuestions = /\?/.test(transcript);
      const hasYou = /you/i.test(transcript);
      const hasStories = /(story|example|instance)/i.test(transcript);
      return (hasQuestions ? 40 : 0) + (hasYou ? 30 : 0) + (hasStories ? 30 : 0);
    };

    const analyzeQuestions = (transcript: string): number => {
      if (!transcript) return 0;
      const questions = (transcript.match(/\?/g) || []).length;
      return Math.min(100, questions * 25);
    };

    const analyzeStories = (transcript: string): number => {
      if (!transcript) return 0;
      const hasStories = /(story|example|instance|case)/i.test(transcript);
      return hasStories ? 100 : 0;
    };

    const analyzeExamples = (transcript: string): number => {
      if (!transcript) return 0;
      const hasExamples = /(for example|such as|instance|case)/i.test(transcript);
      return hasExamples ? 100 : 0;
    };

    const analyzeHumor = (transcript: string): number => {
      if (!transcript) return 0;
      const humorWords = (transcript.match(/(funny|joke|humor|laugh|smile)/gi) || []).length;
      return Math.min(100, humorWords * 30);
    };

    const analyzeLanguageQuality = (transcript: string): number => {
      if (!transcript) return 0;
      const words = transcript.split(/\s+/).filter(w => w.length > 0);
      const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
      const vocabularyRichness = (uniqueWords / Math.max(words.length, 1)) * 100;
      return Math.min(100, vocabularyRichness * 1.5);
    };

    const analyzeVocabulary = (transcript: string): number => {
      if (!transcript) return 0;
      const words = transcript.split(/\s+/).filter(w => w.length > 0);
      const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
      return Math.min(100, (uniqueWords / Math.max(words.length, 1)) * 200);
    };

    const analyzeSentenceVariety = (transcript: string): number => {
      if (!transcript) return 0;
      const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const avgLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / Math.max(sentences.length, 1);
      return Math.min(100, 100 - Math.abs(avgLength - 15) * 3);
    };

    const analyzeClarity = (transcript: string): number => {
      if (!transcript) return 0;
      const fillerWords = (transcript.match(/(um|uh|like|you know|basically|actually)/gi) || []).length;
      const totalWords = transcript.split(/\s+/).filter(w => w.length > 0).length;
      const fillerRatio = fillerWords / Math.max(totalWords, 1);
      return Math.max(0, 100 - fillerRatio * 200);
    };

    const analyzeProfessionalism = (transcript: string, purpose: string): number => {
      if (!transcript) return 0;
      const professionalWords = (transcript.match(/(professional|business|industry|market|strategy|analysis)/gi) || []).length;
      const informalWords = (transcript.match(/(guy|dude|awesome|cool|stuff)/gi) || []).length;
      return Math.max(0, Math.min(100, professionalWords * 10 - informalWords * 15));
    };

    const generateKeyInsights = (transcript: string, purpose: string): string[] => {
      if (!transcript || !purpose) return [];
      return [
        `Content aligns ${calculatePurposeAlignment(transcript, purpose)}% with ${purpose} purpose`,
        `Structure score: ${analyzeContentStructure(transcript)}%`,
        `Engagement level: ${analyzeAudienceEngagement(transcript)}%`
      ];
    };

    const generateRecommendations = (transcript: string, purpose: string): string[] => {
      if (!transcript || !purpose) return [];
      const recommendations: string[] = [];
      
      if (analyzeContentStructure(transcript) < 70) recommendations.push("Improve speech structure with clear introduction, body, and conclusion");
      if (analyzeAudienceEngagement(transcript) < 60) recommendations.push("Add more audience engagement techniques like questions and examples");
      if (analyzeClarity(transcript) < 80) recommendations.push("Reduce filler words for better clarity");
      
      return recommendations.slice(0, 3);
    };

    const generateAIAssessment = async (transcript: string, purpose: string): Promise<string> => {
      if (!transcript || !purpose) return "No transcript available for AI assessment";
      
      try {
        const response = await fetch('/api/generate-session-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionData: {
              transcript,
              purpose,
              sessionPurpose: purpose,
              sessionName: sessionName,
              duration: sessionDuration
            }
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          return result.overallAssessment || "AI assessment completed successfully";
        }
        
        return "AI assessment: Content shows good potential with room for improvement";
      } catch (error) {
        console.warn('AI assessment failed:', error);
        return "AI assessment: Content analysis completed with basic insights";
      }
    };

    // Enhanced session data preparation - consolidated save logic
    if (isSavingSession) {
      console.log('⚠️ Session save already in progress, skipping...');
      return;
    }
    
    setIsSavingSession(true);
    
    try {
      // Prepare session data in the format expected by the backend
      const sessionData = {
        transcript: transcript || '',
        duration: sessionDuration,
        purpose: sessionPurpose,
        sessionName: sessionName,
        sessionNumber: sessionNumber,
        averageWPM: metrics.wordsPerMinute || 0,  // Backend expects this at top level
        confidenceScore: metrics.confidence || 0,  // Backend expects this at top level
        voiceClarity: metrics.clarity || 0,  // Backend expects this at top level
        fillerWords: metrics.fillerWordCount || 0,  // Backend expects this at top level
        eyeContactScore: String(metrics.eyeContact || 0),  // Backend expects string
        postureScore: metrics.bodyLanguage?.postureScore || 0,  // MediaPipe posture data
        gestureScore: metrics.bodyLanguage?.gestureScore || 0,  // MediaPipe gesture data
        pauseCount: 0,  // Add default pauseCount
        persuasivenessScore: 0,  // Add default persuasivenessScore
        metrics: {
          wordsPerMinute: metrics.wordsPerMinute || 0,
          fillerWordCount: metrics.fillerWordCount || 0,
          eyeContact: metrics.eyeContact || 0,
          confidence: metrics.confidence || 0,
          engagement: metrics.engagement || 0,
          clarity: metrics.clarity || 0,
          // MediaPipe metrics
          postureScore: metrics.bodyLanguage?.postureScore || 0,
          gestureScore: metrics.bodyLanguage?.gestureScore || 0,
          eyeContactScore: metrics.bodyLanguage?.eyeContactScore || 0,
          overallPresence: metrics.bodyLanguage?.overallPresence || 0
        },
        wpmAnalysis: {
          averageWPM: metrics.wordsPerMinute || 0,
          totalWords: transcript ? transcript.split(/\s+/).filter(w => w.length > 0).length : 0,
          speakingTime: sessionDuration,
          wordsPerSecond: sessionDuration > 0 ? (transcript ? transcript.split(/\s+/).filter(w => w.length > 0).length : 0) / sessionDuration : 0
        },
        fillerWordAnalysis: {
          totalCount: metrics.fillerWordCount || 0,
          words: [],  // Simplified to avoid errors
          breakdown: {
            um: 0,
            uh: 0,
            like: 0,
            youKnow: 0,
            basically: 0,
            actually: 0,
            other: 0
          }
        },
        basicTranscriptAnalysis: {
          fullTranscript: transcript || 'No transcript available',
          wordCount: transcript ? transcript.split(/\s+/).filter(w => w.length > 0).length : 0,
          characterCount: transcript ? transcript.length : 0,
          sentenceCount: transcript ? transcript.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0,
          averageWordsPerSentence: transcript && transcript.split(/[.!?]+/).filter(s => s.trim().length > 0).length > 0 
            ? Math.round((transcript ? transcript.split(/\s+/).filter(w => w.length > 0).length : 0) / transcript.split(/[.!?]+/).filter(s => s.trim().length > 0).length) 
            : 0,
          highlightedTranscript: transcript || 'No transcript available'  // Simplified to avoid errors
        },
        liveMetricsHistory: {
          wpmHistory: wpmHistory,
          fillerWordHistory: [metrics.fillerWordCount || 0],
          eyeContactHistory: [metrics.eyeContact || 0],
          confidenceHistory: [metrics.confidence || 0]
        },
        // Enhanced body language analysis from MediaPipe
        bodyLanguageAnalysis: {
          posture: {
            confidence: bodyMetrics?.posture?.confidence || 0,
            spineAlignment: bodyMetrics?.posture?.spineAlignment || 0,
            shoulderPosition: bodyMetrics?.posture?.shoulderPosition || 0,
            stability: bodyMetrics?.posture?.stability || 0
          },
          gestures: {
            handMovements: bodyMetrics?.gestures?.handMovements || 0,
            naturalness: bodyMetrics?.gestures?.naturalness || 0,
            effectiveness: bodyMetrics?.gestures?.effectiveness || 0,
            timing: bodyMetrics?.gestures?.timing || 0
          },
          eyeContact: {
            engagement: bodyMetrics?.eyeContact?.engagement || 0,
            consistency: bodyMetrics?.eyeContact?.consistency || 0,
            quality: bodyMetrics?.eyeContact?.quality || 0
          },
          overall: {
            presence: bodyMetrics?.overall?.presence || 0,
            confidence: bodyMetrics?.overall?.confidence || 0,
            professionalism: bodyMetrics?.overall?.professionalism || 0
          },
          raw: {
            poseLandmarks: bodyMetrics?.raw?.poseLandmarks || [],
            handLandmarks: bodyMetrics?.raw?.handLandmarks || [],
            faceKeyPoints: bodyMetrics?.raw?.faceKeyPoints || []
          }
        },
        // Enhanced voice analysis metrics
        voiceAnalysis: {
          clarity: {
            score: metrics.voice?.clarity || 0,
            volumeConsistency: metrics.voice?.volume || 0,
            pitchStability: 100 - (metrics.voice?.pitchVariation || 0),
            articulation: metrics.voice?.clarity || 0,
            pronunciation: metrics.voice?.clarity || 0
          },
          volume: {
            averageLevel: metrics.voice?.volume || 0,
            consistency: 100 - Math.abs((metrics.voice?.volume || 0) - 50) * 0.5,
            projection: metrics.voice?.volume || 0,
            control: metrics.voice?.volume || 0
          },
          intonation: {
            score: metrics.voice?.intonation || 0,
            pitchVariation: metrics.voice?.pitchVariation || 0,
            melodicContour: metrics.voice?.intonation || 0,
            expressiveness: metrics.voice?.intonation || 0
          },
          pace: {
            wordsPerMinute: metrics.wordsPerMinute || 0,
            speakingRate: metrics.wordsPerMinute || 0,
            rhythm: metrics.voice?.intonation || 0,
            flow: metrics.voice?.intonation || 0
          },
          quality: {
            vocalFry: metrics.voice?.vocalFryDetection ? 100 : 0,
            uptalk: metrics.voice?.uptalkPatterns || 0,
            breathControl: 100 - (metrics.voice?.pitchVariation || 0),
            resonance: metrics.voice?.clarity || 0
          },
          confidence: {
            score: metrics.confidence || 0,
            steadyPace: metrics.wordsPerMinute > 100 && metrics.wordsPerMinute < 200 ? 100 : 50,
            volumeControl: metrics.voice?.volume || 0,
            pitchStability: 100 - (metrics.voice?.pitchVariation || 0)
          }
        },
        // AI-powered purpose-specific transcript analysis
        transcriptAnalysis: {
          purpose: sessionPurpose,
          purposeAlignment: {
            score: calculatePurposeAlignment(transcript, sessionPurpose),
            strengths: getPurposeStrengths(transcript, sessionPurpose),
            improvements: getPurposeImprovements(transcript, sessionPurpose),
            insights: getPurposeInsights(transcript, sessionPurpose)
          },
          contentStructure: {
            score: analyzeContentStructure(transcript),
            introduction: analyzeIntroduction(transcript),
            body: analyzeBody(transcript),
            conclusion: analyzeConclusion(transcript),
            transitions: analyzeTransitions(transcript)
          },
          persuasiveness: {
            score: analyzePersuasiveness(transcript, sessionPurpose),
            arguments: analyzeArguments(transcript),
            evidence: analyzeEvidence(transcript),
            emotionalAppeals: analyzeEmotionalAppeals(transcript),
            callToAction: analyzeCallToAction(transcript)
          },
          audienceEngagement: {
            score: analyzeAudienceEngagement(transcript),
            questions: analyzeQuestions(transcript),
            stories: analyzeStories(transcript),
            examples: analyzeExamples(transcript),
            humor: analyzeHumor(transcript)
          },
          languageQuality: {
            score: analyzeLanguageQuality(transcript),
            vocabulary: analyzeVocabulary(transcript),
            sentenceVariety: analyzeSentenceVariety(transcript),
            clarity: analyzeClarity(transcript),
            professionalism: analyzeProfessionalism(transcript, sessionPurpose)
          },
          keyInsights: generateKeyInsights(transcript, sessionPurpose),
          recommendations: generateRecommendations(transcript, sessionPurpose),
          aiAssessment: await generateAIAssessment(transcript, sessionPurpose)
        },
        coachingTips: liveFeedback.slice(-5).map(feedback => feedback.message)
      };

      console.log('📊 Session data prepared for backend:', {
        duration: sessionData.duration,
        transcriptLength: sessionData.transcript.length,
        wpm: sessionData.metrics.wordsPerMinute,
        fillers: sessionData.metrics.fillerWordCount,
        eyeContact: sessionData.metrics.eyeContact,
        coachingTips: sessionData.coachingTips.length
      });

      const response = await fetch('/api/sessions/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        console.error('❌ Session save failed with status:', response.status);
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Safely parse JSON response
      let result;
      try {
        const responseText = await response.text();
        console.log('📝 Raw response:', responseText);
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        // Assume success if we got a 200 but can't parse
        result = { success: true, session: { sessionNumber } };
      }
      
      if (result.success) {
        console.log(`✅ Session ${result.session?.sessionNumber || sessionNumber} saved successfully`);
        console.log('📊 Saved session data:', result.session);
        
        // Store the saved session data to pass to analysis page
        setSavedSessionData(result.session);
        
        // Update session number for next session
        const nextSessionNumber = (result.session?.sessionNumber || sessionNumber) + 1;
        setSessionNumber(nextSessionNumber);
        setSessionName(`Session ${nextSessionNumber}`);
        
        // Show analysis page with the saved session data
        setShowAnalysisPage(true);
        
        toast({
          title: "Session Saved Successfully! 🎉",
          description: `Your session with ${metrics.wordsPerMinute || 0} WPM, ${metrics.fillerWordCount || 0} filler words, and ${transcript ? transcript.split(/\s+/).filter(w => w.length > 0).length : 0} words has been saved. Viewing analysis now!`,
          variant: "default",
          duration: 5000
        });
        
        console.log('🔄 Transitioning to analysis page with saved session data');
      } else {
        console.error('❌ Failed to save session:', result.error);
        toast({
          title: "Save Failed",
          description: result.error || "Unable to save session",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Error saving session:', error);
      toast({
        title: "Session Save Error",
        description: "Session could not be saved. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSavingSession(false);
    }
  }, [sessionName, sessionPurpose, sessionDuration, transcript, metrics, toast, liveFeedback, wpmHistory, sessionNumber, setSavedSessionData, setSessionNumber, setSessionName, setShowAnalysisPage]);

  // Show video playback if requested
  if (showVideoPlayback && currentRecording) {
    return (
      <VideoPlaybackViewer
        recordingData={currentRecording}
        onClose={() => {
          setShowVideoPlayback(false);
          setCurrentRecording(null);
        }}
      />
    );
  }

  // Show recording library if requested  
  if (showRecordingLibrary) {
    return (
      <RecordingLibrary />
    );
  }

  // Show analysis page if session is complete
  if (showAnalysisPage) {
    return (
      <AuthenticAnalysisPage
        session={savedSessionData}
        onClose={() => setShowAnalysisPage(false)}
        onNewSession={() => {
          setShowAnalysisPage(false);
          // Reset all session data
          setSessionName(`Session ${sessionNumber + 1}`);
          setSessionPurpose("general-presentation");
          setSessionNumber(sessionNumber + 1);
          setTranscript("");
          setInterimTranscript("");
          setSessionDuration(0);
          setMetrics({
            eyeContact: 0,
            confidence: 0,
            engagement: 0,
            wordsPerMinute: 0,
            fillerWordCount: 0,
            clarity: 0,
            voice: {
              clarity: 0,
              pace: 0,
              volume: 0,
              intonation: 0,
              fillerCount: 0,
              pauseEffectiveness: 0,
              pitchVariation: 0,
              vocalFryDetection: false,
              uptalkPatterns: 0
            },
            bodyLanguage: {
              eyeContactScore: 0,

              facialExpressions: 0,
              overallPresence: 0
            }
          });
        }}
      />
    );
  }

  // More accurate word counting function (from WorkingRecordingTest)
  const countWordsAccurately = (text: string) => {
    // Remove extra spaces and normalize
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    if (!normalizedText) return 0;
    
    // Split by spaces and filter out empty strings
    const words = normalizedText.split(' ').filter(word => {
      // Count words that have actual content (not just punctuation)
      return word.length > 0 && /[a-zA-Z0-9]/.test(word);
    });
    
    return words.length;
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-x-hidden">
      <div className="space-y-6">
        
        {/* Header */}
        <Card className="border border-blue-200 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="text-2xl font-bold"
                      placeholder="Enter session name"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          saveSessionName();
                        }
                        if (e.key === 'Escape') {
                          setIsEditingName(false);
                        }
                      }}
                      autoFocus
                    />
                    <Button size="sm" onClick={saveSessionName}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent cursor-pointer hover:from-blue-700 hover:to-cyan-600 transition-all duration-200" onClick={() => setIsEditingName(true)}>
                      {sessionName}
                    </h1>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)} className="hover:bg-blue-50">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                {isEditingPurpose ? (
                  <div className="space-y-3 mt-3">
                    <Select value={sessionPurpose} onValueChange={setSessionPurpose}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select session purpose..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SESSION_PURPOSE_OPTIONS.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                <div className="flex flex-col">
                                  <span className="font-medium">{option.label}</span>
                                  <span className="text-xs text-gray-500">{option.description}</span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveSessionPurpose}>
                        <Save className="w-4 h-4" />
                        Save Purpose
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditingPurpose(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-3">
                    {sessionPurpose ? (
                      <div className="flex items-center gap-2">
                        {(() => {
                          const purposeOption = SESSION_PURPOSE_OPTIONS.find(opt => opt.value === sessionPurpose);
                          const IconComponent = purposeOption?.icon || FileText;
                          return (
                            <>
                              <IconComponent className="w-5 h-5 text-blue-600" />
                              <div className="flex flex-col">
                                <span className="text-lg font-semibold text-gray-700">
                                  {purposeOption?.label || sessionPurpose}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {purposeOption?.description || "Custom session purpose"}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <p className="text-lg font-semibold text-gray-700">
                        Click to set your session purpose
                      </p>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingPurpose(true)} className="hover:bg-blue-50">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
                              <div className="flex flex-col lg:flex-row gap-3">
                  {!isRecording ? (
                    <>
                      <Button onClick={() => {
                        console.log('🔍 Debug: Start Practice button clicked');
                        startRecording();
                      }} className="bg-gradient-to-br from-[#2563eb] to-[#22d3ee] hover:from-[#1d4ed8] hover:to-[#06b6d4] text-white shadow-lg hover:shadow-xl transition-all duration-200">
                        <Mic className="w-5 h-5 mr-2" />
                        Start Practice
                      </Button>
                      
                                  {/* Speech recognition status indicator */}
            <div className="flex items-center gap-2 ml-2">
              <div className={`w-3 h-3 rounded-full ${
                speechRecognitionStatus === 'active' ? 'bg-green-500 animate-pulse' :
                speechRecognitionStatus === 'starting' ? 'bg-yellow-500 animate-pulse' :
                speechRecognitionStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
              }`} />
              <span className="text-sm text-gray-600">
                {speechRecognitionStatus === 'active' ? 'Listening' :
                 speechRecognitionStatus === 'starting' ? 'Starting...' :
                 speechRecognitionStatus === 'error' ? 'Error' : 'Ready'}
              </span>
              <span className="text-xs text-gray-500">({transcriptUpdateCount})</span>
            </div>
            

                    </>
                  ) : (
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={stopRecording} 
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl px-6 transition-all duration-200"
                      size="lg"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      End Session ({Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')})
                    </Button>
                    <div className="text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-medium">
                      💾 Auto-saves transcript, WPM, & filler words to Analysis tab
                    </div>
                  </div>
                )}
                
                {/* Video Recording Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setVideoRecordingEnabled(!videoRecordingEnabled)}
                    className={`flex items-center gap-2 transition-all duration-200 ${videoRecordingEnabled ? 'bg-purple-50 border-purple-200 text-purple-700' : ''}`}
                  >
                    <Video className="w-4 h-4" />
                    {videoRecordingEnabled ? 'Video ON' : 'Video OFF'}
                  </Button>
                  
                  {currentRecording && (
                    <Button
                      variant="outline"
                      onClick={() => setShowVideoPlayback(true)}
                      className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                    >
                      <Play className="w-4 h-4" />
                      Watch Recording
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowRecordingLibrary(true)}
                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                  >
                    <Library className="w-4 h-4" />
                    Library
                  </Button>
                  
                                {/* Live Transcript Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowLiveTranscript(!showLiveTranscript)}
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                {showLiveTranscript ? 'Hide' : 'Show'} Transcript
              </Button>
              
              {/* Test Live Metrics */}
              <Button
                variant="outline"
                onClick={() => {
                  const fillerResult = detectFillerWords(transcript);
                  console.log('🧪 Testing live metrics:', {
                    transcript: transcript.substring(0, 100) + '...',
                    sessionDuration: sessionDuration,
                    wordCount: transcript.split(' ').filter(w => w.length > 0).length,
                    wpm: Math.round((transcript.split(' ').filter(w => w.length > 0).length / Math.max(1, sessionDuration / 60))),
                    fillerWords: fillerResult.words,
                    fillerCount: fillerResult.count,
                    currentFillerCount: metrics.fillerWordCount,
                    isRecording: isRecording
                  });
                  toast({
                    title: "Live Metrics Test",
                    description: `Fillers: ${fillerResult.count} detected (${fillerResult.words.join(', ')})`,
                    variant: "default"
                  });
                }}
                className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200 transition-all duration-200"
              >
                <Activity className="w-4 h-4" />
                Test Fillers
              </Button>
                  
                  {/* AI Coach Toggle */}
                  <Button
                    variant="outline"
                    onClick={() => setShowLiveMetrics(!showLiveMetrics)}
                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                  >
                    <Activity className="w-4 h-4" />
                    {showLiveMetrics ? 'Hide' : 'Show'} AI Coach
                  </Button>
                </div>

              </div>
            </div>
          </CardHeader>
        </Card>



        {/* Main Content - Side by Side Layout */}
        <div className="w-full relative">
          <div className={`grid grid-cols-1 ${showLiveMetrics ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8 items-stretch`}>
            
            {/* Left Side - Video Feed (expand to full width when coach hidden) */}
            <div className={`${showLiveMetrics ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-6 relative z-0`}>
              <div ref={recordingSectionRef}>
                <Card className="border border-blue-200 shadow-xl bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden box-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Video className="w-5 h-5 text-blue-600" />
                    Practice Recording
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className={`relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden flex items-center justify-center border border-gray-700 shadow-2xl transition-all duration-300 ${isRecording ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain rounded-xl shadow-lg"
                      muted
                      playsInline
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                    
                    {/* Hidden video element for recording */}
                    <video
                      ref={recordingVideoRef}
                      className="hidden"
                      muted
                      playsInline
                    />
                    
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
                    />
                    
                    {/* Placeholder when video is not active */}
                    {!isRecording && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <div className={`w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mb-6 shadow-lg border border-gray-600 ${!isVideoInitialized ? 'animate-pulse' : ''}`}>
                          {!isVideoInitialized ? (
                            <div className="w-10 h-10 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
                          ) : (
                            <Camera className="w-10 h-10 text-gray-300" />
                          )}
                        </div>
                        <p className="text-gray-200 text-xl font-semibold mb-2">
                          {isVideoInitialized ? "Camera Ready" : "Initializing Camera..."}
                        </p>
                        <p className="text-gray-400 text-sm text-center max-w-xs">
                          {isVideoInitialized 
                            ? "Click \"Start Recording\" to begin your practice session"
                            : "Setting up video recording system..."
                          }
                        </p>
                      </div>
                    )}
                    
                    {isRecording && (
                      <div className="absolute top-4 left-4 space-y-2">
                        <Badge variant="destructive" className="px-3 py-1.5 text-xs font-semibold shadow-lg">
                          <Activity className="w-3 h-3 mr-1.5" />
                          RECORDING {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5 text-xs font-semibold shadow-lg">
                          <Activity className="w-3 h-3 mr-1.5" />
                          SMART FILLER DETECTION
                        </Badge>
                        {isRoboflowAnalyzing && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5 text-xs font-semibold shadow-lg">
                            <Activity className="w-3 h-3 mr-1.5" />
                            COMPUTER VISION ACTIVE
                          </Badge>
                        )}
                        {isFacialAnalysisActive && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1.5 text-xs font-semibold shadow-lg">
                            <Activity className="w-3 h-3 mr-1.5" />
                            FACIAL ANALYSIS ACTIVE
                          </Badge>
                        )}
                        {isComputerVisionAnalyzing && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1.5 text-xs font-semibold shadow-lg">
                            <Activity className="w-3 h-3 mr-1.5" />
                            COMPUTER VISION ACTIVE
                          </Badge>
                        )}
                        {computerVisionError.hasError && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1.5 text-xs font-semibold shadow-lg">
                            <Activity className="w-3 h-3 mr-1.5" />
                            CV ERROR - USING FALLBACK
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              </div>


            </div>

            {/* Right Side - Live AI Coaching Tips (hidden when coach hidden) */}
            {showLiveMetrics && (
            <div className="lg:col-span-1 flex flex-col relative h-full">
              {/* Combined AI Coach and Statistics - Match recording box height */}
              <Card className="border border-blue-200 shadow-xl bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden w-full h-full flex flex-col box-border" style={{ height: coachHeight ? `${coachHeight}px` : undefined }}>
                <CardHeader className="pb-3 shrink-0">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Live AI Coach
                    {isRecording && (
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 border-green-200">
                        <Activity className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    {isRecording && liveFeedback.length > 0 && (
                      <div className="ml-2 flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isAICoachActive ? 'bg-orange-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
                        <span className={`text-xs font-medium ${isAICoachActive ? 'text-orange-600' : 'text-green-600'}`}>
                          {isAICoachActive ? 'Analyzing...' : 'Providing insights every 15s'}
                        </span>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden">
                  {/* Live Feedback Section */}
                  {showLiveMetrics && (
                    <div className="flex-1 min-h-0 mb-4">
                      <div className="h-full overflow-y-auto">
                        {liveFeedback.length > 0 ? (
                          <div className="space-y-3">
                            {liveFeedback.slice(-4).map((feedback) => (
                              <div
                                key={feedback.id}
                                className={`p-3 rounded-lg border-l-4 shadow-sm text-sm ${
                                  feedback.type === 'success' 
                                    ? 'bg-green-50 border-green-400 text-green-800' 
                                    : feedback.type === 'warning'
                                    ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                                    : 'bg-blue-50 border-blue-400 text-blue-800'
                                }`}
                              >
                                <p className="font-medium leading-relaxed">{feedback.message}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-8 h-full flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Activity className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium mb-1">Ready for Coaching</p>
                            <p className="text-xs text-gray-400">Start recording to receive tips</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Live Statistics Section - collapsed strip */}
                  <div className="shrink-0">
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 border border-blue-200">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-700">
                            {metrics.wordsPerMinute > 0 ? metrics.wordsPerMinute : '--'}
                          </span>
                          <span className="text-[10px] text-gray-600 uppercase">WPM</span>
                          <span className="text-[8px] text-gray-500">({wpmUpdateCount})</span>
                          {sessionStartTime && metrics.wordsPerMinute > 0 && (
                            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse ml-1" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-50 border border-purple-200">
                          <AlertTriangle className="w-3 h-3 text-purple-600" />
                          <span className="text-xs font-semibold text-purple-700">{metrics.fillerWordCount}</span>
                          <span className="text-[10px] text-gray-600 uppercase">Fillers</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-50 border border-green-200">
                          <Eye className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-semibold text-green-700">{Math.round(metrics.eyeContact)}%</span>
                          <span className="text-[10px] text-gray-600 uppercase">Eye</span>
                        </div>
                      </div>
                      
                                          </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            )}
          </div>
        </div>

        {/* Live Transcript Panel */}
        {showLiveTranscript && (
          <Card className="border border-blue-200 shadow-lg bg-white/90 backdrop-blur-sm mt-8 mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-semibold">Live Transcript</span>
                  {speechRecognitionStatus === 'active' && (
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                      Listening
                    </Badge>
                  )}
                  {speechRecognitionStatus === 'starting' && (
                    <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-1" />
                      Starting...
                    </Badge>
                  )}
                  {speechRecognitionStatus === 'error' && (
                    <Badge variant="destructive" className="ml-2">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Error
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLiveTranscript(false)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-gray-100 p-6 rounded-lg max-h-60 overflow-y-auto shadow-inner">
                {transcript.trim() ? (
                  <div className="text-sm leading-relaxed">
                    <div 
                      className="text-gray-900"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightFillerWords(transcript) 
                      }}
                    />
                    
                    {/* Show WPM and filler word summary */}
                    <div className="mt-4 space-y-2">
                      {metrics.wordsPerMinute > 0 && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                          <div className="flex items-center justify-between">
                            <strong className="text-blue-800">Speaking Pace:</strong>
                            <span className="font-semibold text-blue-700">{metrics.wordsPerMinute} WPM</span>
                          </div>
                          {sessionStartTime && (
                            <div className="text-blue-600 mt-1">
                              {transcript.split(' ').filter(w => w.length > 0).length} words in {Math.floor((Date.now() - sessionStartTime) / 1000)}s
                            </div>
                          )}
                        </div>
                      )}
                      {metrics.fillerWordCount > 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                          <strong>Fillers detected:</strong> {metrics.fillerWordCount} words
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    {speechRecognitionStatus === 'active' ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span>Listening for speech... Start speaking to see your transcript here</span>
                      </div>
                    ) : speechRecognitionStatus === 'starting' ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                        <span>Initializing speech recognition...</span>
                      </div>
                    ) : speechRecognitionStatus === 'error' ? (
                      <div className="flex items-center justify-center gap-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Speech recognition error. Please check microphone permissions.</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Mic className="w-4 h-4" />
                        <span>Click "Start Practice" to begin recording your speech</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {transcript && (
                <div className="mt-4 flex justify-between items-center text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <span>Words: {countWordsAccurately(transcript)}</span>
                  <span>Characters: {transcript.length}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}



      </div>
    </div>
  );

  // Helper function to format time
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}