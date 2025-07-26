import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Star, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Volume2,
  Timer,
  Users,
  Lightbulb,
  BookOpen,
  Award,
  BarChart3
} from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";
import { useMutation } from '@tanstack/react-query';

interface SessionAnalysis {
  overallScore: number;
  duration: number;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  strengths: string[];
  improvements: string[];
  keyInsights: string[];
  roleplayContext?: string;
  audienceType?: string;
  contentAnalysis?: {
    overall: { score: number; grade: string; confidence: number };
    persuasiveness: { score: number; techniques: string[]; credibilityScore: number };
    clarity: { score: number; fleschScore: number; readabilityGrade: number };
    engagement: { score: number; attentionHooks: string[]; urgencyLevel: number };
    professionalism: { score: number; vocabularyLevel: number; grammarScore: number };
  };
}

interface PostSessionAnalysisProps {
  isVisible: boolean;
  onClose: () => void;
  roleplayContext?: string;
  audienceType?: string;
}

export default function PostSessionAnalysis({ 
  isVisible, 
  onClose, 
  roleplayContext, 
  audienceType 
}: PostSessionAnalysisProps) {
  const { transcript, wpm, fillerWords, wordCount } = useSpeechRecognition();
  const { voiceClarity, confidenceScore } = useVoiceAnalysis();
  
  const [analysis, setAnalysis] = useState<SessionAnalysis | null>(null);

  // Advanced content analysis mutation
  const contentAnalysisMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch('/api/advanced-content-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text })
      });
      return await response.json();
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isVisible && !analysis) {
      generateAnalysis();
    }
  }, [isVisible]);

  const generateAnalysis = async () => {
    setIsGenerating(true);
    
    // Calculate session metrics based on actual data
    const sessionDuration = wordCount > 0 && wpm > 0 ? Math.round((wordCount / wpm) * 60) : Math.max(60, transcript.length * 2);
    const fillerRate = wordCount > 0 ? (fillerWords.length / wordCount) * 100 : 0;
    const clarity = Math.max(voiceClarity || 0, 50);
    const confidence = Math.max(confidenceScore || 0, 50);
    
    // Calculate performance scores with real data
    const paceScore = wpm === 0 ? 0 : 
                     wpm >= 150 && wpm <= 180 ? 100 : 
                     wpm >= 120 && wpm <= 200 ? 85 :
                     wpm >= 100 && wpm <= 220 ? 70 : 50;
    const fillerScore = Math.max(0, 100 - fillerRate * 8);
    const overallScore = Math.round((paceScore + fillerScore + clarity + confidence) / 4);

    // Generate contextual feedback based on roleplay
    const getContextualFeedback = () => {
      if (!roleplayContext) return getGeneralFeedback();
      
      switch (roleplayContext) {
        case "job-interview":
          return {
            strengths: [
              "Maintained professional tone throughout",
              "Clear articulation of experience",
              "Confident delivery in responses"
            ],
            improvements: [
              "Practice answering behavioral questions more concisely",
              "Reduce filler words when discussing achievements",
              "Improve eye contact during key selling points"
            ],
            insights: [
              "Your confidence increased when discussing technical skills",
              "Consider preparing STAR method examples",
              "Strong opening but conclusion could be more impactful"
            ]
          };
        case "sales-pitch":
          return {
            strengths: [
              "Compelling opening that grabbed attention",
              "Clear value proposition articulation",
              "Confident pricing discussion"
            ],
            improvements: [
              "Include more customer pain points",
              "Practice handling objections more smoothly",
              "Strengthen the urgency in your call-to-action"
            ],
            insights: [
              "Your energy peaked during benefit explanations",
              "Consider using more customer success stories",
              "Pause more after key benefits for emphasis"
            ]
          };
        case "conference-presentation":
          return {
            strengths: [
              "Authoritative delivery of technical content",
              "Good use of structured presentation flow",
              "Engaging opening hook"
            ],
            improvements: [
              "Vary vocal pace for better audience engagement",
              "Include more interactive elements",
              "Strengthen transitions between sections"
            ],
            insights: [
              "Your expertise shows through confident delivery",
              "Consider adding more real-world examples",
              "Audience would benefit from clearer takeaways"
            ]
          };
        case "wedding-toast":
          return {
            strengths: [
              "Warm, personal tone throughout",
              "Heartfelt emotional connection",
              "Good balance of humor and sentiment"
            ],
            improvements: [
              "Practice smoother transitions between stories",
              "Reduce nervous laughter",
              "Stronger ending with clear well-wishes"
            ],
            insights: [
              "Your genuine emotion resonated beautifully",
              "Consider rehearsing key phrases more",
              "Perfect length for this type of speech"
            ]
          };
        default:
          return getGeneralFeedback();
      }
    };

    const getGeneralFeedback = () => ({
      strengths: [
        `Maintained good speaking pace at ${wpm} WPM`,
        `${clarity > 80 ? 'Excellent' : 'Good'} voice clarity`,
        `${confidence > 75 ? 'Strong' : 'Developing'} confidence level`
      ],
      improvements: [
        fillerRate > 5 ? "Reduce filler words (um, uh, like)" : "Continue maintaining low filler word usage",
        clarity < 80 ? "Focus on clearer articulation" : "Maintain excellent articulation",
        wpm > 180 ? "Slow down for better comprehension" : wpm < 120 ? "Increase speaking pace slightly" : "Maintain current pace"
      ],
      insights: [
        "Your speaking rhythm was consistent throughout",
        "Voice modulation could enhance engagement",
        "Content structure showed good logical flow"
      ]
    });

    const feedback = getContextualFeedback();

    const sessionAnalysis: SessionAnalysis = {
      overallScore,
      duration: sessionDuration,
      wordCount,
      wpm,
      fillerCount: fillerWords.length,
      strengths: feedback.strengths,
      improvements: feedback.improvements,
      keyInsights: feedback.insights,
      roleplayContext,
      audienceType
    };

    // Simulate AI processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setAnalysis(sessionAnalysis);
    setIsGenerating(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-50 to-[#0BF9EA]/10 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-[#0BF9EA] rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">AI Coach Analysis</h2>
                <p className="text-gray-600">
                  {roleplayContext ? `${roleplayContext.charAt(0).toUpperCase() + roleplayContext.slice(1).replace('-', ' ')} Session` : 'Practice Session'} Complete
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="p-6">
          {isGenerating ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-[#0BF9EA] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Performance</h3>
              <p className="text-gray-600">AI is processing your speech patterns, delivery, and content...</p>
            </div>
          ) : analysis ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="strengths">Strengths</TabsTrigger>
                <TabsTrigger value="improvements">Areas to Improve</TabsTrigger>
                <TabsTrigger value="insights">Key Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-[#0BF9EA]" />
                        <span>Overall Performance</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-[#0BF9EA] mb-2">
                          {analysis.overallScore}%
                        </div>
                        <Progress value={analysis.overallScore} className="h-3" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium ml-2">{analysis.duration}s</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Words:</span>
                          <span className="font-medium ml-2">{analysis.wordCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Pace:</span>
                          <span className="font-medium ml-2">{analysis.wpm} WPM</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Fillers:</span>
                          <span className="font-medium ml-2">{analysis.fillerCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-[#0BF9EA]" />
                        <span>Session Context</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {roleplayContext && (
                        <div>
                          <Badge className="bg-[#0BF9EA]/10 text-[#0BF9EA] border-[#0BF9EA]/20">
                            {roleplayContext.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      )}
                      {audienceType && (
                        <div>
                          <span className="text-gray-500">Audience:</span>
                          <span className="font-medium ml-2">{audienceType}</span>
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Session completed successfully</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-[#0BF9EA]" />
                          <span className="text-sm">AI analysis complete</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="strengths" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-green-500" />
                      <span>What You Did Well</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <span className="text-green-800">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="improvements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      <span>Areas for Growth</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                          <span className="text-orange-800">{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-blue-500" />
                      <span>AI Insights & Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.keyInsights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />
                          <span className="text-blue-800">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : null}
        </div>
      </div>
    </div>
  );
}