import { Card, CardContent } from "@/components/ui/card";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";
import { useMediaPipe } from "@/hooks/useMediaPipe";

export default function SessionStats() {
  // User explicitly requested removal of all analytics boxes during practice
  return null;
  const { sessionTime, wordCount } = useSpeechRecognition();
  const { speakingPace, fillerWords, pauseCount } = useVoiceAnalysis();
  const { eyeContact } = useMediaPipe();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getEyeContactLabel = (eyeContact: string | null) => {
    if (!eyeContact) return "Analyzing...";
    return eyeContact === "good" ? "Good" : "Needs Work";
  };

  const getEyeContactColor = (eyeContact: string | null) => {
    if (!eyeContact) return "text-gray-500";
    return eyeContact === "good" ? "text-secondary" : "text-accent";
  };

  return (
    <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Overview</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Duration</span>
            <span className="text-sm font-medium text-gray-900">{formatTime(sessionTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Words per minute</span>
            <span className="text-sm font-medium text-gray-900">{speakingPace}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total words</span>
            <span className="text-sm font-medium text-gray-900">{wordCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Filler words</span>
            <span className="text-sm font-medium text-gray-900">{fillerWords}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pauses</span>
            <span className="text-sm font-medium text-gray-900">{pauseCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Eye contact</span>
            <span className={`text-sm font-medium ${getEyeContactColor(eyeContact)}`}>
              {getEyeContactLabel(eyeContact)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
