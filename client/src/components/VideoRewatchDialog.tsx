import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  RotateCcw, 
  Download,
  Maximize2,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoRewatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: number;
  sessionName: string;
  transcript?: string;
}

export default function VideoRewatchDialog({ 
  isOpen, 
  onClose, 
  sessionId, 
  sessionName, 
  transcript 
}: VideoRewatchDialogProps) {
  const [videoData, setVideoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [showTranscript, setShowTranscript] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Load video data when dialog opens
  useEffect(() => {
    if (isOpen && sessionId) {
      loadVideoData();
    }
  }, [isOpen, sessionId]);

  const loadVideoData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/video`);
      if (response.ok) {
        const data = await response.json();
        setVideoData(data);
        console.log('📹 Video data loaded:', data);
      } else {
        toast({
          title: "Video not found",
          description: "This session doesn't have a video recording.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading video:', error);
      toast({
        title: "Error loading video",
        description: "Failed to load session video.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update time progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
      setIsPlaying(!video.paused);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateTime);
    video.addEventListener('play', updateTime);
    video.addEventListener('pause', updateTime);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateTime);
      video.removeEventListener('play', updateTime);
      video.removeEventListener('pause', updateTime);
    };
  }, [videoData]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (newTime: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = newTime[0];
    setCurrentTime(newTime[0]);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const vol = newVolume[0] / 100;
    video.volume = vol;
    setVolume(newVolume[0]);
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = 0;
    setCurrentTime(0);
  };

  const handleDownload = () => {
    if (videoData?.videoUrl) {
      const link = document.createElement('a');
      link.href = videoData.videoUrl;
      link.download = `${sessionName}-recording.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Session video is being downloaded",
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            {sessionName} - Video Playback
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-6 pt-0">
          {isLoading ? (
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
              </div>
            </div>
          ) : videoData?.hasVideo ? (
            <>
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  src={videoData.videoUrl}
                  onError={(e) => {
                    console.error('Video playback error:', e);
                    toast({
                      title: "Playback Error",
                      description: "Unable to play video. The file may be corrupted.",
                      variant: "destructive"
                    });
                  }}
                >
                  Your browser does not support video playback.
                </video>
              </div>

              {/* Video Controls */}
              <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePlayPause}
                      className="flex items-center gap-2"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRestart}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restart
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="w-20"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      {showTranscript ? 'Hide' : 'Show'} Transcript
                    </Button>
                  </div>
                </div>
              </div>

              {/* Transcript Panel */}
              {showTranscript && transcript && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Session Transcript
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {transcript}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">No video recording available for this session</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}