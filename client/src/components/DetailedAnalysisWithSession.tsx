import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Eye, 
  Hand, 
  Activity, 
  Volume2, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  MessageSquare,
  Target,
  Zap
} from "lucide-react";
import SessionSelector from "./SessionSelector";

export default function DetailedAnalysisWithSession() {
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const renderSessionAnalysis = () => {
    if (!selectedSession) return null;

    const metrics = selectedSession.detailedMetrics?.metrics || {};
    const scores = selectedSession.detailedMetrics?.scores || {};
    
    return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{scores.overall || 0}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.wordsPerMinute || 0}</div>
              <div className="text-sm text-gray-600">Words Per Minute</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.totalWords || 0}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.totalFillers || 0}</div>
              <div className="text-sm text-gray-600">Filler Words</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="voice">Voice Analysis</TabsTrigger>
            <TabsTrigger value="body">Body Language</TabsTrigger>
            <TabsTrigger value="content">Content Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <span>Voice Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Voice Clarity</span>
                      <span className="text-sm text-gray-600">{selectedSession.voiceClarity}%</span>
                    </div>
                    <Progress value={selectedSession.voiceClarity} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Speaking Pace</span>
                      <span className="text-sm text-gray-600">{metrics.wordsPerMinute} WPM</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (metrics.wordsPerMinute / 150) * 100)} 
                      className="h-2" 
                    />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Pace Analysis</h4>
                  <p className="text-sm text-blue-700">
                    {metrics.wordsPerMinute < 120 
                      ? "Consider speaking faster to maintain audience engagement"
                      : metrics.wordsPerMinute > 180
                      ? "Slow down slightly to ensure clarity and comprehension"
                      : "Excellent pace for clear communication"
                    }
                  </p>
                </div>

                {selectedSession.fillerWords?.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Filler Words Detected</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(selectedSession.fillerWords)).map((word: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-yellow-100 text-yellow-800">
                          {word} ({selectedSession.fillerWords.filter((f: string) => f === word).length})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="body" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  <span>Body Language Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Eye Contact</span>
                      <span className="text-sm text-gray-600">{selectedSession.eyeContactScore}%</span>
                    </div>
                    <Progress value={selectedSession.eyeContactScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Posture</span>
                      <span className="text-sm text-gray-600">{selectedSession.postureScore}%</span>
                    </div>
                    <Progress value={selectedSession.postureScore} className="h-2" />
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Body Language Assessment</h4>
                  <p className="text-sm text-green-700">
                    {selectedSession.eyeContactScore > 75 && selectedSession.postureScore > 75
                      ? "Excellent body language showing confidence and engagement"
                      : selectedSession.eyeContactScore < 60 || selectedSession.postureScore < 60
                      ? "Focus on maintaining better eye contact and posture for stronger presence"
                      : "Good body language with room for improvement in consistency"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span>Content Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{metrics.totalWords}</div>
                    <div className="text-sm text-gray-600">Total Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{metrics.totalFillers}</div>
                    <div className="text-sm text-gray-600">Filler Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{metrics.fillerRate?.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Filler Rate</div>
                  </div>
                </div>

                {selectedSession.transcript && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Session Transcript</h4>
                    <div className="max-h-32 overflow-y-auto text-sm text-gray-700">
                      {selectedSession.transcript}
                    </div>
                  </div>
                )}

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Content Quality</h4>
                  <p className="text-sm text-purple-700">
                    {metrics.fillerRate < 2
                      ? "Excellent fluency with minimal filler words"
                      : metrics.fillerRate > 5
                      ? "Practice reducing filler words to improve message clarity"
                      : "Good content delivery with manageable filler word usage"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Session Purpose Analysis */}
        {selectedSession.purpose && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-orange-600" />
                <span>Purpose-Specific Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">Session Purpose: {selectedSession.purpose}</h4>
                <p className="text-sm text-orange-700">
                  {selectedSession.detailedMetrics?.feedback?.summary || 
                   "This session was designed to practice specific communication skills."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SessionSelector 
        onSessionSelect={setSelectedSession}
        selectedSession={selectedSession}
        placeholder="Select a session to view detailed performance analytics and metrics."
      />
      
      {selectedSession ? renderSessionAnalysis() : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-gray-500 py-8">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Ready for Analysis</h3>
              <p className="text-sm">
                Choose a session above to view comprehensive performance metrics, voice analysis, body language assessment, and content evaluation.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}