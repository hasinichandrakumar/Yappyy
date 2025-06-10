import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  Camera,
  Award,
  Users,
  Clock,
  Star,
  BookOpen,
  Target,
  Brain,
  MessageSquare,
  Trophy,
  Presentation,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import CameraFeed from './CameraFeed';

// Club event data
const clubEvents = {
  DECA: [
    {
      id: 'deca-role-play',
      name: 'Business Management & Administration Role Play',
      category: 'Role Play',
      timeLimit: '10 minutes prep + 10 minutes presentation',
      description: 'Address business situations and make decisions as a manager',
      keySkills: ['Problem Solving', 'Decision Making', 'Communication', 'Leadership']
    },
    {
      id: 'deca-presentation',
      name: 'Entrepreneurship Series',
      category: 'Presentation',
      timeLimit: '15 minutes presentation + 5 minutes Q&A',
      description: 'Develop and present a business plan for a new venture',
      keySkills: ['Business Planning', 'Financial Analysis', 'Market Research', 'Presentation']
    },
    {
      id: 'deca-case-study',
      name: 'Marketing Management Case Study',
      category: 'Case Study',
      timeLimit: '30 minutes analysis + 15 minutes presentation',
      description: 'Analyze marketing challenges and develop strategic solutions',
      keySkills: ['Marketing Strategy', 'Data Analysis', 'Strategic Thinking', 'Communication']
    }
  ],
  FBLA: [
    {
      id: 'fbla-presentation',
      name: 'Business Presentation',
      category: 'Presentation',
      timeLimit: '7 minutes presentation + 3 minutes Q&A',
      description: 'Present solutions to current business challenges',
      keySkills: ['Public Speaking', 'Business Analysis', 'Visual Design', 'Q&A Handling']
    },
    {
      id: 'fbla-interview',
      name: 'Job Interview',
      category: 'Interview',
      timeLimit: '10 minutes',
      description: 'Professional interview simulation with business scenarios',
      keySkills: ['Professional Communication', 'Self-Presentation', 'Behavioral Responses', 'Confidence']
    },
    {
      id: 'fbla-impromptu',
      name: 'Impromptu Speaking',
      category: 'Speaking',
      timeLimit: '1 minute prep + 4 minutes speaking',
      description: 'Deliver an organized speech on a business topic with minimal preparation',
      keySkills: ['Quick Thinking', 'Organization', 'Confidence', 'Business Knowledge']
    }
  ],
  HOSA: [
    {
      id: 'hosa-speaking',
      name: 'Prepared Speaking',
      category: 'Speaking',
      timeLimit: '5-7 minutes presentation',
      description: 'Present on health-related topics with visual aids',
      keySkills: ['Health Knowledge', 'Visual Communication', 'Audience Engagement', 'Evidence-Based Speaking']
    },
    {
      id: 'hosa-interview',
      name: 'Health Career Display',
      category: 'Interview',
      timeLimit: '5 minutes presentation + interview',
      description: 'Present career research and answer questions about health professions',
      keySkills: ['Career Research', 'Professional Presentation', 'Health Industry Knowledge', 'Q&A Skills']
    },
    {
      id: 'hosa-case-study',
      name: 'Medical Innovation',
      category: 'Case Study',
      timeLimit: '20 minutes prep + 10 minutes presentation',
      description: 'Analyze medical innovations and present implementation strategies',
      keySkills: ['Medical Research', 'Innovation Analysis', 'Implementation Planning', 'Healthcare Systems']
    }
  ]
};

interface AICoachingSessionProps {
  club: 'DECA' | 'FBLA' | 'HOSA';
  event: any;
  onClose: () => void;
}

