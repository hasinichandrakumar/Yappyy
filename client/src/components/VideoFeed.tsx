import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Square, Pause, Eye, Volume2, Brain, Zap } from "lucide-react";
import { useMediaPipe } from "@/hooks/useMediaPipe";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";

export default function VideoFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");

  const [realTimeFeedback, setRealTimeFeedback] = useState<boolean>(false);
  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]);

  const { 
    posture, 
    gesture, 
    eyeContact, 
    initializeMediaPipe, 
    processFrame 
  } = useMediaPipe();
  
  const { volumeLevel, startVoiceAnalysis, stopVoiceAnalysis, speakingPace, voiceClarity } = useVoiceAnalysis();

  useEffect(() => {
    startCamera();
    initializeMediaPipe();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Real-time feedback system
  useEffect(() => {
    if (!realTimeFeedback || !isRecording) return;

    const feedbackInterval = setInterval(() => {
      const messages: string[] = [];

      // Analyze posture
      if (posture === 'needs_improvement') {
        messages.push("Keep your shoulders back and maintain good posture");
      }

      // Analyze eye contact
      if (eyeContact === 'poor') {
        messages.push("Try to maintain eye contact with your audience");
      }

      // Analyze voice
      if (volumeLevel < 0.3) {
        messages.push("Speak louder to ensure your audience can hear you");
      }

      if (speakingPace < 120) {
        messages.push("You can speak a bit faster to maintain engagement");
      } else if (speakingPace > 180) {
        messages.push("Slow down your speaking pace for better clarity");
      }

      // Update feedback messages (limit to 2 messages at a time)
      if (messages.length > 0) {
        setFeedbackMessages(messages.slice(0, 2));
      }

      // Clear messages after 5 seconds
      setTimeout(() => {
        setFeedbackMessages([]);
      }, 5000);
    }, 10000); // Check every 10 seconds

    return () => clearInterval(feedbackInterval);
  }, [realTimeFeedback, isRecording, posture, eyeContact, volumeLevel, speakingPace]);

  const startCamera = async () => {
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError("");
    } catch (err) {
      setError("Camera access denied. Please enable camera permissions or use Demo Mode.");
      console.error("Error accessing camera:", err);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    startVoiceAnalysis();
    
    // Start frame processing for MediaPipe
    if (videoRef.current && canvasRef.current) {
      const processFrames = () => {
        if (!isRecording) return;
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video && canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // Process frame for MediaPipe analysis
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            processFrame(imageData);
          }
        }
        
        requestAnimationFrame(processFrames);
      };
      
      processFrames();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    stopVoiceAnalysis();
    setFeedbackMessages([]);
  };

  const pauseRecording = () => {
    setIsRecording(false);
    stopVoiceAnalysis();
  };

  return (
    <Card className="shadow-lg border-0">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Play className="w-5 h-5 text-cyan-600" />
            </div>
            Live Practice Session
          </h2>
          <div className="flex items-center space-x-4">

            <div className="flex items-center space-x-2">
              <Label htmlFor="real-time-feedback" className="text-sm font-medium text-gray-700">
                Real-time Feedback
              </Label>
              <Switch
                id="real-time-feedback"
                checked={realTimeFeedback}
                onCheckedChange={setRealTimeFeedback}
                className="data-[state=checked]:bg-cyan-600"
              />
            </div>
            {isRecording && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-1.5 animate-pulse"></span>
                Recording
              </span>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Video Feed Area */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Hidden canvas for frame processing */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="hidden"
          />
          
          {/* Real-time Feedback Overlays */}
          <div className="absolute inset-0">
            {/* Posture Indicator */}
            <div className="absolute top-4 left-4">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                posture === 'good' ? 'bg-green-100 text-green-800' :
                posture === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Posture: {posture === 'good' ? 'Good' : posture === 'moderate' ? 'Fair' : 'Needs Work'}
              </div>
            </div>
            
            {/* Eye Contact Indicator */}
            <div className="absolute top-4 right-4">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 ${
                eyeContact === 'good' ? 'bg-green-100 text-green-800' :
                eyeContact === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                <Eye className="w-3 h-3" />
                <span>Eye Contact: {eyeContact === 'good' ? 'Good' : eyeContact === 'moderate' ? 'Fair' : 'Poor'}</span>
              </div>
            </div>
            
            {/* Voice Analysis Overlay */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <Volume2 className="w-3 h-3" />
                    <span>{Math.round(volumeLevel * 100)}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Brain className="w-3 h-3" />
                    <span>{speakingPace} WPM</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-cyan-300">Clarity: {Math.round(voiceClarity * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time AI Feedback Messages */}
          {realTimeFeedback && feedbackMessages.length > 0 && (
            <div className="absolute top-16 left-4 right-4 space-y-2 z-10">
              {feedbackMessages.map((message, index) => (
                <div
                  key={index}
                  className="bg-cyan-600 bg-opacity-95 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300"
                >
                  <div className="flex items-start space-x-2">
                    <Zap className="w-4 h-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Real-time Feedback Status */}
        {realTimeFeedback && (
          <div className="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-cyan-800">
                Real-time AI feedback is active - You'll receive live coaching tips during your presentation
              </span>
            </div>
          </div>
        )}

        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <Button
            onClick={stopRecording}
            disabled={!isRecording}
            className="bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full p-0"
          >
            <Square className="w-5 h-5" />
          </Button>
          <Button
            onClick={pauseRecording}
            disabled={!isRecording}
            variant="secondary"
            className="w-12 h-12 rounded-full p-0"
          >
            <Pause className="w-5 h-5" />
          </Button>
          <Button
            onClick={startRecording}
            disabled={isRecording}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-3 flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>New Session</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}