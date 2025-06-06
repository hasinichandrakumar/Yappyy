import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, Mic, TrendingUp } from "lucide-react";

export default function RealTimeMetrics() {
  const { 
    speakingPace, 
    voiceClarity, 
    confidenceScore 
  } = useVoiceAnalysis();
  
  const { isListening } = useSpeechRecognition();

  const getMetricColor = (value: number, optimal: { min: number, max: number }) => {
    if (value >= optimal.min && value <= optimal.max) return "bg-secondary";
    return "bg-accent";
  };

  const getMetricLabel = (value: number, optimal: { min: number, max: number }) => {
    if (value >= optimal.min && value <= optimal.max) return "Optimal Range";
    if (value < optimal.min) return "Too Low";
    return "Too High";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Speaking Pace */}
      <Card className="bg-surface rounded-lg shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Speaking Pace</h3>
            <Gauge className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{speakingPace} WPM</div>
          <div className={`text-sm mt-1 ${
            speakingPace >= 120 && speakingPace <= 160 ? 'text-secondary' : 'text-accent'
          }`}>
            {getMetricLabel(speakingPace, { min: 120, max: 160 })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                getMetricColor(speakingPace, { min: 120, max: 160 })
              }`}
              style={{ width: `${Math.min((speakingPace / 200) * 100, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Voice Clarity */}
      <Card className="bg-surface rounded-lg shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Voice Clarity</h3>
            <Mic className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{voiceClarity}%</div>
          <div className={`text-sm mt-1 ${
            voiceClarity >= 80 ? 'text-secondary' : voiceClarity >= 60 ? 'text-accent' : 'text-error'
          }`}>
            {voiceClarity >= 80 ? 'Excellent' : voiceClarity >= 60 ? 'Good' : 'Needs Improvement'}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                voiceClarity >= 80 ? 'bg-secondary' : voiceClarity >= 60 ? 'bg-accent' : 'bg-error'
              }`}
              style={{ width: `${voiceClarity}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Confidence Score */}
      <Card className="bg-surface rounded-lg shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Confidence</h3>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{confidenceScore}%</div>
          <div className={`text-sm mt-1 ${
            confidenceScore >= 80 ? 'text-secondary' : confidenceScore >= 60 ? 'text-accent' : 'text-warning'
          }`}>
            {confidenceScore >= 80 ? 'Strong' : confidenceScore >= 60 ? 'Growing' : 'Room for Growth'}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                confidenceScore >= 80 ? 'bg-secondary' : confidenceScore >= 60 ? 'bg-accent' : 'bg-warning'
              }`}
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
