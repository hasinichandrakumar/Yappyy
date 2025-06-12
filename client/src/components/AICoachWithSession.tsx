import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  Award, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  MessageSquare,
  Volume2,
  Eye,
  FileText
} from "lucide-react";
import SessionSelector from "./SessionSelector";
import AICoachComprehensive from "./AICoachComprehensive";

interface ProgressInsight {
  skill: string;
  trend: 'improving' | 'declining' | 'stable';
  change: number;
  sessions: number;
}

export default function AICoachWithSession() {
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const { data: sessions = [] } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  const generateProgressInsights = () => {
    if (!Array.isArray(sessions) || sessions.length < 2) return [];
    
    const recentSessions = sessions.slice(-5);
    const insights: ProgressInsight[] = [];
    
    // Voice Clarity Progress
    const voiceClarityScores = recentSessions.map((s: any) => s.voiceClarity || 0);
    const voiceChange = voiceClarityScores[voiceClarityScores.length - 1] - voiceClarityScores[0];
    insights.push({
      skill: 'Voice Clarity',
      trend: voiceChange > 5 ? 'improving' : voiceChange < -5 ? 'declining' : 'stable',
      change: voiceChange,
      sessions: recentSessions.length
    });

    // Filler Word Progress
    const fillerRates = recentSessions.map((s: any) => (s.fillerWords?.length || 0) / Math.max(1, s.wordCount || 1) * 100);
    const fillerChange = fillerRates[0] - fillerRates[fillerRates.length - 1]; // Improvement = reduction
    insights.push({
      skill: 'Filler Words',
      trend: fillerChange > 2 ? 'improving' : fillerChange < -2 ? 'declining' : 'stable',
      change: fillerChange,
      sessions: recentSessions.length
    });

    // Speaking Pace Progress
    const paceScores = recentSessions.map((s: any) => s.wpm || 0);
    const paceChange = paceScores[paceScores.length - 1] - paceScores[0];
    insights.push({
      skill: 'Speaking Pace',
      trend: Math.abs(paceChange) > 10 ? (paceChange > 0 ? 'improving' : 'declining') : 'stable',
      change: paceChange,
      sessions: recentSessions.length
    });

    return insights;
  };

  const generateCoachingInsights = (session: any) => {
    if (!session) return null;

    const { purpose, overallScore, wpm, fillerWords = [], voiceClarity, eyeContactScore, postureScore } = session;
    const fillerCount = fillerWords.length;
    const wordCount = session.wordCount || 1;
    const fillerRate = (fillerCount / wordCount) * 100;

    // Purpose-specific coaching
    const purposeAnalysis = (() => {
      if (!purpose) return "General speaking practice completed.";
      
      const purposeLower = purpose.toLowerCase();
      
      if (purposeLower.includes('interview')) {
        return `Your interview preparation shows ${overallScore >= 75 ? 'strong readiness' : 'developing skills'}. For job interviews, your ${wpm} WPM pace is ${wpm >= 120 && wpm <= 150 ? 'ideal for professional settings' : wpm < 120 ? 'slightly slow - add more energy and confidence' : 'too fast - slow down to ensure clear communication'}. ${fillerCount <= 3 ? 'Your minimal use of filler words projects professionalism.' : 'Practice the pause technique to replace filler words with confident silence.'}`;
      } else if (purposeLower.includes('presentation')) {
        return `Your presentation skills demonstrate ${overallScore >= 75 ? 'excellent command' : 'good foundation with room for growth'}. For presentations, your speaking pace of ${wpm} WPM ${wpm >= 130 && wpm <= 160 ? 'engages audiences effectively' : wpm < 130 ? 'could be more dynamic to maintain audience attention' : 'may overwhelm listeners - consider strategic pauses'}. ${voiceClarity > 80 ? 'Your clear articulation enhances message delivery.' : 'Focus on enunciation to ensure every word lands with impact.'}`;
      } else if (purposeLower.includes('conversation')) {
        return `Your conversational skills show ${overallScore >= 70 ? 'natural communication ability' : 'developing interpersonal connection'}. For conversations, your ${wpm} WPM pace ${wpm >= 110 && wpm <= 140 ? 'feels natural and engaging' : wpm < 110 ? 'could be more animated to show enthusiasm' : 'might feel rushed - allow for natural pauses and responses'}. ${eyeContactScore > 75 ? 'Your eye contact builds strong rapport.' : 'Practice maintaining eye contact to strengthen personal connections.'}`;
      }
      
      return `Your practice session focused on "${purpose}" shows ${overallScore >= 75 ? 'excellent progress' : 'solid development'}. Continue working on the specific skills needed for this context.`;
    })();

    // Execution analysis
    const executionAnalysis = (() => {
      const strengths = [];
      const improvements = [];

      if (voiceClarity > 80) strengths.push("crystal clear articulation");
      if (wpm >= 120 && wpm <= 150) strengths.push("optimal speaking pace");
      if (fillerRate < 3) strengths.push("excellent verbal fluency");
      if (eyeContactScore > 75) strengths.push("strong audience connection");
      if (postureScore > 80) strengths.push("confident body language");

      if (voiceClarity < 70) improvements.push("work on clearer pronunciation and enunciation");
      if (wpm < 100) improvements.push("increase energy and speaking pace");
      if (wpm > 180) improvements.push("slow down for better comprehension");
      if (fillerRate > 5) improvements.push("practice replacing filler words with pauses");
      if (eyeContactScore < 60) improvements.push("maintain more consistent eye contact");
      if (postureScore < 70) improvements.push("improve posture for stronger presence");

      let analysis = "Your execution ";
      if (strengths.length > 0) {
        analysis += `demonstrates ${strengths.join(", ")}. `;
      }
      if (improvements.length > 0) {
        analysis += `To elevate your performance, ${improvements.join(", ")}.`;
      } else {
        analysis += "shows excellent technical proficiency across all areas.";
      }

      return analysis;
    })();

    // Progress tracking
    const progressAnalysis = (() => {
      const progressInsights = generateProgressInsights();
      if (progressInsights.length === 0) {
        return "Continue practicing regularly to track your progress and development patterns.";
      }

      const improving = progressInsights.filter(i => i.trend === 'improving');
      const declining = progressInsights.filter(i => i.trend === 'declining');

      if (improving.length > declining.length) {
        return `Excellent progress! You're showing consistent improvement in ${improving.map(i => i.skill.toLowerCase()).join(", ")}. This upward trajectory indicates your practice is effectively building your speaking skills.`;
      } else if (declining.length > improving.length) {
        return `Focus needed: I've noticed some regression in ${declining.map(i => i.skill.toLowerCase()).join(", ")}. Don't worry - this is normal during skill development. Consider dedicating extra practice time to these areas.`;
      } else {
        return "Your skills are stabilizing at a good level. Now focus on consistency and refinement to achieve breakthrough improvements.";
      }
    })();

    return {
      purposeAnalysis,
      executionAnalysis,
      progressAnalysis,
      nextSteps: generateNextSteps(session, progressInsights)
    };
  };

  const generateNextSteps = (session: any, progressInsights: ProgressInsight[]) => {
    const steps = [];
    const { wpm, fillerWords = [], voiceClarity, eyeContactScore, purpose } = session;
    const fillerRate = (fillerWords.length / Math.max(1, session.wordCount)) * 100;

    // Priority improvements
    if (fillerRate > 5) {
      steps.push({
        priority: 'high',
        action: 'Practice the 2-second pause technique',
        description: 'Replace filler words with intentional pauses to sound more confident and prepared.'
      });
    }

    if (wpm < 110) {
      steps.push({
        priority: 'high',
        action: 'Increase speaking energy and pace',
        description: 'Practice reading aloud daily to build natural speaking rhythm and enthusiasm.'
      });
    }

    if (voiceClarity < 70) {
      steps.push({
        priority: 'high',
        action: 'Improve articulation and enunciation',
        description: 'Focus on consonant sounds and mouth positioning for clearer speech.'
      });
    }

    // Medium priority improvements
    if (eyeContactScore < 70) {
      steps.push({
        priority: 'medium',
        action: 'Strengthen eye contact consistency',
        description: 'Practice looking directly at the camera/audience for 3-5 seconds at a time.'
      });
    }

    if (wpm > 180) {
      steps.push({
        priority: 'medium',
        action: 'Practice strategic pacing',
        description: 'Slow down and use pauses for emphasis to improve comprehension.'
      });
    }

    // Purpose-specific recommendations
    if (purpose) {
      const purposeLower = purpose.toLowerCase();
      if (purposeLower.includes('interview')) {
        steps.push({
          priority: 'medium',
          action: 'Practice common interview questions',
          description: 'Rehearse STAR method responses for behavioral questions in your field.'
        });
      } else if (purposeLower.includes('presentation')) {
        steps.push({
          priority: 'medium',
          action: 'Work on storytelling techniques',
          description: 'Practice incorporating anecdotes and examples to make presentations more engaging.'
        });
      }
    }

    // Progress-based recommendations
    const declining = progressInsights.filter(i => i.trend === 'declining');
    if (declining.length > 0) {
      steps.push({
        priority: 'low',
        action: `Focus on ${declining[0].skill.toLowerCase()} consistency`,
        description: 'Dedicate extra practice time to maintain your previous performance level.'
      });
    }

    return steps.slice(0, 4); // Limit to top 4 recommendations
  };

  const progressInsights = generateProgressInsights();
  const coachingInsights = selectedSession ? generateCoachingInsights(selectedSession) : null;

  return (
    <div className="space-y-6">
      <SessionSelector 
        onSessionSelect={setSelectedSession}
        selectedSession={selectedSession}
        placeholder="Select a session to receive personalized AI coaching and progress insights."
      />
      
      {selectedSession && coachingInsights ? (
        <div className="space-y-6">
          {/* Session Overview */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-blue-600" />
                <span>AI Coach Analysis: {selectedSession.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedSession.overallScore}%</div>
                  <div className="text-sm text-gray-600">Performance Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{Math.round(selectedSession.duration / 60)}m</div>
                  <div className="text-sm text-gray-600">Practice Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Date(selectedSession.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">Session Date</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Purpose Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <span>Purpose & Context</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {coachingInsights.purposeAnalysis}
                </p>
              </CardContent>
            </Card>

            {/* Execution Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Execution Quality</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {coachingInsights.executionAnalysis}
                </p>
              </CardContent>
            </Card>

            {/* Progress Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Progress Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {coachingInsights.progressAnalysis}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Trends */}
          {progressInsights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Skill Development Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {progressInsights.map((insight, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{insight.skill}</div>
                        <div className="text-xs text-gray-600">Last {insight.sessions} sessions</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {insight.trend === 'improving' ? (
                          <ArrowUp className="w-4 h-4 text-green-600" />
                        ) : insight.trend === 'declining' ? (
                          <ArrowDown className="w-4 h-4 text-red-600" />
                        ) : (
                          <div className="w-4 h-4 bg-gray-400 rounded-full" />
                        )}
                        <Badge 
                          variant={insight.trend === 'improving' ? 'default' : insight.trend === 'declining' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {insight.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <span>Personalized Action Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {coachingInsights.nextSteps.map((step: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      step.priority === 'high' ? 'bg-red-500' : 
                      step.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.action}</div>
                      <div className="text-xs text-gray-600 mt-1">{step.description}</div>
                    </div>
                    <Badge 
                      variant={step.priority === 'high' ? 'destructive' : step.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {step.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-gray-500 py-8">
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Ready to Coach</h3>
              <p className="text-sm">
                Select a session above to receive comprehensive AI coaching with personalized insights on your purpose, execution, and progress.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}