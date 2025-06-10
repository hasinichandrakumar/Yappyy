import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { allCompetitionEvents, getEventSpecificCoaching } from "@/data/competitionEvents";
import { 
  Users, 
  Trophy, 
  FileText, 
  Brain, 
  Target, 
  Award, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Zap,
  Crown,
  BookOpen,
  GraduationCap,
  Camera,
  Mic,
  Play,
  Square,
  Timer,
  Eye,
  Volume2
} from "lucide-react";

export default function CompetitiveClubsHub() {
  const [selectedClub, setSelectedClub] = useState<'DECA' | 'FBLA' | 'HOSA'>('DECA');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [practiceContent, setPracticeContent] = useState('');
  const [eventCoaching, setEventCoaching] = useState<any>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [practiceSession, setPracticeSession] = useState({
    timeRemaining: 10 * 60,
    isActive: false
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Filter events by organization
  const clubEventsByOrg = {
    DECA: allCompetitionEvents.filter(e => e.organization === 'DECA'),
    FBLA: allCompetitionEvents.filter(e => e.organization === 'FBLA'),
    HOSA: allCompetitionEvents.filter(e => e.organization === 'HOSA')
  };
  
  const selectedEvent = allCompetitionEvents.find(e => e.id === selectedEventId);

  // Generate event-specific AI coaching
  const generateEventCoaching = useCallback(() => {
    if (!selectedEvent) return;
    
    // Simulate performance data based on the event's rubric
    const mockPerformanceData: any = {};
    selectedEvent.rubric.forEach(criteria => {
      // Generate realistic scores (70-90% of max points)
      const minScore = Math.floor(criteria.maxPoints * 0.7);
      const maxScore = Math.floor(criteria.maxPoints * 0.9);
      mockPerformanceData[criteria.id] = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
    });
    
    const coaching = getEventSpecificCoaching(selectedEventId, mockPerformanceData);
    setEventCoaching(coaching);
  }, [selectedEventId, selectedEvent]);

  const startPracticeSession = () => {
    if (!selectedEvent) {
      alert('Please select an event first');
      return;
    }
    
    setPracticeSession(prev => ({ ...prev, isActive: true }));
    setIsRecording(true);
    generateEventCoaching();
  };

  const stopPracticeSession = () => {
    setPracticeSession(prev => ({ ...prev, isActive: false }));
    setIsRecording(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'role-play': return <Users className="w-4 h-4" />;
      case 'presentation': return <FileText className="w-4 h-4" />;
      case 'case-study': return <Brain className="w-4 h-4" />;
      case 'written': return <BookOpen className="w-4 h-4" />;
      case 'performance': return <Star className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <span>Competitive Clubs Hub</span>
            <Badge variant="outline" className="ml-2">
              {selectedClub} Certified
            </Badge>
          </CardTitle>
          <p className="text-gray-600">
            Practice with authentic competition rubrics from DECA, FBLA, and HOSA events. 
            Get AI coaching based on official scoring criteria used by judges.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Select Competition Event</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Club Organization Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization</label>
                <Tabs value={selectedClub} onValueChange={(value) => setSelectedClub(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="DECA" className="text-xs">DECA</TabsTrigger>
                    <TabsTrigger value="FBLA" className="text-xs">FBLA</TabsTrigger>
                    <TabsTrigger value="HOSA" className="text-xs">HOSA</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Event Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Event ({clubEventsByOrg[selectedClub].length} available)</label>
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${selectedClub} event`} />
                  </SelectTrigger>
                  <SelectContent>
                    {clubEventsByOrg[selectedClub].map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        <div className="flex items-center space-x-2">
                          {getFormatIcon(event.format)}
                          <span>{event.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Event Details */}
              {selectedEvent && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{selectedEvent.format}</Badge>
                    <span className="text-sm text-gray-600">{selectedEvent.timeLimit}</span>
                  </div>
                  <p className="text-sm text-gray-700">{selectedEvent.description}</p>
                  <div className="space-y-1">
                    <div className="text-xs font-medium">Key Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.keySkills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Practice Session Controls */}
              <div className="space-y-3">
                {!practiceSession.isActive ? (
                  <Button 
                    onClick={startPracticeSession}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!selectedEventId}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Practice Session
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Session Active</span>
                      <div className="flex items-center space-x-1">
                        <Timer className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">
                          {formatTime(practiceSession.timeRemaining)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={stopPracticeSession}
                      variant="destructive"
                      className="w-full"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      End Session
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Practice Area & AI Coaching */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Practice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Video Practice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">{isCameraActive ? 'Recording' : 'Not Recording'}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-white text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Camera feed will appear here</p>
                </div>
              </div>
              <div className="flex justify-center space-x-2">
                <Button size="sm" variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera
                </Button>
                <Button size="sm" variant="outline">
                  <Mic className="w-4 h-4 mr-2" />
                  Start Audio
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Coaching Results */}
          {eventCoaching && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span>AI Coach - {eventCoaching.eventName}</span>
                  <Badge variant="outline" className={getScoreColor(eventCoaching.scorePercentage)}>
                    {eventCoaching.scorePercentage}%
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Analysis based on official {eventCoaching.organization} competition rubric
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Score */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Overall Score</span>
                    <span className="text-lg font-bold text-blue-600">
                      {eventCoaching.overallScore} / {eventCoaching.maxPossibleScore}
                    </span>
                  </div>
                  <Progress value={eventCoaching.scorePercentage} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">
                    Format: {eventCoaching.format} | Time: {eventCoaching.timeLimit}
                  </p>
                </div>

                {/* Rubric Analysis */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Rubric Breakdown</span>
                  </h4>
                  {eventCoaching.rubricAnalysis.map((criteria: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{criteria.criteriaName}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {criteria.currentScore} / {criteria.maxPoints} pts
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Level {criteria.level}
                          </Badge>
                        </div>
                      </div>
                      <Progress 
                        value={(criteria.currentScore / criteria.maxPoints) * 100} 
                        className="h-2 mb-2" 
                      />
                      <p className="text-sm text-gray-700 mb-2">{criteria.feedback}</p>
                      
                      {/* Improvement Suggestions */}
                      <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-yellow-800">Improvement Tips:</div>
                            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                              {criteria.improvementSuggestions.map((tip: string, tipIdx: number) => (
                                <li key={tipIdx} className="flex items-start space-x-1">
                                  <span className="text-yellow-600">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preparation Tips */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Event-Specific Preparation Tips</span>
                  </h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {eventCoaching.preparationTips.map((tip: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key Skills Focus */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Focus Areas for This Event</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {eventCoaching.keySkills.map((skill: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="border-blue-300 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Practice Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span>Practice Notes & Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={practiceContent}
                onChange={(e) => setPracticeContent(e.target.value)}
                placeholder={
                  selectedEvent 
                    ? `Practice notes for ${selectedEvent.name}. Use this space to outline your approach, key points, or prepare your ${selectedEvent.format}...`
                    : "Select an event to start practicing..."
                }
                className="min-h-[120px]"
              />
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {practiceContent.length} characters
                </span>
                <Button size="sm" disabled={!practiceContent.trim()}>
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}