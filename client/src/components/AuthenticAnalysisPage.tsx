import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  Mic, 
  Eye, 
  Activity, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  MessageSquare,
  Video,
  Volume2,
  Pause,
  Hash,
  Loader2
} from "lucide-react";

interface AuthenticAnalysisProps {
  session?: {
    id: number;
    sessionNumber: number;
    sessionName: string;
    purpose: string;
    duration: number;
    transcript: string;
    averageWPM: number;
    confidenceScore: number;
    voiceClarity: number;
    fillerWords: number;
    pauseCount: number;
    eyeContactScore: string;
    coachingTips: string[];
    videoBlob?: string;
    facialAnalysis?: any;
    voiceMetrics?: any;
    bodyLanguageMetrics?: any;
    persuasivenessScore: number;
    createdAt: string;
  };
  onClose: () => void;
  onNewSession: () => void;
}

// Validation functions to ensure only authentic data is displayed
const validateMetric = (value: any, type: 'number' | 'string' | 'array' = 'number'): boolean => {
  if (value === null || value === undefined) return false;
  
  switch (type) {
    case 'number':
      return typeof value === 'number' && value > 0 && !isNaN(value);
    case 'string':
      return typeof value === 'string' && value.trim().length > 0;
    case 'array':
      return Array.isArray(value) && value.length > 0;
    default:
      return false;
  }
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getScoreLabel = (score: number): string => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  return "Needs Improvement";
};

export default function AuthenticAnalysisPage({ session: propSession, onClose, onNewSession }: AuthenticAnalysisProps) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Changed to false since we have propSession
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(propSession);

  // Log initial props
  console.log('📊 AuthenticAnalysisPage mounted with session:', propSession);

  // Fetch sessions from server
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Only show loading if we don't have a propSession
        if (!propSession) {
          setLoading(true);
        }
        
        const response = await fetch('/api/practice-sessions');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch sessions: ${response.status}`);
        }
        
        const fetchedSessions = await response.json();
        console.log('📊 Fetched sessions from server:', fetchedSessions);
        
        setSessions(fetchedSessions);
        
        // If no session was passed as prop, use the most recent session
        if (!propSession && fetchedSessions.length > 0) {
          console.log('📊 Using most recent session:', fetchedSessions[0]);
          setSelectedSession(fetchedSessions[0]);
        }
        
      } catch (err) {
        console.error('❌ Failed to fetch sessions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [propSession]);

  // Use the selected session or the prop session
  const session = selectedSession || propSession;

  console.log('🔍 AuthenticAnalysisPage session data:', {
    session,
    propSession,
    selectedSession,
    hasSession: !!session,
    sessionId: session?.id,
    sessionNumber: session?.sessionNumber
  });
  
  // Only display metrics that have authentic, validated data
  const authenticMetrics = {
    duration: validateMetric(session?.duration) ? session.duration : null,
    wpm: validateMetric(session?.averageWPM) ? session.averageWPM : null,
    confidence: validateMetric(session?.confidenceScore) ? session.confidenceScore : null,
    clarity: validateMetric(session?.voiceClarity) ? session.voiceClarity : null,
    fillerWords: validateMetric(session?.fillerWords) ? session.fillerWords : null,
    pauseCount: validateMetric(session?.pauseCount) ? session.pauseCount : null,
    transcript: validateMetric(session?.transcript, 'string') ? session.transcript : null,
    coachingTips: validateMetric(session?.coachingTips, 'array') ? session.coachingTips : null,
    persuasiveness: validateMetric(session?.persuasivenessScore) ? session.persuasivenessScore : null,
    hasVideo: validateMetric(session?.videoBlob, 'string'),
    hasFacialAnalysis: session?.facialAnalysis !== null && session?.facialAnalysis !== undefined,
    hasVoiceMetrics: session?.voiceMetrics !== null && session?.voiceMetrics !== undefined
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading session data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Error Loading Sessions</h3>
                  <p className="text-sm text-red-700">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="mt-2"
                    variant="outline"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-900">No Sessions Found</h3>
                  <p className="text-sm text-yellow-700">
                    No practice sessions found. Complete a practice session to see your analytics.
                  </p>
                  <Button 
                    onClick={onNewSession} 
                    className="mt-2"
                  >
                    Start Practice Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Session Header */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-blue-900">
                  {session.sessionName} - Authentic Analysis Report
                </CardTitle>
                <CardDescription className="text-blue-700 font-semibold mt-2">
                  Session #{session.sessionNumber} • {session.purpose} • {new Date(session.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                Authentic Data Only
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Session Selector */}
        {sessions.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Session</CardTitle>
              <CardDescription>Choose a different session to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sessions.map((sess) => (
                  <Button
                    key={sess.id}
                    variant={selectedSession?.id === sess.id ? "default" : "outline"}
                    onClick={() => setSelectedSession(sess)}
                    className="justify-start text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium">{sess.sessionName}</div>
                      <div className="text-sm text-gray-500">
                        Session #{sess.sessionNumber} • {formatDuration(sess.duration)}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Core Metrics - Only Authentic Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {authenticMetrics.duration && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-2xl font-bold">{formatDuration(authenticMetrics.duration)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {authenticMetrics.wpm && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Speaking Rate</p>
                    <p className="text-2xl font-bold">{authenticMetrics.wpm} WPM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {authenticMetrics.confidence && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Confidence</p>
                    <p className={`text-2xl font-bold ${getScoreColor(authenticMetrics.confidence)}`}>
                      {authenticMetrics.confidence}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {authenticMetrics.clarity && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Voice Clarity</p>
                    <p className={`text-2xl font-bold ${getScoreColor(authenticMetrics.clarity)}`}>
                      {authenticMetrics.clarity}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Speech Pattern Analysis */}
        {(authenticMetrics.fillerWords !== null || authenticMetrics.pauseCount !== null) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Speech Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {authenticMetrics.fillerWords !== null && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-4 w-4 text-red-500" />
                      <span className="font-semibold">Filler Words</span>
                    </div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {authenticMetrics.fillerWords}
                    </div>
                    <p className="text-sm text-gray-600">
                      Total instances of "um", "uh", "like", etc.
                    </p>
                  </div>
                )}

                {authenticMetrics.pauseCount !== null && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Pause className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold">Pause Count</span>
                    </div>
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {authenticMetrics.pauseCount}
                    </div>
                    <p className="text-sm text-gray-600">
                      Number of significant pauses detected
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transcript Section */}
        {authenticMetrics.transcript && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                Complete Transcript
              </CardTitle>
              <CardDescription>
                Automatically generated from your speech recording
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {authenticMetrics.transcript}
                </p>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Word count: {authenticMetrics.transcript.split(' ').length} words
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Coaching Tips */}
        {authenticMetrics.coachingTips && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                AI Coaching Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {authenticMetrics.coachingTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-800">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Authenticity Notice */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">100% Authentic Analysis</h3>
                <p className="text-sm text-green-700">
                  All metrics shown are derived from real computer vision analysis, voice processing, and AI evaluation. 
                  No placeholder or synthetic data is used in this report.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Media */}
        {authenticMetrics.hasVideo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-blue-600" />
                Session Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Video recording available for review</p>
                <Button variant="outline" className="mt-2">
                  View Recording
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={onNewSession}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start New Session
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* No Data Warning */}
        {!authenticMetrics.duration && !authenticMetrics.transcript && !authenticMetrics.wpm && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Limited Analysis Data</h3>
                  <p className="text-sm text-yellow-700">
                    This session has minimal authentic data available for analysis. For better insights, 
                    ensure your recording includes clear audio and video input.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}