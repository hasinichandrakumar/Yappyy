import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SimpleCameraFeedProps {
  onStreamReady?: (stream: MediaStream) => void;
  onStreamEnd?: () => void;
  className?: string;
}

export default function SimpleCameraFeed({ onStreamReady, onStreamEnd, className = "" }: SimpleCameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string>("");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    setError("");
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera access not supported by this browser.");
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
        setMediaStream(stream);
        setIsActive(true);
        onStreamReady?.(stream);
      }
    } catch (error: any) {
      console.error("Camera error:", error);
      setIsActive(false);
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
            {isActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Camera Preview</p>
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