import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CameraFeedProps {
  onStreamReady?: (stream: MediaStream) => void;
  onStreamEnd?: () => void;
  className?: string;
}

export default function CameraFeed({ onStreamReady, onStreamEnd, className = "" }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [autoStartAttempted, setAutoStartAttempted] = useState(false);

  // Check if browser supports camera access
  const isCameraSupported = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  // Get available camera devices
  const getCameraDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Failed to enumerate devices:', error);
      return [];
    }
  }, []);

  // Start camera with progressive fallback constraints
  const startCamera = useCallback(async () => {
    console.log("Starting camera initialization...");
    
    if (!isCameraSupported()) {
      console.error("Camera not supported");
      setError("Camera not supported in this browser. Please use Chrome, Firefox, or Safari.");
      return;
    }

    console.log("Camera supported, checking for HTTPS...");
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      setError("Camera requires HTTPS. Please access the site securely or use localhost for testing.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Progressive constraint fallback strategy
    const constraintSets = [
      // Ideal settings
      {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 },
          facingMode: "user"
        },
        audio: false
      },
      // Medium quality fallback
      {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24 },
          facingMode: "user"
        },
        audio: false
      },
      // Basic quality fallback
      {
        video: {
          width: 320,
          height: 240,
          facingMode: "user"
        },
        audio: false
      },
      // Absolute minimal fallback
      {
        video: true,
        audio: false
      }
    ];

    let stream: MediaStream | null = null;
    let lastError: any = null;

    // Try each constraint set until one works
    for (let i = 0; i < constraintSets.length; i++) {
      try {
        console.log(`Attempting camera access with constraint set ${i + 1}/${constraintSets.length}`);
        stream = await navigator.mediaDevices.getUserMedia(constraintSets[i]);
        console.log(`Camera access successful with constraint set ${i + 1}`);
        break;
      } catch (error: any) {
        console.error(`Constraint set ${i + 1} failed:`, error);
        lastError = error;
        
        // If permission denied, don't try other constraints
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          break;
        }
      }
    }

    if (!stream) {
      const errorMessage = getErrorMessage(lastError);
      setError(errorMessage);
      setIsLoading(false);
      return;
    }

    try {
      // Set up video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMediaStream(stream);

        // Wait for video to load and start playing
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error("Video element not available"));
            return;
          }

          const video = videoRef.current;
          
          const onLoadedMetadata = () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            resolve();
          };

          const onError = (e: any) => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('error', onError);
            reject(new Error(`Video load error: ${e.message || 'Unknown error'}`));
          };

          video.addEventListener('loadedmetadata', onLoadedMetadata);
          video.addEventListener('error', onError);
        });

        // Start video playback
        await videoRef.current.play();
        
        setIsActive(true);
        setIsLoading(false);
        setRetryCount(0);
        onStreamReady?.(stream);
        
        console.log("Camera started successfully");
      }
    } catch (error: any) {
      console.error("Failed to start video playback:", error);
      setError(`Failed to start video: ${error.message}`);
      setIsLoading(false);
      
      // Clean up stream if video setup failed
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [onStreamReady, retryCount]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      setMediaStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
    onStreamEnd?.();
    console.log("Camera stopped");
  }, [mediaStream, onStreamEnd]);

  // Retry camera access
  const retryCamera = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setError("");
    startCamera();
  }, [startCamera]);

  // Get user-friendly error message
  const getErrorMessage = (error: any): string => {
    if (!error) return "Unknown camera error";

    switch (error.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return "Camera access denied. Please allow camera permissions and refresh the page.";
      case 'NotFoundError':
      case 'DevicesNotFoundError':
        return "No camera found. Please connect a camera and try again.";
      case 'NotReadableError':
      case 'TrackStartError':
        return "Camera is being used by another application. Please close other apps using the camera.";
      case 'OverconstrainedError':
      case 'ConstraintNotSatisfiedError':
        return "Camera doesn't support the required settings. Trying with basic settings...";
      case 'NotSupportedError':
        return "Camera not supported in this browser. Please use Chrome, Firefox, or Safari.";
      case 'SecurityError':
        return "Camera access blocked for security reasons. Please use HTTPS.";
      default:
        return `Camera error: ${error.message || error.name || 'Unknown error'}`;
    }
  };

  // Auto-start camera when component mounts
  useEffect(() => {
    if (!autoStartAttempted && !isActive && !isLoading && !error) {
      setAutoStartAttempted(true);
      startCamera();
    }
  }, [autoStartAttempted, isActive, isLoading, error, startCamera]);

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

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <p>Starting camera...</p>
                </div>
              </div>
            )}

            {/* Status Indicator */}
            <div className="absolute top-2 right-2">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={retryCamera}
                  className="ml-2"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {isActive ? 'Camera Active' : isLoading ? 'Connecting...' : 'Camera Inactive'}
              </span>
            </div>

            <div className="flex space-x-2">
              {!isActive ? (
                <Button 
                  onClick={startCamera} 
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </Button>
              ) : (
                <Button 
                  onClick={stopCamera} 
                  variant="destructive"
                >
                  <CameraOff className="w-4 h-4 mr-2" />
                  Stop Camera
                </Button>
              )}
            </div>
          </div>

          {/* Camera Tips */}
          {!isActive && !error && !isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-2">Camera Setup Tips:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure your camera is connected and working</li>
                <li>• Allow camera permissions when prompted</li>
                <li>• Close other apps that might be using the camera</li>
                <li>• Use Chrome, Firefox, or Safari for best results</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}