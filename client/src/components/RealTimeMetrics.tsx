import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, Volume2, Timer, Target } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";

export default function RealTimeMetrics() {
  const { isListening, wpm, wordCount } = useSpeechRecognition();
  const { 
    voiceClarity, 
    confidenceScore, 
    volumeLevel,
    startVoiceAnalysis, 
    stopVoiceAnalysis,
    updateWordCount 
  } = useVoiceAnalysis();
  
  const [eyeContact, setEyeContact] = useState(0);
  const [metrics, setMetrics] = useState({
    eyeContact: 0,
    voiceClarity: 0,
    speakingPace: 0,
    confidence: 0,
    volume: 0
  });

  // Start/stop voice analysis when listening changes
  useEffect(() => {
    if (isListening) {
      console.log('Starting voice analysis...');
      startVoiceAnalysis();
    } else {
      console.log('Stopping voice analysis...');
      stopVoiceAnalysis();
    }
  }, [isListening, startVoiceAnalysis, stopVoiceAnalysis]);

  // Update word count in voice analysis
  useEffect(() => {
    updateWordCount(wordCount);
  }, [wordCount, updateWordCount]);

  // Simulate eye contact tracking (would connect to computer vision in real app)
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setEyeContact(prev => {
          const newValue = Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 10));
          return newValue;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  // Update metrics based on real speech data
  useEffect(() => {
    setMetrics({
      eyeContact: Math.round(eyeContact),
      voiceClarity: Math.round(voiceClarity),
      speakingPace: Math.round(Math.min(100, (wpm / 200) * 100)), // Optimal pace around 150-180 WPM
      confidence: Math.round(confidenceScore),
      volume: Math.round(volumeLevel)
    });
  }, [eyeContact, voiceClarity, wpm, confidenceScore, volumeLevel]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const metricCards = [
    {
      icon: Eye,
      title: "Eye Contact",
      value: metrics.eyeContact,
      unit: "%",
      target: "Maintain 70%+"
    },
    {
      icon: Volume2,
      title: "Voice Clarity",
      value: metrics.voiceClarity,
      unit: "%",
      target: "Keep above 80%"
    },
    {
      icon: Timer,
      title: "Speaking Pace",
      value: metrics.speakingPace,
      unit: "%",
      target: `${wpm} WPM`,
      subtitle: wpm > 0 ? `${wpm} words/min` : "Start speaking"
    },
    {
      icon: Target,
      title: "Confidence",
      value: metrics.confidence,
      unit: "%",
      target: "Build to 85%+"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isListening ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          {isListening ? 'Live Analysis Active' : 'Start Speaking to Begin'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metricCards.map((metric, index) => (
          <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <metric.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{metric.title}</h3>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${getScoreColor(metric.value)}`}>
                    {metric.value}{metric.unit}
                  </span>
                </div>
              </div>
              
              <Progress 
                value={metric.value} 
                className="h-2 mb-2"
                style={{
                  background: '#f3f4f6'
                }}
              />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{metric.target}</span>
                {metric.subtitle && (
                  <span className="text-xs text-gray-600">{metric.subtitle}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {!isListening && (
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            Start speaking to see live metrics and AI-powered feedback
          </p>
        </div>
      )}
    </div>
  );
}