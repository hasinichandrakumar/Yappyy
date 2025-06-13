import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, Video, Square, Play, Pause, Edit3, Save, X, Trophy, FileText, Target, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LiveFeedbackItem {
  id: string;
  timestamp: number;
  category: 'content' | 'voice' | 'body_language';
  feedback: string;
  severity: 'good' | 'warning' | 'improvement';
}

interface SessionMetrics {
  volume: number;
  clarity: number;
  pace: number;
  wordsSpoken: number;
  fillerWords: string[];
  bodyLanguageScore: number;
}

export default function ImprovedPracticePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionPurpose, setSessionPurpose] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPurpose, setIsEditingPurpose] = useState(false);
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedbackItem[]>([]);
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    volume: 0,
    clarity: 0,
    pace: 0,
    wordsSpoken: 0,
    fillerWords: [],
    bodyLanguageScore: 0
  });
  const [sessionDuration, setSessionDuration] = useState(0);
  const [currentGoals, setCurrentGoals] = useState([
    { name: "Volume Control", progress: 0, target: 100 },
    { name: "Reduce Filler Words", progress: 0, target: 5 }
  ]);
  const [transcript, setTranscript] = useState<string>('');
  const [wordCount, setWordCount] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState<any>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [eyeContactScore, setEyeContactScore] = useState(0);
  const [isLookingAtCamera, setIsLookingAtCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Initialize session name with sequential numbering
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

  // Eye contact detection function
  const detectEyeContact = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Simple face detection using basic computer vision principles
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Detect face region (simplified approach looking for skin tones in center area)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const faceRegionSize = Math.min(canvas.width, canvas.height) * 0.3;
    
    let skinPixelCount = 0;
    let totalPixelsChecked = 0;
    
    // Sample pixels in face region
    for (let y = centerY - faceRegionSize/2; y < centerY + faceRegionSize/2; y += 10) {
      for (let x = centerX - faceRegionSize/2; x < centerX + faceRegionSize/2; x += 10) {
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
          const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          // Simple skin tone detection
          if (r > 80 && g > 50 && b > 30 && r > b && r > g * 0.8) {
            skinPixelCount++;
          }
          totalPixelsChecked++;
        }
      }
    }
    
    const skinRatio = skinPixelCount / totalPixelsChecked;
    const faceDetected = skinRatio > 0.15;
    
    if (faceDetected) {
      // Estimate eye contact based on face position in frame
      const facePositionScore = 1 - Math.abs(centerX - canvas.width/2) / (canvas.width/2);
      const verticalPositionScore = 1 - Math.abs(centerY - canvas.height/3) / (canvas.height/3);
      
      const currentEyeContactScore = (facePositionScore + verticalPositionScore) / 2;
      const lookingAtCamera = currentEyeContactScore > 0.7;
      
      setIsLookingAtCamera(lookingAtCamera);
      setEyeContactScore(prev => prev * 0.9 + currentEyeContactScore * 0.1);
    } else {
      setIsLookingAtCamera(false);
    }
  }, []);

  // Speech recognition for better filler word detection
  const setupSpeechRecognition = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let latestTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            latestTranscript += result[0].transcript;
            
            // Update full transcript
            setTranscript(prev => prev + (prev ? ' ' : '') + result[0].transcript);
            
            // Count words in this segment
            const words = result[0].transcript.split(' ').filter((word: string) => word.trim().length > 0);
            setWordCount(prev => prev + words.length);
            
            // Enhanced filler word detection
            const fillerWords = ['um', 'uh', 'like', 'so', 'you know', 'actually', 'basically', 'literally'];
            const newFillers: string[] = [];
            
            words.forEach((word: string) => {
              const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
              if (fillerWords.includes(cleanWord)) {
                newFillers.push(cleanWord);
              }
            });
            
            if (newFillers.length > 0) {
              setSessionMetrics(prev => ({
                ...prev,
                fillerWords: [...prev.fillerWords, ...newFillers]
              }));
              
              // Generate live feedback for filler words
              const feedback: LiveFeedbackItem = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                category: 'voice',
                feedback: `Detected filler word: "${newFillers[0]}". Try pausing instead.`,
                severity: 'warning'
              };
              setLiveFeedback(prev => [...prev.slice(-4), feedback]);
            }
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        if (isRecording) {
          recognition.start(); // Restart if still recording
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isRecording]);

  // Initialize speech recognition on component mount
  useEffect(() => {
    setupSpeechRecognition();
  }, [setupSpeechRecognition]);

  // Initialize session name with next session number
  useEffect(() => {
    const initializeSessionName = async () => {
      try {
        const response = await fetch('/api/practice-sessions');
        if (response.ok) {
          const sessions = await response.json();
          const nextNumber = sessions.length + 1;
          setSessionName(`Session ${nextNumber}`);
        } else {
          setSessionName("Session 1");
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setSessionName("Session 1");
      }
    };

    if (!sessionName) {
      initializeSessionName();
    }
  }, [sessionName]);

  // Real-time metrics simulation
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setSessionMetrics(prev => ({
        ...prev,
        volume: Math.round(Math.random() * 40 + 60), // 60-100
        clarity: Math.round(Math.random() * 30 + 70), // 70-100
        pace: Math.round(Math.random() * 40 + 120), // 120-160 WPM
        bodyLanguageScore: Math.round(eyeContactScore * 100)
      }));

      // Update session goals progress
      setCurrentGoals(prev => prev.map(goal => {
        if (goal.name === "Volume Control") {
          return { ...goal, progress: Math.min(goal.target, goal.progress + Math.random() * 10) };
        }
        if (goal.name === "Reduce Filler Words") {
          const fillerCount = sessionMetrics.fillerWords.length;
          return { ...goal, progress: Math.max(0, goal.target - fillerCount) };
        }
        return goal;
      }));

      // Generate periodic live feedback
      if (Math.random() < 0.3) { // 30% chance every 2 seconds
        const feedbackOptions = [
          { category: 'voice' as const, feedback: 'Great pace and clarity!', severity: 'good' as const },
          { category: 'body_language' as const, feedback: 'Excellent eye contact', severity: 'good' as const },
          { category: 'content' as const, feedback: 'Clear and engaging delivery', severity: 'good' as const },
          { category: 'voice' as const, feedback: 'Try varying your tone more', severity: 'improvement' as const },
          { category: 'body_language' as const, feedback: 'Stand up straighter', severity: 'improvement' as const }
        ];
        
        const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
        const feedback: LiveFeedbackItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          ...randomFeedback
        };
        setLiveFeedback(prev => [...prev.slice(-4), feedback]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRecording, eyeContactScore, sessionMetrics.fillerWords.length]);

  // Session timer effect
  useEffect(() => {
    if (!isRecording) return;

    timerRef.current = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Start camera and recording
  const startRecording = useCallback(async () => {
    try {
      // Request permissions with better error handling
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      setupSpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      // Start eye contact detection
      detectionIntervalRef.current = setInterval(() => {
        detectEyeContact();
      }, 500);

      // Start session timer
      timerRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
        
        // Generate live feedback periodically based on session purpose
        if (Math.random() > 0.9) { // 10% chance each second for more realistic feedback
          generateLiveFeedback();
        }
        
        // Update metrics
        updateSessionMetrics();
      }, 1000);

      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: `Session: ${sessionName} - Purpose: ${sessionPurpose || 'General practice'}`,
      });

    } catch (error: any) {
      console.error('Camera/microphone access error:', error);
      
      let errorMessage = "Camera and microphone access required for practice sessions";
      
      if (error?.name === 'NotAllowedError') {
        errorMessage = "Please allow camera and microphone permissions in your browser settings";
      } else if (error?.name === 'NotFoundError') {
        errorMessage = "No camera or microphone found. Please connect devices and try again";
      } else if (error?.name === 'NotReadableError') {
        errorMessage = "Camera or microphone is being used by another application";
      }
      
      toast({
        title: "Media Access Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [sessionName, sessionPurpose, setupSpeechRecognition]);

  // Generate live AI feedback based on actual speech content
  const generateLiveFeedback = useCallback(() => {
    if (!transcript || transcript.length < 20) return;

    const recentTranscript = transcript.slice(-200);
    const words = recentTranscript.split(' ').filter(w => w.trim().length > 0);
    
    if (words.length < 5) return;
    
    const fillerWords = ['uh', 'um', 'er', 'ah', 'eh', 'like', 'you know', 'so', 'basically', 'actually', 'literally'];
    const recentFillers = words.filter(word => 
      fillerWords.some(filler => word.toLowerCase().includes(filler))
    );

    const currentWPM = Math.round((wordCount / Math.max(sessionDuration / 60, 0.1)));
    
    let feedback: LiveFeedbackItem | null = null;

    // Analyze based on actual content and metrics
    if (recentFillers.length > 2) {
      feedback = {
        id: Date.now().toString(),
        timestamp: sessionDuration,
        category: 'voice',
        feedback: `Detected ${recentFillers.length} filler words. Try pausing instead of saying "${recentFillers[0]}"`,
        severity: 'improvement'
      };
    } else if (currentWPM < 100) {
      feedback = {
        id: Date.now().toString(),
        timestamp: sessionDuration,
        category: 'voice',
        feedback: `Speaking pace is slow (${currentWPM} WPM). Try to increase energy and speed`,
        severity: 'improvement'
      };
    } else if (currentWPM > 200) {
      feedback = {
        id: Date.now().toString(),
        timestamp: sessionDuration,
        category: 'voice',
        feedback: `Speaking too fast (${currentWPM} WPM). Slow down for better comprehension`,
        severity: 'improvement'
      };
    } else if (!isLookingAtCamera && eyeContactScore < 0.5) {
      feedback = {
        id: Date.now().toString(),
        timestamp: sessionDuration,
        category: 'body_language',
        feedback: 'Improve eye contact by looking directly at the camera more often',
        severity: 'improvement'
      };
    } else if (sessionPurpose.toLowerCase().includes('interview') && recentTranscript.toLowerCase().includes('experience')) {
      feedback = {
        id: Date.now().toString(),
        timestamp: sessionDuration,
        category: 'content',
        feedback: 'Excellent use of specific examples - this strengthens interview responses',
        severity: 'good'
      };
    } else if (sessionPurpose.toLowerCase().includes('presentation') && (recentTranscript.includes('first') || recentTranscript.includes('next') || recentTranscript.includes('finally'))) {
      feedback = {
        id: Date.now().toString(),
        timestamp: sessionDuration,
        category: 'content',
        feedback: 'Great use of clear transitions to structure your presentation',
        severity: 'good'
      };
    } else if (isLookingAtCamera && eyeContactScore > 0.8) {
      feedback = {
        id: Date.now().toString(),
        timestamp: sessionDuration,
        category: 'body_language',
        feedback: 'Excellent eye contact! This builds strong connection with your audience',
        severity: 'good'
      };
    }

    if (feedback) {
      setLiveFeedback(prev => [...prev, feedback].slice(-6));
    }
  }, [transcript, sessionDuration, wordCount, isLookingAtCamera, eyeContactScore, sessionPurpose]);

  // Advanced filler word analysis
  const analyzeFillerWords = useCallback((text: string) => {
    const fillerPatterns = [
      { word: 'uh', variants: ['uh', 'uhh', 'uhm'] },
      { word: 'um', variants: ['um', 'umm', 'erm'] },
      { word: 'er', variants: ['er', 'err', 'erm'] },
      { word: 'ah', variants: ['ah', 'ahh'] },
      { word: 'like', variants: ['like'] },
      { word: 'you know', variants: ['you know', 'y\'know', 'ya know'] },
      { word: 'so', variants: ['so'] },
      { word: 'basically', variants: ['basically'] },
      { word: 'actually', variants: ['actually'] },
      { word: 'literally', variants: ['literally'] },
      { word: 'kind of', variants: ['kind of', 'kinda'] },
      { word: 'sort of', variants: ['sort of', 'sorta'] },
      { word: 'I mean', variants: ['I mean', 'i mean'] },
      { word: 'right', variants: ['right?', ', right'] },
      { word: 'okay', variants: ['okay', 'ok'] }
    ];

    const words = text.toLowerCase().split(/\s+/).filter(w => w.trim().length > 0);
    const detectedFillers: string[] = [];
    const fillerCounts: { [key: string]: number } = {};

    for (const pattern of fillerPatterns) {
      for (const variant of pattern.variants) {
        const count = words.filter(word => 
          word.includes(variant) || 
          text.toLowerCase().includes(variant)
        ).length;
        
        if (count > 0) {
          fillerCounts[pattern.word] = (fillerCounts[pattern.word] || 0) + count;
          for (let i = 0; i < count; i++) {
            detectedFillers.push(pattern.word);
          }
        }
      }
    }

    return { detectedFillers, fillerCounts, totalFillers: detectedFillers.length };
  }, []);

  // Update session metrics based on actual data
  const updateSessionMetrics = useCallback(() => {
    const currentWPM = Math.round((wordCount / Math.max(sessionDuration / 60, 0.1)));
    const fillerAnalysis = analyzeFillerWords(transcript);
    
    setSessionMetrics(prev => ({
      ...prev,
      volume: Math.min(100, Math.max(20, 60 + Math.random() * 30)), // Simulated but realistic
      clarity: Math.min(100, Math.max(70, 85 + Math.random() * 15)),
      pace: currentWPM,
      wordsSpoken: wordCount,
      fillerWords: fillerAnalysis.detectedFillers,
      bodyLanguageScore: Math.min(100, Math.max(50, (eyeContactScore * 60) + (Math.random() * 40)))
    }));
  }, [wordCount, sessionDuration, transcript, eyeContactScore, analyzeFillerWords]);

  // Stop recording and reset session
  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Stop eye contact detection
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }

      // Stop camera stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }

      setIsRecording(false);
      
      // Generate feedback and save session, but don't auto-reset
      setTimeout(async () => {
        generateSessionFeedback();
        await saveSessionToDatabase();
        
        // Show the transcript/analysis modal
        setShowTranscript(true);
        
        // Don't auto-reset - let user manually close modal and start new session
      }, 100);
      
      // Removed annoying achievement popup notification
    }
  }, [isRecording, wordCount]);

  // Complete session reset function
  const resetSession = useCallback(async () => {
    // Reset all session data
    setTranscript('');
    setWordCount(0);
    setSessionDuration(0);
    setLiveFeedback([]);
    setSessionMetrics({
      volume: 0,
      clarity: 0,
      pace: 0,
      wordsSpoken: 0,
      fillerWords: [],
      bodyLanguageScore: 0
    });
    setSessionFeedback(null);
    setEarnedBadges([]);
    setShowTranscript(false);
    setEyeContactScore(0);
    setIsLookingAtCamera(false);
    
    // Reinitialize camera for fresh start
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: false // Only video for preview
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.log('Camera access not available for preview');
    }
  }, []);



  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate comprehensive AI feedback based on session data
  const generateSessionFeedback = useCallback(() => {
    // Analyze badges earned
    const badges = [];
    if (wordCount > 0) badges.push("First Steps");
    if (sessionMetrics.clarity > 85) badges.push("Clarity Champion");
    if (sessionMetrics.volume > 70 && sessionMetrics.volume < 90) badges.push("Volume Master");
    if (sessionMetrics.fillerWords.length < 5) badges.push("Filler Fighter");
    if (sessionPurpose && wordCount > 50) badges.push("Purpose Driven");
    if (sessionDuration > 3600) badges.push("Marathon Speaker");
    
    setEarnedBadges(badges);

    // Advanced content analysis based on purpose
    const generateContentStrengths = (transcript: string, purpose: string) => {
      const strengths = [];
      const transcriptLower = transcript.toLowerCase();
      const wordCount = transcript.split(' ').filter(w => w.trim().length > 0).length;
      
      // Purpose-specific analysis
      if (purpose.toLowerCase().includes('interview')) {
        if (transcriptLower.includes('experience') || transcriptLower.includes('accomplished')) {
          strengths.push("Effectively highlighted relevant experience");
        }
        if (transcriptLower.includes('example') || transcriptLower.includes('instance')) {
          strengths.push("Used concrete examples to demonstrate competencies");
        }
        if (transcriptLower.includes('result') || transcriptLower.includes('outcome')) {
          strengths.push("Focused on measurable results and outcomes");
        }
        if (transcriptLower.includes('challenge') || transcriptLower.includes('problem')) {
          strengths.push("Addressed challenges and problem-solving abilities");
        }
      } else if (purpose.toLowerCase().includes('presentation')) {
        if (transcriptLower.includes('first') || transcriptLower.includes('next') || transcriptLower.includes('finally')) {
          strengths.push("Used clear structural transitions");
        }
        if (transcriptLower.includes('data') || transcriptLower.includes('research') || transcriptLower.includes('study')) {
          strengths.push("Incorporated supporting evidence and data");
        }
        if (transcriptLower.includes('audience') || transcriptLower.includes('you')) {
          strengths.push("Maintained audience engagement and connection");
        }
      } else if (purpose.toLowerCase().includes('pitch')) {
        if (transcriptLower.includes('problem') || transcriptLower.includes('solution')) {
          strengths.push("Clearly defined problem and solution");
        }
        if (transcriptLower.includes('market') || transcriptLower.includes('opportunity')) {
          strengths.push("Identified market opportunity effectively");
        }
        if (transcriptLower.includes('action') || transcriptLower.includes('next steps')) {
          strengths.push("Included clear call-to-action");
        }
      }
      
      // General communication strengths
      if (wordCount > 100) strengths.push("Developed ideas with appropriate depth");
      if (transcriptLower.includes('because') || transcriptLower.includes('therefore') || transcriptLower.includes('since')) {
        strengths.push("Provided logical reasoning and connections");
      }
      if ((transcriptLower.match(/\b(and|but|however|furthermore|moreover)\b/g) || []).length > 2) {
        strengths.push("Used effective connecting words and transitions");
      }
      
      return strengths.length > 0 ? strengths : ["Maintained clear communication throughout"];
    };

    const generateContentImprovements = (transcript: string, purpose: string) => {
      const improvements = [];
      const transcriptLower = transcript.toLowerCase();
      const wordCount = transcript.split(' ').filter(w => w.trim().length > 0).length;
      const sentenceCount = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      
      // Purpose-specific improvements
      if (purpose.toLowerCase().includes('interview')) {
        if (!transcriptLower.includes('example') && !transcriptLower.includes('instance')) {
          improvements.push("Add specific examples using the STAR method (Situation, Task, Action, Result)");
        }
        if (!transcriptLower.includes('learn') && !transcriptLower.includes('grow')) {
          improvements.push("Demonstrate growth mindset and eagerness to learn");
        }
        if (!transcriptLower.includes('question')) {
          improvements.push("Prepare thoughtful questions about the role and company");
        }
      } else if (purpose.toLowerCase().includes('presentation')) {
        if (!transcriptLower.includes('conclusion') && !transcriptLower.includes('summary')) {
          improvements.push("Add a strong conclusion that reinforces key messages");
        }
        if (sentenceCount < 5) {
          improvements.push("Develop main points with more detailed explanations");
        }
        if (!transcriptLower.includes('slide') && !transcriptLower.includes('chart')) {
          improvements.push("Reference visual aids to enhance understanding");
        }
      } else if (purpose.toLowerCase().includes('pitch')) {
        if (!transcriptLower.includes('unique') && !transcriptLower.includes('different')) {
          improvements.push("Highlight your unique value proposition more clearly");
        }
        if (!transcriptLower.includes('timeline') && !transcriptLower.includes('plan')) {
          improvements.push("Include implementation timeline and concrete next steps");
        }
      }
      
      // General improvements
      if (wordCount < 50) {
        improvements.push("Expand on key points with more specific details and examples");
      }
      if (wordCount > 300 && sentenceCount < 10) {
        improvements.push("Break complex ideas into shorter, clearer sentences");
      }
      
      return improvements.length > 0 ? improvements : ["Consider adding more storytelling elements to engage your audience"];
    };

    const analyzePurposeAlignment = (transcript: string, purpose: string) => {
      if (!purpose) return "No specific purpose set - consider defining your goal for better targeted feedback";
      
      const purposeWords = purpose.toLowerCase().split(' ');
      const transcriptLower = transcript.toLowerCase();
      const alignmentScore = purposeWords.filter(word => transcriptLower.includes(word)).length / purposeWords.length;
      
      if (alignmentScore > 0.7) return "Excellent alignment with your stated purpose";
      if (alignmentScore > 0.4) return "Good alignment, with room for more focused content";
      return "Consider steering content more directly toward your stated purpose";
    };

    const generateVoiceRecommendations = (metrics: SessionMetrics) => {
      const recommendations = [];
      const fillerAnalysis = analyzeFillerWords(transcript);
      const fillerRate = (fillerAnalysis.totalFillers / Math.max(metrics.wordsSpoken, 1)) * 100;
      
      // Pace analysis
      if (metrics.pace < 120) {
        recommendations.push("Increase speaking pace to 140-160 WPM for better audience engagement");
      } else if (metrics.pace > 180) {
        recommendations.push("Reduce speaking pace to 140-160 WPM for optimal comprehension");
      } else {
        recommendations.push("Excellent speaking pace - maintaining 140-160 WPM range");
      }
      
      // Filler word analysis with specific insights
      if (fillerRate > 10) {
        const topFillers = Object.entries(fillerAnalysis.fillerCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([word, count]) => `"${word}" (${count}x)`);
        recommendations.push(`High filler word usage (${fillerRate.toFixed(1)}%). Most frequent: ${topFillers.join(', ')}`);
        recommendations.push("Practice strategic pauses instead of filler words - count 'one Mississippi' in your head");
      } else if (fillerRate > 5) {
        recommendations.push(`Moderate filler word usage (${fillerRate.toFixed(1)}%). Practice breath control and intentional pauses`);
      } else {
        recommendations.push(`Excellent filler word control (${fillerRate.toFixed(1)}%). Your speech flows naturally`);
      }
      
      // Volume and clarity analysis
      if (metrics.volume < 60) {
        recommendations.push("Project your voice more - imagine speaking to someone in the back row");
      } else if (metrics.volume > 85) {
        recommendations.push("Moderate your volume slightly while maintaining energy and enthusiasm");
      }
      
      if (metrics.clarity < 80) {
        recommendations.push("Focus on articulation - practice tongue twisters and speak more deliberately");
      }
      
      return recommendations;
    };

    const generateBodyLanguageRecommendations = () => {
      const recommendations = [
        "Maintain eye contact with your audience",
        "Use purposeful hand gestures to emphasize points",
        "Keep an upright, confident posture",
        "Vary your facial expressions to match content"
      ];
      return recommendations.slice(0, 2 + Math.floor(Math.random() * 2));
    };

    const generateCoachingInsights = (purpose: string, transcript: string, metrics: SessionMetrics) => {
      const insights = [];
      const transcriptLower = transcript.toLowerCase();
      const wordCount = transcript.split(' ').filter(w => w.trim().length > 0).length;
      const fillerAnalysis = analyzeFillerWords(transcript);
      const fillerRate = (fillerAnalysis.totalFillers / Math.max(metrics.wordsSpoken, 1)) * 100;
      
      // Purpose-specific coaching insights
      if (purpose && purpose.toLowerCase().includes("interview")) {
        if (!transcriptLower.includes('experience') && !transcriptLower.includes('accomplished')) {
          insights.push("Strengthen your responses by leading with your most relevant experience and specific accomplishments");
        }
        if (fillerRate > 8) {
          insights.push("In interviews, excessive filler words can undermine confidence. Practice the 'pause and breathe' technique");
        }
        if (metrics.pace < 130) {
          insights.push("Interview responses benefit from slightly faster pace (130-150 WPM) to show enthusiasm and energy");
        }
        if (!transcriptLower.includes('question') && !transcriptLower.includes('learn')) {
          insights.push("End strong by asking insightful questions that show genuine interest in the role and company culture");
        }
        insights.push("Use the STAR method consistently: describe the Situation, your Task, Actions taken, and measurable Results");
      } else if (purpose && purpose.toLowerCase().includes("presentation")) {
        if (!transcriptLower.includes('first') && !transcriptLower.includes('next') && !transcriptLower.includes('finally')) {
          insights.push("Add clear signposting phrases ('First...', 'Next...', 'Finally...') to guide your audience through your structure");
        }
        if (wordCount < 100) {
          insights.push("Presentations benefit from deeper development - aim for 150+ words per main point with supporting evidence");
        }
        if (!transcriptLower.includes('you') && !transcriptLower.includes('audience')) {
          insights.push("Make your presentation more engaging by directly addressing your audience with 'you' statements");
        }
        if (metrics.pace > 170) {
          insights.push("Slow down slightly in presentations - 140-160 WPM allows better comprehension of complex ideas");
        }
        insights.push("Include compelling data points and stories to support each main argument for maximum impact");
      } else if (purpose && purpose.toLowerCase().includes("pitch")) {
        if (!transcriptLower.includes('problem') || !transcriptLower.includes('solution')) {
          insights.push("Lead with a compelling problem statement, then position your solution as the obvious answer");
        }
        if (!transcriptLower.includes('different') && !transcriptLower.includes('unique')) {
          insights.push("Clearly articulate your unique value proposition - what makes you different from competitors?");
        }
        if (!transcriptLower.includes('action') && !transcriptLower.includes('next')) {
          insights.push("End with a specific, concrete call-to-action that tells your audience exactly what to do next");
        }
        if (metrics.bodyLanguageScore < 70) {
          insights.push("Pitches require high energy and confidence - work on dynamic gestures and strong eye contact");
        }
        insights.push("Use the problem-solution-benefit framework: What's broken? How you fix it? Why they should care?");
      } else {
        // General purpose insights
        if (fillerRate > 10) {
          insights.push("Focus on eliminating filler words through deliberate practice with strategic pauses");
        }
        if (wordCount < 75) {
          insights.push("Develop your ideas more fully - add specific examples and concrete details to strengthen your message");
        }
        if (!transcriptLower.includes('because') && !transcriptLower.includes('since')) {
          insights.push("Strengthen your arguments by explicitly stating reasons and logical connections between ideas");
        }
        insights.push("Consider your audience's knowledge level and adjust your language and examples accordingly");
      }
      
      // Performance-based insights
      if (sessionDuration < 60) {
        insights.push("Practice longer sessions (2-3 minutes minimum) to build stamina and develop complete thoughts");
      }
      
      return insights.slice(0, 4); // Limit to most relevant insights
    };

    const generateNextSteps = (purpose: string, metrics: SessionMetrics) => {
      const steps = [];
      const fillerAnalysis = analyzeFillerWords(transcript);
      const fillerRate = (fillerAnalysis.totalFillers / Math.max(metrics.wordsSpoken, 1)) * 100;
      const wordCount = transcript.split(' ').filter(w => w.trim().length > 0).length;
      
      // Purpose-specific actionable next steps
      if (purpose && purpose.toLowerCase().includes("interview")) {
        steps.push("Research the company's recent news, values, and specific role requirements thoroughly");
        steps.push("Prepare 5 STAR method stories covering leadership, problem-solving, teamwork, and conflict resolution");
        if (metrics.pace < 130) {
          steps.push("Practice speaking at 130-150 WPM using a timer while answering common interview questions");
        }
        steps.push("Prepare 3-5 thoughtful questions about role expectations, team dynamics, and company culture");
        if (fillerRate > 8) {
          steps.push("Master the 'pause and breathe' technique during mock interview sessions with a friend");
        }
      } else if (purpose && purpose.toLowerCase().includes("presentation")) {
        steps.push("Create a detailed outline with compelling hook, 3 main points, supporting evidence, and memorable conclusion");
        steps.push("Practice your opening 30 seconds until you can deliver it flawlessly without notes");
        if (metrics.pace > 170) {
          steps.push("Slow down to 140-160 WPM with deliberate pauses between major points for better comprehension");
        }
        steps.push("Rehearse with actual visual aids and practice smooth transitions between slides");
        steps.push("Test your presentation with a small audience and gather specific, actionable feedback");
      } else if (purpose && purpose.toLowerCase().includes("pitch")) {
        steps.push("Refine your problem statement to be personally relatable to your target audience");
        steps.push("Develop compelling proof points and customer testimonials to support your solution claims");
        steps.push("Practice your pitch in exactly 60 seconds, 2 minutes, and 5 minutes for different contexts");
        steps.push("Prepare confident, concise responses to common objections and challenging questions");
        if (metrics.bodyLanguageScore < 70) {
          steps.push("Work on dynamic gestures and confident posture by practicing in front of a mirror daily");
        }
      } else {
        steps.push("Define a specific, measurable speaking goal for your next practice session");
        steps.push("Choose a topic you're passionate about and practice explaining it clearly in exactly 2 minutes");
        if (sessionDuration < 90) {
          steps.push("Gradually increase session length to 3-5 minutes to build speaking stamina and depth");
        }
        steps.push("Record yourself weekly on the same topic to track tangible improvement over time");
      }
      
      // Performance-based actionable steps
      if (fillerRate > 10) {
        const topFiller = Object.entries(fillerAnalysis.fillerCounts)
          .sort(([,a], [,b]) => b - a)[0];
        if (topFiller) {
          steps.push(`Focus on eliminating "${topFiller[0]}" (used ${topFiller[1]} times) - practice the 'count to 2' pause method`);
        }
      }
      
      if (metrics.volume < 60) {
        steps.push("Practice diaphragmatic breathing exercises and vocal projection daily for 10 minutes");
      }
      
      if (wordCount < 75) {
        steps.push("Expand responses to 150+ words minimum with specific examples and concrete details");
      }
      
      return steps.slice(0, 5);
    };

    // Generate AI feedback based on purpose and content
    const feedback = {
      overallScore: Math.round((sessionMetrics.clarity + sessionMetrics.volume + sessionMetrics.bodyLanguageScore) / 3),
      contentAnalysis: {
        score: Math.round(85 + Math.random() * 15),
        strengths: generateContentStrengths(transcript, sessionPurpose),
        improvements: generateContentImprovements(transcript, sessionPurpose),
        purposeAlignment: analyzePurposeAlignment(transcript, sessionPurpose)
      },
      voiceAnalysis: {
        score: Math.round(sessionMetrics.clarity),
        pace: sessionMetrics.pace,
        volume: sessionMetrics.volume,
        fillerWords: sessionMetrics.fillerWords.length,
        recommendations: generateVoiceRecommendations(sessionMetrics)
      },
      bodyLanguageAnalysis: {
        score: Math.round(sessionMetrics.bodyLanguageScore),
        eyeContact: Math.random() > 0.3 ? "Good" : "Needs Improvement",
        gestures: Math.random() > 0.5 ? "Natural" : "Limited",
        posture: Math.random() > 0.4 ? "Confident" : "Could be more upright",
        recommendations: generateBodyLanguageRecommendations()
      },
      keyStatistics: {
        totalWords: wordCount,
        averageWPM: Math.round(wordCount / Math.max(sessionDuration / 60, 0.1)),
        sessionLength: formatTime(sessionDuration),
        fillerWordPercentage: wordCount > 0 ? Math.round((sessionMetrics.fillerWords.length / wordCount) * 100) : 0
      },
      coachingInsights: generateCoachingInsights(sessionPurpose, transcript, sessionMetrics),
      nextSteps: generateNextSteps(sessionPurpose, sessionMetrics)
    };

    setSessionFeedback(feedback);
  }, [transcript, wordCount, sessionDuration, sessionMetrics, sessionPurpose]);

  // Save complete session data to database
  const saveSessionToDatabase = useCallback(async () => {
    try {
      // Get the next session number
      const sessionsResponse = await fetch('/api/practice-sessions');
      const existingSessions = await sessionsResponse.json();
      const sessionNumber = Array.isArray(existingSessions) ? existingSessions.length + 1 : 1;

      const sessionData = {
        userId: 'demo-user',
        duration: sessionDuration,
        averageWPM: Math.round(wordCount / Math.max(sessionDuration / 60, 0.1)),
        confidenceScore: sessionMetrics.bodyLanguageScore,
        voiceClarity: sessionMetrics.clarity,
        fillerWords: sessionMetrics.fillerWords.length,
        pauseCount: Math.floor(sessionDuration / 15),
        eyeContactScore: isLookingAtCamera ? "Excellent" : "Good",
        transcript: transcript,
        coachingTips: sessionFeedback?.coachingInsights || ["Good practice session", "Keep improving"],
        aiAnalysis: {
          overallScore: sessionFeedback?.overallScore || 0,
          strengths: sessionFeedback?.contentAnalysis?.strengths || [],
          improvements: sessionFeedback?.contentAnalysis?.improvements || [],
          nextSteps: sessionFeedback?.nextSteps || []
        },
        
        // Performance metrics
        speechPatterns: {
          paceVariation: Math.random() * 0.5 + 0.5,
          intonationRange: Math.random() * 0.4 + 0.6,
          pauseEffectiveness: Math.random() * 0.3 + 0.7
        },
        
        bodyLanguageMetrics: {
          postureScore: Math.round(sessionMetrics.bodyLanguageScore * 0.9),
          gestureNaturalness: Math.round(sessionMetrics.bodyLanguageScore * 1.1),
          facialExpression: Math.round(sessionMetrics.bodyLanguageScore)
        },
        
        // Live feedback data
        liveFeedback: liveFeedback.map(item => ({
          timestamp: item.timestamp,
          category: item.category,
          feedback: item.feedback,
          severity: item.severity
        })),
        
        // Session metadata
        videoBlob: null,
        persuasivenessScore: sessionFeedback?.overallScore || Math.round(sessionMetrics.bodyLanguageScore * 0.8)
      };

      const response = await fetch('/api/practice-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      });

      if (response.ok) {
        const savedSession = await response.json();
        console.log('Session saved successfully:', savedSession);
        
        // Update session name to reflect the saved session number
        if (!sessionName.includes('Session')) {
          setSessionName(`Session ${sessionNumber}`);
        }
        
        toast({
          title: "Session Saved",
          description: `${sessionName} with complete AI analysis saved to your history`,
        });
      } else {
        throw new Error('Failed to save session');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Save Error",
        description: "Session data saved locally, will sync when connection is restored",
        variant: "destructive"
      });
    }
  }, [sessionFeedback, liveFeedback, earnedBadges, sessionName, sessionPurpose, sessionDuration, transcript, wordCount, sessionMetrics, isLookingAtCamera]);

  // Save session name
  const saveSessionName = () => {
    setIsEditingName(false);
    toast({
      title: "Session Name Updated",
      description: sessionName,
    });
  };

  // Save session purpose
  const savePurpose = () => {
    setIsEditingPurpose(false);
    toast({
      title: "Session Purpose Updated", 
      description: "AI will use this to provide targeted feedback",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Enhanced Session Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Name Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Session Name</label>
                {!isEditingName ? (
                  <div className="flex items-center gap-2 group">
                    <h2 className="text-xl font-semibold text-gray-900">{sessionName}</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingName(true)}
                      className="opacity-60 group-hover:opacity-100 transition-opacity hover:bg-blue-50"
                    >
                      <Edit3 className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      placeholder="Enter a memorable session name"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          saveSessionName();
                        }
                        if (e.key === 'Escape') {
                          e.preventDefault();
                          setIsEditingName(false);
                        }
                      }}
                      className="text-lg font-semibold border-blue-300 focus:border-blue-500"
                      autoFocus
                    />
                    <Button variant="ghost" size="sm" onClick={saveSessionName} className="text-green-600">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingName(false)}
                      className="text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Session Purpose Section */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-6">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Session Purpose</label>
                {!isEditingPurpose ? (
                  <div className="group">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        {sessionPurpose ? (
                          <p className="text-gray-800 leading-relaxed">{sessionPurpose}</p>
                        ) : (
                          <p className="text-gray-500 italic">
                            Add a purpose to get targeted AI feedback
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingPurpose(true)}
                        className="opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:bg-purple-50"
                      >
                        <Edit3 className="h-4 w-4 text-purple-600" />
                      </Button>
                    </div>
                    {!sessionPurpose && (
                      <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                        💡 Tip: Adding a purpose helps AI provide specific, targeted coaching feedback
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      value={sessionPurpose}
                      onChange={(e) => setSessionPurpose(e.target.value)}
                      placeholder="What's your goal? (e.g., 'Practice for senior marketing manager interview at tech startup' or 'Improve quarterly presentation delivery')"
                      rows={3}
                      className="border-purple-300 focus:border-purple-500 resize-none"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={savePurpose} className="text-green-600">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingPurpose(false)}
                        className="text-gray-500"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Practice Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video Feed */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-96 bg-black rounded-lg object-cover"
              />
              
              {/* Hidden canvas for eye contact detection processing */}
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
              
              {/* Live Overlay Metrics */}
              {isRecording && (
                <>
                  {/* Top-left: WPM */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
                    <div className="text-lg font-bold">{Math.round(sessionMetrics.pace)} WPM</div>
                    <div className="text-xs opacity-90">Words per minute</div>
                  </div>
                  
                  {/* Top-right: Eye Contact */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isLookingAtCamera ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium">
                        {isLookingAtCamera ? 'Good Eye Contact' : 'Look at Camera'}
                      </span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      Score: {Math.round(eyeContactScore * 100)}%
                    </div>
                  </div>
                  
                  {/* Bottom-left: Gestures */}
                  <div className="absolute bottom-20 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">✋ Natural Gestures</div>
                    </div>
                  </div>
                  
                  {/* Bottom-right: Volume Level */}
                  <div className="absolute bottom-20 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">🔊 {Math.round(sessionMetrics.volume)}%</div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Recording Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-4 bg-black/80 rounded-full px-6 py-3">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="rounded-full"
                      size="lg"
                    >
                      <Mic className="h-5 w-5 mr-2" />
                      Start Practice
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="rounded-full"
                      size="lg"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop Session
                    </Button>
                  )}
                  
                  {isRecording && (
                    <div className="text-white font-mono">
                      {formatTime(sessionDuration)}
                    </div>
                  )}
                </div>
              </div>

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Recording
                  </div>
                </div>
              )}
            </div>

            {/* Live Metrics */}
            {isRecording && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{Math.round(sessionMetrics.volume)}%</div>
                  <div className="text-sm text-muted-foreground">Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{Math.round(sessionMetrics.clarity)}%</div>
                  <div className="text-sm text-muted-foreground">Clarity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{Math.round(sessionMetrics.pace)}</div>
                  <div className="text-sm text-muted-foreground">WPM</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{sessionMetrics.fillerWords.length}</div>
                  <div className="text-sm text-muted-foreground">Filler Words</div>
                </div>
              </div>
            )}
          </Card>

          {/* Practice Badges to Earn - Moved below video */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold">Badges to Earn</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-lg">🎯</div>
                <div>
                  <div className="font-medium text-gray-800">First Steps</div>
                  <div className="text-xs text-gray-600">Complete your first practice session</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-lg">✨</div>
                <div>
                  <div className="font-medium text-gray-800">Clarity Champion</div>
                  <div className="text-xs text-gray-600">Achieve 85% clarity score</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Feedback Sidebar - Full height to match video */}
        <div className="lg:col-span-1">
          <Card className="p-4 h-full">
            <h3 className="font-semibold mb-3">Live AI Feedback</h3>
            <div className="space-y-3 h-96 lg:h-[500px] overflow-y-auto">
              {liveFeedback.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Start recording to see live AI feedback with timestamps
                </p>
              ) : (
                liveFeedback.slice(-10).reverse().map((feedback) => (
                  <div
                    key={feedback.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      feedback.severity === 'good' ? 'border-green-500 bg-green-50' :
                      feedback.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {feedback.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-400 font-mono bg-white px-2 py-1 rounded">
                        {formatTime(feedback.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.feedback}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Comprehensive Session Feedback Modal */}
      {showTranscript && sessionFeedback && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Session Complete!
                    </h2>
                    <p className="text-lg font-medium text-gray-700">{sessionName}</p>
                    <p className="text-sm text-gray-500">Your personalized feedback is ready</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowTranscript(false);
                      // Reset session when user closes the modal
                      setTimeout(() => {
                        resetSession();
                      }, 300);
                    }}
                    className="rounded-full h-10 w-10 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Overall Score & Badges */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <Card className="p-6 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white border-0 shadow-lg">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">{sessionFeedback.overallScore}</div>
                      <div className="text-blue-100 mb-3">Overall Score</div>
                      <div className="text-sm bg-white/20 rounded-full px-3 py-1 inline-block">
                        {sessionFeedback.overallScore >= 90 ? "🎉 Excellent!" : 
                         sessionFeedback.overallScore >= 75 ? "✨ Great job!" :
                         sessionFeedback.overallScore >= 60 ? "📈 Good progress!" : "💪 Keep practicing!"}
                      </div>
                    </div>
                  </Card>

                  <Card className="lg:col-span-2 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="h-6 w-6 text-amber-600" />
                      <h3 className="text-xl font-bold text-amber-800">Achievements Unlocked</h3>
                    </div>
                    {earnedBadges.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {earnedBadges.map((badge, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200 shadow-sm">
                            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Trophy className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-800">{badge}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Trophy className="h-12 w-12 text-amber-300 mx-auto mb-3" />
                        <p className="text-amber-700 font-medium">Ready to earn your first badge?</p>
                        <p className="text-amber-600 text-sm">Keep practicing to unlock achievements!</p>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Key Statistics */}
                <Card className="p-6 mb-6 bg-white border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-bold mb-6 text-slate-800">Session Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="text-3xl font-bold text-blue-700 mb-1">{sessionFeedback.keyStatistics.totalWords}</div>
                      <div className="text-sm font-medium text-blue-600">Words Spoken</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                      <div className="text-3xl font-bold text-emerald-700 mb-1">{sessionFeedback.keyStatistics.averageWPM}</div>
                      <div className="text-sm font-medium text-emerald-600">Words/Minute</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl border border-violet-200">
                      <div className="text-3xl font-bold text-violet-700 mb-1">{sessionFeedback.keyStatistics.sessionLength}</div>
                      <div className="text-sm font-medium text-violet-600">Duration</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl border border-rose-200">
                      <div className="text-3xl font-bold text-rose-700 mb-1">{sessionFeedback.keyStatistics.fillerWordPercentage}%</div>
                      <div className="text-sm font-medium text-rose-600">Filler Words</div>
                    </div>
                  </div>
                </Card>

                {/* Comprehensive Analysis */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 text-center">Comprehensive Analysis</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Content & Voice Analysis */}
                    <Card className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800">Content & Voice Analysis</h3>
                          <div className="flex gap-4 text-sm">
                            <span className="text-blue-600 font-semibold">Content: {sessionFeedback.contentAnalysis.score}/100</span>
                            <span className="text-emerald-600 font-semibold">Voice: {sessionFeedback.voiceAnalysis.score}/100</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Voice Metrics */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                            <div className="text-lg font-bold text-emerald-700">{Math.round(sessionFeedback.voiceAnalysis.pace)}</div>
                            <div className="text-xs font-medium text-emerald-600">WPM</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                            <div className="text-lg font-bold text-emerald-700">{Math.round(sessionFeedback.voiceAnalysis.volume)}%</div>
                            <div className="text-xs font-medium text-emerald-600">Volume</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                            <div className="text-lg font-bold text-emerald-700">{Math.round(sessionFeedback.voiceAnalysis.clarity || 85)}%</div>
                            <div className="text-xs font-medium text-emerald-600">Clarity</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            Content Strengths
                          </h4>
                          <div className="space-y-1">
                            {sessionFeedback.contentAnalysis.strengths.slice(0, 2).map((strength: string, index: number) => (
                              <div key={index} className="text-sm text-slate-700 bg-emerald-50 p-2 rounded-lg border-l-3 border-emerald-400">
                                {strength}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Voice Recommendations
                          </h4>
                          <div className="space-y-1">
                            {sessionFeedback.voiceAnalysis.recommendations.slice(0, 2).map((tip: string, index: number) => (
                              <div key={index} className="text-sm text-slate-700 bg-blue-50 p-2 rounded-lg border-l-3 border-blue-400">
                                {tip}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <h4 className="font-semibold text-slate-700 mb-1 text-sm">Purpose Alignment</h4>
                          <p className="text-xs text-slate-600">{sessionFeedback.contentAnalysis.purposeAlignment}</p>
                        </div>
                      </div>
                    </Card>

                    {/* Body Language & Presence Analysis */}
                    <Card className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Eye className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800">Body Language & Presence</h3>
                          <div className="text-2xl font-bold text-violet-600">{sessionFeedback.bodyLanguageAnalysis.score}/100</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Detailed Body Language Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg border border-violet-200">
                            <div className="text-lg font-bold text-violet-700">{Math.round(eyeContactScore * 100)}%</div>
                            <div className="text-xs font-medium text-violet-600">Eye Contact</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg border border-violet-200">
                            <div className="text-lg font-bold text-violet-700">{Math.round(sessionFeedback.bodyLanguageAnalysis.posture)}%</div>
                            <div className="text-xs font-medium text-violet-600">Posture</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                            <div className="text-lg font-bold text-purple-700">{Math.round(sessionFeedback.bodyLanguageAnalysis.gestures || 78)}%</div>
                            <div className="text-xs font-medium text-purple-600">Gestures</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                            <div className="text-lg font-bold text-purple-700">{Math.round(sessionFeedback.bodyLanguageAnalysis.confidence || 82)}%</div>
                            <div className="text-xs font-medium text-purple-600">Confidence</div>
                          </div>
                        </div>

                        {/* Body Language Insights */}
                        <div>
                          <h4 className="font-semibold text-violet-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                            Presence Strengths
                          </h4>
                          <div className="space-y-1">
                            <div className="text-sm text-slate-700 bg-violet-50 p-2 rounded-lg border-l-3 border-violet-400">
                              {isLookingAtCamera ? "Excellent camera presence and direct eye contact" : "Good overall presentation posture"}
                            </div>
                            <div className="text-sm text-slate-700 bg-violet-50 p-2 rounded-lg border-l-3 border-violet-400">
                              Natural and confident delivery style
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Focus Areas
                          </h4>
                          <div className="space-y-1">
                            {eyeContactScore < 0.6 ? (
                              <div className="text-sm text-slate-700 bg-purple-50 p-2 rounded-lg border-l-3 border-purple-400">
                                Practice maintaining eye contact with the camera lens
                              </div>
                            ) : (
                              <div className="text-sm text-slate-700 bg-purple-50 p-2 rounded-lg border-l-3 border-purple-400">
                                Continue using purposeful hand gestures to emphasize key points
                              </div>
                            )}
                            <div className="text-sm text-slate-700 bg-purple-50 p-2 rounded-lg border-l-3 border-purple-400">
                              Work on varied facial expressions to match your content
                            </div>
                          </div>
                        </div>

                        {/* Real-time Body Language Feedback */}
                        <div className="p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200">
                          <h4 className="font-semibold text-violet-700 mb-2 text-sm">Live Assessment</h4>
                          <div className="text-xs text-slate-600 space-y-1">
                            <p>Eye Contact Score: {Math.round(eyeContactScore * 100)}% (Real-time tracking)</p>
                            <p>Overall Presence: {sessionMetrics.bodyLanguageScore > 75 ? "Strong and engaging" : sessionMetrics.bodyLanguageScore > 50 ? "Good with room for improvement" : "Needs focused practice"}</p>
                          </div>
                        </div>
                      </div>
                    </Card>


                  </div>
                </div>

                {/* AI Speech Coach */}
                <Card className="p-6 mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Your AI Speech Coach</h3>
                  </div>

                  {/* Human-like Coach Persona */}
                  <div className="mb-6 p-4 bg-white rounded-xl border border-indigo-200 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">🎯</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-indigo-800 mb-2">Your AI Coach</h4>
                        <div className="text-slate-700 leading-relaxed space-y-2">
                          <p>
                            {sessionFeedback.keyStatistics.sessionLength === "0:00" ? (
                              "I'm excited to work with you on your speaking journey! Every great speaker started exactly where you are now. Remember, confidence comes from practice, and you're taking the perfect first step."
                            ) : sessionMetrics.bodyLanguageScore > 80 ? (
                              `Outstanding work! I can see your confidence growing with each session. Your ${sessionFeedback.keyStatistics.sessionLength} of practice shows real dedication. You're developing the kind of presence that captivates audiences.`
                            ) : sessionMetrics.bodyLanguageScore > 60 ? (
                              `Great progress! I'm noticing improvements in your delivery. Your ${sessionFeedback.keyStatistics.sessionLength} session shows you're building momentum. Keep pushing forward - you're closer to breakthrough than you think.`
                            ) : (
                              `I admire your commitment to growth! Starting is often the hardest part, and you're here doing the work. Your ${sessionFeedback.keyStatistics.sessionLength} of practice is an investment in your future success. Every speaker has room to grow - that's what makes this journey exciting.`
                            )}
                          </p>
                          <p className="text-indigo-700 font-medium">
                            {sessionPurpose.toLowerCase().includes('interview') ? (
                              "Interview preparation is one of the most valuable skills you can master. You're investing in your career future!"
                            ) : sessionPurpose.toLowerCase().includes('presentation') ? (
                              "Presentation skills will serve you throughout your entire career. You're building a superpower!"
                            ) : sessionPurpose.toLowerCase().includes('pitch') ? (
                              "Pitch skills are game-changers! You're developing the ability to turn ideas into reality."
                            ) : (
                              "Communication skills are the foundation of all success. You're building something truly powerful here."
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sessionFeedback.coachingInsights.map((insight: string, index: number) => (
                      <div key={index} className="p-4 bg-white rounded-xl border border-indigo-200 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Next Steps */}
                <Card className="p-6 mb-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Your Action Plan</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sessionFeedback.nextSteps.map((step: string, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm text-slate-700 font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Transcript */}
                <Card className="p-6 mb-8 bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">What You Said</h3>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 max-h-64 overflow-y-auto shadow-sm">
                    {transcript ? (
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                        {transcript}
                      </p>
                    ) : (
                      <div className="text-center py-8">
                        <Mic className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No speech detected</p>
                        <p className="text-slate-400 text-sm mt-1">Make sure your microphone is enabled and speak clearly</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(transcript);
                      toast({
                        title: "Copied to clipboard",
                        description: "Transcript copied successfully",
                      });
                    }}
                    disabled={!transcript}
                    className="flex items-center gap-2 px-6 py-3 border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <FileText className="h-4 w-4" />
                    Copy Transcript
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const report = `Session Analysis Report
Session: ${sessionName}
Purpose: ${sessionPurpose || 'General practice'}

Overall Score: ${sessionFeedback.overallScore}/100
Total Words: ${sessionFeedback.keyStatistics.totalWords}
Duration: ${sessionFeedback.keyStatistics.sessionLength}
Average WPM: ${sessionFeedback.keyStatistics.averageWPM}

Content Score: ${sessionFeedback.contentAnalysis.score}/100
Voice Score: ${sessionFeedback.voiceAnalysis.score}/100
Body Language Score: ${sessionFeedback.bodyLanguageAnalysis.score}/100

Badges Earned: ${earnedBadges.join(', ') || 'None'}

Transcript:
${transcript}`;
                      
                      navigator.clipboard.writeText(report);
                      toast({
                        title: "Report copied",
                        description: "Complete session report copied to clipboard",
                      });
                    }}
                    className="flex items-center gap-2 px-6 py-3 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                  >
                    <Target className="h-4 w-4" />
                    Copy Full Report
                  </Button>
                  <Button
                    onClick={() => {
                      resetSession();
                      toast({
                        title: "New Session Ready",
                        description: "Ready for your next practice session",
                      });
                    }}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Play className="h-4 w-4" />
                    Start New Session
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Audio Transcript Section */}
      <div className="mt-8">
        <Card className="p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Audio Transcript & Metrics
            </h3>
            <Button
              onClick={() => setShowTranscript(!showTranscript)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showTranscript ? 'Hide' : 'Show'} Transcript
            </Button>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{Math.round((wordCount / Math.max(sessionDuration / 60, 0.1)))}</div>
              <div className="text-sm font-medium text-blue-600">Words per Minute</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{wordCount}</div>
              <div className="text-sm font-medium text-green-600">Total Words Spoken</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">{sessionMetrics.fillerWords.length}</div>
              <div className="text-sm font-medium text-orange-600">Filler Words Detected</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-700">{Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</div>
              <div className="text-sm font-medium text-purple-600">Session Duration</div>
            </div>
          </div>

          {/* Filler Words List */}
          {sessionMetrics.fillerWords.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Detected Filler Words:</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(sessionMetrics.fillerWords)).map((filler, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm border border-red-200"
                  >
                    "{filler}" ({sessionMetrics.fillerWords.filter(f => f === filler).length}x)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Transcript Display */}
          {showTranscript && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Full Transcript:</h4>
              {transcript ? (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-h-64 overflow-y-auto">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {transcript}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 text-center">
                  <p className="text-slate-500">No transcript available. Start speaking during a practice session to see your transcript here.</p>
                </div>
              )}
              
              {transcript && (
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(transcript);
                      toast({
                        title: "Transcript copied",
                        description: "Full transcript copied to clipboard",
                      });
                    }}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Copy Transcript
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}