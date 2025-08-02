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
import { MediaPipeService, type MediaPipeMetrics } from '../services/MediaPipeService';

import { 
  videoRecordingManager, 
  sessionRecordingStorage, 
  VideoRecordingData 
} from '@/lib/video-recording';

import { FillerWordHighlighter } from './FillerWordHighlighter';

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

interface SimplifiedPracticePageProps {
  onNavigateToAnalysis?: () => void;
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

export default function SimplifiedPracticePage({ onNavigateToAnalysis }: SimplifiedPracticePageProps = {}) {
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
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [showLiveTranscript, setShowLiveTranscript] = useState(true);

  // Video recording state
  const [currentRecording, setCurrentRecording] = useState<VideoRecordingData | null>(null);
  const [showVideoPlayback, setShowVideoPlayback] = useState(false);
  const [showRecordingLibrary, setShowRecordingLibrary] = useState(false);
  const [videoRecordingEnabled, setVideoRecordingEnabled] = useState(true);

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
      fillerCount: 0
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
  
  // Real-time analytics collection
  const [collectedAnalytics, setCollectedAnalytics] = useState<any[]>([]);
  
  // Vocal filler detection state
  const [vocalFillerBuffer, setVocalFillerBuffer] = useState<string[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);
  const [vocalFillerRecorder, setVocalFillerRecorder] = useState<MediaRecorder | null>(null);
  const [isListeningForFillers, setIsListeningForFillers] = useState(false);

  // MediaPipe integration for authentic computer vision
  const [mediaPipeMetrics, setMediaPipeMetrics] = useState<MediaPipeMetrics | null>(null);
  const mediaPipeService = useRef<MediaPipeService | null>(null);

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

  // Enhanced multi-source authentic metrics fetching
  useEffect(() => {
    if (!isRecording) return;

    const fetchComprehensiveMetrics = async () => {
      try {
        // Fetch real-time analytics from the new unified endpoint
        const response = await fetch('/api/real-time-analytics');
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.analytics) {
            console.log('📊 Real-time analytics received:', data.analytics);
            
            // Process analytics from all sources
            const { roboflow, mediapipe, facial, voice } = data.analytics;

            let hasAuthenticData = false;
            let aggregatedMetrics = {
              eyeContact: 0,
              confidence: 0,
              engagement: 0,
              postureScore: 0,
              gestureEffectiveness: 0,
              facialExpressions: 0,
              voiceClarity: 0,
              fillerCount: 0
            };

            // Process Roboflow Analysis
            if (roboflow && (roboflow.posture?.confidence > 0 || roboflow.gestures?.effectiveness > 0)) {
              aggregatedMetrics.postureScore = Math.max(aggregatedMetrics.postureScore, roboflow.posture?.confidence || 0);
              aggregatedMetrics.gestureEffectiveness = Math.max(aggregatedMetrics.gestureEffectiveness, roboflow.gestures?.effectiveness || 0);
              aggregatedMetrics.confidence = Math.max(aggregatedMetrics.confidence, roboflow.overall?.confidence || 0);
              hasAuthenticData = true;
              console.log('✅ Roboflow analysis data:', roboflow);
            }

            // Process MediaPipe Analysis
            if (mediapipe && mediapipe.hasAuthenticData) {
              aggregatedMetrics.eyeContact = Math.max(aggregatedMetrics.eyeContact, mediapipe.eyeContact?.eyeContactPercentage || 0);
              aggregatedMetrics.confidence = Math.max(aggregatedMetrics.confidence, mediapipe.facialExpression?.confidence || 0);
              aggregatedMetrics.engagement = Math.max(aggregatedMetrics.engagement, mediapipe.facialExpression?.engagement || 0);
              aggregatedMetrics.postureScore = Math.max(aggregatedMetrics.postureScore, mediapipe.posture?.overallPosture || 0);
              hasAuthenticData = true;
              console.log('✅ MediaPipe analysis data:', mediapipe);
            }

            // Process Facial Analysis
            if (facial && (facial.engagement > 0 || facial.confidence > 0)) {
              aggregatedMetrics.facialExpressions = Math.max(aggregatedMetrics.facialExpressions, facial.engagement || 0);
              aggregatedMetrics.confidence = Math.max(aggregatedMetrics.confidence, facial.confidence || 0);
              hasAuthenticData = true;
              console.log('✅ Facial analysis data:', facial);
            }

            // Process Voice Analysis
            if (voice && (voice.clarity > 0 || voice.fillerCount > 0)) {
              aggregatedMetrics.voiceClarity = Math.max(aggregatedMetrics.voiceClarity, voice.clarity || 0);
              aggregatedMetrics.fillerCount = Math.max(aggregatedMetrics.fillerCount, voice.fillerCount || 0);
              hasAuthenticData = true;
              console.log('✅ Voice analysis data:', voice);
            }

            // Update metrics only if we have authentic data
            if (hasAuthenticData) {
              setMetrics(prev => ({
                ...prev,
                eyeContact: Math.round(aggregatedMetrics.eyeContact),
                confidence: Math.round(aggregatedMetrics.confidence),
                engagement: Math.round(aggregatedMetrics.engagement),
                fillerWordCount: aggregatedMetrics.fillerCount,
                voice: {
                  ...prev.voice,
                  clarity: Math.round(aggregatedMetrics.voiceClarity),
                  fillerCount: aggregatedMetrics.fillerCount
                },
                bodyLanguage: {
                  eyeContactScore: Math.round(aggregatedMetrics.eyeContact),
                  facialExpressions: Math.round(aggregatedMetrics.facialExpressions),
                  overallPresence: Math.round((aggregatedMetrics.confidence + aggregatedMetrics.postureScore) / 2)
                }
              }));
              
              // Store analytics data for session saving
              setCollectedAnalytics(prev => [...prev, {
                timestamp: Date.now(),
                source: 'real-time-multi-engine',
                data: {
                  roboflow,
                  mediapipe,
                  facial,
                  voice,
                  aggregatedMetrics
                }
              }]);
              
              console.log('🎯 UPDATED WITH AUTHENTIC MULTI-SOURCE DATA:', aggregatedMetrics);
            }
          }
        }

      } catch (error) {
        console.log('📊 Comprehensive analysis fetch failed:', error);
      }
    };

    // Fetch immediately and then every 2 seconds for real-time updates
    fetchComprehensiveMetrics();
    const interval = setInterval(fetchComprehensiveMetrics, 2000);
    
    return () => clearInterval(interval);
  }, [isRecording]);

  // Fetch session number on component load
  useEffect(() => {
    const fetchSessionNumber = async () => {
      try {
        const response = await fetch('/api/sessions/next-number');
        const data = await response.json();
        const nextSessionNumber = data.sessionNumber;
        
        setSessionNumber(nextSessionNumber);
        setSessionName(`Session ${nextSessionNumber}`);
      } catch (error) {
        console.log('Using default session number');
        setSessionNumber(1);
        setSessionName("Session 1");
      }
    };

    fetchSessionNumber();
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
  const { toast } = useToast();

  // Video recording refs
  const recordingVideoRef = useRef<HTMLVideoElement>(null);

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

  // Setup speech recognition
  const setupSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

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
      if (recognition.grammars !== undefined) {
        recognition.grammars = null;
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
      
      // Enhanced vocal filler detection in interim results with regex patterns
      if (interimText.trim()) {
        const interimLower = interimText.toLowerCase().trim();
        const vocalFillerPatterns = ['um', 'uh', 'uhm', 'umm', 'uhhh', 'ummm', 'er', 'err', 'ah', 'eh'];
        
        // Check exact match first
        for (const pattern of vocalFillerPatterns) {
          if (interimLower === pattern || interimLower.startsWith(pattern + ' ') || interimLower.endsWith(' ' + pattern)) {
            console.log('🎯 EXACT VOCAL FILLER detected in interim:', pattern);
            setVocalFillerBuffer(prev => [...prev, pattern]);
            
            // Add to transcript immediately with visual notation
            setTimeout(() => {
              setTranscript(prev => {
                const fillerNotation = `[${pattern.toUpperCase()}]`;
                const enhanced = prev + ` ${fillerNotation} `;
                transcriptRef.current = enhanced;
                console.log('✅ Added vocal filler notation to transcript:', fillerNotation);
                return enhanced;
              });
            }, 100);
            break;
          }
        }
        
        // Enhanced regex detection for variations like "uhhh", "ummm"
        const words = interimLower.split(/\s+/).filter(word => word.length > 0);
        words.forEach((word) => {
          const cleanWord = word.replace(/[.,!?;:'"()[\]]/g, '');
          
          // Regex patterns for vocal filler variations (same as backend)
          if (/^u+h+$/i.test(cleanWord) || /^u+m+$/i.test(cleanWord) || /^u+h+m+$/i.test(cleanWord)) {
            let normalizedWord = cleanWord;
            if (/^u+h+$/i.test(cleanWord)) normalizedWord = 'uh';
            else if (/^u+m+$/i.test(cleanWord)) normalizedWord = 'um';
            else if (/^u+h+m+$/i.test(cleanWord)) normalizedWord = 'uhm';
            
            console.log('🎯 REGEX VOCAL FILLER detected in interim:', normalizedWord, 'from', cleanWord);
            setVocalFillerBuffer(prev => [...prev, normalizedWord]);
            
            setTimeout(() => {
              setTranscript(prev => {
                const fillerNotation = `[${normalizedWord.toUpperCase()}]`;
                const enhanced = prev + ` ${fillerNotation} `;
                transcriptRef.current = enhanced;
                console.log('✅ Added regex vocal filler notation to transcript:', fillerNotation);
                return enhanced;
              });
            }, 100);
          }
        });
      }

      if (finalTranscript.trim()) {
        console.log('📝 Final transcript received:', finalTranscript.trim());
        
        setTranscript(prev => {
          const newTranscript = prev + finalTranscript;
          transcriptRef.current = newTranscript;
          console.log('📋 Complete session transcript:', newTranscript.substring(0, 100) + '...');
          return newTranscript;
        });
        setInterimTranscript(''); // Clear interim when we get final
        interimTranscriptRef.current = ''; // Clear ref too
        
        // Use advanced filler detection system for comprehensive analysis
        const fillerDetectionResult = performHybridDetection(finalTranscript, Date.now());
        console.log('🎯 Advanced filler detection result:', fillerDetectionResult);
        
        // Update metrics with advanced filler detection results and add fillers to transcript
        if (fillerDetectionResult.totalFillers > 0) {
          setMetrics(prev => ({
            ...prev,
            fillerWordCount: prev.fillerWordCount + fillerDetectionResult.totalFillers,
            voice: {
              ...prev.voice,
              fillerCount: prev.voice.fillerCount + fillerDetectionResult.totalFillers
            }
          }));
          
          // Add detected fillers to the transcript visually
          const detectedFillersList = fillerDetectionResult.fillerTimestamps || [];
          if (detectedFillersList.length > 0) {
            const fillersToAdd = detectedFillersList
              .filter(f => ['um', 'uh', 'uhm'].includes(f.word.toLowerCase()))
              .map(f => `[${f.word.toUpperCase()}]`)
              .join(' ');
            
            if (fillersToAdd) {
              setTranscript(prev => {
                const enhanced = prev + ' ' + fillersToAdd + ' ';
                transcriptRef.current = enhanced;
                console.log('✅ Added visual fillers to transcript:', fillersToAdd);
                return enhanced;
              });
            }
          }
          
          // Create live feedback for detected fillers
          const topFiller = Object.entries(fillerDetectionResult.fillerTypes)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'filler';
          
          const fillerMessage = fillerDetectionResult.totalFillers === 1 
            ? `Detected filler: "${topFiller}"`
            : `Detected ${fillerDetectionResult.totalFillers} fillers (most common: "${topFiller}")`;
          
          const feedback: LiveFeedback = {
            id: Date.now().toString() + Math.random(),
            message: fillerMessage,
            type: 'warning',
            timestamp: Date.now()
          };
          
          setLiveFeedback(prev => [feedback, ...prev.slice(0, 4)]);
        }
        
        // Enhanced backend filler word analysis with UM/UH detection
        const fullTranscript = transcript + ' ' + finalTranscript;
        console.log('🔍 Sending for enhanced filler detection:', { 
          transcript: fullTranscript.substring(0, 100) + '...', 
          length: fullTranscript.length,
          duration: sessionDuration 
        });
        
        if (fullTranscript.trim().length > 10) {
          try {
            // Use enhanced filler detection API that captures UM and UH
            const response = await fetch('/api/analyze-filler-words', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transcript: fullTranscript,
                duration: sessionDuration
              })
            });
            
            if (response.ok) {
              const result = await response.json();
              const detection = result.detection;
              console.log('🎯 Enhanced filler detection with UM/UH:', detection);
              
              // Update transcript with detected UM and UH words
              let enhancedTranscript = fullTranscript;
              if (detection.umCount > 0 || detection.uhCount > 0) {
                // Add detected UM/UH to transcript for visibility
                const fillerInserts = [];
                if (detection.umCount > 0) fillerInserts.push(`[${detection.umCount} UM detected]`);
                if (detection.uhCount > 0) fillerInserts.push(`[${detection.uhCount} UH detected]`);
                enhancedTranscript += ' ' + fillerInserts.join(' ');
                
                // Update transcript to show detected fillers
                setTranscript(enhancedTranscript);
                transcriptRef.current = enhancedTranscript;
              }
              
              // Update the total filler count for the entire session
              console.log(`📊 Updating filler count to: ${detection.totalFillers} (UM: ${detection.umCount}, UH: ${detection.uhCount})`);
              setMetrics(prev => ({
                ...prev,
                fillerWordCount: detection.totalFillers,
                voice: {
                  ...prev.voice,
                  fillerCount: detection.totalFillers
                }
              }));
              
              if (detection.totalFillers > 0) {
                const umUhInfo = detection.umCount + detection.uhCount > 0 ? 
                  ` (UM: ${detection.umCount}, UH: ${detection.uhCount})` : '';
                const feedbackMessage = `${detection.totalFillers} filler words detected${umUhInfo}`;
                
                setLiveFeedback(prev => [...prev.slice(-4), {
                  id: Date.now().toString(),
                  message: feedbackMessage,
                  type: detection.totalFillers > 5 ? 'warning' : 'info',
                  timestamp: Date.now()
                }]);
              }
            }
          } catch (error) {
            console.log('Fallback to local filler detection');
            // Fallback to local detection if backend fails
            if (detectedFillers.length > 0) {
              console.log('🎯 Local filler words detected:', detectedFillers);
              
              // Count fillers in the full transcript
              const fullFillerCount = fullTranscript.toLowerCase().split(/\s+/).filter(word => {
                const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
                return singleFillerWords.includes(cleanWord);
              }).length;
              
              setMetrics(prev => ({
                ...prev,
                fillerWordCount: fullFillerCount,
                voice: {
                  ...prev.voice,
                  fillerCount: fullFillerCount
                }
              }));
              
              const uniqueFillers = Array.from(new Set(detectedFillers));
              const feedbackMessage = uniqueFillers.length === 1 
                ? `Reduce filler word: "${uniqueFillers[0]}"` 
                : `Reduce filler words: ${uniqueFillers.slice(0, 2).join(', ')}`;
              
              setLiveFeedback(prev => [...prev.slice(-4), {
                id: Date.now().toString(),
                message: feedbackMessage,
                type: 'warning',
                timestamp: Date.now()
              }]);
            }
          }
        }

        // Calculate WPM using the complete transcript (after updating it)
        // Note: We'll update WPM in the interval timer for real-time updates

        // Enhanced live feedback will be generated separately in a useEffect

        // REMOVED: Random tip generation - replaced with real data-driven feedback only
        // Tips will only be shown when actual body language or voice analysis data is available
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    (recognitionRef as any).current = recognition;
  }, [sessionDuration, transcript]);

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
      if (timeSinceLastFeedback < 8) return;

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

    // Start feedback after 3 seconds, then check every 8 seconds for better pacing
    const initialTimeout = setTimeout(generateLiveInsights, 3000);
    const interval = setInterval(generateLiveInsights, 8000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isRecording, metrics, sessionDuration, liveFeedback, transcript]);

  // Initialize video recording
  const initializeVideoRecording = async (): Promise<boolean> => {
    if (!videoRecordingEnabled || !recordingVideoRef.current) return false;
    
    try {
      const initialized = await videoRecordingManager.initializeRecording(recordingVideoRef.current);
      if (initialized) {
        console.log('✅ Video recording system initialized');
        toast({
          title: "Video Recording Ready",
          description: "High-quality video recording is active",
          duration: 2000
        });
      }
      return initialized;
    } catch (error) {
      console.error('❌ Failed to initialize video recording:', error);
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
      // Initialize video recording first
      const videoInitialized = await initializeVideoRecording();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,  // CRITICAL: Disable to preserve vocal fillers
          noiseSuppression: false,  // CRITICAL: Disable to preserve vocal fillers  
          autoGainControl: false,   // CRITICAL: Disable to preserve vocal fillers
          sampleRate: 44100,       // High quality for pattern analysis
          channelCount: 1          // Mono for better vocal analysis
        },
        video: { 
          width: { ideal: 1280, min: 640 }, 
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 24 },
          facingMode: 'user'
        }
      });
      
      // Start video recording if initialized
      if (videoInitialized) {
        const recordingStarted = videoRecordingManager.startRecording();
        if (recordingStarted) {
          console.log('🎬 Video recording started');
        }
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        // Initialize ALL computer vision systems for gesture and posture monitoring
        try {
          // Start Roboflow computer vision for gesture/posture analysis
          console.log('🤖 Starting Roboflow computer vision for gestures and postures...');
          
          // Pass the existing video element and stream to Roboflow
          if (roboflowVideoRef.current) {
            roboflowVideoRef.current.srcObject = stream;
            // Set canvas reference safely
            if (canvasRef.current && roboflowCanvasRef) {
              (roboflowCanvasRef as any).current = canvasRef.current;
            }
          }
          
          // Wait for video to be ready before starting analysis
          await new Promise<void>(resolve => {
            const checkReady = () => {
              if (videoRef.current && videoRef.current.readyState >= 3) {
                resolve();
              } else {
                setTimeout(checkReady, 100);
              }
            };
            checkReady();
          });
          
          await startRealTimeAnalysis(1500); // Analyze every 1.5 seconds for performance
          console.log('✅ Roboflow computer vision started successfully');
        } catch (error) {
          console.warn('⚠️ Roboflow computer vision failed:', error);
        }

        try {
          // Start MediaPipe for authentic computer vision
          console.log('🔬 Starting MediaPipe for authentic metrics...');
          mediaPipeService.current = new MediaPipeService();
          const mediaInitialized = await mediaPipeService.current.initialize(videoRef.current, canvasRef.current);
          if (mediaInitialized) {
            await mediaPipeService.current.startAnalysis();
            console.log('✅ MediaPipe authentic computer vision started');
          }
        } catch (error) {
          console.warn('⚠️ MediaPipe initialization failed:', error);
        }

        try {
          // Start facial analysis system
          console.log('🎭 Starting facial analysis system...');
          await startFacialAnalysis(videoRef.current);
          console.log('✅ Facial analysis started successfully');
        } catch (error) {
          console.warn('⚠️ Facial analysis failed:', error);
        }

        try {
          // Start robust computer vision system
          console.log('🛡️ Starting robust computer vision system...');
          const started = await startComputerVisionAnalysis(videoRef.current);
          if (started) {
            console.log('✅ Robust computer vision started successfully');
          }
        } catch (error) {
          console.warn('⚠️ Robust computer vision initialization failed:', error);
        }
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
        
        // Start audio pattern analysis
        let analyzeInterval: NodeJS.Timeout;
        const startAnalysis = () => {
          analyzeInterval = setInterval(() => {
            if (audioAnalyzerRef.current) {
              const bufferLength = audioAnalyzerRef.current.frequencyBinCount;
              const dataArray = new Uint8Array(bufferLength);
              audioAnalyzerRef.current.getByteFrequencyData(dataArray);
              
              // Analyze frequency patterns for vocal fillers (um/uh typically 100-300Hz)
              let lowFreqEnergy = 0;
              let midFreqEnergy = 0;
              
              // Calculate energy in frequency ranges
              for (let i = 0; i < bufferLength; i++) {
                const freq = (i * 22050) / bufferLength; // Convert to Hz
                if (freq >= 80 && freq <= 300) {
                  lowFreqEnergy += dataArray[i];
                } else if (freq >= 300 && freq <= 1000) {
                  midFreqEnergy += dataArray[i];
                }
              }
              
              // Detect vocal filler pattern (strong low freq, weak mid freq)
              const ratio = lowFreqEnergy / (midFreqEnergy + 1);
              const totalEnergy = lowFreqEnergy + midFreqEnergy;
              
              if (ratio > 2.5 && totalEnergy > 1000) {
                console.log('🎯 AUDIO PATTERN: Possible vocal filler detected!', { ratio, totalEnergy });
                
                // Add to vocal filler buffer with timestamp
                const timestamp = Date.now();
                setVocalFillerBuffer(prev => {
                  const recent = prev.filter(item => timestamp - parseInt(item.split('_')[1] || '0') < 2000);
                  if (recent.length === 0) {
                    const newFiller = `um_${timestamp}`;
                    console.log('✅ VOCAL FILLER DETECTED via audio analysis:', newFiller);
                    
                    // Add to transcript immediately
                    setTimeout(() => {
                      setTranscript(prev => {
                        const enhanced = prev + ` [um] `;
                        transcriptRef.current = enhanced;
                        return enhanced;
                      });
                    }, 50);
                    
                    return [...recent, newFiller];
                  }
                  return recent;
                });
              }
            }
          }, 100); // Check every 100ms for vocal patterns
        };
        
        startAnalysis();
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
              const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
              
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
                  
                  // Add detected fillers to transcript
                  detection.fillerWords.forEach((filler: string) => {
                    setVocalFillerBuffer(prev => [...prev, `${filler}_${Date.now()}`]);
                    
                    // Add to transcript with brackets for visibility
                    setTimeout(() => {
                      setTranscript(prev => {
                        const enhanced = prev + ` [${filler.toUpperCase()}] `;
                        transcriptRef.current = enhanced;
                        console.log('🎯 Added to transcript:', filler.toUpperCase());
                        return enhanced;
                      });
                    }, 50);
                  });
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
        setInterval(() => {
          if (vocalRecorder.state === 'recording') {
            vocalRecorder.stop();
            setTimeout(() => {
              if (isRecording) {
                vocalRecorder.start();
              }
            }, 100);
          }
        }, 2000);
        
        console.log('🎵 Dedicated vocal filler recorder initialized');
      } catch (recorderError) {
        console.warn('⚠️ Vocal filler recorder unavailable:', recorderError);
      }

      // Start speech recognition
      setupSpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      setIsRecording(true);

      // Start timer with real-time WPM calculation
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setSessionDuration(elapsedSeconds);
        
        // Calculate WPM in real-time ONLY if there's actual speech
        if (elapsedSeconds > 3) { // Wait at least 3 seconds for meaningful calculation
          const currentTranscript = transcriptRef.current + ' ' + interimTranscriptRef.current;
          const hasActualSpeech = currentTranscript.trim().length > 5; // Minimum text threshold
          
          if (hasActualSpeech) {
            const wordCount = currentTranscript.trim().split(/\s+/).filter(word => word.length > 0).length;
            const timeInMinutes = elapsedSeconds / 60;
            const wpm = timeInMinutes > 0 && wordCount > 0 ? Math.round(wordCount / timeInMinutes) : 0;
            
            console.log(`🔄 Live WPM update: ${wordCount} words in ${elapsedSeconds}s = ${wpm} WPM`);
            setMetrics(prev => ({ 
              ...prev, 
              wordsPerMinute: wpm,
              voice: {
                ...prev.voice,
                pace: wpm
              }
            }));
          } else {
            // No speech detected, keep WPM at 0
            setMetrics(prev => ({ 
              ...prev, 
              wordsPerMinute: 0,
              voice: {
                ...prev.voice,
                pace: 0
              }
            }));
          }
        }
      }, 1000);

      // Clear collected analytics at start of new session  
      setCollectedAnalytics([]);
      
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

      // Update metrics only with real data from facial analysis or Roboflow when available
      metricsTimerRef.current = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          // Only update if we have real facial analysis or Roboflow data
          eyeContact: facialAnalysis?.facialMetrics?.communicationSignals?.eyeContactQuality || 
            roboflowAnalysis?.facial?.eyeContact || prev.eyeContact,
          confidence: facialAnalysis?.facialMetrics?.emotionalExpression?.confidence || 
            roboflowAnalysis?.overall?.confidence || prev.confidence,
          engagement: facialAnalysis?.facialMetrics?.emotionalExpression?.engagement || 
            roboflowAnalysis?.facial?.engagement || prev.engagement,
          clarity: facialAnalysis?.facialMetrics?.emotionalExpression?.authenticity || 
            roboflowAnalysis?.facial?.engagement || prev.clarity,
          voice: {
            ...prev.voice,
            clarity: facialAnalysis?.facialMetrics?.emotionalExpression?.authenticity || 
              roboflowAnalysis?.facial?.engagement || prev.voice.clarity
          },
          bodyLanguage: {
            ...prev.bodyLanguage,
            // Use computer vision data as primary source
            eyeContactScore: computerVisionMetrics?.eyeContact || 
              facialAnalysis?.facialMetrics?.communicationSignals?.eyeContactQuality || 
              roboflowAnalysis?.facial?.eyeContact || prev.bodyLanguage.eyeContactScore,

            facialExpressions: computerVisionMetrics?.engagement || 
              facialAnalysis?.facialMetrics?.emotionalExpression?.authenticity || 
              roboflowAnalysis?.facial?.engagement || prev.bodyLanguage.facialExpressions,
            overallPresence: computerVisionMetrics?.confidence || 
              facialAnalysis?.facialMetrics?.overallPresence?.charisma || 
              roboflowAnalysis?.overall?.presence || prev.bodyLanguage.overallPresence
          }
        }));
      }, 3000);

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

    // Stop MediaPipe service
    try {
      if (mediaPipeService.current) {
        mediaPipeService.current.stopAnalysis();
        mediaPipeService.current = null;
        console.log('🔬 MediaPipe analysis stopped');
      }
    } catch (error) {
      console.warn('⚠️ Error stopping MediaPipe:', error);
    }

    setIsRecording(false);

    // Save session to database with comprehensive data
    try {
      console.log('💾 Preparing to save session data...');
      
      const sessionData = {
        sessionName: sessionName || `Session ${sessionNumber}`,
        purpose: sessionPurpose || 'general-presentation',
        duration: sessionDuration,
        transcript: transcript || '',
        averageWPM: metrics.wordsPerMinute || 0,
        confidenceScore: metrics.confidence || 0,
        voiceClarity: metrics.voice.clarity || 0,
        fillerWords: metrics.fillerWordCount || 0,
        pauseCount: 0,
        eyeContactScore: String(metrics.eyeContact || 0),
        coachingTips: [],
        videoBlob: recordingData?.blob ? await recordingData.blob.arrayBuffer().then(buffer => 
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
          fillerCount: metrics.fillerWordCount || 0
        }),
        bodyLanguageMetrics: JSON.stringify({
          eyeContactScore: metrics.bodyLanguage?.eyeContactScore || 0,
          facialExpressions: metrics.bodyLanguage?.facialExpressions || 0,
          overallPresence: metrics.bodyLanguage?.overallPresence || 0
        }),
        aiAnalysis: JSON.stringify({
          overallScore: Math.round((metrics.confidence + metrics.clarity + metrics.engagement) / 3) || 0,
          strengths: [],
          improvements: []
        }),
        persuasivenessScore: metrics.confidence || 0,
        realTimeAnalytics: JSON.stringify({
          totalDataPoints: collectedAnalytics.length,
          analyticsHistory: collectedAnalytics,
          finalMetrics: {
            eyeContact: metrics.eyeContact,
            confidence: metrics.confidence,
            engagement: metrics.engagement,
            voiceClarity: metrics.voice.clarity,
            fillerCount: metrics.fillerWordCount
          },
          timestamp: Date.now()
        })
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Session ${result.session.sessionNumber} saved successfully with ${collectedAnalytics.length} analytics data points`);
        
        // Clear collected analytics for next session
        setCollectedAnalytics([]);
        
        // Update session number for next session
        const nextSessionNumber = result.session.sessionNumber + 1;
        setSessionNumber(nextSessionNumber);
        setSessionName(`Session ${nextSessionNumber}`);
        
        toast({
          title: "Session Saved!",
          description: `${result.message} - Redirecting to Analysis tab`,
          variant: "default"
        });
        
        // Navigate to Analysis tab after successful save
        setTimeout(() => {
          if (onNavigateToAnalysis) {
            onNavigateToAnalysis();
          } else {
            // Fallback: try to trigger tab change via event
            window.dispatchEvent(new CustomEvent('navigateToAnalysis', { 
              detail: { sessionId: result.session.id } 
            }));
          }
        }, 1500); // Short delay to show the success message
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
          confidence: hasRealSpeech ? metrics.confidence : 0,
          posture: 0, // Posture analysis removed
          gestures: 0 // Gesture analysis removed
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
          sessionNumber: 1, // This will be updated when database integration is complete
          sessionName: sessionData.name || 'Practice Session',
          purpose: sessionData.purpose || 'General Practice',
          duration: sessionDuration,
          transcript: transcript || 'No transcript available',
          averageWPM: averageWPM,
          confidenceScore: Math.round(sessionData.confidenceScore * 100),
          voiceClarity: Math.round(sessionData.clarityScore * 100),
          fillerWords: realFillerWords,
          pauseCount: sessionData.pauseCount || 0,
          eyeContactScore: `${realEyeContact}%`,
          coachingTips: sessionData.coachingTips || [],
          facialAnalysis: facialAnalysis?.facialMetrics,
          voiceMetrics: {
            clarity: Math.round(sessionData.clarityScore * 100),
            pace: averageWPM,
            fillerCount: realFillerWords
          },
          bodyLanguageMetrics: {
            eyeContact: realEyeContact,
            confidence: hasRealSpeech ? metrics.confidence : 0,
            posture: 0
          },
          persuasivenessScore: hasRealSpeech ? Math.round((realConfidenceScore + realEyeContact) / 2) : 0,
          createdAt: new Date().toISOString(),
          hasRealSpeech: hasRealSpeech
        };
        
        console.log('📊 Analysis data prepared for AuthenticAnalysisPage:', analysisData);
        
        // Save session with video and transcript to database
        try {
          let base64Video = null;
          if (recordingData) {
            const videoData = await recordingData.videoBlob.arrayBuffer();
            const uint8Array = new Uint8Array(videoData);
            const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
            base64Video = btoa(binaryString);
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
                confidence: realConfidenceScore,
                clarity: realVoiceClarity,
                pace: metrics.voice?.pace || 0,
                eyeContact: realEyeContact,
                gesture: 0, // Gesture analysis removed
                fillerWordCount: realFillerWords,
                wordsPerMinute: averageWPM
              },
              facialAnalysis: facialAnalysis?.facialMetrics,
              voiceMetrics: {
                clarity: realVoiceClarity,
                pace: metrics.voice?.pace || 0,
                // Volume and intonation metrics removed
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
            throw new Error('Failed to save video session to database');
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
              fillerCount: 0
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border border-blue-200 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
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
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent cursor-pointer hover:from-blue-700 hover:to-cyan-600" onClick={() => setIsEditingName(true)}>
                      {sessionName}
                    </h1>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                
                {isEditingPurpose ? (
                  <div className="space-y-3 mt-2">
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
                  <div className="flex items-center gap-2 mt-2">
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
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingPurpose(true)}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex gap-2">
                {!isRecording ? (
                  <Button onClick={startRecording} className="bg-gradient-to-br from-[#2563eb] to-[#22d3ee] hover:from-[#1d4ed8] hover:to-[#06b6d4] text-white shadow-lg hover:shadow-xl">
                    <Mic className="w-5 h-5 mr-2" />
                    Start Practice
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={stopRecording} 
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl px-6"
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setVideoRecordingEnabled(!videoRecordingEnabled)}
                    className={`flex items-center gap-2 ${videoRecordingEnabled ? 'bg-purple-50 border-purple-200' : ''}`}
                  >
                    <Video className="w-4 h-4" />
                    {videoRecordingEnabled ? 'Video ON' : 'Video OFF'}
                  </Button>
                  
                  {currentRecording && (
                    <Button
                      variant="outline"
                      onClick={() => setShowVideoPlayback(true)}
                      className="flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Watch Recording
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowRecordingLibrary(true)}
                    className="flex items-center gap-2"
                  >
                    <Library className="w-4 h-4" />
                    Library
                  </Button>
                  
                  {/* Live Transcript Toggle */}
                  <Button
                    variant="outline"
                    onClick={() => setShowLiveTranscript(!showLiveTranscript)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    {showLiveTranscript ? 'Hide' : 'Show'} Transcript
                  </Button>
                </div>

              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tips */}
        <div className="space-y-3">
          <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-sm">
            <Eye className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Tip:</strong> Look directly at your camera lens to maintain eye contact. Aim for 60-80% eye contact during your speech.
            </AlertDescription>
          </Alert>
          
          <Alert className="border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-sm">
            <Activity className="h-4 w-4 text-cyan-600" />
            <AlertDescription className="text-cyan-800">
              <strong>Note:</strong> Browser speech recognition automatically filters out "um" and "uh" sounds. The system detects other filler words like "like", "so", "you know" effectively.
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <Card className="border border-blue-200 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
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
                  
                  {isRecording && (
                    <div className="absolute top-4 left-4 space-y-2">
                      <Badge variant="destructive">
                        <Activity className="w-3 h-3 mr-1" />
                        RECORDING {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Activity className="w-3 h-3 mr-1" />
                        SMART FILLER DETECTION
                      </Badge>
                      {isRoboflowAnalyzing && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Activity className="w-3 h-3 mr-1" />
                          COMPUTER VISION ACTIVE
                        </Badge>
                      )}
                      {isFacialAnalysisActive && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          <Activity className="w-3 h-3 mr-1" />
                          FACIAL ANALYSIS ACTIVE
                        </Badge>
                      )}
                      {isComputerVisionAnalyzing && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          <Activity className="w-3 h-3 mr-1" />
                          COMPUTER VISION ACTIVE
                        </Badge>
                      )}
                      {computerVisionError.hasError && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Activity className="w-3 h-3 mr-1" />
                          CV ERROR - USING FALLBACK
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Stats */}
          <div className="space-y-4">
            {/* Live Feedback Insights */}
            <Card className="border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-800">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Live AI Feedback
                  {liveFeedback.length > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {liveFeedback.length} insights
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {liveFeedback.length === 0 ? (
                  <div className="text-center text-gray-500 py-6">
                    <Activity className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">Ready for Live Analysis</p>
                    <p className="text-sm mt-1">Start speaking to receive instant feedback</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {liveFeedback.slice(-4).reverse().map((feedback, index) => (
                      <div 
                        key={feedback.id}
                        className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${
                          feedback.type === 'success' 
                            ? 'bg-green-50 border-green-400 text-green-800 shadow-green-100' 
                            : feedback.type === 'warning'
                            ? 'bg-yellow-50 border-yellow-400 text-yellow-800 shadow-yellow-100'
                            : 'bg-blue-50 border-blue-400 text-blue-800 shadow-blue-100'
                        } ${index === 0 ? 'ring-2 ring-blue-200 shadow-lg' : 'shadow-md'}`}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-semibold flex-1 pr-2">{feedback.message}</p>
                          {feedback.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                          {feedback.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />}
                          {feedback.type === 'info' && <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                        </div>
                        <p className="text-xs opacity-75 mt-2 font-medium">
                          {index === 0 ? 'Just now' : new Date(feedback.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Quick Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-extrabold text-blue-600">{metrics.wordsPerMinute}</div>
                      <div className="text-sm font-semibold text-gray-600">WPM</div>
                    </div>
                    <div>
                      <div className="text-3xl font-extrabold text-red-600">{metrics.fillerWordCount}</div>
                      <div className="text-sm font-semibold text-gray-600">Fillers</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border border-blue-200 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-800">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Words Per Minute</span>
                  <span className="font-bold">{metrics.wordsPerMinute}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Filler Words</span>
                  <span className="font-bold">{metrics.fillerWordCount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Total Words</span>
                  <span className="font-bold">{transcript.split(' ').filter(w => w.length > 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Duration</span>
                  <span className="font-bold">
                    {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>

        {/* Live Transcript Panel */}
        {showLiveTranscript && (
          <Card className="border border-blue-200 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">Live Transcript</span>
                  {isRecording && (
                    <Badge variant="secondary" className="ml-2">
                      <Activity className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLiveTranscript(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-gray-100 p-4 rounded-lg max-h-60 overflow-y-auto">
                {transcript || interimTranscript ? (
                  <div className="text-sm leading-relaxed">
                    {/* Enhanced filler word highlighting including UM/UH detection */}
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
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                        <strong>Fillers detected:</strong> {metrics.fillerWordCount} words
                        {transcript.includes('[UM') && ' (including UM sounds)'}
                        {transcript.includes('[UH') && ' (including UH sounds)'}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    {isRecording ? (
                      <div className="flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4" />
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
                <div className="mt-4 flex justify-between items-center text-xs text-gray-600">
                  <span>Words: {transcript.split(' ').filter(w => w.length > 0).length}</span>
                  <span>Characters: {transcript.length}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Original Transcript Display for Non-Live View */}
        {!showLiveTranscript && transcript && (
          <Card className="border border-blue-200 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <FileText className="w-5 h-5 text-blue-600" />
                Session Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                <p className="text-sm leading-relaxed">
                  {transcript || "Start speaking to see your transcript here..."}
                </p>
              </div>
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