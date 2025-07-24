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

export default function DetailedAnalysisWithSession() {
  const [selectedSession, setSelectedSession] = useState<any>(null);

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
              <div className="text-2xl font-bold text-blue-600">
                {metrics.overall.score ? `${Math.round(metrics.overall.score * 100)}%` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.voice.pace || 'N/A'}</div>
              <div className="text-sm text-gray-600">Words Per Minute</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.overall.wordCount}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{Math.floor(metrics.overall.duration / 60)}:{String(metrics.overall.duration % 60).padStart(2, '0')}</div>
              <div className="text-sm text-gray-600">Duration</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics Tabs */}
        <Tabs defaultValue="body-language" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="body-language">Body Language</TabsTrigger>
            <TabsTrigger value="voice">Voice Analysis</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
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
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {metrics.bodyLanguage.overallBodyLanguage}%
                      </div>
                      <div className="text-sm text-gray-600">Overall Body Language Score</div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Key Observations:</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• {metrics.bodyLanguage.postureScore >= 85 ? "Excellent posture maintained" : "Focus on maintaining upright posture"}</li>
                        <li>• {metrics.bodyLanguage.gestureNaturalness >= 80 ? "Natural, expressive gestures" : "Work on more natural hand movements"}</li>
                        <li>• {metrics.bodyLanguage.eyeContactScore >= 80 ? "Strong audience connection" : "Increase eye contact with audience"}</li>
                      </ul>
                    </div>
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
                    <div className="flex items-center justify-between">
                      <span>Voice Clarity</span>
                      <Badge variant={metrics.voice.clarity >= 85 ? "default" : "secondary"}>
                        {metrics.voice.clarity}%
                      </Badge>
                    </div>
                    <Progress value={metrics.voice.clarity} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Speaking Pace</span>
                      <Badge variant={metrics.voice.pace >= 120 && metrics.voice.pace <= 160 ? "default" : "secondary"}>
                        {metrics.voice.pace} WPM
                      </Badge>
                    </div>
                    <Progress value={Math.min(100, (metrics.voice.pace / 200) * 100)} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Volume Consistency</span>
                      <Badge variant={metrics.voice.volume >= 75 ? "default" : "secondary"}>
                        {metrics.voice.volume}%
                      </Badge>
                    </div>
                    <Progress value={metrics.voice.volume} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Intonation Variety</span>
                      <Badge variant={metrics.voice.intonation >= 70 ? "default" : "secondary"}>
                        {metrics.voice.intonation}%
                      </Badge>
                    </div>
                    <Progress value={metrics.voice.intonation} className="h-2" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Content Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">{metrics.content.structure}%</div>
                    <div className="text-sm text-gray-600">Structure</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{metrics.content.engagement}%</div>
                    <div className="text-sm text-gray-600">Engagement</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">{metrics.content.persuasiveness}%</div>
                    <div className="text-sm text-gray-600">Persuasiveness</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Content Clarity</span>
                    <Badge variant={metrics.content.clarity >= 80 ? "default" : "secondary"}>
                      {metrics.content.clarity}%
                    </Badge>
                  </div>
                  <Progress value={metrics.content.clarity} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>Relevance</span>
                    <Badge variant={metrics.content.relevance >= 85 ? "default" : "secondary"}>
                      {metrics.content.relevance}%
                    </Badge>
                  </div>
                  <Progress value={metrics.content.relevance} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span>Completeness</span>
                    <Badge variant={metrics.content.completeness >= 80 ? "default" : "secondary"}>
                      {metrics.content.completeness}%
                    </Badge>
                  </div>
                  <Progress value={metrics.content.completeness} className="h-2" />
                </div>
              </CardContent>
            </Card>
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
    </div>
  );
}
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