import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Video, FileText, TrendingUp, Award, Play, Mic } from "lucide-react";
import { format } from "date-fns";

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

export function SessionDashboard() {
  const { data: dashboardData, isLoading, error } = useQuery<SessionDashboardData>({
    queryKey: ['/api/sessions/dashboard'],
    retry: false,
    staleTime: 30000
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <p>Unable to load session data. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dashboardData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <p>No session data available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !dashboardData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Failed to load session dashboard</p>
        </CardContent>
      </Card>
    );
  }

  const { sessions, stats, isNewUser, nextSessionNumber } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      {isNewUser ? (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 font-extrabold">Welcome to Yappyy Speaking Practice! 🎯</CardTitle>
            <CardDescription className="text-blue-700 font-semibold">
              Start your speaking journey with Session 1. Every session is numbered to track your progress with authentic AI feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button 
                onClick={() => window.location.href = '#practice'}
                className="bg-blue-600 hover:bg-blue-700 font-bold"
              >
                <Mic className="h-4 w-4 mr-2" />
                Start Session {nextSessionNumber}
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '#templates'}
                className="font-semibold"
              >
                Browse Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-extrabold">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Session Progress Dashboard
            </CardTitle>
            <CardDescription className="font-semibold">
              Ready for Session {nextSessionNumber}? You've completed {stats.totalSessions} sessions with authentic AI analysis.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
            <p className="text-xs text-gray-500">Practice sessions completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.averageConfidence}%</div>
            <p className="text-xs text-gray-500">Speaking confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Clarity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.averageClarity}%</div>
            <p className="text-xs text-gray-500">Voice clarity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(stats.totalDuration / 60)}m
            </div>
            <p className="text-xs text-gray-500">Practice time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
            <CardDescription>
              Your practice sessions with authentic metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono">
                        #{session.sessionNumber}
                      </Badge>
                      <h3 className="font-semibold">
                        {session.sessionName || `Session ${session.sessionNumber}`}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {Math.round(session.duration / 60)}m
                      </div>
                      {session.hasVideo && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Video className="h-4 w-4" />
                          Video
                        </div>
                      )}
                      {session.hasTranscript && (
                        <div className="flex items-center gap-1 text-green-600">
                          <FileText className="h-4 w-4" />
                          Transcript
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Confidence: {session.confidenceScore}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(session.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/analysis?session=${session.id}`}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {sessions.length > 5 && (
              <div className="text-center mt-4">
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/analysis'}
                >
                  View All {sessions.length} Sessions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-extrabold text-green-900 mb-2">
              Ready for Session {nextSessionNumber}?
            </h3>
            <p className="text-green-700 mb-4 font-semibold">
              Continue your speaking improvement journey with authentic AI coaching and computer vision analysis.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                size="lg"
                onClick={() => {
                  // Switch to practice tab in the main dashboard
                  const practiceTab = document.querySelector('[value="practice"]') as HTMLElement;
                  if (practiceTab) practiceTab.click();
                }}
                className="bg-green-600 hover:bg-green-700 font-bold"
              >
                <Mic className="h-4 w-4 mr-2" />
                Start Session {nextSessionNumber}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => {
                  // Switch to AI coach tab in the main dashboard
                  const coachTab = document.querySelector('[value="ai-coach"]') as HTMLElement;
                  if (coachTab) coachTab.click();
                }}
                className="font-semibold"
              >
                Get AI Coaching
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}