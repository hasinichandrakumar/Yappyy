import React, { useState, useEffect } from 'react';
import { useVoiceAnalysis } from '../hooks/useVoiceAnalysis';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { AlertCircle, CheckCircle, Eye, Activity, Clock, MessageSquare } from 'lucide-react';

interface FeedbackMetric {
  label: string;
  value: number;
  icon: React.ReactNode;
  feedback: string;
  color: string;
}

interface LivePerformanceFeedbackProps {
  isRecording: boolean;
  transcriptText: string;
  eyeContactData: number;
}

export function LivePerformanceFeedback({ 
  isRecording, 
  transcriptText, 
  eyeContactData 
}: LivePerformanceFeedbackProps) {
  const { metrics } = useVoiceAnalysis();
  const [feedback, setFeedback] = useState<FeedbackMetric[]>([]);
  const [wpm, setWpm] = useState(0);
  const [fillerWordCount, setFillerWordCount] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Filler words to detect
  const fillerWords = [
    'um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally',
    'sort of', 'kind of', 'i mean', 'so', 'well', 'right'
  ];

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const updateInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - lastUpdateTime) / 1000; // in seconds

      // Calculate WPM
      const words = transcriptText.trim().split(/\s+/).length;
      const currentWpm = Math.round((words / timeElapsed) * 60);
      setWpm(currentWpm);

      // Count filler words
      const lowerText = transcriptText.toLowerCase();
      const fillerCount = fillerWords.reduce((count, word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        return count + (lowerText.match(regex) || []).length;
      }, 0);
      setFillerWordCount(fillerCount);

      // Update feedback metrics
      const newFeedback: FeedbackMetric[] = [
        {
          label: 'Words Per Minute',
          value: Math.min(100, (currentWpm / 150) * 100), // Normalize to 100%, target is 150 WPM
          icon: <Clock className="w-5 h-5" />,
          feedback: getFeedbackForWPM(currentWpm),
          color: getColorForWPM(currentWpm)
        },
        {
          label: 'Eye Contact',
          value: Math.min(100, eyeContactData * 100),
          icon: <Eye className="w-5 h-5" />,
          feedback: getFeedbackForEyeContact(eyeContactData),
          color: getColorForMetric(eyeContactData)
        },
        {
          label: 'Confidence',
          value: Math.min(100, metrics.confidence.score * 100),
          icon: <Activity className="w-5 h-5" />,
          feedback: getFeedbackForConfidence(metrics.confidence.score),
          color: getColorForMetric(metrics.confidence.score)
        },
        {
          label: 'Filler Words',
          value: Math.min(100, Math.max(0, 100 - (fillerCount * 10))),
          icon: <MessageSquare className="w-5 h-5" />,
          feedback: getFeedbackForFillerWords(fillerCount),
          color: getColorForFillerWords(fillerCount)
        }
      ];

      setFeedback(newFeedback);
      setLastUpdateTime(currentTime);
    }, 25000); // Update every 25 seconds

    return () => clearInterval(updateInterval);
  }, [isRecording, transcriptText, metrics, eyeContactData]);

  // Feedback generation functions
  const getFeedbackForWPM = (wpm: number): string => {
    if (wpm < 100) return "Try speaking a bit faster for better engagement";
    if (wpm > 180) return "Consider slowing down slightly for clarity";
    return "Great speaking pace!";
  };

  const getFeedbackForEyeContact = (score: number): string => {
    if (score < 0.4) return "Try maintaining more eye contact with the camera";
    if (score < 0.7) return "Good eye contact, keep it consistent";
    return "Excellent eye contact!";
  };

  const getFeedbackForConfidence = (score: number): string => {
    if (score < 0.4) return "Try speaking with more assertiveness";
    if (score < 0.7) return "Good confidence level, keep it up";
    return "You're projecting great confidence!";
  };

  const getFeedbackForFillerWords = (count: number): string => {
    if (count > 10) return "Try to reduce filler words for clearer speech";
    if (count > 5) return "Watch out for occasional filler words";
    return "Minimal filler words - great job!";
  };

  const getColorForMetric = (value: number): string => {
    if (value < 0.4) return 'text-red-500';
    if (value < 0.7) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getColorForWPM = (wpm: number): string => {
    if (wpm < 100 || wpm > 180) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getColorForFillerWords = (count: number): string => {
    if (count > 10) return 'text-red-500';
    if (count > 5) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="w-80 bg-white/95 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live Performance
        </h3>
        
        <div className="space-y-6">
          {feedback.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="font-medium">{metric.label}</span>
                </div>
                <span className={`${metric.color} font-semibold`}>
                  {Math.round(metric.value)}%
                </span>
              </div>
              
              <Progress value={metric.value} className="h-2" />
              
              <div className="flex items-start gap-2 mt-1">
                {metric.value >= 70 ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                )}
                <p className="text-sm text-gray-600">{metric.feedback}</p>
              </div>
            </div>
          ))}
        </div>

        {isRecording && (
          <p className="text-xs text-gray-500 mt-4 text-center">
            Updates every 25 seconds
          </p>
        )}
      </CardContent>
    </Card>
  );
}