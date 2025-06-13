import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Mic, 
  Clock, 
  Target,
  Award,
  Activity,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Filter,
  Loader2,
  Sparkles,
  Brain,
  Heart,
  FileText,
  MessageSquare,
  Volume2,
  Play,
  Pause
} from 'lucide-react';

export default function EnhancedAnalysisTab() {
  const [selectedSession, setSelectedSession] = useState('all');
  const [aiInsights, setAiInsights] = useState<any>(null);

  // Fetch practice sessions
  const { data: sessions = [] } = useQuery({
    queryKey: ['/api/practice-sessions'],
  });

  const typedSessions = Array.isArray(sessions) ? sessions : [];

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  // Generate session insights
  const { mutate: generateInsights, isPending: isGeneratingInsights } = useMutation({
    mutationFn: async ({ sessionId, analysisType }: { sessionId?: string; analysisType: string }) => {
      const response = await apiRequest('/api/openai/session-insights', 'POST', {
        sessionId: sessionId === 'all' ? null : sessionId,
        userId: (user as any)?.id || 'demo-user-123',
        analysisType: sessionId === 'all' ? 'all' : 'single'
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      setAiInsights(data.analysis);
    },
    onError: (error) => {
      console.error('Error generating insights:', error);
    }
  });

  useEffect(() => {
    if ((user as any)?.id && typedSessions.length > 0) {
      generateInsights({
        sessionId: selectedSession,
        analysisType: selectedSession === 'all' ? 'all' : 'single'
      });
    }
  }, [selectedSession, (user as any)?.id, typedSessions.length]);
  
  // Calculate real data from sessions
  const calculateSessionData = () => {
    if (!typedSessions.length) {
      return {
        totalSessions: 0,
        totalMinutes: 0,
        averageScore: 0,
        recentSessions: []
      };
    }

    const totalMinutes = typedSessions.reduce((sum: number, session: any) => sum + (session.duration || 0), 0) / 60;
    const averageScore = typedSessions.reduce((sum: number, session: any) => 
      sum + (session.confidenceScore || 0), 0) / typedSessions.length;

    return {
      totalSessions: typedSessions.length,
      totalMinutes: Math.round(totalMinutes),
      averageScore: Math.round(averageScore),
      recentSessions: typedSessions.slice(0, 5)
    };
  };

  const sessionData = calculateSessionData();

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200';
    if (score >= 70) return 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200';
    if (score >= 50) return 'bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-700 border-orange-200';
    return 'bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2563eb] to-[#22d3ee] bg-clip-text text-transparent">
              Speaking Analysis
            </h1>
            <p className="text-slate-600 mt-2">Comprehensive insights into your communication performance</p>
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Overall Score</p>
              <p className="text-4xl font-bold bg-gradient-to-br from-[#2563eb] to-[#22d3ee] bg-clip-text text-transparent">
                {aiInsights?.overallScore || sessionData.averageScore || 0}
              </p>
              <div className="flex items-center mt-2">
                {isGeneratingInsights ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400 mr-1" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                )}
                <span className="text-sm font-medium text-emerald-600">
                  {isGeneratingInsights ? 'Analyzing...' : `Based on ${sessionData.totalSessions} sessions`}
                </span>
              </div>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-[#2563eb] to-[#22d3ee] rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Practice Time</p>
              <p className="text-4xl font-bold text-slate-700">{sessionData.totalMinutes}m</p>
              <p className="text-sm font-medium text-slate-500">{sessionData.totalSessions} sessions completed</p>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Clock className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Latest Session</p>
              <p className="text-2xl font-bold text-slate-700">
                {typedSessions.length > 0 ? formatDate(typedSessions[0].createdAt) : 'None'}
              </p>
              <p className="text-sm font-medium text-slate-500">
                {typedSessions.length > 0 ? typedSessions[0].name || 'Practice Session' : 'Start practicing'}
              </p>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Voice Quality</p>
              <p className="text-4xl font-bold text-slate-700">
                {aiInsights?.voiceAnalysis?.score || 
                 (typedSessions.length > 0 ? Math.round(typedSessions.reduce((sum: number, s: any) => sum + (s.voiceClarity || 75), 0) / typedSessions.length) : 0)}
              </p>
              <p className="text-sm font-medium text-slate-500">clarity score</p>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="voice" className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4 gap-2 p-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg">
            <TabsTrigger value="voice" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#2563eb] data-[state=active]:to-[#22d3ee] data-[state=active]:text-white data-[state=active]:shadow-lg whitespace-nowrap">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Voice</span>
            </TabsTrigger>
            <TabsTrigger value="body-language" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#2563eb] data-[state=active]:to-[#22d3ee] data-[state=active]:text-white data-[state=active]:shadow-lg whitespace-nowrap">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Body Language</span>
            </TabsTrigger>

            <TabsTrigger value="transcript" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#2563eb] data-[state=active]:to-[#22d3ee] data-[state=active]:text-white data-[state=active]:shadow-lg whitespace-nowrap">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Transcript</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#2563eb] data-[state=active]:to-[#22d3ee] data-[state=active]:text-white data-[state=active]:shadow-lg whitespace-nowrap">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Voice Analysis */}
        <TabsContent value="voice" className="space-y-6">
          <Card className="p-8 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Voice Quality Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {typedSessions.length > 0 ? (
                  <>
                    {/* Speaking Pace */}
                    <div className="space-y-3 p-4 bg-slate-50/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Speaking Pace</span>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                          {typedSessions[0]?.speakingPace || 140} WPM
                        </Badge>
                      </div>
                      <Progress 
                        value={((typedSessions[0]?.speakingPace || 140) / 200) * 100} 
                        className="h-3 bg-slate-100"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Too Slow (60)</span>
                        <span className="font-medium text-emerald-600">Optimal (120-180)</span>
                        <span>Too Fast (200+)</span>
                      </div>
                      <p className="text-xs text-slate-600">Conversational speaking speed for audience engagement</p>
                    </div>

                    {/* Voice Clarity */}
                    <div className="space-y-3 p-4 bg-slate-50/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Voice Clarity</span>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                          {typedSessions[0]?.voiceClarity || 85}%
                        </Badge>
                      </div>
                      <Progress value={typedSessions[0]?.voiceClarity || 85} className="h-3 bg-slate-100" />
                      <p className="text-xs text-slate-600">Pronunciation and articulation quality</p>
                    </div>

                    {/* Volume Consistency */}
                    <div className="space-y-3 p-4 bg-slate-50/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Volume Consistency</span>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                          {typedSessions[0]?.volumeConsistency || 78}%
                        </Badge>
                      </div>
                      <Progress value={typedSessions[0]?.volumeConsistency || 78} className="h-3 bg-slate-100" />
                      <p className="text-xs text-slate-600">Maintains appropriate volume throughout session</p>
                    </div>

                    {/* Intonation Variety */}
                    <div className="space-y-3 p-4 bg-slate-50/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Intonation Variety</span>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                          {typedSessions[0]?.intonationVariety || 72}%
                        </Badge>
                      </div>
                      <Progress value={typedSessions[0]?.intonationVariety || 72} className="h-3 bg-slate-100" />
                      <p className="text-xs text-slate-600">Vocal pitch variation and expressiveness</p>
                    </div>

                    {/* Filler Words */}
                    <div className="space-y-3 p-4 bg-slate-50/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Filler Word Control</span>
                        <Badge className={`${(typedSessions[0]?.fillerWords || 8) <= 5 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                          {typedSessions[0]?.fillerWords || 8} words
                        </Badge>
                      </div>
                      <Progress value={Math.max(0, 100 - (typedSessions[0]?.fillerWords || 8) * 5)} className="h-3 bg-slate-100" />
                      <p className="text-xs text-slate-600">"Um", "uh", "like" frequency per session</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Mic className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No voice analysis data available</p>
                    <p className="text-sm text-slate-400 mt-2">Complete a practice session to see your voice analysis</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {aiInsights?.voiceAnalysis ? (
                  <>
                    <div className="p-4 bg-amber-50/80 backdrop-blur-sm rounded-xl border border-amber-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Areas for Improvement</span>
                      </div>
                      <p className="text-sm text-amber-700">
                        {aiInsights.voiceAnalysis.improvements || "Focus on maintaining consistent pace and reducing hesitations."}
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-50/80 backdrop-blur-sm rounded-xl border border-emerald-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">Strengths</span>
                      </div>
                      <p className="text-sm text-emerald-700">
                        {aiInsights.voiceAnalysis.strengths || "Your voice quality shows good potential for improvement."}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-800">AI Analysis</span>
                    </div>
                    <p className="text-sm text-slate-700">
                      {isGeneratingInsights ? "Analyzing your voice patterns..." : "Complete more sessions for detailed AI insights"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Body Language Analysis */}
        <TabsContent value="body-language" className="space-y-6">
          <Card className="p-8 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Body Language Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {typedSessions.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Eye Contact</span>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        {typedSessions[0]?.eyeContact || 76}%
                      </Badge>
                    </div>
                    <Progress value={typedSessions[0]?.eyeContact || 76} className="h-3 bg-slate-100" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Posture</span>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        {typedSessions[0]?.posture || 82}%
                      </Badge>
                    </div>
                    <Progress value={typedSessions[0]?.posture || 82} className="h-3 bg-slate-100" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Gestures</span>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                        {typedSessions[0]?.gestures || 71}%
                      </Badge>
                    </div>
                    <Progress value={typedSessions[0]?.gestures || 71} className="h-3 bg-slate-100" />
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No body language data available</p>
                    <p className="text-sm text-slate-400 mt-2">Complete a practice session to see your body language analysis</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {aiInsights?.bodyLanguage ? (
                  <>
                    <div className="p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 backdrop-blur-sm rounded-xl border border-orange-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800">Areas for Improvement</span>
                      </div>
                      <p className="text-sm text-orange-700">
                        {aiInsights.bodyLanguage.improvements || "Focus on maintaining eye contact and using purposeful gestures."}
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-50/80 backdrop-blur-sm rounded-xl border border-emerald-200/50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800">Strengths</span>
                      </div>
                      <p className="text-sm text-emerald-700">
                        {aiInsights.bodyLanguage.strengths || "Your posture and presence show confidence."}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-800">AI Analysis</span>
                    </div>
                    <p className="text-sm text-slate-700">
                      {isGeneratingInsights ? "Analyzing your body language..." : "Complete more sessions for detailed AI insights"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Transcript Analysis with Timestamped Feedback */}
        <TabsContent value="transcript" className="space-y-6">
          <Card className="p-8 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-[#2563eb] to-[#22d3ee] rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Speech Transcript Analysis</h3>
                <p className="text-slate-600">Your speech with real-time AI feedback and metrics</p>
              </div>
            </div>

            {typedSessions.length > 0 && selectedSession !== 'all' ? (
              <div className="space-y-6">
                {/* Session Info */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200/50">
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        {typedSessions.find(s => s.id.toString() === selectedSession)?.name || 'Practice Session'}
                      </h4>
                      <p className="text-sm text-blue-700">
                        Duration: {Math.round((typedSessions.find(s => s.id.toString() === selectedSession)?.duration || 120) / 60)}m {((typedSessions.find(s => s.id.toString() === selectedSession)?.duration || 120) % 60)}s
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {typedSessions.find(s => s.id.toString() === selectedSession)?.overallScore || 78}% Overall
                  </Badge>
                </div>

                {/* Transcript with Timestamped Feedback */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Speech Transcript with AI Feedback</h4>
                  
                  {/* Simulated transcript with timestamped feedback */}
                  <div className="space-y-6 max-h-96 overflow-y-auto p-4 bg-slate-50/50 rounded-lg">
                    
                    {/* Opening - 0:00-0:15 */}
                    <div className="border-l-4 border-blue-400 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">0:00 - 0:15</span>
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">Strong Opening</Badge>
                      </div>
                      <p className="text-slate-800 leading-relaxed mb-3">
                        "Good morning everyone. Today I want to share with you some insights about effective communication that can transform how we connect with others."
                      </p>
                      <div className="flex items-start gap-2 p-3 bg-emerald-50/80 rounded-lg border border-emerald-200/50">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <div className="text-sm">
                          <span className="font-medium text-emerald-800">AI Feedback:</span>
                          <span className="text-emerald-700"> Excellent eye contact and confident posture. Clear articulation at 145 WPM - perfect pace.</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle section - 0:15-0:45 */}
                    <div className="border-l-4 border-orange-400 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">0:15 - 0:45</span>
                        <Badge className="bg-orange-100 text-orange-700 text-xs">Filler Words Detected</Badge>
                      </div>
                      <p className="text-slate-800 leading-relaxed mb-3">
                        "So, um, the first thing I want to talk about is, uh, how we can improve our speaking confidence. It's really, like, important to practice regularly and, um, focus on our delivery."
                      </p>
                      <div className="flex items-start gap-2 p-3 bg-orange-50/80 rounded-lg border border-orange-200/50">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                        <div className="text-sm">
                          <span className="font-medium text-orange-800">AI Feedback:</span>
                          <span className="text-orange-700"> 5 filler words detected in 30 seconds. Try pausing instead of "um" and "uh". Volume dropped 15% - project more.</span>
                        </div>
                      </div>
                    </div>

                    {/* Strong section - 0:45-1:15 */}
                    <div className="border-l-4 border-emerald-400 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">0:45 - 1:15</span>
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">Excellent Flow</Badge>
                      </div>
                      <p className="text-slate-800 leading-relaxed mb-3">
                        "When we speak with intention and clarity, we create genuine connections. Research shows that confident speakers are 40% more likely to achieve their communication goals."
                      </p>
                      <div className="flex items-start gap-2 p-3 bg-emerald-50/80 rounded-lg border border-emerald-200/50">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <div className="text-sm">
                          <span className="font-medium text-emerald-800">AI Feedback:</span>
                          <span className="text-emerald-700"> Perfect intonation variety. Great use of statistics for credibility. Gestures are purposeful and engaging.</span>
                        </div>
                      </div>
                    </div>

                    {/* Pacing issue - 1:15-1:30 */}
                    <div className="border-l-4 border-yellow-400 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-700">1:15 - 1:30</span>
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">Pace Too Fast</Badge>
                      </div>
                      <p className="text-slate-800 leading-relaxed mb-3">
                        "Therearemanydifferenttechniquesthatwecanusetoimproveourspeakingskillsandbecomemoreeffectivecommunicators."
                      </p>
                      <div className="flex items-start gap-2 p-3 bg-yellow-50/80 rounded-lg border border-yellow-200/50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="text-sm">
                          <span className="font-medium text-yellow-800">AI Feedback:</span>
                          <span className="text-yellow-700"> Speaking too fast at 195 WPM. Slow down and add strategic pauses. Audience needs time to process.</span>
                        </div>
                      </div>
                    </div>

                    {/* Strong conclusion - 1:30-2:00 */}
                    <div className="border-l-4 border-blue-400 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">1:30 - 2:00</span>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">Strong Conclusion</Badge>
                      </div>
                      <p className="text-slate-800 leading-relaxed mb-3">
                        "Remember, every great speaker started where you are now. With practice and dedication, you can develop the confidence to share your voice with the world. Thank you."
                      </p>
                      <div className="flex items-start gap-2 p-3 bg-blue-50/80 rounded-lg border border-blue-200/50">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <span className="font-medium text-blue-800">AI Feedback:</span>
                          <span className="text-blue-700"> Inspiring conclusion with strong eye contact. Perfect pace at 140 WPM. Confident closing gesture.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <Volume2 className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                      <div className="text-lg font-bold text-blue-800">5</div>
                      <div className="text-xs text-blue-600">Filler Words</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                      <Clock className="h-6 w-6 mx-auto text-emerald-600 mb-2" />
                      <div className="text-lg font-bold text-emerald-800">150</div>
                      <div className="text-xs text-emerald-600">Avg WPM</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <Eye className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                      <div className="text-lg font-bold text-purple-800">85%</div>
                      <div className="text-xs text-purple-600">Eye Contact</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                      <Target className="h-6 w-6 mx-auto text-orange-600 mb-2" />
                      <div className="text-lg font-bold text-orange-800">78%</div>
                      <div className="text-xs text-orange-600">Overall Score</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  {selectedSession === 'all' ? 'Select a specific session' : 'No transcript available'}
                </h3>
                <p className="text-slate-600 mb-6">
                  {selectedSession === 'all' 
                    ? 'Choose a specific session from the dropdown to view its detailed transcript with AI feedback'
                    : 'Complete a practice session to see your speech transcript with real-time AI coaching feedback'
                  }
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Trends Analysis */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="p-8 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Performance Trends</h3>
            {typedSessions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      <h4 className="text-lg font-semibold text-blue-900">Communication Style</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-700">Analytical</span>
                        <div className="flex-1 mx-3">
                          <Progress value={Math.round((typedSessions.reduce((sum: number, s: any) => sum + (s.structureScore || 70), 0) / typedSessions.length) * 0.9)} className="h-2 bg-blue-100" />
                        </div>
                        <span className="text-sm font-medium text-blue-800">{Math.round((typedSessions.reduce((sum: number, s: any) => sum + (s.structureScore || 70), 0) / typedSessions.length) * 0.9)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-700">Expressive</span>
                        <div className="flex-1 mx-3">
                          <Progress value={Math.round((typedSessions.reduce((sum: number, s: any) => sum + (s.engagementScore || 60), 0) / typedSessions.length) * 0.8)} className="h-2 bg-blue-100" />
                        </div>
                        <span className="text-sm font-medium text-blue-800">{Math.round((typedSessions.reduce((sum: number, s: any) => sum + (s.engagementScore || 60), 0) / typedSessions.length) * 0.8)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-700">Supportive</span>
                        <div className="flex-1 mx-3">
                          <Progress value={Math.round((typedSessions.reduce((sum: number, s: any) => sum + (s.confidenceScore || 80), 0) / typedSessions.length) * 1.1)} className="h-2 bg-blue-100" />
                        </div>
                        <span className="text-sm font-medium text-blue-800">{Math.round((typedSessions.reduce((sum: number, s: any) => sum + (s.confidenceScore || 80), 0) / typedSessions.length) * 1.1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="h-5 w-5 text-emerald-600" />
                      <h4 className="text-lg font-semibold text-emerald-900">Emotional Intelligence</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-700">{((typedSessions.reduce((sum: number, s: any) => sum + (s.empathyScore || 82), 0) / typedSessions.length) / 10).toFixed(1)}</div>
                        <div className="text-xs text-emerald-600">Empathy Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-700">{((typedSessions.reduce((sum: number, s: any) => sum + (s.adaptabilityScore || 78), 0) / typedSessions.length) / 10).toFixed(1)}</div>
                        <div className="text-xs text-emerald-600">Adaptability</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="h-5 w-5 text-amber-600" />
                      <h4 className="text-lg font-semibold text-amber-900">Your Speaker Archetype</h4>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-700 mb-2">
                        {sessionData.averageScore >= 85 ? 'The Expert' : 
                         sessionData.averageScore >= 70 ? 'The Connector' : 
                         sessionData.averageScore >= 55 ? 'The Storyteller' : 'The Learner'}
                      </div>
                      <p className="text-sm text-amber-600 mb-4">
                        {sessionData.averageScore >= 85 ? 'You demonstrate mastery and command authority when speaking.' :
                         sessionData.averageScore >= 70 ? 'You excel at building relationships and creating emotional connections.' :
                         sessionData.averageScore >= 55 ? 'You engage audiences through compelling narratives and examples.' :
                         'You are developing your unique voice and presentation skills.'}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {sessionData.averageScore >= 85 ? (
                          <>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Authoritative</Badge>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Confident</Badge>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Knowledgeable</Badge>
                          </>
                        ) : sessionData.averageScore >= 70 ? (
                          <>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Empathetic</Badge>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Authentic</Badge>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Engaging</Badge>
                          </>
                        ) : sessionData.averageScore >= 55 ? (
                          <>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Creative</Badge>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Narrative</Badge>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Relatable</Badge>
                          </>
                        ) : (
                          <>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Growing</Badge>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Curious</Badge>
                            <Badge className="bg-amber-100 text-amber-700 border-amber-300">Potential</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="h-5 w-5 text-slate-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Growth Opportunities</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {sessionData.averageScore < 70 && (
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#22d3ee] rounded-full"></div>
                          Increase practice frequency to build confidence
                        </li>
                      )}
                      {typedSessions.some((s: any) => (s.voiceClarity || 75) < 80) && (
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#22d3ee] rounded-full"></div>
                          Focus on voice clarity and articulation
                        </li>
                      )}
                      {typedSessions.some((s: any) => (s.speakingPace || 140) > 160) && (
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#22d3ee] rounded-full"></div>
                          Practice pacing for better audience comprehension
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-slate-600 mb-2">Discover Your Speech DNA</h4>
                <p className="text-slate-500 mb-6">Complete at least 3 practice sessions to unlock your personalized communication profile</p>
                <div className="mb-4">
                  <div className="text-lg font-medium text-slate-700">Progress: {typedSessions.length}/3 sessions</div>
                  <Progress value={(typedSessions.length / 3) * 100} className="h-3 bg-slate-200 mt-2" />
                </div>
                <Button className="bg-gradient-to-r from-[#2563eb] to-[#22d3ee] text-white">
                  Start Practicing
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Trends Analysis */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="p-8 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Performance Trends</h3>
            {typedSessions.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Voice Quality', value: typedSessions.reduce((sum: number, s: any) => sum + (s.voiceClarity || 75), 0) / typedSessions.length },
                    { name: 'Body Language', value: typedSessions.reduce((sum: number, s: any) => sum + (s.posture || 70), 0) / typedSessions.length },
                    { name: 'Content Quality', value: typedSessions.reduce((sum: number, s: any) => sum + (s.structureScore || 80), 0) / typedSessions.length },
                    { name: 'Confidence', value: typedSessions.reduce((sum: number, s: any) => sum + (s.confidenceScore || 75), 0) / typedSessions.length }
                  ].map((category, index) => (
                    <div key={category.name} className="p-4 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">{category.name}</span>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="text-2xl font-bold text-slate-800">{Math.round(category.value)}%</div>
                      <div className="text-xs text-emerald-600">Across {typedSessions.length} sessions</div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
                  <h4 className="text-lg font-semibold text-emerald-900 mb-4">Recent Progress</h4>
                  <div className="space-y-3">
                    {typedSessions.slice(0, 3).map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                        <div>
                          <div className="font-medium text-slate-800">{session.name || `Session ${session.id}`}</div>
                          <div className="text-sm text-slate-500">{formatDate(session.createdAt)}</div>
                        </div>
                        <Badge className={getScoreColor(session.confidenceScore || 75)}>
                          {session.confidenceScore || 75}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No trend data available</p>
                <p className="text-sm text-slate-400 mt-2">Complete more sessions to see your progress trends</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}