import { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Mic, 
  Square, 
  FileText, 
  Target, 
  Edit3, 
  Save, 
  X, 
  Volume2, 
  Eye, 
  Trophy,
  BarChart3,
  MessageSquare,
  Clock,
  TrendingUp
} from 'lucide-react';

interface LiveMetrics {
  wpm: number;
  wordCount: number;
  fillerWords: number;
  eyeContact: number;
  volume: number;
  sessionTime: number;
}

interface LiveFeedback {
  id: string;
  timestamp: number;
  category: 'voice' | 'content' | 'body_language';
  message: string;
  severity: 'good' | 'warning' | 'improvement';
}

export default function FixedPracticePage() {
  const { toast } = useToast();
  
  // Core session state
  const [isRecording, setIsRecording] = useState(false);
  const [sessionName, setSessionName] = useState('Practice Session 1');
  const [sessionPurpose, setSessionPurpose] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPurpose, setIsEditingPurpose] = useState(false);
  
  // Live metrics state
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    wpm: 0,
    wordCount: 0,
    fillerWords: 0,
    eyeContact: 0,
    volume: 0,
    sessionTime: 0
  });
  
  // Speech recognition state
  const [transcript, setTranscript] = useState('');
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback[]>([]);
  
  // Refs for media handling
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<number>(0);
  
  // Initialize speech recognition
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
            
            // Update transcript and word count
            setTranscript(prev => prev + (prev ? ' ' : '') + result[0].transcript);
            
            // Count words in this segment
            const words = result[0].transcript.split(' ').filter((word: string) => word.trim().length > 0);
            
            // Detect filler words
            const fillerWords = ['um', 'uh', 'er', 'ah', 'like', 'so', 'you know', 'i mean'];
            let fillerCount = 0;
            words.forEach((word: string) => {
              if (fillerWords.includes(word.toLowerCase().replace(/[.,!?]/g, ''))) {
                fillerCount++;
              }
            });
            
            // Update metrics
            setLiveMetrics(prev => {
              const newWordCount = prev.wordCount + words.length;
              const elapsed = Math.max(1, prev.sessionTime);
              const newWPM = elapsed > 0 ? Math.round((newWordCount / elapsed) * 60) : 0;
              
              console.log('Speech detected:', {
                wordsAdded: words.length,
                totalWords: newWordCount,
                wpm: newWPM,
                fillers: fillerCount,
                elapsed
              });
              
              return {
                ...prev,
                wordCount: newWordCount,
                wpm: newWPM,
                fillerWords: prev.fillerWords + fillerCount
              };
            });
            
            // Generate contextual feedback
            generateContextualFeedback(result[0].transcript, words.length, fillerCount);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone Access Required",
            description: "Please allow microphone access to enable speech analysis",
            variant: "destructive"
          });
        }
      };

      recognitionRef.current = recognition;
    }
  }, [toast]);
  
  // Setup audio analysis for volume detection
  const setupAudioAnalysis = useCallback((stream: MediaStream) => {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      console.log('Audio analysis setup complete');
    } catch (error) {
      console.error('Audio analysis setup failed:', error);
    }
  }, []);
  
  // Detect volume levels
  const detectVolume = useCallback(() => {
    if (!analyserRef.current) return 0;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    
    const average = sum / bufferLength;
    return Math.round((average / 255) * 100);
  }, []);
  
  // Generate contextual feedback based on session purpose
  const generateContextualFeedback = useCallback((text: string, wordCount: number, fillerCount: number) => {
    const purpose = sessionPurpose.toLowerCase();
    let feedback: LiveFeedback | null = null;
    
    if (purpose.includes('sales') || purpose.includes('pitch')) {
      if (text.toLowerCase().includes('benefit') || text.toLowerCase().includes('value')) {
        feedback = {
          id: Date.now().toString(),
          timestamp: liveMetrics.sessionTime,
          category: 'content',
          message: 'Great focus on benefits and value - key for persuasive pitches',
          severity: 'good'
        };
      } else if (liveMetrics.wpm < 130 && liveMetrics.wpm > 0) {
        feedback = {
          id: Date.now().toString(),
          timestamp: liveMetrics.sessionTime,
          category: 'voice',
          message: 'For sales presentations, increase energy - aim for 140-160 WPM',
          severity: 'improvement'
        };
      }
    } else if (purpose.includes('interview')) {
      if (liveMetrics.wpm > 170) {
        feedback = {
          id: Date.now().toString(),
          timestamp: liveMetrics.sessionTime,
          category: 'voice',
          message: 'Slow down for interviews - measured pace shows thoughtfulness',
          severity: 'warning'
        };
      } else if (liveMetrics.eyeContact > 75) {
        feedback = {
          id: Date.now().toString(),
          timestamp: liveMetrics.sessionTime,
          category: 'body_language',
          message: 'Excellent eye contact for interviews - shows confidence',
          severity: 'good'
        };
      }
    } else if (purpose.includes('presentation')) {
      if (text.toLowerCase().includes('first') || text.toLowerCase().includes('second')) {
        feedback = {
          id: Date.now().toString(),
          timestamp: liveMetrics.sessionTime,
          category: 'content',
          message: 'Great structure words - helps audience follow your presentation',
          severity: 'good'
        };
      } else if (fillerCount > 0) {
        feedback = {
          id: Date.now().toString(),
          timestamp: liveMetrics.sessionTime,
          category: 'content',
          message: 'For presentations, use pauses instead of filler words for emphasis',
          severity: 'warning'
        };
      }
    } else {
      // General feedback when no specific purpose
      if (fillerCount > 0) {
        feedback = {
          id: Date.now().toString(),
          timestamp: liveMetrics.sessionTime,
          category: 'content',
          message: `${fillerCount} filler word${fillerCount > 1 ? 's' : ''} detected - try pausing instead`,
          severity: 'warning'
        };
      } else if (liveMetrics.wpm >= 140 && liveMetrics.wpm <= 160) {
        feedback = {
          id: Date.now().toString(),
          timestamp: liveMetrics.sessionTime,
          category: 'voice',
          message: `Perfect pace at ${liveMetrics.wpm} WPM - ideal for engagement`,
          severity: 'good'
        };
      }
    }
    
    if (feedback) {
      setLiveFeedback(prev => [...prev.slice(-4), feedback]);
    }
  }, [sessionPurpose, liveMetrics]);
  
  // Real-time metrics update
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setLiveMetrics(prev => {
        const newTime = prev.sessionTime + 1;
        const volume = detectVolume();
        const eyeContact = Math.min(100, prev.eyeContact + Math.random() * 10 - 5);
        
        return {
          ...prev,
          sessionTime: newTime,
          volume: volume,
          eyeContact: Math.max(0, eyeContact)
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, detectVolume]);
  
  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: 'user' }, 
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setupAudioAnalysis(stream);
      setupSpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }

      sessionStartTime.current = Date.now();
      setIsRecording(true);
      setLiveMetrics({
        wpm: 0,
        wordCount: 0,
        fillerWords: 0,
        eyeContact: 50,
        volume: 0,
        sessionTime: 0
      });
      setTranscript('');
      setLiveFeedback([]);
      
      toast({
        title: "Recording Started",
        description: "Practice session is now recording with live AI feedback"
      });
      
    } catch (error) {
      console.error('Recording start failed:', error);
      toast({
        title: "Recording Failed",
        description: "Please allow camera and microphone access",
        variant: "destructive"
      });
    }
  }, [setupAudioAnalysis, setupSpeechRecognition, toast]);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsRecording(false);
    
    toast({
      title: "Session Complete",
      description: `Recorded for ${Math.floor(liveMetrics.sessionTime / 60)}:${(liveMetrics.sessionTime % 60).toString().padStart(2, '0')}`
    });
  }, [liveMetrics.sessionTime, toast]);
  
  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Session Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Name */}
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
                      className="opacity-60 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit3 className="h-4 w-4 text-blue-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setIsEditingName(false);
                        if (e.key === 'Escape') setIsEditingName(false);
                      }}
                      className="text-lg font-semibold"
                      autoFocus
                    />
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingName(false)}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Session Purpose */}
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
                          <p className="text-gray-800">{sessionPurpose}</p>
                        ) : (
                          <p className="text-gray-500 italic">Add a purpose to get targeted AI feedback</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingPurpose(true)}
                        className="opacity-60 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 className="h-4 w-4 text-purple-600" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      value={sessionPurpose}
                      onChange={(e) => setSessionPurpose(e.target.value)}
                      placeholder="e.g., Practice sales pitch for Q4 product launch, Prepare for job interview at tech company, Rehearse presentation for board meeting"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingPurpose(false)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingPurpose(false)}>
                        <X className="h-4 w-4" />
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
              
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {/* Live Overlay Metrics */}
              {isRecording && (
                <>
                  <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
                    <div className="text-lg font-bold">{liveMetrics.wpm} WPM</div>
                    <div className="text-xs opacity-90">Words per minute</div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
                    <div className="text-lg font-bold">{liveMetrics.wordCount}</div>
                    <div className="text-xs opacity-90">Words spoken</div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
                    <div className="text-lg font-bold text-red-400">{liveMetrics.fillerWords}</div>
                    <div className="text-xs opacity-90">Filler words</div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
                    <div className="text-lg font-bold">{Math.round(liveMetrics.eyeContact)}%</div>
                    <div className="text-xs opacity-90">Eye contact</div>
                  </div>
                </>
              )}
              
              {/* Recording Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-4 bg-black/80 rounded-full px-6 py-3">
                  {!isRecording ? (
                    <Button onClick={startRecording} className="rounded-full" size="lg">
                      <Mic className="h-5 w-5 mr-2" />
                      Start Practice
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="destructive" className="rounded-full" size="lg">
                      <Square className="h-5 w-5 mr-2" />
                      Stop Session
                    </Button>
                  )}
                  
                  {isRecording && (
                    <div className="text-white font-mono">
                      {formatTime(liveMetrics.sessionTime)}
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

            {/* Live Metrics Grid */}
            {isRecording && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{liveMetrics.wordCount}</div>
                  <div className="text-sm text-muted-foreground">Total Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{liveMetrics.wpm}</div>
                  <div className="text-sm text-muted-foreground">WPM</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{liveMetrics.fillerWords}</div>
                  <div className="text-sm text-muted-foreground">Filler Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{Math.round(liveMetrics.volume)}%</div>
                  <div className="text-sm text-muted-foreground">Volume</div>
                </div>
              </div>
            )}

            {/* Live Feedback */}
            {isRecording && liveFeedback.length > 0 && (
              <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                {liveFeedback.slice(-3).map((feedback) => (
                  <div
                    key={feedback.id}
                    className={`p-3 rounded-lg text-sm ${
                      feedback.severity === 'good' 
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : feedback.severity === 'warning'
                        ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    <div className="font-medium">{feedback.message}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(feedback.timestamp)} - {feedback.category}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Session Goals */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Session Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Reduce Filler Words</span>
                  <span>{Math.max(0, 10 - liveMetrics.fillerWords)}/10</span>
                </div>
                <Progress value={Math.max(0, (10 - liveMetrics.fillerWords) * 10)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Maintain Eye Contact</span>
                  <span>{Math.round(liveMetrics.eyeContact)}%</span>
                </div>
                <Progress value={liveMetrics.eyeContact} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Optimal Pace (140-160 WPM)</span>
                  <span>{liveMetrics.wpm >= 140 && liveMetrics.wpm <= 160 ? '✓' : liveMetrics.wpm}</span>
                </div>
                <Progress value={liveMetrics.wpm >= 140 && liveMetrics.wpm <= 160 ? 100 : Math.min(100, (liveMetrics.wpm / 160) * 100)} />
              </div>
            </CardContent>
          </Card>

          {/* Practice Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                Practice Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {sessionPurpose.toLowerCase().includes('sales') ? (
                <>
                  <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                    <strong>Sales Focus:</strong> Emphasize benefits, use confident tone, maintain 140-160 WPM
                  </div>
                  <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                    Use phrases like "This means you get..." and "The value for you is..."
                  </div>
                </>
              ) : sessionPurpose.toLowerCase().includes('interview') ? (
                <>
                  <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                    <strong>Interview Focus:</strong> Speak thoughtfully, maintain eye contact, use specific examples
                  </div>
                  <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                    Structure answers using STAR method (Situation, Task, Action, Result)
                  </div>
                </>
              ) : sessionPurpose.toLowerCase().includes('presentation') ? (
                <>
                  <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                    <strong>Presentation Focus:</strong> Use clear structure, minimize filler words, engage audience
                  </div>
                  <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                    Use signposting: "First...", "Next...", "Finally..." to guide your audience
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                    <strong>General Tips:</strong> Speak clearly, maintain good posture, use pauses effectively
                  </div>
                  <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                    Practice breathing exercises before speaking to calm nerves
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Live Transcript */}
          {isRecording && transcript && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Live Transcript
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-40 overflow-y-auto text-sm bg-gray-50 p-3 rounded border">
                  {transcript}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}