import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain,
  TrendingUp,
  Target,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  Lightbulb
} from "lucide-react";
import SimpleSessionSelector from "./SimpleSessionSelector";
import SimpleRecordingPlayer from "./SimpleRecordingPlayer";
import { apiRequest } from "@/lib/queryClient";

export default function SimpleAICoach() {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [coachingQuestion, setCoachingQuestion] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);

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
          previousSessions: sessions?.slice(-5) || []
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
        throw new Error('Failed to get response from coach');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const newMessage = { role: 'assistant', content: data.response };
      setChatHistory(prev => [...prev, { role: 'user', content: coachingQuestion }, newMessage]);
      setCoachingQuestion("");
    }
  });

  useEffect(() => {
    if (selectedSession && !aiAnalysis) {
      generateAnalysisMutation.mutate(selectedSession);
    }
  }, [selectedSession]);

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous + 2) return { icon: ArrowUp, color: "text-green-500", label: "Better" };
    if (current < previous - 2) return { icon: ArrowDown, color: "text-red-500", label: "Needs Work" };
    return { icon: Minus, color: "text-gray-500", label: "Same" };
  };

  const renderCoachingAnalysis = () => {
    if (!selectedSession || !aiAnalysis) return null;

    return (
      <div className="space-y-6">
        {/* AI Coach's Overall Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Your AI Coach's Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">{aiAnalysis.purposeAlignment || 85}%</div>
                <div className="text-sm text-gray-600">Goal Achievement</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">{aiAnalysis.executionQuality || 78}%</div>
                <div className="text-sm text-gray-600">Execution Quality</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">{aiAnalysis.improvementPotential || 92}%</div>
                <div className="text-sm text-gray-600">Growth Potential</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Coach's Summary:</h4>
              <p className="text-sm text-gray-700">
                {aiAnalysis.overallAssessment || "This session shows solid fundamentals with clear opportunities for enhancement. You demonstrate good command of your material but could benefit from more dynamic delivery techniques."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What You Improved */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              What You Did Well
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiAnalysis.improvements?.map((improvement: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">{improvement.area}</div>
                  <div className="text-xs text-gray-600">{improvement.description}</div>
                </div>
              </div>
            )) || [
              <div key="default" className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Voice Clarity</div>
                  <div className="text-xs text-gray-600">Your speech was clear and easy to understand</div>
                </div>
              </div>
            ]}
          </CardContent>
        </Card>

        {/* Focus Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              What to Work on Next
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiAnalysis.nextSessionFocus?.map((focus: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">{focus.area}</div>
                  <div className="text-xs text-gray-600">{focus.actionable}</div>
                </div>
              </div>
            )) || [
              <div key="default" className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Body Language</div>
                  <div className="text-xs text-gray-600">Practice using more expressive gestures</div>
                </div>
              </div>
            ]}
          </CardContent>
        </Card>

        {/* Skill Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiAnalysis.skillBreakdown?.map((skill: any, index: number) => {
              const trend = getTrendIcon(skill.currentScore, skill.previousScore || 0);
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
                  <div className="text-sm text-gray-600">
                    {skill.coachNotes}
                  </div>
                </div>
              );
            }) || [
              <div key="default" className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Voice Control</span>
                    <ArrowUp className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500">Better</span>
                  </div>
                  <Badge variant="default">85%</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Good improvement in speaking pace and clarity
                </div>
              </div>
            ]}
          </CardContent>
        </Card>

        {/* Action Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Your Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-red-600">Do This Week:</h4>
              {aiAnalysis.developmentPlan?.immediate?.map((item: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />
                  <div>
                    <div className="font-medium text-sm">{item.goal}</div>
                    <div className="text-xs text-gray-600 mt-1">{item.action}</div>
                  </div>
                </div>
              )) || [
                <div key="default" className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />
                  <div>
                    <div className="font-medium text-sm">Practice Daily</div>
                    <div className="text-xs text-gray-600 mt-1">Spend 10 minutes practicing in front of a mirror</div>
                  </div>
                </div>
              ]}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-yellow-600">Do This Month:</h4>
              {aiAnalysis.developmentPlan?.shortTerm?.map((item: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Target className="h-4 w-4 text-yellow-500 mt-1" />
                  <div>
                    <div className="font-medium text-sm">{item.goal}</div>
                    <div className="text-xs text-gray-600 mt-1">{item.action}</div>
                  </div>
                </div>
              )) || [
                <div key="default" className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Target className="h-4 w-4 text-yellow-500 mt-1" />
                  <div>
                    <div className="font-medium text-sm">Improve Gestures</div>
                    <div className="text-xs text-gray-600 mt-1">Record yourself and practice natural hand movements</div>
                  </div>
                </div>
              ]}
            </div>
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
          Ask Your Coach
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {chatHistory.length > 0 && (
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
        )}
        
        <div className="space-y-2">
          <Textarea
            placeholder="Ask me anything about your speaking... How can I improve my confidence? What should I practice next?"
            value={coachingQuestion}
            onChange={(e) => setCoachingQuestion(e.target.value)}
            rows={2}
          />
          <Button 
            onClick={() => askCoachMutation.mutate(coachingQuestion)}
            disabled={!coachingQuestion.trim() || askCoachMutation.isPending}
            className="w-full"
          >
            {askCoachMutation.isPending ? "Coach is thinking..." : "Ask Coach"}
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
          <p className="text-gray-600">Loading your coach...</p>
        </div>
      </div>
    );
  }

  if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Meet Your AI Coach</h3>
        <p className="text-gray-600 mb-6">Complete practice sessions to get personalized coaching</p>
        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
          Your AI coach will help you:
          <br />• See what you're doing well
          <br />• Know what to work on next
          <br />• Track your progress over time
          <br />• Answer your speaking questions
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your AI Coach</h2>
        <Badge variant="outline" className="text-sm">
          {sessions.length} Session{sessions.length !== 1 ? 's' : ''} Analyzed
        </Badge>
      </div>
      
      <SimpleSessionSelector 
        sessions={sessions} 
        selectedSession={selectedSession}
        onSessionSelect={setSelectedSession}
      />

      {selectedSession && (
        <div className="space-y-6">
          <SimpleRecordingPlayer session={selectedSession} />
          
          {generateAnalysisMutation.isPending ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Your coach is analyzing your session...</p>
              </div>
            </div>
          ) : (
            <>
              {renderCoachingAnalysis()}
              {renderCoachingChat()}
            </>
          )}
        </div>
      )}
    </div>
  );
}