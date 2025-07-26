import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Target, 
  Lightbulb, 
  BookOpen, 
  Award, 
  Zap, 
  Globe, 
  Heart,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ContentAnalysisResult {
  overall: {
    score: number;
    grade: 'poor' | 'fair' | 'good' | 'excellent';
    confidence: number;
  };
  persuasiveness: {
    score: number;
    techniques: string[];
    rhetoricalDevices: string[];
    credibilityScore: number;
    emotionalAppeal: number;
    logicalStructure: number;
  };
  clarity: {
    score: number;
    readabilityGrade: number;
    fleschScore: number;
    ariScore: number;
    averageWordsPerSentence: number;
    complexWordRatio: number;
  };
  structure: {
    score: number;
    sentenceVariety: number;
    paragraphCoherence: number;
    logicalFlow: number;
    transitionQuality: number;
  };
  professionalism: {
    score: number;
    formalityLevel: number;
    technicalAccuracy: number;
    vocabularyLevel: number;
    grammarScore: number;
  };
  engagement: {
    score: number;
    attentionHooks: string[];
    storytellingElements: number;
    interactiveLanguage: number;
    urgencyLevel: number;
  };
  lexicalAnalysis: {
    uniqueWords: number;
    totalWords: number;
    lexicalDiversity: number;
    vocabularyRichness: number;
    wordComplexity: number;
  };
  sentimentProfile: {
    overall: number;
    confidence: number;
    positive: number;
    negative: number;
    neutral: number;
    emotions: {
      joy: number;
      anger: number;
      fear: number;
      sadness: number;
      surprise: number;
      trust: number;
    };
  };
  language: {
    detectedLanguage: string;
    confidence: number;
    multilingualElements: string[];
  };
}

const AdvancedContentAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<ContentAnalysisResult | null>(null);

  const analyzeContentMutation = useMutation({
    mutationFn: async (transcript: string) => {
      const response = await fetch('/api/advanced-content-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript })
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      }
    }
  });

  const handleAnalyze = () => {
    if (text.trim()) {
      analyzeContentMutation.mutate(text);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 70) return <CheckCircle className="w-4 h-4 text-blue-600" />;
    if (score >= 55) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Advanced Content Analysis
          </CardTitle>
          <CardDescription>
            Analyze your content for persuasiveness, clarity, structure, professionalism, and engagement using advanced NLP techniques.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your speech content or transcript here for comprehensive analysis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="font-poppins"
          />
          <Button 
            onClick={handleAnalyze}
            disabled={!text.trim() || analyzeContentMutation.isPending}
            className="font-semibold"
          >
            {analyzeContentMutation.isPending ? 'Analyzing...' : 'Analyze Content'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Overall Assessment
                </span>
                <Badge className={getGradeBadgeColor(analysis.overall.grade)}>
                  {analysis.overall.grade.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {getScoreIcon(analysis.overall.score)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Overall Score</span>
                    <span className={`font-bold text-lg ${getScoreColor(analysis.overall.score)}`}>
                      {analysis.overall.score}/100
                    </span>
                  </div>
                  <Progress value={analysis.overall.score} className="h-2" />
                </div>
                <div className="text-sm text-muted-foreground">
                  {analysis.overall.confidence}% confidence
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="persuasiveness" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="persuasiveness" className="text-xs">Persuasion</TabsTrigger>
              <TabsTrigger value="clarity" className="text-xs">Clarity</TabsTrigger>
              <TabsTrigger value="structure" className="text-xs">Structure</TabsTrigger>
              <TabsTrigger value="professionalism" className="text-xs">Professional</TabsTrigger>
              <TabsTrigger value="engagement" className="text-xs">Engagement</TabsTrigger>
              <TabsTrigger value="sentiment" className="text-xs">Sentiment</TabsTrigger>
            </TabsList>

            <TabsContent value="persuasiveness" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Persuasiveness Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall Score</span>
                        <span className={`font-bold ${getScoreColor(analysis.persuasiveness.score)}`}>
                          {analysis.persuasiveness.score}/100
                        </span>
                      </div>
                      <Progress value={analysis.persuasiveness.score} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Credibility</span>
                        <span className={`font-bold ${getScoreColor(analysis.persuasiveness.credibilityScore)}`}>
                          {analysis.persuasiveness.credibilityScore}/100
                        </span>
                      </div>
                      <Progress value={analysis.persuasiveness.credibilityScore} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Emotional Appeal</span>
                        <span className={`font-bold ${getScoreColor(analysis.persuasiveness.emotionalAppeal)}`}>
                          {analysis.persuasiveness.emotionalAppeal}/100
                        </span>
                      </div>
                      <Progress value={analysis.persuasiveness.emotionalAppeal} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Persuasive Techniques Detected</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.persuasiveness.techniques.length > 0 ? (
                          analysis.persuasiveness.techniques.map((technique, index) => (
                            <Badge key={index} variant="secondary">
                              {technique}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No specific techniques detected</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Rhetorical Devices</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.persuasiveness.rhetoricalDevices.length > 0 ? (
                          analysis.persuasiveness.rhetoricalDevices.map((device, index) => (
                            <Badge key={index} variant="outline">
                              {device}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No rhetorical devices detected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clarity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Clarity & Readability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Clarity Score</span>
                        <span className={`font-bold ${getScoreColor(analysis.clarity.score)}`}>
                          {analysis.clarity.score}/100
                        </span>
                      </div>
                      <Progress value={analysis.clarity.score} />
                    </div>
                    <div className="space-y-2">
                      <span className="font-medium">Reading Grade</span>
                      <div className="text-2xl font-bold text-blue-600">
                        Grade {analysis.clarity.readabilityGrade}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="font-medium">Flesch Score</span>
                      <div className="text-2xl font-bold text-green-600">
                        {analysis.clarity.fleschScore}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="font-medium">Avg Words/Sentence</span>
                      <div className="text-2xl font-bold text-purple-600">
                        {analysis.clarity.averageWordsPerSentence}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Readability Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Complex Word Ratio:</span>
                          <span className="font-medium">{analysis.clarity.complexWordRatio}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ARI Score:</span>
                          <span className="font-medium">{analysis.clarity.ariScore}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Reading Level</h4>
                      <p className="text-sm text-muted-foreground">
                        Your content is suitable for Grade {analysis.clarity.readabilityGrade} readers. 
                        {analysis.clarity.readabilityGrade <= 8 && " This is excellent for broad accessibility."}
                        {analysis.clarity.readabilityGrade > 12 && " Consider simplifying for wider audience appeal."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="structure" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Content Structure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall</span>
                        <span className={`font-bold ${getScoreColor(analysis.structure.score)}`}>
                          {analysis.structure.score}/100
                        </span>
                      </div>
                      <Progress value={analysis.structure.score} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Variety</span>
                        <span className={`font-bold ${getScoreColor(analysis.structure.sentenceVariety)}`}>
                          {analysis.structure.sentenceVariety}/100
                        </span>
                      </div>
                      <Progress value={analysis.structure.sentenceVariety} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Coherence</span>
                        <span className={`font-bold ${getScoreColor(analysis.structure.paragraphCoherence)}`}>
                          {analysis.structure.paragraphCoherence}/100
                        </span>
                      </div>
                      <Progress value={analysis.structure.paragraphCoherence} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Flow</span>
                        <span className={`font-bold ${getScoreColor(analysis.structure.logicalFlow)}`}>
                          {analysis.structure.logicalFlow}/100
                        </span>
                      </div>
                      <Progress value={analysis.structure.logicalFlow} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Engagement Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall</span>
                        <span className={`font-bold ${getScoreColor(analysis.engagement.score)}`}>
                          {analysis.engagement.score}/100
                        </span>
                      </div>
                      <Progress value={analysis.engagement.score} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Storytelling</span>
                        <span className={`font-bold ${getScoreColor(analysis.engagement.storytellingElements)}`}>
                          {analysis.engagement.storytellingElements}/100
                        </span>
                      </div>
                      <Progress value={analysis.engagement.storytellingElements} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Interactive</span>
                        <span className={`font-bold ${getScoreColor(analysis.engagement.interactiveLanguage)}`}>
                          {analysis.engagement.interactiveLanguage}/100
                        </span>
                      </div>
                      <Progress value={analysis.engagement.interactiveLanguage} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Urgency</span>
                        <span className={`font-bold ${getScoreColor(analysis.engagement.urgencyLevel)}`}>
                          {analysis.engagement.urgencyLevel}/100
                        </span>
                      </div>
                      <Progress value={analysis.engagement.urgencyLevel} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Attention Hooks Detected</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.engagement.attentionHooks.length > 0 ? (
                        analysis.engagement.attentionHooks.map((hook, index) => (
                          <Badge key={index} variant="secondary">
                            {hook}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">No attention hooks detected</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Sentiment & Emotion Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Positive</span>
                        <span className="font-bold text-green-600">
                          {analysis.sentimentProfile.positive}%
                        </span>
                      </div>
                      <Progress value={analysis.sentimentProfile.positive} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Neutral</span>
                        <span className="font-bold text-gray-600">
                          {analysis.sentimentProfile.neutral}%
                        </span>
                      </div>
                      <Progress value={analysis.sentimentProfile.neutral} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Negative</span>
                        <span className="font-bold text-red-600">
                          {analysis.sentimentProfile.negative}%
                        </span>
                      </div>
                      <Progress value={analysis.sentimentProfile.negative} className="h-2" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-3">Emotion Breakdown</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(analysis.sentimentProfile.emotions).map(([emotion, score]) => (
                        <div key={emotion} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="capitalize font-medium">{emotion}</span>
                            <span className="font-semibold">{score}%</span>
                          </div>
                          <Progress value={score} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professionalism" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Professional Communication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Overall</span>
                        <span className={`font-bold ${getScoreColor(analysis.professionalism.score)}`}>
                          {analysis.professionalism.score}/100
                        </span>
                      </div>
                      <Progress value={analysis.professionalism.score} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Formality</span>
                        <span className={`font-bold ${getScoreColor(analysis.professionalism.formalityLevel)}`}>
                          {analysis.professionalism.formalityLevel}/100
                        </span>
                      </div>
                      <Progress value={analysis.professionalism.formalityLevel} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Vocabulary</span>
                        <span className={`font-bold ${getScoreColor(analysis.professionalism.vocabularyLevel)}`}>
                          {analysis.professionalism.vocabularyLevel}/100
                        </span>
                      </div>
                      <Progress value={analysis.professionalism.vocabularyLevel} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Grammar</span>
                        <span className={`font-bold ${getScoreColor(analysis.professionalism.grammarScore)}`}>
                          {analysis.professionalism.grammarScore}/100
                        </span>
                      </div>
                      <Progress value={analysis.professionalism.grammarScore} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Language Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Detected Language:</span>
                          <span className="font-medium">{analysis.language.detectedLanguage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Detection Confidence:</span>
                          <span className="font-medium">{analysis.language.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Lexical Richness</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Unique Words:</span>
                          <span className="font-medium">{analysis.lexicalAnalysis.uniqueWords}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Words:</span>
                          <span className="font-medium">{analysis.lexicalAnalysis.totalWords}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lexical Diversity:</span>
                          <span className="font-medium">{analysis.lexicalAnalysis.lexicalDiversity}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AdvancedContentAnalysis;