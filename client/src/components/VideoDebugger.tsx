// Video Debugging Component - Helps identify video playback issues
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, Pause, RotateCcw, Download, AlertTriangle, CheckCircle, 
  XCircle, Info, RefreshCw, Video, FileText, Database
} from 'lucide-react';

interface VideoDebuggerProps {
  sessionId: number;
}

interface VideoDebugData {
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
  videoDebug?: {
    hasVideoBlob: boolean;
    videoBlobType: string;
    videoBlobLength: number;
    videoUrlCreated: boolean;
    videoUrlLength: number;
  };
}

export default function VideoDebugger({ sessionId }: VideoDebuggerProps) {
  const [debugData, setDebugData] = useState<VideoDebugData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoErrors, setVideoErrors] = useState<string[]>([]);
  const [videoWarnings, setVideoWarnings] = useState<string[]>([]);
  const [videoInfo, setVideoInfo] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoLoadTime, setVideoLoadTime] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Load session data with debugging
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setVideoErrors([]);
        setVideoWarnings([]);
        setVideoInfo([]);

        console.log('🔍 Video Debugger: Loading session data for ID:', sessionId);
        const startTime = Date.now();

        const response = await fetch(`/api/sessions/${sessionId}/video`);
        const loadTime = Date.now() - startTime;
        
        console.log('🔍 Video Debugger: API response time:', loadTime + 'ms');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setDebugData(data);
        
        console.log('🔍 Video Debugger: Session data loaded:', data);

        // Analyze video data
        analyzeVideoData(data, loadTime);
        
      } catch (error) {
        console.error('❌ Video Debugger: Failed to load session:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setVideoErrors([`Failed to load session data: ${error}`]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [sessionId]);

  const analyzeVideoData = (data: VideoDebugData, loadTime: number) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const info: string[] = [];

    // Check API response
    info.push(`API response time: ${loadTime}ms`);
    info.push(`Session ID: ${data.session.id}`);
    info.push(`Session name: ${data.session.sessionName}`);

    // Check video availability
    if (!data.hasVideo) {
      warnings.push('No video data available for this session');
    } else {
      info.push('Video data is available');
    }

    // Check video debug info
    if (data.videoDebug) {
      const debug = data.videoDebug;
      info.push(`Video blob type: ${debug.videoBlobType}`);
      info.push(`Video blob length: ${debug.videoBlobLength} bytes`);
      info.push(`Video URL created: ${debug.videoUrlCreated ? 'Yes' : 'No'}`);
      info.push(`Video URL length: ${debug.videoUrlLength} characters`);

      if (!debug.hasVideoBlob) {
        errors.push('No video blob found in database');
      }

      if (debug.videoBlobLength === 0) {
        errors.push('Video blob is empty (0 bytes)');
      }

      if (!debug.videoUrlCreated) {
        errors.push('Failed to create video URL from blob');
      }

      if (debug.videoUrlLength === 0) {
        errors.push('Video URL is empty');
      }

      // Check for reasonable video size
      if (debug.videoBlobLength > 0 && debug.videoBlobLength < 1000) {
        warnings.push('Video blob is very small (< 1KB) - may be corrupted');
      }

      if (debug.videoBlobLength > 100 * 1024 * 1024) {
        warnings.push('Video blob is very large (> 100MB) - may cause performance issues');
      }
    }

    // Check video URL format
    if (data.videoUrl) {
      if (data.videoUrl.startsWith('data:video/webm;base64,')) {
        info.push('Video URL format: WebM base64 data URL');
      } else if (data.videoUrl.startsWith('data:video/')) {
        info.push(`Video URL format: ${data.videoUrl.split(';')[0]} data URL`);
      } else {
        warnings.push('Video URL format is not a standard data URL');
      }

      // Check URL length
      if (data.videoUrl.length > 10 * 1024 * 1024) {
        warnings.push('Video URL is very long (> 10MB) - may cause browser issues');
      }
    }

    // Check transcript
    if (data.hasTranscript) {
      info.push(`Transcript length: ${data.session.transcript.length} characters`);
    } else {
      warnings.push('No transcript available');
    }

    setVideoErrors(errors);
    setVideoWarnings(warnings);
    setVideoInfo(info);
  };

  // Video event handlers
  const handleVideoLoad = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setVideoLoadTime(Date.now());
      console.log('🔍 Video Debugger: Video loaded successfully');
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const error = video.error;
    let errorMessage = 'Unknown video error';

    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'Video playback was aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error occurred while loading video';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = 'Video decoding error - file may be corrupted';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Video format not supported by browser';
          break;
        default:
          errorMessage = `Video error code: ${error.code}`;
      }
    }

    console.error('❌ Video Debugger: Video error:', errorMessage);
    setVideoErrors(prev => [...prev, errorMessage]);
  };

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDownload = () => {
    if (debugData?.videoUrl) {
      const link = document.createElement('a');
      link.href = debugData.videoUrl;
      link.download = `session-${sessionId}-debug.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Video file is being downloaded for debugging",
      });
    }
  };

  const refreshData = () => {
    window.location.reload();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Video Debugger - Loading...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">Analyzing video data for session {sessionId}...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Debug Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Debugger - Session {sessionId}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive video playback diagnostics
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={refreshData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {debugData?.videoUrl && (
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Video Player */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Video Player
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {debugData?.hasVideo && debugData?.videoUrl ? (
              <>
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-contain"
                    onLoadedData={handleVideoLoad}
                    onError={handleVideoError}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    src={debugData.videoUrl}
                    controls
                  >
                    Your browser does not support video playback.
                  </video>
                </div>

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
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {formatTime(currentTime)} / {formatTime(duration)}
                    {videoLoadTime && (
                      <span className="ml-2 text-xs">
                        (Loaded in {videoLoadTime}ms)
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <div className="text-center text-gray-600">
                  <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">No Video Available</p>
                  <p className="text-sm">This session has no video data</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug Information */}
        <div className="space-y-4">
          {/* Errors */}
          {videoErrors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  Errors ({videoErrors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {videoErrors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warnings */}
          {videoWarnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="w-5 h-5" />
                  Warnings ({videoWarnings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {videoWarnings.map((warning, index) => (
                    <Alert key={index} variant="default" className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{warning}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information */}
          {videoInfo.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Info className="w-5 h-5" />
                  Information ({videoInfo.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {videoInfo.map((info, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-800">{info}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session Info */}
          {debugData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Session Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Session Name:</span>
                    <span className="text-sm">{debugData.session.sessionName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">{formatTime(debugData.session.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Confidence Score:</span>
                    <Badge variant="outline">{Math.round(debugData.session.confidenceScore)}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Overall Score:</span>
                    <Badge variant="outline">{Math.round(debugData.session.overallScore)}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Has Transcript:</span>
                    <Badge variant={debugData.hasTranscript ? "default" : "secondary"}>
                      {debugData.hasTranscript ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Has Video:</span>
                    <Badge variant={debugData.hasVideo ? "default" : "secondary"}>
                      {debugData.hasVideo ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
