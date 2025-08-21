import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Heart,
  Loader2,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface CoachingInsights {
  overallProgress: {
    trend: 'improving' | 'steady' | 'declining';
    summary: string;
    scoreImprovement: number;
  };
  strengths: string[];
  areasForImprovement: string[];
  personalizedTips: string[];
  patterns: {
    speaking: string[];
    bodyLanguage: string[];
    content: string[];
  };
  nextSteps: string[];
  motivationalMessage: string;
}

export default function AICoachInsights() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch AI coaching insights
  const { data: insights, isLoading, error, refetch } = useQuery<CoachingInsights>({
    queryKey: ['/api/ai-coach/insights'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
          <span className="text-slate-600">Analyzing your speaking patterns...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="py-8">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Unable to generate insights at this time. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return null;
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declining':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Brain className="h-6 w-6 text-blue-600" />
            AI Coach Insights
          </CardTitle>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Overall Progress Card */}
        <div className={`mb-6 p-4 rounded-lg border ${getTrendColor(insights.overallProgress.trend)}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getTrendIcon(insights.overallProgress.trend)}
                <span className="font-semibold text-lg capitalize">
                  {insights.overallProgress.trend} Trend
                </span>
                {insights.overallProgress.scoreImprovement !== 0 && (
                  <Badge variant="outline" className="ml-2">
                    {insights.overallProgress.scoreImprovement > 0 ? '+' : ''}
                    {insights.overallProgress.scoreImprovement}%
                  </Badge>
                )}
              </div>
              <p className="text-slate-700">{insights.overallProgress.summary}</p>
            </div>
          </div>
        </div>

        {/* Tabs for different insight categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
            <TabsTrigger value="next">Next Steps</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Strengths */}
              <Card className="border-green-100 bg-green-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-green-600" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card className="border-amber-100 bg-amber-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-amber-600" />
                    Areas to Focus On
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-4">
            <div className="grid gap-4">
              {/* Speaking Patterns */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Speaking Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.patterns.speaking.map((pattern, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Body Language Patterns */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Body Language Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.patterns.bodyLanguage.map((pattern, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Content Patterns */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Content Delivery Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.patterns.content.map((pattern, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-4">
            <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Personalized Coaching Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights.personalizedTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <Badge className="mt-0.5">{index + 1}</Badge>
                      <span className="text-sm text-slate-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Next Steps Tab */}
          <TabsContent value="next" className="space-y-4">
            <Card className="border-green-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ArrowRight className="h-5 w-5 text-green-600" />
                  Your Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {insights.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm text-slate-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Motivational Message */}
            <Alert className="border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
              <Heart className="h-4 w-4 text-pink-600" />
              <AlertDescription className="text-slate-700 font-medium">
                {insights.motivationalMessage}
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}