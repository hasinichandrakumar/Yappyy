import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, Volume2, Timer, Target, MessageSquare, Mic } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";
import { useRobustComputerVision } from "@/hooks/useRobustComputerVision";

export default function RealTimeMetrics() {
  const { isListening, wordCount } = useSpeechRecognition();
  const { 
    voiceClarity, 
    confidenceScore, 
    volumeLevel,
    articulationScore,
    speechClarityIndex,
    startVoiceAnalysis, 
    stopVoiceAnalysis,
    updateWordCount 
  } = useVoiceAnalysis();
  
  // Integrate computer vision for authentic body language metrics
  const { 
    metrics: computerVisionMetrics, 
    startAnalysis: startComputerVision,
    stopAnalysis: stopComputerVision,
    isAnalyzing: isComputerVisionActive
  } = useRobustComputerVision();
  
  const [sessionTime, setSessionTime] = useState(0);
  const sessionStartRef = useRef<number>(0);
  const [metrics, setMetrics] = useState({
    eyeContact: 0,
    voiceClarity: 0,
    speakingActivity: 0,
    confidence: 0,
    volume: 0,
    articulation: 0,
    speechClarity: 0
  });

  // Start/stop voice analysis and computer vision when listening changes
  useEffect(() => {
    if (isListening) {
      console.log('Starting voice analysis, computer vision, and session timer...');
      startVoiceAnalysis();
      startComputerVision();
      sessionStartRef.current = Date.now();
      
      // Start session timer
      const timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
        setSessionTime(elapsed);
      }, 1000);
      
      return () => clearInterval(timerInterval);
    } else {
      console.log('Stopping voice analysis and computer vision...');
      stopVoiceAnalysis();
      stopComputerVision();
    }
  }, [isListening, startVoiceAnalysis, stopVoiceAnalysis, startComputerVision, stopComputerVision]);

  // Update word count in voice analysis
  useEffect(() => {
    updateWordCount(wordCount);
  }, [wordCount, updateWordCount]);

  // Computer vision integration - no more simulation
  // Eye contact and body language metrics now come from real computer vision analysis

  // Update metrics based on real speech and computer vision data
  useEffect(() => {
    // Integrate authentic voice analysis and computer vision metrics
    const newMetrics = {
      eyeContact: Math.round(computerVisionMetrics.eyeContact || 0), // Real computer vision eye contact
      voiceClarity: Math.round(voiceClarity || 0), // Authentic voice clarity only
      speakingActivity: isListening && wordCount > 0 ? Math.min(100, wordCount * 2) : 0, // Based on actual word count
      confidence: Math.round(Math.max(confidenceScore, computerVisionMetrics.confidence) || 0), // Max of voice and visual confidence
      volume: Math.round(volumeLevel || 0), // Real volume detection only
      articulation: Math.round(articulationScore || 0), // Authentic articulation analysis
      speechClarity: Math.round(speechClarityIndex || 0) // Real speech clarity calculation
    };

    setMetrics(newMetrics);
    
    if (isListening) {
      console.log('Integrated Metrics Update:', {
        voice: { voiceClarity, confidenceScore, volumeLevel, articulationScore, speechClarityIndex },
        computerVision: computerVisionMetrics,
        wordCount,
        final: newMetrics
      });
    }
  }, [voiceClarity, confidenceScore, volumeLevel, articulationScore, speechClarityIndex, computerVisionMetrics, isListening, wordCount]);

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
      title: "Speaking Activity",
      value: metrics.speakingActivity,
      unit: "%",
      target: isListening ? "Activity level" : "Click to start",
      subtitle: isListening && wordCount > 0 ? "Speaking detected" : isListening ? "Listening..." : "Not active"
    },
    {
      icon: Target,
      title: "Confidence", 
      value: metrics.confidence,
      unit: "%",
      target: "Build to 85%+"
    },
    {
      icon: MessageSquare,
      title: "Articulation",
      value: metrics.articulation,
      unit: "%",
      target: "Clear speech 90%+",
      subtitle: metrics.articulation > 0 ? "Speech clarity detected" : "No speech data"
    },
    {
      icon: Mic,
      title: "Speech Clarity",
      value: metrics.speechClarity,
      unit: "%", 
      target: "Professional clarity",
      subtitle: metrics.speechClarity > 0 ? "Voice analysis active" : "Processing audio"
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
        
        {isListening && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 tabular-nums">
                {wordCount} words
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Session: {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {metricCards.map((metric, index) => (
          <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 relative ${
                    isListening && metric.value > 0 
                      ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg' 
                      : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}>
                    <metric.icon className="w-5 h-5 text-white" />

                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{metric.title}</h3>
                    <div className="text-xs text-gray-500 mt-0.5">{metric.target}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xl font-bold ${getScoreColor(metric.value)} tabular-nums`}>
                    {metric.value}{metric.unit}
                  </span>
                  {metric.subtitle && (
                    <span className="text-xs text-gray-600 mt-0.5">{metric.subtitle}</span>
                  )}
                </div>
              </div>
              
              <Progress 
                value={metric.value} 
                className="h-3"
              />
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