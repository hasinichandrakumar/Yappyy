// Session History Viewer with Video Playback and Transcript Review
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import SessionVideoPlayer from './SessionVideoPlayer';
import { 
  Play, Video, FileText, Clock, TrendingUp,
  Calendar, Search, Filter, ArrowLeft
} from 'lucide-react';

interface SessionHistoryData {
  id: number;
  sessionName: string;
  transcript: string;
  duration: number;
  hasVideo: boolean;
  videoSize?: number;
  createdAt: string;
  confidenceScore: number;
  overallScore: number;
}

interface SessionHistoryViewerProps {
  userId?: string;
  onClose?: () => void;
}

export default function SessionHistoryViewer({ userId = 'guest', onClose }: SessionHistoryViewerProps) {
  const [sessions, setSessions] = useState<SessionHistoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'transcript'>('all');
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  // Load user sessions
  useEffect(() => {
    const loadUserSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/users/${userId}/sessions-with-video`);
        
        if (!response.ok) {
          throw new Error('Failed to load session history');
        }

        const sessionData = await response.json();
        setSessions(sessionData);
        
        console.log('📚 Session history loaded:', sessionData.length, 'sessions');
        
      } catch (error) {
        console.error('❌ Failed to load session history:', error);
        setError('Failed to load session history');
        toast({
          title: "Loading Error",
          description: "Could not load session history",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSessions();
  }, [userId, toast]);

  // Filter sessions based on search and filter type
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.transcript.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'video' && session.hasVideo) ||
      (filterType === 'transcript' && session.transcript.length > 0);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  // Show video player for selected session
  if (selectedSession) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <Button 
              onClick={() => setSelectedSession(null)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to History
            </Button>
          </div>
          
          <SessionVideoPlayer 
            sessionId={selectedSession}
            onClose={() => setSelectedSession(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-extrabold text-gray-900">
                  Session History
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Review your past practice sessions with video playback and transcripts
                </p>
              </div>
              {onClose && (
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Search and Filter Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search sessions by name or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  size="sm"
                >
                  All Sessions
                </Button>
                <Button
                  variant={filterType === 'video' ? 'default' : 'outline'}
                  onClick={() => setFilterType('video')}
                  size="sm"
                >
                  <Video className="w-4 h-4 mr-2" />
                  With Video
                </Button>
                <Button
                  variant={filterType === 'transcript' ? 'default' : 'outline'}
                  onClick={() => setFilterType('transcript')}
                  size="sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  With Transcript
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session List */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading session history...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-red-600">
                  <p className="text-lg font-semibold mb-2">Failed to Load Sessions</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2">No Sessions Found</p>
                  <p className="text-sm">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start practicing to create your first session'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {filteredSessions.map((session) => (
                    <Card key={session.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {session.sessionName}
                              </h3>
                              <div className="flex gap-2">
                                {session.hasVideo && (
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <Video className="w-3 h-3" />
                                    Video {session.videoSize && formatFileSize(session.videoSize)}
                                  </Badge>
                                )}
                                {session.transcript && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    Transcript
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(session.createdAt)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTime(session.duration)}
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {Math.round(session.confidenceScore)}% confidence
                              </div>
                            </div>
                            
                            {session.transcript && (
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {session.transcript.substring(0, 120)}
                                {session.transcript.length > 120 ? '...' : ''}
                              </p>
                            )}
                          </div>
                          
                          <div className="ml-4">
                            <Button
                              onClick={() => setSelectedSession(session.id)}
                              className="flex items-center gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Review Session
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Stats Summary */}
        {!isLoading && !error && sessions.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {sessions.filter(s => s.hasVideo).length}
                  </p>
                  <p className="text-sm text-gray-600">With Video</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60)}
                  </p>
                  <p className="text-sm text-gray-600">Total Minutes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.confidenceScore, 0) / sessions.length) : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Avg Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}