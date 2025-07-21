// Recording Library - View all recorded practice sessions
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Play, Search, Filter, Calendar, Clock, 
  FileText, BarChart3, Download, Trash2,
  Video, Eye
} from 'lucide-react';
import { VideoRecordingData, sessionRecordingStorage } from '@/lib/video-recording';
import VideoPlaybackViewer from './VideoPlaybackViewer';

export default function RecordingLibrary() {
  const [recordings, setRecordings] = useState<VideoRecordingData[]>([]);
  const [filteredRecordings, setFilteredRecordings] = useState<VideoRecordingData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecording, setSelectedRecording] = useState<VideoRecordingData | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'name'>('date');

  // Load recordings on component mount
  useEffect(() => {
    loadRecordings();
  }, []);

  // Filter and sort recordings when search term or sort changes
  useEffect(() => {
    let filtered = recordings;

    // Apply search filter
    if (searchTerm) {
      filtered = recordings.filter(recording => 
        recording.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recording.transcript.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.startTime - a.startTime; // Most recent first
        case 'duration':
          return b.duration - a.duration; // Longest first
        case 'name':
          return a.sessionId.localeCompare(b.sessionId);
        default:
          return 0;
      }
    });

    setFilteredRecordings(filtered);
  }, [recordings, searchTerm, sortBy]);

  const loadRecordings = () => {
    const allRecordings = sessionRecordingStorage.getAllRecordings();
    setRecordings(allRecordings);
  };

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${Math.round(mb * 100) / 100} MB`;
  };

  const handlePlayRecording = (recording: VideoRecordingData) => {
    setSelectedRecording(recording);
    setShowViewer(true);
  };

  const handleDeleteRecording = (recordingId: string) => {
    if (confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
      sessionRecordingStorage.deleteRecording(recordingId);
      loadRecordings();
    }
  };

  const handleDownloadRecording = (recording: VideoRecordingData) => {
    const link = document.createElement('a');
    link.href = recording.videoBlobUrl;
    link.download = `${recording.sessionId}_recording.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (showViewer && selectedRecording) {
    return (
      <VideoPlaybackViewer
        recordingData={selectedRecording}
        onClose={() => {
          setShowViewer(false);
          setSelectedRecording(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Recording Library</h1>
          <p className="text-gray-600">View and manage your practice session recordings</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {recordings.length} {recordings.length === 1 ? 'Recording' : 'Recordings'}
        </Badge>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search recordings by session name or transcript..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'duration' | 'name')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="duration">Sort by Duration</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recordings Grid */}
      {filteredRecordings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              {recordings.length === 0 ? 'No recordings yet' : 'No recordings match your search'}
            </h3>
            <p className="text-gray-600 mb-4">
              {recordings.length === 0 
                ? 'Start practicing to create your first recording!' 
                : 'Try adjusting your search terms or filters.'
              }
            </p>
            {recordings.length === 0 && (
              <Button onClick={() => window.location.href = '/practice'}>
                Start Practicing
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.map((recording) => (
            <Card key={recording.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{recording.sessionId}</span>
                  <Badge variant="outline">
                    {formatDuration(recording.duration)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Video Thumbnail/Preview */}
                <div className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden">
                  <video
                    src={recording.videoBlobUrl}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-white/90 text-black hover:bg-white"
                      onClick={() => handlePlayRecording(recording)}
                    >
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                {/* Recording Info */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(recording.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{new Date(recording.startTime).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Size: {formatFileSize(recording.videoBlob.size)}</span>
                    {recording.transcript && (
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        Transcript
                      </Badge>
                    )}
                  </div>

                  {/* Transcript Preview */}
                  {recording.transcript && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {recording.transcript.substring(0, 150)}
                        {recording.transcript.length > 150 && '...'}
                      </p>
                    </div>
                  )}

                  {/* Metrics Preview */}
                  {recording.metrics && Object.keys(recording.metrics).length > 0 && (
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                      <div className="flex space-x-3 text-sm">
                        {recording.metrics.confidence && (
                          <span>Confidence: {recording.metrics.confidence}%</span>
                        )}
                        {recording.metrics.clarity && (
                          <span>Clarity: {recording.metrics.clarity}%</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handlePlayRecording(recording)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownloadRecording(recording)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteRecording(recording.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}