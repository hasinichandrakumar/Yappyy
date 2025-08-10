import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Zap,
  Play,
  FileText,
  Video
} from "lucide-react";
import SessionSelector from "./SessionSelector";
import SessionRecordingPlayer from "./SessionRecordingPlayer";
import SmartAIFeedback from "./SmartAIFeedback";
import VideoRewatchDialog from "./VideoRewatchDialog";
import ContentAnalysisTab from "./ContentAnalysisTab";

export default function DetailedAnalysisWithSession() {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  const getSessionMetrics = (session: any) => {
    if (!session) return null;
    
    // Only use actual data - no fallback values
    const eyeContactScore = session.eyeContactScore ? 
      (typeof session.eyeContactScore === 'string' ? parseFloat(session.eyeContactScore) : session.eyeContactScore) 
      : null;
    const wordCount = session.transcript ? session.transcript.split(' ').filter((word: string) => word.length > 0).length : 0;
    
    // Calculate overall scores only if we have actual data
    const bodyLanguageScores = [session.postureScore, session.gestureNaturalness, eyeContactScore].filter(s => s !== null && s !== undefined);
    const overallBodyLanguage = bodyLanguageScores.length > 0 
      ? bodyLanguageScores.reduce((sum, score) => sum + (score || 0), 0) / bodyLanguageScores.length 
      : null;
    
    return {
      bodyLanguage: {
        postureScore: session.postureScore || null,
        gestureNaturalness: session.gestureNaturalness || null,
        eyeContactScore: eyeContactScore,
        facialExpression: session.facialExpression || null,
        overallBodyLanguage: overallBodyLanguage
      },
      voice: {
        clarity: session.voiceClarity || null,
        pace: session.averageWPM || null,
        volume: session.volumeConsistency || null,
        intonation: session.intonationScore || null,
        fillerCount: session.fillerWords || 0,
        pauseEffectiveness: session.speechPatterns?.pauseEffectiveness || null
      },
      content: {
        structure: session.structureScore || null,
        clarity: session.clarityScore || null,
        engagement: session.engagementScore || null,
        persuasiveness: session.persuasivenessScore || null,
        relevance: session.relevanceScore || null,
        completeness: session.completenessScore || null
      },
      overall: {
        score: session.confidenceScore || null,
        duration: session.duration || 0,
        wordCount: wordCount,
        confidenceLevel: session.confidenceScore || null
      }
    };
  };

  const renderSessionAnalysis = () => {
    if (!selectedSession) return null;

    const metrics = getSessionMetrics(selectedSession);
    if (!metrics) return null;
    
    return (
      <div className="space-y-6">
        {/* Session Recording Player */}
        <SessionRecordingPlayer session={selectedSession} />

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-extrabold text-blue-600">
                {metrics.overall.score ? `${Math.round(metrics.overall.score * 100)}%` : 'N/A'}
              </div>
              <div className="text-sm font-semibold text-gray-700">Overall Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-extrabold text-green-600">{metrics.voice.pace || 'N/A'}</div>
              <div className="text-sm font-semibold text-gray-700">Words Per Minute</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-extrabold text-purple-600">{metrics.overall.wordCount}</div>
              <div className="text-sm font-semibold text-gray-700">Total Words</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-extrabold text-orange-600">{Math.floor(metrics.overall.duration / 60)}:{String(metrics.overall.duration % 60).padStart(2, '0')}</div>
              <div className="text-sm font-semibold text-gray-700">Duration</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics Tabs */}
        <Tabs defaultValue="body-language" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="body-language">Body Language</TabsTrigger>
            <TabsTrigger value="voice">Voice Analysis</TabsTrigger>
            <TabsTrigger value="content">Content Analysis</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
          </TabsList>

          <TabsContent value="body-language" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Body Language Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Only show metrics with authentic data (> 0) */}
                    {metrics.bodyLanguage.postureScore && metrics.bodyLanguage.postureScore > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Posture Score
                          </span>
                          <Badge variant={metrics.bodyLanguage.postureScore >= 80 ? "default" : "secondary"}>
                            {metrics.bodyLanguage.postureScore}%
                          </Badge>
                        </div>
                        <Progress value={metrics.bodyLanguage.postureScore} className="h-2" />
                      </>
                    )}
                    
                    {metrics.bodyLanguage.gestureNaturalness && metrics.bodyLanguage.gestureNaturalness > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Hand className="h-4 w-4" />
                            Gesture Naturalness
                          </span>
                          <Badge variant={metrics.bodyLanguage.gestureNaturalness >= 75 ? "default" : "secondary"}>
                            {metrics.bodyLanguage.gestureNaturalness}%
                          </Badge>
                        </div>
                        <Progress value={metrics.bodyLanguage.gestureNaturalness} className="h-2" />
                      </>
                    )}
                    
                    {metrics.bodyLanguage.eyeContactScore && metrics.bodyLanguage.eyeContactScore > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Eye Contact
                          </span>
                          <Badge variant={metrics.bodyLanguage.eyeContactScore >= 75 ? "default" : "secondary"}>
                            {metrics.bodyLanguage.eyeContactScore}%
                          </Badge>
                        </div>
                        <Progress value={metrics.bodyLanguage.eyeContactScore} className="h-2" />
                      </>
                    )}
                    
                    {/* Show message when no body language data available */}
                    {(!metrics.bodyLanguage.postureScore || metrics.bodyLanguage.postureScore === 0) &&
                     (!metrics.bodyLanguage.gestureNaturalness || metrics.bodyLanguage.gestureNaturalness === 0) &&
                     (!metrics.bodyLanguage.eyeContactScore || metrics.bodyLanguage.eyeContactScore === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">No Body Language Data</p>
                        <p className="text-sm">Computer vision analysis requires camera access during recording</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {/* Only show overall score if we have authentic body language data */}
                    {metrics.bodyLanguage.overallBodyLanguage && metrics.bodyLanguage.overallBodyLanguage > 0 && (
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {Math.round(metrics.bodyLanguage.overallBodyLanguage)}%
                        </div>
                        <div className="text-sm text-gray-600">Overall Body Language Score</div>
                      </div>
                    )}
                    
                    {/* Only show observations if we have actual data */}
                    {(metrics.bodyLanguage.postureScore > 0 || metrics.bodyLanguage.gestureNaturalness > 0 || metrics.bodyLanguage.eyeContactScore > 0) && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Key Observations:</h4>
                        <ul className="text-sm space-y-1 text-gray-600">
                          {metrics.bodyLanguage.postureScore > 0 && (
                            <li>• {metrics.bodyLanguage.postureScore >= 85 ? "Excellent posture maintained" : "Focus on maintaining upright posture"}</li>
                          )}
                          {metrics.bodyLanguage.gestureNaturalness > 0 && (
                            <li>• {metrics.bodyLanguage.gestureNaturalness >= 80 ? "Natural, expressive gestures" : "Work on more natural hand movements"}</li>
                          )}
                          {metrics.bodyLanguage.eyeContactScore > 0 && (
                            <li>• {metrics.bodyLanguage.eyeContactScore >= 80 ? "Strong audience connection" : "Increase eye contact with audience"}</li>
                          )}
                        </ul>
                      </div>
                    )}
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
                  Voice & Speech Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Only show voice metrics with authentic data (> 0) */}
                    {metrics.voice.clarity && metrics.voice.clarity > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Voice Clarity</span>
                          <Badge variant={metrics.voice.clarity >= 85 ? "default" : "secondary"}>
                            {metrics.voice.clarity}%
                          </Badge>
                        </div>
                        <Progress value={metrics.voice.clarity} className="h-2" />
                      </>
                    )}
                    
                    {metrics.voice.pace && metrics.voice.pace > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Speaking Pace</span>
                          <Badge variant={metrics.voice.pace >= 120 && metrics.voice.pace <= 160 ? "default" : "secondary"}>
                            {metrics.voice.pace} WPM
                          </Badge>
                        </div>
                        <Progress value={Math.min(100, (metrics.voice.pace / 200) * 100)} className="h-2" />
                      </>
                    )}
                    
                    {metrics.voice.volume && metrics.voice.volume > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Volume Consistency</span>
                          <Badge variant={metrics.voice.volume >= 75 ? "default" : "secondary"}>
                            {metrics.voice.volume}%
                          </Badge>
                        </div>
                        <Progress value={metrics.voice.volume} className="h-2" />
                      </>
                    )}
                    
                    {metrics.voice.intonation && metrics.voice.intonation > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <span>Intonation Variety</span>
                          <Badge variant={metrics.voice.intonation >= 70 ? "default" : "secondary"}>
                            {metrics.voice.intonation}%
                          </Badge>
                        </div>
                        <Progress value={metrics.voice.intonation} className="h-2" />
                      </>
                    )}
                    
                    {/* Show message when no voice analysis data available */}
                    {(!metrics.voice.clarity || metrics.voice.clarity === 0) &&
                     (!metrics.voice.volume || metrics.voice.volume === 0) &&
                     (!metrics.voice.intonation || metrics.voice.intonation === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">No Voice Analysis Data</p>
                        <p className="text-sm">Voice metrics require audio recording and speech processing</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500 mb-1">{metrics.voice.fillerCount}</div>
                        <div className="text-sm text-gray-600">Filler Words</div>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500 mb-1">{metrics.voice.pauseEffectiveness}%</div>
                        <div className="text-sm text-gray-600">Pause Effectiveness</div>
                      </div>
                    </Card>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Voice Recommendations:</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• {metrics.voice.pace < 120 ? "Increase speaking pace slightly" : metrics.voice.pace > 160 ? "Slow down for better comprehension" : "Maintain current speaking pace"}</li>
                        <li>• {metrics.voice.fillerCount > 5 ? "Reduce filler words with strategic pauses" : "Good control of filler words"}</li>
                        <li>• {metrics.voice.intonation < 70 ? "Add more vocal variety and emphasis" : "Good vocal dynamics"}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <ContentAnalysisTab session={selectedSession} />
          </TabsContent>

          <TabsContent value="transcript" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Session Transcript
                  </CardTitle>
                  {(selectedSession.videoUrl || selectedSession.recordingUrl || selectedSession.videoData) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Video className="h-4 w-4" />
                          Rewatch Video
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-full">
                        <DialogHeader>
                          <DialogTitle>Session Video Playback</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="relative bg-black rounded-lg overflow-hidden">
                            <video
                              className="w-full h-96 object-contain"
                              controls
                              preload="metadata"
                            >
                              <source src={selectedSession.videoUrl || selectedSession.recordingUrl} type="video/mp4" />
                              <source src={selectedSession.videoUrl || selectedSession.recordingUrl} type="video/webm" />
                              Your browser does not support video playback.
                            </video>
                          </div>
                          {selectedSession.transcript && (
                            <div className="bg-gray-50 p-4 rounded-lg max-h-32 overflow-y-auto">
                              <h4 className="font-medium text-sm mb-2">Session Transcript:</h4>
                              <p className="text-xs text-gray-700 leading-relaxed">
                                {selectedSession.transcript}
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {selectedSession.transcript || "No transcript available for this session."}
                  </p>
                </div>
                
                {selectedSession.fillerWords && Array.isArray(selectedSession.fillerWords) && selectedSession.fillerWords.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Detected Filler Words:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSession.fillerWords.map((word: string, index: number) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {word}
                        </Badge>
                      ))}
                    </div>
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
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Practice Sessions</h3>
        <p className="text-gray-600 mb-6">Start practicing to see detailed analysis of your sessions</p>
        <div className="text-sm text-gray-500">
          Complete a practice session to access comprehensive analytics including:
          <br />• Body language and posture analysis
          <br />• Voice clarity and pace metrics
          <br />• Content structure evaluation
          <br />• Session recording playback
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Detailed Session Analysis</h2>
        <Badge variant="outline" className="text-sm">
          {sessions.length} Session{sessions.length !== 1 ? 's' : ''} Available
        </Badge>
      </div>
      
      <SessionSelector 
        sessions={sessions} 
        onSessionSelect={setSelectedSession}
        selectedSession={selectedSession}
        showRecordingIndicator={true}
      />
      
      {renderSessionAnalysis()}

      {/* Video Rewatch Dialog */}
      <VideoRewatchDialog
        isOpen={videoDialogOpen}
        onClose={() => setVideoDialogOpen(false)}
        sessionId={selectedSession?.id || 0}
        sessionName={selectedSession?.sessionName || selectedSession?.name || "Practice Session"}
        transcript={selectedSession?.transcript}
      />
    </div>
  );
}
