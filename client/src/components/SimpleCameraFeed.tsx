import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, AlertCircle, RefreshCw, Eye, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SimpleCameraFeedProps {
  onStreamReady?: (stream: MediaStream) => void;
  onStreamEnd?: () => void;
  className?: string;
  isRecording?: boolean;
  wpm?: number;
  duration?: number;
  isActive?: boolean;
  onToggle?: () => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export default function SimpleCameraFeed({ 
  onStreamReady, 
  onStreamEnd, 
  className = "", 
  isRecording = false, 
  wpm = 0, 
  duration = 0,
  isActive: externalIsActive,
  onToggle: externalOnToggle,
  videoRef: externalVideoRef
}: SimpleCameraFeedProps) {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const [internalIsActive, setInternalIsActive] = useState(false);
  const isActive = externalIsActive !== undefined ? externalIsActive : internalIsActive;
  const setIsActive = externalOnToggle ? () => externalOnToggle() : setInternalIsActive;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [eyeContactScore, setEyeContactScore] = useState(75);
  const [postureScore, setPostureScore] = useState(82);

  // Simulate real-time eye contact and posture tracking
  useEffect(() => {
    if (!isRecording || !isActive) return;

    const interval = setInterval(() => {
      // Simulate eye contact detection (would be replaced with actual computer vision)
      setEyeContactScore(prev => {
        const variation = (Math.random() - 0.5) * 20;
        return Math.max(30, Math.min(100, prev + variation));
      });

      // Simulate posture tracking (would be replaced with actual pose detection)
      setPostureScore(prev => {
        const variation = (Math.random() - 0.5) * 15;
        return Math.max(40, Math.min(100, prev + variation));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isRecording, isActive]);

  const startCamera = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera access not supported by this browser.");
        setIsLoading(false);
        return;
      }

      // Stop any existing stream first
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready and force play
        const playVideo = async () => {
          try {
            await videoRef.current?.play();
            setIsActive(true);
            setIsLoading(false);
            onStreamReady?.(stream);
          } catch (playError) {
            console.error("Video play error:", playError);
            setIsLoading(false);
          }
        };

        // Set up event listeners
        videoRef.current.onloadedmetadata = playVideo;
        videoRef.current.oncanplay = playVideo;
        
        setMediaStream(stream);
      }
    } catch (error: any) {
      console.error("Camera error:", error);
      setIsActive(false);
      setIsLoading(false);
      if (error.name === 'NotAllowedError') {
        setError("Camera permission denied. Please allow camera access and refresh the page.");
      } else if (error.name === 'NotFoundError') {
        setError("No camera found. Please connect a camera and try again.");
      } else if (error.name === 'NotReadableError') {
        setError("Camera is already in use by another application.");
      } else {
        setError("Camera not available. Please check your camera and try again.");
      }
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    onStreamEnd?.();
  };

  // Auto-start camera on mount
  useEffect(() => {
    const initCamera = async () => {
      await startCamera();
    };
    initCamera();
    
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Video Feed */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform scale-x-[-1] ${
                isActive ? 'block' : 'hidden'
              }`}
            />
            
            {/* Real-time Metrics Overlay */}
            {isActive && isRecording && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Top-left metrics */}
                <div className="absolute top-4 left-4 space-y-2">
                  {/* Eye Contact */}
                  <div className="bg-black bg-opacity-70 rounded-lg px-3 py-2 text-white text-sm flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Eye Contact</span>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      eyeContactScore >= 70 ? 'bg-green-500' : 
                      eyeContactScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {Math.round(eyeContactScore)}%
                    </div>
                  </div>
                  
                  {/* Posture */}
                  <div className="bg-black bg-opacity-70 rounded-lg px-3 py-2 text-white text-sm flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Posture</span>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      postureScore >= 75 ? 'bg-green-500' : 
                      postureScore >= 55 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {Math.round(postureScore)}%
                    </div>
                  </div>
                </div>

                {/* Top-right metrics */}
                <div className="absolute top-4 right-4 space-y-2">
                  {/* WPM */}
                  <div className="bg-black bg-opacity-70 rounded-lg px-3 py-2 text-white text-sm flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>WPM</span>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      wpm >= 120 && wpm <= 150 ? 'bg-green-500' : 
                      wpm >= 100 || (wpm > 150 && wpm <= 180) ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {wpm}
                    </div>
                  </div>
                  
                  {/* Session Timer */}
                  <div className="bg-black bg-opacity-70 rounded-lg px-3 py-2 text-white text-sm flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-mono">
                      {Math.floor(duration / 60).toString().padStart(2, '0')}:
                      {(duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Bottom performance indicators */}
                {(eyeContactScore < 50 || postureScore < 55 || wpm < 100 || wpm > 180) && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-yellow-500 bg-opacity-90 rounded-lg px-4 py-2 text-black text-sm flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">
                        {eyeContactScore < 50 ? "Look at camera more directly" :
                         postureScore < 55 ? "Straighten your posture" :
                         wpm < 100 ? "Speak a bit faster" :
                         wpm > 180 ? "Slow down your speech" : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-12 h-12 mx-auto mb-2 opacity-50 animate-spin" />
                      <p className="text-sm">Starting camera...</p>
                    </>
                  ) : (
                    <>
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Camera Preview</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Controls */}
          <div className="flex justify-center space-x-2">
            {!isActive ? (
              <Button onClick={startCamera} className="flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Start Camera</span>
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="outline" className="flex items-center space-x-2">
                <CameraOff className="w-4 h-4" />
                <span>Stop Camera</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}