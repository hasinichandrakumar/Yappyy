import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, Lightbulb, Calendar, Award, ChevronRight, MessageSquare, BarChart3, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';

interface CoachingInsight {
  category: 'purpose_alignment' | 'skill_development' | 'behavioral_patterns' | 'progress_tracking';
  title: string;
  description: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  sessionsAnalyzed: number;
}

interface ProgressTrend {
  skill: string;
  trend: 'improving' | 'declining' | 'stable';
  change: number;
  sessions: number;
  recommendation: string;
}

interface SessionComparison {
  sessionId: string;
  sessionName: string;
  date: string;
  purposeAlignment: number;
  keyMetrics: {
    clarity: number;
    pace: number;
    engagement: number;
  };
  primaryFocus: string;
}

export default function ComprehensiveAICoach() {
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [coachingInsights, setCoachingInsights] = useState<CoachingInsight[]>([]);
  const [progressTrends, setProgressTrends] = useState<ProgressTrend[]>([]);
  const [sessionComparisons, setSessionComparisons] = useState<SessionComparison[]>([]);

  // Mock data - replace with OpenAI API integration
  const mockInsights: CoachingInsight[] = [
    {
      category: 'purpose_alignment',
      title: 'Interview Preparation Excellence',
      description: 'Your recent job interview practice sessions show exceptional improvement in structure and confidence. Your STAR method implementation has become more natural and your responses are increasingly polished.',
      recommendation: 'Focus on developing your storytelling for behavioral questions. Practice with increasingly complex scenarios to maintain your momentum. Consider recording mock interviews with different question types.',
      priority: 'high',
      sessionsAnalyzed: 5
    },
    {
      category: 'skill_development',
      title: 'Voice Modulation Mastery',
      description: 'Analysis across your sessions reveals significant progress in voice variety and tonal control. Your pace has stabilized at an optimal range, and you\'re effectively using pauses for emphasis.',
      recommendation: 'Continue practicing with different emotional contexts. Work on projecting authority when presenting data or making recommendations. Try practicing with background noise to strengthen your projection.',
      priority: 'medium',
      sessionsAnalyzed: 8
    },
    {
      category: 'behavioral_patterns',
      title: 'Filler Word Reduction Success',
      description: 'Your conscious effort to reduce filler words is paying off. From an average of 12 filler words per session, you\'re now down to 4-5. This improvement shows in your increased fluency and professional presence.',
      recommendation: 'Maintain awareness during transitions between topics - this is where most remaining filler words occur. Practice bridging phrases to move smoothly between ideas.',
      priority: 'low',
      sessionsAnalyzed: 6
    },
    {
      category: 'progress_tracking',
      title: 'Confidence Building Trajectory',
      description: 'Your body language analysis shows remarkable improvement in confidence indicators: better posture, sustained eye contact, and purposeful gestures. Your sessions demonstrate increasing comfort with the camera.',
      recommendation: 'You\'re ready for more challenging scenarios. Consider practicing with virtual audiences or adding time pressure to simulate real-world conditions.',
      priority: 'high',
      sessionsAnalyzed: 7
    }
  ];

  const mockProgressTrends: ProgressTrend[] = [
    {
      skill: 'Voice Clarity',
      trend: 'improving',
      change: +12,
      sessions: 6,
      recommendation: 'Continue current vocal warm-up routine'
    },
    {
      skill: 'Body Language',
      trend: 'improving',
      change: +18,
      sessions: 7,
      recommendation: 'Practice with more dynamic gestures'
    },
    {
      skill: 'Content Structure',
      trend: 'stable',
      change: +2,
      sessions: 5,
      recommendation: 'Focus on stronger opening hooks'
    },
    {
      skill: 'Pace Control',
      trend: 'improving',
      change: +8,
      sessions: 4,
      recommendation: 'Maintain current practice schedule'
    }
  ];

  const mockSessionComparisons: SessionComparison[] = [
    {
      sessionId: '1',
      sessionName: 'Job Interview Practice',
      date: '2024-01-15',
      purposeAlignment: 87,
      keyMetrics: { clarity: 82, pace: 78, engagement: 85 },
      primaryFocus: 'Behavioral Questions'
    },
    {
      sessionId: '2',
      sessionName: 'Presentation Practice',
      date: '2024-01-14',
      purposeAlignment: 74,
      keyMetrics: { clarity: 76, pace: 65, engagement: 80 },
      primaryFocus: 'Storytelling'
    },
    {
      sessionId: '3',
      sessionName: 'Pitch Practice',
      date: '2024-01-12',
      purposeAlignment: 91,
      keyMetrics: { clarity: 88, pace: 82, engagement: 89 },
      primaryFocus: 'Persuasion'
    }
  ];

  useEffect(() => {
    setCoachingInsights(mockInsights);
    setProgressTrends(mockProgressTrends);
    setSessionComparisons(mockSessionComparisons);
  }, []);

  // Fetch practice sessions for the session selector
  const { data: sessions = [] } = useQuery({
    queryKey: ['/api/practice-sessions'],
  });

  // Type guard for sessions
  const typedSessions = Array.isArray(sessions) ? sessions : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const generateComprehensiveAnalysis = async (sessionId: string) => {
    // This would call OpenAI API for comprehensive analysis
    const session = mockSessionComparisons.find(s => s.sessionId === sessionId);
    if (!session) return;

    // OpenAI analysis would go here
    console.log('Generating comprehensive analysis for session:', sessionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2563eb] to-[#22d3ee] bg-clip-text text-transparent">
              AI Speech Coach
            </h1>
            <p className="text-slate-600 mt-2">Comprehensive analysis and personalized coaching based on your practice sessions</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-slate-200">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  {typedSessions.map((session: any) => (
                    <SelectItem key={session.id} value={session.id.toString()}>
                      {session.name || `Session ${session.id}`} - {formatDate(session.createdAt)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="insights">Coaching Insights</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="comparison">Session Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {coachingInsights.map((insight, index) => (
            <Card key={index} className={`border-l-4 bg-white/60 backdrop-blur-sm ${
              insight.priority === 'high' ? 'border-l-red-400' :
              insight.priority === 'medium' ? 'border-l-yellow-400' :
              'border-l-green-400'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      insight.priority === 'high' ? 'destructive' :
                      insight.priority === 'medium' ? 'default' :
                      'secondary'
                    }>
                      {insight.priority} priority
                    </Badge>
                    <Badge variant="outline">
                      {insight.sessionsAnalyzed} sessions
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{insight.description}</p>
                <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 p-4 rounded-lg border-l-4 border-blue-400 backdrop-blur-sm">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-900">Recommendation</h5>
                      <p className="text-blue-800 mt-1">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progressTrends.map((trend, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{trend.skill}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className={`w-4 h-4 ${
                        trend.trend === 'improving' ? 'text-green-600' :
                        trend.trend === 'declining' ? 'text-red-600' :
                        'text-gray-600'
                      }`} />
                      <span className={`font-medium ${
                        trend.trend === 'improving' ? 'text-green-600' :
                        trend.trend === 'declining' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {trend.change > 0 ? '+' : ''}{trend.change}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Based on {trend.sessions} sessions</span>
                      <Badge variant="outline" className={
                        trend.trend === 'improving' ? 'border-green-200 text-green-700' :
                        trend.trend === 'declining' ? 'border-red-200 text-red-700' :
                        'border-gray-200 text-gray-700'
                      }>
                        {trend.trend}
                      </Badge>
                    </div>
                    <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 p-3 rounded backdrop-blur-sm">
                      <p className="text-sm text-gray-700">{trend.recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="space-y-4">
            {mockSessionComparisons.map((session) => (
              <Card key={session.sessionId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{session.sessionName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                        <Badge variant="outline">{session.primaryFocus}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {session.purposeAlignment}%
                      </div>
                      <div className="text-sm text-gray-600">Purpose Aligned</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Clarity</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={session.keyMetrics.clarity} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{session.keyMetrics.clarity}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Pace</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={session.keyMetrics.pace} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{session.keyMetrics.pace}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Engagement</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={session.keyMetrics.engagement} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{session.keyMetrics.engagement}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* No Sessions State */}
      {mockSessionComparisons.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start a session to get AI coaching</h3>
          <p className="text-gray-600 mb-4">
            Complete your first practice session to receive personalized insights and recommendations
          </p>
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Practice Session
          </Button>
        </div>
      )}
    </div>
  );
}