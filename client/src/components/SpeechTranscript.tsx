import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function SpeechTranscript() {
  const { transcript, isListening, wordCount, sessionTime } = useSpeechRecognition();
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when transcript updates
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript || "No transcript available"], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Live Transcript</h2>
          <Button 
            onClick={downloadTranscript}
            variant="ghost"
            size="sm"
            className="text-primary hover:text-blue-700"
            disabled={!transcript}
          >
            Export <Download className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div 
          ref={transcriptRef}
          className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto"
        >
          {transcript ? (
            <p className="text-gray-700 leading-relaxed">
              {transcript}
              {isListening && <span className="text-primary animate-pulse ml-1">|</span>}
            </p>
          ) : (
            <p className="text-gray-500 italic">
              {isListening ? "Listening for speech..." : "Start speaking to see transcript"}
            </p>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Words spoken: <span className="font-medium text-gray-700">{wordCount}</span></span>
          <span>Session time: <span className="font-medium text-gray-700">{formatTime(sessionTime)}</span></span>
        </div>
      </CardContent>
    </Card>
  );
}
