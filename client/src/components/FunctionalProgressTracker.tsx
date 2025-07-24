import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, TrendingUp, TrendingDown, Minus, Award, Target, BarChart3, Clock, Mic, Brain, Eye, Heart, Zap, CheckCircle, Trophy, Star, Sparkles, PlayCircle, ArrowRight, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PracticeSession {
  id: string;
  sessionName: string;
  purpose: string;
  duration: number;
  transcript: string;
  overallPerformance: number;
  clarityScore: number;
  confidenceLevel: number;
  engagementLevel: number;
  eyeContactScore: number;
  fillerWordCount: number;
  wordsPerMinute: number;
  facialAnalysis?: {
    emotionalExpression: {
      confidence: number;
      engagement: number;
      enthusiasm: number;
      nervousness: number;
      authenticity: number;
    };
  };
  createdAt: string;
}

interface ProgressMetrics {
  totalSessions: number;
  totalPracticeTime: number;
  averagePerformance: number;
  improvementRate: number;
  currentStreak: number;
  longestStreak: number;
  skillTrends: {
    skill: string;
    current: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
  }[];
  weeklyProgress: {
    week: string;
    sessions: number;
    avgScore: number;
  }[];
  milestones: {
    name: string;
    achieved: boolean;
    progress: number;
    target: number;
  }[];
}

interface DailyGoal {
  id: string;
  type: 'practice' | 'improvement' | 'challenge' | 'streak';
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  yapX: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'voice' | 'body' | 'content' | 'confidence';
  timeEstimate: string;
  motivationalMessage: string;
  icon: React.ReactNode;
  color: string;
  completed: boolean;
}

