import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Eye, 
  Hand, 
  Activity, 
  Volume2, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3
} from "lucide-react";
import { useMediaPipe } from "@/hooks/useMediaPipe";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface PostureMetrics {
  spineAlignment: number;
  shoulderLevel: number;
  headPosition: number;
  weightDistribution: number;
  overallPosture: number;
}

interface GestureMetrics {
  handMovement: number;
  gestureVariety: number;
  gestureRelevance: number;
  armPosition: number;
  gestureFrequency: number;
}

interface SpeechInsights {
  fillerWordTypes: { [key: string]: number };
  sentenceStructure: string;
  vocabularyRichness: number;
  emotionalTone: string;
  keyMessages: string[];
  improvementAreas: string[];
}

export default function DetailedAnalysis() {
  const { posture, gesture, eyeContact } = useMediaPipe();
  const { speakingPace, voiceClarity, confidenceScore, volumeLevel } = useVoiceAnalysis();
  const { transcript, wordCount } = useSpeechRecognition();

  const [postureMetrics, setPostureMetrics] = useState<PostureMetrics>({
    spineAlignment: 85,
    shoulderLevel: 78,
    headPosition: 82,
    weightDistribution: 88,
    overallPosture: 83
  });

  const [gestureMetrics, setGestureMetrics] = useState<GestureMetrics>({
    handMovement: 72,
    gestureVariety: 65,
    gestureRelevance: 80,
    armPosition: 75,
    gestureFrequency: 68
  });

  const [speechInsights, setSpeechInsights] = useState<SpeechInsights>({
    fillerWordTypes: { "um": 3, "uh": 2, "like": 5, "you know": 1 },
    sentenceStructure: "Moderately complex",
    vocabularyRichness: 75,
    emotionalTone: "Confident",
    keyMessages: ["Clear introduction", "Supporting evidence", "Call to action needed"],
    improvementAreas: ["Reduce filler words", "Vary sentence length", "Add more gestures"]
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPostureMetrics(prev => ({
        spineAlignment: Math.max(60, Math.min(100, prev.spineAlignment + (Math.random() - 0.5) * 10)),
        shoulderLevel: Math.max(60, Math.min(100, prev.shoulderLevel + (Math.random() - 0.5) * 8)),
        headPosition: Math.max(60, Math.min(100, prev.headPosition + (Math.random() - 0.5) * 6)),
        weightDistribution: Math.max(60, Math.min(100, prev.weightDistribution + (Math.random() - 0.5) * 5)),
        overallPosture: Math.max(60, Math.min(100, prev.overallPosture + (Math.random() - 0.5) * 4))
      }));

      setGestureMetrics(prev => ({
        handMovement: Math.max(40, Math.min(100, prev.handMovement + (Math.random() - 0.5) * 12)),
        gestureVariety: Math.max(40, Math.min(100, prev.gestureVariety + (Math.random() - 0.5) * 10)),
        gestureRelevance: Math.max(40, Math.min(100, prev.gestureRelevance + (Math.random() - 0.5) * 8)),
        armPosition: Math.max(40, Math.min(100, prev.armPosition + (Math.random() - 0.5) * 6)),
        gestureFrequency: Math.max(40, Math.min(100, prev.gestureFrequency + (Math.random() - 0.5) * 15))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return Info;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Posture Analysis */}
      <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Full Body Posture Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(postureMetrics).map(([key, value]) => {
            const Icon = getScoreIcon(value);
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${getScoreColor(value)}`} />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <Badge className={`${getScoreBg(value)} ${getScoreColor(value)} border-0`}>
                    {Math.round(value)}%
                  </Badge>
                </div>
                <Progress value={value} className="h-2" />
                {key === 'spineAlignment' && value < 70 && (
                  <p className="text-xs text-red-600">Straighten your back and engage core muscles</p>
                )}
                {key === 'shoulderLevel' && value < 70 && (
                  <p className="text-xs text-cyan-600">Balance shoulders - avoid hunching</p>
                )}
                {key === 'headPosition' && value < 70 && (
                  <p className="text-xs text-cyan-600">Keep head level, chin parallel to floor</p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Gesture Analysis */}
      <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hand className="w-5 h-5 text-green-600" />
            <span>Hand Gesture & Movement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(gestureMetrics).map(([key, value]) => {
            const Icon = getScoreIcon(value);
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${getScoreColor(value)}`} />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <Badge className={`${getScoreBg(value)} ${getScoreColor(value)} border-0`}>
                    {Math.round(value)}%
                  </Badge>
                </div>
                <Progress value={value} className="h-2" />
                {key === 'handMovement' && value < 60 && (
                  <p className="text-xs text-blue-600">Use more hand gestures to emphasize points</p>
                )}
                {key === 'gestureVariety' && value < 60 && (
                  <p className="text-xs text-purple-600">Try different gesture types - pointing, counting, shaping</p>
                )}
                {key === 'armPosition' && value < 70 && (
                  <p className="text-xs text-indigo-600">Keep arms relaxed at sides, avoid crossing</p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Advanced Speech Analysis */}
      <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-cyan-600" />
            <span>Advanced Speech Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filler Words Breakdown */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Filler Word Analysis</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(speechInsights.fillerWordTypes).map(([word, count]) => (
                <div key={word} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">"{word}"</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Speech Characteristics */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Sentence Structure</span>
              <Badge className="bg-cyan-100 text-cyan-800 border-0">
                {speechInsights.sentenceStructure}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Vocabulary Richness</span>
              <Badge className={`${getScoreBg(speechInsights.vocabularyRichness)} ${getScoreColor(speechInsights.vocabularyRichness)} border-0`}>
                {speechInsights.vocabularyRichness}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Emotional Tone</span>
              <Badge className="bg-green-100 text-green-800 border-0">
                {speechInsights.emotionalTone}
              </Badge>
            </div>
          </div>

          {/* Key Messages */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Content Structure</h4>
            <div className="space-y-2">
              {speechInsights.keyMessages.map((message, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">{message}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Dynamics */}
      <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <span>Voice Dynamics & Patterns</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Metrics */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Speaking Pace</span>
                <Badge className={`${getScoreBg(speakingPace >= 120 && speakingPace <= 160 ? 85 : 60)} ${getScoreColor(speakingPace >= 120 && speakingPace <= 160 ? 85 : 60)} border-0`}>
                  {speakingPace} WPM
                </Badge>
              </div>
              <Progress value={Math.min((speakingPace / 200) * 100, 100)} className="h-2" />
              <p className="text-xs text-gray-600">Optimal range: 120-160 WPM</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Voice Clarity</span>
                <Badge className={`${getScoreBg(voiceClarity)} ${getScoreColor(voiceClarity)} border-0`}>
                  {voiceClarity}%
                </Badge>
              </div>
              <Progress value={voiceClarity} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Volume Consistency</span>
                <Badge className={`${getScoreBg(volumeLevel > 30 ? 75 : 50)} ${getScoreColor(volumeLevel > 30 ? 75 : 50)} border-0`}>
                  {volumeLevel > 30 ? 'Good' : 'Low'}
                </Badge>
              </div>
              <Progress value={volumeLevel > 30 ? 75 : 50} className="h-2" />
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Priority Improvements</h4>
            <div className="space-y-2">
              {speechInsights.improvementAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}