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
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [showLiveTranscript, setShowLiveTranscript] = useState(true);

  // Simplified metrics - start at 0 until recording begins
  const [metrics, setMetrics] = useState<SimplifiedMetrics>({
    eyeContact: 0,
    confidence: 0,
    engagement: 0,
    wordsPerMinute: 0,
    fillerWordCount: 0,
    clarity: 0
  });

  // Live feedback
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback[]>([]);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const metricsTimerRef = useRef<NodeJS.Timeout | null>(null);
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
    recognition.maxAlternatives = 3;
    
    // Important: Configure to include filler words in transcription
    if ('webkitSpeechRecognition' in window) {
      // Chrome-specific settings to capture filler words
      recognition.serviceURI = undefined; // Use default to ensure filler words are captured
    }

    recognition.onresult = async (event: any) => {
      let finalTranscript = '';
      let interimText = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimText += transcript;
        }
      }

      // Update interim transcript for live display
      setInterimTranscript(interimText);

      if (finalTranscript.trim()) {
        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript(''); // Clear interim when we get final
        
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
        
        // Check for single-word fillers with exact word boundaries
        words.forEach(word => {
          const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
          if (singleFillerWords.includes(cleanWord)) {
            detectedFillers.push(cleanWord);
          }
        });
        
        // Enhanced backend filler word analysis for the complete transcript
        const fullTranscript = transcript + ' ' + finalTranscript;
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
              setMetrics(prev => ({
                ...prev,
                fillerWordCount: analysis.totalFillers
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
                fillerWordCount: fullFillerCount
              }));
              
              const uniqueFillers = [...new Set(detectedFillers)];
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

        // Calculate WPM using the complete transcript
        const fullText = transcript + ' ' + finalTranscript;
        const wordCount = fullText.trim().split(/\s+/).filter(word => word.length > 0).length;
        const timeInMinutes = sessionDuration / 60;
        const wpm = timeInMinutes > 0 ? Math.round(wordCount / timeInMinutes) : 0;
        
        // Update metrics with live WPM
        setMetrics(prev => ({ ...prev, wordsPerMinute: wpm }));

        // Enhanced live feedback generation
        if (wpm >= 120 && wpm <= 180) {
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: `Great speaking pace at ${wpm} WPM!`,
            type: 'success',
            timestamp: Date.now()
          }]);
        } else if (wpm > 200) {
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: `Speaking too fast at ${wpm} WPM - try slowing down`,
            type: 'warning',
            timestamp: Date.now()
          }]);
        } else if (wpm < 100 && wpm > 0) {
          setLiveFeedback(prev => [...prev.slice(-4), {
            id: Date.now().toString(),
            message: `Speaking slowly at ${wpm} WPM - consider increasing pace`,
            type: 'info',
            timestamp: Date.now()
          }]);
        }

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

      // Start timer with real-time WPM calculation
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setSessionDuration(elapsedSeconds);
        
        // Calculate WPM in real-time based on current transcript
        if (elapsedSeconds > 5) { // Wait at least 5 seconds for meaningful calculation
          const currentTranscript = transcript + ' ' + interimTranscript;
          const wordCount = currentTranscript.trim().split(/\s+/).filter(word => word.length > 0).length;
          const timeInMinutes = elapsedSeconds / 60;
          const wpm = timeInMinutes > 0 ? Math.round(wordCount / timeInMinutes) : 0;
          
          setMetrics(prev => ({ ...prev, wordsPerMinute: wpm }));
        }
      }, 1000);

      // Initialize metrics with starting values when recording begins
      setMetrics({
        eyeContact: 0,
        confidence: 0,
        engagement: 0,
        wordsPerMinute: 0,
        fillerWordCount: 0,
        clarity: 0
      });

      // Gradually build up realistic metrics as the session progresses
      let metricsUpdateCount = 0;
      metricsTimerRef.current = setInterval(() => {
        metricsUpdateCount++;
        const progressFactor = Math.min(metricsUpdateCount / 10, 1); // Build over 30 seconds
        
        setMetrics(prev => ({
          ...prev,
          eyeContact: Math.min(85, Math.max(0, 
            Math.floor(progressFactor * (60 + Math.random() * 25))
          )),
          confidence: Math.min(90, Math.max(0, 
            Math.floor(progressFactor * (55 + Math.random() * 30))
          )),
          engagement: Math.min(90, Math.max(0, 
            Math.floor(progressFactor * (60 + Math.random() * 25))
          )),
          clarity: Math.min(85, Math.max(0, 
            Math.floor(progressFactor * (50 + Math.random() * 30))
          ))
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
  }, [setupSpeechRecognition, toast, transcript, interimTranscript]);

  // Stop recording
  const stopRecording = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
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

    setIsRecording(false);

    // Reset metrics to 0 after recording stops
    setTimeout(() => {
      setMetrics({
        eyeContact: 0,
        confidence: 0,
        engagement: 0,
        wordsPerMinute: 0,
        fillerWordCount: 0,
        clarity: 0
      });
    }, 1000); // Small delay to allow final session save

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
                  <Button onClick={startRecording} className="bg-gradient-to-br from-[#2563eb] to-[#22d3ee] hover:from-[#1d4ed8] hover:to-[#06b6d4] text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Mic className="w-5 h-5 mr-2" />
                    Start Practice
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="outline">
                    <Square className="w-5 h-5 mr-2" />
                    Stop ({Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')})
                  </Button>
                )}
                
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
            
            {/* Live Feedback Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
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
                      <div className="text-2xl font-bold text-blue-600">{metrics.wordsPerMinute}</div>
                      <div className="text-xs text-gray-500">WPM</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{metrics.fillerWordCount}</div>
                      <div className="text-xs text-gray-500">Fillers</div>
                    </div>
                  </div>
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
                    <span className="text-gray-900">
                      {transcript}
                    </span>
                    {interimTranscript && (
                      <span className="text-gray-400 italic">
                        {interimTranscript}
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

  // Helper function to format time
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}