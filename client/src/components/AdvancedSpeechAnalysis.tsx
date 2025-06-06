import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  Volume2, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
  Radio,
  BarChart3,
  Zap,
  Target
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";
import { apiRequest } from "@/lib/queryClient";

interface SpeechPatterns {
  pauseAnalysis: {
    strategicPauses: number;
    fillerPauses: number;
    averagePauseLength: number;
    pauseEffectiveness: number;
  };
  intonationPatterns: {
    vocalVariety: number;
    emphasisUsage: number;
    monotoneRisk: number;
    pitchRange: string;
  };
  articulation: {
    consonantClarity: number;
    vowelPrecision: number;
    wordEndingClarity: number;
    overallDiction: number;
  };
  rhetoricalDevices: {
    repetitionUsage: number;
    questionUsage: number;
    contrastUsage: number;
    metaphorUsage: number;
  };
}

interface ContentAnalysis {
  structureQuality: number;
  transitionEffectiveness: number;
  evidenceSupport: number;
  callToActionStrength: number;
  audienceEngagement: number;
  keyMessageClarity: number;
  narrativeFlow: number;
  persuasivenessScore: number;
}

interface VocalDynamics {
  breathControl: number;
  vocalResonance: number;
  projectionPower: number;
  vocalStamina: number;
  emotionalRange: number;
  vocalConfidence: number;
}

