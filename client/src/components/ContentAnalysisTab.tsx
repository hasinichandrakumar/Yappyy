import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Target, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  BarChart3,
  Brain,
  Sparkles,
  Book,
  Users,
  Megaphone,
  Star,
  Clock,
  RefreshCw,
  Info
} from 'lucide-react';

interface ContentMetrics {
  persuasiveness: {
    score: number;
    techniques: string[];
    rhetoricalDevices: string[];
    credibilityIndicators: string[];
  };
  clarity: {
    readabilityScore: number;
    gradeLevel: string;
    complexWordRatio: number;
    averageWordsPerSentence: number;
    sentenceVariety: number;
  };
  structure: {
    coherenceScore: number;
    transitionQuality: number;
    logicalFlow: number;
    conclusionStrength: number;
  };
  professionalism: {
    formalityLevel: number;
    vocabularySophistication: number;
    grammarScore: number;
    technicalAccuracy: number;
  };
  engagement: {
    attentionHooks: string[];
    interactivityScore: number;
    urgencyIndicators: string[];
    storytellingElements: string[];
  };
  sentiment: {
    overall: string;
    emotions: { [key: string]: number };
    confidence: number;
  };
  language: {
    detected: string;
    confidence: number;
  };
  overall: {
    score: number;
    category: string;
  };
}

interface ContentAnalysisTabProps {
  session: any;
}

