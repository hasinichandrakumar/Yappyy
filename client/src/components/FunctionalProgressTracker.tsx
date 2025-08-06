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
    <div className="space-y-6">
      {/* Simple Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
        <p className="text-gray-600">Track your speaking improvement journey</p>
      </div>

      {/* Key Stats - Simplified */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">{progressMetrics.totalSessions}</div>
          <div className="text-sm text-gray-600">Sessions</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">{progressMetrics.totalPracticeTime}m</div>
          <div className="text-sm text-gray-600">Practice Time</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-purple-600">{progressMetrics.averagePerformance}%</div>
          <div className="text-sm text-gray-600">Avg Score</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-orange-600">{progressMetrics.currentStreak}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </Card>
      </div>

      {/* Simplified Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200">
            Overview
          </TabsTrigger>
          <TabsTrigger value="skills" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200">
            Skills
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200">
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Total Practice Time</span>
                  <span className="font-semibold text-blue-600">{progressMetrics.totalPracticeTime} minutes</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Average Performance</span>
                  <span className="font-semibold text-green-600">{progressMetrics.averagePerformance}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Current Streak</span>
                  <span className="font-semibold text-purple-600">{progressMetrics.currentStreak} days</span>
                </div>
                {progressMetrics.improvementRate > 0 && (
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-gray-700">Improvement Rate</span>
                    <span className="font-semibold text-orange-600">+{progressMetrics.improvementRate}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Skills</h3>
              <div className="space-y-4">
                {progressMetrics.skillTrends.map((skill, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{skill.skill}</span>
                      <span className="text-lg font-bold text-blue-600">{skill.current}%</span>
                    </div>
                    <Progress value={skill.current} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div className="space-y-3">
                {progressMetrics.milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    milestone.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className={`p-2 rounded-full ${
                      milestone.achieved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {milestone.achieved ? <CheckCircle className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{milestone.name}</span>
                        <span className="text-sm text-gray-500">
                          {milestone.progress} / {milestone.target}
                        </span>
                      </div>
                      <Progress value={(milestone.progress / milestone.target) * 100} className="h-1 mt-1" />
                    </div>
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