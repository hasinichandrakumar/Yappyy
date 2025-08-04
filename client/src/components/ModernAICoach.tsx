import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Brain, TrendingUp, Target, MessageSquare, Clock, Award, BarChart3, 
  Lightbulb, CheckCircle, AlertTriangle, ArrowUp, ArrowDown, Send,
  Play, Users, BookOpen, Zap, Star, Trophy, Sparkles, Bot,
  Eye, Mic, Activity, PieChart, ArrowRight, Calendar
} from "lucide-react";
import SimpleSessionSelector from "./SimpleSessionSelector";
import SimpleRecordingPlayer from "./SimpleRecordingPlayer";
import { apiRequest } from "@/lib/queryClient";

export default function ModernAICoach() {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [coachingQuestion, setCoachingQuestion] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  const { data: userProgress } = useQuery({
    queryKey: ['/api/user-progress'],
    enabled: true
  });

  // Get AI coaching analysis
  const generateAnalysisMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await fetch('/api/ai-coaching-comprehensive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session: sessionData,
          purpose: sessionData.purpose || 'general_presentation',
          userProgress: userProgress || [],
          previousSessions: (sessions || []).slice(-5)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get coaching analysis');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAiAnalysis(data);
    }
  });

  // Ask AI coach a question
  const askCoachMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await fetch('/api/speech-coaching-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          transcript: selectedSession?.transcript,
          purpose: selectedSession?.purpose || 'general_presentation',
          chatHistory: chatHistory.slice(-6)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get coaching response');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setChatHistory(prev => [...prev, 
        { role: 'user', content: coachingQuestion },
        { role: 'assistant', content: data.response }
      ]);
      setCoachingQuestion("");
    }
  });

  const handleSessionSelect = (session: any) => {
    setSelectedSession(session);
    setAiAnalysis(null);
    setChatHistory([]);
  };

  const handleGenerateAnalysis = () => {
    if (selectedSession) {
      generateAnalysisMutation.mutate(selectedSession);
    }
  };

  const handleAskQuestion = () => {
    if (coachingQuestion.trim() && selectedSession) {
      askCoachMutation.mutate(coachingQuestion.trim());
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 55) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200";
    if (score >= 70) return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200";
    if (score >= 55) return "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200";
    return "bg-gradient-to-br from-red-50 to-red-100 border-red-200";
  };

  if (!selectedSession) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full border border-purple-200">
            <Bot className="w-6 h-6 text-purple-600" />
            <span className="font-semibold text-purple-800">AI Coach</span>
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Your Personal Speaking Coach
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized insights and recommendations from your AI-powered speaking coach
          </p>
        </div>

        {/* Session Selection */}
        <Card className="border-2 border-purple-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Calendar className="w-5 h-5" />
              Select a Practice Session
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SimpleSessionSelector
              sessions={(sessions as any[]) || []}
              onSessionSelect={handleSessionSelect}
              isLoading={sessionsLoading}
            />
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-emerald-800 mb-2">Performance Analysis</h3>
              <p className="text-sm text-emerald-700">
                Detailed breakdown of your speaking performance with actionable insights
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-blue-800 mb-2">Interactive Coaching</h3>
              <p className="text-sm text-blue-700">
                Ask your AI coach specific questions about your presentation
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <Lightbulb className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-purple-800 mb-2">Smart Recommendations</h3>
              <p className="text-sm text-purple-700">
                Personalized tips to improve your next speaking performance
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header with Session Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedSession(null)}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            ← Back to Sessions
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedSession.sessionName || selectedSession.name || `Session ${selectedSession.sessionNumber}`}
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {Math.floor(selectedSession.duration / 60)}:{(selectedSession.duration % 60).toString().padStart(2, '0')}
              <Badge variant="outline" className="ml-2">
                {selectedSession.purpose || 'General Practice'}
              </Badge>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Avatar className="w-12 h-12 border-2 border-purple-200">
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white">
              <Bot className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-purple-800">AI Coach</p>
            <p className="text-xs text-gray-600">Ready to help</p>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
            <PieChart className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
            <Brain className="w-4 h-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="recording" className="data-[state=active]:bg-white data-[state=active]:text-purple-700">
            <Play className="w-4 h-4 mr-2" />
            Recording
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className={`border-2 ${getScoreBgColor(selectedSession.confidenceScore || 0)}`}>
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold ${getScoreColor(selectedSession.confidenceScore || 0)} mb-2`}>
                  {Math.round(selectedSession.confidenceScore || 0)}%
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">Confidence</div>
                <Progress 
                  value={selectedSession.confidenceScore || 0} 
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card className={`border-2 ${getScoreBgColor(selectedSession.voiceClarity || 0)}`}>
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold ${getScoreColor(selectedSession.voiceClarity || 0)} mb-2`}>
                  {Math.round(selectedSession.voiceClarity || 0)}%
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">Voice Clarity</div>
                <Progress 
                  value={selectedSession.voiceClarity || 0} 
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {selectedSession.averageWPM || 0}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">Words/Min</div>
                <div className="flex items-center justify-center gap-1">
                  <Mic className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs text-indigo-700">Speaking Pace</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-rose-600 mb-2">
                  {selectedSession.fillerWords || 0}
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">Filler Words</div>
                <div className="flex items-center justify-center gap-1">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <span className="text-xs text-rose-700">Total Count</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-2 border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-800 mb-2">Ready for detailed analysis?</h3>
                  <p className="text-purple-700 text-sm">
                    Get comprehensive AI insights about your speaking performance
                  </p>
                </div>
                <Button 
                  onClick={handleGenerateAnalysis}
                  disabled={generateAnalysisMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {generateAnalysisMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze Session
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <Card className="border-2 border-blue-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <PieChart className="w-5 h-5" />
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Extract authentic metrics from session data */}
              {(() => {
                // Extract ONLY authentic metrics from session data - NO FALLBACKS
                const getFacialAnalysisData = () => {
                  try {
                    return selectedSession.facialAnalysis ? JSON.parse(selectedSession.facialAnalysis) : null;
                  } catch (e) {
                    return null;
                  }
                };
                
                const facialData = getFacialAnalysisData();
                
                // Use ONLY authentic data from database - no placeholders
                const confidenceLevel = selectedSession.confidenceScore || 
                  facialData?.emotionalExpression?.confidence || 0;
                
                const eyeContactScore = typeof selectedSession.eyeContactScore === 'string' ? 
                  parseFloat(selectedSession.eyeContactScore) : 
                  (selectedSession.eyeContactScore || 
                    facialData?.communicationSignals?.eyeContactQuality || 0);
                
                const clarityScore = selectedSession.clarityScore || selectedSession.voiceClarity || 0;
                
                const engagementLevel = facialData?.emotionalExpression?.engagement || 0;
                
                const voiceConsistency = selectedSession.volumeConsistency || 0; // Only use real data
                
                const performanceMetrics = [
                  {
                    name: 'Confidence Level',
                    score: Math.round(confidenceLevel),
                    icon: Target,
                    color: 'text-emerald-600',
                    bgColor: 'bg-emerald-50'
                  },
                  {
                    name: 'Eye Contact',
                    score: Math.round(eyeContactScore),
                    icon: Eye,
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50'
                  },
                  {
                    name: 'Clarity & Articulation',
                    score: Math.round(clarityScore),
                    icon: Mic,
                    color: 'text-purple-600',
                    bgColor: 'bg-purple-50'
                  },
                  {
                    name: 'Engagement Level',
                    score: Math.round(engagementLevel),
                    icon: Zap,
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-50'
                  },
                  {
                    name: 'Voice Consistency',
                    score: Math.round(voiceConsistency),
                    icon: Activity,
                    color: 'text-indigo-600',
                    bgColor: 'bg-indigo-50'
                  }
                ];

                return performanceMetrics.map((metric) => {
                  const Icon = metric.icon;
                  const progressColor = metric.score >= 80 ? 'bg-emerald-500' : 
                                      metric.score >= 60 ? 'bg-blue-500' :
                                      metric.score >= 40 ? 'bg-amber-500' : 'bg-red-500';
                  
                  return (
                    <div key={metric.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                            <Icon className={`w-5 h-5 ${metric.color}`} />
                          </div>
                          <span className="font-medium text-gray-900">{metric.name}</span>
                        </div>
                        <div className={`text-lg font-bold ${metric.score === 0 ? 'text-red-600' : metric.color}`}>
                          {metric.score}%
                        </div>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={metric.score} 
                          className="h-3"
                        />
                        <div 
                          className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${progressColor}`}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </CardContent>
          </Card>

          {/* Additional Session Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Clock className="w-5 h-5" />
                  Session Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Duration</span>
                  <span className="font-semibold">
                    {Math.floor(selectedSession.duration / 60)}:{(selectedSession.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Words Per Minute</span>
                  <span className="font-semibold">{selectedSession.averageWPM || selectedSession.wordsPerMinute || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Filler Words</span>
                  <span className="font-semibold text-red-600">{selectedSession.fillerWords || selectedSession.fillerWordCount || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">Session Type</span>
                  <Badge variant="outline">{selectedSession.purpose || 'General Practice'}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Brain className="w-5 h-5" />
                  AI Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  {/* Overall Performance Score */}
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {selectedSession.overallScore || Math.round((
                      (selectedSession.confidenceScore || 0) + 
                      (selectedSession.voiceClarity || 0) + 
                      (parseFloat(selectedSession.eyeContactScore) || 0)
                    ) / 3) || 0}
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-4">Overall Performance Score</div>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.round((selectedSession.overallScore || 0) / 20) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {selectedSession.overallScore >= 85 ? 'Excellent performance! Keep up the great work.' :
                     selectedSession.overallScore >= 70 ? 'Good performance with room for improvement.' :
                     selectedSession.overallScore >= 55 ? 'Solid foundation, focus on key areas.' :
                     'Great potential! Let\'s work on building confidence.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {/* Session Recording & Transcript */}
          {(selectedSession.videoBlob || selectedSession.transcript) && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Video Recording */}
              {selectedSession.videoBlob && (
                <Card className="border border-indigo-200">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <CardTitle className="flex items-center gap-2 text-indigo-800">
                      <PlayCircle className="w-5 h-5" />
                      Session Recording
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="bg-black rounded-lg overflow-hidden">
                      <video 
                        controls 
                        className="w-full max-h-64 object-cover"
                        src={`data:video/webm;base64,${selectedSession.videoBlob}`}
                      >
                        Your browser does not support video playback.
                      </video>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      Duration: {Math.floor((selectedSession.duration || 0) / 60)}m {((selectedSession.duration || 0) % 60)}s
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transcript */}
              {selectedSession.transcript && (
                <Card className="border border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <MessageSquare className="w-5 h-5" />
                      Session Transcript
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedSession.transcript}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                      <span>Words: {selectedSession.transcript.split(' ').length}</span>
                      <span>WPM: {selectedSession.averageWPM || selectedSession.wordsPerMinute || 'N/A'}</span>
                      <span>Filler Words: {selectedSession.fillerWords || selectedSession.fillerWordCount || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Comprehensive Analysis Section */}
          {!aiAnalysis && !selectedSession.aiAnalysis ? (
            <Card className="border-2 border-gray-200">
              <CardContent className="p-12 text-center">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Analysis Yet</h3>
                <p className="text-gray-500 mb-6">
                  Click "Analyze Session" to get detailed AI insights about your performance
                </p>
                <Button 
                  onClick={handleGenerateAnalysis}
                  disabled={generateAnalysisMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {generateAnalysisMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Overall Assessment */}
              <Card className="border-2 border-purple-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Trophy className="w-5 h-5" />
                    Overall Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                      <div className="text-3xl font-bold text-emerald-600 mb-2">
                        {aiAnalysis.purposeAlignment || 0}%
                      </div>
                      <div className="text-sm font-medium text-emerald-800">Goal Achievement</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {aiAnalysis.executionQuality || 0}%
                      </div>
                      <div className="text-sm font-medium text-blue-800">Execution Quality</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {aiAnalysis.improvementPotential || 0}%
                      </div>
                      <div className="text-sm font-medium text-purple-800">Growth Potential</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                      <MessageSquare className="w-4 h-4" />
                      Coach's Summary
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {aiAnalysis.overallAssessment || "No analysis available. Complete a practice session with recording to receive detailed coaching insights."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analysis */}
              {aiAnalysis.voiceAnalysis && (
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border border-blue-200">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardTitle className="flex items-center gap-2 text-blue-800">
                        <Mic className="w-5 h-5" />
                        Voice Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Score</span>
                        <Badge className={`${getScoreColor(aiAnalysis.voiceAnalysis.score)} bg-transparent border`}>
                          {aiAnalysis.voiceAnalysis.score}%
                        </Badge>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-emerald-700 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h5>
                        <ul className="space-y-1">
                          {(aiAnalysis.voiceAnalysis.strengths || []).map((strength: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <ArrowUp className="w-3 h-3 text-emerald-600 mt-1 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-amber-700 mb-2 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" />
                          Improvements
                        </h5>
                        <ul className="space-y-1">
                          {(aiAnalysis.voiceAnalysis.improvements || []).map((improvement: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <ArrowRight className="w-3 h-3 text-amber-600 mt-1 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-purple-200">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <CardTitle className="flex items-center gap-2 text-purple-800">
                        <Users className="w-5 h-5" />
                        Delivery Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Score</span>
                        <Badge className={`${getScoreColor(aiAnalysis.deliveryAnalysis?.score || 0)} bg-transparent border`}>
                          {aiAnalysis.deliveryAnalysis?.score || 0}%
                        </Badge>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-emerald-700 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h5>
                        <ul className="space-y-1">
                          {(aiAnalysis.deliveryAnalysis?.strengths || []).map((strength: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <ArrowUp className="w-3 h-3 text-emerald-600 mt-1 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold text-amber-700 mb-2 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" />
                          Improvements
                        </h5>
                        <ul className="space-y-1">
                          {(aiAnalysis.deliveryAnalysis?.improvements || []).map((improvement: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <ArrowRight className="w-3 h-3 text-amber-600 mt-1 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Recommendations */}
              {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                <Card className="border-2 border-emerald-100">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                    <CardTitle className="flex items-center gap-2 text-emerald-800">
                      <Star className="w-5 h-5" />
                      Personalized Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {aiAnalysis.recommendations.map((rec: any, idx: number) => (
                        <div key={idx} className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                          <div className="flex items-start gap-3">
                            <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                              {rec.priority}
                            </Badge>
                            <div className="flex-1">
                              <h5 className="font-semibold text-emerald-800 mb-1">{rec.title}</h5>
                              <p className="text-sm text-emerald-700">{rec.description}</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {rec.area}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Computer Vision Analysis */}
              {selectedSession.facialAnalysis && (
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <Card className="border border-yellow-200">
                    <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
                      <CardTitle className="flex items-center gap-2 text-yellow-800">
                        <Eye className="w-5 h-5" />
                        Facial Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {(() => {
                        try {
                          const facialData = JSON.parse(selectedSession.facialAnalysis);
                          return (
                            <div className="space-y-4">
                              {/* Emotional Expression */}
                              {facialData.emotionalExpression && (
                                <div>
                                  <h5 className="font-semibold text-gray-700 mb-2">Emotional Expression</h5>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Confidence:</span>
                                      <Badge className="bg-blue-100 text-blue-800">{facialData.emotionalExpression.confidence}%</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Engagement:</span>
                                      <Badge className="bg-green-100 text-green-800">{facialData.emotionalExpression.engagement}%</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Enthusiasm:</span>
                                      <Badge className="bg-purple-100 text-purple-800">{facialData.emotionalExpression.enthusiasm}%</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Authenticity:</span>
                                      <Badge className="bg-emerald-100 text-emerald-800">{facialData.emotionalExpression.authenticity}%</Badge>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Communication Signals */}
                              {facialData.communicationSignals && (
                                <div>
                                  <h5 className="font-semibold text-gray-700 mb-2">Communication Quality</h5>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Eye Contact:</span>
                                      <Badge className="bg-indigo-100 text-indigo-800">{facialData.communicationSignals.eyeContactQuality}%</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Gaze Focus:</span>
                                      <Badge className="bg-cyan-100 text-cyan-800">{facialData.communicationSignals.gazeFocus}%</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Facial Stability:</span>
                                      <Badge className="bg-teal-100 text-teal-800">{facialData.communicationSignals.facialStability}%</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Blink Rate:</span>
                                      <Badge className="bg-orange-100 text-orange-800">{facialData.communicationSignals.blinkRate}%</Badge>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Overall Presence */}
                              {facialData.overallPresence && (
                                <div>
                                  <h5 className="font-semibold text-gray-700 mb-2">Professional Presence</h5>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Charisma:</span>
                                      <Badge className="bg-rose-100 text-rose-800">{facialData.overallPresence.charisma}%</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Trustworthiness:</span>
                                      <Badge className="bg-blue-100 text-blue-800">{facialData.overallPresence.trustworthiness}%</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Professionalism:</span>
                                      <Badge className="bg-gray-100 text-gray-800">{facialData.overallPresence.professionalism}%</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Approachability:</span>
                                      <Badge className="bg-amber-100 text-amber-800">{facialData.overallPresence.approachability}%</Badge>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        } catch (e) {
                          return <p className="text-gray-500 text-sm">Unable to parse facial analysis data</p>;
                        }
                      })()}
                    </CardContent>
                  </Card>

                  {/* Body Language & Voice Metrics */}
                  <Card className="border border-teal-200">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
                      <CardTitle className="flex items-center gap-2 text-teal-800">
                        <Activity className="w-5 h-5" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {/* Voice Metrics */}
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Voice Analysis</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Confidence Score:</span>
                            <Badge className="bg-blue-100 text-blue-800">{selectedSession.confidenceScore || 0}%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Voice Clarity:</span>
                            <Badge className="bg-green-100 text-green-800">{selectedSession.voiceClarity || selectedSession.clarityScore || 0}%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Volume Consistency:</span>
                            <Badge className="bg-purple-100 text-purple-800">{selectedSession.volumeConsistency || 0}%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Pace Score:</span>
                            <Badge className="bg-indigo-100 text-indigo-800">{selectedSession.paceScore || 0}%</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Body Language */}
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Body Language</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Posture Score:</span>
                            <Badge className="bg-emerald-100 text-emerald-800">{selectedSession.postureScore || 0}%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Gesture Score:</span>
                            <Badge className="bg-orange-100 text-orange-800">{selectedSession.gestureScore || 0}%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Eye Contact:</span>
                            <Badge className="bg-cyan-100 text-cyan-800">{selectedSession.eyeContactScore || 0}%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Overall Score:</span>
                            <Badge className="bg-yellow-100 text-yellow-800">{selectedSession.overallScore || 0}%</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Content Analysis */}
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Content Quality</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Persuasiveness:</span>
                            <Badge className="bg-rose-100 text-rose-800">{selectedSession.persuasivenessScore || 0}%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Speaking Pace:</span>
                            <Badge className="bg-teal-100 text-teal-800">{selectedSession.averageWPM || selectedSession.wordsPerMinute || 0} WPM</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Filler Words:</span>
                            <Badge className={`${(selectedSession.fillerWords || selectedSession.fillerWordCount || 0) > 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {selectedSession.fillerWords || selectedSession.fillerWordCount || 0}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Pause Count:</span>
                            <Badge className="bg-blue-100 text-blue-800">{selectedSession.pauseCount || 0}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Stored AI Analysis */}
              {selectedSession.aiAnalysis && (
                <Card className="border border-purple-200 mt-6">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Brain className="w-5 h-5" />
                      Stored AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(selectedSession.aiAnalysis, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Coaching Tips */}
              {selectedSession.coachingTips && selectedSession.coachingTips.length > 0 && (
                <Card className="border border-emerald-200 mt-6">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                    <CardTitle className="flex items-center gap-2 text-emerald-800">
                      <Lightbulb className="w-5 h-5" />
                      Coaching Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {selectedSession.coachingTips.map((tip: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                          <ArrowRight className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-emerald-800">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <Card className="border-2 border-blue-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <MessageSquare className="w-5 h-5" />
                Chat with Your AI Coach
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Chat History */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Start a conversation with your AI coach</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCoachingQuestion("How can I improve my confidence?")}
                        className="text-xs"
                      >
                        How can I improve my confidence?
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCoachingQuestion("What was my strongest point?")}
                        className="text-xs"
                      >
                        What was my strongest point?
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCoachingQuestion("How was my pacing?")}
                        className="text-xs"
                      >
                        How was my pacing?
                      </Button>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((message, idx) => (
                    <div key={idx} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && (
                        <Avatar className="w-8 h-8 border border-blue-200">
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-400 text-white text-xs">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`max-w-lg p-4 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                          : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask your AI coach anything about your presentation..."
                  value={coachingQuestion}
                  onChange={(e) => setCoachingQuestion(e.target.value)}
                  className="flex-1 min-h-[44px] max-h-32 resize-none border-blue-200 focus:border-blue-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAskQuestion();
                    }
                  }}
                />
                <Button 
                  onClick={handleAskQuestion}
                  disabled={!coachingQuestion.trim() || askCoachMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6"
                >
                  {askCoachMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recording Tab */}
        <TabsContent value="recording" className="space-y-6">
          <Card className="border-2 border-green-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Play className="w-5 h-5" />
                Session Recording
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <SimpleRecordingPlayer session={selectedSession} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}