import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from '@tanstack/react-query';
import { 
  Brain, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  BarChart3,
  MessageSquare,
  BookOpen,
  Star,
  Zap
} from "lucide-react";

interface SmartAIFeedbackProps {
  transcript: string;
  purpose?: string;
  sessionContext?: string;
}

interface ContentAnalysis {
  overall: { score: number; grade: string; confidence: number };
  persuasiveness: { score: number; techniques: string[]; credibilityScore: number };
  clarity: { score: number; fleschScore: number; readabilityGrade: number };
  engagement: { score: number; attentionHooks: string[]; urgencyLevel: number };
  professionalism: { score: number; vocabularyLevel: number; grammarScore: number };
  structure: { score: number; logicalFlow: number; sentenceVariety: number };
}

export default function SmartAIFeedback({ transcript, purpose, sessionContext }: SmartAIFeedbackProps) {
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysis | null>(null);
  const [aiCoachFeedback, setAiCoachFeedback] = useState<string>('');

  // Purpose-driven content analysis mutation
  const contentAnalysisMutation = useMutation({
    mutationFn: async ({ text, analysisContext }: { text: string; analysisContext?: string }) => {
      const response = await fetch('/api/advanced-content-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: text, 
          purpose: analysisContext || purpose || 'general-presentation'
        })
      });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.analysis) {
        setContentAnalysis(data.analysis);
        setAiCoachFeedback(data.purposeFeedback || '');
      }
    }
  });

  useEffect(() => {
    if (transcript && transcript.length > 20) {
      const analysisContext = purpose || sessionContext || 'general-presentation';
      contentAnalysisMutation.mutate({ text: transcript, analysisContext });
    }
  }, [transcript, purpose, sessionContext]);

  const formatPurpose = (contextStr?: string): string => {
    if (!contextStr) return 'General Presentation';
    return contextStr.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  if (contentAnalysisMutation.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
            <span>AI Coach Content Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600 animate-pulse" />
              <p className="text-sm text-gray-600">Analyzing your content for {formatPurpose(purpose)}...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contentAnalysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <span>AI Coach Content Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">
              {transcript.length < 20 
                ? "No sufficient content for analysis" 
                : "Content analysis unavailable"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall Performance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>AI Coach Content Analysis</span>
            <Badge variant="outline">{formatPurpose(purpose)}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-3xl font-extrabold ${getScoreColor(contentAnalysis.overall.score)}`}>
                {contentAnalysis.overall.score}
              </div>
              <p className="text-sm text-gray-600">Overall Score</p>
              <Badge variant={contentAnalysis.overall.score >= 70 ? "default" : "destructive"}>
                {getScoreBadge(contentAnalysis.overall.score)}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold text-blue-600">
                {contentAnalysis.overall.confidence}%
              </div>
              <p className="text-sm text-gray-600">Analysis Confidence</p>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                {contentAnalysis.overall.grade}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
          <TabsTrigger value="coaching">AI Coach Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Persuasiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(contentAnalysis.persuasiveness.score)}`}>
                    {contentAnalysis.persuasiveness.score}
                  </span>
                  <Progress value={contentAnalysis.persuasiveness.score} className="w-20" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {contentAnalysis.persuasiveness.techniques.slice(0, 3).map((technique) => (
                    <Badge key={technique} variant="secondary" className="text-xs">
                      {technique}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Clarity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(contentAnalysis.clarity.score)}`}>
                    {contentAnalysis.clarity.score}
                  </span>
                  <Progress value={contentAnalysis.clarity.score} className="w-20" />
                </div>
                <p className="text-xs text-gray-600">
                  Grade {contentAnalysis.clarity.readabilityGrade} reading level
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(contentAnalysis.engagement.score)}`}>
                    {contentAnalysis.engagement.score}
                  </span>
                  <Progress value={contentAnalysis.engagement.score} className="w-20" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {contentAnalysis.engagement.attentionHooks.slice(0, 2).map((hook) => (
                    <Badge key={hook} variant="outline" className="text-xs">
                      {hook}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Professionalism</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(contentAnalysis.professionalism.score)}`}>
                    {contentAnalysis.professionalism.score}
                  </span>
                  <Progress value={contentAnalysis.professionalism.score} className="w-20" />
                </div>
                <p className="text-xs text-gray-600">
                  Vocabulary level: {contentAnalysis.professionalism.vocabularyLevel}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="space-y-3">
            {[
              { name: 'Persuasiveness', score: contentAnalysis.persuasiveness.score, icon: Target },
              { name: 'Clarity', score: contentAnalysis.clarity.score, icon: CheckCircle },
              { name: 'Engagement', score: contentAnalysis.engagement.score, icon: Zap },
              { name: 'Professionalism', score: contentAnalysis.professionalism.score, icon: Star },
              { name: 'Structure', score: contentAnalysis.structure.score, icon: BarChart3 }
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{metric.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={metric.score} className="w-24" />
                    <span className={`font-bold ${getScoreColor(metric.score)}`}>
                      {metric.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="coaching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Purpose-Specific AI Coach Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aiCoachFeedback ? (
                <div className="prose prose-sm max-w-none">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {aiCoachFeedback}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Purpose-specific coaching feedback unavailable
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}