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
  const [demoMode, setDemoMode] = useState<boolean>(false);

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
      // Check if media devices are available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Media devices not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.");
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
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
      
      setStream(mediaStream);
      setError(""); // Clear any previous errors
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Error accessing media devices:", err);
      
      let errorMessage = "Failed to access camera and microphone. ";
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage += "Please allow camera and microphone permissions in your browser settings and refresh the page.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage += "No camera or microphone found. Please connect your devices and try again.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage += "Camera or microphone is already in use by another application.";
      } else if (err.name === 'OverconstrainedError') {
        errorMessage += "Camera resolution not supported. Trying with lower quality...";
        // Try with lower constraints
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: true
          });
          setStream(fallbackStream);
          setError("");
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
          }
          return;
        } catch (fallbackErr) {
          errorMessage += " Fallback also failed.";
        }
      } else {
        errorMessage += "Please check your browser permissions and try again.";
      }
      
      setError(errorMessage);
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

  const enableDemoMode = () => {
    setDemoMode(true);
    setError("");
    // Start simulated analysis in demo mode
    startVoiceAnalysis();
  };

  if (error && !demoMode) {
    return (
      <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Camera Access Required</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Steps to enable camera access:</h4>
                <ol className="text-sm text-gray-600 text-left space-y-1">
                  <li>1. Click the camera icon in your browser's address bar</li>
                  <li>2. Select "Allow" for both camera and microphone</li>
                  <li>3. Refresh this page</li>
                  <li>4. If still blocked, check your browser settings</li>
                </ol>
              </div>
              <div className="flex space-x-3 justify-center">
                <Button onClick={startCamera} className="bg-primary text-white">
                  Retry Camera Access
                </Button>
                <Button onClick={enableDemoMode} variant="outline">
                  Try Demo Mode
                </Button>
              </div>
            </div>
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
          {demoMode ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
              <div className="text-center text-white">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/40"></div>
                  </div>
                </div>
                <p className="text-lg font-medium">Demo Mode</p>
                <p className="text-sm opacity-75">Camera simulation active</p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          
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
