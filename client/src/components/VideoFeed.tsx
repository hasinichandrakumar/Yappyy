import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, Video, VideoOff } from "lucide-react";

export default function VideoFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
        setIsVideoEnabled(true);
        setError("");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please ensure camera permissions are granted.");
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
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Camera Feed</p>
              <p className="text-sm">Click to start video feed</p>
            </div>
          </div>
        )}
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center">
          <Button
            onClick={isVideoEnabled ? stopVideo : startVideo}
            variant={isVideoEnabled ? "destructive" : "default"}
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white border-white/20"
          >
            {isVideoEnabled ? (
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
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
          <p className="text-red-600 text-xs mt-1">
            Try refreshing the page or check your browser camera permissions.
          </p>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isVideoEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span>{isVideoEnabled ? 'Camera Active' : 'Camera Inactive'}</span>
        </div>
        <span className="text-xs">
          {isVideoEnabled ? 'Recording for speech analysis' : 'Click to enable video feed'}
        </span>
      </div>
    </div>
  );
}