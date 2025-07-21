import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Camera, CameraOff, Mic, MicOff, Settings, Edit3, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface LiveFeedback {
  id: string;
  timestamp: number;
  type: 'content' | 'voice' | 'body_language' | 'voice_modulation';
  feedback: string;
  severity: 'info' | 'warning' | 'success';
}

interface SessionGoal {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  badgeReward: string;
}

export default function NewPracticeDashboard() {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionName, setSessionName] = useState('My Practice Session');
  const [sessionPurpose, setSessionPurpose] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Live metrics state
  const [liveMetrics, setLiveMetrics] = useState({
    volume: 0,
    clarity: 0,
    pace: 0,
    wordsSpoken: 0,
    fillerWords: 0,
    duration: 0
  });
  
  const [liveFeedback, setLiveFeedback] = useState<LiveFeedback[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Sample goals for badge earning
  const sessionGoals: SessionGoal[] = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first practice session',
      progress: 0,
      target: 1,
      badgeReward: 'Beginner Speaker Badge'
    },
    {
      id: 'confident-speaker',
      name: 'Confident Speaker',
      description: 'Maintain clear voice for 5+ minutes',
      progress: 0,
      target: 300,
      badgeReward: 'Confident Speaker Badge'
    }
  ];

  // Initialize camera and microphone
  useEffect(() => {
    initializeMedia();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: cameraEnabled,
        audio: micEnabled
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const startRecording = async () => {
    if (!stream) return;
    
    setIsRecording(true);
    startLiveAnalysis();
    
    // Start media recording
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();
    
    // Start session timer
    const startTime = Date.now();
    const timer = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        duration: Math.floor((Date.now() - startTime) / 1000)
      }));
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    generatePostSessionAnalysis();
  };

  const startLiveAnalysis = () => {
    // Remove simulated analysis - only use real AI feedback when available
    console.log('Live analysis started - waiting for real AI feedback');
  };

  const generatePostSessionAnalysis = async () => {
    // This will trigger the comprehensive AI analysis
    const sessionData = {
      name: sessionName,
      purpose: sessionPurpose,
      duration: liveMetrics.duration,
      metrics: liveMetrics,
      feedback: liveFeedback
    };
    
    // Save session and generate analysis
    console.log('Saving session:', sessionData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Session Name and Purpose */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {isEditingName ? (
                <Input
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyPress={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  className="text-2xl font-bold"
                  autoFocus
                />
              ) : (
                <h1 
                  className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-blue-600"
                  onClick={() => setIsEditingName(true)}
                >
                  {sessionName}
                </h1>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingName(true)}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Session Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Session Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="purpose">Session Purpose</Label>
                    <Textarea
                      id="purpose"
                      placeholder="What do you want to achieve in this session? (e.g., improve confidence, practice for interview, work on storytelling)"
                      value={sessionPurpose}
                      onChange={(e) => setSessionPurpose(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {sessionPurpose && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex items-center">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-blue-800"><strong>Purpose:</strong> {sessionPurpose}</p>
              </div>
            </div>
          )}
        </div>

        {/* Badge Goals Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Today's Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessionGoals.map((goal) => (
              <Card key={goal.id} className="border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{goal.name}</h3>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      {goal.badgeReward}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}/{goal.target}</span>
                    </div>
                    <Progress value={(goal.progress / goal.target) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Practice Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Practice Recording</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-64 object-cover"
                  />
                  {!cameraEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <CameraOff className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Recording Controls */}
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={cameraEnabled ? () => setCameraEnabled(false) : () => setCameraEnabled(true)}
                    variant={cameraEnabled ? "default" : "destructive"}
                  >
                    {cameraEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    onClick={micEnabled ? () => setMicEnabled(false) : () => setMicEnabled(true)}
                    variant={micEnabled ? "default" : "destructive"}
                  >
                    {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        Stop Analysis
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Practice
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Feedback & Metrics */}
          <div className="space-y-4">
            {/* Live Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Only show real metrics when available - no simulated data */}
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Real-time metrics will appear during recording</p>
                </div>
                
                {/* Show only timer during recording - no simulated metrics */}
                {isRecording && (
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-blue-600">
                      {Math.floor(liveMetrics.duration / 60)}:{(liveMetrics.duration % 60).toString().padStart(2, '0')}
                    </div>
                    <p className="text-sm text-gray-500">Session Duration</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {liveFeedback.map((feedback) => (
                    <div
                      key={feedback.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        feedback.severity === 'success' ? 'bg-green-50 border-green-400' :
                        feedback.severity === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                        'bg-blue-50 border-blue-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-gray-600 uppercase">
                          {feedback.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.floor(feedback.timestamp / 60)}:{(Math.floor(feedback.timestamp) % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <p className="text-sm">{feedback.feedback}</p>
                    </div>
                  ))}
                  {liveFeedback.length === 0 && (
                    <p className="text-gray-500 text-center">Start practicing to see live feedback</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}