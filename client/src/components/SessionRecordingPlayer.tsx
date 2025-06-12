import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Download,
  Eye,
  EyeOff
} from "lucide-react";

interface SessionRecordingPlayerProps {
  session: any;
  onTimeUpdate?: (currentTime: number) => void;
}

export default function SessionRecordingPlayer({ session, onTimeUpdate }: SessionRecordingPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
      onTimeUpdate?.(current);
    }
  };

  const handleSeek = (progress: number) => {
    if (videoRef.current && duration) {
      const newTime = (progress / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Session Recording</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVideo(!showVideo)}
            >
              {showVideo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showVideo ? 'Hide Video' : 'Show Video'}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Player */}
        {showVideo && (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              poster={session.thumbnailUrl || "/api/placeholder/640/360"}
            >
              <source src={session.videoUrl || session.recordingUrl} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>
        )}

        {/* Audio-only Player for sessions without video */}
        {!showVideo && session.audioUrl && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
            <audio
              ref={audioRef}
              className="w-full"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={session.audioUrl} type="audio/mp3" />
              Your browser does not support audio playback.
            </audio>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={duration ? (currentTime / duration) * 100 : 0} 
            className="cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const progress = ((e.clientX - rect.left) / rect.width) * 100;
              handleSeek(progress);
            }}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSkip(-10)}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={handlePlayPause}
            size="lg"
            className="rounded-full w-12 h-12"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSkip(10)}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                if (videoRef.current) videoRef.current.volume = newVolume;
                if (audioRef.current) audioRef.current.volume = newVolume;
              }}
              className="w-20"
            />
          </div>
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold">{formatTime(session.duration || 0)}</div>
            <div className="text-sm text-gray-500">Duration</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{session.wordCount || 0}</div>
            <div className="text-sm text-gray-500">Words</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{session.averageWPM || 0}</div>
            <div className="text-sm text-gray-500">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{session.overallScore || 0}%</div>
            <div className="text-sm text-gray-500">Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}