export default function ContentAnalysisTab({ session }: ContentAnalysisTabProps) {
  const [contentAnalysis, setContentAnalysis] = useState<ContentMetrics | null>(null);
  const [purposeFeedback, setPurposeFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Analyze content when session changes
  useEffect(() => {
    if (session?.transcript && session.transcript.trim().length > 0) {
      analyzeContent();
    }
  }, [session]);

  const analyzeContent = async () => {
    if (!session?.transcript || session.transcript.trim().length === 0) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/advanced-content-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: session.transcript,
          purpose: session.purpose || 'general-presentation'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.analysis) {
          setContentAnalysis(data.analysis);
          setPurposeFeedback(data.purposeFeedback);
        }
      }
    } catch (error) {
      console.error('Content analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (!session?.transcript || session.transcript.trim().length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content to Analyze</h3>
          <p className="text-gray-600">This session doesn't have a transcript available for content analysis.</p>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analyzing your content for persuasiveness, clarity, structure, and engagement...</p>
        </CardContent>
      </Card>
    );
  }

  if (!contentAnalysis) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Unavailable</h3>
          <p className="text-gray-600 mb-4">Unable to analyze the content. Please try again.</p>
          <Button onClick={analyzeContent} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold">Content Analysis</h3>
        </div>
        <Button 
          onClick={analyzeContent} 
          disabled={isAnalyzing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Re-analyze
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="suggestions">Improvements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Main Content Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  Persuasiveness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(contentAnalysis.persuasiveness.score)}`}>
                    {contentAnalysis.persuasiveness.score}%
                  </span>
                  <Progress value={contentAnalysis.persuasiveness.score} className="w-20" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {contentAnalysis.persuasiveness.techniques.slice(0, 2).map((technique) => (
                    <Badge key={technique} variant="secondary" className="text-xs">
                      {technique}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  Clarity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(contentAnalysis.clarity.readabilityScore)}`}>
                    {contentAnalysis.clarity.readabilityScore}%
                  </span>
                  <Progress value={contentAnalysis.clarity.readabilityScore} className="w-20" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {contentAnalysis.clarity.gradeLevel} Level
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(contentAnalysis.structure.coherenceScore)}`}>
                    {contentAnalysis.structure.coherenceScore}%
                  </span>
                  <Progress value={contentAnalysis.structure.coherenceScore} className="w-20" />
                </div>
                <Badge variant="outline" className="text-xs">
                  Logic Flow: {contentAnalysis.structure.logicalFlow}%
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  Professionalism
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(contentAnalysis.professionalism.formalityLevel)}`}>
                    {contentAnalysis.professionalism.formalityLevel}%
                  </span>
                  <Progress value={contentAnalysis.professionalism.formalityLevel} className="w-20" />
                </div>
                <Badge variant="outline" className="text-xs">
                  Vocabulary: {contentAnalysis.professionalism.vocabularySophistication}%
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Overall Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Overall Content Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className={`text-4xl font-bold ${getScoreColor(contentAnalysis.overall.score)} mb-2`}>
                    {contentAnalysis.overall.score}%
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {contentAnalysis.overall.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-2">Language Detected</div>
                  <Badge variant="secondary">
                    {contentAnalysis.language.detected} ({contentAnalysis.language.confidence}% confidence)
                  </Badge>
                </div>
              </div>
              <Progress value={contentAnalysis.overall.score} className="h-3" />
            </CardContent>
          </Card>

          {/* Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Audience Engagement Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Interactivity Score</span>
                    <Badge variant={getScoreBadgeVariant(contentAnalysis.engagement.interactivityScore) as any}>
                      {contentAnalysis.engagement.interactivityScore}%
                    </Badge>
                  </div>
                  <Progress value={contentAnalysis.engagement.interactivityScore} className="mb-4" />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Attention Hooks Found:</h4>
                    <div className="flex flex-wrap gap-2">
                      {contentAnalysis.engagement.attentionHooks.map((hook, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {hook}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Storytelling Elements:</h4>
                      {contentAnalysis.engagement.storytellingElements.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {contentAnalysis.engagement.storytellingElements.map((element, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {element}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No storytelling elements detected</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Urgency Indicators:</h4>
                      {contentAnalysis.engagement.urgencyIndicators.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {contentAnalysis.engagement.urgencyIndicators.map((indicator, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No urgency language detected</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600" />
                What You're Talking About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Main Topics & Themes:</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {session.transcript.length > 300 
                        ? `${session.transcript.substring(0, 300)}...` 
                        : session.transcript}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Persuasion Techniques</h4>
                    <div className="space-y-1">
                      {contentAnalysis.persuasiveness.techniques.map((technique, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-xs">{technique}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Rhetorical Devices</h4>
                    <div className="space-y-1">
                      {contentAnalysis.persuasiveness.rhetoricalDevices.map((device, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <span className="text-xs">{device}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Credibility Markers</h4>
                    <div className="space-y-1">
                      {contentAnalysis.persuasiveness.credibilityIndicators.map((indicator, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="w-3 h-3 text-yellow-600" />
                          <span className="text-xs">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Quality Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-green-600" />
                  Reading Level & Clarity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {contentAnalysis.clarity.gradeLevel}
                    </div>
                    <div className="text-sm text-gray-600">Reading Level</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Complex Words</span>
                      <Badge variant="outline">
                        {(contentAnalysis.clarity.complexWordRatio * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sentence Variety</span>
                      <Badge variant={getScoreBadgeVariant(contentAnalysis.clarity.sentenceVariety) as any}>
                        {contentAnalysis.clarity.sentenceVariety}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Words/Sentence</span>
                      <Badge variant="outline">
                        {contentAnalysis.clarity.averageWordsPerSentence.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Emotional Tone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1 capitalize">
                      {contentAnalysis.sentiment.overall}
                    </div>
                    <div className="text-sm text-gray-600">
                      Overall Sentiment ({contentAnalysis.sentiment.confidence}% confidence)
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm mb-2">Emotional Breakdown:</h4>
                    {Object.entries(contentAnalysis.sentiment.emotions).map(([emotion, score]) => (
                      <div key={emotion} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{emotion}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={score * 100} className="w-16" />
                          <span className="text-xs w-8">{Math.round(score * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          {/* Improvement Suggestions */}
          {purposeFeedback && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Purpose-Specific Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Strengths:</h4>
                    <ul className="space-y-1">
                      {purposeFeedback.strengths?.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Improvement Areas:</h4>
                    <ul className="space-y-1">
                      {purposeFeedback.improvements?.map((improvement: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {purposeFeedback.recommendations && (
                    <div>
                      <h4 className="font-medium mb-2">Specific Recommendations:</h4>
                      <ul className="space-y-1">
                        {purposeFeedback.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* General Improvement Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                How to Make Your Content Better
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentAnalysis.persuasiveness.score < 70 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Increase Persuasiveness:</strong> Add more social proof, statistics, or credibility indicators to strengthen your arguments. Consider using "we" language and specific examples.
                    </AlertDescription>
                  </Alert>
                )}
                
                {contentAnalysis.clarity.readabilityScore < 70 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Improve Clarity:</strong> Simplify complex sentences and reduce jargon. Aim for shorter sentences and explain technical terms when necessary.
                    </AlertDescription>
                  </Alert>
                )}
                
                {contentAnalysis.structure.coherenceScore < 70 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Enhance Structure:</strong> Add clearer transitions between ideas ("First...", "Next...", "Finally...") and ensure logical flow from introduction to conclusion.
                    </AlertDescription>
                  </Alert>
                )}
                
                {contentAnalysis.engagement.interactivityScore < 60 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Boost Engagement:</strong> Include more questions, personal stories, or direct audience addresses. Use phrases like "Imagine if..." or "Have you ever...?"
                    </AlertDescription>
                  </Alert>
                )}

                {/* Always show positive reinforcement */}
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <strong>What's Working Well:</strong> Your content shows {contentAnalysis.overall.category} level quality. Keep developing your natural speaking style while incorporating these suggestions.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}