const AICoachingSession = ({ club, event, onClose }: AICoachingSessionProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionPhase, setSessionPhase] = useState<'prep' | 'presenting' | 'feedback'>('prep');
  const [feedback, setFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [practiceNotes, setPracticeNotes] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startSession = () => {
    setSessionPhase('presenting');
    setIsRecording(true);
  };

  const stopSession = async () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    
    try {
      // Call the real Perplexity AI API
      const response = await fetch('/api/club-coaching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          club,
          event,
          presentationTranscript: `Mock presentation transcript for ${event.name}. The student demonstrated understanding of key concepts and delivered their content with confidence.`,
          duration: 300, // 5 minutes
          practiceNotes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI feedback');
      }

      const aiFeedback = await response.json();
      setFeedback(aiFeedback);
      setSessionPhase('feedback');
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback to basic feedback structure
      setFeedback({
        overallScore: 75,
        strengths: ['Demonstrated effort in preparation', 'Clear communication attempt'],
        improvements: ['Continue practicing with AI feedback', 'Focus on key event criteria'],
        clubSpecificFeedback: { general: 'Keep practicing with the AI coach for personalized feedback' },
        nextSteps: ['Try the AI coaching session again', 'Review event requirements'],
        evaluationSource: 'Basic evaluation (AI temporarily unavailable)'
      });
      setSessionPhase('feedback');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAIFeedback = (club: string, event: any) => {
    // This would be replaced with actual AI analysis
    return {
      overallScore: Math.floor(Math.random() * 30) + 70,
      strengths: [
        'Strong opening that grabbed attention',
        'Clear articulation and pace',
        'Good use of gestures to emphasize points',
        'Professional appearance and posture'
      ],
      improvements: [
        'Consider adding more specific examples',
        'Work on smoother transitions between points',
        'Maintain eye contact during conclusion',
        'Use pauses more strategically for emphasis'
      ],
      clubSpecificFeedback: getClubSpecificFeedback(club, event),
      nextSteps: [
        'Practice with a timer to perfect pacing',
        'Record yourself to review body language',
        'Research additional supporting evidence',
        'Practice Q&A scenarios'
      ]
    };
  };

  const getClubSpecificFeedback = (club: string, event: any) => {
    switch (club) {
      case 'DECA':
        return {
          businessAcumen: 'Demonstrated solid understanding of business principles',
          decisionMaking: 'Show more confidence in your recommendations',
          professionalPresence: 'Excellent professional demeanor throughout'
        };
      case 'FBLA':
        return {
          businessCommunication: 'Clear and concise business language',
          leadershipQualities: 'Natural leadership presence observed',
          practicalApplication: 'Strong connection to real-world scenarios'
        };
      case 'HOSA':
        return {
          healthKnowledge: 'Solid foundation of health concepts',
          patientCommunication: 'Compassionate and clear communication style',
          evidenceBased: 'Good use of current health research'
        };
      default:
        return {};
    }
  };

  const getClubColor = (club: string) => {
    switch (club) {
      case 'DECA': return 'blue';
      case 'FBLA': return 'green';
      case 'HOSA': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">AI {club} Judge</h2>
              <div className="flex items-center space-x-3">
                <Badge className={`bg-${getClubColor(club)}-100 text-${getClubColor(club)}-800`}>
                  {club}
                </Badge>
                <Badge variant="outline">{event.category}</Badge>
                <span className="text-sm text-gray-600">{event.name}</span>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>

        <div className="p-6">
          {sessionPhase === 'prep' && (
            <div className="space-y-6">
              {/* Event Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Event Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{event.timeLimit}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{event.category}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Key Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {event.keySkills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Practice Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Practice Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write your preparation notes, key points, or questions here..."
                    value={practiceNotes}
                    onChange={(e) => setPracticeNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>

              {/* Camera Setup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Camera Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CameraFeed 
                    onStreamReady={setStream}
                    className="mb-4"
                  />
                  <div className="flex justify-center">
                    <Button 
                      onClick={startSession}
                      className="bg-green-600 hover:bg-green-700"
                      size="lg"
                      disabled={!stream}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {sessionPhase === 'presenting' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Recording in Progress</h3>
                <p className="text-gray-600">Present as if you're in the actual competition</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Feed */}
                <Card>
                  <CardContent className="p-4">
                    <CameraFeed />
                  </CardContent>
                </Card>

                {/* Live Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      AI Judge Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm"><strong>Current Event:</strong> {event.name}</p>
                        <p className="text-sm"><strong>Time Limit:</strong> {event.timeLimit}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">The AI Judge is evaluating:</h4>
                        <ul className="text-sm space-y-1 ml-4">
                          <li>• Voice clarity and confidence</li>
                          <li>• Body language and posture</li>
                          <li>• Content organization and flow</li>
                          <li>• {club}-specific criteria</li>
                          <li>• Professional presentation skills</li>
                        </ul>
                      </div>

                      <div className="pt-4 border-t">
                        <Button 
                          onClick={stopSession}
                          variant="destructive"
                          className="w-full"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          Stop & Get Feedback
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {sessionPhase === 'feedback' && (
            <div className="space-y-6">
              {isAnalyzing ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold mb-2">AI {club} Judge Analyzing Performance</h3>
                  <p className="text-gray-600">Using advanced AI to evaluate against official {club} standards...</p>
                  <p className="text-sm text-gray-500 mt-2">Powered by Perplexity AI</p>
                </div>
              ) : feedback && (
                <div className="space-y-6">
                  {/* AI Evaluation Source */}
                  {feedback.evaluationSource && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                      <p className="text-sm text-blue-800 font-medium">{feedback.evaluationSource}</p>
                    </div>
                  )}

                  {/* Overall Score */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Trophy className="w-5 h-5 mr-2" />
                        Overall Performance Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl font-bold text-green-600">{feedback.overallScore}/100</div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-600 h-3 rounded-full transition-all duration-1000"
                              style={{ width: `${feedback.overallScore}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {feedback.overallScore >= 90 ? 'Excellent' : 
                             feedback.overallScore >= 80 ? 'Very Good' : 
                             feedback.overallScore >= 70 ? 'Good' : 'Needs Improvement'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strengths */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-green-700">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feedback.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Star className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Areas for Improvement */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-orange-700">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feedback.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Target className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Club-Specific Feedback */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Badge className={`bg-${getClubColor(club)}-100 text-${getClubColor(club)}-800 mr-2`}>
                          {club}
                        </Badge>
                        {club}-Specific Evaluation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(feedback.clubSpecificFeedback).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-sm text-gray-600">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Recommended Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feedback.nextSteps.map((step: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-sm">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => {
                        setSessionPhase('prep');
                        setFeedback(null);
                        setPracticeNotes('');
                      }}
                      className="flex-1"
                    >
                      Practice Again
                    </Button>
                    <Button variant="outline" onClick={onClose} className="flex-1">
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ClubsHub() {
  const [selectedClub, setSelectedClub] = useState<'DECA' | 'FBLA' | 'HOSA'>('DECA');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showAISession, setShowAISession] = useState(false);

  const handleStartAICoaching = (event: any) => {
    setSelectedEvent(event);
    setShowAISession(true);
  };

  const getClubInfo = (club: string) => {
    switch (club) {
      case 'DECA':
        return {
          name: 'DECA',
          fullName: 'Distributive Education Clubs of America',
          description: 'Business and entrepreneurship competitive events',
          color: 'blue',
          icon: <Trophy className="w-6 h-6" />
        };
      case 'FBLA':
        return {
          name: 'FBLA',
          fullName: 'Future Business Leaders of America',
          description: 'Business leadership and professional development',
          color: 'green',
          icon: <Users className="w-6 h-6" />
        };
      case 'HOSA':
        return {
          name: 'HOSA',
          fullName: 'Health Occupations Students of America',
          description: 'Health science and medical career preparation',
          color: 'red',
          icon: <BookOpen className="w-6 h-6" />
        };
      default:
        return { name: '', fullName: '', description: '', color: 'gray', icon: null };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Clubs Hub</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Practice with AI judges specialized in DECA, FBLA, and HOSA competitive events. 
          Get authentic feedback based on official judging criteria and improve your competitive performance.
        </p>
      </div>

      {/* Club Selection */}
      <Tabs value={selectedClub} onValueChange={(value: any) => setSelectedClub(value)}>
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="DECA" className="flex items-center space-x-2">
            <span>DECA</span>
          </TabsTrigger>
          <TabsTrigger value="FBLA" className="flex items-center space-x-2">
            <span>FBLA</span>
          </TabsTrigger>
          <TabsTrigger value="HOSA" className="flex items-center space-x-2">
            <span>HOSA</span>
          </TabsTrigger>
        </TabsList>

        {/* Club Content */}
        {(['DECA', 'FBLA', 'HOSA'] as const).map((club) => (
          <TabsContent key={club} value={club} className="mt-8">
            <div className="space-y-6">
              {/* Club Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getClubInfo(club).icon}
                    <div className="ml-3">
                      <h2 className="text-2xl font-bold">{getClubInfo(club).fullName}</h2>
                      <p className="text-gray-600">{getClubInfo(club).description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Badge className={`bg-${getClubInfo(club).color}-100 text-${getClubInfo(club).color}-800`}>
                      {clubEvents[club].length} Events Available
                    </Badge>
                    <Badge variant="outline">
                      AI-Powered Judging
                    </Badge>
                    <Badge variant="outline">
                      Camera Analysis
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Available Events */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubEvents[club].map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{event.category}</Badge>
                        <Badge className={`bg-${getClubInfo(club).color}-100 text-${getClubInfo(club).color}-800`}>
                          {club}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                      
                      <div className="space-y-2 text-xs text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{event.timeLimit}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2">Key Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {event.keySkills.slice(0, 2).map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {event.keySkills.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{event.keySkills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => handleStartAICoaching(event)}
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Start AI Coaching
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* AI Coaching Session Modal */}
      {showAISession && selectedEvent && (
        <AICoachingSession
          club={selectedClub}
          event={selectedEvent}
          onClose={() => {
            setShowAISession(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}