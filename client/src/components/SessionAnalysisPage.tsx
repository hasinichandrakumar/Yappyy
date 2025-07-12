import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  Mic, 
  Eye, 
  MessageSquare, 
  Clock, 
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  Download,
  Share2,
  ArrowLeft,
  Star,
  BarChart3,
  Lightbulb
} from 'lucide-react';

interface SessionData {
  sessionName: string;
  purpose: string;
  duration: number;
  transcript: string;
  overallPerformance: number;
  clarityScore: number;
  volumeConsistency: number;
  intonationScore: number;
  paceConsistency: number;
  engagementLevel: number;
  eyeContactScore: number;
  confidenceLevel: number;
  fillerWordCount: number;
  wordsPerMinute: number;
  createdAt: string;
}

interface SessionAnalysisPageProps {
  sessionData: SessionData;
  onClose: () => void;
  onNewSession: () => void;
}

export default function SessionAnalysisPage({ sessionData, onClose, onNewSession }: SessionAnalysisPageProps) {
  const [fillerAnalysis, setFillerAnalysis] = useState<any>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(true);
  const [aiInsights, setAIInsights] = useState<string>('');

  useEffect(() => {
    analyzeSession();
  }, [sessionData]);

  const analyzeSession = async () => {
    try {
      // Analyze filler words
      const fillerResponse = await fetch('/api/analyze-filler-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: sessionData.transcript,
          duration: sessionData.duration
        })
      });
      
      if (fillerResponse.ok) {
        const fillerData = await fillerResponse.json();
        setFillerAnalysis(fillerData);
      }

      // Generate AI insights
      await generateAIInsights();
    } catch (error) {
      console.error('Error analyzing session:', error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const generateAIInsights = async () => {
    try {
      const response = await fetch('/api/generate-session-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionData,
          fillerCount: sessionData.fillerWordCount,
          duration: sessionData.duration,
          wpm: sessionData.wordsPerMinute
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAIInsights(data.insights);
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setAIInsights('Unable to generate insights at this time.');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceInsights = () => {
    const insights = [];
    
    if (sessionData.confidenceLevel >= 80) {
      insights.push({ type: 'success', message: 'Excellent confidence level - you spoke with authority' });
    } else if (sessionData.confidenceLevel < 60) {
      insights.push({ type: 'warning', message: 'Work on projecting more confidence through posture and voice' });
    }

    if (sessionData.wordsPerMinute < 120) {
      insights.push({ type: 'info', message: 'Consider speaking slightly faster to maintain audience engagement' });
    } else if (sessionData.wordsPerMinute > 180) {
      insights.push({ type: 'warning', message: 'Slow down a bit to ensure clarity and comprehension' });
    } else {
      insights.push({ type: 'success', message: 'Perfect speaking pace for clear communication' });
    }

    if (fillerAnalysis?.totalFillers > 10) {
      insights.push({ type: 'warning', message: `Reduce filler words (${fillerAnalysis.totalFillers} detected) by practicing strategic pauses` });
    } else {
      insights.push({ type: 'success', message: 'Great job minimizing filler words!' });
    }

    return insights;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold text-blue-600 mb-2">
                  Session Analysis
                </CardTitle>
                <p className="text-lg text-gray-600">{sessionData.sessionName}</p>
                <p className="text-sm text-gray-500">{sessionData.purpose}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Practice
                </Button>
                <Button onClick={onNewSession} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  New Session
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Overall Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`border-2 ${getScoreBg(sessionData.overallPerformance)}`}>
            <CardContent className="p-4 text-center">
              <Star className={`w-8 h-8 mx-auto mb-2 ${getScoreColor(sessionData.overallPerformance)}`} />
              <div className={`text-2xl font-bold ${getScoreColor(sessionData.overallPerformance)}`}>
                {sessionData.overallPerformance}%
              </div>
              <div className="text-sm text-gray-600">Overall Performance</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{formatDuration(sessionData.duration)}</div>
              <div className="text-sm text-gray-600">Session Duration</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Mic className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{sessionData.wordsPerMinute}</div>
              <div className="text-sm text-gray-600">Words Per Minute</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold text-red-600">{sessionData.fillerWordCount}</div>
              <div className="text-sm text-gray-600">Filler Words</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Performance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Confidence Level</span>
                    <span className={getScoreColor(sessionData.confidenceLevel)}>{sessionData.confidenceLevel}%</span>
                  </div>
                  <Progress value={sessionData.confidenceLevel} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Eye Contact</span>
                    <span className={getScoreColor(sessionData.eyeContactScore)}>{sessionData.eyeContactScore}%</span>
                  </div>
                  <Progress value={sessionData.eyeContactScore} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Clarity & Articulation</span>
                    <span className={getScoreColor(sessionData.clarityScore)}>{sessionData.clarityScore}%</span>
                  </div>
                  <Progress value={sessionData.clarityScore} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Engagement Level</span>
                    <span className={getScoreColor(sessionData.engagementLevel)}>{sessionData.engagementLevel}%</span>
                  </div>
                  <Progress value={sessionData.engagementLevel} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Voice Consistency</span>
                    <span className={getScoreColor(sessionData.volumeConsistency)}>{sessionData.volumeConsistency}%</span>
                  </div>
                  <Progress value={sessionData.volumeConsistency} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isGeneratingInsights ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your performance...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getPerformanceInsights().map((insight, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border-l-4 ${
                        insight.type === 'success' 
                          ? 'bg-green-50 border-green-400 text-green-800' 
                          : insight.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                          : 'bg-blue-50 border-blue-400 text-blue-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {insight.type === 'success' && <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                        {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                        {insight.type === 'info' && <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                        <p className="text-sm">{insight.message}</p>
                      </div>
                    </div>
                  ))}
                  
                  {aiInsights && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Personalized Coaching</h4>
                      <p className="text-sm text-purple-700">{aiInsights}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filler Word Analysis */}
        {fillerAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Filler Word Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{fillerAnalysis.totalFillers}</div>
                  <div className="text-sm text-gray-600">Total Fillers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{fillerAnalysis.fillerPercentage?.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Filler Percentage</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Badge variant={fillerAnalysis.severity === 'excellent' ? 'default' : 'destructive'}>
                    {fillerAnalysis.severity}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">Severity</div>
                </div>
              </div>
              
              {fillerAnalysis.detectedFillers?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Most Common Fillers:</h4>
                  <div className="flex flex-wrap gap-2">
                    {fillerAnalysis.detectedFillers.slice(0, 8).map((filler: any, index: number) => (
                      <Badge key={index} variant="secondary">
                        {filler.word} ({filler.count}x)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Results
              </Button>
              <Button onClick={onNewSession} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                <Target className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}