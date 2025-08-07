import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Mic, 
  Eye, 
  Target,
  Award,
  Calendar,
  PlayCircle,
  Star,
  Flame
} from 'lucide-react';
import { format } from 'date-fns';

interface SessionData {
  id: number;
  sessionNumber: number;
  sessionName: string;
  transcript: string;
  duration: number;
  confidenceScore: number;
  voiceClarity: number;
  overallScore: number;
  hasVideo: boolean;
  hasTranscript: boolean;
  createdAt: string;
  eyeContactScore?: number;
  fillerWordCount?: number;
  wordsPerMinute?: number;
}

interface DashboardStats {
  totalSessions: number;
  averageConfidence: number;
  averageClarity: number;
  totalDuration: number;
  sessionsWithVideo: number;
}

interface SessionDashboardData {
  sessions: SessionData[];
  stats: DashboardStats;
  isNewUser: boolean;
  nextSessionNumber: number;
  userType: 'guest' | 'authenticated';
}

export default function StreamlinedProgressTab() {
  const [timeRange, setTimeRange] = useState('all');

  const { data: dashboardData, isLoading, error } = useQuery<SessionDashboardData>({
    queryKey: ['/api/sessions/dashboard'],
    retry: false,
    staleTime: 30000
  });

  // Calculate improvement trends from session data
  const progressMetrics = useMemo(() => {
    if (!dashboardData?.sessions?.length) return null;

    const sessions = dashboardData.sessions;
    const recentSessions = sessions.slice(-5); // Last 5 sessions
    const olderSessions = sessions.slice(-10, -5); // Previous 5 sessions

    const recentAvg = recentSessions.reduce((sum, s) => sum + s.overallScore, 0) / recentSessions.length;
    const olderAvg = olderSessions.length > 0 
      ? olderSessions.reduce((sum, s) => sum + s.overallScore, 0) / olderSessions.length 
      : recentAvg;

    const improvementRate = recentAvg - olderAvg;
    
    // Calculate skill averages
    const avgConfidence = sessions.reduce((sum, s) => sum + s.confidenceScore, 0) / sessions.length;
    const avgClarity = sessions.reduce((sum, s) => sum + s.voiceClarity, 0) / sessions.length;
    const avgOverall = sessions.reduce((sum, s) => sum + s.overallScore, 0) / sessions.length;

    return {
      totalSessions: sessions.length,
      totalTime: Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60), // in minutes
      improvementRate,
      avgConfidence,
      avgClarity,
      avgOverall,
      streak: sessions.length > 0 ? Math.min(sessions.length, 7) : 0 // Simple streak calculation
    };
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <p>Unable to load progress data. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { sessions, stats, isNewUser, nextSessionNumber } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Welcome Message for New Users */}
      {isNewUser ? (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 font-bold">Welcome to Your Speaking Journey! 🎯</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button 
                onClick={() => window.location.href = '#practice-alt'}
                className="bg-blue-600 hover:bg-blue-700 font-bold"
              >
                <Mic className="h-4 w-4 mr-2" />
                Start Session {nextSessionNumber}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Progress Overview for Existing Users */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Sessions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
              <p className="text-xs text-gray-500 mt-1">
                Next: Session {nextSessionNumber}
              </p>
            </CardContent>
          </Card>

          {/* Total Practice Time */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Practice Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {progressMetrics ? `${progressMetrics.totalTime}m` : '0m'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total speaking practice
              </p>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {progressMetrics ? progressMetrics.streak : 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Sessions completed
              </p>
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {progressMetrics ? Math.round(progressMetrics.avgOverall) : 0}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Overall performance
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Skill Progress - Only show if user has sessions */}
      {progressMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Speaking Skills Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Confidence */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Confidence</span>
                  <span className="text-sm text-gray-600">{Math.round(progressMetrics.avgConfidence)}%</span>
                </div>
                <Progress value={progressMetrics.avgConfidence} className="h-2" />
              </div>

              {/* Voice Clarity */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Voice Clarity</span>
                  <span className="text-sm text-gray-600">{Math.round(progressMetrics.avgClarity)}%</span>
                </div>
                <Progress value={progressMetrics.avgClarity} className="h-2" />
              </div>

              {/* Overall Performance */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Performance</span>
                  <span className="text-sm text-gray-600">{Math.round(progressMetrics.avgOverall)}%</span>
                </div>
                <Progress value={progressMetrics.avgOverall} className="h-2" />
              </div>
            </div>

            {/* Improvement Indicator */}
            {progressMetrics.improvementRate !== 0 && (
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  {progressMetrics.improvementRate > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        Improving by {Math.abs(progressMetrics.improvementRate).toFixed(1)}% over recent sessions
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-600 font-medium">
                        Focus area: Performance decreased by {Math.abs(progressMetrics.improvementRate).toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions - Only show latest 3 */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Sessions
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '#analysis'}
              >
                View All Sessions
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.slice(0, 3).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Session {session.sessionNumber}
                      </Badge>
                      <span className="font-medium text-sm">{session.sessionName}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.round(session.duration / 60)}m
                      </span>
                      <span>{format(new Date(session.createdAt), 'MMM d')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {session.overallScore}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Overall Score
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Continue Your Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button 
              onClick={() => window.location.href = '#practice-alt'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Mic className="h-4 w-4 mr-2" />
              New Practice Session
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '#analysis'}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Review Analytics
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '#templates'}
            >
              <Award className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}