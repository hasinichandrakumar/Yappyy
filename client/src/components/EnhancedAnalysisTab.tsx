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
import PDFExportControls from '@/components/PDFExportControls';
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
  Pause,
  Trophy,
  Download
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

  // Filter sessions based on selection
  const filteredSessions = selectedSession === 'all' 
    ? typedSessions 
    : typedSessions.filter((s: any) => s.id.toString() === selectedSession);
  
  const sessionCount = filteredSessions.length;

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
            <TabsList className="grid w-full grid-cols-5 bg-slate-100/50 p-1 rounded-xl">
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
              <TabsTrigger value="export" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#2563eb] data-[state=active]:to-[#22d3ee] data-[state=active]:text-white data-[state=active]:shadow-lg whitespace-nowrap">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">PDF Export</span>
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

            {sessionCount === 0 ? (
              <div className="text-center py-12">
                <Info className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No Session Selected</h3>
                <p className="text-slate-500">Select a session to view detailed analysis</p>
              </div>
            ) : (
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
                        {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.clarityScore || 0), 0) / sessionCount)}%
                      </div>
                      <div className="text-sm text-emerald-600">Articulation Score</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-700">Clear pronunciation</span>
                        <span className="font-medium text-emerald-800">Strong</span>
                      </div>
                      <Progress value={Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.clarityScore || 0), 0) / sessionCount)} className="h-2 bg-emerald-200" />
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
                        {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.volumeConsistency || 0), 0) / sessionCount)}%
                      </div>
                      <div className="text-sm text-purple-600">Consistency Score</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-700">Volume variation</span>
                        <span className="font-medium text-purple-800">Good</span>
                      </div>
                      <Progress value={Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.volumeConsistency || 0), 0) / sessionCount)} className="h-2 bg-purple-200" />
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
                        {Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.intonationScore || 0), 0) / sessionCount)}%
                      </div>
                      <div className="text-sm text-orange-600">Vocal Expression</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-700">Pitch variation</span>
                        <span className="font-medium text-orange-800">Developing</span>
                      </div>
                      <Progress value={Math.round(filteredSessions.reduce((sum: number, s: any) => sum + (s.intonationScore || 0), 0) / sessionCount)} className="h-2 bg-orange-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filler Words Analysis */}
            {sessionCount > 0 && (
              <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-slate-600" />
                  <h4 className="text-lg font-semibold text-slate-900">Filler Words Analysis</h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    // Extract all filler words from sessions and count occurrences
                    const fillerWordCounts: { [key: string]: number } = {};
                    
                    filteredSessions.forEach((session: any) => {
                      // Handle different data structures for filler words
                      let sessionFillers: string[] = [];
                      
                      if (session.fillerWordsDetailed && Array.isArray(session.fillerWordsDetailed)) {
                        sessionFillers = session.fillerWordsDetailed;
                      } else if (session.fillerWords && typeof session.fillerWords === 'number') {
                        // Legacy: if it's just a count, assume it's "um"
                        for (let i = 0; i < session.fillerWords; i++) {
                          sessionFillers.push('um');
                        }
                      } else if (session.transcript) {
                        // Extract from transcript
                        const transcript = session.transcript.toLowerCase();
                        const fillerPatterns = [
                          { word: 'um', regex: /\bum+\b/g },
                          { word: 'uh', regex: /\buh+\b/g },
                          { word: 'like', regex: /\blike\b/g },
                          { word: 'so', regex: /\bso\b/g },
                          { word: 'well', regex: /\bwell\b/g },
                          { word: 'actually', regex: /\bactually\b/g },
                          { word: 'basically', regex: /\bbasically\b/g },
                          { word: 'you know', regex: /\byou know\b/g },
                          { word: 'i mean', regex: /\bi mean\b/g },
                          { word: 'kind of', regex: /\bkind of\b/g },
                          { word: 'sort of', regex: /\bsort of\b/g }
                        ];
                        
                        fillerPatterns.forEach(pattern => {
                          const matches = transcript.match(pattern.regex);
                          if (matches) {
                            for (let i = 0; i < matches.length; i++) {
                              sessionFillers.push(pattern.word);
                            }
                          }
                        });
                      }
                      
                      // Count occurrences
                      sessionFillers.forEach(filler => {
                        fillerWordCounts[filler] = (fillerWordCounts[filler] || 0) + 1;
                      });
                    });
                    
                    // Get top 3 most used filler words
                    const sortedFillers = Object.entries(fillerWordCounts)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3);
                    
                    // If no fillers found, show default structure
                    if (sortedFillers.length === 0) {
                      return [
                        { word: 'um', count: 0, color: 'blue' },
                        { word: 'uh', count: 0, color: 'emerald' },
                        { word: 'like', count: 0, color: 'purple' }
                      ].map((item, index) => (
                        <div key={index} className="text-center p-3 bg-white rounded-lg border border-slate-200">
                          <div className={`text-2xl font-bold text-${item.color}-800 mb-1`}>
                            {item.count}
                          </div>
                          <div className="text-xs text-slate-600 capitalize">"{item.word}" Count</div>
                        </div>
                      ));
                    }
                    
                    // Color palette for top fillers
                    const colors = ['blue', 'emerald', 'purple', 'orange', 'red'];
                    
                    return sortedFillers.map(([filler, count], index) => (
                      <div key={filler} className="text-center p-3 bg-white rounded-lg border border-slate-200">
                        <div className={`text-2xl font-bold text-${colors[index] || 'slate'}-800 mb-1`}>
                          {count}
                        </div>
                        <div className="text-xs text-slate-600 capitalize">
                          "{filler}" Count
                        </div>
                        <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block bg-${colors[index] || 'slate'}-100 text-${colors[index] || 'slate'}-700`}>
                          #{index + 1} Most Used
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                
                {/* Summary Statistics */}
                <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-800 mb-1">
                      Total Filler Words: {(() => {
                        const fillerWordCounts: { [key: string]: number } = {};
                        filteredSessions.forEach((session: any) => {
                          let sessionFillers: string[] = [];
                          if (session.fillerWordsDetailed && Array.isArray(session.fillerWordsDetailed)) {
                            sessionFillers = session.fillerWordsDetailed;
                          } else if (session.fillerWords && typeof session.fillerWords === 'number') {
                            for (let i = 0; i < session.fillerWords; i++) {
                              sessionFillers.push('um');
                            }
                          } else if (session.transcript) {
                            const transcript = session.transcript.toLowerCase();
                            const fillerPatterns = [
                              { word: 'um', regex: /\bum+\b/g },
                              { word: 'uh', regex: /\buh+\b/g },
                              { word: 'like', regex: /\blike\b/g },
                              { word: 'so', regex: /\bso\b/g },
                              { word: 'well', regex: /\bwell\b/g },
                              { word: 'actually', regex: /\bactually\b/g },
                              { word: 'basically', regex: /\bbasically\b/g },
                              { word: 'you know', regex: /\byou know\b/g },
                              { word: 'i mean', regex: /\bi mean\b/g }
                            ];
                            fillerPatterns.forEach(pattern => {
                              const matches = transcript.match(pattern.regex);
                              if (matches) {
                                for (let i = 0; i < matches.length; i++) {
                                  sessionFillers.push(pattern.word);
                                }
                              }
                            });
                          }
                          sessionFillers.forEach(filler => {
                            fillerWordCounts[filler] = (fillerWordCounts[filler] || 0) + 1;
                          });
                        });
                        return Object.values(fillerWordCounts).reduce((sum, count) => sum + count, 0);
                      })()}
                    </div>
                    <div className="text-sm text-slate-600">
                      {selectedSession === 'all' ? 'Across all sessions' : 'In selected session'}
                    </div>
                  </div>
                </div>
              </div>
            )}
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

            {sessionCount === 0 ? (
              <div className="text-center py-12">
                <Info className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No Session Selected</h3>
                <p className="text-slate-500">Select a session to view body language analysis</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Eye Contact */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-blue-900">Eye Contact</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-800 mb-2">
                      {(() => {
                        const total = filteredSessions.reduce((sum: number, s: any) => sum + (s.eyeContactScore || 75), 0);
                        const average = sessionCount > 0 ? total / sessionCount : 75;
                        return Math.round(isNaN(average) ? 75 : average);
                      })()}%
                    </div>
                    <div className="text-sm text-blue-600 mb-3">Engagement Level</div>
                    <Progress value={(() => {
                      const total = filteredSessions.reduce((sum: number, s: any) => sum + (s.eyeContactScore || 75), 0);
                      const average = sessionCount > 0 ? total / sessionCount : 75;
                      return Math.round(isNaN(average) ? 75 : average);
                    })()} className="h-2 bg-blue-200" />
                    <div className="text-xs text-blue-700 mt-2">Good eye contact maintained</div>
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
                      {(() => {
                        const total = filteredSessions.reduce((sum: number, s: any) => sum + (s.postureScore || 80), 0);
                        const average = sessionCount > 0 ? total / sessionCount : 80;
                        return Math.round(isNaN(average) ? 80 : average);
                      })()}%
                    </div>
                    <div className="text-sm text-emerald-600 mb-3">Confidence Score</div>
                    <Progress value={(() => {
                      const total = filteredSessions.reduce((sum: number, s: any) => sum + (s.postureScore || 80), 0);
                      const average = sessionCount > 0 ? total / sessionCount : 80;
                      return Math.round(isNaN(average) ? 80 : average);
                    })()} className="h-2 bg-emerald-200" />
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
                      {(() => {
                        const total = filteredSessions.reduce((sum: number, s: any) => sum + (s.gestureScore || 78), 0);
                        const average = sessionCount > 0 ? total / sessionCount : 78;
                        return Math.round(isNaN(average) ? 78 : average);
                      })()}%
                    </div>
                    <div className="text-sm text-purple-600 mb-3">Natural Movement</div>
                    <Progress value={(() => {
                      const total = filteredSessions.reduce((sum: number, s: any) => sum + (s.gestureScore || 78), 0);
                      const average = sessionCount > 0 ? total / sessionCount : 78;
                      return Math.round(isNaN(average) ? 78 : average);
                    })()} className="h-2 bg-purple-200" />
                    <div className="text-xs text-purple-700 mt-2">Good use of hand gestures</div>
                  </div>
                </div>
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

            {sessionCount > 0 && selectedSession !== 'all' ? (
              <div className="space-y-6">
                {/* Session Info */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200/50">
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-900">
                        {filteredSessions[0]?.name || 'Practice Session'}
                      </h4>
                      <p className="text-sm text-blue-700">
                        Duration: {Math.round((filteredSessions[0]?.duration || 120) / 60)}m {((filteredSessions[0]?.duration || 120) % 60)}s
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {filteredSessions[0]?.overallScore || 0}% Overall
                  </Badge>
                </div>

                {/* Transcript Display */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Speech Transcript with AI Feedback</h4>
                  
                  <div className="space-y-6 max-h-96 overflow-y-auto p-4 bg-slate-50/50 rounded-lg">
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-600 mb-2">No transcript available</h3>
                      <p className="text-slate-500">Transcript data will appear here for recorded sessions</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Info className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Select Individual Session</h3>
                <p className="text-slate-500">Choose a specific session to view its transcript and feedback</p>
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
                <p className="text-slate-600">Track your progress over time across all sessions</p>
              </div>
            </div>

            {typedSessions.length > 0 ? (
              <div className="space-y-6">
                {/* Performance Trends Chart */}
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Overall Performance Over Time</h4>
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 flex items-end space-x-2">
                    {typedSessions.slice(-10).map((session, index) => {
                      const height = ((session.overallScore || 75) / 100) * 200;
                      return (
                        <div key={session.id} className="flex-1 flex flex-col items-center">
                          <div 
                            className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t w-full min-h-4 transition-all hover:opacity-80"
                            style={{ height: `${height}px` }}
                            title={`Session ${index + 1}: ${session.overallScore || 75}%`}
                          />
                          <div className="text-xs text-slate-600 mt-2 text-center">
                            {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 text-sm text-slate-600 text-center">
                    Average Score: {Math.round(typedSessions.reduce((sum, s) => sum + (s.overallScore || 75), 0) / typedSessions.length)}%
                  </div>
                </Card>

                {/* Skill-Based Trends */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Voice Quality Trend */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Mic className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold">Voice Quality</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Current Average</span>
                        <span className="font-bold text-lg text-blue-600">
                          {(() => {
                            const total = typedSessions.reduce((sum, s) => sum + (s.voiceClarity || 80), 0);
                            const average = typedSessions.length > 0 ? total / typedSessions.length : 80;
                            return Math.round(isNaN(average) ? 80 : average);
                          })()}%
                        </span>
                      </div>
                      <Progress 
                        value={(() => {
                          const total = typedSessions.reduce((sum, s) => sum + (s.voiceClarity || 80), 0);
                          const average = typedSessions.length > 0 ? total / typedSessions.length : 80;
                          return Math.round(isNaN(average) ? 80 : average);
                        })()} 
                        className="h-2" 
                      />
                      <div className="text-xs text-slate-600">
                        {typedSessions.length >= 2 && (
                          <>
                            {((typedSessions[typedSessions.length - 1]?.voiceClarity || 80) - (typedSessions[0]?.voiceClarity || 80)) > 0 ? '📈' : '📉'} 
                            {Math.abs((typedSessions[typedSessions.length - 1]?.voiceClarity || 80) - (typedSessions[0]?.voiceClarity || 80)).toFixed(1)}% change from first session
                          </>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Eye Contact Trend */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold">Eye Contact</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Current Average</span>
                        <span className="font-bold text-lg text-purple-600">
                          {(() => {
                            const total = typedSessions.reduce((sum, s) => sum + (s.eyeContactScore || 75), 0);
                            const average = typedSessions.length > 0 ? total / typedSessions.length : 75;
                            return Math.round(isNaN(average) ? 75 : average);
                          })()}%
                        </span>
                      </div>
                      <Progress 
                        value={(() => {
                          const total = typedSessions.reduce((sum, s) => sum + (s.eyeContactScore || 75), 0);
                          const average = typedSessions.length > 0 ? total / typedSessions.length : 75;
                          return Math.round(isNaN(average) ? 75 : average);
                        })()} 
                        className="h-2" 
                      />
                      <div className="text-xs text-slate-600">
                        {typedSessions.length >= 2 && (
                          <>
                            {((typedSessions[typedSessions.length - 1]?.eyeContactScore || 75) - (typedSessions[0]?.eyeContactScore || 75)) > 0 ? '📈' : '📉'} 
                            {Math.abs((typedSessions[typedSessions.length - 1]?.eyeContactScore || 75) - (typedSessions[0]?.eyeContactScore || 75)).toFixed(1)}% change from first session
                          </>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Confidence Trend */}
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold">Confidence</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Current Average</span>
                        <span className="font-bold text-lg text-green-600">
                          {(() => {
                            const total = typedSessions.reduce((sum, s) => sum + (s.confidenceScore || 78), 0);
                            const average = typedSessions.length > 0 ? total / typedSessions.length : 78;
                            return Math.round(isNaN(average) ? 78 : average);
                          })()}%
                        </span>
                      </div>
                      <Progress 
                        value={(() => {
                          const total = typedSessions.reduce((sum, s) => sum + (s.confidenceScore || 78), 0);
                          const average = typedSessions.length > 0 ? total / typedSessions.length : 78;
                          return Math.round(isNaN(average) ? 78 : average);
                        })()} 
                        className="h-2" 
                      />
                      <div className="text-xs text-slate-600">
                        {typedSessions.length >= 2 && (
                          <>
                            {((typedSessions[typedSessions.length - 1]?.confidenceScore || 78) - (typedSessions[0]?.confidenceScore || 78)) > 0 ? '📈' : '📉'} 
                            {Math.abs((typedSessions[typedSessions.length - 1]?.confidenceScore || 78) - (typedSessions[0]?.confidenceScore || 78)).toFixed(1)}% change from first session
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Progress Insights */}
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Progress Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Practice Stats */}
                    <div className="space-y-4">
                      <h5 className="font-medium text-slate-700">Practice Statistics</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Total Sessions</span>
                          <span className="font-semibold">{typedSessions.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Total Practice Time</span>
                          <span className="font-semibold">
                            {Math.round(typedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60)} min
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Average Session Length</span>
                          <span className="font-semibold">
                            {(() => {
                              const total = typedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
                              const average = typedSessions.length > 0 ? total / typedSessions.length : 0;
                              return Math.round(isNaN(average) ? 0 : average / 60);
                            })()} min
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Improvements */}
                    <div className="space-y-4">
                      <h5 className="font-medium text-slate-700">Recent Improvements</h5>
                      <div className="space-y-2">
                        {typedSessions.length >= 3 && (
                          <>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span>Completed {typedSessions.length} practice sessions</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              <span>Consistent practice streak building</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-purple-500 rounded-full" />
                              <span>Performance stability improving</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Info className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No Session Data</h3>
                <p className="text-slate-500">Complete practice sessions to view performance trends</p>
              </div>
            )}
          </TabsContent>

          {/* PDF Export Tab */}
          <TabsContent value="export" className="space-y-6 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-[#2563eb] to-[#22d3ee] rounded-full flex items-center justify-center">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">PDF Export Center</h3>
                <p className="text-slate-600">Download detailed analysis reports and performance summaries</p>
              </div>
            </div>

            <PDFExportControls 
              sessions={typedSessions} 
              selectedSession={selectedSession !== 'all' ? typedSessions.find(s => s.id.toString() === selectedSession) : null}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}