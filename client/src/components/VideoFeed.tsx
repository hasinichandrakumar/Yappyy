import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Square, Pause, Eye, Volume2 } from "lucide-react";
import { useMediaPipe } from "@/hooks/useMediaPipe";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";

export default function VideoFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");

  const { 
    posture, 
    gesture, 
    eyeContact, 
    initializeMediaPipe, 
    processFrame 
  } = useMediaPipe();
  
  const { volumeLevel, startVoiceAnalysis, stopVoiceAnalysis } = useVoiceAnalysis();

  useEffect(() => {
    startCamera();
    initializeMediaPipe();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Failed to access camera and microphone. Please check permissions.");
      console.error("Error accessing media devices:", err);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    startVoiceAnalysis();
    
    // Start processing video frames for pose detection
    if (videoRef.current && canvasRef.current) {
      const processVideoFrame = () => {
        if (isRecording && videoRef.current && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            processFrame(imageData);
          }
          requestAnimationFrame(processVideoFrame);
        }
      };
      processVideoFrame();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    stopVoiceAnalysis();
  };

  const pauseRecording = () => {
    setIsRecording(false);
    stopVoiceAnalysis();
  };

  if (error) {
    return (
      <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={startCamera} className="mt-4">
              Retry Camera Access
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Live Practice Session</h2>
          <div className="flex items-center space-x-2">
            {isRecording && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-1.5 animate-pulse"></span>
                Recording
              </span>
            )}
          </div>
        </div>
        
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
            {posture && (
              <div className="absolute top-4 left-4">
                <div className={`bg-opacity-90 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                  posture === 'good' ? 'bg-secondary' : 'bg-warning'
                }`}>
                  <i className="fas fa-check-circle text-xs"></i>
                  <span>{posture === 'good' ? 'Good Posture' : 'Improve Posture'}</span>
                </div>
              </div>
            )}
            
            {/* Gesture Detection */}
            {gesture && (
              <div className="absolute top-4 right-4">
                <div className="bg-accent bg-opacity-90 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2">
                  <i className="fas fa-hand-paper text-xs"></i>
                  <span>{gesture === 'open' ? 'Open Gesture' : gesture === 'closed' ? 'Closed Gesture' : 'Neutral'}</span>
                </div>
              </div>
            )}
            
            {/* Eye Contact Indicator */}
            {eyeContact && (
              <div className="absolute bottom-4 left-4">
                <div className={`bg-opacity-90 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                  eyeContact === 'good' ? 'bg-primary' : 'bg-warning'
                }`}>
                  <Eye className="w-3 h-3" />
                  <span>{eyeContact === 'good' ? 'Good Eye Contact' : 'Maintain Eye Contact'}</span>
                </div>
              </div>
            )}
            
            {/* Volume Level */}
            <div className="absolute bottom-4 right-4">
              <div className="bg-gray-800 bg-opacity-75 text-white px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-3 h-3" />
                  <div className="w-16 bg-gray-600 rounded-full h-1.5">
                    <div 
                      className="bg-secondary h-1.5 rounded-full transition-all duration-150" 
                      style={{ width: `${volumeLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
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
