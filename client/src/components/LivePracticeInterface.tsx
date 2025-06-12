import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Mic, 
  MicOff,
  Volume2,
  Download,
  Share,
  FileText,
  Activity,
  Clock,
  Zap
} from "lucide-react";

interface TranscriptWord {
  word: string;
  timestamp: number;
  confidence: number;
  type: "normal" | "filler" | "keyword" | "repeated";
  emotion?: "happy" | "neutral" | "concerned" | "excited";
}

interface LivePracticeInterfaceProps {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onStopRecording: () => void;
  onResetSession: () => void;
  audioLevel: number;
  speechRate: number;
  transcript: TranscriptWord[];
}

export default function LivePracticeInterface({
  isRecording,
  isPaused,
  duration,
  onStartRecording,
  onPauseRecording,
  onStopRecording,
  onResetSession,
  audioLevel,
  speechRate,
  transcript
}: LivePracticeInterfaceProps) {
  const [waveformData, setWaveformData] = useState<number[]>(Array(50).fill(0));
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Simulate waveform animation
  useEffect(() => {
    if (!isRecording || isPaused) return;

    const interval = setInterval(() => {
      setWaveformData(prev => {
        const newData = [...prev.slice(1)];
        newData.push(Math.random() * audioLevel * 2);
        return newData;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording, isPaused, audioLevel]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current && currentWordIndex > 0) {
      const wordElement = transcriptRef.current.querySelector(`[data-word-index="${currentWordIndex}"]`);
      if (wordElement) {
        wordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentWordIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordStyle = (word: TranscriptWord, index: number) => {
    const baseStyle = "inline-block mx-1 px-1 rounded transition-all duration-200";
    
    if (index === currentWordIndex) {
      return `${baseStyle} bg-cyan-200 font-semibold`;
    }
    
    switch (word.type) {
      case "filler":
        return `${baseStyle} bg-red-100 text-red-700 line-through`;
      case "keyword":
        return `${baseStyle} bg-green-100 text-green-700 font-medium`;
      case "repeated":
        return `${baseStyle} bg-yellow-100 text-yellow-700`;
      default:
        return `${baseStyle} hover:bg-gray-100`;
    }
  };

  const getEmotionEmoji = (emotion?: string) => {
    switch (emotion) {
      case "happy": return "😃";
      case "excited": return "🎉";
      case "concerned": return "😐";
      default: return "";
    }
  };

  const exportTranscript = () => {
    const text = transcript.map(word => word.word).join(' ');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Main Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-600" />
              <span>Live Practice Session</span>
            </CardTitle>
            <Badge variant={isRecording ? "default" : "secondary"} className={isRecording ? "bg-red-500" : ""}>
              {isRecording ? (isPaused ? "Paused" : "Recording") : "Ready"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer and Controls */}
          <div className="text-center space-y-4">
            <div className="text-4xl font-mono font-bold text-gray-900">
              {formatTime(duration)}
            </div>
            
            <div className="flex justify-center space-x-3">
              {!isRecording ? (
                <Button 
                  onClick={onStartRecording}
                  size="lg"
                  className="bg-red-500 hover:bg-red-600 text-white px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={onPauseRecording}
                    size="lg"
                    variant="outline"
                    className="px-6"
                  >
                    {isPaused ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                  <Button 
                    onClick={onStopRecording}
                    size="lg"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-6"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    Stop
                  </Button>
                </>
              )}
              
              <Button 
                onClick={onResetSession}
                size="lg"
                variant="outline"
                className="px-6"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Audio Waveform */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {isRecording && !isPaused ? (
                  <Mic className="w-4 h-4 text-red-500" />
                ) : (
                  <MicOff className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm font-medium">Audio Level</span>
              </div>
              <span className="text-sm text-gray-600">{audioLevel} dB</span>
            </div>
            
            <div className="flex items-end justify-center space-x-1 h-16">
              {waveformData.map((height, index) => (
                <div
                  key={index}
                  className={`w-2 rounded-t transition-all duration-100 ${
                    isRecording && !isPaused 
                      ? height > 30 ? 'bg-red-500' : height > 15 ? 'bg-yellow-500' : 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                  style={{ height: `${Math.max(2, height)}%` }}
                />
              ))}
            </div>
            
            <Progress value={audioLevel} className="mt-3" />
          </div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-700">{speechRate}</div>
              <div className="text-sm text-blue-600">WPM</div>
              <div className="text-xs text-gray-500">Goal: 120-150</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-700">{transcript.length}</div>
              <div className="text-sm text-green-600">Words</div>
              <div className="text-xs text-gray-500">Current session</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-700">
                {transcript.filter(w => w.type === "filler").length}
              </div>
              <div className="text-sm text-purple-600">Fillers</div>
              <div className="text-xs text-gray-500">To reduce</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Transcript Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Live Transcript</span>
              {isRecording && (
                <Badge className="bg-green-100 text-green-700">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              )}
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportTranscript}
                disabled={transcript.length === 0}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={transcript.length === 0}
              >
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {transcript.length > 0 ? (
            <div 
              ref={transcriptRef}
              className="bg-white border rounded-lg p-4 h-64 overflow-y-auto text-lg leading-relaxed"
            >
              {transcript.map((word, index) => (
                <span
                  key={index}
                  data-word-index={index}
                  className={getWordStyle(word, index)}
                  title={`Confidence: ${Math.round(word.confidence * 100)}%`}
                >
                  {word.word}
                  {word.emotion && (
                    <span className="ml-1 text-sm">
                      {getEmotionEmoji(word.emotion)}
                    </span>
                  )}
                </span>
              ))}
              {isRecording && !isPaused && (
                <span className="inline-block w-1 h-6 bg-cyan-500 animate-pulse ml-1" />
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Start recording to see live transcript</p>
              <p className="text-sm text-gray-500 mt-2">
                Speech will appear here in real-time with smart highlighting
              </p>
            </div>
          )}

          {/* Transcript Legend */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 bg-green-100 rounded"></span>
              <span>Keywords</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 bg-red-100 rounded"></span>
              <span>Filler Words</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 bg-yellow-100 rounded"></span>
              <span>Repeated Phrases</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 bg-cyan-200 rounded"></span>
              <span>Current Word</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}