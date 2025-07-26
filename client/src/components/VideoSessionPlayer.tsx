import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Video, Play, Pause, Download, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';

interface VideoSessionPlayerProps {
  sessionId: number;
  sessionData: any;
}

interface VideoData {
  session?: {
    id: number;
    sessionName?: string;
    transcript?: string;
    duration?: number;
    confidenceScore?: number;
    overallScore?: number;
    createdAt?: string;
  };
  hasVideo: boolean;
  videoUrl?: string;
  hasTranscript: boolean;
}

export default function VideoSessionPlayer({ sessionId, sessionData }: VideoSessionPlayerProps) {
  const [showVideo, setShowVideo] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  // Fetch video data for the session
  const { data: videoData, isLoading, error } = useQuery<VideoData>({
    queryKey: [`/api/sessions/${sessionId}/video`],
    enabled: !!sessionId,
  });

  const handleDownload = () => {
    if (videoData?.videoUrl) {
      const link = document.createElement('a');
      link.href = videoData.videoUrl;
      link.download = `session-${sessionId}-recording.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Session video is being downloaded",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4 bg-white/80 backdrop-blur-sm border border-blue-200/50">
        <div className="flex items-center gap-2 mb-3">
          <Video className="h-5 w-5 text-blue-600" />
          <h5 className="font-semibold text-blue-900">Session Recording</h5>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-blue-600">Loading video...</span>
        </div>
      </Card>
    );
  }

  if (error || !videoData) {
    return (
      <Card className="p-4 bg-white/80 backdrop-blur-sm border border-yellow-200/50">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <h5 className="font-semibold text-yellow-900">Video Not Available</h5>
        </div>
        <div className="text-center py-4">
          <p className="text-yellow-700 mb-2">
            {videoData?.hasVideo === false 
              ? "This session was recorded without video" 
              : "Video data could not be loaded"}
          </p>
          {videoData?.hasTranscript && (
            <p className="text-sm text-yellow-600">
              Transcript and analysis data are still available
            </p>
          )}
        </div>
      </Card>
    );
  }

  if (!videoData.hasVideo) {
    return (
      <Card className="p-4 bg-white/80 backdrop-blur-sm border border-gray-200/50">
        <div className="flex items-center gap-2 mb-3">
          <Video className="h-5 w-5 text-gray-600" />
          <h5 className="font-semibold text-gray-900">Audio Only Session</h5>
        </div>
        <div className="text-center py-4">
          <p className="text-gray-600 mb-2">This session was recorded in audio-only mode</p>
          {videoData.hasTranscript && (
            <p className="text-sm text-gray-500">Full transcript and voice analysis available</p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border border-blue-200/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-blue-600" />
          <h5 className="font-semibold text-blue-900">Session Recording</h5>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVideo(!showVideo)}
          >
            {showVideo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showVideo ? 'Hide Video' : 'Show Video'}
          </Button>
          {videoData.videoUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>

      {showVideo && videoData.videoUrl && (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            className="w-full max-h-96 object-contain"
            controls
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggNVYxOUwxOSAxMkw4IDVaIiBmaWxsPSIjNjM2NkYxIi8+Cjwvc3ZnPgo="
          >
            <source src={videoData.videoUrl} type="video/webm" />
            <source src={videoData.videoUrl} type="video/mp4" />
            Your browser does not support video playback.
          </video>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {sessionData?.sessionName || sessionData?.name || 'Practice Session'}
          </div>
        </div>
      )}

      {showVideo && videoData.session?.transcript && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <h6 className="font-medium text-gray-900 mb-2">Session Transcript</h6>
          <p className="text-sm text-gray-700 max-h-24 overflow-y-auto">
            {videoData.session.transcript}
          </p>
        </div>
      )}
    </Card>
  );
}