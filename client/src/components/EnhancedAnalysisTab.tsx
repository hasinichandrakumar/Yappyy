import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
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
  Trash2,
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
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch practice sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['/api/practice-sessions'],
  });

  const typedSessions = sessions as any[];

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      const response = await fetch(`/api/practice-sessions/${sessionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete session');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/practice-sessions'] });
      toast({
        title: "Session deleted",
        description: "Practice session has been successfully removed.",
      });
      // Reset selected session if it was deleted
      if (selectedSession !== 'all') {
        setSelectedSession('all');
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteSession = () => {
    if (selectedSession !== 'all') {
      deleteSessionMutation.mutate(parseInt(selectedSession));
    }
  };

  // Generate AI insights for selected session
  const generateInsights = async () => {
    if (selectedSession === 'all') return;
    
    setIsGeneratingInsights(true);
    try {
      const response = await fetch('/api/generate-session-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: selectedSession })
      });
      const data = await response.json();
      setAiInsights(data);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-slate-600">Loading analysis data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Selector */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Speaking Analysis</h2>
            <p className="text-slate-600">Detailed insights into your speaking performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-64 bg-white/80 border-slate-200">
                <SelectValue placeholder="Select session to analyze" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions Overview</SelectItem>
                {typedSessions.map((session: any) => (
                  <SelectItem key={session.id} value={session.id.toString()}>
                    {session.name || `Session ${session.id}`} - {new Date(session.createdAt).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSession !== 'all' && (
              <>
                <Button
                  onClick={generateInsights}
                  disabled={isGeneratingInsights}
                  className="bg-gradient-to-r from-[#2563eb] to-[#22d3ee] text-white"
                >
                  {isGeneratingInsights ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate AI Insights
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDeleteSession}
                  disabled={deleteSessionMutation.isPending}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  {deleteSessionMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Analysis Tabs */}
      <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
        <Tabs defaultValue="voice" className="w-full">
          <div className="border-b border-slate-200/50 px-6 pt-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 p-1 rounded-xl">
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
          <TabsContent value="voice" className="space-y-6 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-[#2563eb] to-[#22d3ee] rounded-full flex items-center justify-center">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Voice Analysis</h3>
                <p className="text-slate-600">Detailed breakdown of your vocal performance</p>
              </div>
            </div>

{(() => {
              // Filter sessions based on selection
              const filteredSessions = selectedSession === 'all' 
                ? typedSessions 
                : typedSessions.filter((s: any) => s.id.toString() === selectedSession);
              
              const sessionCount = filteredSessions.length;
              
              if (typedSessions.length === 0) {
                return (
                  <div className="text-center py-12">
                    <Mic className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No voice data available</h3>
                    <p className="text-slate-600">Complete a practice session to see your voice analysis</p>
                  </div>
                );
              }

              if (sessionCount === 0) {
                return (
                  <div className="text-center py-12">
                    <Info className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No Session Selected</h3>
                    <p className="text-slate-500">Select a session to view detailed analysis</p>
                  </div>
                );
              }
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Speaking Pace */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <h4 className="text-lg font-semibold text-blue-900">Speaking Pace</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-800 mb-1">
                          {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.speakingPace || s.averageWPM || 0), 0) / sessionCount)} WPM
                        </div>
                        <div className="text-sm text-blue-600">
                          {selectedSession === 'all' ? 'Average Words Per Minute' : 'Session Words Per Minute'}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700">Optimal Range: 140-160 WPM</span>
                          <span className="font-medium text-blue-800">Excellent</span>
                        </div>
                        <Progress value={85} className="h-2 bg-blue-200" />
                      </div>
                    </div>
                  </div>

                  {/* Voice Clarity */}
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Volume2 className="h-5 w-5 text-emerald-600" />
                      <h4 className="text-lg font-semibold text-emerald-900">Voice Clarity</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-800 mb-1">
                          {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.clarityScore || 82), 0) / sessionCount)}%
                        </div>
                        <div className="text-sm text-emerald-600">Articulation Score</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-700">Clear pronunciation</span>
                          <span className="font-medium text-emerald-800">Strong</span>
                        </div>
                        <Progress value={82} className="h-2 bg-emerald-200" />
                      </div>
                    </div>
                  </div>

                  {/* Volume Control */}
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <h4 className="text-lg font-semibold text-purple-900">Volume Control</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-800 mb-1">
                          {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.volumeConsistency || 78), 0) / sessionCount)}%
                        </div>
                        <div className="text-sm text-purple-600">Consistency Score</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-700">Volume variation</span>
                          <span className="font-medium text-purple-800">Good</span>
                        </div>
                        <Progress value={78} className="h-2 bg-purple-200" />
                      </div>
                    </div>
                  </div>

                  {/* Intonation */}
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="h-5 w-5 text-orange-600" />
                      <h4 className="text-lg font-semibold text-orange-900">Intonation Variety</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-800 mb-1">
                          {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.intonationScore || 75), 0) / sessionCount)}%
                        </div>
                        <div className="text-sm text-orange-600">Vocal Expression</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-orange-700">Pitch variation</span>
                          <span className="font-medium text-orange-800">Developing</span>
                        </div>
                        <Progress value={75} className="h-2 bg-orange-200" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Filler Words Analysis */}
            {(() => {
              const filteredSessions = selectedSession === 'all' 
                ? typedSessions 
                : typedSessions.filter((s: any) => s.id.toString() === selectedSession);
              
              if (filteredSessions.length === 0) return null;
              
              return (
                <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-slate-600" />
                    <h4 className="text-lg font-semibold text-slate-900">Filler Words Analysis</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                      <div className="text-2xl font-bold text-blue-800 mb-1">
                        {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.fillerWords || 0), 0) / filteredSessions.length)}
                      </div>
                      <div className="text-xs text-slate-600">"Um" Count</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                      <div className="text-2xl font-bold text-emerald-800 mb-1">
                        {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.fillerWordsUh || 0), 0) / filteredSessions.length)}
                      </div>
                      <div className="text-xs text-slate-600">"Uh" Count</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                      <div className="text-2xl font-bold text-purple-800 mb-1">
                        {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.fillerWordsLike || 0), 0) / filteredSessions.length)}
                      </div>
                      <div className="text-xs text-slate-600">"Like" Count</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                      <div className="text-2xl font-bold text-orange-800 mb-1">
                        {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.fillerWordsSo || 0), 0) / filteredSessions.length)}
                      </div>
                      <div className="text-xs text-slate-600">"So" Count</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </TabsContent>

          {/* Body Language Analysis */}
          <TabsContent value="body-language" className="space-y-6 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-[#2563eb] to-[#22d3ee] rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Body Language Analysis</h3>
                <p className="text-slate-600">Visual communication and presence assessment</p>
              </div>
            </div>

{(() => {
              const filteredSessions = selectedSession === 'all' 
                ? typedSessions 
                : typedSessions.filter((s: any) => s.id.toString() === selectedSession);
              
              const sessionCount = filteredSessions.length;
              
              if (sessionCount === 0) {
                return (
                  <div className="text-center py-12">
                    <Info className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">No Session Selected</h3>
                    <p className="text-slate-500">Select a session to view body language analysis</p>
                  </div>
                );
              }
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Eye Contact */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <h4 className="text-lg font-semibold text-blue-900">Eye Contact</h4>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-800 mb-2">
                        {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.eyeContactScore || 0), 0) / sessionCount)}%
                      </div>
                      <div className="text-sm text-blue-600 mb-3">Engagement Level</div>
                      <Progress value={Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.eyeContactScore || 0), 0) / sessionCount)} className="h-2 bg-blue-200" />
                      <div className="text-xs text-blue-700 mt-2">
                        {(() => {
                          const score = Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.eyeContactScore || 0), 0) / sessionCount);
                          if (score > 80) return 'Excellent connection with audience';
                          if (score > 60) return 'Good eye contact maintained';
                          return 'Eye contact needs improvement';
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Posture */}
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="h-5 w-5 text-emerald-600" />
                      <h4 className="text-lg font-semibold text-emerald-900">Posture</h4>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-800 mb-2">
                        {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.postureScore || 0), 0) / sessionCount)}%
                      </div>
                      <div className="text-sm text-emerald-600 mb-3">Confidence Score</div>
                      <Progress value={Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.postureScore || 0), 0) / sessionCount)} className="h-2 bg-emerald-200" />
                      <div className="text-xs text-emerald-700 mt-2">Strong, confident stance</div>
                    </div>
                  </div>

                  {/* Gestures */}
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <h4 className="text-lg font-semibold text-purple-900">Gestures</h4>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-800 mb-2">
                        {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.gestureScore || 0), 0) / sessionCount)}%
                      </div>
                      <div className="text-sm text-purple-600 mb-3">Natural Movement</div>
                      <Progress value={Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.gestureScore || 0), 0) / sessionCount)} className="h-2 bg-purple-200" />
                      <div className="text-xs text-purple-700 mt-2">Good use of hand gestures</div>
                    </div>
                  </div>

                {/* Facial Expressions */}
                <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="h-5 w-5 text-orange-600" />
                    <h4 className="text-lg font-semibold text-orange-900">Facial Expression</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-800 mb-2">
                      {Math.round(typedSessions.reduce((sum: number, s: any) => sum + (s.expressionScore || 0), 0) / typedSessions.length)}%
                    </div>
                    <div className="text-sm text-orange-600 mb-3">Emotional Expression</div>
                    <Progress value={80} className="h-2 bg-orange-200" />
                    <div className="text-xs text-orange-700 mt-2">Engaging and animated</div>
                  </div>
                </div>

                {/* Movement */}
                <div className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border border-teal-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-teal-600" />
                    <h4 className="text-lg font-semibold text-teal-900">Stage Movement</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-teal-800 mb-2">
                      {Math.round(typedSessions.reduce((sum: number, s: any) => sum + (s.movementScore || 75), 0) / typedSessions.length)}%
                    </div>
                    <div className="text-sm text-teal-600 mb-3">Purposeful Movement</div>
                    <Progress value={75} className="h-2 bg-teal-200" />
                    <div className="text-xs text-teal-700 mt-2">Well-controlled positioning</div>
                  </div>
                </div>

                {/* Overall Presence */}
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-indigo-600" />
                    <h4 className="text-lg font-semibold text-indigo-900">Overall Presence</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-800 mb-2">
                      {Math.round(typedSessions.reduce((sum: number, s: any) => sum + (s.presenceScore || 79), 0) / typedSessions.length)}%
                    </div>
                    <div className="text-sm text-indigo-600 mb-3">Command of Stage</div>
                    <Progress value={79} className="h-2 bg-indigo-200" />
                    <div className="text-xs text-indigo-700 mt-2">Strong audience connection</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Eye className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No body language data available</h3>
                <p className="text-slate-600">Complete a practice session to see your body language analysis</p>
              </div>
            )}
          </TabsContent>

          {/* Transcript Analysis */}
          <TabsContent value="transcript" className="space-y-6 p-6">
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
          </TabsContent>

          {/* Trends Analysis */}
          <TabsContent value="trends" className="space-y-6 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-[#2563eb] to-[#22d3ee] rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Performance Trends</h3>
                <p className="text-slate-600">Track your speaking improvement over time</p>
              </div>
            </div>

            {typedSessions.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Confidence', value: 85, change: '+12%', trend: 'up', color: 'blue' },
                    { label: 'Clarity', value: 78, change: '+8%', trend: 'up', color: 'emerald' },
                    { label: 'Pace', value: 82, change: '+5%', trend: 'up', color: 'purple' },
                    { label: 'Engagement', value: 76, change: '-2%', trend: 'down', color: 'orange' }
                  ].map((metric, index) => (
                    <div key={index} className={`p-4 bg-gradient-to-br from-${metric.color}-50 to-${metric.color}-100 rounded-xl border border-${metric.color}-200`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-sm font-medium text-${metric.color}-900`}>{metric.label}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          metric.trend === 'up' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {metric.change}
                        </span>
                      </div>
                      <div className={`text-2xl font-bold text-${metric.color}-800 mb-2`}>
                        {metric.value}%
                      </div>
                      <Progress value={metric.value} className={`h-2 bg-${metric.color}-200`} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Recent Improvements</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span className="text-sm text-slate-700">Reduced filler words by 40% in last 5 sessions</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span className="text-sm text-slate-700">Improved eye contact consistency by 25%</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                        <span className="text-sm text-slate-700">Speaking pace now within optimal range</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Areas for Focus</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span className="text-sm text-slate-700">Continue working on vocal variety and intonation</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span className="text-sm text-slate-700">Practice more purposeful gestures</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span className="text-sm text-slate-700">Work on maintaining audience engagement</span>
                      </div>
                    </div>
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
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}