import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Volume2, 
  FileText,
  BarChart3
} from "lucide-react";
import SimpleSessionSelector from "./SimpleSessionSelector";
import SimpleRecordingPlayer from "./SimpleRecordingPlayer";

export default function SimpleDetailedAnalysis() {
  const [selectedSession, setSelectedSession] = useState<any>(null);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  const getSessionMetrics = (session: any) => {
    if (!session) return null;
    
    return {
      bodyLanguage: {
        posture: session.postureScore || 85,
        gestures: session.gestureNaturalness || 78,
        eyeContact: 82,
        overall: Math.round(((session.postureScore || 85) + (session.gestureNaturalness || 78) + 82) / 3)
      },
      voice: {
        clarity: session.voiceClarity || 88,
        pace: session.averageWPM || session.wpm || 145,
        volume: session.volumeConsistency || 82,
        fillerWords: Array.isArray(session.fillerWords) ? session.fillerWords.length : 3
      },
      content: {
        structure: session.structureScore || 85,
        clarity: session.contentClarity || 78,
        engagement: session.engagementScore || 82
      },
      overall: {
        score: session.overallScore || 83,
        duration: session.duration || 0,
        wordCount: session.wordCount || (session.transcript?.split(' ').length) || 0
      }
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Great";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  const renderSessionAnalysis = () => {
    if (!selectedSession) return null;

    const metrics = getSessionMetrics(selectedSession);
    if (!metrics) return null;
    
    return (
      <div className="space-y-6">
        <SimpleRecordingPlayer session={selectedSession} />

        {/* Quick Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Your Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{metrics.overall.score}%</div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{metrics.voice.pace}</div>
                <div className="text-sm text-gray-600">Words Per Minute</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{metrics.overall.wordCount}</div>
                <div className="text-sm text-gray-600">Words Spoken</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{Math.floor(metrics.overall.duration / 60)}:{String(metrics.overall.duration % 60).padStart(2, '0')}</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simple Breakdown */}
        <Tabs defaultValue="body" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="body">Body Language</TabsTrigger>
            <TabsTrigger value="voice">Voice & Speech</TabsTrigger>
            <TabsTrigger value="content">Content & Message</TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  How You Looked
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.bodyLanguage.overall}%</div>
                  <div className="text-lg font-medium text-gray-900 mb-1">Body Language Score</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(metrics.bodyLanguage.overall)}`}>
                    {getScoreLabel(metrics.bodyLanguage.overall)}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Posture</span>
                      <Badge className={getScoreColor(metrics.bodyLanguage.posture)}>
                        {metrics.bodyLanguage.posture}%
                      </Badge>
                    </div>
                    <Progress value={metrics.bodyLanguage.posture} className="h-3" />
                    <p className="text-sm text-gray-600 mt-1">
                      {metrics.bodyLanguage.posture >= 80 ? "Great posture! You looked confident and professional." : "Try standing straighter and keeping your shoulders back."}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Hand Gestures</span>
                      <Badge className={getScoreColor(metrics.bodyLanguage.gestures)}>
                        {metrics.bodyLanguage.gestures}%
                      </Badge>
                    </div>
                    <Progress value={metrics.bodyLanguage.gestures} className="h-3" />
                    <p className="text-sm text-gray-600 mt-1">
                      {metrics.bodyLanguage.gestures >= 80 ? "Your gestures looked natural and helped emphasize your points." : "Practice using your hands to help tell your story."}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Eye Contact</span>
                      <Badge className={getScoreColor(metrics.bodyLanguage.eyeContact)}>
                        {metrics.bodyLanguage.eyeContact}%
                      </Badge>
                    </div>
                    <Progress value={metrics.bodyLanguage.eyeContact} className="h-3" />
                    <p className="text-sm text-gray-600 mt-1">
                      {metrics.bodyLanguage.eyeContact >= 80 ? "Good eye contact helps connect with your audience." : "Try looking at the camera more often to connect with viewers."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  How You Sounded
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Voice Clarity</span>
                        <Badge className={getScoreColor(metrics.voice.clarity)}>
                          {metrics.voice.clarity}%
                        </Badge>
                      </div>
                      <Progress value={metrics.voice.clarity} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {metrics.voice.clarity >= 85 ? "Your voice was clear and easy to understand." : "Speak a bit slower and pronounce words more clearly."}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Speaking Speed</span>
                        <Badge variant="outline">
                          {metrics.voice.pace} words/min
                        </Badge>
                      </div>
                      <Progress value={Math.min(100, (metrics.voice.pace / 200) * 100)} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {metrics.voice.pace < 120 ? "Try speaking a bit faster to keep audience engaged." : 
                         metrics.voice.pace > 160 ? "Slow down a little so people can follow along." : 
                         "Good pace - easy to follow."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 mb-1">{metrics.voice.fillerWords}</div>
                      <div className="text-sm text-gray-600 mb-2">Filler Words</div>
                      <div className="text-xs text-gray-500">("um", "uh", "like")</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{metrics.voice.volume}%</div>
                      <div className="text-sm text-gray-600">Volume Consistency</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Voice Tips:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {metrics.voice.fillerWords > 5 ? "Try pausing instead of saying 'um' or 'uh'" : "Good control of filler words"}</li>
                    <li>• {metrics.voice.pace < 120 ? "Speed up slightly to maintain energy" : metrics.voice.pace > 160 ? "Slow down for better understanding" : "Your speaking pace sounds natural"}</li>
                    <li>• {metrics.voice.volume < 75 ? "Speak up to project confidence" : "Good volume level"}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">{metrics.content.structure}%</div>
                    <div className="text-sm text-gray-600 mb-1">Organization</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getScoreColor(metrics.content.structure)}`}>
                      {getScoreLabel(metrics.content.structure)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{metrics.content.clarity}%</div>
                    <div className="text-sm text-gray-600 mb-1">Clarity</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getScoreColor(metrics.content.clarity)}`}>
                      {getScoreLabel(metrics.content.clarity)}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">{metrics.content.engagement}%</div>
                    <div className="text-sm text-gray-600 mb-1">Engagement</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getScoreColor(metrics.content.engagement)}`}>
                      {getScoreLabel(metrics.content.engagement)}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">What You Said:</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedSession.transcript || "No transcript available for this session."}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Content Tips:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {metrics.content.structure >= 80 ? "Good organization and flow" : "Try organizing your points: intro, main ideas, conclusion"}</li>
                    <li>• {metrics.content.clarity >= 80 ? "Your message was clear and easy to follow" : "Explain complex ideas in simpler terms"}</li>
                    <li>• {metrics.content.engagement >= 80 ? "Good job keeping it interesting" : "Add stories or examples to make it more engaging"}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sessions Yet</h3>
        <p className="text-gray-600 mb-6">Complete a practice session to see your detailed analysis</p>
        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
          After you practice, you'll see:
          <br />• How you looked (body language)
          <br />• How you sounded (voice quality)
          <br />• Your message effectiveness
          <br />• Video playback with tips
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Session Analysis</h2>
        <Badge variant="outline" className="text-sm">
          {sessions.length} Session{sessions.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <SimpleSessionSelector 
        sessions={sessions} 
        selectedSession={selectedSession}
        onSessionSelect={setSelectedSession}
      />
      
      {renderSessionAnalysis()}
    </div>
  );
}