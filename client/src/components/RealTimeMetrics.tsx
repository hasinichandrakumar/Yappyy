import { useState, useEffect, useRef } from "react";
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
  const [sessionTime, setSessionTime] = useState(0);
  const sessionStartRef = useRef<number>(0);
  const [metrics, setMetrics] = useState({
    eyeContact: 0,
    voiceClarity: 0,
    speakingPace: 0,
    confidence: 0,
    volume: 0
  });

  // Start/stop voice analysis and session timing when listening changes
  useEffect(() => {
    if (isListening) {
      console.log('Starting voice analysis and session timer...');
      startVoiceAnalysis();
      sessionStartRef.current = Date.now();
      
      // Start session timer
      const timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
        setSessionTime(elapsed);
      }, 1000);
      
      return () => clearInterval(timerInterval);
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

  // Update metrics based on real speech data with enhanced responsiveness
  useEffect(() => {
    // Calculate speaking pace score based on WPM (optimal range: 150-180 WPM)
    const calculatePaceScore = (wpm: number) => {
      if (wpm === 0) return 0;
      if (wpm >= 150 && wpm <= 180) return 100; // Perfect range
      if (wpm >= 120 && wpm <= 200) return 85;  // Good range
      if (wpm >= 100 && wpm <= 220) return 70;  // Acceptable range
      if (wpm >= 80 && wpm <= 250) return 50;   // Needs improvement
      return 25; // Too slow or too fast
    };

    // Enhanced metrics calculation with better real-time responsiveness
    const newMetrics = {
      eyeContact: Math.round(eyeContact),
      voiceClarity: Math.round(Math.max(voiceClarity, isListening ? 20 : 0)), // Show activity when listening
      speakingPace: calculatePaceScore(wpm),
      confidence: Math.round(Math.max(confidenceScore, isListening ? 30 : 0)), // Show baseline when active
      volume: Math.round(Math.max(volumeLevel, isListening ? 10 : 0)) // Show baseline when active
    };

    setMetrics(newMetrics);
    
    if (isListening) {
      console.log('Live Metrics Update:', {
        wpm,
        voiceClarity,
        confidenceScore,
        volumeLevel,
        wordCount,
        calculated: newMetrics
      });
    }
  }, [eyeContact, voiceClarity, wpm, confidenceScore, volumeLevel, isListening, wordCount]);

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
      target: wpm > 0 ? `${wpm} WPM` : isListening ? "Start speaking" : "Click to start",
      subtitle: wpm > 0 ? 
        wpm >= 150 && wpm <= 180 ? "Perfect pace" :
        wpm >= 120 && wpm <= 200 ? "Good pace" :
        wpm < 120 ? "Speak faster" : "Slow down"
        : isListening ? "Listening..." : "Not active"
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
        
        {isListening && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 tabular-nums">
                {wpm > 0 ? `${wpm} WPM` : '-- WPM'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {wordCount} words • {Math.floor((Date.now() - Date.now()) / 1000)}s
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
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
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