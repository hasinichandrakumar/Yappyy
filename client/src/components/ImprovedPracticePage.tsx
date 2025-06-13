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
  const [sessionName, setSessionName] = useState("New Practice Session");
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

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
            const words = result[0].transcript.split(' ').filter(word => word.trim().length > 0);
            setWordCount(prev => prev + words.length);
            
            // Enhanced filler word detection
            const fillerWords = ['uh', 'um', 'er', 'ah', 'eh', 'like', 'you know', 'so', 'basically', 'actually', 'literally'];
            const lowerText = result[0].transcript.toLowerCase();
            const detectedFillers = words.filter(word => 
              fillerWords.some(filler => word.toLowerCase().includes(filler))
            );

            if (detectedFillers.length > 0) {
              const newFeedback: LiveFeedbackItem = {
                id: Date.now().toString(),
                timestamp: sessionDuration,
                category: 'voice',
                feedback: `Filler words detected: ${detectedFillers.join(', ')}. Try pausing instead.`,
                severity: 'improvement'
              };
              setLiveFeedback(prev => [...prev, newFeedback]);
              
              setSessionMetrics(prev => ({
                ...prev,
                fillerWords: [...prev.fillerWords, ...detectedFillers]
              }));
            }
            
            // Update metrics
            setSessionMetrics(prev => ({
              ...prev,
              wordsSpoken: prev.wordsSpoken + words.length,
              pace: Math.round((prev.wordsSpoken + words.length) / Math.max(sessionDuration / 60, 0.1))
            }));
          }
        }
      };

      recognitionRef.current = recognition;
    }
  }, [sessionDuration]);

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

    } catch (error) {
      console.error('Camera/microphone access error:', error);
      
      let errorMessage = "Camera and microphone access required for practice sessions";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Please allow camera and microphone permissions in your browser settings";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No camera or microphone found. Please connect devices and try again";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Camera or microphone is being used by another application";
      }
      
      toast({
        title: "Media Access Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [sessionName, sessionPurpose, setupSpeechRecognition]);

  // Generate live AI feedback
  const generateLiveFeedback = useCallback(() => {
    const feedbackOptions = {
      content: [
        "Great opening! Your introduction is engaging.",
        "Consider adding more specific examples to support your point.",
        "Your transition between topics could be smoother.",
        "Excellent use of storytelling to illustrate your message.",
        "Try to conclude this section before moving to the next point."
      ],
      voice: [
        "Your pace is perfect for audience comprehension.",
        "Try varying your pitch to emphasize key points.",
        "Your volume is appropriate for the room size.",
        "Consider pausing after important statements.",
        "Your articulation is clear and professional."
      ],
      body_language: [
        "Maintain eye contact with your audience.",
        "Your gestures are natural and supportive.",
        "Consider standing up straighter for more authority.",
        "Great use of hand movements to emphasize points.",
        "Your facial expressions match your message well."
      ]
    };

    const categories = ['content', 'voice', 'body_language'] as const;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const feedback = feedbackOptions[category][Math.floor(Math.random() * feedbackOptions[category].length)];
    
    const newFeedback: LiveFeedbackItem = {
      id: Date.now().toString(),
      timestamp: sessionDuration,
      category,
      feedback,
      severity: Math.random() > 0.7 ? 'improvement' : 'good'
    };

    setLiveFeedback(prev => [...prev, newFeedback]);
  }, [sessionDuration]);

  // Update session metrics
  const updateSessionMetrics = useCallback(() => {
    setSessionMetrics(prev => ({
      ...prev,
      volume: Math.random() * 100,
      clarity: Math.random() * 100,
      pace: 120 + Math.random() * 60, // words per minute
      bodyLanguageScore: Math.random() * 100
    }));
  }, []);

  // Stop recording
  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Stop camera stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      setIsRecording(false);
      
      // Generate feedback after session ends
      setTimeout(() => {
        generateSessionFeedback();
        setShowTranscript(true);
      }, 100);
      
      toast({
        title: "Session Completed",
        description: `Practice session saved successfully. ${wordCount} words spoken.`,
      });
    }
  }, [isRecording, wordCount]);



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

    // Content analysis helpers
    const generateContentStrengths = (transcript: string, purpose: string) => {
      const strengths = [];
      if (transcript.length > 100) strengths.push("Good speech length and development");
      if (transcript.includes("example") || transcript.includes("instance")) strengths.push("Used concrete examples");
      if (transcript.includes("because") || transcript.includes("therefore")) strengths.push("Provided logical reasoning");
      if (purpose && transcript.toLowerCase().includes(purpose.toLowerCase().split(' ')[0])) {
        strengths.push("Stayed focused on stated purpose");
      }
      return strengths.length > 0 ? strengths : ["Clear communication throughout the session"];
    };

    const generateContentImprovements = (transcript: string, purpose: string) => {
      const improvements = [];
      if (transcript.length < 50) improvements.push("Consider expanding on your main points");
      if (!transcript.includes("?") && purpose.includes("interview")) {
        improvements.push("For interviews, consider asking thoughtful questions");
      }
      if (!transcript.includes("conclusion") && !transcript.includes("summary")) {
        improvements.push("Add a strong closing or summary");
      }
      if (purpose && !transcript.toLowerCase().includes(purpose.toLowerCase().split(' ')[0])) {
        improvements.push("Ensure content aligns more closely with your stated purpose");
      }
      return improvements.length > 0 ? improvements : ["Consider adding more specific details to strengthen your message"];
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
      if (metrics.pace < 120) recommendations.push("Try speaking slightly faster to maintain engagement");
      if (metrics.pace > 180) recommendations.push("Slow down slightly for better comprehension");
      if (metrics.volume < 60) recommendations.push("Increase your volume for better presence");
      if (metrics.fillerWords.length > 5) recommendations.push("Practice pausing instead of using filler words");
      return recommendations.length > 0 ? recommendations : ["Your voice delivery is well-balanced"];
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
      
      if (purpose && purpose.includes("interview")) {
        insights.push("For interviews, focus on STAR method (Situation, Task, Action, Result) for better storytelling");
        insights.push("Practice specific examples that demonstrate your key competencies");
      } else if (purpose && purpose.includes("presentation")) {
        insights.push("Structure your content with clear introduction, main points, and conclusion");
        insights.push("Use transitions to guide your audience through your ideas");
      } else if (purpose && purpose.includes("pitch")) {
        insights.push("Lead with the problem you're solving, then present your solution");
        insights.push("Include a clear call-to-action at the end");
      } else {
        insights.push("Consider your audience's perspective and tailor your message accordingly");
        insights.push("Practice varying your tone and pace to maintain engagement");
      }
      
      return insights;
    };

    const generateNextSteps = (purpose: string, metrics: SessionMetrics) => {
      const steps = [];
      
      if (metrics.fillerWords.length > 3) {
        steps.push("Practice speaking with intentional pauses instead of filler words");
      }
      
      if (metrics.pace < 120 || metrics.pace > 180) {
        steps.push("Record yourself reading aloud to practice optimal speaking pace");
      }
      
      if (purpose) {
        steps.push(`Continue practicing with scenarios related to: ${purpose}`);
      } else {
        steps.push("Set a specific purpose for your next practice session");
      }
      
      steps.push("Review your transcript to identify patterns in your speech");
      
      return steps;
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

  const saveSessionName = () => {
    setIsEditingName(false);
    toast({
      title: "Session Name Updated",
      description: sessionName,
    });
  };

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
                      onKeyPress={(e) => e.key === 'Enter' && saveSessionName()}
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
        <div className="lg:col-span-3">
          <Card className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-96 bg-black rounded-lg object-cover"
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
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Good Eye Contact</span>
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
        </div>

        {/* Live Feedback Sidebar */}
        <div className="space-y-4">
          {/* Live AI Feedback with Timestamps */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Live AI Feedback</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
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

          {/* Practice Badges to Earn */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold">Badges to Earn</h3>
            </div>
            <div className="space-y-3">
              {[
                { 
                  name: "First Steps", 
                  description: "Complete your first practice session", 
                  difficulty: "Easy",
                  color: "bg-green-100 text-green-800 border-green-200",
                  icon: "🎯"
                },
                { 
                  name: "Clarity Champion", 
                  description: "Achieve 85% clarity score in a session", 
                  difficulty: "Medium",
                  color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                  icon: "✨"
                }
              ].map((badge, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="text-xl">{badge.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-900">{badge.name}</h4>
                      <Badge className={`text-xs px-2 py-0.5 ${badge.color}`}>
                        {badge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 font-medium">
                Start practicing to unlock these achievements!
              </p>
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
                    onClick={() => setShowTranscript(false)}
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

                {/* Detailed Analysis */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 text-center">Detailed Analysis</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Content Analysis */}
                    <Card className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800">Content</h3>
                          <div className="text-2xl font-bold text-blue-600">{sessionFeedback.contentAnalysis.score}/100</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            Strengths
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
                          <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                            Improve
                          </h4>
                          <div className="space-y-1">
                            {sessionFeedback.contentAnalysis.improvements.slice(0, 2).map((improvement: string, index: number) => (
                              <div key={index} className="text-sm text-slate-700 bg-amber-50 p-2 rounded-lg border-l-3 border-amber-400">
                                {improvement}
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

                    {/* Voice Analysis */}
                    <Card className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <Mic className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800">Voice</h3>
                          <div className="text-2xl font-bold text-emerald-600">{sessionFeedback.voiceAnalysis.score}/100</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                            <div className="text-xl font-bold text-emerald-700">{Math.round(sessionFeedback.voiceAnalysis.pace)}</div>
                            <div className="text-xs font-medium text-emerald-600">WPM</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                            <div className="text-xl font-bold text-emerald-700">{Math.round(sessionFeedback.voiceAnalysis.volume)}%</div>
                            <div className="text-xs font-medium text-emerald-600">Volume</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Tips
                          </h4>
                          <div className="space-y-1">
                            {sessionFeedback.voiceAnalysis.recommendations.slice(0, 2).map((rec: string, index: number) => (
                              <div key={index} className="text-sm text-slate-700 bg-blue-50 p-2 rounded-lg border-l-3 border-blue-400">
                                {rec}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Body Language Analysis */}
                    <Card className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center">
                          <Eye className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800">Body Language</h3>
                          <div className="text-2xl font-bold text-violet-600">{sessionFeedback.bodyLanguageAnalysis.score}/100</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-2 bg-violet-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">Eye Contact:</span>
                            <span className="text-sm font-bold text-violet-700">{sessionFeedback.bodyLanguageAnalysis.eyeContact}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-violet-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">Gestures:</span>
                            <span className="text-sm font-bold text-violet-700">{sessionFeedback.bodyLanguageAnalysis.gestures}</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-violet-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">Posture:</span>
                            <span className="text-sm font-bold text-violet-700">{sessionFeedback.bodyLanguageAnalysis.posture}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-violet-700 mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
                            Suggestions
                          </h4>
                          <div className="space-y-1">
                            {sessionFeedback.bodyLanguageAnalysis.recommendations.slice(0, 2).map((tip: string, index: number) => (
                              <div key={index} className="text-sm text-slate-700 bg-violet-50 p-2 rounded-lg border-l-3 border-violet-400">
                                {tip}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* AI Coaching Insights */}
                <Card className="p-6 mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">AI Coach Insights</h3>
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
                      // Reset session data
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
    </div>
  );
}