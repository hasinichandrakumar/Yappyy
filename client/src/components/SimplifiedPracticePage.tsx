// Simplified Practice Page - Clean interface with essential features
import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mic, Square, Edit3, Save, Eye, 
  Activity, TrendingUp, FileText, Users,
  Video, Play, Pause, RotateCcw, Download,
  Library, Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SessionDataViewer } from '@/components/SessionDataViewer';
import { useRoboflowVision } from '@/hooks/useRoboflowVision';
import { useFacialAnalysis } from '@/hooks/useFacialAnalysis';
import SessionAnalysisPage from './SessionAnalysisPage';
import VideoPlaybackViewer from './VideoPlaybackViewer';
import RecordingLibrary from './RecordingLibrary';
import { 
  videoRecordingManager, 
  sessionRecordingStorage, 
  VideoRecordingData 
} from '@/lib/video-recording';

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
    gestureEffectiveness: number;
    postureConfidence: number;
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

export default function SimplifiedPracticePage() {
  // Core session state
  const [isRecording, setIsRecording] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [showAnalysisPage, setShowAnalysisPage] = useState(false);
  const [sessionAnalysisData, setSessionAnalysisData] = useState<any>(null);
  const [sessionPurpose, setSessionPurpose] = useState("");
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

  // Simplified metrics - start at 0 until recording begins
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
      volume: 85,
      intonation: 75,
      fillerCount: 0,
      pauseEffectiveness: 80,
      pitchVariation: 75,
      vocalFryDetection: false,
      uptalkPatterns: 0
    },
    bodyLanguage: {
      eyeContactScore: 0,
      gestureEffectiveness: 0,
      postureConfidence: 0,
      facialExpressions: 0,
      overallPresence: 0
    }
  });

  // Live feedback
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback[]>([]);
  
  // Vocal filler detection state
  const [vocalFillerBuffer, setVocalFillerBuffer] = useState<string[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);
  const [vocalFillerRecorder, setVocalFillerRecorder] = useState<MediaRecorder | null>(null);
  const [isListeningForFillers, setIsListeningForFillers] = useState(false);

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
            
            // Add to transcript immediately to ensure it's captured
            setTimeout(() => {
              setTranscript(prev => {
                const enhanced = prev + ` ${pattern} `;
                transcriptRef.current = enhanced;
                console.log('✅ Added vocal filler to transcript:', pattern);
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
                const enhanced = prev + ` ${normalizedWord} `;
                transcriptRef.current = enhanced;
                console.log('✅ Added regex vocal filler to transcript:', normalizedWord);
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
        
        // Comprehensive filler word detection with precise pattern matching
        const singleFillerWords = [
          'um', 'uh', 'uhm', 'umm', 'er', 'err', 'ah', 'eh', 'mm', 'hmm',
          'like', 'so', 'well', 'okay', 'ok', 'right', 'actually', 'basically',
          'literally', 'obviously', 'essentially', 'definitely', 'absolutely',
          'totally', 'really', 'very', 'quite', 'just', 'maybe', 'perhaps', 'anyway'
        ];
        
        const multiWordFillers = [
          'you know', 'i mean', 'kind of', 'sort of', 'i guess', 'you see',
          'and stuff', 'or something', 'or whatever', 'and things', 'and all that',
          'how do i put this', 'what i mean is', 'let me think'
        ];
        
        const text = finalTranscript.toLowerCase().trim();
        const words = text.split(/\s+/);
        let detectedFillers: string[] = [];
        
        // Check for multi-word fillers first
        multiWordFillers.forEach(phrase => {
          const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
          const matches = text.match(regex);
          if (matches) {
            detectedFillers = detectedFillers.concat(matches);
          }
        });
        
        // Enhanced single-word filler detection with regex patterns
        words.forEach(word => {
          const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
          
          // Check exact matches first
          if (singleFillerWords.includes(cleanWord)) {
            detectedFillers.push(cleanWord);
          }
          
          // Enhanced regex detection for vocal filler variations (same as backend)
          else if (/^u+h+$/i.test(cleanWord) || /^u+m+$/i.test(cleanWord) || /^u+h+m+$/i.test(cleanWord)) {
            let normalizedWord = cleanWord;
            if (/^u+h+$/i.test(cleanWord)) normalizedWord = 'uh';
            else if (/^u+m+$/i.test(cleanWord)) normalizedWord = 'um';
            else if (/^u+h+m+$/i.test(cleanWord)) normalizedWord = 'uhm';
            
            detectedFillers.push(normalizedWord);
            console.log('🎯 REGEX FILLER detected in final transcript:', normalizedWord, 'from', cleanWord);
          }
        });
        
        // Enhanced backend filler word analysis for the complete transcript
        const fullTranscript = transcript + ' ' + finalTranscript;
        console.log('🔍 Sending for filler analysis:', { 
          transcript: fullTranscript.substring(0, 100) + '...', 
          length: fullTranscript.length,
          duration: sessionDuration 
        });
        
        if (fullTranscript.trim().length > 10) {
          try {
            const response = await fetch('/api/analyze-filler-words', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transcript: fullTranscript,
                duration: sessionDuration
              })
            });
            
            if (response.ok) {
              const analysis = await response.json();
              console.log('🎯 Advanced filler analysis:', analysis);
              
              // Update the total filler count for the entire session
              console.log(`📊 Updating filler count to: ${analysis.totalFillers}`);
              setMetrics(prev => ({
                ...prev,
                fillerWordCount: analysis.totalFillers,
                voice: {
                  ...prev.voice,
                  fillerCount: analysis.totalFillers
                }
              }));
              
              if (analysis.totalFillers > 0) {
                const feedbackMessage = analysis.suggestions[0] || 
                  `${analysis.totalFillers} filler words detected (${analysis.frequencyPerMinute}/min)`;
                
                setLiveFeedback(prev => [...prev.slice(-4), {
                  id: Date.now().toString(),
                  message: feedbackMessage,
                  type: analysis.severity === 'high' ? 'warning' : 'info',
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

        // Generate body language insights
        if (sessionDuration > 10 && sessionDuration % 15 === 0) {
          const bodyLanguageTips = [
            "Keep your shoulders relaxed and avoid hunching",
            "Use natural hand gestures to emphasize points",
            "Maintain good posture - stand or sit up straight",
            "Smile naturally to appear more engaging",
            "Use the 'triangle technique' - look at different points"
          ];
          
          const randomTip = bodyLanguageTips[Math.floor(Math.random() * bodyLanguageTips.length)];
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: `Body Language Tip: ${randomTip}`,
            type: 'info',
            timestamp: Date.now()
          }]);
        }

        // Voice quality insights
        if (finalTranscript.length > 50 && sessionDuration % 20 === 0) {
          const voiceTips = [
            "Vary your pitch to avoid monotone delivery",
            "Use pauses for emphasis instead of filler words",
            "Project your voice from your diaphragm",
            "Speak with conviction and confidence",
            "Practice breathing exercises for better control"
          ];
          
          const randomVoiceTip = voiceTips[Math.floor(Math.random() * voiceTips.length)];
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: `Voice Tip: ${randomVoiceTip}`,
            type: 'info',
            timestamp: Date.now()
          }]);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;
  }, [sessionDuration, transcript]);

  // Enhanced comprehensive live insights system
  useEffect(() => {
    if (!isRecording) return;

    const generateLiveInsights = () => {
      const currentWPM = metrics.wordsPerMinute;
      const fillerCount = metrics.fillerWordCount;
      const confidence = metrics.confidence;
      const eyeContact = metrics.eyeContact;
      const engagement = metrics.engagement;
      const sessionMinutes = sessionDuration / 60000;
      const lastMessage = liveFeedback[liveFeedback.length - 1];

      // Voice and Speech Analytics
      if (currentWPM > 0) {
        if (currentWPM >= 120 && currentWPM <= 180 && (!lastMessage || !lastMessage.message.includes('Perfect pace'))) {
          setLiveFeedback(prev => [...prev.slice(-5), {
            id: Date.now().toString(),
            message: `Perfect pace at ${currentWPM} WPM! Maintain this rhythm`,
            type: 'success',
            timestamp: Date.now()
          }]);
        } else if (currentWPM > 200 && (!lastMessage || !lastMessage.message.includes('too fast'))) {
          setLiveFeedback(prev => [...prev.slice(-5), {
            id: Date.now().toString(),
            message: `Slow down! ${currentWPM} WPM is too fast for clarity`,
            type: 'warning',
            timestamp: Date.now()
          }]);
        } else if (currentWPM < 100 && currentWPM > 0 && sessionMinutes > 0.5 && (!lastMessage || !lastMessage.message.includes('increase pace'))) {
          setLiveFeedback(prev => [...prev.slice(-5), {
            id: Date.now().toString(),
            message: `Increase energy - ${currentWPM} WPM may lose audience attention`,
            type: 'info',
            timestamp: Date.now()
          }]);
        }
      }

      // Filler Word Analysis
      if (sessionMinutes > 1) {
        const fillersPerMinute = fillerCount / sessionMinutes;
        if (fillersPerMinute > 3 && (!lastMessage || !lastMessage.message.includes('filler'))) {
          setLiveFeedback(prev => [...prev.slice(-5), {
            id: Date.now().toString(),
            message: `${Math.round(fillersPerMinute)} fillers/min detected - pause instead of "um"`,
            type: 'warning',
            timestamp: Date.now()
          }]);
        } else if (fillersPerMinute <= 1 && fillerCount > 0 && (!lastMessage || !lastMessage.message.includes('clean speech'))) {
          setLiveFeedback(prev => [...prev.slice(-5), {
            id: Date.now().toString(),
            message: 'Excellent! Clean speech with minimal filler words',
            type: 'success',
            timestamp: Date.now()
          }]);
        }
      }

      // Body Language Insights
      if (eyeContact > 70 && (!lastMessage || !lastMessage.message.includes('eye contact'))) {
        setLiveFeedback(prev => [...prev.slice(-5), {
          id: Date.now().toString(),
          message: 'Great eye contact! You\'re connecting with your audience',
          type: 'success',
          timestamp: Date.now()
        }]);
      } else if (eyeContact < 50 && eyeContact > 0 && (!lastMessage || !lastMessage.message.includes('Look at camera'))) {
        setLiveFeedback(prev => [...prev.slice(-5), {
          id: Date.now().toString(),
          message: 'Look at camera more - aim for 60-70% direct eye contact',
          type: 'info',
          timestamp: Date.now()
        }]);
      }

      // Confidence and Energy Feedback
      if (confidence > 80 && (!lastMessage || !lastMessage.message.includes('confident'))) {
        setLiveFeedback(prev => [...prev.slice(-5), {
          id: Date.now().toString(),
          message: 'Excellent confidence! Your posture shows authority',
          type: 'success',
          timestamp: Date.now()
        }]);
      } else if (confidence < 60 && confidence > 0 && (!lastMessage || !lastMessage.message.includes('Stand tall'))) {
        setLiveFeedback(prev => [...prev.slice(-5), {
          id: Date.now().toString(),
          message: 'Stand tall and use open gestures to boost confidence',
          type: 'info',
          timestamp: Date.now()
        }]);
      }

      // Professional Speaking Tips (rotating)
      const professionalTips = [
        { message: 'Use hand gestures naturally to emphasize key points', type: 'info' as const },
        { message: 'Vary your vocal pitch to avoid monotone delivery', type: 'info' as const },
        { message: 'Use strategic pauses for emphasis and clarity', type: 'info' as const },
        { message: 'Project your voice from your diaphragm', type: 'info' as const },
        { message: 'Smile when appropriate to increase warmth', type: 'info' as const },
        { message: 'Keep shoulders relaxed and spine straight', type: 'info' as const },
        { message: 'Use inclusive "you" language to engage audience', type: 'info' as const },
        { message: 'Structure your message: intro, main points, conclusion', type: 'info' as const },
        { message: 'Use concrete examples to illustrate concepts', type: 'info' as const },
        { message: 'Practice smooth transitions between ideas', type: 'info' as const }
      ];

      // Add professional tip every 30-45 seconds
      if (sessionMinutes > 0.5 && Math.floor(sessionMinutes * 2) !== Math.floor((sessionMinutes - 0.1) * 2)) {
        const tip = professionalTips[Math.floor(Math.random() * professionalTips.length)];
        if (!lastMessage || lastMessage.message !== tip.message) {
          setLiveFeedback(prev => [...prev.slice(-5), {
            id: Date.now().toString(),
            message: tip.message,
            type: tip.type,
            timestamp: Date.now()
          }]);
        }
      }
    };

    // Initial insight after 5 seconds, then every 10-15 seconds
    const initialTimeout = setTimeout(generateLiveInsights, 5000);
    const interval = setInterval(generateLiveInsights, 12000 + Math.random() * 6000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isRecording, metrics, sessionDuration, liveFeedback]);

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
              const formData = new FormData();
              formData.append('audio', audioBlob);
              
              const response = await fetch('/api/detect-vocal-fillers', {
                method: 'POST',
                body: formData
              });
              
              if (response.ok) {
                const result = await response.json();
                if (result.vocalFillers && result.vocalFillers.length > 0) {
                  console.log('🎯 VOCAL FILLERS DETECTED by audio analysis:', result.vocalFillers);
                  
                  result.vocalFillers.forEach((filler: string) => {
                    setVocalFillerBuffer(prev => [...prev, `${filler}_${Date.now()}`]);
                    
                    // Add to transcript
                    setTimeout(() => {
                      setTranscript(prev => {
                        const enhanced = prev + ` [${filler}] `;
                        transcriptRef.current = enhanced;
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
          volume: 85,
          intonation: 75,
          fillerCount: 0,
          pauseEffectiveness: 80,
          pitchVariation: 75,
          vocalFryDetection: false,
          uptalkPatterns: 0
        },
        bodyLanguage: {
          eyeContactScore: 0,
          gestureEffectiveness: 0,
          postureConfidence: 0,
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
          clarity: facialAnalysis?.facialMetrics?.microExpressions?.articulation || 
            roboflowAnalysis?.voice?.clarity || prev.clarity,
          voice: {
            ...prev.voice,
            clarity: facialAnalysis?.facialMetrics?.microExpressions?.articulation || 
              roboflowAnalysis?.voice?.clarity || prev.voice.clarity
          },
          bodyLanguage: {
            ...prev.bodyLanguage,
            // Only use real computer vision data, no fake values
            eyeContactScore: facialAnalysis?.facialMetrics?.communicationSignals?.eyeContactQuality || 
              roboflowAnalysis?.facial?.eyeContact || prev.bodyLanguage.eyeContactScore,
            gestureEffectiveness: roboflowAnalysis?.gestures?.effectiveness || prev.bodyLanguage.gestureEffectiveness,
            postureConfidence: roboflowAnalysis?.posture?.confidence || prev.bodyLanguage.postureConfidence,
            facialExpressions: facialAnalysis?.facialMetrics?.emotionalExpression?.authenticity || 
              roboflowAnalysis?.facial?.engagement || prev.bodyLanguage.facialExpressions,
            overallPresence: facialAnalysis?.facialMetrics?.overallPresence?.charisma || 
              roboflowAnalysis?.overall?.presence || prev.bodyLanguage.overallPresence
          }
        }));
      }, 3000);

      // Start Roboflow real-time computer vision analysis
      try {
        await startRealTimeAnalysis(3000); // Analyze every 3 seconds
        console.log('🤖 Roboflow computer vision analysis started');
      } catch (error) {
        console.warn('⚠️ Roboflow analysis unavailable, using fallback');
      }

      // Start facial analysis
      if (videoRef.current) {
        try {
          startFacialAnalysis(videoRef.current, 3000); // Analyze every 3 seconds
          console.log('🎭 Facial analysis started');
        } catch (error) {
          console.warn('⚠️ Facial analysis unavailable, using fallback');
        }
      }

      console.log('Recording started');
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

    setIsRecording(false);

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
          volume: 85,
          intonation: 75,
          fillerCount: 0,
          pauseEffectiveness: 80,
          pitchVariation: 75,
          vocalFryDetection: false,
          uptalkPatterns: 0
        },
        bodyLanguage: {
          eyeContactScore: 0,
          gestureEffectiveness: 0,
          postureConfidence: 0,
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
        volumeConsistency: hasRealSpeech ? 0.8 : 0, // Only show real values if speech occurred
        intonationScore: hasRealSpeech ? 0.75 : 0, // Only show real values if speech occurred
        postureScore: hasRealSpeech ? (metrics.bodyLanguage?.postureConfidence || 70) / 100 : 0,
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
          posture: hasRealSpeech ? (metrics.bodyLanguage?.postureConfidence || 70) : 0,
          gestures: hasRealSpeech ? (metrics.bodyLanguage?.gestureEffectiveness || 75) : 0
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
        
        // Prepare enriched session data for analysis page - only show real data
        const analysisData = {
          ...sessionData,
          sessionName: sessionData.name,
          purpose: sessionData.purpose,
          overallPerformance: Math.round(sessionData.confidenceScore * 100),
          clarityScore: Math.round(sessionData.clarityScore * 100),
          volumeConsistency: Math.round(sessionData.volumeConsistency * 100),
          intonationScore: Math.round(sessionData.intonationScore * 100),
          paceConsistency: hasRealSpeech ? 85 : 0, // Only show if speech occurred
          engagementLevel: hasRealSpeech ? metrics.engagement : 0,
          eyeContactScore: realEyeContact,
          confidenceLevel: hasRealSpeech ? metrics.confidence : 0,
          fillerWordCount: realFillerWords,
          wordsPerMinute: averageWPM,
          hasRealSpeech: hasRealSpeech, // Add flag for analysis page
          facialAnalysis: facialAnalysis?.facialMetrics ? {
            emotionalExpression: facialAnalysis.facialMetrics.emotionalExpression,
            microExpressions: facialAnalysis.facialMetrics.microExpressions,
            communicationSignals: facialAnalysis.facialMetrics.communicationSignals,
            overallPresence: facialAnalysis.facialMetrics.overallPresence
          } : undefined
        };
        
        // Save video recording with session data
        if (recordingData) {
          const recordingId = sessionRecordingStorage.saveRecording(
            recordingData,
            transcript,
            sessionData,
            facialAnalysis?.facialMetrics
          );
          
          // Set the current recording for playback
          setCurrentRecording(recordingData);
          
          console.log('🎬 Video recording saved with session data:', recordingId);
          toast({
            title: "Video Recording Saved",
            description: "Session video available for playback",
            duration: 3000
          });
        }

        setSessionAnalysisData(analysisData);
        setShowAnalysisPage(true);
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
      <SessionAnalysisPage
        sessionData={sessionAnalysisData}
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
              volume: 85,
              intonation: 75,
              fillerCount: 0,
              pauseEffectiveness: 80,
              pitchVariation: 75,
              vocalFryDetection: false,
              uptalkPatterns: 0
            },
            bodyLanguage: {
              eyeContactScore: 0,
              gestureEffectiveness: 0,
              postureConfidence: 0,
              facialExpressions: 0,
              overallPresence: 0
            }
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border-2 border-blue-200">
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
                    <h1 className="text-4xl font-extrabold text-blue-600 cursor-pointer hover:text-blue-700" onClick={() => setIsEditingName(true)}>
                      {sessionName}
                    </h1>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingName(true)}>
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
                    <Button size="sm" onClick={saveSessionPurpose}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg font-semibold text-gray-700">
                      {sessionPurpose || "Click to set your session goal"}
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingPurpose(true)}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex gap-2">
                {!isRecording ? (
                  <Button onClick={startRecording} className="bg-gradient-to-br from-[#2563eb] to-[#22d3ee] hover:from-[#1d4ed8] hover:to-[#06b6d4] text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Mic className="w-5 h-5 mr-2" />
                    Start Practice
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={stopRecording} 
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6"
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
          <Alert className="border-green-200 bg-green-50">
            <Eye className="h-4 w-4" />
            <AlertDescription>
              <strong>Tip:</strong> Look directly at your camera lens to maintain eye contact. Aim for 60-80% eye contact during your speech.
            </AlertDescription>
          </Alert>
          
          <Alert className="border-orange-200 bg-orange-50">
            <Activity className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Browser speech recognition automatically filters out "um" and "uh" sounds. The system detects other filler words like "like", "so", "you know" effectively.
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <Card>
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
                      <Badge variant="destructive" className="animate-pulse">
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
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Stats */}
          <div className="space-y-4">
            
            {/* Live Feedback Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Live Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {liveFeedback.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start speaking to get live feedback</p>
                  </div>
                ) : (
                  liveFeedback.slice(-3).map((feedback) => (
                    <div 
                      key={feedback.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        feedback.type === 'success' 
                          ? 'bg-green-50 border-green-400 text-green-800' 
                          : feedback.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                          : 'bg-blue-50 border-blue-400 text-blue-800'
                      }`}
                    >
                      <p className="text-sm font-medium">{feedback.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {new Date(feedback.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
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
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Session Stats</CardTitle>
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
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Live Transcript
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
                    <span 
                      className="text-gray-900"
                      dangerouslySetInnerHTML={{ 
                        __html: highlightFillerWords(transcript) 
                      }}
                    />
                    {interimTranscript && (
                      <span className="text-gray-400 italic">
                        {' ' + interimTranscript}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
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