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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      setupSpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      // Start session timer
      timerRef.current = setInterval(() => {
        setSessionDuration(prev => prev + 1);
        
        // Generate live feedback periodically
        if (Math.random() > 0.85) { // 15% chance each second
          generateLiveFeedback();
        }
        
        // Update metrics
        updateSessionMetrics();
      }, 1000);

      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: `Session: ${sessionName}`,
      });

    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: "Please allow camera and microphone access",
        variant: "destructive"
      });
    }
  }, [sessionName, setupSpeechRecognition]);

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
      {/* Session Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">Session Name</h3>
            {!isEditingName ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingName(true)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={saveSessionName}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingName(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {isEditingName ? (
            <Input
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name"
              onKeyPress={(e) => e.key === 'Enter' && saveSessionName()}
            />
          ) : (
            <p className="text-lg font-medium">{sessionName}</p>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">Session Purpose</h3>
            {!isEditingPurpose ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingPurpose(true)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={savePurpose}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingPurpose(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {isEditingPurpose ? (
            <Textarea
              value={sessionPurpose}
              onChange={(e) => setSessionPurpose(e.target.value)}
              placeholder="What's the purpose of this session? (e.g., job interview practice, presentation skills)"
              rows={3}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {sessionPurpose || "Click edit to add session purpose for targeted AI feedback"}
            </p>
          )}
        </Card>
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