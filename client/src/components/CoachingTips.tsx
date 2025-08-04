import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CoachingTip {
  type: string;
  message: string;
  severity: "good" | "warning" | "improvement";
}

export default function CoachingTips() {
  // User explicitly requested removal of all analytics boxes during practice
  return null;
  const { transcript } = useSpeechRecognition();
  const { speakingPace, voiceClarity, confidenceScore } = useVoiceAnalysis();
  const [lastAnalysisTime, setLastAnalysisTime] = useState(0);

  const metrics = {
    speakingPace,
    voiceClarity,
    confidenceScore,
    fillerWords: 0, // Would be calculated from transcript analysis
    pauseCount: 0   // Would be calculated from audio analysis
  };

  // Analyze speech every 30 seconds if there's new transcript
  const { data: analysisResult, refetch } = useQuery({
    queryKey: ['/api/analyze-speech'],
    queryFn: async () => {
      if (!transcript || transcript.length < 50) return { tips: [] };
      
      const response = await apiRequest('POST', '/api/analyze-speech', {
        transcript,
        metrics
      });
      return response.json();
    },
    enabled: false // Manually trigger
  });

  useEffect(() => {
    const now = Date.now();
    if (transcript && transcript.length > 50 && now - lastAnalysisTime > 30000) {
      refetch();
      setLastAnalysisTime(now);
    }
  }, [transcript, refetch, lastAnalysisTime]);

  const getIcon = (severity: string) => {
    switch (severity) {
      case "good":
        return <CheckCircle className="w-4 h-4 text-white" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-white" />;
      case "improvement":
        return <Info className="w-4 h-4 text-white" />;
      default:
        return <Info className="w-4 h-4 text-white" />;
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "good":
        return "bg-secondary border-green-200";
      case "warning":
        return "bg-accent border-orange-200";
      case "improvement":
        return "bg-primary border-blue-200";
      default:
        return "bg-primary border-blue-200";
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "good":
        return "bg-green-50";
      case "warning":
        return "bg-orange-50";
      case "improvement":
        return "bg-blue-50";
      default:
        return "bg-blue-50";
    }
  };

  // Default tips based on current metrics
  const getDefaultTips = (): CoachingTip[] => {
    const tips: CoachingTip[] = [];

    if (speakingPace > 0) {
      if (speakingPace >= 120 && speakingPace <= 160) {
        tips.push({
          type: "pace",
          message: "Great speaking pace! You're in the optimal range.",
          severity: "good"
        });
      } else if (speakingPace > 160) {
        tips.push({
          type: "pace",
          message: "Try slowing down during key points to emphasize important information.",
          severity: "warning"
        });
      } else {
        tips.push({
          type: "pace",
          message: "Consider speaking a bit faster to maintain audience engagement.",
          severity: "improvement"
        });
      }
    }

    if (voiceClarity >= 80) {
      tips.push({
        type: "clarity",
        message: "Excellent voice clarity! Your words are easy to understand.",
        severity: "good"
      });
    } else if (voiceClarity < 60) {
      tips.push({
        type: "clarity",
        message: "Focus on articulating your words more clearly.",
        severity: "improvement"
      });
    }

    if (confidenceScore < 70) {
      tips.push({
        type: "confidence",
        message: "Use more gestures and maintain eye contact to project confidence.",
        severity: "improvement"
      });
    }

    return tips;
  };

  const tips = analysisResult?.tips || getDefaultTips();

  return (
    <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Lightbulb className="text-white w-4 h-4" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Live Coaching</h2>
        </div>
        
        <div className="space-y-3">
          {tips.length > 0 ? (
            tips.map((tip, index) => (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border ${getSeverityBg(tip.severity)} ${getSeverityStyles(tip.severity).split(' ')[1]}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${getSeverityStyles(tip.severity).split(' ')[0]}`}>
                  {getIcon(tip.severity)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">{tip.type}</p>
                  <p className="text-xs text-gray-600 mt-1">{tip.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Start speaking to receive personalized coaching tips</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
