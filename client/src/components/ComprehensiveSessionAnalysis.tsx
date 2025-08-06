import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Brain,
  Eye,
  FileText,
  Volume2,
  Clock,
  Target,
  Users,
} from 'lucide-react';
import ContentAnalysisTab from './ContentAnalysisTab';

interface SessionAnalysisProps {
  selectedSessionId: string;
}

export default function ComprehensiveSessionAnalysis({ selectedSessionId }: SessionAnalysisProps) {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedSessionId) {
      fetchSessionData();
    }
  }, [selectedSessionId]);

  const fetchSessionData = async () => {
    try {
      const response = await fetch(\`/api/sessions/\${selectedSessionId}\`);
      if (response.ok) {
        const data = await response.json();
        setSelectedSession(data);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Brain className="w-12 h-12 text-blue-500 mb-4 mx-auto animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Loading Analysis</h3>
          <p className="text-gray-500">Preparing your session analysis...</p>
        </div>
      </div>
    );
  }

  if (!selectedSession) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mb-4 mx-auto" />
          <h3 className="text-lg font-semibold mb-2">No Session Selected</h3>
          <p className="text-gray-500">Select a session to view analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Session Analysis</CardTitle>
              <CardDescription>
                {new Date(selectedSession.date).toLocaleDateString()} - {selectedSession.purpose || 'Practice Session'}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {selectedSession.metrics.overall.score}%
              </div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-medium">Duration</div>
              <div className="text-lg">{Math.floor(selectedSession.duration / 60)}:{String(selectedSession.duration % 60).padStart(2, '0')}</div>
            </div>
            <div className="text-center">
              <Target className="w-5 h-5 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-medium">Words</div>
              <div className="text-lg">{selectedSession.metrics.overall.wordCount}</div>
            </div>
            <div className="text-center">
              <Users className="w-5 h-5 text-purple-500 mx-auto mb-2" />
              <div className="text-sm font-medium">WPM</div>
              <div className="text-lg">{selectedSession.metrics.voice.pace}</div>
            </div>
            <div className="text-center">
              <Brain className="w-5 h-5 text-orange-500 mx-auto mb-2" />
              <div className="text-sm font-medium">Filler Words</div>
              <div className="text-lg">{selectedSession.metrics.content.fillerWords.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="voice">Voice Analysis</TabsTrigger>
          <TabsTrigger value="body">Body Language</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Session Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Volume</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedSession.metrics.voice.volume} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{selectedSession.metrics.voice.volume}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Clarity</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedSession.metrics.voice.clarity} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{selectedSession.metrics.voice.clarity}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Eye Contact</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedSession.metrics.bodyLanguage.eyeContact} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{selectedSession.metrics.bodyLanguage.eyeContact}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Engagement</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedSession.metrics.bodyLanguage.engagement} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{selectedSession.metrics.bodyLanguage.engagement}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Speaking Rate</span>
                    <span className="font-medium">{selectedSession.metrics.voice.pace} WPM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Filler Words</span>
                    <span className="font-medium">{selectedSession.metrics.content.fillerWords.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Posture Score</span>
                    <span className="font-medium">{selectedSession.metrics.bodyLanguage.posture}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Content Score</span>
                    <span className="font-medium">{selectedSession.metrics.content.structure}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="voice">
          {/* Voice Analysis Content */}
        </TabsContent>

        <TabsContent value="body">
          {/* Body Language Analysis Content */}
        </TabsContent>

        <TabsContent value="content">
          <ContentAnalysisTab 
            transcript={selectedSession.transcript} 
            purpose={selectedSession.purpose || 'General Practice'}
            sessionData={selectedSession}
          />
        </TabsContent>

        <TabsContent value="transcript">
          <Card>
            <CardHeader>
              <CardTitle>Session Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap font-mono text-sm">
                {selectedSession.transcript}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}