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
        change: 0 // ELIMINATED: Only show when real trend analysis available
      },
      {
        skill: 'Confidence',
        current: Math.round(filteredSessions.reduce((sum, s) => sum + s.confidenceLevel, 0) / totalSessions),
        trend: 'up' as const,
        change: 0 // ELIMINATED: Only show when real trend analysis available
      },
      {
        skill: 'Engagement',
        current: Math.round(filteredSessions.reduce((sum, s) => sum + s.engagementLevel, 0) / totalSessions),
        trend: 'stable' as const,
        change: 0 // ELIMINATED: Only show when real trend analysis available
      },
      {
        skill: 'Eye Contact',
        current: Math.round(filteredSessions.reduce((sum, s) => sum + s.eyeContactScore, 0) / totalSessions),
        trend: 'up' as const,
        change: 0 // ELIMINATED: Only show when real trend analysis available
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
    <div className="space-y-8">
      {/* Enhanced Header with Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Progress Tracking
          </h2>
          <p className="text-gray-600 text-lg">Your speaking improvement journey with AI insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48 bg-white border-2 border-blue-200 hover:border-blue-300 transition-colors">
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

      {/* Enhanced Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Total Sessions</p>
                <p className="text-4xl font-bold text-blue-700">{progressMetrics.totalSessions}</p>
                <p className="text-xs text-blue-600">Practice sessions completed</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Mic className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Practice Time</p>
                <p className="text-4xl font-bold text-green-700">{progressMetrics.totalPracticeTime}m</p>
                <p className="text-xs text-green-600">Minutes of practice</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Avg Performance</p>
                <p className="text-4xl font-bold text-purple-700">{progressMetrics.averagePerformance}%</p>
                <p className="text-xs text-purple-600">Overall score</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Current Streak</p>
                <p className="text-4xl font-bold text-orange-700">{progressMetrics.currentStreak} days</p>
                <p className="text-xs text-orange-600">Consecutive days</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="goals" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg transition-all duration-200">
            <Target className="w-4 h-4 mr-2" />
            Daily Goals
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg transition-all duration-200">
            <TrendingUp className="w-4 h-4 mr-2" />
            Skill Trends
          </TabsTrigger>
          <TabsTrigger value="milestones" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg transition-all duration-200">
            <Award className="w-4 h-4 mr-2" />
            Milestones
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 rounded-lg transition-all duration-200">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Today's Goals</h3>
                  <p className="text-sm text-blue-700 font-medium">Complete these challenges to earn YapX and improve your skills</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {dailyGoals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Target className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No goals for today</h3>
                  <p className="text-gray-600 mb-6">Complete a practice session to generate personalized daily goals</p>
                  <Button 
                    onClick={() => window.location.hash = '#practice'}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Start Practice Session
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dailyGoals.map((goal, index) => (
                    <div key={index} className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      goal.completed 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md' 
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${goal.color} text-white shadow-lg`}>
                            {goal.icon || <Target className="w-5 h-5" />}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-gray-900 text-lg">{goal.title}</h4>
                            <p className="text-sm text-gray-600">{goal.description}</p>
                          </div>
                        </div>
                        <Badge variant={goal.difficulty === 'hard' ? 'destructive' : goal.difficulty === 'medium' ? 'default' : 'secondary'} className="text-xs font-semibold px-3 py-1">
                          {goal.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                          <span>Progress</span>
                          <span>{goal.current} / {goal.target} {goal.unit}</span>
                        </div>
                        <Progress value={(goal.current / goal.target) * 100} className="h-3" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{goal.timeEstimate}</span>
                          </div>
                          <div className="flex items-center gap-1 text-purple-600 font-semibold">
                            <Star className="w-4 h-4" />
                            <span>+{goal.yapX} YapX</span>
                          </div>
                        </div>
                        {!goal.completed ? (
                          <Button 
                            size="sm" 
                            onClick={() => completeGoalMutation.mutate(goal.id)}
                            disabled={completeGoalMutation.isPending}
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold px-4 py-2"
                          >
                            {completeGoalMutation.isPending ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Completing...
                              </div>
                            ) : (
                              'Complete'
                            )}
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <CheckCircle className="w-5 h-5" />
                            <span>Completed!</span>
                          </div>
                        )}
                      </div>
                      
                      {goal.motivationalMessage && (
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-800 font-medium">{goal.motivationalMessage}</p>
                          </div>
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
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
              <CardTitle className="flex items-center gap-3 text-green-900">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Skill Improvement Trends</h3>
                  <p className="text-sm text-green-700 font-medium">Track your progress across different speaking skills</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {progressMetrics.skillTrends.map((skill, index) => (
                  <div key={index} className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 text-lg">{skill.skill}</h4>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          skill.trend === 'up' ? 'bg-green-100' :
                          skill.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {skill.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
                          {skill.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-600" />}
                          {skill.trend === 'stable' && <Minus className="w-5 h-5 text-gray-600" />}
                        </div>
                        <span className={`text-lg font-bold ${
                          skill.trend === 'up' ? 'text-green-600' :
                          skill.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {skill.change > 0 ? '+' : ''}{skill.change}%
                        </span>
                      </div>
                    </div>
                    <Progress value={skill.current} className="h-3 mb-3" />
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                      <span>Current Score</span>
                      <span className="text-lg font-bold text-gray-900">{skill.current}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200">
              <CardTitle className="flex items-center gap-3 text-purple-900">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Achievement Milestones</h3>
                  <p className="text-sm text-purple-700 font-medium">Unlock achievements as you progress in your speaking journey</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {progressMetrics.milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center gap-6 p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg ${
                    milestone.achieved 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md' 
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  }`}>
                    <div className={`p-4 rounded-full ${
                      milestone.achieved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {milestone.achieved ? <CheckCircle className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-lg">{milestone.name}</h4>
                        <Badge variant={milestone.achieved ? "default" : "secondary"} className="text-xs font-semibold px-3 py-1">
                          {milestone.achieved ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                      <Progress value={(milestone.progress / milestone.target) * 100} className="h-3" />
                      <div className="flex justify-between text-sm font-medium text-gray-600">
                        <span>{milestone.progress} / {milestone.target}</span>
                        <span className="text-lg font-bold text-gray-900">{Math.round((milestone.progress / milestone.target) * 100)}%</span>
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
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
                <CardTitle className="flex items-center gap-3 text-blue-900">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Weekly Progress</h3>
                    <p className="text-sm text-blue-700 font-medium">Track your performance over the last 4 weeks</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {progressMetrics.weeklyProgress.map((week, index) => (
                    <div key={index} className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-gray-900">{week.week}</span>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs font-semibold">
                            {week.sessions} sessions
                          </Badge>
                          <span className="text-lg font-bold text-blue-600">{week.avgScore}%</span>
                        </div>
                      </div>
                      <Progress value={week.avgScore} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200">
                <CardTitle className="flex items-center gap-3 text-orange-900">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Improvement Insights</h3>
                    <p className="text-sm text-orange-700 font-medium">Key metrics and performance indicators</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Improvement Rate</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 mb-1">
                      {progressMetrics.improvementRate > 0 ? '+' : ''}{progressMetrics.improvementRate}%
                    </p>
                    <p className="text-xs text-blue-600">Comparing recent vs early sessions</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Flame className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-semibold text-green-800 uppercase tracking-wide">Longest Streak</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600 mb-1">{progressMetrics.longestStreak} days</p>
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