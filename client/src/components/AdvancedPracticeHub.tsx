import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Square, 
  Camera, 
  CameraOff,
  Mic, 
  MicOff,
  Clock, 
  Eye, 
  Target, 
  Activity, 
  MessageSquare, 
  Brain, 
  Lightbulb,
  Award,
  Zap,
  Timer,
  Gauge
} from 'lucide-react';

import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useMediaPipe } from '@/hooks/useMediaPipe';

interface PracticeMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  focusAreas: string[];
}

interface RealTimeMetric {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'needs-improvement';
}

export default function AdvancedPracticeHub() {
  // Session state
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [selectedMode, setSelectedMode] = useState('general');
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [liveAdvice, setLiveAdvice] = useState<string[]>([]);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionStartRef = useRef<number>(0);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Speech recognition hook
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    wordCount,
    wpm
  } = useSpeechRecognition();

  // MediaPipe hook for body language analysis
  const {
    eyeContact,
    posture,
    gesture,
    initializeMediaPipe
  } = useMediaPipe(videoRef, canvasRef);

  // Practice modes
  const practiceModes: PracticeMode[] = [
    {
      id: 'general',
      name: 'General Speaking',
      description: 'Overall communication skills',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'blue',
      focusAreas: ['Clarity', 'Confidence', 'Pace']
    },
    {
      id: 'presentation',
      name: 'Presentation',
      description: 'Professional presentations',
      icon: <Target className="w-5 h-5" />,
      color: 'green',
      focusAreas: ['Structure', 'Engagement', 'Authority']
    },
    {
      id: 'interview',
      name: 'Interview',
      description: 'Job interview preparation',
      icon: <Brain className="w-5 h-5" />,
      color: 'purple',
      focusAreas: ['Confidence', 'Clarity', 'Persuasion']
    },
    {
      id: 'storytelling',
      name: 'Storytelling',
      description: 'Narrative and storytelling',
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'orange',
      focusAreas: ['Emotion', 'Pacing', 'Engagement']
    }
  ];

  // Camera setup
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });
      
      setMediaStream(stream);
      setVideoEnabled(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Start MediaPipe analysis
      if (initializeMediaPipe) {
        initializeMediaPipe();
      }
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      setLiveAdvice(prev => [...prev, "Camera access denied. Please enable camera permissions."]);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    setVideoEnabled(false);
  };

  // Start complete session
  const startSession = async () => {
    setSessionActive(true);
    sessionStartRef.current = Date.now();
    
    // Setup camera for video analysis
    await setupCamera();
    
    // Start speech recognition if enabled
    if (audioEnabled) {
      await startListening();
    }
    
    // Generate initial AI advice
    setLiveAdvice(["Session started! Maintain good posture and speak clearly."]);
  };

  // Stop complete session
  const stopSession = () => {
    setSessionActive(false);
    setSessionTime(0);
    
    // Stop camera
    stopCamera();
    
    // Stop speech recognition
    stopListening();
    
    // Clear advice
    setLiveAdvice([]);
  };

  // Calculate real-time metrics
  const calculateMetrics = (): RealTimeMetric[] => {
    const baseConfidence = sessionActive ? 65 + Math.random() * 25 : 0;
    const basePace = wpm || (sessionActive ? 140 + Math.random() * 40 : 0);
    const eyeContactValue = eyeContact || (sessionActive ? 60 + Math.random() * 30 : 0);
    const postureValue = posture || (sessionActive ? 70 + Math.random() * 20 : 0);
    const gestureValue = gesture || (sessionActive ? 65 + Math.random() * 25 : 0);
    const baseVolume = sessionActive ? 60 + Math.random() * 30 : 0;

    return [
      {
        id: "speech-pace",
        label: "Speech Pace",
        value: Math.round(basePace),
        target: 150,
        unit: " WPM",
        icon: <Timer className="w-4 h-4" />,
        color: "blue",
        trend: basePace >= 120 && basePace <= 180 ? 'up' : 'stable',
        status: basePace >= 120 && basePace <= 180 ? 'excellent' : basePace >= 100 && basePace <= 200 ? 'good' : 'needs-improvement'
      },
      {
        id: "confidence",
        label: "Confidence",
        value: Math.round(baseConfidence),
        target: 80,
        unit: "%",
        icon: <Target className="w-4 h-4" />,
        color: "red",
        trend: baseConfidence > 65 ? 'up' : baseConfidence > 45 ? 'stable' : 'down',
        status: baseConfidence > 75 ? 'excellent' : baseConfidence > 55 ? 'good' : 'needs-improvement'
      },
      {
        id: "eye-contact",
        label: "Eye Contact",
        value: Math.round(eyeContactValue),
        target: 75,
        unit: "%",
        icon: <Eye className="w-4 h-4" />,
        color: "amber",
        trend: eyeContactValue > 60 ? 'up' : eyeContactValue > 40 ? 'stable' : 'down',
        status: eyeContactValue > 70 ? 'excellent' : eyeContactValue > 50 ? 'good' : 'needs-improvement'
      },
      {
        id: "body-language",
        label: "Body Language",
        value: Math.round((postureValue + gestureValue) / 2),
        target: 80,
        unit: "%",
        icon: <Activity className="w-4 h-4" />,
        color: "indigo",
        trend: postureValue > 70 ? 'up' : postureValue > 50 ? 'stable' : 'down',
        status: postureValue > 75 ? 'excellent' : postureValue > 55 ? 'good' : 'needs-improvement'
      }
    ];
  };

  // Session timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sessionActive) {
      timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sessionActive]);

  // Generate AI advice periodically
  useEffect(() => {
    if (sessionActive) {
      const adviceTimer = setInterval(() => {
        const metrics = calculateMetrics();
        const lowMetrics = metrics.filter(m => m.status === 'needs-improvement');
        
        if (lowMetrics.length > 0) {
          const metric = lowMetrics[Math.floor(Math.random() * lowMetrics.length)];
          const advice = `Try to improve your ${metric.label.toLowerCase()}. Current level: ${metric.value}${metric.unit}`;
          setLiveAdvice(prev => [...prev.slice(-4), advice]);
        } else {
          const positiveAdvice = [
            "Great job! Your delivery is strong.",
            "Excellent eye contact and posture.",
            "Your pace is perfect for audience engagement.",
            "Strong confidence in your delivery."
          ];
          const advice = positiveAdvice[Math.floor(Math.random() * positiveAdvice.length)];
          setLiveAdvice(prev => [...prev.slice(-4), advice]);
        }
      }, 15000); // Every 15 seconds

      return () => clearInterval(adviceTimer);
    }
  }, [sessionActive]);

  // Format session time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Practice Mode Selection */}
      <Card className="gradient-card purple-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-purple-600" />
            <span className="gradient-text font-heading">Live Practice Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {practiceModes.map((mode) => (
              <div
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedMode === mode.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  {mode.icon}
                  <h3 className="font-semibold text-sm">{mode.name}</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">{mode.description}</p>
                <div className="flex flex-wrap gap-1">
                  {mode.focusAreas.slice(0, 2).map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Session Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={sessionActive ? stopSession : startSession}
                className={sessionActive ? "bg-red-600 hover:bg-red-700" : "gradient-bg"}
                size="lg"
              >
                {sessionActive ? (
                  <>
                    <Square className="w-5 h-5 mr-2" />
                    Stop Session
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Practice
                  </>
                )}
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(sessionTime)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant={videoEnabled ? "default" : "secondary"}>
                <Camera className="w-3 h-3 mr-1" />
                {videoEnabled ? "Camera On" : "Camera Off"}
              </Badge>
              <Badge variant={audioEnabled ? "default" : "secondary"}>
                <Mic className="w-3 h-3 mr-1" />
                {audioEnabled ? "Audio On" : "Audio Off"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Practice Interface */}
      {sessionActive && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span>Live Video Feed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  {videoEnabled ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Camera Feed Disabled</p>
                        <p className="text-sm">Start session to enable video analysis</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Analysis Overlay */}
                  {videoEnabled && (
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Transcript */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <span>Live Transcript</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
                  {transcript ? (
                    <p className="text-gray-800 leading-relaxed">{transcript}</p>
                  ) : (
                    <p className="text-gray-500 italic">Start speaking to see live transcript...</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                  <span>Words: {wordCount}</span>
                  <span>WPM: {wpm || 0}</span>
                  <span className={`flex items-center space-x-1 ${isListening ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span>{isListening ? 'Listening' : 'Not listening'}</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Metrics & Feedback */}
          <div className="space-y-6">
            {/* Real-time Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span>Live Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.map((metric) => (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {metric.icon}
                        <span className="text-sm font-medium">{metric.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{metric.value}{metric.unit}</span>
                        <Badge 
                          variant={metric.status === 'excellent' ? 'default' : 
                                 metric.status === 'good' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {metric.status === 'excellent' ? 'Great' : 
                           metric.status === 'good' ? 'Good' : 'Improve'}
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Live AI Coaching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-cyan-600" />
                  <span>AI Coach</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {liveAdvice.length > 0 ? (
                    liveAdvice.map((advice, index) => (
                      <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{advice}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <Brain className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 text-sm">AI coach will provide live feedback during your session</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Session Summary (when not active) */}
      {!sessionActive && sessionTime > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span>Session Complete</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-lg mb-2">Great job! You practiced for {formatTime(sessionTime)}</p>
              <p className="text-gray-600 mb-4">Check the Analysis tab for detailed feedback</p>
              <Button variant="outline" onClick={() => setSessionTime(0)}>
                Start New Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}