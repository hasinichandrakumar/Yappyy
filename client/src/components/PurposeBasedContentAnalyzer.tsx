import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
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
  Sparkles,
  Lightbulb,
  BookOpen,
  Eye,
  Heart,
  Activity,
  Filter
} from 'lucide-react';
import { detectSessionPurpose, PurposeContext } from '@/lib/purposeDetection';

interface PurposeBasedContentAnalyzerProps {
  transcript: string;
  purpose: string;
  sessionData?: any;
  sessionDuration?: number;
}

interface PurposeSpecificMetrics {
  overallScore: number;
  purposeAlignment: number;
  keywordUsage: number;
  structureAdherence: number;
  audienceEngagement: number;
  communicationStyle: number;
  detailedBreakdown: {
    category: string;
    subcategory: string;
    idealWPM: [number, number];
    keyPhrases: string[];
    feedbackFocus: string[];
  };
}

interface PurposeInsights {
  strengths: string[];
  improvements: string[];
  recommendations: Array<{
    category: 'content' | 'delivery' | 'structure' | 'style';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    specificToPurpose: boolean;
  }>;
  keywordAnalysis: {
    found: string[];
    missing: string[];
    suggestions: string[];
  };
}

export default function PurposeBasedContentAnalyzer({ 
  transcript, 
  purpose, 
  sessionData, 
  sessionDuration = 0 
}: PurposeBasedContentAnalyzerProps) {
  const [metrics, setMetrics] = useState<PurposeSpecificMetrics | null>(null);
  const [insights, setInsights] = useState<PurposeInsights | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [purposeContext, setPurposeContext] = useState<PurposeContext | null>(null);

  useEffect(() => {
    if (transcript && purpose) {
      analyzePurposeBasedContent();
    }
  }, [transcript, purpose]);

  const analyzePurposeBasedContent = async () => {
    setIsAnalyzing(true);
    
    try {
      // Detect purpose context
      const context = detectSessionPurpose(purpose);
      setPurposeContext(context);
      
      // Perform purpose-specific analysis
      const analysisMetrics = await performPurposeAnalysis(transcript, context, sessionDuration);
      const analysisInsights = generatePurposeInsights(transcript, context, analysisMetrics);
      
      setMetrics(analysisMetrics);
      setInsights(analysisInsights);
    } catch (error) {
      console.error('Purpose-based analysis failed:', error);
      // Fallback to basic analysis
      const fallbackMetrics = generateFallbackMetrics();
      const fallbackInsights = generateFallbackInsights();
      setMetrics(fallbackMetrics);
      setInsights(fallbackInsights);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performPurposeAnalysis = async (
    text: string, 
    context: PurposeContext, 
    duration: number
  ): Promise<PurposeSpecificMetrics> => {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const wordCount = words.length;
    const wpm = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;

    // Purpose alignment analysis
    const purposeAlignment = analyzePurposeAlignment(text, context);
    
    // Keyword usage analysis
    const keywordUsage = analyzeKeywordUsage(text, context.keyPhrases);
    
    // Structure adherence based on purpose
    const structureAdherence = analyzeStructureAdherence(text, context);
    
    // Audience engagement for specific purpose
    const audienceEngagement = analyzeAudienceEngagement(text, context);
    
    // Communication style appropriateness
    const communicationStyle = analyzeCommunicationStyle(text, context, wpm);
    
    // Calculate overall score
    const overallScore = Math.round(
      (purposeAlignment * 0.25) +
      (keywordUsage * 0.2) +
      (structureAdherence * 0.2) +
      (audienceEngagement * 0.2) +
      (communicationStyle * 0.15)
    );

    return {
      overallScore,
      purposeAlignment,
      keywordUsage,
      structureAdherence,
      audienceEngagement,
      communicationStyle,
      detailedBreakdown: context
    };
  };

  const analyzePurposeAlignment = (text: string, context: PurposeContext): number => {
    const lowerText = text.toLowerCase();
    let alignmentScore = 50; // Base score
    
    // Check for purpose-specific patterns
    switch (context.category) {
      case 'sales':
        if (lowerText.includes('benefit') || lowerText.includes('value')) alignmentScore += 15;
        if (lowerText.includes('solution') || lowerText.includes('problem')) alignmentScore += 15;
        if (lowerText.includes('save') || lowerText.includes('profit')) alignmentScore += 10;
        break;
      case 'interview':
        if (lowerText.includes('example') || lowerText.includes('experience')) alignmentScore += 15;
        if (lowerText.includes('situation') || lowerText.includes('challenge')) alignmentScore += 15;
        if (lowerText.includes('achievement') || lowerText.includes('skills')) alignmentScore += 10;
        break;
      case 'presentation':
        if (lowerText.includes('first') || lowerText.includes('second') || lowerText.includes('finally')) alignmentScore += 15;
        if (lowerText.includes('imagine') || lowerText.includes('consider')) alignmentScore += 10;
        if (lowerText.includes('today') || lowerText.includes('audience')) alignmentScore += 10;
        break;
      case 'leadership':
        if (lowerText.includes('we') || lowerText.includes('our team')) alignmentScore += 15;
        if (lowerText.includes('vision') || lowerText.includes('strategy')) alignmentScore += 15;
        if (lowerText.includes('collaborate') || lowerText.includes('together')) alignmentScore += 10;
        break;
      default:
        // General speaking patterns
        if (lowerText.includes('point') || lowerText.includes('important')) alignmentScore += 10;
        break;
    }
    
    return Math.min(100, Math.max(0, alignmentScore));
  };

  const analyzeKeywordUsage = (text: string, keyPhrases: string[]): number => {
    const lowerText = text.toLowerCase();
    let foundCount = 0;
    
    keyPhrases.forEach(phrase => {
      if (lowerText.includes(phrase.toLowerCase())) {
        foundCount++;
      }
    });
    
    return Math.round((foundCount / keyPhrases.length) * 100);
  };

  const analyzeStructureAdherence = (text: string, context: PurposeContext): number => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    let structureScore = 60; // Base score
    
    // Check for introduction patterns
    const firstSentence = sentences[0]?.toLowerCase() || '';
    if (firstSentence.includes('today') || firstSentence.includes('going to') || 
        firstSentence.includes('discuss') || firstSentence.includes('share')) {
      structureScore += 15;
    }
    
    // Check for conclusion patterns
    const lastSentence = sentences[sentences.length - 1]?.toLowerCase() || '';
    if (lastSentence.includes('conclusion') || lastSentence.includes('summary') || 
        lastSentence.includes('thank you') || lastSentence.includes('questions')) {
      structureScore += 15;
    }
    
    // Purpose-specific structure elements
    switch (context.category) {
      case 'sales':
        if (text.toLowerCase().includes('call to action') || text.toLowerCase().includes('next step')) {
          structureScore += 10;
        }
        break;
      case 'presentation':
        const transitionWords = ['first', 'second', 'next', 'finally', 'however', 'therefore'];
        const hasTransitions = transitionWords.some(word => text.toLowerCase().includes(word));
        if (hasTransitions) structureScore += 10;
        break;
    }
    
    return Math.min(100, Math.max(0, structureScore));
  };

  const analyzeAudienceEngagement = (text: string, context: PurposeContext): number => {
    const lowerText = text.toLowerCase();
    let engagementScore = 50;
    
    // Check for engagement techniques
    if (lowerText.includes('you') || lowerText.includes('your')) engagementScore += 15;
    if (lowerText.includes('imagine') || lowerText.includes('consider')) engagementScore += 10;
    if (lowerText.includes('question') || lowerText.includes('think')) engagementScore += 10;
    
    // Purpose-specific engagement
    switch (context.category) {
      case 'storytelling':
        if (lowerText.includes('felt') || lowerText.includes('moment')) engagementScore += 15;
        break;
      case 'education':
        if (lowerText.includes('example') || lowerText.includes('let me show')) engagementScore += 15;
        break;
      case 'networking':
        if (lowerText.includes('excited') || lowerText.includes('passion')) engagementScore += 15;
        break;
    }
    
    return Math.min(100, Math.max(0, engagementScore));
  };

  const analyzeCommunicationStyle = (text: string, context: PurposeContext, wpm: number): number => {
    let styleScore = 60;
    const [minWPM, maxWPM] = context.idealWPM;
    
    // WPM appropriateness for purpose
    if (wpm >= minWPM && wpm <= maxWPM) {
      styleScore += 20;
    } else if (Math.abs(wmp - ((minWPM + maxWPM) / 2)) <= 10) {
      styleScore += 10;
    }
    
    // Check for filler words (reduce score)
    const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'basically'];
    const fillerCount = fillerWords.reduce((count, filler) => {
      return count + (text.toLowerCase().split(filler).length - 1);
    }, 0);
    
    const wordCount = text.split(/\s+/).length;
    const fillerRatio = wordCount > 0 ? (fillerCount / wordCount) * 100 : 0;
    
    if (fillerRatio < 2) styleScore += 15;
    else if (fillerRatio < 5) styleScore += 5;
    else styleScore -= 10;
    
    return Math.min(100, Math.max(0, styleScore));
  };

  const generatePurposeInsights = (
    text: string, 
    context: PurposeContext, 
    metrics: PurposeSpecificMetrics
  ): PurposeInsights => {
    const lowerText = text.toLowerCase();
    const foundKeywords = context.keyPhrases.filter(phrase => 
      lowerText.includes(phrase.toLowerCase())
    );
    const missingKeywords = context.keyPhrases.filter(phrase => 
      !lowerText.includes(phrase.toLowerCase())
    );

    // Generate strengths
    const strengths: string[] = [];
    if (metrics.purposeAlignment >= 80) {
      strengths.push(`Excellent alignment with ${context.category} communication style`);
    }
    if (metrics.keywordUsage >= 70) {
      strengths.push(`Strong use of purpose-specific vocabulary and phrases`);
    }
    if (metrics.structureAdherence >= 75) {
      strengths.push(`Well-structured content appropriate for ${context.subcategory}`);
    }
    if (metrics.audienceEngagement >= 70) {
      strengths.push(`Effective audience engagement techniques for ${context.category}`);
    }

    // Generate improvements
    const improvements: string[] = [];
    if (metrics.purposeAlignment < 60) {
      improvements.push(`Strengthen alignment with ${context.category} communication patterns`);
    }
    if (metrics.keywordUsage < 50) {
      improvements.push(`Incorporate more ${context.category}-specific terminology`);
    }
    if (metrics.structureAdherence < 60) {
      improvements.push(`Improve content structure for ${context.subcategory} format`);
    }
    if (metrics.audienceEngagement < 60) {
      improvements.push(`Enhance audience engagement strategies for ${context.category}`);
    }

    // Generate recommendations
    const recommendations = generatePurposeRecommendations(context, metrics);

    return {
      strengths,
      improvements,
      recommendations,
      keywordAnalysis: {
        found: foundKeywords,
        missing: missingKeywords,
        suggestions: generateKeywordSuggestions(context, missingKeywords)
      }
    };
  };

  const generatePurposeRecommendations = (
    context: PurposeContext, 
    metrics: PurposeSpecificMetrics
  ) => {
    const recommendations: PurposeInsights['recommendations'] = [];

    // Purpose-specific recommendations
    switch (context.category) {
      case 'sales':
        recommendations.push({
          category: 'content',
          priority: 'high',
          title: 'Emphasize Value Proposition',
          description: 'Include clear statements about benefits, ROI, and customer value',
          specificToPurpose: true
        });
        recommendations.push({
          category: 'structure',
          priority: 'medium',
          title: 'Include Strong Call-to-Action',
          description: 'End with clear next steps for your prospect',
          specificToPurpose: true
        });
        break;
      case 'interview':
        recommendations.push({
          category: 'content',
          priority: 'high',
          title: 'Use STAR Method',
          description: 'Structure answers with Situation, Task, Action, Result format',
          specificToPurpose: true
        });
        recommendations.push({
          category: 'delivery',
          priority: 'medium',
          title: 'Provide Specific Examples',
          description: 'Support claims with concrete, measurable achievements',
          specificToPurpose: true
        });
        break;
      case 'presentation':
        recommendations.push({
          category: 'structure',
          priority: 'high',
          title: 'Use Clear Signposting',
          description: 'Include transition phrases like "first", "next", "finally"',
          specificToPurpose: true
        });
        recommendations.push({
          category: 'delivery',
          priority: 'medium',
          title: 'Engage Audience Directly',
          description: 'Use "imagine", "consider", and direct questions',
          specificToPurpose: true
        });
        break;
      case 'leadership':
        recommendations.push({
          category: 'style',
          priority: 'high',
          title: 'Use Inclusive Language',
          description: 'Emphasize "we", "our team", and collaborative terms',
          specificToPurpose: true
        });
        recommendations.push({
          category: 'content',
          priority: 'medium',
          title: 'Communicate Vision Clearly',
          description: 'Include forward-looking statements and strategic direction',
          specificToPurpose: true
        });
        break;
    }

    // Add general recommendations based on metrics
    if (metrics.communicationStyle < 70) {
      recommendations.push({
        category: 'delivery',
        priority: 'medium',
        title: 'Optimize Speaking Pace',
        description: `Adjust pace to ${context.idealWPM[0]}-${context.idealWPM[1]} WPM for ${context.category}`,
        specificToPurpose: false
      });
    }

    return recommendations;
  };

  const generateKeywordSuggestions = (context: PurposeContext, missing: string[]): string[] => {
    const suggestions: string[] = [];
    
    missing.slice(0, 3).forEach(keyword => {
      switch (context.category) {
        case 'sales':
          suggestions.push(`Incorporate "${keyword}" when discussing customer outcomes`);
          break;
        case 'interview':
          suggestions.push(`Use "${keyword}" to provide concrete evidence`);
          break;
        case 'presentation':
          suggestions.push(`Include "${keyword}" for better structure and flow`);
          break;
        default:
          suggestions.push(`Consider using "${keyword}" to enhance your message`);
      }
    });
    
    return suggestions;
  };

  const generateFallbackMetrics = (): PurposeSpecificMetrics => ({
    overallScore: 65,
    purposeAlignment: 60,
    keywordUsage: 40,
    structureAdherence: 70,
    audienceEngagement: 65,
    communicationStyle: 70,
    detailedBreakdown: {
      category: 'general',
      subcategory: 'public_speaking',
      idealWPM: [130, 160],
      keyPhrases: ['point', 'important', 'understand'],
      feedbackFocus: ['clarity', 'engagement', 'confidence']
    }
  });

  const generateFallbackInsights = (): PurposeInsights => ({
    strengths: ['Clear communication', 'Good content structure'],
    improvements: ['Enhance purpose-specific elements', 'Increase audience engagement'],
    recommendations: [
      {
        category: 'content',
        priority: 'medium',
        title: 'Define Purpose Clearly',
        description: 'Specify your speaking purpose for more targeted analysis',
        specificToPurpose: false
      }
    ],
    keywordAnalysis: {
      found: [],
      missing: [],
      suggestions: ['Define your purpose for specific keyword recommendations']
    }
  });

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

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-600">Analyzing content for your specific purpose...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics || !insights || !purposeContext) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No purpose-based analysis available</p>
            <p className="text-sm mt-2">Specify your session purpose for targeted insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Purpose Context Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Purpose-Based Content Analysis
          </CardTitle>
          <CardDescription>
            Analysis optimized for <strong>{purposeContext.category}</strong> communication 
            ({purposeContext.subcategory})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                {metrics.overallScore}%
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">
                {purposeContext.idealWPM[0]}-{purposeContext.idealWPM[1]} WPM
              </div>
              <div className="text-sm text-gray-600">Ideal Pace</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-indigo-600">
                {purposeContext.keyPhrases.length} phrases
              </div>
              <div className="text-sm text-gray-600">Key Elements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Purpose-Specific Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${getScoreBgColor(metrics.purposeAlignment)}`}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">Purpose Alignment</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(metrics.purposeAlignment)}`}>
                {metrics.purposeAlignment}%
              </div>
              <Progress value={metrics.purposeAlignment} className="mt-2" />
            </div>

            <div className={`p-4 rounded-lg border ${getScoreBgColor(metrics.keywordUsage)}`}>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4" />
                <span className="text-sm font-medium">Keyword Usage</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(metrics.keywordUsage)}`}>
                {metrics.keywordUsage}%
              </div>
              <Progress value={metrics.keywordUsage} className="mt-2" />
            </div>

            <div className={`p-4 rounded-lg border ${getScoreBgColor(metrics.structureAdherence)}`}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Structure</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(metrics.structureAdherence)}`}>
                {metrics.structureAdherence}%
              </div>
              <Progress value={metrics.structureAdherence} className="mt-2" />
            </div>

            <div className={`p-4 rounded-lg border ${getScoreBgColor(metrics.audienceEngagement)}`}>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Engagement</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(metrics.audienceEngagement)}`}>
                {metrics.audienceEngagement}%
              </div>
              <Progress value={metrics.audienceEngagement} className="mt-2" />
            </div>

            <div className={`p-4 rounded-lg border ${getScoreBgColor(metrics.communicationStyle)}`}>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Style</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(metrics.communicationStyle)}`}>
                {metrics.communicationStyle}%
              </div>
              <Progress value={metrics.communicationStyle} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="focus">Focus Areas</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="h-5 w-5" />
                  Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-orange-800">{improvement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Found Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {insights.keywordAnalysis.found.map((keyword, index) => (
                    <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                      {keyword}
                    </Badge>
                  ))}
                  {insights.keywordAnalysis.found.length === 0 && (
                    <p className="text-gray-500 text-sm">No purpose-specific keywords found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Missing Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {insights.keywordAnalysis.missing.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="border-orange-300 text-orange-700">
                      {keyword}
                    </Badge>
                  ))}
                  {insights.keywordAnalysis.missing.length === 0 && (
                    <p className="text-gray-500 text-sm">All key phrases are being used!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Keyword Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {insights.keywordAnalysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-blue-800">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {insights.recommendations.map((rec, index) => (
              <Card key={index} className={rec.specificToPurpose ? 'border-purple-200 bg-purple-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority} priority
                      </Badge>
                      <Badge variant="outline">
                        {rec.category}
                      </Badge>
                      {rec.specificToPurpose && (
                        <Badge className="bg-purple-100 text-purple-800">
                          {purposeContext.category}-specific
                        </Badge>
                      )}
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{rec.title}</h4>
                  <p className="text-sm text-gray-700">{rec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="focus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Focus Areas for {purposeContext.category} Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {purposeContext.feedbackFocus.map((focus, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-purple-600" />
                      <span className="font-medium capitalize">{focus.replace('_', ' ')}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Key focus area for effective {purposeContext.category} communication
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
