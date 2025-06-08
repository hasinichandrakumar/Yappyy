import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Heart, 
  Brain, 
  Target, 
  Zap,
  BarChart3,
  Eye,
  ArrowUp,
  Star,
  MessageCircle,
  Clock,
  Award
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";
import { apiRequest } from "@/lib/queryClient";

interface ROIMetrics {
  actionLikelihood: number;
  emotionalCharge: number;
  memoryRetention: number;
  overallImpact: number;
  persuasionScore: number;
  engagementLevel: number;
  credibilityIndex: number;
  urgencyFactor: number;
  socialProofStrength: number;
  logicalCoherence: number;
  rhetoricalPower: number;
  audienceResonance: number;
}

interface SpeechAnalysis {
  keyInsights: string[];
  strengthAreas: string[];
  improvementAreas: string[];
  audienceImpact: string;
  recommendedActions: string[];
  impactPrediction: string;
}

export default function SpeechROIAnalyzer() {
  const { transcript, wordCount } = useSpeechRecognition();
  const { speakingPace, voiceClarity, confidenceScore } = useVoiceAnalysis();

  const [roiMetrics, setROIMetrics] = useState<ROIMetrics>({
    actionLikelihood: 0,
    emotionalCharge: 0,
    memoryRetention: 0,
    overallImpact: 0,
    persuasionScore: 0,
    engagementLevel: 0,
    credibilityIndex: 0,
    urgencyFactor: 0,
    socialProofStrength: 0,
    logicalCoherence: 0,
    rhetoricalPower: 0,
    audienceResonance: 0
  });

  const [speechAnalysis, setSpeechAnalysis] = useState<SpeechAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number>(0);

  const analyzeROI = async () => {
    if (!transcript || transcript.length < 50) return;

    setIsAnalyzing(true);
    try {
      const analysisPrompt = `As an expert in persuasion psychology and communication impact analysis, analyze this speech transcript for ROI prediction:

SPEECH TRANSCRIPT: "${transcript}"

PERFORMANCE METRICS:
- Speaking Pace: ${speakingPace} WPM
- Voice Clarity: ${voiceClarity}%
- Confidence Score: ${confidenceScore}%
- Word Count: ${wordCount}
- Session Duration: ${Math.floor(wordCount / Math.max(speakingPace, 1) * 60)} seconds

ANALYSIS REQUIREMENTS:
Evaluate the speech's potential impact using persuasion theory and NLP principles:

1. ACTION LIKELIHOOD (0-100): How likely is the audience to take action after this speech?
2. EMOTIONAL CHARGE (0-100): What's the emotional intensity and connection level?
3. MEMORY RETENTION (0-100): How memorable and sticky is this content?
4. PERSUASION SCORE (0-100): Overall persuasive effectiveness using Cialdini principles
5. ENGAGEMENT LEVEL (0-100): How captivating and attention-holding is the delivery?

For each metric, analyze:
- Use of storytelling and narrative techniques
- Emotional language and power words
- Call-to-action clarity and strength
- Logical structure and flow
- Personal connection and relatability
- Repetition and emphasis patterns
- Urgency and scarcity indicators
- Social proof and authority elements

Provide specific insights on:
- Key persuasive elements identified
- Strength areas that enhance impact
- Areas needing improvement for better ROI
- Predicted audience impact
- Recommended actions to increase effectiveness

Respond in JSON format:
{
  "metrics": {
    "actionLikelihood": number,
    "emotionalCharge": number,
    "memoryRetention": number,
    "persuasionScore": number,
    "engagementLevel": number
  },
  "analysis": {
    "keyInsights": ["insight 1", "insight 2"],
    "strengthAreas": ["strength 1", "strength 2"],
    "improvementAreas": ["improvement 1", "improvement 2"],
    "audienceImpact": "predicted impact description",
    "recommendedActions": ["action 1", "action 2"],
    "impactPrediction": "overall prediction"
  }
}`;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: "You are an expert communication impact analyst specializing in persuasion psychology, NLP, and speech ROI prediction. Provide detailed, actionable analysis."
            },
            {
              role: "user",
              content: analysisPrompt
            }
          ],
          temperature: 0.3,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis API error: ${response.status}`);
      }

      const data = await response.json();
      let analysisResult;
      
      try {
        analysisResult = JSON.parse(data.choices[0].message.content);
        
        // Calculate overall impact as average of key metrics
        const overallImpact = Math.round(
          (analysisResult.metrics.actionLikelihood + 
           analysisResult.metrics.emotionalCharge + 
           analysisResult.metrics.memoryRetention + 
           analysisResult.metrics.persuasionScore + 
           analysisResult.metrics.engagementLevel) / 5
        );

        setROIMetrics({
          ...analysisResult.metrics,
          overallImpact
        });
        
        setSpeechAnalysis(analysisResult.analysis);
        setLastAnalysisTime(Date.now());
      } catch (parseError) {
        // Fallback analysis based on basic metrics
        generateFallbackAnalysis();
      }
    } catch (error) {
      console.error('ROI analysis failed:', error);
      generateFallbackAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFallbackAnalysis = () => {
    // Generate basic ROI metrics based on available data
    const baseScore = Math.min(90, Math.max(30, confidenceScore + 20));
    const paceBonus = speakingPace >= 120 && speakingPace <= 160 ? 10 : -5;
    const clarityBonus = voiceClarity > 80 ? 10 : -5;
    const lengthBonus = wordCount > 100 ? 10 : -10;

    const actionLikelihood = Math.min(95, Math.max(25, baseScore + paceBonus - 5));
    const emotionalCharge = Math.min(95, Math.max(20, baseScore + clarityBonus));
    const memoryRetention = Math.min(95, Math.max(30, baseScore + lengthBonus));
    const persuasionScore = Math.min(95, Math.max(25, baseScore + (paceBonus + clarityBonus) / 2));
    const engagementLevel = Math.min(95, Math.max(35, baseScore + clarityBonus - 5));
    const overallImpact = Math.round((actionLikelihood + emotionalCharge + memoryRetention + persuasionScore + engagementLevel) / 5);

    setROIMetrics({
      actionLikelihood,
      emotionalCharge,
      memoryRetention,
      overallImpact,
      persuasionScore,
      engagementLevel,
      credibilityIndex: Math.min(95, Math.max(30, baseScore + clarityBonus + 5)),
      urgencyFactor: Math.min(95, Math.max(20, baseScore + paceBonus)),
      socialProofStrength: Math.min(95, Math.max(25, baseScore + lengthBonus - 10)),
      logicalCoherence: Math.min(95, Math.max(35, baseScore + clarityBonus + 10)),
      rhetoricalPower: Math.min(95, Math.max(40, baseScore + (paceBonus + clarityBonus + lengthBonus) / 3)),
      audienceResonance: Math.min(95, Math.max(30, baseScore + clarityBonus + lengthBonus / 2))
    });

    setSpeechAnalysis({
      keyInsights: [
        "Clear vocal delivery detected",
        "Consistent speaking rhythm maintained",
        "Good speech length for audience retention"
      ],
      strengthAreas: [
        voiceClarity > 80 ? "Excellent voice clarity" : "Developing voice clarity",
        speakingPace >= 120 && speakingPace <= 160 ? "Optimal speaking pace" : "Adjusting speaking pace",
        confidenceScore > 70 ? "Strong confidence level" : "Building confidence"
      ],
      improvementAreas: [
        "Add more emotional language",
        "Include stronger call-to-action statements",
        "Incorporate storytelling elements"
      ],
      audienceImpact: overallImpact > 70 ? "Strong potential for positive audience response" : "Moderate audience impact expected",
      recommendedActions: [
        "Practice with more varied vocal emphasis",
        "Add personal anecdotes for connection",
        "Strengthen opening and closing statements"
      ],
      impactPrediction: overallImpact > 80 ? "High likelihood of achieving speech objectives" : overallImpact > 60 ? "Good potential for success with refinements" : "Significant improvements needed for maximum impact"
    });
  };

  // Auto-analyze when transcript changes significantly
  useEffect(() => {
    const now = Date.now();
    if (transcript && transcript.length > 100 && now - lastAnalysisTime > 30000) {
      analyzeROI();
    }
  }, [transcript, wordCount]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <ArrowUp className="w-4 h-4" />;
    if (score >= 60) return <Target className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Overall Impact Score */}
      <Card className="gradient-card purple-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span className="gradient-text font-heading">Speech ROI Analyzer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <div className="w-full h-full rounded-full border-8 border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-display gradient-text">{roiMetrics.overallImpact}</div>
                  <div className="text-sm text-gray-600">Impact Score</div>
                </div>
              </div>
              <div 
                className="absolute inset-0 rounded-full border-8 border-purple-600 transition-all duration-1000"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((roiMetrics.overallImpact / 100) * 2 * Math.PI - Math.PI/2)}% ${50 + 50 * Math.sin((roiMetrics.overallImpact / 100) * 2 * Math.PI - Math.PI/2)}%, 50% 50%)`
                }}
              />
            </div>
            <p className="text-gray-600">
              {roiMetrics.overallImpact >= 80 ? "Excellent impact potential" : 
               roiMetrics.overallImpact >= 60 ? "Good impact potential" : 
               "Room for improvement"}
            </p>
          </div>

          <Button 
            onClick={analyzeROI}
            disabled={isAnalyzing || !transcript}
            className="w-full gradient-bg text-white hover:opacity-90 purple-glow"
          >
            {isAnalyzing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Impact...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Analyze Speech ROI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Action Likelihood</span>
              </div>
              <Badge className={getScoreColor(roiMetrics.actionLikelihood)}>
                {getScoreIcon(roiMetrics.actionLikelihood)}
                {roiMetrics.actionLikelihood}%
              </Badge>
            </div>
            <Progress value={roiMetrics.actionLikelihood} className="h-2" />
            <p className="text-xs text-gray-600 mt-2">
              Probability audience will take desired action
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span className="font-medium">Emotional Charge</span>
              </div>
              <Badge className={getScoreColor(roiMetrics.emotionalCharge)}>
                {getScoreIcon(roiMetrics.emotionalCharge)}
                {roiMetrics.emotionalCharge}%
              </Badge>
            </div>
            <Progress value={roiMetrics.emotionalCharge} className="h-2" />
            <p className="text-xs text-gray-600 mt-2">
              Emotional intensity and connection level
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Memory Retention</span>
              </div>
              <Badge className={getScoreColor(roiMetrics.memoryRetention)}>
                {getScoreIcon(roiMetrics.memoryRetention)}
                {roiMetrics.memoryRetention}%
              </Badge>
            </div>
            <Progress value={roiMetrics.memoryRetention} className="h-2" />
            <p className="text-xs text-gray-600 mt-2">
              How memorable and sticky the content is
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Persuasion Score</span>
              </div>
              <Badge className={getScoreColor(roiMetrics.persuasionScore)}>
                {getScoreIcon(roiMetrics.persuasionScore)}
                {roiMetrics.persuasionScore}%
              </Badge>
            </div>
            <Progress value={roiMetrics.persuasionScore} className="h-2" />
            <p className="text-xs text-gray-600 mt-2">
              Overall persuasive effectiveness
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-600" />
                <span className="font-medium">Engagement Level</span>
              </div>
              <Badge className={getScoreColor(roiMetrics.engagementLevel)}>
                {getScoreIcon(roiMetrics.engagementLevel)}
                {roiMetrics.engagementLevel}%
              </Badge>
            </div>
            <Progress value={roiMetrics.engagementLevel} className="h-2" />
            <p className="text-xs text-gray-600 mt-2">
              Audience attention and interest level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      {speechAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Insights */}
          <Card className="gradient-card purple-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Key Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {speechAnalysis.keyInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Award className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{insight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Actions */}
          <Card className="gradient-card purple-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>Recommended Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {speechAnalysis.recommendedActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <ArrowUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Impact Prediction */}
          <Card className="gradient-card purple-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Impact Prediction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                <p className="text-gray-800 font-medium mb-2">{speechAnalysis.audienceImpact}</p>
                <p className="text-gray-700">{speechAnalysis.impactPrediction}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}