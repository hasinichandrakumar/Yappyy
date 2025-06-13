import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Download
} from "lucide-react";

interface SimpleRecordingPlayerProps {
  session: any;
}

export default function SimpleRecordingPlayer({ session }: SimpleRecordingPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const progress = (e.clientX - rect.left) / rect.width;
      const newTime = progress * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Watch Your Session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Player */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            poster={session.thumbnailUrl || "/api/placeholder/640/360"}
          >
            <source src={session.videoUrl || session.recordingUrl} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={duration ? (currentTime / duration) * 100 : 0} 
            className="cursor-pointer h-2"
            onClick={handleProgressClick}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Simple Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Restart
          </Button>
          
          <Button
            onClick={handlePlayPause}
            size="lg"
            className="flex items-center gap-2 px-6"
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Play
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isMuted ? "Unmute" : "Mute"}
          </Button>
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t text-center">
          <div>
            <div className="text-lg font-semibold">{formatTime(session.duration || 0)}</div>
            <div className="text-sm text-gray-500">Duration</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{session.wordCount || 0}</div>
            <div className="text-sm text-gray-500">Words Spoken</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{session.overallScore || 0}%</div>
            <div className="text-sm text-gray-500">Overall Score</div>
          </div>
        </div>

        {/* Download Button */}
        <div className="pt-2">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Recording
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}