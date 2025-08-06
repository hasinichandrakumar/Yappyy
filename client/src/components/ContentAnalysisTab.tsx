import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Target, 
  Lightbulb, 
  BookOpen, 
  TrendingUp, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Brain,
  Award,
  Users,
  Clock,
  BarChart3,
  Quote,
  Hash,
  Sparkles
} from 'lucide-react';

interface ContentAnalysisTabProps {
  transcript: string;
  purpose: string;
  sessionData?: any;
}

interface ContentAnalysis {
  purposeAlignment: number;
  contentStructure: {
    introduction: number;
    body: number;
    conclusion: number;
    overall: number;
  };
  vocabularyAnalysis: {
    complexity: number;
    appropriateness: number;
    variety: number;
    technicalTerms: number;
  };
  rhetoricalDevices: {
    count: number;
    effectiveness: number;
    types: string[];
  };
  audienceEngagement: {
    clarity: number;
    relevance: number;
    impact: number;
  };
  recommendations: {
    structure: string[];
    vocabulary: string[];
    delivery: string[];
    content: string[];
  };
  vocabularySuggestions: {
    advanced: string[];
    alternatives: string[];
    industrySpecific: string[];
  };
  keyMetrics: {
    wordCount: number;
    sentenceCount: number;
    averageSentenceLength: number;
    uniqueWords: number;
    vocabularyDiversity: number;
  };
}

