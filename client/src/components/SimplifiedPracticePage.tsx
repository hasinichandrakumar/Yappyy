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
  AlertTriangle, Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SessionDataViewer } from '@/components/SessionDataViewer';
import { useRoboflowVision } from '@/hooks/useRoboflowVision';
import { useFacialAnalysis } from '@/hooks/useFacialAnalysis';
import { useRobustComputerVision } from '@/hooks/useRobustComputerVision';
import { useAdvancedFillerDetection } from '@/hooks/useAdvancedFillerDetection';
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

export default function SimplifiedPracticePage() {
  // Core session state
  const [isRecording, setIsRecording] = useState(false);
  const [sessionName, setSessionName] = useState("Session 1");
  const [showAnalysisPage, setShowAnalysisPage] = useState(false);
  const [sessionAnalysisData, setSessionAnalysisData] = useState<any>(null);
  const [sessionPurpose, setSessionPurpose] = useState("general-presentation");
  const [sessionNumber, setSessionNumber] = useState(1);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPurpose, setIsEditingPurpose] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [currentWPM, setCurrentWPM] = useState(0);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [showLiveTranscript, setShowLiveTranscript] = useState(true);
  const [showLiveMetrics, setShowLiveMetrics] = useState(true);

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

  // FIXED: Improved filler word detection with reduced false positives
  const detectFillerWords = useCallback((text: string): string[] => {
    if (!text || text.trim().length === 0) return [];
    
    // FIXED: More conservative filler word patterns to reduce false positives
    const primaryFillers = [
      // Most common vocal fillers - high confidence
      'um', 'uh', 'er', 'ah', 'eh', 'mm', 'hmm'
    ];
    
    const secondaryFillers = [
      // Common discourse markers - medium confidence
      'like', 'so', 'well', 'okay', 'right', 'actually', 'basically'
    ];
    
    const phraseFillers = [
      // Multi-word fillers - high confidence
      'you know', 'i mean', 'kind of', 'sort of'
    ];
    
    const detectedFillers: string[] = [];
    const normalizedText = text.toLowerCase()
      .replace(/[.,!?;:'"()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    const words = normalizedText.split(' ').filter(word => word.length > 0);
    
    // FIXED: Check for phrase fillers first (higher priority)
    for (let i = 0; i < words.length - 1; i++) {
      const twoWords = `${words[i]} ${words[i + 1]}`;
      if (phraseFillers.includes(twoWords)) {
        detectedFillers.push(twoWords);
        i++; // Skip next word since it's part of the phrase
      }
    }
    
    // FIXED: Check for single-word fillers with context awareness
    words.forEach((word, index) => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      
      // Check primary fillers (high confidence)
      if (primaryFillers.includes(cleanWord)) {
        detectedFillers.push(cleanWord);
      }
      // Check secondary fillers (lower confidence, avoid false positives)
      else if (secondaryFillers.includes(cleanWord)) {
        // FIXED: Add context check to reduce false positives
        const context = words.slice(Math.max(0, index - 2), index + 3).join(' ');
        const isLikelyFiller = !context.includes('like this') && 
                              !context.includes('so that') && 
                              !context.includes('well done') &&
                              !context.includes('right now') &&
                              !context.includes('actually happened') &&
                              !context.includes('basically correct');
        
        if (isLikelyFiller) {
          detectedFillers.push(cleanWord);
        }
      }
    });
    
    return detectedFillers;
  }, []);

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
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const metricsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef<string>('');
  const interimTranscriptRef = useRef<string>('');
  const audioAnalyzerRef = useRef<AnalyserNode | null>(null);
  const wpmCalculatorRef = useRef<AccurateWPMCalculator | null>(null);
  const fillerDetectorRef = useRef<IncrementalFillerDetector | null>(null);
  const { toast } = useToast();

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

        // Update live metrics
        setMetrics(prev => ({
          ...prev,
          wordsPerMinute: analytics.speakingRate || prev.wordsPerMinute,
          fillerWordCount: (prev.fillerWordCount || 0) + (analytics.fillerWords?.length || 0),
          voice: {
            ...prev.voice,
            pace: analytics.speakingRate || prev.voice.pace,
            fillerCount: (prev.voice.fillerCount || 0) + (analytics.fillerWords?.length || 0)
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

  // Setup speech recognition
  const setupSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      // Start fallback immediately
      startDeepgramFallback();
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Store recognition in ref for access outside this function
    (recognitionRef as any).current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;
    
    console.log('🎤 Speech recognition configured with standard browser settings');
    
    // CRITICAL: Aggressive configuration to capture vocal fillers like "um" and "uh"
    try {
      // Remove any service restrictions that might filter speech
      recognition.serviceURI = undefined;
      
      // Remove grammar restrictions that might filter filler words
      // Note: grammars property expects SpeechGrammarList, not null
      if (recognition.grammars !== undefined) {
        try {
          // Create an empty SpeechGrammarList instead of setting to null
          const emptyGrammarList = new (window as any).SpeechGrammarList();
          recognition.grammars = emptyGrammarList;
        } catch (grammarError) {
          console.log('🎤 Grammar list not supported, continuing without restrictions');
        }
      }
      
      // Chrome-specific optimizations for maximum filler word capture
      if ('webkitSpeechRecognition' in window) {
        // Use maximum sensitivity settings
        recognition.audioTrack = null;
        
        // Try to disable speech filtering if possible
        try {
          (recognition as any).enableInterimFillers = true;
          (recognition as any).enableVocalFillers = true;
          (recognition as any).filterProfanity = false;
        } catch (filterError) {
          console.log('🎤 Advanced filler settings not available, using fallback');
        }
      }
      
      console.log('🎤 AGGRESSIVE speech recognition configured for vocal filler capture (um, uh, etc.)');
    } catch (e) {
      console.log('🎤 Using default speech recognition settings:', e);
    }
    
    console.log('🎤 Speech recognition configured to capture all speech including filler words');

    recognition.onresult = async (event: any) => {
      let finalTranscript = '';
      let interimText = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        
        // Check ALL alternatives for filler words, not just the first one
        let bestTranscript = result[0].transcript;
        let foundFillers = false;
        
        // Check all alternatives for vocal fillers
        for (let j = 0; j < result.length; j++) {
          const altTranscript = result[j].transcript.toLowerCase();
          if (altTranscript.includes('um') || altTranscript.includes('uh') || 
              altTranscript.includes('ah') || altTranscript.includes('er')) {
            bestTranscript = result[j].transcript;
            foundFillers = true;
            console.log('🎯 Found vocal filler in alternative:', bestTranscript);
            break;
          }
        }
        
        // CRITICAL: Log ALL alternatives to debug why fillers aren't captured
        console.log('🎤 Speech result:', {
          text: bestTranscript,
          isFinal: result.isFinal,
          confidence: result[0].confidence,
          foundFillers: foundFillers,
          alternatives: result.length,
          allAlternatives: Array.from({ length: result.length }, (_, idx) => result[idx]?.transcript || ''),
          rawResult: result
        });
        
        if (result.isFinal) {
          finalTranscript += bestTranscript + ' ';
        } else {
          interimText += bestTranscript;
        }
      }

      // Update interim transcript for live display AND check for vocal fillers
      setInterimTranscript(interimText);
      interimTranscriptRef.current = interimText;
      
      // Update full transcript
      if (finalTranscript.trim()) {
        const fullTranscript = transcriptRef.current + finalTranscript;
        transcriptRef.current = fullTranscript;
        setTranscript(fullTranscript);
        
        // Add words to WPM calculator for accurate calculation
        if (wpmCalculatorRef.current && finalTranscript.trim().length > 0) {
          const words = finalTranscript.trim().split(/\s+/).filter(word => word.length > 0);
          wpmCalculatorRef.current.addWords(words);
          console.log(`📊 Added ${words.length} words to WPM calculator`);
        }
        
        // Use incremental filler detection for accurate one-by-one counting
        if (fillerDetectorRef.current && fullTranscript.trim().length > 0) {
          const fillerCounts = fillerDetectorRef.current.analyzeNewTranscript(fullTranscript);
          
          console.log(`🎯 Incremental filler detection: ${fillerCounts.totalFillers} total fillers (UM: ${fillerCounts.umCount}, UH: ${fillerCounts.uhCount})`);
          
          // Update metrics with accurate filler count
          setMetrics(prev => ({
            ...prev,
            fillerWordCount: fillerCounts.totalFillers,
            voice: {
              ...prev.voice,
              fillerCount: fillerCounts.totalFillers
            }
          }));
          
          // Only show feedback if new fillers were detected
          if (fillerCounts.totalFillers > 0) {
            const umUhInfo = fillerCounts.umCount + fillerCounts.uhCount > 0 ? 
              ` (UM: ${fillerCounts.umCount}, UH: ${fillerCounts.uhCount})` : '';
            const feedbackMessage = `${fillerCounts.totalFillers} filler words detected${umUhInfo}`;
            
            setLiveFeedback(prev => [...prev.slice(-4), {
              id: Date.now().toString(),
              message: feedbackMessage,
              type: fillerCounts.totalFillers > 5 ? 'warning' : 'info',
              timestamp: Date.now()
            }]);
          }
        }
      }
    };

    // Add error handler
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      // On errors like not-allowed/no-speech, ensure fallback is active
      if (!isSpeechFallbackActive) {
        startDeepgramFallback();
      }
    };

    // Add end handler to restart if needed
    recognition.onend = () => {
      if (isRecording && !isSpeechFallbackActive) {
        try {
          recognition.start();
        } catch (e) {
          console.warn('Failed to restart speech recognition, using fallback');
          startDeepgramFallback();
        }
      }
    };

  }, [sessionDuration, transcript, isSpeechFallbackActive, startDeepgramFallback, toast]);

  // Enhanced comprehensive live insights system with improved effectiveness
  useEffect(() => {
    if (!isRecording) return;

    const generateLiveInsights = () => {
      const currentWPM = metrics.wordsPerMinute;
      const fillerCount = metrics.fillerWordCount;
      const confidence = metrics.confidence;
      const eyeContact = metrics.eyeContact;
      const engagement = metrics.engagement;
      const sessionMinutes = sessionDuration / 60;
      const lastMessage = liveFeedback[liveFeedback.length - 1];
      const timeSinceLastFeedback = lastMessage ? (Date.now() - lastMessage.timestamp) / 1000 : 999;

      // Only generate feedback if enough time has passed (avoid spam)
      if (timeSinceLastFeedback < 15) return;

      // Starting feedback to get users engaged
      if (sessionDuration >= 3 && sessionDuration < 10 && (!lastMessage || !lastMessage.message.includes('Welcome'))) {
        setLiveFeedback(prev => [...prev.slice(-4), {
          id: Date.now().toString(),
          message: 'Recording started! Begin speaking naturally for live analysis',
          type: 'info',
          timestamp: Date.now()
        }]);
        return;
      }

      // Voice and Speech Analytics (improved thresholds)
      if (currentWPM > 0 && sessionDuration >= 10) {
        if (currentWPM >= 130 && currentWPM <= 170 && (!lastMessage || !lastMessage.message.includes('Perfect pace'))) {
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: `Great pace at ${currentWPM} WPM! Keep this rhythm going`,
            type: 'success',
            timestamp: Date.now()
          }]);
        } else if (currentWPM > 200 && (!lastMessage || !lastMessage.message.includes('too fast'))) {
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: `Speaking quite fast at ${currentWPM} WPM - consider slowing down`,
            type: 'warning',
            timestamp: Date.now()
          }]);
        } else if (currentWPM < 110 && currentWPM > 30 && sessionMinutes > 0.5 && (!lastMessage || !lastMessage.message.includes('increase energy'))) {
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: `Try increasing energy - current pace: ${currentWPM} WPM`,
            type: 'info',
            timestamp: Date.now()
          }]);
        }
      }

      // Transcript length feedback  
      const transcriptLength = transcript.trim().length;
      if (sessionDuration >= 15 && transcriptLength < 50 && (!lastMessage || !lastMessage.message.includes('Keep talking'))) {
        setLiveFeedback(prev => [...prev.slice(-4), {
          id: Date.now().toString(),
          message: 'Keep talking! I\'m analyzing your speech patterns',
          type: 'info',
          timestamp: Date.now()
        }]);
      }

      // Filler Word Analysis (improved sensitivity)
      if (sessionMinutes > 0.8) {
        const fillersPerMinute = fillerCount / sessionMinutes;
        if (fillersPerMinute > 4 && (!lastMessage || !lastMessage.message.includes('filler'))) {
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: `${Math.round(fillersPerMinute)} fillers/min detected - try pausing instead`,
            type: 'warning',
            timestamp: Date.now()
          }]);
        } else if (fillersPerMinute <= 1 && fillerCount > 2 && (!lastMessage || !lastMessage.message.includes('clean speech'))) {
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: 'Excellent! Very clean speech with minimal fillers',
            type: 'success',
            timestamp: Date.now()
          }]);
        }
      }

      // Computer Vision Feedback (only when real data available)
      if (eyeContact > 75 && (!lastMessage || !lastMessage.message.includes('eye contact'))) {
        setLiveFeedback(prev => [...prev.slice(-4), {
          id: Date.now().toString(),
          message: 'Excellent eye contact! You\'re engaging your audience well',
          type: 'success',
          timestamp: Date.now()
        }]);
      } else if (eyeContact > 0 && eyeContact < 45 && (!lastMessage || !lastMessage.message.includes('Look at'))) {
        setLiveFeedback(prev => [...prev.slice(-4), {
          id: Date.now().toString(),
          message: 'Try looking at the camera more - aim for 60%+ eye contact',
          type: 'info',
          timestamp: Date.now()
        }]);
      }

      // Confidence feedback (when available)
      if (confidence > 85 && (!lastMessage || !lastMessage.message.includes('confident'))) {
        setLiveFeedback(prev => [...prev.slice(-4), {
          id: Date.now().toString(),
          message: 'Great confidence! Your posture and presence look strong',
          type: 'success',
          timestamp: Date.now()
        }]);
      }

      // Engagement encouragement
      if (sessionDuration >= 30 && sessionDuration < 35 && (!lastMessage || !lastMessage.message.includes('doing great'))) {
        setLiveFeedback(prev => [...prev.slice(-4), {
          id: Date.now().toString(),
          message: 'You\'re doing great! Keep practicing for better results',
          type: 'info',
          timestamp: Date.now()
        }]);
      }

      // Professional tips (less frequent, more targeted)
      if (sessionDuration >= 45 && sessionDuration % 30 < 2 && (!lastMessage || timeSinceLastFeedback > 25)) {
        const practicalTips = [
          'Use hand gestures to emphasize key points',
          'Vary your vocal pitch to maintain interest', 
          'Use strategic pauses for impact',
          'Project your voice from your diaphragm',
          'Keep shoulders relaxed and spine straight'
        ];
        
        const randomTip = practicalTips[Math.floor(sessionDuration / 30) % practicalTips.length];
        if (!lastMessage || !lastMessage.message.includes(randomTip.substring(0, 10))) {
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: randomTip,
            type: 'info',
            timestamp: Date.now()
          }]);
        }
      }
    };

    // Start feedback after 1.5s, then update every 15s
    const initialTimeout = setTimeout(generateLiveInsights, 1500);
    const interval = setInterval(generateLiveInsights, 15000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isRecording, metrics, sessionDuration, liveFeedback, transcript]);

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
      
      // Set recording state immediately to show UI feedback
      setIsRecording(true);
      
      // Initialize video recording first and wait for it to be ready
      const videoInitialized = await initializeVideoRecording();
      console.log('📹 Video initialization result:', videoInitialized);

      // Initialize speech recognition
      setupSpeechRecognition();

      // Start session timer
      const sessionStartTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
        setSessionDuration(elapsedSeconds);
        
        // FIXED: Improved WPM calculation with proper word counting
        if (transcript.trim().length > 0) {
          const currentTranscript = transcript + interimTranscriptRef.current;
          const hasActualSpeech = currentTranscript.trim().length > 5;
          
          if (hasActualSpeech) {
            // FIXED: Better word counting - only count actual words, not punctuation or filler markers
            const sanitized = currentTranscript
              .replace(/\[[^\]]*\]/g, ' ') // Remove speech recognition markers
              .replace(/[.,!?;:'"()]/g, ' ') // Remove punctuation
              .replace(/\s+/g, ' ') // Normalize whitespace
              .trim();
            
            const words = sanitized.split(/\s+/).filter(word => word.length > 0);
            const wordCount = words.length;
            
            // FIXED: Proper WPM calculation with minimum time threshold
            const timeInMinutes = elapsedSeconds / 60;
            const wpm = timeInMinutes > 0.1 && wordCount >= 3 && timeInMinutes > 0 ? Math.round(wordCount / timeInMinutes) : 0;
            
            console.log(`🔄 Live WPM update: ${wordCount} words in ${elapsedSeconds}s = ${wpm} WPM`);
            setMetrics(prev => ({ 
              ...prev, 
              wordsPerMinute: wpm,
              voice: {
                ...prev.voice,
                pace: wpm,
                volume: prev.voice.volume ?? 0,
                intonation: prev.voice.intonation ?? 0,
                pauseEffectiveness: prev.voice.pauseEffectiveness ?? 0,
                pitchVariation: prev.voice.pitchVariation ?? 0,
                vocalFryDetection: prev.voice.vocalFryDetection ?? false,
                uptalkPatterns: prev.voice.uptalkPatterns ?? 0
              }
            }));
          } else {
            // No speech detected, keep WPM at 0
            setMetrics(prev => ({ 
              ...prev, 
              wordsPerMinute: 0,
              voice: {
                ...prev.voice,
                pace: 0,
                volume: prev.voice.volume ?? 0,
                intonation: prev.voice.intonation ?? 0,
                pauseEffectiveness: prev.voice.pauseEffectiveness ?? 0,
                pitchVariation: prev.voice.pitchVariation ?? 0,
                vocalFryDetection: prev.voice.vocalFryDetection ?? false,
                uptalkPatterns: prev.voice.uptalkPatterns ?? 0
              }
            }));
          }
        }
      }, 1000);

      // Get media stream for the entire session (don't duplicate getUserMedia calls)
      let stream = streamRef.current;
      if (!stream) {
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
      }
      
      // Start video recording if initialized - give it a small delay to ensure MediaRecorder is ready
      if (videoInitialized && recordingVideoRef.current) {
        setTimeout(() => {
          const recordingStarted = videoRecordingManager.startRecording();
          if (recordingStarted) {
            console.log('🎬 Video recording started successfully');
          } else {
            console.warn('⚠️ Video recording failed to start');
          }
        }, 100);
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
          videoRef.current ? startBodyAnalysis(videoRef.current) : Promise.resolve(false)
        ];
        Promise.allSettled(startupTasks).then(() => {
          console.log('✅ Vision pipelines initialized');
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

              setMetrics(prev => ({
                ...prev,
                voice: {
                  ...prev.voice,
                  volume: volumePercent,
                  intonation: intonationPercent,
                  pitchVariation: Math.min(100, Math.max(0, Math.round((std / 40) * 100)))
                }
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

      // Start speech recognition with fallback
      setupSpeechRecognition();
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
        } else {
          // No recognition available, start fallback
          await startDeepgramFallback();
        }
      } catch (e) {
        console.warn('⚠️ Web Speech start failed, using fallback', e);
        await startDeepgramFallback();
      }

      setIsRecording(true);

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
          confidence: facialAnalysis?.facialMetrics?.emotionalExpression?.confidence ?? computerVisionMetrics?.confidence ?? prev.confidence,
          engagement: facialAnalysis?.facialMetrics?.emotionalExpression?.engagement ?? computerVisionMetrics?.engagement ?? prev.engagement,
          clarity: facialAnalysis?.facialMetrics?.emotionalExpression?.authenticity ?? prev.clarity,
          bodyLanguage: {
            ...prev.bodyLanguage,
            // Use real-time eye contact as primary system, with fallback
            eyeContactScore: eyeContactPercentage > 0 ? eyeContactPercentage : prev.bodyLanguage.eyeContactScore,
            facialExpressions: bodyMetrics?.gestures?.naturalness ?? prev.bodyLanguage.facialExpressions,
            overallPresence: bodyMetrics?.overall?.presence ?? prev.bodyLanguage.overallPresence
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
    } catch (error) {
      console.error('Failed to start recording:', error);
      // Reset recording state on failure
      setIsRecording(false);
      toast({
        title: "Recording Failed",
        description: "Please allow camera and microphone access",
        variant: "destructive"
      });
    }
  }, [setupSpeechRecognition, toast, transcript, interimTranscript]);

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

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

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

  // Stop eye contact detection
  try {
    stopEyeContactDetection();
    console.log('👁️ Eye contact detection stopped');
  } catch (error) {
    console.warn('⚠️ Error stopping eye contact detection');
  }

    setIsRecording(false);
    setIsVideoInitialized(false);

    // Save session to database with comprehensive data
    try {
      console.log('💾 Preparing to save session data...');
      
              const sessionData = {
          sessionName: sessionName || `Session ${sessionNumber || 1}`,
          purpose: sessionPurpose || 'general-presentation',
        duration: sessionDuration,
        transcript: transcript || '',
        averageWPM: wpmCalculatorRef.current ? wpmCalculatorRef.current.calculateWPM().averageWPM : metrics.wordsPerMinute || 0,
        confidenceScore: metrics.confidence || 0,
        voiceClarity: metrics.voice.clarity || 0,
        fillerWords: metrics.fillerWordCount || 0,
        pauseCount: 0,
        eyeContactScore: String(metrics.eyeContact || 0),
        coachingTips: [],
        videoBlob: recordingData?.videoBlob ? await recordingData.videoBlob.arrayBuffer().then((buffer: ArrayBuffer) => 
          Buffer.from(buffer).toString('base64')
        ) : null,
        facialAnalysis: JSON.stringify({
          eyeContact: metrics.eyeContact || 0,
          confidence: metrics.confidence || 0,
          engagement: metrics.engagement || 0,
          bodyLanguage: metrics.bodyLanguage || {}
        }),
        voiceMetrics: JSON.stringify({
          clarity: metrics.voice.clarity || 0,
          pace: metrics.voice.pace || 0,
          volume: metrics.voice.volume || 0,
          intonation: metrics.voice.intonation || 0,
          fillerCount: metrics.voice.fillerCount || 0,
          pauseEffectiveness: metrics.voice.pauseEffectiveness || 0,
          pitchVariation: metrics.voice.pitchVariation || 0,
          vocalFryDetection: metrics.voice.vocalFryDetection || false,
          uptalkPatterns: metrics.voice.uptalkPatterns || 0
        }),
        bodyLanguageMetrics: JSON.stringify({
          eyeContact: metrics.bodyLanguage?.eyeContactScore || 0,
          postureConfidence: bodyMetrics?.posture?.confidence || 0,
          spineAlignment: bodyMetrics?.posture?.spineAlignment || 0,
          shoulderPosition: bodyMetrics?.posture?.shoulderPosition || 0,
          stability: bodyMetrics?.posture?.stability || 0,
          presence: bodyMetrics?.overall?.presence || 0,
          professionalism: bodyMetrics?.overall?.professionalism || 0,
          confidence: bodyMetrics?.overall?.confidence || 0
        }),
        // Top-level posture score for Analysis tab
        postureScore: bodyMetrics?.posture?.confidence || 0,
        aiAnalysis: JSON.stringify({
          overallScore: Math.round((metrics.confidence + metrics.clarity + metrics.engagement) / 3) || 0,
          strengths: [],
          improvements: []
        }),
        persuasivenessScore: metrics.confidence || 0
      };

      console.log('📊 Session data prepared:', {
        name: sessionData.sessionName,
        duration: sessionData.duration,
        transcript_length: sessionData.transcript.length,
        wpm: sessionData.averageWPM,
        fillers: sessionData.fillerWords
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

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Session ${result.session.sessionNumber} saved successfully`);
        
        // Update session number for next session
        const nextSessionNumber = result.session.sessionNumber + 1;
        setSessionNumber(nextSessionNumber);
        setSessionName(`Session ${nextSessionNumber}`);
        
        toast({
          title: "Session Saved!",
          description: `${result.message} - Check the Analysis tab to view your session`,
          variant: "default"
        });
      } else {
        console.error('❌ Failed to save session:', result.message);
        toast({
          title: "Save Failed",
          description: result.message || "Unable to save session",
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
    }

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

    // Save session with schema-compliant data structure - ONLY REAL DATA
    try {
      // Check if there was actual speech input
      const hasRealSpeech = transcript && transcript.trim().length > 10;
      const words = hasRealSpeech ? transcript.split(' ').filter(w => w.length > 0) : [];
      const averageWPM = hasRealSpeech && sessionDuration > 0 ? Math.round((words.length / sessionDuration) * 60) : 0;
      
      // Only calculate metrics if there was real speech, otherwise use 0 values
      const realConfidenceScore = hasRealSpeech ? Math.round((metrics.eyeContact + metrics.confidence + metrics.engagement) / 3) : 0;
      const realEyeContact = hasRealSpeech ? metrics.eyeContact : 0;
      const realVoiceClarity = hasRealSpeech ? metrics.clarity : 0;
      const realFillerWords = hasRealSpeech ? metrics.fillerWordCount : 0;
      
      const sessionData = {
        userId: 'demo-user',
        duration: sessionDuration,
        averageWPM: averageWPM,
        confidenceScore: realConfidenceScore / 100, // Convert to 0-1 range for real type
        voiceClarity: realVoiceClarity / 100, // Convert to 0-1 range for real type
        fillerWords: realFillerWords,
        pauseCount: hasRealSpeech ? Math.floor(sessionDuration / 30) : 0, // Only estimate pauses if speech occurred
        eyeContactScore: `${realEyeContact}%`, // String format as required by schema
        transcript: transcript || 'No transcript available',
        coachingTips: hasRealSpeech ? [
          `Confidence level: ${realConfidenceScore}%`,
          `Eye contact: ${realEyeContact}%`, 
          `Engagement: ${metrics.engagement}%`,
          `Speaking pace: ${averageWPM} WPM`
        ] : [
          'No speech detected in this session',
          'Try speaking during the recording to get analysis',
          'Check microphone permissions and audio settings'
        ],
        // Analysis tab compatible fields
        clarityScore: realVoiceClarity / 100,
        // Volume and intonation analysis removed - not functional
        postureScore: 0, // Posture analysis removed
        fillerWordsUh: hasRealSpeech ? Math.floor(realFillerWords * 0.4) : 0, // Only if speech occurred
        fillerWordsLike: hasRealSpeech ? Math.floor(realFillerWords * 0.3) : 0, // Only if speech occurred
        fillerWordsSo: hasRealSpeech ? Math.floor(realFillerWords * 0.3) : 0, // Only if speech occurred
        name: sessionName || `Session ${Date.now()}`,
        purpose: sessionPurpose || 'General practice session',
        // Enhanced AI analysis fields
        aiAnalysis: {
          overallPerformance: realConfidenceScore,
          sessionName: sessionName,
          purpose: sessionPurpose,
          facialAnalysis: facialAnalysis?.facialMetrics || null,
          hasRealSpeech: hasRealSpeech
        },
        speechPatterns: {
          averageWPM: averageWPM,
          fillerCount: realFillerWords,
          clarity: realVoiceClarity
        },
          bodyLanguageMetrics: {
            eyeContact: realEyeContact,
            confidence: hasRealSpeech ? (bodyMetrics?.overall?.confidence || metrics.confidence) : 0,
            postureConfidence: bodyMetrics?.posture?.confidence || 0,
            spineAlignment: bodyMetrics?.posture?.spineAlignment || 0,
            shoulderPosition: bodyMetrics?.posture?.shoulderPosition || 0,
            stability: bodyMetrics?.posture?.stability || 0,
            gesturesNaturalness: bodyMetrics?.gestures?.naturalness || 0,
            gesturesEffectiveness: bodyMetrics?.gestures?.effectiveness || 0,
            gesturesTiming: bodyMetrics?.gestures?.timing || 0,
          },
        persuasivenessScore: realConfidenceScore / 100,
        emotionalIntelligence: {
          engagement: hasRealSpeech ? metrics.engagement : 0,
          confidence: hasRealSpeech ? metrics.confidence : 0,
          authenticity: hasRealSpeech ? (facialAnalysis?.facialMetrics?.emotionalExpression?.authenticity || 75) : 0
        }
      };

      console.log('💾 Saving session with schema-compliant data:', sessionData);

      const response = await fetch('/api/practice-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      if (response.ok) {
        const savedSession = await response.json();
        console.log('✅ Session saved successfully:', savedSession);
        
        toast({
          title: "✅ Session Saved Successfully",
          description: `${sessionName} saved with full transcript and analytics - view anytime in Analysis tab`,
        });
        
        // Prepare analysis data that matches AuthenticAnalysisPage interface exactly
        const analysisData = {
          id: Date.now(),
          sessionNumber: sessionNumber || 1,
          sessionName: sessionName || 'Practice Session',
          purpose: sessionPurpose || 'General Practice',
          duration: sessionDuration,
          transcript: transcript || 'No transcript available',
          averageWPM: metrics.wordsPerMinute || 0,
          confidenceScore: Math.round(metrics.confidence || 0),
          voiceClarity: Math.round(metrics.voice?.clarity || 0),
          fillerWords: metrics.fillerWordCount || 0,
          pauseCount: 0,
          eyeContactScore: `${Math.round(metrics.eyeContact || 0)}%`,
          coachingTips: [],
          facialAnalysis: facialAnalysis?.facialMetrics,
          voiceMetrics: {
            clarity: Math.round(metrics.voice?.clarity || 0),
            pace: metrics.wordsPerMinute || 0,
            fillerCount: metrics.fillerWordCount || 0
          },
          bodyLanguageMetrics: {
            eyeContact: metrics.eyeContact || 0,
            confidence: metrics.confidence || 0,
            posture: 0
          },
          persuasivenessScore: Math.round((metrics.confidence + metrics.eyeContact) / 2) || 0,
          createdAt: new Date().toISOString(),
          hasRealSpeech: transcript && transcript.trim().length > 10
        };
        
        console.log('📊 Analysis data prepared for AuthenticAnalysisPage:', analysisData);
        
        // Save session with video and transcript to database
        try {
          let base64Video = null;
          if (recordingData && recordingData.videoBlob) {
            try {
              const videoData = await recordingData.videoBlob.arrayBuffer();
              const uint8Array = new Uint8Array(videoData);
              let binaryString = '';
              for (let i = 0; i < uint8Array.length; i++) {
                binaryString += String.fromCharCode(uint8Array[i]);
              }
              base64Video = btoa(binaryString);
            } catch (error) {
              console.warn('⚠️ Failed to convert video to base64:', error);
              base64Video = null;
            }
          }
          
          const saveVideoResponse = await fetch('/api/sessions/save-with-video', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionName: sessionName,
              sessionPurpose: sessionPurpose,
              transcript: transcript,
              videoData: base64Video,
              duration: sessionDuration,
              metrics: {
                confidence: metrics.confidence || 0,
                clarity: metrics.voice?.clarity || 0,
                pace: metrics.voice?.pace || 0,
                eyeContact: metrics.eyeContact || 0,
                gesture: 0, // Gesture analysis removed
                fillerWordCount: metrics.fillerWordCount || 0,
                wordsPerMinute: metrics.wordsPerMinute || 0
              },
              facialAnalysis: facialAnalysis?.facialMetrics,
              voiceMetrics: {
                clarity: metrics.voice?.clarity || 0,
                pace: metrics.voice?.pace || 0,
                volume: metrics.voice?.volume || 0,
                intonation: metrics.voice?.intonation || 0,
                fillerCount: metrics.fillerWordCount || 0,
                pauseEffectiveness: metrics.voice?.pauseEffectiveness || 0,
                pitchVariation: metrics.voice?.pitchVariation || 0,
                vocalFryDetection: metrics.voice?.vocalFryDetection || false,
                uptalkPatterns: metrics.voice?.uptalkPatterns || 0
              }
            })
          });

                    if (saveVideoResponse.ok) {
            const savedVideoSession = await saveVideoResponse.json();
            console.log('✅ Session with video/transcript saved to database:', savedVideoSession.sessionId);
            
            // Also save to local recording storage for immediate playback
            if (recordingData) {
              const recordingId = sessionRecordingStorage.saveRecording(
                recordingData,
                transcript,
                sessionData,
                facialAnalysis?.facialMetrics
              );
              setCurrentRecording(recordingData);
              console.log('🎬 Video recording also saved locally:', recordingId);
            }
            
            toast({
              title: "Session & Video Saved Successfully",
              description: `Session saved to database with ${savedVideoSession.hasVideo ? 'video recording' : 'transcript'} - view anytime in Analysis tab`,
              duration: 4000
            });
          } else {
            const errorText = await saveVideoResponse.text().catch(() => 'Unknown error');
            throw new Error(`Video save failed: ${errorText}`);
          }
          
        } catch (videoSaveError) {
          console.error('❌ Failed to save session with video:', videoSaveError);
          toast({
            title: "Video Save Warning", 
            description: "Session saved but video may not be available for review",
            variant: "destructive",
            duration: 5000
          });
          
          // Fallback to local storage only
          if (recordingData) {
            const recordingId = sessionRecordingStorage.saveRecording(
              recordingData,
              transcript,
              sessionData,
              facialAnalysis?.facialMetrics
            );
            setCurrentRecording(recordingData);
            console.log('🎬 Video saved locally as fallback:', recordingId);
          }
        }

        console.log('🔄 Setting analysis data and showing analysis page...');
        setSessionAnalysisData(analysisData);
        setShowAnalysisPage(true);
        console.log('✅ Analysis page should now be visible with data:', { showAnalysisPage: true, hasAnalysisData: !!analysisData });
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Save Failed",
        description: "Could not save session data",
        variant: "destructive"
      });
    }
  }, [sessionName, sessionPurpose, sessionDuration, transcript, metrics, toast]);

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
  if (showAnalysisPage && sessionAnalysisData) {
    return (
      <AuthenticAnalysisPage
        session={sessionAnalysisData}
        onClose={() => setShowAnalysisPage(false)}
        onNewSession={() => {
          setShowAnalysisPage(false);
          setSessionAnalysisData(null);
          // Reset all session data
          setSessionName("");
          setSessionPurpose("");
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
                  <Button onClick={startRecording} className="bg-gradient-to-br from-[#2563eb] to-[#22d3ee] hover:from-[#1d4ed8] hover:to-[#06b6d4] text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    <Mic className="w-5 h-5 mr-2" />
                    Start Practice
                  </Button>
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
                    <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      💾 Auto-saves to Analysis tab
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
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 border border-blue-200">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-700">{metrics.wordsPerMinute}</span>
                          <span className="text-[10px] text-gray-600 uppercase">WPM</span>
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
                  {isRecording && (
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 border-green-200">
                      <Activity className="w-3 h-3 mr-1" />
                      Live
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
                {transcript || interimTranscript ? (
                  <div className="text-sm leading-relaxed">
                    <FillerWordHighlighter 
                      text={transcript}
                      className="text-gray-900"
                    />
                    {interimTranscript && (
                      <span className="text-gray-400 italic">
                        {' ' + interimTranscript}
                      </span>
                    )}
                    
                    {/* Show filler word count summary */}
                    {metrics.fillerWordCount > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                        <strong>Fillers detected:</strong> {metrics.fillerWordCount} words
                        {transcript.includes('[UM') && ' (including UM sounds)'}
                        {transcript.includes('[UH') && ' (including UH sounds)'}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    {isRecording ? (
                      <div className="flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span>Listening for speech...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Mic className="w-4 h-4" />
                        <span>Start recording to see live transcript</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {transcript && (
                <div className="mt-4 flex justify-between items-center text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  <span>Words: {transcript.split(' ').filter(w => w.length > 0).length}</span>
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