// MediaPipe Analytics Test - Verify metrics transfer to analytics
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function MediaPipeAnalyticsTest() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/practice-sessions');
      const data = await response.json();
      setSessions(Array.isArray(data) ? data : []);
      console.log('📊 Fetched sessions:', data);
    } catch (error) {
      console.error('❌ Failed to fetch sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 MediaPipe Analytics Transfer Test
            <Button onClick={fetchSessions} disabled={isLoading} size="sm">
              {isLoading ? "Loading..." : "Refresh Sessions"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-4">
            This test verifies that MediaPipe metrics (posture, gesture, eye contact) are properly 
            transferred from the practice session to the analytics database.
          </div>
          
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sessions found. Record a practice session first to test MediaPipe analytics transfer.
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold">Available Sessions:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((session, index) => (
                  <Card 
                    key={session.id || index}
                    className={`cursor-pointer transition-colors ${
                      selectedSession?.id === session.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{session.sessionName || `Session ${index + 1}`}</h4>
                        <Badge variant="outline">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Duration: {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSession && (
        <Card>
          <CardHeader>
            <CardTitle>Session Analysis: {selectedSession.sessionName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Session Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedSession.averageWPM || 0}</div>
                  <div className="text-sm text-gray-600">WPM</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedSession.confidenceScore || 0}%</div>
                  <div className="text-sm text-gray-600">Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedSession.voiceClarity || 0}%</div>
                  <div className="text-sm text-gray-600">Clarity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{selectedSession.fillerWords || 0}</div>
                  <div className="text-sm text-gray-600">Filler Words</div>
                </div>
              </div>

              {/* MediaPipe Metrics */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">MediaPipe Body Language Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Eye Contact */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Eye Contact</span>
                      <Badge className={`${getScoreBg(selectedSession.eyeContactScore || 0)} ${getScoreColor(selectedSession.eyeContactScore || 0)}`}>
                        {selectedSession.eyeContactScore || 0}%
                      </Badge>
                    </div>
                    <Progress value={selectedSession.eyeContactScore || 0} className="h-2" />
                    <div className="text-xs text-gray-500">
                      Database field: eyeContactScore
                    </div>
                  </div>

                  {/* Posture Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Posture Score</span>
                      <Badge className={`${getScoreBg(selectedSession.postureScore || 0)} ${getScoreColor(selectedSession.postureScore || 0)}`}>
                        {selectedSession.postureScore || 0}%
                      </Badge>
                    </div>
                    <Progress value={selectedSession.postureScore || 0} className="h-2" />
                    <div className="text-xs text-gray-500">
                      Database field: postureScore
                    </div>
                  </div>

                  {/* Gesture Score */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Gesture Score</span>
                      <Badge className={`${getScoreBg(selectedSession.gestureScore || 0)} ${getScoreColor(selectedSession.gestureScore || 0)}`}>
                        {selectedSession.gestureScore || 0}%
                      </Badge>
                    </div>
                    <Progress value={selectedSession.gestureScore || 0} className="h-2" />
                    <div className="text-xs text-gray-500">
                      Database field: gestureScore
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Session Data */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Raw Session Data (for debugging)</h3>
                <div className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-64">
                  <pre>{JSON.stringify(selectedSession, null, 2)}</pre>
                </div>
              </div>

              {/* Transfer Status */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">MediaPipe Transfer Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-3 rounded ${selectedSession.eyeContactScore > 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <div className="font-medium">Eye Contact</div>
                    <div className="text-sm">
                      {selectedSession.eyeContactScore > 0 ? '✅ Transferred' : '❌ Not transferred'}
                    </div>
                  </div>
                  <div className={`p-3 rounded ${selectedSession.postureScore > 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <div className="font-medium">Posture Score</div>
                    <div className="text-sm">
                      {selectedSession.postureScore > 0 ? '✅ Transferred' : '❌ Not transferred'}
                    </div>
                  </div>
                  <div className={`p-3 rounded ${selectedSession.gestureScore > 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <div className="font-medium">Gesture Score</div>
                    <div className="text-sm">
                      {selectedSession.gestureScore > 0 ? '✅ Transferred' : '❌ Not transferred'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
