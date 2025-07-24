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
    
    // Only use actual data - no fallback values
    const eyeContactScore = session.eyeContactScore ? parseFloat(session.eyeContactScore) : null;
    const wordCount = session.transcript ? session.transcript.split(' ').filter((word: string) => word.length > 0).length : 0;
    
    // Calculate overall body language score if we have at least one metric
    const bodyLanguageScores = [session.postureScore, session.gestureNaturalness, eyeContactScore].filter(s => s !== null && s !== undefined);
    const bodyLanguageOverall = bodyLanguageScores.length > 0 
      ? bodyLanguageScores.reduce((sum, score) => sum + (score || 0), 0) / bodyLanguageScores.length 
      : null;

    return {
      bodyLanguage: {
        posture: session.postureScore || null,
        gestures: session.gestureNaturalness || null,
        eyeContact: eyeContactScore,
        overall: bodyLanguageOverall
      },
      voice: {
        clarity: session.voiceClarity || null,
        pace: session.averageWPM || null,
        volume: session.volumeConsistency || null,
        fillerWords: session.fillerWords || 0
      },
      content: {
        structure: session.structureScore || null,
        clarity: session.clarityScore || null,
        engagement: session.engagementScore || session.persuasivenessScore || null
      },
      overall: {
        score: session.confidenceScore || null,
        duration: session.duration || 0,
        wordCount: wordCount
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
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.overall.score ? `${Math.round(metrics.overall.score * 100)}%` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{metrics.voice.pace || 'N/A'}</div>
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
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {metrics.bodyLanguage.overall ? `${Math.round(metrics.bodyLanguage.overall)}%` : 'N/A'}
                  </div>
                  <div className="text-lg font-medium text-gray-900 mb-1">Body Language Score</div>
                  {metrics.bodyLanguage.overall && (
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(metrics.bodyLanguage.overall)}`}>
                      {getScoreLabel(metrics.bodyLanguage.overall)}
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {metrics.bodyLanguage.posture && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Posture</span>
                        <Badge className={getScoreColor(metrics.bodyLanguage.posture)}>
                          {Math.round(metrics.bodyLanguage.posture * 100)}%
                        </Badge>
                      </div>
                      <Progress value={metrics.bodyLanguage.posture * 100} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {metrics.bodyLanguage.posture >= 0.8 ? "Great posture! You looked confident and professional." : "Try standing straighter and keeping your shoulders back."}
                      </p>
                    </div>
                  )}
                  
                  {metrics.bodyLanguage.gestures && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Hand Gestures</span>
                        <Badge className={getScoreColor(metrics.bodyLanguage.gestures)}>
                          {Math.round(metrics.bodyLanguage.gestures * 100)}%
                        </Badge>
                      </div>
                      <Progress value={metrics.bodyLanguage.gestures * 100} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {metrics.bodyLanguage.gestures >= 0.8 ? "Your gestures looked natural and helped emphasize your points." : "Practice using your hands to help tell your story."}
                      </p>
                    </div>
                  )}
                  
                  {metrics.bodyLanguage.eyeContact && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Eye Contact</span>
                        <Badge className={getScoreColor(metrics.bodyLanguage.eyeContact)}>
                          {Math.round(metrics.bodyLanguage.eyeContact)}%
                        </Badge>
                      </div>
                      <Progress value={metrics.bodyLanguage.eyeContact} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {metrics.bodyLanguage.eyeContact >= 80 ? "Good eye contact helps connect with your audience." : "Try looking at the camera more often to connect with viewers."}
                      </p>
                    </div>
                  )}
                  
                  {!metrics.bodyLanguage.posture && !metrics.bodyLanguage.gestures && !metrics.bodyLanguage.eyeContact && (
                    <div className="text-center py-8 text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Body language data not available for this session.</p>
                      <p className="text-xs mt-1">Make sure to enable camera access during recording.</p>
                    </div>
                  )}
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
                <div className="space-y-4">
                  {metrics.voice.clarity && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Clarity</span>
                        <Badge className={getScoreColor(metrics.voice.clarity)}>
                          {Math.round(metrics.voice.clarity * 100)}%
                        </Badge>
                      </div>
                      <Progress value={metrics.voice.clarity * 100} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {metrics.voice.clarity >= 0.8 ? "Your speech was clear and easy to understand." : "Focus on speaking more clearly - practice articulation exercises."}
                      </p>
                    </div>
                  )}
                  
                  {metrics.voice.pace && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Speaking Pace</span>
                        <Badge className={getScoreColor(metrics.voice.pace > 200 ? 40 : metrics.voice.pace < 120 ? 60 : 85)}>
                          {metrics.voice.pace} WPM
                        </Badge>
                      </div>
                      <Progress value={Math.min(100, (metrics.voice.pace / 180) * 100)} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {metrics.voice.pace > 200 ? "Too fast - slow down to help your audience follow along." : 
                         metrics.voice.pace < 120 ? "Too slow - try to speak a bit faster to maintain engagement." :
                         "Good pace - you spoke at an engaging speed."}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Filler Words</span>
                      <Badge className={getScoreColor(100 - Math.min(100, metrics.voice.fillerWords * 10))}>
                        {metrics.voice.fillerWords} detected
                      </Badge>
                    </div>
                    <Progress value={Math.max(0, 100 - (metrics.voice.fillerWords * 10))} className="h-3" />
                    <p className="text-sm text-gray-600 mt-1">
                      {metrics.voice.fillerWords <= 2 ? "Great job avoiding filler words!" : "Try to reduce 'um', 'uh', and 'like' - pause instead."}
                    </p>
                  </div>

                  {metrics.voice.volume && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Volume Consistency</span>
                        <Badge className={getScoreColor(metrics.voice.volume)}>
                          {Math.round(metrics.voice.volume * 100)}%
                        </Badge>
                      </div>
                      <Progress value={metrics.voice.volume * 100} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {metrics.voice.volume >= 0.8 ? "Good volume control throughout your speech." : "Try to maintain consistent volume levels."}
                      </p>
                    </div>
                  )}
                  
                  {!metrics.voice.clarity && !metrics.voice.pace && !metrics.voice.volume && (
                    <div className="text-center py-8 text-gray-500">
                      <Volume2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Voice analysis data not available for this session.</p>
                      <p className="text-xs mt-1">Make sure to enable microphone access during recording.</p>
                    </div>
                  )}
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
                <div className="space-y-4">
                  {metrics.content.structure && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Structure & Organization</span>
                        <Badge className={getScoreColor(metrics.content.structure)}>
                          {Math.round(metrics.content.structure * 100)}%
                        </Badge>
                      </div>
                      <Progress value={metrics.content.structure * 100} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {metrics.content.structure >= 0.8 ? "Good organization and flow in your presentation." : "Try organizing your points: intro, main ideas, conclusion."}
                      </p>
                    </div>
                  )}

                  {metrics.content.clarity && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Message Clarity</span>
                        <Badge className={getScoreColor(metrics.content.clarity)}>
                          {Math.round(metrics.content.clarity * 100)}%
                        </Badge>
                      </div>
                      <Progress value={metrics.content.clarity * 100} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {metrics.content.clarity >= 0.8 ? "Your message was clear and easy to follow." : "Explain complex ideas in simpler terms."}
                      </p>
                    </div>
                  )}

                  {metrics.content.engagement && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Audience Engagement</span>
                        <Badge className={getScoreColor(metrics.content.engagement)}>
                          {Math.round(metrics.content.engagement * 100)}%
                        </Badge>
                      </div>
                      <Progress value={metrics.content.engagement * 100} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {metrics.content.engagement >= 0.8 ? "Your content was engaging and held attention." : "Add stories or examples to make your message more interesting."}
                      </p>
                    </div>
                  )}
                  
                  {!metrics.content.structure && !metrics.content.clarity && !metrics.content.engagement && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Content analysis data not available for this session.</p>
                      <p className="text-xs mt-1">Content analysis requires AI processing of your transcript.</p>
                    </div>
                  )}
                </div>
                
                {selectedSession.transcript && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">What You Said:</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedSession.transcript}
                    </p>
                  </div>
                )}
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