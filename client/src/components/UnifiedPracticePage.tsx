import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, Brain, BarChart3, Eye, Volume2, Timer, TrendingUp, Activity, MessageSquare } from "lucide-react";
import SimplifiedPracticePage from "@/components/SimplifiedPracticePage";
import AICoachRedesigned from "@/components/AICoachRedesigned";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

interface LiveStats {
  eyeContact: number;
  confidence: number;
  engagement: number;
  wordsPerMinute: number;
  fillerWordCount: number;
  clarity: number;
  sessionDuration: number;
  totalSessions: number;
  averageScore: number;
  improvementRate: number;
}

export default function UnifiedPracticePage() {
  const { user } = useAuth();
  const [liveStats, setLiveStats] = useState<LiveStats>({
    eyeContact: 0,
    confidence: 0,
    engagement: 0,
    wordsPerMinute: 0,
    fillerWordCount: 0,
    clarity: 0,
    sessionDuration: 0,
    totalSessions: 0,
    averageScore: 0,
    improvementRate: 0
  });

  // Query for real-time session data
  const { data: sessions } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: !!user,
    refetchInterval: 5000, // Refresh every 5 seconds for live stats
  });

  // Calculate live statistics from actual session data
  useEffect(() => {
    if (sessions && Array.isArray(sessions) && sessions.length > 0) {
      const totalSessions = sessions.length;
      const latestSession = sessions[0];
      
      // Calculate averages from real session data
      const avgEyeContact = sessions.reduce((sum: number, session: any) => 
        sum + (session.analysis?.eyeContact || 0), 0) / totalSessions;
      const avgConfidence = sessions.reduce((sum: number, session: any) => 
        sum + (session.analysis?.confidence || 0), 0) / totalSessions;
      const avgEngagement = sessions.reduce((sum: number, session: any) => 
        sum + (session.analysis?.engagement || 0), 0) / totalSessions;
      const avgWPM = sessions.reduce((sum: number, session: any) => 
        sum + (session.analysis?.wordsPerMinute || 0), 0) / totalSessions;
      const avgClarity = sessions.reduce((sum: number, session: any) => 
        sum + (session.analysis?.clarity || 0), 0) / totalSessions;
      
      // Calculate overall score
      const overallScore = (avgEyeContact + avgConfidence + avgEngagement + avgClarity) / 4;
      
      // Calculate improvement rate from first vs last 3 sessions
      let improvementRate = 0;
      if (totalSessions >= 6) {
        const firstThree = sessions.slice(-3).reduce((sum: number, session: any) => 
          sum + ((session.analysis?.eyeContact || 0) + (session.analysis?.confidence || 0) + 
               (session.analysis?.engagement || 0) + (session.analysis?.clarity || 0)) / 4, 0) / 3;
        const lastThree = sessions.slice(0, 3).reduce((sum: number, session: any) => 
          sum + ((session.analysis?.eyeContact || 0) + (session.analysis?.confidence || 0) + 
               (session.analysis?.engagement || 0) + (session.analysis?.clarity || 0)) / 4, 0) / 3;
        improvementRate = ((lastThree - firstThree) / firstThree) * 100;
      }

      setLiveStats({
        eyeContact: Math.round(avgEyeContact),
        confidence: Math.round(avgConfidence),
        engagement: Math.round(avgEngagement),
        wordsPerMinute: Math.round(avgWPM),
        fillerWordCount: latestSession?.analysis?.fillerWordCount || 0,
        clarity: Math.round(avgClarity),
        sessionDuration: latestSession?.duration || 0,
        totalSessions,
        averageScore: Math.round(overallScore),
        improvementRate: Math.round(improvementRate)
      });
    }
  }, [sessions]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getImprovementColor = (rate: number) => {
    if (rate > 0) return "text-green-600";
    if (rate < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Main Practice Area - Side by Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Practice Recording Section */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-blue-600" />
              Practice Recording
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="h-full">
              <SimplifiedPracticePage />
            </div>
          </CardContent>
        </Card>

        {/* AI Coach Section */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Live AI Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="h-full">
              <AICoachRedesigned />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Statistics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            Live Performance Statistics
            <Badge variant="outline" className="ml-auto">
              Real-time Data
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            
            {/* Primary Metrics */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Eye Contact</span>
              </div>
              <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getScoreColor(liveStats.eyeContact)}`}>
                {liveStats.eyeContact}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Confidence</span>
              </div>
              <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getScoreColor(liveStats.confidence)}`}>
                {liveStats.confidence}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Engagement</span>
              </div>
              <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getScoreColor(liveStats.engagement)}`}>
                {liveStats.engagement}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">Clarity</span>
              </div>
              <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getScoreColor(liveStats.clarity)}`}>
                {liveStats.clarity}%
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-500" />
                <span className="text-sm font-medium">Words/Min</span>
              </div>
              <div className="text-2xl font-bold text-gray-700">
                {liveStats.wordsPerMinute}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Filler Words</span>
              </div>
              <div className="text-2xl font-bold text-gray-700">
                {liveStats.fillerWordCount}
              </div>
            </div>
          </div>

          {/* Summary Statistics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Sessions</div>
              <div className="text-xl font-bold text-blue-600">{liveStats.totalSessions}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Average Score</div>
              <div className={`text-xl font-bold ${getScoreColor(liveStats.averageScore).split(' ')[0]}`}>
                {liveStats.averageScore}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Latest Duration</div>
              <div className="text-xl font-bold text-gray-700">{formatDuration(liveStats.sessionDuration)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Improvement Rate</div>
              <div className={`text-xl font-bold ${getImprovementColor(liveStats.improvementRate)}`}>
                {liveStats.improvementRate > 0 ? '+' : ''}{liveStats.improvementRate}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}