import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Fingerprint, TrendingUp, Volume2, Brain, Target, Zap, Users, Award } from "lucide-react";

interface SpeechFingerprint {
  averageWPM: number;
  persuasionScore: number;
  energyLevel: number;
  clarityScore: number;
  confidenceLevel: number;
  gestureFrequency: number;
  pausePatterns: string;
  emotionalRange: number;
  signatureTraits: string[];
  speakingStyle: string;
  improvementTrend: number;
}

interface SpeechFingerprintGeneratorProps {
  fingerprint?: SpeechFingerprint;
  sessionCount: number;
}

export default function SpeechFingerprintGenerator({ fingerprint, sessionCount }: SpeechFingerprintGeneratorProps) {
  // Generate fingerprint based on historical data
  const defaultFingerprint: SpeechFingerprint = {
    averageWPM: 142,
    persuasionScore: 78,
    energyLevel: 72,
    clarityScore: 85,
    confidenceLevel: 68,
    gestureFrequency: 85,
    pausePatterns: "Strategic",
    emotionalRange: 76,
    signatureTraits: [
      "Uses vivid metaphors",
      "Strong opening hooks", 
      "Data-driven arguments",
      "Confident gestures",
      "Strategic pausing"
    ],
    speakingStyle: "Persuasive Storyteller",
    improvementTrend: 12
  };

  const currentFingerprint = fingerprint || defaultFingerprint;

  const metrics = [
    {
      label: "Speaking Pace",
      value: currentFingerprint.averageWPM,
      unit: "WPM",
      score: Math.min(100, (currentFingerprint.averageWPM / 160) * 100),
      icon: Volume2,
      color: "blue"
    },
    {
      label: "Persuasion Power",
      value: currentFingerprint.persuasionScore,
      unit: "%",
      score: currentFingerprint.persuasionScore,
      icon: Target,
      color: "purple"
    },
    {
      label: "Energy Level",
      value: currentFingerprint.energyLevel,
      unit: "%",
      score: currentFingerprint.energyLevel,
      icon: Zap,
      color: "orange"
    },
    {
      label: "Voice Clarity",
      value: currentFingerprint.clarityScore,
      unit: "%",
      score: currentFingerprint.clarityScore,
      icon: Volume2,
      color: "green"
    },
    {
      label: "Confidence",
      value: currentFingerprint.confidenceLevel,
      unit: "%",
      score: currentFingerprint.confidenceLevel,
      icon: Brain,
      color: "indigo"
    },
    {
      label: "Gesture Use",
      value: currentFingerprint.gestureFrequency,
      unit: "%",
      score: currentFingerprint.gestureFrequency,
      icon: Users,
      color: "pink"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "text-blue-600 bg-blue-50",
      purple: "text-purple-600 bg-purple-50",
      orange: "text-orange-600 bg-orange-50",
      green: "text-green-600 bg-green-50",
      indigo: "text-indigo-600 bg-indigo-50",
      pink: "text-pink-600 bg-pink-50"
    };
    return colors[color] || "text-gray-600 bg-gray-50";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Fingerprint className="h-5 w-5 text-purple-600" />
            <CardTitle>Your Speech Fingerprint</CardTitle>
          </div>
          <Badge variant="outline" className="text-purple-600">
            {sessionCount} sessions analyzed
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Your unique speaking signature based on analysis of past speeches
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Speaking Style Identity */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Speaking Style Identity</h3>
          </div>
          <h4 className="text-xl font-bold text-purple-700 mb-2">{currentFingerprint.speakingStyle}</h4>
          <p className="text-sm text-gray-700">
            Your signature combination of persuasive techniques with engaging storytelling
          </p>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-sm text-green-600 font-medium">
              +{currentFingerprint.improvementTrend}% improvement over last month
            </span>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="p-4 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`p-1 rounded ${getColorClasses(metric.color)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value}{metric.unit}
                </div>
                <Progress 
                  value={metric.score} 
                  className="h-2"
                />
              </div>
            );
          })}
        </div>

        {/* Signature Traits */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Signature Speaking Traits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentFingerprint.signatureTraits.map((trait, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">{trait}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pause Patterns Analysis */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2">Pause Pattern Style</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {currentFingerprint.pausePatterns}
            </Badge>
            <span className="text-sm text-gray-600">
              Emotional Range: {currentFingerprint.emotionalRange}%
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-2">
            You use pauses strategically to emphasize key points and create dramatic effect
          </p>
        </div>

        {/* Fingerprint Score */}
        <div className="text-center p-6 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">Overall Fingerprint Score</h3>
          <div className="text-4xl font-bold mb-1">
            {Math.round((currentFingerprint.persuasionScore + currentFingerprint.clarityScore + currentFingerprint.confidenceLevel) / 3)}
          </div>
          <p className="text-purple-100">
            Your unique speaking signature strength
          </p>
        </div>
      </CardContent>
    </Card>
  );
}