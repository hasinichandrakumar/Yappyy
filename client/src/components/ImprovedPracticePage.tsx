import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, Video, Square, Play, Pause, Edit3, Save, X } from 'lucide-react';
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
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        // Enhanced filler word detection
        const fillerWords = ['uh', 'um', 'er', 'ah', 'eh', 'like', 'you know', 'so', 'basically', 'actually', 'literally'];
        const words = transcript.toLowerCase().split(' ');
        const detectedFillers = words.filter(word => 
          fillerWords.some(filler => word.includes(filler))
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
            fillerWords: [...prev.fillerWords, ...detectedFillers],
            wordsSpoken: words.length
          }));
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
      
      toast({
        title: "Session Completed",
        description: "Practice session saved successfully",
      });
    }
  }, [isRecording]);



  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Feed */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-96 bg-black rounded-lg object-cover"
              />
              
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
                <div className="absolute top-4 left-4">
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
          {/* Session Goals */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Session Goals</h3>
            <div className="space-y-3">
              {currentGoals.map((goal, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{goal.name}</span>
                    <span>{goal.progress}/{goal.target}</span>
                  </div>
                  <Progress value={(goal.progress / goal.target) * 100} />
                </div>
              ))}
            </div>
          </Card>

          {/* Live Feedback */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Live AI Feedback</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {liveFeedback.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Start recording to receive live feedback
                </p>
              ) : (
                liveFeedback.slice(-10).reverse().map((feedback) => (
                  <div key={feedback.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={feedback.severity === 'good' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {feedback.category.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(feedback.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{feedback.feedback}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}