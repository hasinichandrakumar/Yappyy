import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Volume2, 
  Eye, 
  MessageSquare 
} from "lucide-react";

interface SessionData {
  sessionName: string;
  purpose: string;
  duration: number;
  transcript: string;
  overallPerformance: number;
  clarityScore: number;
  volumeConsistency: number;
  intonationScore: number;
  paceConsistency: number;
  engagementLevel: number;
  eyeContactScore: number | string;
  confidenceLevel: number;
  fillerWordCount: number;
  wordsPerMinute: number;
}

interface ImmediateFeedbackProps {
  sessionData: SessionData;
}

export default function ImmediateFeedback({ sessionData }: ImmediateFeedbackProps) {
  // Calculate quick insights from session data
  const getQuickFeedback = () => {
    const strengths = [];
    const improvements = [];
    
    if (sessionData.overallPerformance > 70) strengths.push("Strong overall performance");
    if (sessionData.clarityScore > 75) strengths.push("Clear speech delivery");
    const eyeContactNum = typeof sessionData.eyeContactScore === 'string' ? 
      parseFloat(sessionData.eyeContactScore) : sessionData.eyeContactScore;
    
    if (eyeContactNum > 70) strengths.push("Good eye contact");
    if (sessionData.confidenceLevel > 75) strengths.push("Confident presentation");
    if (sessionData.fillerWordCount < 5) strengths.push("Minimal filler words");
    if (sessionData.wordsPerMinute >= 120 && sessionData.wordsPerMinute <= 180) strengths.push("Optimal pace");
    
    if (sessionData.clarityScore < 60) improvements.push("Work on clearer articulation");
    if (eyeContactNum < 50) improvements.push("Improve eye contact");
    if (sessionData.confidenceLevel < 60) improvements.push("Build confidence through practice");
    if (sessionData.fillerWordCount > 10) improvements.push("Reduce filler words");
    if (sessionData.wordsPerMinute < 120) improvements.push("Increase speaking pace");
    if (sessionData.wordsPerMinute > 200) improvements.push("Slow down speaking pace");
    
    return {
      strengths: strengths.length > 0 ? strengths : ["Session completed successfully"],
      improvements: improvements.length > 0 ? improvements : ["Continue practicing regularly"]
    };
  };

  const feedback = getQuickFeedback();
  const sessionMinutes = Math.round(sessionData.duration / 60);

  return (
    <div className="space-y-6">
      {/* Quick Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Session Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sessionMinutes}m</div>
              <div className="text-sm text-gray-600">Practice Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(sessionData.overallPerformance || 0)}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{sessionData.wordsPerMinute || 0}</div>
              <div className="text-sm text-gray-600">Words/Min</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Immediate Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Volume2 className="w-5 h-5 text-blue-600" />
              Voice Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Clarity</span>
                <span className="text-sm text-gray-600">{Math.round(sessionData.clarityScore || 0)}%</span>
              </div>
              <Progress value={sessionData.clarityScore || 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Volume Consistency</span>
                <span className="text-sm text-gray-600">{Math.round(sessionData.volumeConsistency || 0)}%</span>
              </div>
              <Progress value={sessionData.volumeConsistency || 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Intonation</span>
                <span className="text-sm text-gray-600">{Math.round(sessionData.intonationScore || 0)}%</span>
              </div>
              <Progress value={sessionData.intonationScore || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="w-5 h-5 text-green-600" />
              Delivery Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Eye Contact</span>
                <span className="text-sm text-gray-600">{Math.round(Number(sessionData.eyeContactScore) || 0)}%</span>
              </div>
              <Progress value={Number(sessionData.eyeContactScore) || 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Confidence</span>
                <span className="text-sm text-gray-600">{Math.round(sessionData.confidenceLevel || 0)}%</span>
              </div>
              <Progress value={sessionData.confidenceLevel || 0} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Engagement</span>
                <span className="text-sm text-gray-600">{Math.round(sessionData.engagementLevel || 0)}%</span>
              </div>
              <Progress value={sessionData.engagementLevel || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-green-700">
              <TrendingUp className="w-5 h-5" />
              Immediate Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              Quick Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {feedback.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{improvement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Session Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">
              Great work completing your <strong>{sessionMinutes}-minute</strong> practice session! 
              {sessionData.transcript && sessionData.transcript.length > 100 ? (
                ` You covered substantial content with ${sessionData.transcript.split(' ').length} words spoken.`
              ) : ' '} 
              {sessionData.fillerWordCount <= 5 ? 
                ' Your filler word usage was excellent.' : 
                ` Consider reducing filler words (detected: ${sessionData.fillerWordCount}).`
              }
              {' '}Continue practicing regularly to build on these foundations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}