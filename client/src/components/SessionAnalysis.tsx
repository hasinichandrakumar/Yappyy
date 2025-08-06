import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import {
  LineChart,
  BarChart,
  Activity,
  Clock,
  Eye,
  MessageSquare,
  Calendar,
  PlayCircle,
  PauseCircle,
  RotateCcw,
} from 'lucide-react';

interface SessionData {
  id: string;
  date: string;
  duration: number;
  videoUrl: string;
  transcript: string;
  metrics: {
    wpm: number[];
    eyeContact: number[];
    confidence: number[];
    fillerWords: {
      word: string;
      timestamp: number;
    }[];
    overallStats: {
      averageWpm: number;
      averageEyeContact: number;
      averageConfidence: number;
      totalFillerWords: number;
    };
  };
}

interface SessionAnalysisProps {
  sessionId: string;
}

export function SessionAnalysis({ sessionId }: SessionAnalysisProps) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState<'wpm' | 'eyeContact' | 'confidence'>('wpm');
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fetch session data from your backend
    const fetchSessionData = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}`);
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error('Failed to fetch session data:', error);
      }
    };

    fetchSessionData();
  }, [sessionId]);

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
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTranscript = () => {
    if (!session) return null;

    const words = session.transcript.split(/\s+/);
    const fillerWordTimestamps = new Set(
      session.metrics.fillerWords.map(fw => fw.word.toLowerCase())
    );

    return words.map((word, index) => {
      const isFillerWord = fillerWordTimestamps.has(word.toLowerCase());
      return (
        <span
          key={index}
          className={`${
            isFillerWord
              ? 'bg-yellow-200 px-1 rounded cursor-help'
              : ''
          }`}
          title={isFillerWord ? 'Filler word' : undefined}
        >
          {word}{' '}
        </span>
      );
    });
  };

  if (!session) {
    return <div>Loading session data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Session Analysis</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(session.date).toLocaleDateString()}</span>
          <Clock className="w-4 h-4 ml-4" />
          <span>{formatTime(session.duration)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Player */}
        <Card>
          <CardContent className="p-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={session.videoUrl}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="text-white hover:text-blue-400 transition"
                  >
                    {isPlaying ? (
                      <PauseCircle className="w-8 h-8" />
                    ) : (
                      <PlayCircle className="w-8 h-8" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max={session.duration}
                      value={currentTime}
                      onChange={(e) => handleSeek(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <span className="text-white">
                    {formatTime(currentTime)} / {formatTime(session.duration)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Overview */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Average WPM</span>
                </div>
                <p className="text-2xl font-semibold">
                  {session.metrics.overallStats.averageWpm}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Eye Contact</span>
                </div>
                <p className="text-2xl font-semibold">
                  {Math.round(session.metrics.overallStats.averageEyeContact * 100)}%
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">Confidence</span>
                </div>
                <p className="text-2xl font-semibold">
                  {Math.round(session.metrics.overallStats.averageConfidence * 100)}%
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">Filler Words</span>
                </div>
                <p className="text-2xl font-semibold">
                  {session.metrics.overallStats.totalFillerWords}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList>
          <TabsTrigger value="metrics">
            <LineChart className="w-4 h-4 mr-2" />
            Detailed Metrics
          </TabsTrigger>
          <TabsTrigger value="transcript">
            <MessageSquare className="w-4 h-4 mr-2" />
            Transcript
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setSelectedMetric('wpm')}
                  className={`flex items-center gap-2 px-3 py-1 rounded ${
                    selectedMetric === 'wpm'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  WPM
                </button>
                <button
                  onClick={() => setSelectedMetric('eyeContact')}
                  className={`flex items-center gap-2 px-3 py-1 rounded ${
                    selectedMetric === 'eyeContact'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Eye Contact
                </button>
                <button
                  onClick={() => setSelectedMetric('confidence')}
                  className={`flex items-center gap-2 px-3 py-1 rounded ${
                    selectedMetric === 'confidence'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Confidence
                </button>
              </div>

              <div className="h-64 relative">
                {/* Replace with your preferred charting library */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Chart visualization for {selectedMetric}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcript" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Transcript</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="inline-block w-3 h-3 bg-yellow-200 rounded" />
                  <span>Filler Words</span>
                </div>
              </div>
              
              <ScrollArea className="h-[400px] pr-4">
                <div className="text-gray-700 leading-relaxed">
                  {renderTranscript()}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}