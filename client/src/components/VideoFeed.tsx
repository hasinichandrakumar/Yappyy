import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Video, VideoOff, AlertCircle, RefreshCw } from "lucide-react";

export default function VideoFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>("prompt");

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermissionStatus(result.state);
      return result.state;
    } catch (error) {
      console.log("Permission API not supported");
      return "unknown";
    }
  };

  const startVideo = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Check if camera permission is already denied
      const permission = await checkCameraPermission();
      if (permission === 'denied') {
        setError("Camera access is blocked. Please enable camera permissions in your browser settings.");
        setIsLoading(false);
        return;
      }

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to load
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              if (videoRef.current) {
                videoRef.current.play().then(resolve).catch(resolve);
              }
            };
          }
        });
        
        setMediaStream(stream);
        setIsVideoEnabled(true);
        setError("");
        setPermissionStatus("granted");
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      
      let errorMessage = "Unable to access camera. ";
      
      if (err.name === "NotAllowedError") {
        errorMessage += "Camera access was denied. Please allow camera permissions and try again.";
        setPermissionStatus("denied");
      } else if (err.name === "NotFoundError") {
        errorMessage += "No camera device found. Please connect a camera and try again.";
      } else if (err.name === "NotReadableError") {
        errorMessage += "Camera is already in use by another application.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage += "Camera constraints could not be satisfied.";
      } else {
        errorMessage += "Please check your camera connection and permissions.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const stopVideo = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsVideoEnabled(false);
  };

  const retryCamera = async () => {
    setError("");
    await startVideo();
  };

  // Auto-start camera on component mount
  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  return (
    <div className="space-y-4">
      {/* Video Display */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        {isVideoEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              {isLoading ? (
                <>
                  <RefreshCw className="w-16 h-16 mx-auto mb-4 opacity-50 animate-spin" />
                  <p className="text-lg mb-2">Starting Camera...</p>
                  <p className="text-sm">Please allow camera access when prompted</p>
                </>
              ) : (
                <>
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Camera Feed</p>
                  <p className="text-sm">Click to start video feed</p>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2">
          <Button
            onClick={isVideoEnabled ? stopVideo : startVideo}
            variant={isVideoEnabled ? "destructive" : "default"}
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : isVideoEnabled ? (
              <>
                <CameraOff className="w-4 h-4 mr-2" />
                Stop Camera
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </>
            )}
          </Button>
          
          {error && (
            <Button
              onClick={retryCamera}
              variant="outline"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          )}
        </div>

        {/* Permission Status */}
        {permissionStatus && (
          <div className="absolute top-4 right-4">
            <Badge 
              variant={permissionStatus === "granted" ? "default" : 
                      permissionStatus === "denied" ? "destructive" : "secondary"}
              className="bg-black/50 text-white border-white/20"
            >
              {permissionStatus === "granted" ? "✓ Camera Access" :
               permissionStatus === "denied" ? "✗ Access Denied" :
               "? Camera Permission"}
            </Badge>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-700 text-sm font-medium">Camera Access Issue</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <div className="mt-3 space-y-1 text-xs text-red-600">
                <p>• Click the camera icon in your browser's address bar</p>
                <p>• Select "Allow" for camera permissions</p>
                <p>• Refresh the page if permissions were just changed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isVideoEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span>{isVideoEnabled ? 'Camera Active' : isLoading ? 'Connecting...' : 'Camera Inactive'}</span>
        </div>
        <div className="flex items-center space-x-4">
          {isVideoEnabled && (
            <span className="text-xs text-green-600">● Live Analysis Ready</span>
          )}
          <span className="text-xs">
            {isVideoEnabled ? 'Real-time body language analysis active' : 
             isLoading ? 'Requesting camera access...' :
             'Click to enable video analysis'}
          </span>
        </div>
      </div>

      {/* Quick Setup Tips */}
      {!isVideoEnabled && !error && !isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Video Analysis Benefits:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Real-time posture and gesture feedback</li>
            <li>• Eye contact tracking and coaching</li>
            <li>• Body language confidence scoring</li>
            <li>• Professional presence analysis</li>
          </ul>
        </div>
      )}
    </div>
  );
}