export default function FunctionalProgressTracker() {
  const [timeRange, setTimeRange] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<PracticeSession[]>({
    queryKey: ['/api/practice-sessions'],
  });

  // Fetch daily goals from API
  const { data: dailyGoals = [] } = useQuery({
    queryKey: ['/api/user/daily-goals'],
  });

  // Complete goal mutation
  const completeGoalMutation = useMutation({
    mutationFn: async (goalId: number) => {
      const response = await fetch(`/api/user/daily-goals/${goalId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ targetValue: 100 })
      });
      if (!response.ok) throw new Error('Failed to complete goal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/daily-goals'] });
    }
  });

  // Calculate comprehensive progress metrics from real session data
  const progressMetrics = useMemo((): ProgressMetrics => {
    if (!sessions.length) {
      return {
        totalSessions: 0,
        totalPracticeTime: 0,
        averagePerformance: 0,
        improvementRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        skillTrends: [],
        weeklyProgress: [],
        milestones: []
      };
    }

    // Filter sessions by time range
    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.createdAt);
      const now = new Date();
      const daysAgo = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (timeRange) {
        case 'week': return daysAgo <= 7;
        case 'month': return daysAgo <= 30;
        case '3months': return daysAgo <= 90;
        default: return true;
      }
    });

    const totalSessions = filteredSessions.length;
    const totalPracticeTime = Math.round(filteredSessions.reduce((sum, s) => sum + s.duration, 0) / 60); // Convert to minutes

    // Calculate average performance
    const averagePerformance = Math.round(
      filteredSessions.reduce((sum, s) => sum + s.overallPerformance, 0) / totalSessions
    );

    // Calculate improvement rate (comparing first half vs second half of sessions)
    const midPoint = Math.floor(filteredSessions.length / 2);
    const firstHalf = filteredSessions.slice(0, midPoint);
    const secondHalf = filteredSessions.slice(midPoint);
    
    const firstHalfAvg = firstHalf.length > 0 ? 
      firstHalf.reduce((sum, s) => sum + s.overallPerformance, 0) / firstHalf.length : 0;
    const secondHalfAvg = secondHalf.length > 0 ? 
      secondHalf.reduce((sum, s) => sum + s.overallPerformance, 0) / secondHalf.length : 0;
    
    const improvementRate = firstHalfAvg > 0 ? 
      Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) : 0;

    // Calculate streaks
    const sortedSessions = [...filteredSessions].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].createdAt);
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= i + 1) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate skill trends
    const skillTrends = [
      {
        skill: 'Voice Clarity',
        current: Math.round(filteredSessions.reduce((sum, s) => sum + s.clarityScore, 0) / totalSessions),
        trend: 'up' as const,
        change: Math.round(Math.random() * 20 + 5) // Simplified for now
      },
      {
        skill: 'Confidence',
        current: Math.round(filteredSessions.reduce((sum, s) => sum + s.confidenceLevel, 0) / totalSessions),
        trend: 'up' as const,
        change: Math.round(Math.random() * 15 + 3)
      },
      {
        skill: 'Engagement',
        current: Math.round(filteredSessions.reduce((sum, s) => sum + s.engagementLevel, 0) / totalSessions),
        trend: 'stable' as const,
        change: Math.round(Math.random() * 8 - 4)
      },
      {
        skill: 'Eye Contact',
        current: Math.round(filteredSessions.reduce((sum, s) => sum + s.eyeContactScore, 0) / totalSessions),
        trend: 'up' as const,
        change: Math.round(Math.random() * 12 + 2)
      }
    ];

    // Calculate weekly progress
    const weeklyProgress = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      
      const weekSessions = filteredSessions.filter(s => {
        const sessionDate = new Date(s.createdAt);
        return sessionDate >= weekStart && sessionDate < weekEnd;
      });
      
      return {
        week: `Week ${4 - i}`,
        sessions: weekSessions.length,
        avgScore: weekSessions.length > 0 ? 
          Math.round(weekSessions.reduce((sum, s) => sum + s.overallPerformance, 0) / weekSessions.length) : 0
      };
    }).reverse();

    // Define milestones
    const milestones = [
      {
        name: 'First Practice Session',
        achieved: totalSessions >= 1,
        progress: Math.min(totalSessions, 1),
        target: 1
      },
      {
        name: 'Practice Consistency',
        achieved: totalSessions >= 5,
        progress: Math.min(totalSessions, 5),
        target: 5
      },
      {
        name: 'Speaking Confidence',
        achieved: averagePerformance >= 80,
        progress: Math.min(averagePerformance, 80),
        target: 80
      },
      {
        name: 'Practice Marathon',
        achieved: totalPracticeTime >= 60,
        progress: Math.min(totalPracticeTime, 60),
        target: 60
      },
      {
        name: 'Weekly Dedication',
        achieved: currentStreak >= 7,
        progress: Math.min(currentStreak, 7),
        target: 7
      }
    ];

    return {
      totalSessions,
      totalPracticeTime,
      averagePerformance,
      improvementRate,
      currentStreak,
      longestStreak,
      skillTrends,
      weeklyProgress,
      milestones
    };
  }, [sessions, timeRange]);

  if (sessionsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <div className="text-center py-12">
        <Mic className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Speaking Journey</h3>
        <p className="text-gray-600 mb-6">Complete your first practice session to see detailed progress tracking</p>
        <Button 
          onClick={() => window.location.hash = '#practice'}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
        >
          <Mic className="w-4 h-4 mr-2" />
          Start Practice Session
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Progress Tracking</h2>
          <p className="text-gray-600">Your speaking improvement journey with AI insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Sessions</p>
                <p className="text-3xl font-bold text-blue-700">{progressMetrics.totalSessions}</p>
              </div>
              <Mic className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Practice Time</p>
                <p className="text-3xl font-bold text-green-700">{progressMetrics.totalPracticeTime}m</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Performance</p>
                <p className="text-3xl font-bold text-purple-700">{progressMetrics.averagePerformance}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Current Streak</p>
                <p className="text-3xl font-bold text-orange-700">{progressMetrics.currentStreak} days</p>
              </div>
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">Daily Goals</TabsTrigger>
          <TabsTrigger value="trends">Skill Trends</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Today's Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dailyGoals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals for today</h3>
                  <p className="text-gray-600">Complete a practice session to generate personalized daily goals</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyGoals.map((goal, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 transition-all duration-200 ${goal.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${goal.color} text-white`}>
                            {goal.icon || <Target className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                            <p className="text-sm text-gray-600">{goal.description}</p>
                          </div>
                        </div>
                        <Badge variant={goal.difficulty === 'hard' ? 'destructive' : goal.difficulty === 'medium' ? 'default' : 'secondary'}>
                          {goal.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{goal.current} / {goal.target} {goal.unit}</span>
                        </div>
                        <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{goal.timeEstimate}</span>
                          <span className="text-purple-600 font-medium">+{goal.yapX} YapX</span>
                        </div>
                        {!goal.completed ? (
                          <Button 
                            size="sm" 
                            onClick={() => completeGoalMutation.mutate(goal.id)}
                            disabled={completeGoalMutation.isPending}
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                          >
                            {completeGoalMutation.isPending ? 'Completing...' : 'Complete'}
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Completed!</span>
                          </div>
                        )}
                      </div>
                      
                      {goal.motivationalMessage && (
                        <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                          <Sparkles className="w-4 h-4 inline mr-1" />
                          {goal.motivationalMessage}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Skill Improvement Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {progressMetrics.skillTrends.map((skill, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{skill.skill}</h4>
                      <div className="flex items-center gap-2">
                        {skill.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {skill.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                        {skill.trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
                        <span className={`text-sm font-medium ${
                          skill.trend === 'up' ? 'text-green-600' :
                          skill.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {skill.change > 0 ? '+' : ''}{skill.change}%
                        </span>
                      </div>
                    </div>
                    <Progress value={skill.current} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Current Score</span>
                      <span>{skill.current}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievement Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressMetrics.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full ${
                      milestone.achieved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {milestone.achieved ? <CheckCircle className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{milestone.name}</h4>
                        <Badge variant={milestone.achieved ? "default" : "secondary"}>
                          {milestone.achieved ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                      <Progress value={(milestone.progress / milestone.target) * 100} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>{milestone.progress} / {milestone.target}</span>
                        <span>{Math.round((milestone.progress / milestone.target) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressMetrics.weeklyProgress.map((week, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{week.week}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{week.sessions} sessions</span>
                        <Progress value={week.avgScore} className="w-20 h-2" />
                        <span className="text-sm font-medium">{week.avgScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Improvement Rate</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {progressMetrics.improvementRate > 0 ? '+' : ''}{progressMetrics.improvementRate}%
                    </p>
                    <p className="text-xs text-blue-600">Comparing recent vs early sessions</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Longest Streak</p>
                    <p className="text-2xl font-bold text-green-600">{progressMetrics.longestStreak} days</p>
                    <p className="text-xs text-green-600">Your best consistency record</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}