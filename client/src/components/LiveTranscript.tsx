import { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Mic, 
  MicOff, 
  RotateCcw, 
  Timer, 
  MessageSquareText,
  AlertTriangle,
  Zap
} from 'lucide-react';

export default function LiveTranscript() {
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    wordCount,
    wpm,
    fillerWords,
    currentSentence
  } = useSpeechRecognition();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [lastAnalyzedLength, setLastAnalyzedLength] = useState(0);

  // Real-time transcription analysis
  const transcriptionMutation = useMutation({
    mutationFn: async (data: { transcript: string; isPartial: boolean }) => {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      return await response.json();
    },
    onSuccess: (result) => {
      setAnalysis(result.analysis);
    }
  });
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Trigger analysis when transcript changes significantly
  useEffect(() => {
    if (transcript.length > lastAnalyzedLength + 20) { // Analyze every 20 characters
      transcriptionMutation.mutate({
        transcript,
        isPartial: isListening
      });
      setLastAnalyzedLength(transcript.length);
    }
  }, [transcript, isListening, lastAnalyzedLength]);

  useEffect(() => {
    if (isListening && !sessionStartTime) {
      setSessionStartTime(new Date());
    } else if (!isListening && sessionStartTime) {
      setSessionStartTime(null);
    }
  }, [isListening, sessionStartTime]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [transcript]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getWPMStatus = (wpm: number) => {
    if (wpm < 120) return { label: 'Too Slow', color: 'bg-red-100 text-red-800' };
    if (wpm < 140) return { label: 'Slow', color: 'bg-yellow-100 text-yellow-800' };
    if (wpm < 180) return { label: 'Good', color: 'bg-green-100 text-green-800' };
    if (wpm < 200) return { label: 'Fast', color: 'bg-blue-100 text-blue-800' };
    return { label: 'Too Fast', color: 'bg-red-100 text-red-800' };
  };

  const highlightFillerWords = (text: string) => {
    if (!text || fillerWords.length === 0) return text;
    
    let highlightedText = text;
    fillerWords.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        `<span class="bg-yellow-200 text-yellow-800 px-1 rounded font-medium">${filler}</span>`
      );
    });
    
    return highlightedText;
  };

  const wpmStatus = getWPMStatus(wpm);

  return (
    <Card className="h-full flex flex-col shadow-lg border-0 bg-white">
      <CardHeader className="pb-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-3 text-gray-900">
            <MessageSquareText className="w-6 h-6 text-cyan-600" />
            Live Transcript
          </CardTitle>
          <div className="flex items-center gap-2">
            {isListening ? (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                Recording
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800">
                Stopped
              </Badge>
            )}
          </div>
        </div>
        
        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-6 pt-4">
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-600 mb-1">Words</div>
            <div className="text-2xl font-bold text-gray-900">{wordCount}</div>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-600 mb-1">WPM</div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-2xl font-bold text-gray-900">{wpm}</div>
              <Badge className={`text-xs ${wpmStatus.color}`}>
                {wpmStatus.label}
              </Badge>
            </div>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-600 mb-1">Fillers</div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-2xl font-bold text-gray-900">{analysis?.fillerWords || fillerWords.length}</div>
              {fillerWords.length > 3 && (
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-6 p-6">
        {/* Controls */}
        <div className="flex gap-3">
          {!isListening ? (
            <Button 
              onClick={startListening}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button 
              onClick={stopListening}
              variant="destructive"
              className="flex-1"
            >
              <MicOff className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          )}
          
          <Button 
            onClick={resetTranscript}
            variant="outline"
            size="icon"
            title="Clear transcript"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Session Info */}
        {sessionStartTime && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            <Timer className="w-4 h-4" />
            Session started at {formatTime(sessionStartTime)}
          </div>
        )}

        {/* Transcript Display */}
        <ScrollArea className="flex-1 border rounded-lg p-4 min-h-48">
          <div ref={scrollAreaRef} className="space-y-3">
            {transcript ? (
              <div className="space-y-2">
                <div 
                  className="text-gray-900 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightFillerWords(transcript) 
                  }}
                />
                {currentSentence && (
                  <div className="text-gray-500 italic border-l-2 border-blue-300 pl-3">
                    {currentSentence}...
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Mic className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                <p>Click "Start Recording" to begin live transcription</p>
                <p className="text-sm mt-2">Your speech will appear here in real-time</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Filler Words Summary */}
        {fillerWords.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Detected Filler Words ({fillerWords.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from(new Set(fillerWords)).map((filler, index) => (
                <Badge 
                  key={index}
                  className="bg-yellow-200 text-yellow-800 text-xs"
                >
                  {filler} ({fillerWords.filter(f => f === filler).length})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}