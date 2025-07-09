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
  Activity, TrendingUp, FileText, Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SessionDataViewer } from '@/components/SessionDataViewer';

interface SimplifiedMetrics {
  eyeContact: number;
  confidence: number;
  engagement: number;
  wordsPerMinute: number;
  fillerWordCount: number;
  clarity: number;
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
  const [sessionPurpose, setSessionPurpose] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPurpose, setIsEditingPurpose] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [transcript, setTranscript] = useState<string>('');

  // Simplified metrics
  const [metrics, setMetrics] = useState<SimplifiedMetrics>({
    eyeContact: 75,
    confidence: 80,
    engagement: 85,
    wordsPerMinute: 0,
    fillerWordCount: 0,
    clarity: 80
  });

  // Live feedback
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback[]>([]);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

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

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }

      if (finalTranscript.trim()) {
        setTranscript(prev => prev + finalTranscript);
        
        // Simple filler word detection
        const fillerWords = ['um', 'uh', 'like', 'so', 'you know', 'i mean'];
        const detectedFillers = fillerWords.filter(word => 
          finalTranscript.toLowerCase().includes(word)
        );
        
        if (detectedFillers.length > 0) {
          setMetrics(prev => ({
            ...prev,
            fillerWordCount: prev.fillerWordCount + detectedFillers.length
          }));
          
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: `Try to avoid filler words like "${detectedFillers[0]}"`,
            type: 'warning',
            timestamp: Date.now()
          }]);
        }

        // Calculate WPM
        const wordCount = (transcript + finalTranscript).split(' ').length;
        const timeInMinutes = sessionDuration / 60;
        const wpm = timeInMinutes > 0 ? Math.round(wordCount / timeInMinutes) : 0;
        
        setMetrics(prev => ({ ...prev, wordsPerMinute: wpm }));
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current = recognition;
  }, [sessionDuration, transcript]);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 640, height: 480 }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Start speech recognition
      setupSpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      setIsRecording(true);

      // Start timer
      const startTime = Date.now();
      const timer = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Simulate some metrics updates
      const metricsTimer = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          eyeContact: Math.max(40, Math.min(95, prev.eyeContact + (Math.random() - 0.5) * 10)),
          confidence: Math.max(50, Math.min(95, prev.confidence + (Math.random() - 0.5) * 8)),
          engagement: Math.max(60, Math.min(95, prev.engagement + (Math.random() - 0.5) * 6))
        }));
      }, 3000);

      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Recording Failed",
        description: "Please allow camera and microphone access",
        variant: "destructive"
      });
    }
  }, [setupSpeechRecognition, toast]);

  // Stop recording
  const stopRecording = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsRecording(false);

    // Save session
    try {
      const sessionData = {
        userId: 'demo-user',
        sessionName,
        purpose: sessionPurpose,
        duration: sessionDuration,
        transcript,
        overallPerformance: Math.round((metrics.eyeContact + metrics.confidence + metrics.engagement) / 3),
        clarityScore: metrics.clarity,
        volumeConsistency: 80,
        intonationScore: 75,
        paceConsistency: 85,
        engagementLevel: metrics.engagement,
        eyeContactScore: metrics.eyeContact,
        confidenceLevel: metrics.confidence,
        fillerWordCount: metrics.fillerWordCount,
        wordsPerMinute: metrics.wordsPerMinute,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/practice-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      if (response.ok) {
        toast({
          title: "Session Saved",
          description: `${sessionName} saved successfully`,
        });
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }, [sessionName, sessionPurpose, sessionDuration, transcript, metrics, toast]);

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
                    />
                    <Button size="sm" onClick={() => setIsEditingName(false)}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-blue-600">
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
                    <Button size="sm" onClick={() => setIsEditingPurpose(false)}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg text-gray-600">
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
                  <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                    <Mic className="w-5 h-5 mr-2" />
                    Start Practice
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="outline">
                    <Square className="w-5 h-5 mr-2" />
                    Stop ({Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tip */}
        <Alert className="border-green-200 bg-green-50">
          <Eye className="h-4 w-4" />
          <AlertDescription>
            <strong>Tip:</strong> Look directly at your camera lens to maintain eye contact. Aim for 60-80% eye contact during your speech.
          </AlertDescription>
        </Alert>

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
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
                  />
                  
                  {isRecording && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="destructive" className="animate-pulse">
                        <Activity className="w-3 h-3 mr-1" />
                        RECORDING {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Stats */}
          <div className="space-y-4">
            
            {/* Live Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Eye Contact
                    </span>
                    <span className="text-sm font-bold">{Math.round(metrics.eyeContact)}%</span>
                  </div>
                  <Progress value={metrics.eyeContact} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Confidence
                    </span>
                    <span className="text-sm font-bold">{Math.round(metrics.confidence)}%</span>
                  </div>
                  <Progress value={metrics.confidence} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Engagement
                    </span>
                    <span className="text-sm font-bold">{Math.round(metrics.engagement)}%</span>
                  </div>
                  <Progress value={metrics.engagement} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Words Per Minute</span>
                  <span className="font-semibold">{metrics.wordsPerMinute}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Filler Words</span>
                  <span className="font-semibold">{metrics.fillerWordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Words</span>
                  <span className="font-semibold">{transcript.split(' ').filter(w => w.length > 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-semibold">
                    {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Live Feedback */}
            {liveFeedback.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Live Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {liveFeedback.slice(-3).map((feedback) => (
                      <div 
                        key={feedback.id}
                        className={`p-2 rounded text-sm ${
                          feedback.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                          feedback.type === 'success' ? 'bg-green-50 text-green-800' :
                          'bg-blue-50 text-blue-800'
                        }`}
                      >
                        {feedback.message}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Transcript */}
        {transcript && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Live Transcript
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

        {/* Session Data Viewer */}
        {transcript && (
          <SessionDataViewer 
            transcript={transcript}
            sessionDuration={sessionDuration}
            metrics={metrics}
            contentAnalysis={null}
            isRecording={isRecording}
          />
        )}
      </div>
    </div>
  );
}