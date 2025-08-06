import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Target,
  Users,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart,
  Sparkles,
  ArrowUpRight,
  Zap,
} from 'lucide-react';

interface EnhancedContentAnalysisTabProps {
  session: any;
}

interface AnalysisMetric {
  score: number;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface ContentFeedback {
  type: 'strength' | 'improvement' | 'insight';
  category: string;
  message: string;
  suggestion?: string;
  impact: 'high' | 'medium' | 'low';
}

export default function EnhancedContentAnalysisTab({ session }: EnhancedContentAnalysisTabProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  useEffect(() => {
    if (session?.transcript && session.transcript.trim().length > 0) {
      analyzeContent();
    }
  }, [session]);

  const analyzeContent = async () => {
    if (!session?.transcript || session.transcript.trim().length === 0) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/advanced-content-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: session.transcript,
          purpose: session.purpose || 'general',
          sessionDuration: session.duration || 0,
          sessionId: session.id,
          analysisType: 'comprehensive'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.analysis) {
          setAnalysis(data.analysis);
        }
      }
    } catch (error) {
      console.error('Content analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const metrics: AnalysisMetric[] = [
    {
      score: analysis?.purposeAlignment?.score || 0,
      label: 'Purpose Alignment',
      description: 'How well the content aligns with the intended purpose',
      icon: <Target className="w-4 h-4" />,
      color: 'text-blue-500'
    },
    {
      score: analysis?.audienceEngagement?.score || 0,
      label: 'Audience Engagement',
      description: 'Level of audience engagement and connection',
      icon: <Users className="w-4 h-4" />,
      color: 'text-purple-500'
    },
    {
      score: analysis?.contentStructure?.score || 0,
      label: 'Content Structure',
      description: 'Organization and flow of ideas',
      icon: <BarChart className="w-4 h-4" />,
      color: 'text-green-500'
    },
    {
      score: analysis?.persuasiveness?.score || 0,
      label: 'Persuasiveness',
      description: 'Effectiveness in conveying arguments',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-orange-500'
    }
  ];

  const renderMetricCard = (metric: AnalysisMetric) => (
    <Card
      className={\`cursor-pointer transition-all \${
        activeMetric === metric.label
          ? 'ring-2 ring-blue-500 shadow-lg'
          : 'hover:shadow-md'
      }\`}
      onClick={() => setActiveMetric(metric.label)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={\`p-2 rounded-lg \${metric.color.replace('text', 'bg')}/10\`}>
            {metric.icon}
          </div>
          <Badge
            variant={metric.score >= 80 ? "success" : metric.score >= 60 ? "warning" : "destructive"}
          >
            {metric.score}%
          </Badge>
        </div>
        <h3 className="font-semibold mb-1">{metric.label}</h3>
        <p className="text-sm text-gray-500">{metric.description}</p>
        <Progress value={metric.score} className="mt-2" />
      </CardContent>
    </Card>
  );

  const renderFeedbackItem = (feedback: ContentFeedback) => (
    <div className="p-4 rounded-lg bg-gray-50 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {feedback.type === 'strength' ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : feedback.type === 'improvement' ? (
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          ) : (
            <Lightbulb className="w-5 h-5 text-blue-500" />
          )}
          <span className="font-medium">{feedback.category}</span>
        </div>
        <Badge variant={
          feedback.impact === 'high' ? 'destructive' :
          feedback.impact === 'medium' ? 'warning' : 'outline'
        }>
          {feedback.impact} impact
        </Badge>
      </div>
      <p className="text-gray-700 mb-2">{feedback.message}</p>
      {feedback.suggestion && (
        <div className="mt-2 p-3 bg-white rounded-md border border-gray-100">
          <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium">Suggestion</span>
          </div>
          <p className="text-sm text-gray-600">{feedback.suggestion}</p>
        </div>
      )}
    </div>
  );

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-500 mb-4 mx-auto animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Analyzing Content</h3>
          <p className="text-gray-500">Using AI to analyze your speech content...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mb-4 mx-auto" />
          <h3 className="text-lg font-semibold mb-2">No Content Analysis</h3>
          <p className="text-gray-500">Start speaking to see content analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-500" />
                Content Analysis
              </CardTitle>
              <CardDescription>
                AI-powered analysis of your speech content
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {analysis.overallScore}%
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => renderMetricCard(metric))}
      </div>

      {/* Detailed Analysis Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            Detailed Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="insights">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="insights">Key Insights</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="insights">
                <ScrollArea className="h-[400px] pr-4">
                  {analysis.insights?.map((insight: ContentFeedback, index: number) => (
                    <div key={index}>
                      {renderFeedbackItem({
                        ...insight,
                        type: 'insight'
                      })}
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="strengths">
                <ScrollArea className="h-[400px] pr-4">
                  {analysis.strengths?.map((strength: ContentFeedback, index: number) => (
                    <div key={index}>
                      {renderFeedbackItem({
                        ...strength,
                        type: 'strength'
                      })}
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="improvements">
                <ScrollArea className="h-[400px] pr-4">
                  {analysis.improvements?.map((improvement: ContentFeedback, index: number) => (
                    <div key={index}>
                      {renderFeedbackItem({
                        ...improvement,
                        type: 'improvement'
                      })}
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Context-Specific Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Purpose-Specific Analysis
          </CardTitle>
          <CardDescription>
            Analysis based on your speech purpose: {session.purpose || 'General Presentation'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-4">
            {analysis.purposeSpecificFeedback?.map((feedback: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 mb-3"
              >
                <ArrowUpRight className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">{feedback.title}</p>
                  <p className="text-sm text-gray-600">{feedback.description}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}