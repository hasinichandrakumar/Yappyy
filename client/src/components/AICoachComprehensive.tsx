import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain,
  TrendingUp,
  Target,
  MessageSquare,
  Clock,
  Award,
  BarChart3,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
  Users,
  BookOpen,
  Zap
} from "lucide-react";
import SessionSelector from "./SessionSelector";
import SessionRecordingPlayer from "./SessionRecordingPlayer";
import { apiRequest } from "@/lib/queryClient";

interface AICoachComprehensiveProps {}

export default function AICoachComprehensive({}: AICoachComprehensiveProps) {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [progressInsights, setProgressInsights] = useState<any>(null);
  const [coachingChat, setCoachingChat] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  const { data: userProgress } = useQuery({
    queryKey: ['/api/user-progress'],
    enabled: true
  });

  // Generate comprehensive AI analysis for selected session
  const generateAnalysisMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return apiRequest('/api/ai-coaching-comprehensive', {
        method: 'POST',
        body: JSON.stringify({
          session: sessionData,
          purpose: sessionData.purpose || 'general_presentation',
          userProgress: userProgress || [],
          previousSessions: sessions?.slice(-5) || []
        })
      });
    },
    onSuccess: (data) => {
      setAiAnalysis(data);
    }
  });

  // Send coaching chat message
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest('/api/speech-coaching-chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          transcript: selectedSession?.transcript,
          purpose: selectedSession?.purpose || 'general_presentation',
          chatHistory: chatHistory.slice(-6)
        })
      });
    },
    onSuccess: (data) => {
      const newMessage = { role: 'assistant', content: data.response };
      setChatHistory(prev => [...prev, { role: 'user', content: coachingChat }, newMessage]);
      setCoachingChat("");
    }
  });

  useEffect(() => {
    if (selectedSession && !aiAnalysis) {
      generateAnalysisMutation.mutate(selectedSession);
    }
  }, [selectedSession]);

  const getProgressTrend = (current: number, previous: number) => {
    if (current > previous + 2) return { icon: ArrowUp, color: "text-green-500", label: "Improving" };
    if (current < previous - 2) return { icon: ArrowDown, color: "text-red-500", label: "Declining" };
    return { icon: Minus, color: "text-gray-500", label: "Stable" };
  };

  const getPurposeContext = (purpose: string) => {
    const contexts = {
      school_presentation: { label: "Academic Presentation", focus: "Educational content and structure" },
      business_pitch: { label: "Business Pitch", focus: "Persuasion and value proposition" },
      ted_talk: { label: "TED Talk", focus: "Inspirational storytelling" },
      wedding_speech: { label: "Wedding Speech", focus: "Personal connection and emotion" },
      job_interview: { label: "Job Interview", focus: "Professional presentation" },
      conference_talk: { label: "Conference Talk", focus: "Expertise and authority" },
      general_presentation: { label: "General Presentation", focus: "Overall communication skills" }
    };
    return contexts[purpose as keyof typeof contexts] || contexts.general_presentation;
  };

  const renderComprehensiveAnalysis = () => {
    if (!selectedSession || !aiAnalysis) return null;

    const purposeContext = getPurposeContext(selectedSession.purpose);

    return (
      <div className="space-y-6">
        {/* Session Context & Purpose Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Purpose-Driven Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{purposeContext.label}</Badge>
              <span className="text-sm text-gray-600">{purposeContext.focus}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">{aiAnalysis.purposeAlignment || 85}%</div>
                <div className="text-sm text-gray-600">Purpose Alignment</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">{aiAnalysis.executionQuality || 78}%</div>
                <div className="text-sm text-gray-600">Execution Quality</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">{aiAnalysis.improvementPotential || 92}%</div>
                <div className="text-sm text-gray-600">Growth Potential</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">AI Coach Assessment:</h4>
              <p className="text-sm text-gray-700">
                {aiAnalysis.overallAssessment || "This session demonstrates solid fundamentals with clear opportunities for enhancement. The speaker shows good command of their material but could benefit from more dynamic delivery techniques."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Evolution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Key Improvements Since Last Session:</h4>
                {aiAnalysis.improvements?.map((improvement: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">{improvement.area}</div>
                      <div className="text-xs text-gray-600">{improvement.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Focus Areas for Next Session:</h4>
                {aiAnalysis.nextSessionFocus?.map((focus: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">{focus.area}</div>
                      <div className="text-xs text-gray-600">{focus.actionable}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Breakdown Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Skill-by-Skill Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiAnalysis.skillBreakdown?.map((skill: any, index: number) => {
              const trend = getProgressTrend(skill.currentScore, skill.previousScore || 0);
              const TrendIcon = trend.icon;
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.name}</span>
                      <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                      <span className={`text-xs ${trend.color}`}>{trend.label}</span>
                    </div>
                    <Badge variant={skill.currentScore >= 80 ? "default" : "secondary"}>
                      {skill.currentScore}%
                    </Badge>
                  </div>
                  <Progress value={skill.currentScore} className="h-2 mb-2" />
                  <div className="text-sm text-gray-600">
                    <div className="font-medium mb-1">Coach's Notes:</div>
                    <p>{skill.coachNotes}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Strategic Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Strategic Development Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="immediate" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="immediate">Immediate (1-2 sessions)</TabsTrigger>
                <TabsTrigger value="shortterm">Short-term (3-5 sessions)</TabsTrigger>
                <TabsTrigger value="longterm">Long-term (6+ sessions)</TabsTrigger>
              </TabsList>

              <TabsContent value="immediate" className="space-y-3">
                {aiAnalysis.developmentPlan?.immediate?.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <Zap className="h-4 w-4 text-red-500 mt-1" />
                    <div>
                      <div className="font-medium text-sm">{item.goal}</div>
                      <div className="text-xs text-gray-600 mt-1">{item.action}</div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="shortterm" className="space-y-3">
                {aiAnalysis.developmentPlan?.shortTerm?.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Target className="h-4 w-4 text-yellow-500 mt-1" />
                    <div>
                      <div className="font-medium text-sm">{item.goal}</div>
                      <div className="text-xs text-gray-600 mt-1">{item.action}</div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="longterm" className="space-y-3">
                {aiAnalysis.developmentPlan?.longTerm?.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Award className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <div className="font-medium text-sm">{item.goal}</div>
                      <div className="text-xs text-gray-600 mt-1">{item.action}</div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCoachingChat = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Ask Your AI Coach
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-64 overflow-y-auto space-y-3">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-50 text-blue-900 ml-8' 
                : 'bg-gray-50 text-gray-900 mr-8'
            }`}>
              <div className="text-sm">{msg.content}</div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask your AI coach about this session, technique improvement, or speaking strategies..."
            value={coachingChat}
            onChange={(e) => setCoachingChat(e.target.value)}
            className="flex-1"
            rows={2}
          />
          <Button 
            onClick={() => chatMutation.mutate(coachingChat)}
            disabled={!coachingChat.trim() || chatMutation.isPending}
            size="sm"
          >
            {chatMutation.isPending ? "..." : "Ask"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (sessionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coaching insights...</p>
        </div>
      </div>
    );
  }

  if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Coaching Journey</h3>
        <p className="text-gray-600 mb-6">Complete practice sessions to unlock AI-powered coaching insights</p>
        <div className="text-sm text-gray-500">
          Your AI coach will analyze your sessions and provide:
          <br />• Purpose-driven feedback aligned with your goals
          <br />• Progress tracking across multiple sessions
          <br />• Personalized development plans and strategies
          <br />• Interactive coaching conversations
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI Speech Coach</h2>
        <Badge variant="outline" className="text-sm">
          {sessions.length} Session{sessions.length !== 1 ? 's' : ''} Analyzed
        </Badge>
      </div>
      
      <SessionSelector 
        sessions={sessions} 
        onSessionSelect={setSelectedSession}
        selectedSession={selectedSession}
        showPurpose={true}
      />

      {selectedSession && (
        <div className="space-y-6">
          <SessionRecordingPlayer session={selectedSession} />
          
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analysis">Comprehensive Analysis</TabsTrigger>
              <TabsTrigger value="coaching">Interactive Coaching</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6">
              {generateAnalysisMutation.isPending ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Generating comprehensive analysis...</p>
                  </div>
                </div>
              ) : (
                renderComprehensiveAnalysis()
              )}
            </TabsContent>

            <TabsContent value="coaching" className="space-y-6">
              {renderCoachingChat()}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}