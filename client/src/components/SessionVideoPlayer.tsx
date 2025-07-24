// Enhanced Session Video Player with Transcript Display
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, Pause, RotateCcw, Volume2, Download,
  FileText, Eye, Clock, Maximize2, ChevronDown, ChevronUp
} from 'lucide-react';

interface SessionVideoPlayerProps {
  sessionId: number;
  onClose?: () => void;
}

interface SessionVideoData {
  session: {
    id: number;
    sessionName: string;
    transcript: string;
    duration: number;
    confidenceScore: number;
    overallScore: number;
    createdAt: string;
  };
  hasVideo: boolean;
  videoUrl?: string;
  hasTranscript: boolean;
}

export default function SessionVideoPlayer({ sessionId, onClose }: SessionVideoPlayerProps) {
  const [sessionData, setSessionData] = useState<SessionVideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showTranscript, setShowTranscript] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Load session data
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/sessions/${sessionId}/video`);
        
        if (!response.ok) {
          throw new Error('Failed to load session data');
        }

        const data = await response.json();
        setSessionData(data);
        
        console.log('📹 Session data loaded:', data);
        
      } catch (error) {
        console.error('❌ Failed to load session:', error);
        setError('Failed to load session data');
        toast({
          title: "Loading Error",
          description: "Failed to load session video and transcript",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [sessionId, toast]);

  // Video control handlers
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
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
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const handleDownload = async () => {
    if (!sessionData?.videoUrl) return;
    
    try {
      const response = await fetch(sessionData.videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sessionData.session.sessionName}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Video download has begun"
      });
    } catch (error) {
      toast({
        title: "Download Failed", 
        description: "Could not download video file",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading session...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !sessionData) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-red-600">
            <p className="text-lg font-semibold mb-2">Failed to Load Session</p>
            <p className="text-sm">{error || "Session data not available"}</p>
            {onClose && (
              <Button onClick={onClose} variant="outline" className="mt-4">
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-extrabold text-gray-900">
                {sessionData.session.sessionName}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(sessionData.session.duration)}
                </Badge>
                <Badge variant="outline">
                  Confidence: {Math.round(sessionData.session.confidenceScore)}%
                </Badge>
                <Badge variant="outline">
                  Overall: {Math.round(sessionData.session.overallScore)}%
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {sessionData.hasVideo && (
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
              {onClose && (
                <Button onClick={onClose} variant="outline" size="sm">
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Session Recording
                {!sessionData.hasVideo && (
                  <Badge variant="outline" className="ml-2">Audio Only</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionData.hasVideo ? (
                <>
                  {/* Video Element */}
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-64 lg:h-80 object-cover"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      src={sessionData.videoUrl}
                    >
                      Your browser does not support video playback.
                    </video>
                  </div>

                  {/* Video Controls */}
                  <div className="space-y-3">
                    <Progress value={(currentTime / duration) * 100} className="w-full" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {!isPlaying ? (
                          <Button onClick={handlePlay} size="sm">
                            <Play className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button onClick={handlePause} size="sm">
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                        <Button onClick={handleRestart} variant="outline" size="sm">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => handleVolumeChange([parseFloat(e.target.value)])}
                          className="w-20"
                        />
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <div className="text-center text-gray-600">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">No Video Recording</p>
                    <p className="text-sm">This session was recorded as audio only</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transcript Panel */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Transcript
                </CardTitle>
                <Button
                  onClick={() => setShowTranscript(!showTranscript)}
                  variant="ghost"
                  size="sm"
                >
                  {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showTranscript && (
                <ScrollArea className="h-80 lg:h-96">
                  {sessionData.hasTranscript ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {sessionData.session.transcript}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <div className="text-center">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No transcript available</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}