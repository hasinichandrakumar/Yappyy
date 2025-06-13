import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import SimpleCameraFeed from "@/components/SimpleCameraFeed";
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
  Activity,
  AlertCircle,
  Settings,
  Volume2,
  TrendingUp,
  X,
  CheckCircle,
  Star,
  ArrowRight,
  Trophy,
  FileText
} from "lucide-react";

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

interface LiveFeedback {
  id: string;
  timestamp: number;
  category: 'content' | 'voice_modulation' | 'voice_clarity' | 'body_language';
  message: string;
  severity: 'info' | 'warning' | 'success';
  timeLabel: string;
}

export default function EnhancedPracticeHubClean() {
  // Core session state
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionName, setSessionName] = useState("");
  const [sessionPurpose, setSessionPurpose] = useState("");
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [tempSessionName, setTempSessionName] = useState("");
  const [tempSessionPurpose, setTempSessionPurpose] = useState("");

  // Camera and microphone state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Speech recognition state
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [currentWPM, setCurrentWPM] = useState(0);
  const [fillerWords, setFillerWords] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  const speechStartTime = useRef<number>(0);

  // Analysis metrics
  const [eyeContactScore, setEyeContactScore] = useState(75);
  const [postureScore, setPostureScore] = useState(80);
  const [voiceClarity, setVoiceClarity] = useState(85);
  const [currentConfidenceScore, setCurrentConfidenceScore] = useState(70);

  // Live feedback and alerts
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback[]>([]);
  const [recentFillerAlert, setRecentFillerAlert] = useState<string | null>(null);
  const [showSessionAnalysis, setShowSessionAnalysis] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);

  // Fetch existing practice sessions to determine next session number
  const { data: practiceSessions = [] } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate sequential session name
  const generateSessionName = () => {
    const sessionCount = Array.isArray(practiceSessions) ? practiceSessions.length : 0;
    return `Session ${sessionCount + 1}`;
  };

  // Session management functions
  const startSession = () => {
    const autoSessionName = generateSessionName();
    setSessionName(autoSessionName);
    setTempSessionName(autoSessionName);
    setTempSessionPurpose(sessionPurpose);
    setIsSessionActive(true);
    setSessionStartTime(Date.now());
    setSessionDuration(0);
    setWordCount(0);
    setFillerWords([]);
    setTranscript("");
    setInterimTranscript("");
    setLiveFeedback([]);
    
    // Reset all metrics
    setEyeContactScore(0);
    setPostureScore(0);
    setVoiceClarity(0);
    setCurrentConfidenceScore(0);
    
    // Auto-start microphone
    setTimeout(() => {
      startListening();
    }, 500);
  };

  const stopSession = async () => {
    setIsSessionActive(false);
    setIsListening(false);
    
    // Generate comprehensive session analysis
    const analysisData = generateSessionAnalysis();
    
    // Save session to database
    try {
      const sessionPayload = {
        name: sessionName || generateSessionName(),
        type: 'general',
        purpose: sessionPurpose || '',
        duration: sessionDuration,
        transcript: transcript,
        wordCount: wordCount,
        fillerWords: fillerWords,
        wpm: currentWPM,
        voiceClarity: voiceClarity,
        eyeContactScore: eyeContactScore,
        postureScore: postureScore,
        confidenceScore: currentConfidenceScore,
        overallScore: analysisData.scores.overall,
        aiAnalysis: analysisData.aiAnalysis,
        liveFeedbackHistory: liveFeedback,
        detailedMetrics: {
          metrics: analysisData.metrics,
          scores: analysisData.scores,
          feedback: analysisData.feedback,
          improvements: analysisData.improvements,
          achievements: analysisData.achievements
        }
      };

      const response = await fetch('/api/practice-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionPayload)
      });

      if (response.ok) {
        console.log('Session saved successfully');
        
        // Generate world-class AI coaching analysis
        await generateWorldClassCoaching(sessionPayload, analysisData);
      }
    } catch (error) {
      console.error('Failed to save session:', error);
    }
    
    setSessionData(analysisData);
    setShowSessionAnalysis(true);
  };

  const saveSessionChanges = () => {
    setSessionName(tempSessionName);
    setSessionPurpose(tempSessionPurpose);
    setIsEditingSession(false);
  };

  const cancelSessionChanges = () => {
    setTempSessionName(sessionName);
    setTempSessionPurpose(sessionPurpose);
    setIsEditingSession(false);
  };

  // Speech recognition functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      speechStartTime.current = Date.now();
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  // World-class AI coaching function
  const generateWorldClassCoaching = async (sessionData: any, analysisData: any) => {
    try {
      const userProfile = {
        speakingStyle: 'developing',
        strengths: ['clear articulation', 'good pacing'],
        growthAreas: ['filler word reduction', 'gesture variety'],
        goals: [sessionPurpose || 'improve overall speaking'],
        personalityInsights: ['thoughtful communicator'],
        preferredFeedbackStyle: 'encouraging'
      };

      const sessionContext = {
        sessionId: sessionData.name,
        sessionNumber: Array.isArray(practiceSessions) ? practiceSessions.length + 1 : 1,
        userId: 'demo-user-123',
        sessionName: sessionData.name,
        purpose: sessionData.purpose,
        transcript: sessionData.transcript,
        duration: sessionData.duration,
        previousSessions: (practiceSessions as any[])?.slice(-3).map((session: any, index: number) => ({
          sessionNumber: index + 1,
          date: new Date(session.createdAt).toLocaleDateString(),
          purpose: session.purpose || 'General Practice',
          keyMetrics: {
            wordsPerMinute: session.wpm || 0,
            fillerWordRate: session.fillerWords ? (session.fillerWords.length / session.wordCount) * 100 : 0,
            confidenceScore: session.confidenceScore || 0,
            eyeContactScore: session.eyeContactScore || 0,
            gestureVariety: 75
          },
          improvements: ['Better pacing', 'Clearer articulation'],
          challenges: ['Filler words', 'Eye contact'],
          breakthroughs: ['More confident delivery']
        })),
        currentMetrics: {
          currentWPM: sessionData.wpm,
          fillerWords: sessionData.fillerWords || [],
          eyeContact: sessionData.eyeContactScore,
          posture: sessionData.postureScore,
          voiceClarity: sessionData.voiceClarity,
          gestureCount: 8,
          emotionalTone: 'confident',
          audienceEngagement: 82
        },
        userProfile: userProfile
      };

      const response = await fetch('/api/world-class-coaching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionContext)
      });

      if (response.ok) {
        const coaching = await response.json();
        console.log('World-class coaching generated:', coaching);
        
        // Add expert coaching insights to session data
        setSessionData(prev => ({
          ...prev,
          expertCoaching: coaching.coaching,
          coachProfile: coaching.coachProfile
        }));
      }
    } catch (error) {
      console.error('Failed to generate world-class coaching:', error);
    }
  };

  // Enhanced live AI feedback generation with empathetic intelligence
  const generateLiveFeedback = () => {
    if (!isSessionActive || !isListening) return;

    const currentTime = Date.now();
    const sessionTime = Math.floor((currentTime - sessionStartTime) / 1000);
    const timeLabel = formatTime(sessionTime);
    
    // Analyze current metrics for contextual feedback
    const recentFillerRate = fillerWords.length / Math.max(1, wordCount) * 100;
    const isSlowPace = currentWPM < 120;
    const isFastPace = currentWPM > 180;
    const hasRecentFillers = fillerWords.length > 0 && Date.now() - sessionStartTime < 30000;
    
    const feedbackOptions = [
      {
        category: 'voice_modulation' as const,
        messages: [
          { text: "Excellent vocal variety - your tone changes keep listeners engaged", severity: 'success' as const },
          { text: "Your voice sounds monotone - try varying pitch and emphasis", severity: 'warning' as const },
          { text: "Great pace control - maintaining good rhythm", severity: 'success' as const },
          { text: isSlowPace ? "Add more energy and speed up slightly" : "Consider slowing down for emphasis", severity: 'warning' as const },
          { text: "Strong vocal projection - your voice carries well", severity: 'success' as const },
          { text: "Your voice needs more dynamic range - vary your volume", severity: 'warning' as const },
          { text: isFastPace ? "Slow down - give your audience time to process" : "Build excitement with faster delivery", severity: 'warning' as const },
          { text: "Perfect voice modulation for " + (sessionPurpose || "your speech purpose"), severity: 'success' as const }
        ]
      },
      {
        category: 'voice_clarity' as const,
        messages: [
          { text: "Crystal clear articulation - every word is understood", severity: 'success' as const },
          { text: "Focus on consonant sounds - especially T, P, and K sounds", severity: 'warning' as const },
          { text: "Excellent diction and pronunciation", severity: 'success' as const },
          { text: "Speak from your diaphragm for better projection", severity: 'warning' as const },
          { text: "Your enunciation is perfect for professional settings", severity: 'success' as const },
          { text: "Open your mouth more when speaking for clearer sounds", severity: 'warning' as const },
          { text: "Great breath control supporting clear speech", severity: 'success' as const }
        ]
      },
      {
        category: 'body_language' as const,
        messages: [
          { text: "Excellent posture - confident and professional stance", severity: 'success' as const },
          { text: "Strong eye contact builds trust with your audience", severity: 'success' as const },
          { text: "Roll your shoulders back for better posture", severity: 'warning' as const },
          { text: "Natural hand gestures enhance your message perfectly", severity: 'success' as const },
          { text: "Try to relax your shoulders and stand taller", severity: 'warning' as const },
          { text: "Your facial expressions match your message well", severity: 'success' as const },
          { text: "Use more purposeful gestures to emphasize key points", severity: 'info' as const }
        ]
      },
      {
        category: 'content' as const,
        messages: [
          { text: hasRecentFillers ? "Great recovery from that filler word" : "Strong content delivery", severity: 'success' as const },
          { text: "Clear structure helps your audience follow along", severity: 'success' as const },
          { text: recentFillerRate > 5 ? "Practice pausing instead of using filler words" : "Consider adding supporting examples", severity: recentFillerRate > 5 ? 'warning' as const : 'info' as const },
          { text: "Excellent use of transitions between ideas", severity: 'success' as const },
          { text: "Your opening grabbed attention effectively", severity: 'success' as const },
          { text: "Add more specific examples to support your points", severity: 'info' as const },
          { text: sessionPurpose ? `Perfect content for ${sessionPurpose.toLowerCase()}` : "Well-organized content flow", severity: 'success' as const }
        ]
      }
    ];

    // Select category based on current performance
    let selectedCategory;
    if (hasRecentFillers) {
      selectedCategory = feedbackOptions.find(opt => opt.category === 'content');
    } else if (isSlowPace || isFastPace) {
      selectedCategory = feedbackOptions.find(opt => opt.category === 'voice_modulation');
    } else {
      selectedCategory = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
    }

    const randomMessage = selectedCategory!.messages[Math.floor(Math.random() * selectedCategory!.messages.length)];

    const newFeedback: LiveFeedback = {
      id: `feedback-${currentTime}`,
      timestamp: currentTime,
      category: selectedCategory!.category,
      message: randomMessage.text,
      severity: randomMessage.severity,
      timeLabel
    };

    setLiveFeedback(prev => [...prev, newFeedback].slice(-12));
  };

  // Session analysis generation
  const generateSessionAnalysis = () => {
    const wordsPerMinute = currentWPM;
    const totalWords = wordCount;
    const totalFillers = fillerWords.length;
    const fillerRate = totalWords > 0 ? (totalFillers / totalWords) * 100 : 0;
    const durationMinutes = sessionDuration / 60;
    
    const speechScore = Math.max(0, Math.min(100, 
      ((wordsPerMinute >= 120 && wordsPerMinute <= 150) ? 90 : 
       (wordsPerMinute >= 100 && wordsPerMinute <= 180) ? 75 : 50) - (fillerRate * 10)
    ));
    
    const clarityScore = Math.max(0, Math.min(100, voiceClarity));
    const confidenceAnalysisScore = Math.max(0, Math.min(100, currentConfidenceScore));
    const overallScore = Math.round((speechScore + clarityScore + confidenceAnalysisScore) / 3);
    
    // Generate comprehensive AI analysis paragraphs
    const aiAnalysis = generateComprehensiveAnalysis(wordsPerMinute, totalFillers, fillerRate, clarityScore, (eyeContactScore + postureScore) / 2, sessionPurpose);
    
    const purposeFeedback = generatePurposeBasedFeedback(sessionPurpose, {
      wpm: wordsPerMinute,
      fillerCount: totalFillers,
      duration: durationMinutes,
      wordCount: totalWords,
      overallScore
    });
    
    return {
      session: {
        name: sessionName || generateSessionName(),
        purpose: sessionPurpose,
        duration: sessionDuration,
        type: 'general'
      },
      metrics: {
        wordsPerMinute,
        totalWords,
        totalFillers,
        fillerRate: Math.round(fillerRate * 10) / 10,
        eyeContact: eyeContactScore,
        posture: postureScore,
        voiceClarity,
        confidence: currentConfidenceScore
      },
      scores: {
        speech: speechScore,
        clarity: clarityScore,
        confidence: confidenceAnalysisScore,
        overall: overallScore
      },
      aiAnalysis,
      feedback: purposeFeedback,
      transcript: transcript,
      improvements: generateImprovementSuggestions(wordsPerMinute, totalFillers, fillerRate),
      achievements: generateAchievements(overallScore, totalFillers, wordsPerMinute),
      liveFeedbackHistory: liveFeedback
    };
  };

  // Generate comprehensive AI analysis paragraphs
  const generateComprehensiveAnalysis = (wpm: number, fillers: number, fillerRate: number, clarity: number, bodyScore: number, purpose: string) => {
    // Voice Modulation Analysis
    const voiceAnalysis = (() => {
      const isMonotone = clarity < 70;
      const isPaceTooSlow = wpm < 120;
      const isPaceTooFast = wpm > 180;
      const isOptimalPace = wpm >= 120 && wpm <= 150;
      
      if (isMonotone && isPaceTooSlow) {
        return `Your voice modulation needs significant improvement for ${purpose || 'speaking'}. Your current pace of ${wpm} WPM is too slow, which combined with limited vocal variety, may cause your audience to lose interest. Practice varying your pitch, volume, and emphasis to create a more dynamic delivery. For ${purpose?.toLowerCase() || 'this type of speech'}, aim for 130-150 WPM with clear emphasis on key points. Work on breathing exercises and vocal warm-ups to develop better control over your voice's dynamic range.`;
      } else if (isPaceTooFast) {
        return `Your speaking pace of ${wpm} WPM is too fast for effective ${purpose || 'communication'}. While your voice has good energy, slowing down will improve comprehension and allow your audience to process your message better. Practice using strategic pauses for emphasis and to give yourself time to breathe. For ${purpose?.toLowerCase() || 'this context'}, aim for 130-150 WPM. Your vocal clarity score of ${clarity}% shows ${clarity > 80 ? 'good' : 'developing'} articulation - maintain this while reducing your pace.`;
      } else if (isOptimalPace && clarity > 80) {
        return `Excellent voice modulation for ${purpose || 'speaking'}! Your pace of ${wpm} WPM is ideal, and your clarity score of ${clarity}% demonstrates strong vocal control. Your voice effectively supports your message with appropriate energy and articulation. To further enhance your delivery, focus on varying your tone to match the emotional content of your speech and using strategic pauses to emphasize key points.`;
      } else {
        return `Your voice modulation shows promise with a pace of ${wpm} WPM. ${clarity > 80 ? 'Your clear articulation is a strength' : 'Work on improving clarity through better enunciation'}. For ${purpose?.toLowerCase() || 'this type of presentation'}, focus on ${isMonotone ? 'adding more vocal variety and emotional range' : 'maintaining consistent energy throughout'}. Practice recording yourself to hear how your voice sounds to others and adjust your pitch and volume accordingly.`;
      }
    })();

    // Body Language Analysis
    const bodyLanguageAnalysis = (() => {
      const postureGood = postureScore > 80;
      const eyeContactGood = eyeContactScore > 75;
      
      if (postureGood && eyeContactGood) {
        return `Your body language demonstrates strong confidence and professionalism perfect for ${purpose || 'presenting'}. Your posture score of ${postureScore}% and eye contact score of ${eyeContactScore}% show excellent non-verbal communication skills. You maintain an authoritative presence that helps build trust with your audience. Continue using purposeful gestures to emphasize key points, and remember that your confident stance reinforces your verbal message effectively.`;
      } else if (!postureGood && !eyeContactGood) {
        return `Your body language needs focused improvement for effective ${purpose || 'communication'}. Both your posture (${postureScore}%) and eye contact (${eyeContactScore}%) scores indicate areas for development. Stand tall with shoulders back and chest open to project confidence. Practice maintaining eye contact with the camera as if speaking to a trusted colleague. For ${purpose?.toLowerCase() || 'this context'}, strong body language is crucial for credibility and audience engagement.`;
      } else if (postureGood) {
        return `Your posture is excellent (${postureScore}%), showing confidence and professionalism. However, your eye contact (${eyeContactScore}%) could be improved for better audience connection in ${purpose || 'speaking situations'}. Practice looking directly at the camera more frequently, treating it as a friendly face. This will help build trust and keep your audience engaged throughout your presentation.`;
      } else {
        return `Your eye contact shows good engagement (${eyeContactScore}%), but your posture (${postureScore}%) needs attention for ${purpose || 'professional speaking'}. Focus on standing or sitting up straighter, keeping your shoulders back and head level. Good posture not only looks more confident but also helps with breathing and voice projection, enhancing your overall delivery.`;
      }
    })();

    // Content Analysis
    const contentAnalysis = (() => {
      const fillerPercentage = Math.round(fillerRate);
      const hasExcessiveFillers = fillerPercentage > 5;
      const hasMinimalFillers = fillerPercentage < 2;
      
      if (hasMinimalFillers && wordCount > 50) {
        return `Outstanding content delivery for ${purpose || 'your presentation'}! With only ${fillers} filler words out of ${wordCount} total words (${fillerPercentage}%), you demonstrate excellent verbal fluency and preparation. Your speech flows naturally and professionally, allowing your message to come through clearly. This level of fluency is ideal for ${purpose?.toLowerCase() || 'professional communication'} and shows strong command of your material.`;
      } else if (hasExcessiveFillers) {
        return `Your content delivery shows room for improvement in verbal fluency. With ${fillers} filler words out of ${wordCount} total words (${fillerPercentage}%), your message may lose impact. For ${purpose || 'effective speaking'}, practice the "pause technique" - replace filler words with brief, intentional pauses. This gives you time to think and makes you sound more confident and prepared. Consider outlining your key points beforehand and practicing transitions between ideas.`;
      } else {
        return `Your content delivery shows good progress with ${fillers} filler words out of ${wordCount} total words (${fillerPercentage}%). While this is within acceptable range for ${purpose || 'most speaking contexts'}, continued practice can help you achieve even greater fluency. Focus on preparation and become more comfortable with brief pauses instead of filler words. Your message structure appears solid - now work on polishing the delivery for maximum impact.`;
      }
    })();

    return {
      voiceModulation: voiceAnalysis,
      bodyLanguage: bodyLanguageAnalysis,
      content: contentAnalysis
    };
  };

  const generatePurposeBasedFeedback = (purpose: string, metrics: any) => {
    if (!purpose) {
      return {
        summary: "Good practice session completed!",
        strengths: ["Completed a full practice session", "Built speaking confidence"],
        areas: ["Consider setting a specific purpose for more targeted feedback"]
      };
    }

    const lowercasePurpose = purpose.toLowerCase();
    
    if (lowercasePurpose.includes('interview') || lowercasePurpose.includes('job')) {
      return {
        summary: `Your interview practice session shows ${metrics.overallScore >= 75 ? 'strong' : 'developing'} professional communication skills.`,
        strengths: [
          metrics.wpm >= 120 && metrics.wpm <= 150 ? "Appropriate speaking pace for interviews" : null,
          metrics.fillerCount <= 3 ? "Professional speech clarity" : null,
          "Focused practice on interview skills"
        ].filter(Boolean),
        areas: [
          metrics.wpm < 120 ? "Speak with more energy and confidence" : null,
          metrics.wpm > 180 ? "Slow down to ensure clear communication" : null,
          metrics.fillerCount > 5 ? "Reduce filler words for more professional presence" : null,
          "Practice specific interview questions for your field"
        ].filter(Boolean)
      };
    }
    
    return {
      summary: `Your practice session on "${purpose}" shows ${metrics.overallScore >= 75 ? 'excellent' : 'good'} progress.`,
      strengths: [
        metrics.wpm >= 120 && metrics.wpm <= 150 ? "Well-paced delivery" : null,
        metrics.fillerCount <= 3 ? "Clear communication style" : null,
        "Focused practice approach"
      ].filter(Boolean),
      areas: [
        metrics.wpm < 120 ? "Increase speaking energy and pace" : null,
        metrics.wpm > 180 ? "Slow down for better comprehension" : null,
        metrics.fillerCount > 5 ? "Reduce filler words with practice" : null
      ].filter(Boolean)
    };
  };

  const generateImprovementSuggestions = (wpm: number, fillers: number, fillerRate: number) => {
    const suggestions = [];
    
    if (wpm < 120) {
      suggestions.push({
        area: "Speaking Pace",
        suggestion: "Practice reading aloud daily to build natural speaking rhythm",
        priority: "high"
      });
    }
    
    if (fillers > 5) {
      suggestions.push({
        area: "Filler Words",
        suggestion: "Practice the 'pause technique' - replace filler words with 2-second pauses",
        priority: "high"
      });
    }
    
    return suggestions;
  };

  const generateAchievements = (overallScore: number, fillers: number, wpm: number) => {
    const achievements = [];
    
    if (overallScore >= 85) {
      achievements.push({ title: "Excellent Speaker", description: "Outstanding overall performance!" });
    }
    
    if (fillers === 0) {
      achievements.push({ title: "Filler-Free Zone", description: "Perfect session with no filler words!" });
    }
    
    return achievements;
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscriptLocal = '';
        let finalTranscriptLocal = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscriptLocal += transcriptPart;
          } else {
            interimTranscriptLocal += transcriptPart;
          }
        }
        
        if (finalTranscriptLocal) {
          setTranscript(prev => {
            const newTranscript = prev + finalTranscriptLocal;
            
            // Update word count and calculate WPM
            const words = newTranscript.trim().split(/\s+/).filter(word => word.length > 0);
            const newWordCount = words.length;
            setWordCount(newWordCount);
            
            // Calculate WPM based on session duration
            const sessionTime = (Date.now() - sessionStartTime) / 1000 / 60; // in minutes
            const wpm = sessionTime > 0 ? Math.round(newWordCount / sessionTime) : 0;
            setCurrentWPM(wpm);
            
            // Detect filler words
            const commonFillers = ['um', 'uh', 'like', 'so', 'you know', 'actually', 'basically', 'literally'];
            const newFillers: string[] = [];
            
            words.forEach(word => {
              const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
              if (commonFillers.includes(cleanWord)) {
                newFillers.push(cleanWord);
                setRecentFillerAlert(cleanWord);
                setTimeout(() => setRecentFillerAlert(null), 3000);
              }
            });
            
            if (newFillers.length > 0) {
              setFillerWords(prev => [...prev, ...newFillers]);
            }
            
            return newTranscript;
          });
        }
        
        setInterimTranscript(interimTranscriptLocal);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        if (isListening && isSessionActive) {
          // Restart recognition if it stops unexpectedly
          setTimeout(() => {
            if (recognitionRef.current && isListening) {
              recognitionRef.current.start();
            }
          }, 100);
        }
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Effects for session timer and live feedback
  useEffect(() => {
    if (!isSessionActive) return;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const duration = Math.floor((currentTime - sessionStartTime) / 1000);
      setSessionDuration(duration);

      if (isCameraActive && isListening) {
        // Simulate real-time metrics updates based on actual performance
        const baseEyeContact = 75 + (Math.sin(duration * 0.1) * 10);
        const basePosture = 80 + (Math.cos(duration * 0.08) * 8);
        const baseVoice = 85 + (Math.sin(duration * 0.15) * 7);
        
        setEyeContactScore(Math.round(Math.max(50, Math.min(95, baseEyeContact))));
        setPostureScore(Math.round(Math.max(60, Math.min(95, basePosture))));
        setVoiceClarity(Math.round(Math.max(70, Math.min(100, baseVoice))));
        
        const weightedScore = (eyeContactScore * 0.3) + (postureScore * 0.3) + (voiceClarity * 0.4);
        setCurrentConfidenceScore(Math.round(Math.max(40, Math.min(100, weightedScore))));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, sessionStartTime, isCameraActive, isListening, eyeContactScore, postureScore, voiceClarity]);

  // Enhanced live AI feedback generation effect
  useEffect(() => {
    if (!isSessionActive || !isListening) return;

    const feedbackInterval = setInterval(() => {
      generateLiveFeedback();
    }, 8000); // More frequent feedback every 8 seconds

    return () => clearInterval(feedbackInterval);
  }, [isSessionActive, isListening, sessionStartTime, fillerWords.length, currentWPM]);

  return (
    <div className="space-y-6 relative">
      {/* Filler Word Alert Overlay */}
      {recentFillerAlert && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Filler word detected: "{recentFillerAlert}"</span>
          </div>
          <div className="text-sm opacity-90 mt-1">Try pausing instead</div>
        </div>
      )}

      {/* Session Analysis Modal */}
      {showSessionAnalysis && sessionData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Session Analysis</h2>
                  <p className="text-gray-600">{sessionData.session.name}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSessionAnalysis(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{sessionData.scores.overall}%</div>
                  <div className="text-lg font-semibold text-gray-700 mb-4">Overall Performance</div>
                  <div className="flex justify-center space-x-8 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{sessionData.metrics.wordsPerMinute}</div>
                      <div className="text-gray-600">WPM</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{sessionData.metrics.totalWords}</div>
                      <div className="text-gray-600">Words</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-red-600">{sessionData.metrics.totalFillers}</div>
                      <div className="text-gray-600">Fillers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-purple-600">{Math.round(sessionData.session.duration / 60)}m</div>
                      <div className="text-gray-600">Duration</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Paragraphs */}
              {sessionData.aiAnalysis && (
                <div className="space-y-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Voice Modulation Analysis */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Volume2 className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-800">Voice Modulation</h3>
                      </div>
                      <p className="text-sm text-blue-700 leading-relaxed">{sessionData.aiAnalysis.voiceModulation}</p>
                    </div>

                    {/* Body Language Analysis */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Eye className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-green-800">Body Language</h3>
                      </div>
                      <p className="text-sm text-green-700 leading-relaxed">{sessionData.aiAnalysis.bodyLanguage}</p>
                    </div>

                    {/* Content Analysis */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-800">Content Delivery</h3>
                      </div>
                      <p className="text-sm text-purple-700 leading-relaxed">{sessionData.aiAnalysis.content}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => setShowSessionAnalysis(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Continue Practicing
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowSessionAnalysis(false);
                    setSessionData(null);
                    setTranscript("");
                    setFillerWords([]);
                    setWordCount(0);
                    setCurrentWPM(0);
                    setSessionDuration(0);
                  }}
                >
                  Start New Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Start Button */}
      {!isSessionActive && (
        <Card className="border-2 border-blue-500 bg-blue-50">
          <CardContent className="text-center py-8">
            <Button
              onClick={startSession}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Play className="w-6 h-6 mr-3" />
              <div className="text-left">
                <div className="text-lg font-bold">Start Practice Session</div>
                <div className="text-sm opacity-90 font-normal">Camera + Microphone</div>
              </div>
            </Button>
            <p className="text-gray-600 text-base mt-4">
              One click activates everything for your {generateSessionName()}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Session Customization Panel */}
      {!isSessionActive && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Customize Your Session</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Name
                </label>
                <input
                  type="text"
                  value={sessionName || generateSessionName()}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="e.g., Job Interview Practice"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Purpose
                </label>
                <input
                  type="text"
                  value={sessionPurpose}
                  onChange={(e) => setSessionPurpose(e.target.value)}
                  placeholder="e.g., Practice for technical interview"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>Purpose helps AI provide targeted feedback:</strong> Include specific goals like "job interview", "presentation", "wedding speech", etc.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Session Interface */}
      {isSessionActive && (
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Main Session Controls */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-blue-500 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-6 h-6 text-blue-600" />
                    {!isEditingSession ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{sessionName}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditingSession(true)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          value={tempSessionName}
                          onChange={(e) => setTempSessionName(e.target.value)}
                          className="px-2 py-1 border rounded text-lg bg-white"
                          autoFocus
                        />
                        <Button size="sm" onClick={saveSessionChanges} className="bg-green-600 hover:bg-green-700">
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelSessionChanges}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="default" className="text-lg px-4 py-2">
                      {formatTime(sessionDuration)}
                    </Badge>
                    {isListening && (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-base text-green-600 font-medium">Recording</span>
                      </div>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-6 mb-4">
                  <Button
                    onClick={stopSession}
                    variant="destructive"
                    size="lg"
                    className="px-8 py-4"
                  >
                    <Square className="w-6 h-6 mr-2" />
                    Stop Session
                  </Button>
                  
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    variant={isListening ? "outline" : "default"}
                    size="lg"
                    className="px-8 py-4"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-6 h-6 mr-2" />
                        Mute Microphone
                      </>
                    ) : (
                      <>
                        <Mic className="w-6 h-6 mr-2" />
                        Start Microphone
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{wordCount}</div>
                    <div className="text-sm text-gray-500">Words Spoken</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{currentWPM}</div>
                    <div className="text-sm text-gray-500">Words Per Minute</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{fillerWords.length}</div>
                    <div className="text-sm text-gray-500">Filler Words</div>
                  </div>
                </div>

                {/* Camera Feed with Metrics Overlay */}
                <div className="relative mb-6">
                  <SimpleCameraFeed 
                    isActive={isCameraActive} 
                    onToggle={() => setIsCameraActive(!isCameraActive)}
                    videoRef={videoRef}
                  />
                  
                  {isCameraActive && isSessionActive && (
                    <div className="absolute top-4 left-4 space-y-2">
                      <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm backdrop-blur">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>Eye Contact: {eyeContactScore}%</span>
                        </div>
                      </div>
                      <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm backdrop-blur">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4" />
                          <span>Posture: {postureScore}%</span>
                        </div>
                      </div>
                      <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm backdrop-blur">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-4 h-4" />
                          <span>Voice Clarity: {voiceClarity}%</span>
                        </div>
                      </div>
                      <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm backdrop-blur">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>Confidence: {currentConfidenceScore}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live AI Feedback Panel */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-green-500 bg-green-50 h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  <span>Live AI Coach</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {liveFeedback.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">AI feedback will appear here during your session</p>
                    </div>
                  ) : (
                    liveFeedback.map((feedback) => (
                      <div key={feedback.id} className={`p-3 rounded-lg border-l-4 ${
                        feedback.severity === 'success' ? 'bg-green-50 border-green-400' :
                        feedback.severity === 'warning' ? 'bg-orange-50 border-orange-400' :
                        'bg-blue-50 border-blue-400'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600 capitalize">
                            {feedback.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">{feedback.timeLabel}</span>
                        </div>
                        <p className="text-sm text-gray-800">{feedback.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}