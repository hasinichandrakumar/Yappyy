import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Mic, 
  FileText, 
  Heart, 
  PlayCircle, 
  PauseCircle,
  Volume2,
  Maximize2,
  SkipBack,
  SkipForward,
  Eye,
  TrendingUp,
  Brain,
  Users,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  Loader2,
  BarChart3,
  Clock,
  Award
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

export default function EnhancedAnalysisWithTabs() {
  const [selectedSession, setSelectedSession] = useState('all');
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

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
  const currentSession = selectedSession !== 'all' ? filteredSessions[0] : null;

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
      setSelectedSession('all');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the session. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate AI insights for selected session
  const generateInsights = async () => {
    if (selectedSession === 'all' || !currentSession) return;
    
    setIsGeneratingInsights(true);
    
    try {
      const response = await fetch('/api/sessions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSession.id }),
      });
      
      if (response.ok) {
        const insights = await response.json();
        setAiInsights(insights);
        toast({
          title: "Analysis Complete",
          description: "AI insights generated successfully.",
        });
      }
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

  // Video playback controls
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Prepare data for charts with actual session metrics - ensuring accurate data mapping
  const bodyLanguageData = currentSession ? [
    { 
      metric: 'Posture', 
      score: currentSession.postureScore !== undefined && currentSession.postureScore !== null 
        ? Math.round(currentSession.postureScore * (currentSession.postureScore <= 1 ? 100 : 1)) 
        : 0, 
      fullMark: 100 
    },
    { 
      metric: 'Gestures', 
      score: currentSession.gestureScore !== undefined && currentSession.gestureScore !== null
        ? Math.round(currentSession.gestureScore * (currentSession.gestureScore <= 1 ? 100 : 1))
        : 0, 
      fullMark: 100 
    },
    { 
      metric: 'Eye Contact', 
      score: currentSession.eyeContactScore !== undefined && currentSession.eyeContactScore !== null
        ? (typeof currentSession.eyeContactScore === 'string' 
            ? parseFloat(currentSession.eyeContactScore) 
            : currentSession.eyeContactScore * (currentSession.eyeContactScore <= 1 ? 100 : 1))
        : 0, 
      fullMark: 100 
    },
    { 
      metric: 'Facial Expression', 
      score: currentSession.facialAnalysis?.expressiveness || 
             (currentSession.facialAnalysis?.emotions?.confidence ? currentSession.facialAnalysis.emotions.confidence * 100 : 0), 
      fullMark: 100 
    },
    { 
      metric: 'Confidence', 
      score: currentSession.confidenceScore !== undefined && currentSession.confidenceScore !== null
        ? Math.round(currentSession.confidenceScore * (currentSession.confidenceScore <= 1 ? 100 : 1))
        : 0, 
      fullMark: 100 
    },
    { 
      metric: 'Overall', 
      score: currentSession.overallScore !== undefined && currentSession.overallScore !== null
        ? Math.round(currentSession.overallScore * (currentSession.overallScore <= 1 ? 100 : 1))
        : Math.round((currentSession.confidenceScore || 0) * (currentSession.confidenceScore <= 1 ? 100 : 1)), 
      fullMark: 100 
    }
  ] : [];

  const voiceMetricsData = currentSession ? [
    { 
      name: 'Clarity', 
      value: currentSession.voiceClarity !== undefined && currentSession.voiceClarity !== null
        ? Math.round(currentSession.voiceClarity * (currentSession.voiceClarity <= 1 ? 100 : 1))
        : (currentSession.clarityScore !== undefined && currentSession.clarityScore !== null
            ? Math.round(currentSession.clarityScore * (currentSession.clarityScore <= 1 ? 100 : 1))
            : 0),
      color: '#8B5CF6' 
    },
    { 
      name: 'Pace', 
      value: currentSession.averageWPM || currentSession.wordsPerMinute 
        ? Math.min(100, Math.round(((currentSession.averageWPM || currentSession.wordsPerMinute) / 180) * 100)) 
        : (currentSession.paceScore !== undefined && currentSession.paceScore !== null
            ? Math.round(currentSession.paceScore * (currentSession.paceScore <= 1 ? 100 : 1))
            : 0), 
      color: '#3B82F6' 
    },
    { 
      name: 'Volume', 
      value: currentSession.volumeConsistency !== undefined && currentSession.volumeConsistency !== null
        ? Math.round(currentSession.volumeConsistency * (currentSession.volumeConsistency <= 1 ? 100 : 1))
        : 0, 
      color: '#10B981' 
    },
    { 
      name: 'Intonation', 
      value: currentSession.intonationScore !== undefined && currentSession.intonationScore !== null
        ? Math.round(currentSession.intonationScore * (currentSession.intonationScore <= 1 ? 100 : 1))
        : 0, 
      color: '#F59E0B' 
    },
    { 
      name: 'Pace Score', 
      value: currentSession.paceScore !== undefined && currentSession.paceScore !== null
        ? Math.round(currentSession.paceScore * (currentSession.paceScore <= 1 ? 100 : 1))
        : 0, 
      color: '#EF4444' 
    }
  ] : [];

  // Extract additional metrics from JSON fields
  const speechPatterns = currentSession?.speechPatterns || {};
  const bodyLanguageMetrics = currentSession?.bodyLanguageMetrics || {};
  const voiceAnalysisMetrics = currentSession?.voiceMetrics || {};
  const aiAnalysisData = currentSession?.aiAnalysis || {};
  const emotionalIntelligence = currentSession?.emotionalIntelligence || {};

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
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">No Practice Sessions Yet</h2>
            <p className="text-slate-600 max-w-md">
              Complete your first practice session to see detailed analytics here.
            </p>
            <Alert className="max-w-md">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Go to the Practice tab and complete a session to see your analysis here.
              </AlertDescription>
            </Alert>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Selector Header */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Session Analysis</h2>
            <p className="text-lg font-semibold text-slate-700">
              {sessionCount} session{sessionCount !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {typedSessions.map((session: any) => (
                  <SelectItem key={session.id} value={session.id.toString()}>
                    Session {session.id} - {new Date(session.createdAt).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSession !== 'all' && (
              <>
                <Button
                  onClick={generateInsights}
                  disabled={isGeneratingInsights}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                >
                  {isGeneratingInsights ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate AI Insights
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteSessionMutation.mutate(parseInt(selectedSession))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Analysis Tabs - Only show when a specific session is selected */}
      {selectedSession !== 'all' && currentSession && (
        <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="body" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="body" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Body
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Voice
                </TabsTrigger>
                <TabsTrigger value="transcript" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Transcript
                </TabsTrigger>
                <TabsTrigger value="emotional" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Emotional
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Video
                </TabsTrigger>
              </TabsList>

              {/* Body Analysis Tab */}
              <TabsContent value="body" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Overall Body Language Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Overall Body Language
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="relative w-32 h-32">
                            <svg className="w-32 h-32 transform -rotate-90">
                              <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                              <circle
                                cx="64" cy="64" r="56"
                                stroke="#3B82F6" strokeWidth="12" fill="none"
                                strokeDasharray={`${2 * Math.PI * 56}`}
                                strokeDashoffset={`${2 * Math.PI * 56 * (1 - (currentSession.overallScore || currentSession.confidenceScore || 0))}`}
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-3xl font-bold">
                                {currentSession.overallScore !== undefined && currentSession.overallScore !== null
                                  ? Math.round(currentSession.overallScore * (currentSession.overallScore <= 1 ? 100 : 1))
                                  : Math.round((currentSession.confidenceScore || 0) * (currentSession.confidenceScore <= 1 ? 100 : 1))}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Posture</span>
                              <span>{currentSession.postureScore !== undefined && currentSession.postureScore !== null
                                ? Math.round(currentSession.postureScore * (currentSession.postureScore <= 1 ? 100 : 1))
                                : 0}%</span>
                            </div>
                            <Progress value={currentSession.postureScore !== undefined && currentSession.postureScore !== null
                              ? Math.round(currentSession.postureScore * (currentSession.postureScore <= 1 ? 100 : 1))
                              : 0} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Gestures</span>
                              <span>{currentSession.gestureScore !== undefined && currentSession.gestureScore !== null
                                ? Math.round(currentSession.gestureScore * (currentSession.gestureScore <= 1 ? 100 : 1))
                                : 0}%</span>
                            </div>
                            <Progress value={currentSession.gestureScore !== undefined && currentSession.gestureScore !== null
                              ? Math.round(currentSession.gestureScore * (currentSession.gestureScore <= 1 ? 100 : 1))
                              : 0} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Eye Contact</span>
                              <span>{currentSession.eyeContactScore !== undefined && currentSession.eyeContactScore !== null
                                ? (typeof currentSession.eyeContactScore === 'string' 
                                    ? parseFloat(currentSession.eyeContactScore)
                                    : Math.round(currentSession.eyeContactScore * (currentSession.eyeContactScore <= 1 ? 100 : 1)))
                                : 0}%</span>
                            </div>
                            <Progress value={currentSession.eyeContactScore !== undefined && currentSession.eyeContactScore !== null
                              ? (typeof currentSession.eyeContactScore === 'string' 
                                  ? parseFloat(currentSession.eyeContactScore)
                                  : Math.round(currentSession.eyeContactScore * (currentSession.eyeContactScore <= 1 ? 100 : 1)))
                              : 0} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Body Language Radar Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-500" />
                        Body Language Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={bodyLanguageData}>
                          <PolarGrid stroke="#E5E7EB" />
                          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                          <Radar name="Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Key Insights */}
                {aiInsights?.bodyLanguageAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-green-500" />
                        Body Language Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiInsights.bodyLanguageAnalysis.strengths?.map((strength: string, index: number) => (
                          <Alert key={index} className="border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">{strength}</AlertDescription>
                          </Alert>
                        ))}
                        {aiInsights.bodyLanguageAnalysis.improvements?.map((improvement: string, index: number) => (
                          <Alert key={index} className="border-amber-200 bg-amber-50">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-amber-800">{improvement}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Voice Analysis Tab */}
              <TabsContent value="voice" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Voice Metrics Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-indigo-500" />
                        Voice Quality Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={voiceMetricsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {voiceMetricsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Speech Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Speech Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">Words Per Minute</p>
                            <p className="text-2xl font-bold">{currentSession.averageWPM || currentSession.wordsPerMinute || 0}</p>
                            <Badge variant={
                              (currentSession.averageWPM || currentSession.wordsPerMinute || 0) > 140 && 
                              (currentSession.averageWPM || currentSession.wordsPerMinute || 0) < 180 
                                ? "default" 
                                : "secondary"
                            }>
                              {(currentSession.averageWPM || currentSession.wordsPerMinute || 0) > 180 ? "Too Fast" : 
                               (currentSession.averageWPM || currentSession.wordsPerMinute || 0) < 140 ? "Too Slow" : "Optimal"}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">Filler Words</p>
                            <p className="text-2xl font-bold">{currentSession.fillerWords || currentSession.fillerWordCount || 0}</p>
                            <Badge variant={(currentSession.fillerWords || currentSession.fillerWordCount || 0) < 5 ? "default" : "destructive"}>
                              {(currentSession.fillerWords || currentSession.fillerWordCount || 0) < 5 ? "Excellent" : "Needs Work"}
                            </Badge>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Clarity</span>
                              <span className="text-sm font-medium">{
                                currentSession.voiceClarity !== undefined && currentSession.voiceClarity !== null
                                  ? Math.round(currentSession.voiceClarity * (currentSession.voiceClarity <= 1 ? 100 : 1))
                                  : (currentSession.clarityScore !== undefined && currentSession.clarityScore !== null
                                      ? Math.round(currentSession.clarityScore * (currentSession.clarityScore <= 1 ? 100 : 1))
                                      : 0)
                              }%</span>
                            </div>
                            <Progress value={
                              currentSession.voiceClarity !== undefined && currentSession.voiceClarity !== null
                                ? Math.round(currentSession.voiceClarity * (currentSession.voiceClarity <= 1 ? 100 : 1))
                                : (currentSession.clarityScore !== undefined && currentSession.clarityScore !== null
                                    ? Math.round(currentSession.clarityScore * (currentSession.clarityScore <= 1 ? 100 : 1))
                                    : 0)
                            } className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Volume Consistency</span>
                              <span className="text-sm font-medium">{
                                currentSession.volumeConsistency !== undefined && currentSession.volumeConsistency !== null
                                  ? Math.round(currentSession.volumeConsistency * (currentSession.volumeConsistency <= 1 ? 100 : 1))
                                  : 0
                              }%</span>
                            </div>
                            <Progress value={
                              currentSession.volumeConsistency !== undefined && currentSession.volumeConsistency !== null
                                ? Math.round(currentSession.volumeConsistency * (currentSession.volumeConsistency <= 1 ? 100 : 1))
                                : 0
                            } className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Intonation</span>
                              <span className="text-sm font-medium">{
                                currentSession.intonationScore !== undefined && currentSession.intonationScore !== null
                                  ? Math.round(currentSession.intonationScore * (currentSession.intonationScore <= 1 ? 100 : 1))
                                  : 0
                              }%</span>
                            </div>
                            <Progress value={
                              currentSession.intonationScore !== undefined && currentSession.intonationScore !== null
                                ? Math.round(currentSession.intonationScore * (currentSession.intonationScore <= 1 ? 100 : 1))
                                : 0
                            } className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Pace Score</span>
                              <span className="text-sm font-medium">{
                                currentSession.paceScore !== undefined && currentSession.paceScore !== null
                                  ? Math.round(currentSession.paceScore * (currentSession.paceScore <= 1 ? 100 : 1))
                                  : 0
                              }%</span>
                            </div>
                            <Progress value={
                              currentSession.paceScore !== undefined && currentSession.paceScore !== null
                                ? Math.round(currentSession.paceScore * (currentSession.paceScore <= 1 ? 100 : 1))
                                : 0
                            } className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Transcript Tab */}
              <TabsContent value="transcript" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      Speech Transcript
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Transcript Stats */}
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <Badge variant="secondary">
                          {currentSession.fillerWords || currentSession.fillerWordCount || 0} Total Filler Words
                        </Badge>
                        {currentSession.fillerWordsUh !== undefined && (
                          <Badge variant="outline">
                            {currentSession.fillerWordsUh} "Uh"
                          </Badge>
                        )}
                        {currentSession.fillerWordsLike !== undefined && (
                          <Badge variant="outline">
                            {currentSession.fillerWordsLike} "Like"
                          </Badge>
                        )}
                        {currentSession.fillerWordsSo !== undefined && (
                          <Badge variant="outline">
                            {currentSession.fillerWordsSo} "So"
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          {currentSession.averageWPM || currentSession.wordsPerMinute || 0} WPM
                        </Badge>
                        <Badge variant="secondary">
                          {formatTime(currentSession.duration || 0)} Duration
                        </Badge>
                        <Badge variant="secondary">
                          {currentSession.pauseCount || 0} Pauses
                        </Badge>
                      </div>

                      {/* Transcript Content */}
                      <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                        <div className="text-base leading-relaxed">
                          {currentSession.transcript ? (
                            currentSession.transcript.split(' ').map((word: string, index: number) => {
                              const isFillerWord = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically']
                                .some(filler => word.toLowerCase().includes(filler));
                              
                              return (
                                <span
                                  key={index}
                                  className={`${
                                    isFillerWord ? 'bg-yellow-200 px-1 rounded cursor-pointer hover:bg-yellow-300' : ''
                                  } ${selectedWord === word ? 'bg-blue-200' : ''}`}
                                  onClick={() => setSelectedWord(word)}
                                >
                                  {word}{' '}
                                </span>
                              );
                            })
                          ) : (
                            <p className="text-gray-500 text-center">No transcript available for this session.</p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Emotional Impact Tab */}
              <TabsContent value="emotional" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Emotional Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Emotional Impact Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center">
                        <div className="relative w-32 h-32">
                          <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="#FEE2E2" strokeWidth="12" fill="none" />
                            <circle
                              cx="64" cy="64" r="56"
                              stroke="#EF4444" strokeWidth="12" fill="none"
                              strokeDasharray={`${2 * Math.PI * 56}`}
                              strokeDashoffset={`${2 * Math.PI * 56 * (1 - (
                                currentSession.persuasivenessScore !== undefined && currentSession.persuasivenessScore !== null
                                  ? (currentSession.persuasivenessScore <= 1 ? currentSession.persuasivenessScore : currentSession.persuasivenessScore / 100)
                                  : (aiInsights?.emotionalScore || 0) / 100
                              ))}`}
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold">{
                              currentSession.persuasivenessScore !== undefined && currentSession.persuasivenessScore !== null
                                ? Math.round(currentSession.persuasivenessScore * (currentSession.persuasivenessScore <= 1 ? 100 : 1))
                                : Math.round((aiInsights?.emotionalScore || 0))
                            }%</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-center mt-4 text-gray-600">
                        {(() => {
                          const score = currentSession.persuasivenessScore !== undefined && currentSession.persuasivenessScore !== null
                            ? (currentSession.persuasivenessScore <= 1 ? currentSession.persuasivenessScore : currentSession.persuasivenessScore / 100)
                            : (aiInsights?.emotionalScore || 0) / 100;
                          return score >= 0.8 ? "Highly Engaging" :
                                 score >= 0.6 ? "Good Connection" :
                                 score >= 0.4 ? "Moderate Impact" :
                                 "Needs Improvement";
                        })()}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Emotional Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Emotional Insights & Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Show emotional intelligence metrics if available */}
                        {emotionalIntelligence && Object.keys(emotionalIntelligence).length > 0 && (
                          <div className="grid grid-cols-2 gap-3 pb-3 border-b">
                            {emotionalIntelligence.audienceConnection && (
                              <div>
                                <p className="text-sm text-gray-600">Audience Connection</p>
                                <p className="text-lg font-semibold">{Math.round(emotionalIntelligence.audienceConnection * 100)}%</p>
                              </div>
                            )}
                            {emotionalIntelligence.emotionalRange && (
                              <div>
                                <p className="text-sm text-gray-600">Emotional Range</p>
                                <p className="text-lg font-semibold">{Math.round(emotionalIntelligence.emotionalRange * 100)}%</p>
                              </div>
                            )}
                            {emotionalIntelligence.authenticity && (
                              <div>
                                <p className="text-sm text-gray-600">Authenticity</p>
                                <p className="text-lg font-semibold">{Math.round(emotionalIntelligence.authenticity * 100)}%</p>
                              </div>
                            )}
                            {emotionalIntelligence.impact && (
                              <div>
                                <p className="text-sm text-gray-600">Impact</p>
                                <p className="text-lg font-semibold">{Math.round(emotionalIntelligence.impact * 100)}%</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Show coaching tips if available */}
                        {currentSession.coachingTips && currentSession.coachingTips.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Coaching Tips:</p>
                            {currentSession.coachingTips.slice(0, 3).map((tip: string, index: number) => (
                              <Alert key={index} className="border-blue-200 bg-blue-50">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-800">{tip}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        ) : (
                          aiInsights?.emotionalInsights ? (
                            <div className="space-y-3">
                              {aiInsights.emotionalInsights.map((insight: string, index: number) => (
                                <Alert key={index}>
                                  <Info className="h-4 w-4" />
                                  <AlertDescription>{insight}</AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">Click "Generate AI Insights" to see detailed emotional analysis.</p>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Video Replay Tab */}
              <TabsContent value="video" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlayCircle className="w-5 h-5 text-green-500" />
                      Session Video Replay
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Video Player */}
                      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                        {currentSession.videoUrl ? (
                          <video
                            ref={videoRef}
                            src={currentSession.videoUrl}
                            className="w-full h-full"
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <div className="text-center">
                              <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <p>No video available for this session</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Video Controls */}
                      {currentSession.videoUrl && (
                        <div className="space-y-4">
                          {/* Progress Bar */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
                            <input
                              type="range"
                              min={0}
                              max={duration}
                              value={currentTime}
                              onChange={(e) => handleSeek(Number(e.target.value))}
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-600">{formatTime(duration)}</span>
                          </div>

                          {/* Control Buttons */}
                          <div className="flex items-center justify-center gap-4">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                            >
                              <SkipBack className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="default"
                              size="lg"
                              onClick={togglePlayPause}
                              className="px-8"
                            >
                              {isPlaying ? (
                                <>
                                  <PauseCircle className="w-5 h-5 mr-2" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="w-5 h-5 mr-2" />
                                  Play
                                </>
                              )}
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
                            >
                              <SkipForward className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Volume Control */}
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 text-gray-600" />
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.1}
                              value={volume}
                              onChange={(e) => setVolume(Number(e.target.value))}
                              className="w-32"
                            />
                          </div>
                        </div>
                      )}

                      {/* Session Metadata */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {Math.round((currentSession.overallScore || currentSession.confidenceScore || 0) * 100)}%
                          </p>
                          <p className="text-sm text-gray-600">Overall Score</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{currentSession.averageWPM || currentSession.wordsPerMinute || 0}</p>
                          <p className="text-sm text-gray-600">Words/Min</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{currentSession.fillerWords || currentSession.fillerWordCount || 0}</p>
                          <p className="text-sm text-gray-600">Filler Words</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{formatTime(currentSession.duration || 0)}</p>
                          <p className="text-sm text-gray-600">Duration</p>
                        </div>
                      </div>
                      
                      {/* Additional session details */}
                      {(currentSession.purpose || currentSession.name) && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          {currentSession.name && (
                            <p className="text-sm">
                              <span className="font-medium">Session Name:</span> {currentSession.name}
                            </p>
                          )}
                          {currentSession.purpose && (
                            <p className="text-sm mt-1">
                              <span className="font-medium">Purpose:</span> {currentSession.purpose}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Summary view when "All Sessions" is selected */}
      {selectedSession === 'all' && sessionCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {typedSessions.slice(0, 6).map((session: any) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedSession(session.id.toString())}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Session {session.sessionNumber || session.id}</span>
                  <Badge>{new Date(session.createdAt).toLocaleDateString()}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Session name/purpose if available */}
                  {(session.name || session.purpose) && (
                    <div className="pb-2 border-b">
                      {session.name && (
                        <p className="text-sm font-medium text-gray-900 truncate">{session.name}</p>
                      )}
                      {session.purpose && (
                        <p className="text-xs text-gray-600 truncate">{session.purpose}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Key metrics */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-semibold">{formatTime(session.duration || 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">WPM</p>
                      <p className="font-semibold">{session.averageWPM || session.wordsPerMinute || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Overall</p>
                      <p className="font-semibold">{Math.round((session.overallScore || session.confidenceScore || 0) * 100)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Filler Words</p>
                      <p className="font-semibold">{session.fillerWords || session.fillerWordCount || 0}</p>
                    </div>
                  </div>
                  
                  {/* Performance indicators */}
                  <div className="flex gap-2 flex-wrap">
                    {session.voiceClarity && session.voiceClarity > 0.8 && (
                      <Badge variant="default" className="text-xs">Clear Voice</Badge>
                    )}
                    {(session.fillerWords || session.fillerWordCount || 0) < 5 && (
                      <Badge variant="default" className="text-xs">Minimal Fillers</Badge>
                    )}
                    {session.eyeContactScore && parseFloat(session.eyeContactScore) > 80 && (
                      <Badge variant="default" className="text-xs">Good Eye Contact</Badge>
                    )}
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View Analysis
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}