export default function ContentAnalysisTab({ transcript, purpose, sessionData }: ContentAnalysisTabProps) {
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (transcript && purpose) {
      analyzeContent();
    }
  }, [transcript, purpose]);

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          purpose,
          sessionData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysis(result);
      } else {
        // Fallback to local analysis if API fails
        const localAnalysis = performLocalAnalysis();
        setAnalysis(localAnalysis);
      }
    } catch (error) {
      console.error('Content analysis failed:', error);
      const localAnalysis = performLocalAnalysis();
      setAnalysis(localAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performLocalAnalysis = (): ContentAnalysis => {
    const words = transcript.split(/\s+/).filter(word => word.length > 0);
    const sentences = transcript.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const uniqueWords = new Set(words.map(word => word.toLowerCase().replace(/[^\w]/g, '')));
    
    // Calculate basic metrics
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const averageSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const vocabularyDiversity = wordCount > 0 ? (uniqueWords.size / wordCount) * 100 : 0;

    // Analyze purpose alignment based on keywords
    const purposeKeywords = getPurposeKeywords(purpose);
    const purposeAlignment = calculatePurposeAlignment(transcript, purposeKeywords);

    // Analyze content structure
    const structureAnalysis = analyzeStructure(transcript, sentences);

    // Analyze vocabulary
    const vocabularyAnalysis = analyzeVocabulary(words, purpose);

    // Generate recommendations
    const recommendations = generateRecommendations(transcript, purpose, structureAnalysis, vocabularyAnalysis);

    return {
      purposeAlignment,
      contentStructure: structureAnalysis,
      vocabularyAnalysis,
      rhetoricalDevices: {
        count: 0,
        effectiveness: 0,
        types: []
      },
      audienceEngagement: {
        clarity: Math.min(100, Math.max(0, vocabularyAnalysis.clarity)),
        relevance: purposeAlignment,
        impact: Math.min(100, Math.max(0, (purposeAlignment + vocabularyAnalysis.appropriateness) / 2))
      },
      recommendations,
      vocabularySuggestions: generateVocabularySuggestions(purpose, words),
      keyMetrics: {
        wordCount,
        sentenceCount,
        averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
        uniqueWords: uniqueWords.size,
        vocabularyDiversity: Math.round(vocabularyDiversity)
      }
    };
  };

  const getPurposeKeywords = (purpose: string): string[] => {
    const purposeMap: { [key: string]: string[] } = {
      'business': ['strategy', 'growth', 'revenue', 'market', 'customer', 'product', 'service', 'team', 'leadership'],
      'sales': ['customer', 'benefit', 'value', 'solution', 'problem', 'need', 'offer', 'deal', 'close', 'pitch'],
      'presentation': ['inform', 'educate', 'explain', 'demonstrate', 'show', 'present', 'share', 'discuss'],
      'persuasion': ['convince', 'persuade', 'influence', 'change', 'believe', 'agree', 'support', 'action'],
      'storytelling': ['story', 'narrative', 'experience', 'journey', 'character', 'plot', 'emotion', 'connection'],
      'training': ['learn', 'teach', 'skill', 'knowledge', 'practice', 'improve', 'develop', 'master'],
      'motivation': ['inspire', 'motivate', 'encourage', 'energize', 'passion', 'drive', 'success', 'achievement']
    };

    const lowerPurpose = purpose.toLowerCase();
    for (const [key, keywords] of Object.entries(purposeMap)) {
      if (lowerPurpose.includes(key)) {
        return keywords;
      }
    }
    return ['effective', 'clear', 'engaging', 'professional'];
  };

  const calculatePurposeAlignment = (transcript: string, keywords: string[]): number => {
    const lowerTranscript = transcript.toLowerCase();
    let matches = 0;
    
    keywords.forEach(keyword => {
      if (lowerTranscript.includes(keyword)) {
        matches++;
      }
    });

    return Math.min(100, Math.max(0, (matches / keywords.length) * 100));
  };

  const analyzeStructure = (transcript: string, sentences: string[]): any => {
    // Simple structure analysis
    const totalSentences = sentences.length;
    const introSentences = Math.max(1, Math.floor(totalSentences * 0.15));
    const conclusionSentences = Math.max(1, Math.floor(totalSentences * 0.15));
    const bodySentences = totalSentences - introSentences - conclusionSentences;

    return {
      introduction: Math.min(100, Math.max(0, (introSentences / Math.max(1, Math.floor(totalSentences * 0.15))) * 100)),
      body: Math.min(100, Math.max(0, (bodySentences / Math.max(1, Math.floor(totalSentences * 0.7))) * 100)),
      conclusion: Math.min(100, Math.max(0, (conclusionSentences / Math.max(1, Math.floor(totalSentences * 0.15))) * 100)),
      overall: Math.min(100, Math.max(0, ((introSentences + bodySentences + conclusionSentences) / totalSentences) * 100))
    };
  };

  const analyzeVocabulary = (words: string[], purpose: string): any => {
    const uniqueWords = new Set(words.map(word => word.toLowerCase().replace(/[^\w]/g, '')));
    const complexity = Math.min(100, Math.max(0, (uniqueWords.size / words.length) * 200));
    const variety = Math.min(100, Math.max(0, (uniqueWords.size / words.length) * 150));
    
    // Count technical/sophisticated words
    const sophisticatedWords = words.filter(word => 
      word.length > 8 || 
      /[A-Z]/.test(word) || 
      ['therefore', 'however', 'furthermore', 'consequently', 'nevertheless'].includes(word.toLowerCase())
    );
    const technicalTerms = Math.min(100, Math.max(0, (sophisticatedWords.length / words.length) * 100));

    return {
      complexity: Math.round(complexity),
      appropriateness: 75, // Placeholder
      variety: Math.round(variety),
      technicalTerms: Math.round(technicalTerms)
    };
  };

  const generateRecommendations = (transcript: string, purpose: string, structure: any, vocabulary: any): any => {
    const recommendations = {
      structure: [] as string[],
      vocabulary: [] as string[],
      delivery: [] as string[],
      content: [] as string[]
    };

    // Structure recommendations
    if (structure.introduction < 70) {
      recommendations.structure.push("Strengthen your introduction with a clear hook and purpose statement");
    }
    if (structure.body < 70) {
      recommendations.structure.push("Expand the main content with more detailed points and examples");
    }
    if (structure.conclusion < 70) {
      recommendations.structure.push("Add a stronger conclusion that summarizes key points and calls to action");
    }

    // Vocabulary recommendations
    if (vocabulary.complexity < 50) {
      recommendations.vocabulary.push("Consider using more sophisticated vocabulary to enhance credibility");
    }
    if (vocabulary.variety < 60) {
      recommendations.vocabulary.push("Increase vocabulary variety to maintain audience engagement");
    }
    if (vocabulary.technicalTerms < 30) {
      recommendations.vocabulary.push("Incorporate industry-specific terminology for professional impact");
    }

    // Content recommendations based on purpose
    if (purpose.toLowerCase().includes('business')) {
      recommendations.content.push("Include specific metrics and data points to support your business case");
      recommendations.content.push("Address potential objections and provide solutions");
    }
    if (purpose.toLowerCase().includes('sales')) {
      recommendations.content.push("Emphasize customer benefits and value proposition");
      recommendations.content.push("Include clear call-to-action statements");
    }
    if (purpose.toLowerCase().includes('presentation')) {
      recommendations.content.push("Add visual cues and transition phrases for better flow");
      recommendations.content.push("Include examples and anecdotes to illustrate key points");
    }

    return recommendations;
  };

  const generateVocabularySuggestions = (purpose: string, words: string[]): any => {
    const suggestions = {
      advanced: [] as string[],
      alternatives: [] as string[],
      industrySpecific: [] as string[]
    };

    // Generate suggestions based on purpose
    if (purpose.toLowerCase().includes('business')) {
      suggestions.advanced.push('strategic', 'optimization', 'leverage', 'synergy', 'paradigm');
      suggestions.industrySpecific.push('ROI', 'KPI', 'stakeholder', 'scalability', 'disruption');
    }
    if (purpose.toLowerCase().includes('sales')) {
      suggestions.advanced.push('compelling', 'compelling', 'transformative', 'innovative', 'premium');
      suggestions.industrySpecific.push('conversion', 'pipeline', 'prospect', 'qualification', 'closing');
    }
    if (purpose.toLowerCase().includes('presentation')) {
      suggestions.advanced.push('comprehensive', 'systematic', 'methodical', 'analytical', 'strategic');
      suggestions.alternatives.push('excellent → outstanding', 'good → exceptional', 'important → crucial');
    }

    return suggestions;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Analyzing content...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No content analysis available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Content Analysis Overview
          </CardTitle>
          <CardDescription>
            Analysis of your transcript based on your purpose: <strong>{purpose}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg border ${getScoreBgColor(analysis.purposeAlignment)}`}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">Purpose Alignment</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(analysis.purposeAlignment)}`}>
                {analysis.purposeAlignment}%
              </div>
              <Progress value={analysis.purposeAlignment} className="mt-2" />
            </div>

            <div className={`p-4 rounded-lg border ${getScoreBgColor(analysis.contentStructure.overall)}`}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm font-medium">Content Structure</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(analysis.contentStructure.overall)}`}>
                {analysis.contentStructure.overall}%
              </div>
              <Progress value={analysis.contentStructure.overall} className="mt-2" />
            </div>

            <div className={`p-4 rounded-lg border ${getScoreBgColor(analysis.audienceEngagement.impact)}`}>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Audience Impact</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(analysis.audienceEngagement.impact)}`}>
                {analysis.audienceEngagement.impact}%
              </div>
              <Progress value={analysis.audienceEngagement.impact} className="mt-2" />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analysis.keyMetrics.wordCount}</div>
              <div className="text-xs text-gray-600">Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analysis.keyMetrics.sentenceCount}</div>
              <div className="text-xs text-gray-600">Sentences</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analysis.keyMetrics.averageSentenceLength}</div>
              <div className="text-xs text-gray-600">Avg. Length</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analysis.keyMetrics.uniqueWords}</div>
              <div className="text-xs text-gray-600">Unique Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{analysis.keyMetrics.vocabularyDiversity}%</div>
              <div className="text-xs text-gray-600">Diversity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Content Structure Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Introduction</span>
                    <span className={getScoreColor(analysis.contentStructure.introduction)}>
                      {analysis.contentStructure.introduction}%
                    </span>
                  </div>
                  <Progress value={analysis.contentStructure.introduction} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Body Content</span>
                    <span className={getScoreColor(analysis.contentStructure.body)}>
                      {analysis.contentStructure.body}%
                    </span>
                  </div>
                  <Progress value={analysis.contentStructure.body} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Conclusion</span>
                    <span className={getScoreColor(analysis.contentStructure.conclusion)}>
                      {analysis.contentStructure.conclusion}%
                    </span>
                  </div>
                  <Progress value={analysis.contentStructure.conclusion} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vocabulary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Vocabulary Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Complexity</span>
                    <span className={getScoreColor(analysis.vocabularyAnalysis.complexity)}>
                      {analysis.vocabularyAnalysis.complexity}%
                    </span>
                  </div>
                  <Progress value={analysis.vocabularyAnalysis.complexity} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Variety</span>
                    <span className={getScoreColor(analysis.vocabularyAnalysis.variety)}>
                      {analysis.vocabularyAnalysis.variety}%
                    </span>
                  </div>
                  <Progress value={analysis.vocabularyAnalysis.variety} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Technical Terms</span>
                    <span className={getScoreColor(analysis.vocabularyAnalysis.technicalTerms)}>
                      {analysis.vocabularyAnalysis.technicalTerms}%
                    </span>
                  </div>
                  <Progress value={analysis.vocabularyAnalysis.technicalTerms} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Appropriateness</span>
                    <span className={getScoreColor(analysis.vocabularyAnalysis.appropriateness)}>
                      {analysis.vocabularyAnalysis.appropriateness}%
                    </span>
                  </div>
                  <Progress value={analysis.vocabularyAnalysis.appropriateness} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Structure Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.structure.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Vocabulary Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.vocabulary.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Content Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.content.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Delivery Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.delivery.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Advanced Vocabulary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.vocabularySuggestions.advanced.map((word, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {word}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Industry Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.vocabularySuggestions.industrySpecific.map((term, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {term}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Word Alternatives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {analysis.vocabularySuggestions.alternatives.map((alt, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      {alt}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}