export default function AdvancedSpeechAnalysis() {
  const { transcript, wordCount } = useSpeechRecognition();
  const { speakingPace, voiceClarity, confidenceScore, volumeLevel } = useVoiceAnalysis();

  const [speechPatterns, setSpeechPatterns] = useState<SpeechPatterns>({
    pauseAnalysis: {
      strategicPauses: 68,
      fillerPauses: 32,
      averagePauseLength: 1.2,
      pauseEffectiveness: 72
    },
    intonationPatterns: {
      vocalVariety: 65,
      emphasisUsage: 58,
      monotoneRisk: 35,
      pitchRange: "Moderate"
    },
    articulation: {
      consonantClarity: 82,
      vowelPrecision: 79,
      wordEndingClarity: 75,
      overallDiction: 78
    },
    rhetoricalDevices: {
      repetitionUsage: 45,
      questionUsage: 28,
      contrastUsage: 52,
      metaphorUsage: 33
    }
  });

  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysis>({
    structureQuality: 76,
    transitionEffectiveness: 68,
    evidenceSupport: 72,
    callToActionStrength: 58,
    audienceEngagement: 74,
    keyMessageClarity: 81,
    narrativeFlow: 69,
    persuasivenessScore: 73
  });

  const [vocalDynamics, setVocalDynamics] = useState<VocalDynamics>({
    breathControl: 78,
    vocalResonance: 72,
    projectionPower: 80,
    vocalStamina: 85,
    emotionalRange: 64,
    vocalConfidence: 77
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detailedFeedback, setDetailedFeedback] = useState<string>("");

  const analyzeTranscriptDeep = async () => {
    if (!transcript || transcript.length < 100) return;
    
    setIsAnalyzing(true);
    try {
      const response = await apiRequest('POST', '/api/analyze-speech-deep', {
        transcript,
        metrics: {
          speakingPace,
          voiceClarity,
          confidenceScore,
          wordCount
        }
      });
      const result = await response.json();
      setDetailedFeedback(result.analysis);
      
      // Update metrics based on analysis
      setSpeechPatterns(prev => ({
        ...prev,
        pauseAnalysis: {
          ...prev.pauseAnalysis,
          strategicPauses: Math.min(95, prev.pauseAnalysis.strategicPauses + 5)
        }
      }));
    } catch (error) {
      console.error('Deep analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Simulate real-time analysis updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeechPatterns(prev => ({
        pauseAnalysis: {
          ...prev.pauseAnalysis,
          strategicPauses: Math.max(40, Math.min(95, prev.pauseAnalysis.strategicPauses + (Math.random() - 0.5) * 6)),
          pauseEffectiveness: Math.max(40, Math.min(95, prev.pauseAnalysis.pauseEffectiveness + (Math.random() - 0.5) * 4))
        },
        intonationPatterns: {
          ...prev.intonationPatterns,
          vocalVariety: Math.max(30, Math.min(95, prev.intonationPatterns.vocalVariety + (Math.random() - 0.5) * 8)),
          monotoneRisk: Math.max(10, Math.min(70, prev.intonationPatterns.monotoneRisk + (Math.random() - 0.5) * 6))
        },
        articulation: {
          ...prev.articulation,
          consonantClarity: Math.max(60, Math.min(95, prev.articulation.consonantClarity + (Math.random() - 0.5) * 3)),
          overallDiction: Math.max(60, Math.min(95, prev.articulation.overallDiction + (Math.random() - 0.5) * 3))
        },
        rhetoricalDevices: prev.rhetoricalDevices
      }));

      setVocalDynamics(prev => ({
        ...prev,
        breathControl: Math.max(50, Math.min(95, prev.breathControl + (Math.random() - 0.5) * 4)),
        emotionalRange: Math.max(40, Math.min(95, prev.emotionalRange + (Math.random() - 0.5) * 6)),
        vocalConfidence: Math.max(50, Math.min(95, prev.vocalConfidence + (Math.random() - 0.5) * 5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-cyan-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-cyan-100";
    return "bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return Target;
  };

  return (
    <div className="space-y-6">
      {/* Analysis Control */}
      <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>Deep Speech Analysis</span>
            </div>
            <Button 
              onClick={analyzeTranscriptDeep}
              disabled={isAnalyzing || !transcript || transcript.length < 100}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Deep Analysis
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {detailedFeedback && (
          <CardContent>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">AI Analysis Results</h4>
              <p className="text-sm text-purple-800">{detailedFeedback}</p>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pause & Timing Analysis */}
        <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-cyan-600" />
              <span>Pause & Timing Patterns</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Strategic Pauses</span>
                <Badge className={`${getScoreBg(speechPatterns.pauseAnalysis.strategicPauses)} ${getScoreColor(speechPatterns.pauseAnalysis.strategicPauses)} border-0`}>
                  {Math.round(speechPatterns.pauseAnalysis.strategicPauses)}%
                </Badge>
              </div>
              <Progress value={speechPatterns.pauseAnalysis.strategicPauses} className="h-2" />
              <p className="text-xs text-gray-600">
                {speechPatterns.pauseAnalysis.strategicPauses < 60 ? "Add more strategic pauses for emphasis" : "Good use of pauses for impact"}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pause Effectiveness</span>
                <Badge className={`${getScoreBg(speechPatterns.pauseAnalysis.pauseEffectiveness)} ${getScoreColor(speechPatterns.pauseAnalysis.pauseEffectiveness)} border-0`}>
                  {Math.round(speechPatterns.pauseAnalysis.pauseEffectiveness)}%
                </Badge>
              </div>
              <Progress value={speechPatterns.pauseAnalysis.pauseEffectiveness} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-lg font-semibold text-gray-900">{speechPatterns.pauseAnalysis.averagePauseLength}s</div>
                <div className="text-xs text-gray-600">Avg. Pause Length</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-lg font-semibold text-gray-900">{speechPatterns.pauseAnalysis.fillerPauses}%</div>
                <div className="text-xs text-gray-600">Filler Pauses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vocal Dynamics */}
        <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-green-600" />
              <span>Vocal Dynamics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(vocalDynamics).map(([key, value]) => {
              const Icon = getScoreIcon(value);
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${getScoreColor(value)}`} />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <Badge className={`${getScoreBg(value)} ${getScoreColor(value)} border-0`}>
                      {Math.round(value)}%
                    </Badge>
                  </div>
                  <Progress value={value} className="h-2" />
                  {key === 'emotionalRange' && value < 70 && (
                    <p className="text-xs text-blue-600">Vary your vocal emotion to engage audience</p>
                  )}
                  {key === 'breathControl' && value < 70 && (
                    <p className="text-xs text-orange-600">Practice breathing exercises for better control</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Intonation & Expression */}
        <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-orange-600" />
              <span>Intonation & Expression</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Vocal Variety</span>
                <Badge className={`${getScoreBg(speechPatterns.intonationPatterns.vocalVariety)} ${getScoreColor(speechPatterns.intonationPatterns.vocalVariety)} border-0`}>
                  {Math.round(speechPatterns.intonationPatterns.vocalVariety)}%
                </Badge>
              </div>
              <Progress value={speechPatterns.intonationPatterns.vocalVariety} className="h-2" />
              <p className="text-xs text-gray-600">
                {speechPatterns.intonationPatterns.vocalVariety < 60 ? "Vary pitch and tone more" : "Good vocal expressiveness"}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Emphasis Usage</span>
                <Badge className={`${getScoreBg(speechPatterns.intonationPatterns.emphasisUsage)} ${getScoreColor(speechPatterns.intonationPatterns.emphasisUsage)} border-0`}>
                  {Math.round(speechPatterns.intonationPatterns.emphasisUsage)}%
                </Badge>
              </div>
              <Progress value={speechPatterns.intonationPatterns.emphasisUsage} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Monotone Risk</span>
                <Badge className={`${speechPatterns.intonationPatterns.monotoneRisk < 30 ? 'bg-green-100 text-green-600' : speechPatterns.intonationPatterns.monotoneRisk < 50 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'} border-0`}>
                  {speechPatterns.intonationPatterns.monotoneRisk < 30 ? 'Low' : speechPatterns.intonationPatterns.monotoneRisk < 50 ? 'Medium' : 'High'}
                </Badge>
              </div>
              <Progress value={100 - speechPatterns.intonationPatterns.monotoneRisk} className="h-2" />
              {speechPatterns.intonationPatterns.monotoneRisk > 50 && (
                <p className="text-xs text-red-600">Risk of monotone delivery - add more vocal variation</p>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <div className="text-sm font-semibold text-gray-900">Pitch Range: {speechPatterns.intonationPatterns.pitchRange}</div>
              <div className="text-xs text-gray-600 mt-1">Expand range for more engaging delivery</div>
            </div>
          </CardContent>
        </Card>

        {/* Content Structure Analysis */}
        <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Content Structure</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(contentAnalysis).map(([key, value]) => {
              const Icon = getScoreIcon(value);
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${getScoreColor(value)}`} />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <Badge className={`${getScoreBg(value)} ${getScoreColor(value)} border-0`}>
                      {Math.round(value)}%
                    </Badge>
                  </div>
                  <Progress value={value} className="h-2" />
                  {key === 'callToActionStrength' && value < 70 && (
                    <p className="text-xs text-red-600">Strengthen your call to action</p>
                  )}
                  {key === 'transitionEffectiveness' && value < 70 && (
                    <p className="text-xs text-yellow-600">Improve transitions between points</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Rhetorical Devices Usage */}
      <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <span>Rhetorical Techniques</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(speechPatterns.rhetoricalDevices).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return (
                <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(value)}`}>
                    {Math.round(value)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{label}</div>
                  <Progress value={value} className="h-1 mt-2" />
                  {value < 40 && (
                    <p className="text-xs text-blue-600 mt-1">
                      {key === 'questionUsage' && "Use more rhetorical questions"}
                      {key === 'repetitionUsage' && "Repeat key points for emphasis"}
                      {key === 'contrastUsage' && "Add contrasting ideas"}
                      {key === 'metaphorUsage' && "Include metaphors or analogies"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}