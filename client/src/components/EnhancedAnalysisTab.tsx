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
  Pause,
  Trophy,
  Lightbulb,
  Smile,
  Star,
  Video,
  RotateCcw,
  User
} from 'lucide-react';

import VideoSessionPlayer from './VideoSessionPlayer';
import VideoRewatchDialog from './VideoRewatchDialog';

export default function EnhancedAnalysisTab() {
  const [selectedSession, setSelectedSession] = useState('all');
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedVideoSession, setSelectedVideoSession] = useState<any>(null);
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
        description: "The practice session has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the session. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate AI insights for selected session
  const generateInsights = async () => {
    if (selectedSession === 'all') return;
    
    const session = filteredSessions[0];
    if (!session) return;

    setIsGeneratingInsights(true);
    
    try {
      // Generate content-based feedback while we work on AI integration
      const feedback = generateEnhancedContentBasedFeedback(session.transcript || '', session);
      setAiInsights(feedback);
      
      toast({
        title: "Analysis Complete",
        description: "Your speaking session has been analyzed with insights ready.",
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-slate-600">Loading sessions...</span>
      </div>
    );
  }

  if (sessionCount === 0) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 bg-gradient-to-br from-[#2563eb] to-[#22d3ee] rounded-full flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">No Practice Sessions Yet</h2>
            <p className="text-slate-600 max-w-md">
              Complete your first practice session to see detailed analytics, transcripts, and AI-powered insights here.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
              <div className="flex items-center gap-2 text-blue-700 font-medium">
                <Info className="w-4 h-4" />
                How to get started
              </div>
              <p className="text-blue-600 text-sm mt-1">
                Go to Practice tab → Click "Start Practice" → End session → Return here to view your analytics
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Session Selector */}
        <Card className="p-6 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Speaking Analysis</h2>
              <p className="text-lg font-semibold text-slate-700">Detailed insights into your speaking performance ({sessionCount} session{sessionCount !== 1 ? 's' : ''})</p>
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
                        AI Analysis
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const session = filteredSessions[0];
                      if (session) {
                        setSelectedVideoSession(session);
                        setVideoDialogOpen(true);
                      }
                    }}
                    variant="outline"
                    className="border-slate-300"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Watch Recording
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Analysis Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {selectedSession === 'all' ? (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Session Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{sessionCount}</div>
                    <div className="text-sm text-blue-800">Total Sessions</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(typedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessionCount || 0)}s
                    </div>
                    <div className="text-sm text-green-800">Avg Duration</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {typedSessions.filter(s => s.transcript && s.transcript.length > 50).length}
                    </div>
                    <div className="text-sm text-purple-800">With Content</div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Session Details</h3>
                {filteredSessions[0] && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600">Session Name</label>
                        <p className="text-lg">{filteredSessions[0].name || `Session ${filteredSessions[0].id}`}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Date</label>
                        <p className="text-lg">{new Date(filteredSessions[0].createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Duration</label>
                      <p className="text-lg">{filteredSessions[0].duration || 0} seconds</p>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transcript" className="space-y-4">
            {selectedSession !== 'all' && filteredSessions[0] ? (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Session Transcript</h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700 leading-relaxed">
                    {filteredSessions[0].transcript || "No transcript available for this session."}
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <Info className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Select Individual Session</h3>
                <p className="text-slate-500">Choose a specific session to view its transcript</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
              <p className="text-slate-600">Detailed metrics will be available once AI analysis is complete.</p>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            {aiInsights ? (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">AI-Generated Feedback</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600">Strengths</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {aiInsights.mainFeedback?.strengths?.map((strength: string, index: number) => (
                        <li key={index} className="text-slate-700">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-600">Areas for Improvement</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {aiInsights.mainFeedback?.improvements?.map((improvement: string, index: number) => (
                        <li key={index} className="text-slate-700">{improvement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ) : selectedSession !== 'all' ? (
              <Card className="p-6 text-center">
                <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">AI Analysis Ready</h3>
                <p className="text-slate-500 mb-4">Click "AI Analysis" to generate detailed feedback for this session</p>
                <Button onClick={generateInsights} disabled={isGeneratingInsights}>
                  {isGeneratingInsights ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start AI Analysis
                    </>
                  )}
                </Button>
              </Card>
            ) : (
              <Card className="p-6 text-center">
                <Info className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Select Individual Session</h3>
                <p className="text-slate-500">Choose a specific session to view AI-generated feedback</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Rewatch Dialog */}
      <VideoRewatchDialog
        isOpen={videoDialogOpen}
        onClose={() => setVideoDialogOpen(false)}
        sessionId={selectedVideoSession?.id || 0}
        sessionName={selectedVideoSession?.sessionName || selectedVideoSession?.name || "Practice Session"}
        transcript={selectedVideoSession?.transcript}
      />
    </div>
  );
}

// Content-based feedback generator for when AI is unavailable
function generateEnhancedContentBasedFeedback(transcript: string, session: any) {
  const purpose = session.purpose || session.sessionName || 'General Practice';
  
  if (!transcript || transcript.length < 10) {
    return {
      mainFeedback: {
        strengths: ["Session completed successfully"],
        improvements: ["Try speaking more during the session to get detailed content feedback"],
        recommendations: [{
          category: "Content",
          suggestion: "Aim for longer speaking sessions to analyze content structure",
          priority: "Medium"
        }]
      },
      speechPatterns: {
        paceAnalysis: {
          insight: "Limited speech data available for analysis",
          recommendation: "Practice longer sessions for better pattern recognition",
          priority: "Medium"
        }
      },
      contentInsights: {
        structureScore: 50,
        clarityLevel: "Basic",
        engagementFactor: "Limited"
      },
      recommendations: [{
        category: "Session Length",
        suggestion: "Aim for sessions with more speech content for comprehensive analysis",
        priority: "Medium",
        personalized: true
      }]
    };
  }

  const words = transcript.toLowerCase().split(/\s+/);
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  
  // Basic content analysis
  const strengths = [];
  const improvements = [];
  
  if (words.length > 100) {
    strengths.push("Good session length with substantial content");
  }
  
  if (avgWordsPerSentence > 8 && avgWordsPerSentence < 20) {
    strengths.push("Well-structured sentences with appropriate length");
  } else if (avgWordsPerSentence <= 8) {
    improvements.push("Consider using more detailed explanations");
  } else {
    improvements.push("Try breaking down complex ideas into shorter sentences");
  }

  return {
    mainFeedback: {
      strengths: strengths.length > 0 ? strengths : ["Completed speaking session"],
      improvements: improvements.length > 0 ? improvements : ["Continue practicing for more personalized feedback"],
      recommendations: [{
        category: "Content Development",
        suggestion: `Focus on ${purpose.toLowerCase()} specific content structure`,
        priority: "Medium"
      }]
    },
    speechPatterns: {
      paceAnalysis: {
        insight: `Session contained ${words.length} words across ${sentences.length} sentences`,
        recommendation: "Continue practicing to develop natural speaking rhythm",
        priority: "Medium"
      }
    },
    contentInsights: {
      structureScore: Math.min(90, Math.max(60, Math.round((words.length / 50) * 10))),
      clarityLevel: avgWordsPerSentence > 15 ? "Detailed" : "Clear",
      engagementFactor: words.length > 200 ? "Engaging" : "Developing"
    }
  };
}