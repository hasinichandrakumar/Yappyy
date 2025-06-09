import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Eye, 
  Volume2, 
  FileText, 
  Target,
  Play,
  BarChart3,
  Users,
  Mic,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface PracticeSession {
  id: string;
  name: string;
  date: Date;
  duration: string;
  type: 'presentation' | 'interview' | 'pitch' | 'meeting';
  audience: string;
  overallScore: number;
  bodyLanguageScore: number;
  voiceScore: number;
  contentScore: number;
  keyMetrics: {
    wordsSpoken: number;
    fillerWords: number;
    eyeContact: number;
    gestureVariety: number;
  };
  improvements: string[];
  strengths: string[];
}

interface SessionStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionSelect: (sessionId: string) => void;
}

export default function SessionStudyModal({ isOpen, onClose, onSessionSelect }: SessionStudyModalProps) {
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [studyMode, setStudyMode] = useState<'overview' | 'comparison' | 'progression'>('overview');

  // Mock session data - would come from API in real app
  const practiceSessions: PracticeSession[] = [
    {
      id: "1",
      name: "Product Launch Presentation",
      date: new Date(Date.now() - 86400000), // Yesterday
      duration: "8:45",
      type: 'presentation',
      audience: 'Executive Team',
      overallScore: 87,
      bodyLanguageScore: 85,
      voiceScore: 89,
      contentScore: 87,
      keyMetrics: {
        wordsSpoken: 1250,
        fillerWords: 12,
        eyeContact: 78,
        gestureVariety: 92
      },
      improvements: ['Reduce filler words', 'Strengthen conclusion'],
      strengths: ['Clear structure', 'Confident delivery', 'Good audience engagement']
    },
    {
      id: "2", 
      name: "Team Meeting Leadership",
      date: new Date(Date.now() - 259200000), // 3 days ago
      duration: "12:30",
      type: 'meeting',
      audience: 'Development Team',
      overallScore: 82,
      bodyLanguageScore: 80,
      voiceScore: 85,
      contentScore: 81,
      keyMetrics: {
        wordsSpoken: 1800,
        fillerWords: 18,
        eyeContact: 75,
        gestureVariety: 85
      },
      improvements: ['Improve eye contact', 'More decisive language'],
      strengths: ['Good pacing', 'Clear direction', 'Inclusive communication']
    },
    {
      id: "3",
      name: "Investor Pitch Practice",
      date: new Date(Date.now() - 604800000), // 1 week ago
      duration: "15:20",
      type: 'pitch',
      audience: 'Venture Capitalists',
      overallScore: 91,
      bodyLanguageScore: 93,
      voiceScore: 88,
      contentScore: 92,
      keyMetrics: {
        wordsSpoken: 2100,
        fillerWords: 8,
        eyeContact: 88,
        gestureVariety: 95
      },
      improvements: ['Faster opening hook', 'Tighter financial projections'],
      strengths: ['Compelling narrative', 'Strong presence', 'Data-driven arguments']
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'presentation': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-green-100 text-green-800';
      case 'pitch': return 'bg-purple-100 text-purple-800';
      case 'meeting': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const selectedSessionData = practiceSessions.find(s => s.id === selectedSession);

  const handleStudySession = () => {
    if (selectedSession) {
      onSessionSelect(selectedSession);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Study Session Analysis</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Session to Study</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a practice session..." />
                </SelectTrigger>
                <SelectContent>
                  {practiceSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{session.name}</span>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge className={getTypeColor(session.type)}>
                            {session.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(session.date)}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSessionData && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{formatDate(selectedSessionData.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedSessionData.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedSessionData.audience}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Score:</span>
                      <span className={`font-bold ${getScoreColor(selectedSessionData.overallScore)}`}>
                        {selectedSessionData.overallScore}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Body Language:</span>
                      <span className={getScoreColor(selectedSessionData.bodyLanguageScore)}>
                        {selectedSessionData.bodyLanguageScore}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Voice:</span>
                      <span className={getScoreColor(selectedSessionData.voiceScore)}>
                        {selectedSessionData.voiceScore}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Content:</span>
                      <span className={getScoreColor(selectedSessionData.contentScore)}>
                        {selectedSessionData.contentScore}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Analysis Preview */}
          {selectedSessionData && (
            <Tabs value={studyMode} onValueChange={(value: any) => setStudyMode(value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comparison">Compare Sessions</TabsTrigger>
                <TabsTrigger value="progression">Progress Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Key Strengths</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedSessionData.strengths.map((strength, index) => (
                          <li key={index} className="text-sm flex items-start space-x-2">
                            <ArrowUp className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span>Areas for Improvement</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {selectedSessionData.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm flex items-start space-x-2">
                            <ArrowDown className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedSessionData.keyMetrics.wordsSpoken}
                        </div>
                        <div className="text-xs text-gray-500">Words Spoken</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {selectedSessionData.keyMetrics.fillerWords}
                        </div>
                        <div className="text-xs text-gray-500">Filler Words</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedSessionData.keyMetrics.eyeContact}%
                        </div>
                        <div className="text-xs text-gray-500">Eye Contact</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedSessionData.keyMetrics.gestureVariety}%
                        </div>
                        <div className="text-xs text-gray-500">Gesture Variety</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison" className="space-y-4">
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Session Comparison</h3>
                  <p className="text-gray-600 text-sm">
                    Compare this session with your other practice sessions to identify patterns and improvements
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="progression" className="space-y-4">
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Progress Tracking</h3>
                  <p className="text-gray-600 text-sm">
                    View your improvement trajectory over time across all speaking dimensions
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleStudySession}
              disabled={!selectedSession}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Study This Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}