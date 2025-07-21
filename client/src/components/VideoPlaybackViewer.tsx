// Video Playback and Transcript Viewer Component
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, Pause, RotateCcw, FastForward, Volume2, 
  FileText, BarChart3, Eye, Clock, Maximize2,
  Download, Share2
} from 'lucide-react';
import { VideoRecordingData, videoPlaybackManager } from '@/lib/video-recording';

interface VideoPlaybackViewerProps {
  recordingData: VideoRecordingData;
  onClose?: () => void;
}

export default function VideoPlaybackViewer({ recordingData, onClose }: VideoPlaybackViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showMetrics, setShowMetrics] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize video playback on component mount
  useEffect(() => {
    if (videoRef.current && recordingData) {
      videoPlaybackManager.initializePlayback(videoRef.current, recordingData);
      
      // Set up event listeners for playback state updates
      const updatePlaybackState = () => {
        const state = videoPlaybackManager.getPlaybackState();
        setIsPlaying(state.isPlaying);
        setCurrentTime(state.currentTime);
        setDuration(state.duration);
      };

      const interval = setInterval(updatePlaybackState, 100);
      return () => clearInterval(interval);
    }
  }, [recordingData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      videoPlaybackManager.cleanup();
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoPlaybackManager.pause();
    } else {
      videoPlaybackManager.play();
    }
  };

  const handleSeek = (newTime: number[]) => {
    const seekTime = newTime[0];
    videoPlaybackManager.seekTo(seekTime);
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol / 100;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    videoPlaybackManager.setPlaybackSpeed(speed);
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const downloadVideo = () => {
    const link = document.createElement('a');
    link.href = recordingData.videoBlobUrl;
    link.download = `${recordingData.sessionId}_recording.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Session Recording Playback</h2>
          <p className="text-gray-600">Session: {recordingData.sessionId}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={downloadVideo}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-0">
              {/* Video Element */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full aspect-video"
                  controls={false}
                  onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                  onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Video Overlay Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-white mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" onClick={handlePlayPause}>
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleSeek([0])}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleSeek([currentTime + 10])}>
                        <FastForward className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Volume Control */}
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-white" />
                        <Slider
                          value={[volume]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={handleVolumeChange}
                          className="w-20"
                        />
                      </div>

                      {/* Speed Control */}
                      <select
                        value={playbackSpeed}
                        onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                        className="bg-black/50 text-white text-xs rounded px-2 py-1 border border-white/20"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>

                      <Button size="sm" variant="ghost" onClick={handleFullscreen}>
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Session Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {formatTime(duration)}
                  </div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {Math.round((recordingData.videoBlob.size / 1024 / 1024) * 100) / 100}MB
                  </div>
                  <div className="text-sm text-gray-600">File Size</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {new Date(recordingData.startTime).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">Date</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {new Date(recordingData.startTime).toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-gray-600">Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Panel Toggle */}
          <div className="flex space-x-2">
            <Button
              variant={showTranscript ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowTranscript(true);
                setShowMetrics(false);
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Transcript
            </Button>
            <Button
              variant={showMetrics ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setShowTranscript(false);
                setShowMetrics(true);
              }}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Metrics
            </Button>
          </div>

          {/* Transcript Panel */}
          {showTranscript && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Session Transcript</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {recordingData.transcript ? (
                      <div className="prose prose-sm max-w-none">
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {recordingData.transcript}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No transcript available for this session.</p>
                        <p className="text-sm">Transcript is generated during recording.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Metrics Panel */}
          {showMetrics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {recordingData.metrics && Object.keys(recordingData.metrics).length > 0 ? (
                      <>
                        {/* Voice Metrics */}
                        <div>
                          <h4 className="font-semibold mb-2">Voice Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Clarity</span>
                              <Badge variant="outline">
                                {recordingData.metrics.voice?.clarity || 'N/A'}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Pace</span>
                              <Badge variant="outline">
                                {recordingData.metrics.voice?.pace || 'N/A'} WPM
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Filler Words</span>
                              <Badge variant="outline">
                                {recordingData.metrics.fillerWordCount || 0}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Body Language */}
                        <div>
                          <h4 className="font-semibold mb-2">Body Language</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Eye Contact</span>
                              <Badge variant="outline">
                                {recordingData.metrics.bodyLanguage?.eyeContactScore || 'N/A'}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Posture</span>
                              <Badge variant="outline">
                                {recordingData.metrics.bodyLanguage?.postureConfidence || 'N/A'}%
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Gestures</span>
                              <Badge variant="outline">
                                {recordingData.metrics.bodyLanguage?.gestureEffectiveness || 'N/A'}%
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {recordingData.facialAnalysis && (
                          <>
                            <Separator />
                            
                            {/* Facial Analysis */}
                            <div>
                              <h4 className="font-semibold mb-2">Facial Expression</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Confidence</span>
                                  <Badge variant="outline">
                                    {Math.round(recordingData.facialAnalysis.emotionalExpression?.confidence || 0)}%
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Engagement</span>
                                  <Badge variant="outline">
                                    {Math.round(recordingData.facialAnalysis.emotionalExpression?.engagement || 0)}%
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Authenticity</span>
                                  <Badge variant="outline">
                                    {Math.round(recordingData.facialAnalysis.emotionalExpression?.authenticity || 0)}%
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No metrics available for this session.</p>
                        <p className="text-sm">Metrics are generated during recording analysis.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}