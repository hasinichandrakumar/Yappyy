import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  GraduationCap
} from "lucide-react";

interface ClubEvent {
  id: string;
  name: string;
  category: string;
  description: string;
  format: 'role-play' | 'presentation' | 'written' | 'case-study';
  timeLimit: string;
  participants: string;
  judgeCount: number;
  keySkills: string[];
}

interface RubricCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: {
    level: number;
    descriptor: string;
    points: number;
  }[];
}

interface ClubRubric {
  eventName: string;
  totalPoints: number;
  criteria: RubricCriteria[];
  timeAllocation: {
    prep?: string;
    presentation?: string;
    qa?: string;
  };
  judgeInstructions: string[];
}

export default function ClubsHub() {
  const [selectedClub, setSelectedClub] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [customRubric, setCustomRubric] = useState<string>("");
  const [practiceMode, setPracticeMode] = useState<'judge' | 'competitor'>('competitor');
  const [aiJudgeFeedback, setAiJudgeFeedback] = useState<string>("");

  // DECA Events Data (based on official DECA guidelines)
  const decaEvents: ClubEvent[] = [
    {
      id: 'aaam',
      name: 'Apparel and Accessories Marketing',
      category: 'Individual Series',
      description: 'Marketing concepts in fashion retail industry',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant + 1 judge',
      judgeCount: 1,
      keySkills: ['Market Analysis', 'Product Knowledge', 'Customer Service', 'Sales Techniques']
    },
    {
      id: 'btdm',
      name: 'Business to Business Marketing',
      category: 'Team Decision Making',
      description: 'B2B marketing strategies and solutions',
      format: 'case-study',
      timeLimit: '30 min prep + 15 min presentation + 5 min Q&A',
      participants: '2-3 team members',
      judgeCount: 3,
      keySkills: ['Strategic Planning', 'Team Collaboration', 'Data Analysis', 'Professional Communication']
    },
    {
      id: 'ebg',
      name: 'Entrepreneurship Business Growth',
      category: 'Written Events',
      description: 'Comprehensive business plan for growth',
      format: 'written',
      timeLimit: '15 min presentation + 5 min Q&A',
      participants: '1-3 participants',
      judgeCount: 3,
      keySkills: ['Business Planning', 'Financial Analysis', 'Innovation', 'Growth Strategies']
    }
  ];

  // FBLA Events Data (based on official FBLA competitive events)
  const fblaEvents: ClubEvent[] = [
    {
      id: 'business-presentation',
      name: 'Business Presentation',
      category: 'Presentation Events',
      description: 'Oral presentation on business topic',
      format: 'presentation',
      timeLimit: '7 min presentation + 3 min Q&A',
      participants: '1 participant',
      judgeCount: 2,
      keySkills: ['Public Speaking', 'Business Knowledge', 'Visual Design', 'Time Management']
    },
    {
      id: 'entrepreneurship',
      name: 'Entrepreneurship',
      category: 'Case Study',
      description: 'Analyze entrepreneurial opportunity',
      format: 'case-study',
      timeLimit: '90 min prep + 10 min presentation',
      participants: '1 participant',
      judgeCount: 2,
      keySkills: ['Problem Solving', 'Innovation', 'Market Research', 'Financial Planning']
    },
    {
      id: 'impromptu-speaking',
      name: 'Impromptu Speaking',
      category: 'Speaking Events',
      description: 'Spontaneous speech on business topic',
      format: 'presentation',
      timeLimit: '1 min prep + 3 min speech',
      participants: '1 participant',
      judgeCount: 3,
      keySkills: ['Quick Thinking', 'Organization', 'Confidence', 'Business Terminology']
    }
  ];

  // HOSA Events Data (based on official HOSA competitive events)
  const hosaEvents: ClubEvent[] = [
    {
      id: 'medical-innovation',
      name: 'Medical Innovation',
      category: 'Health Professions Events',
      description: 'Present innovative healthcare solution',
      format: 'presentation',
      timeLimit: '7 min presentation + 3 min Q&A',
      participants: '1-3 participants',
      judgeCount: 3,
      keySkills: ['Healthcare Knowledge', 'Innovation', 'Research Skills', 'Problem Solving']
    },
    {
      id: 'health-career-display',
      name: 'Health Career Display',
      category: 'Recognition Events',
      description: 'Visual display about health career',
      format: 'presentation',
      timeLimit: '5 min presentation per judge',
      participants: '1 participant',
      judgeCount: 3,
      keySkills: ['Research', 'Visual Communication', 'Career Knowledge', 'Presentation Skills']
    },
    {
      id: 'public-health',
      name: 'Public Health',
      category: 'Team Events',
      description: 'Address community health issue',
      format: 'case-study',
      timeLimit: '60 min prep + 10 min presentation',
      participants: '2-4 team members',
      judgeCount: 3,
      keySkills: ['Epidemiology', 'Community Health', 'Data Analysis', 'Policy Development']
    }
  ];

  // Sample rubrics for each organization
  const decaRubric: ClubRubric = {
    eventName: "DECA Role-Play Rubric",
    totalPoints: 100,
    timeAllocation: {
      prep: "10 minutes",
      presentation: "10 minutes",
      qa: "5 minutes"
    },
    criteria: [
      {
        id: 'performance-indicators',
        name: 'Performance Indicators',
        description: 'Demonstration of business knowledge and application',
        maxPoints: 70,
        levels: [
          { level: 4, descriptor: 'Exceeds Expectations - Comprehensive understanding with creative application', points: 70 },
          { level: 3, descriptor: 'Meets Expectations - Solid understanding with good application', points: 56 },
          { level: 2, descriptor: 'Below Expectations - Basic understanding with limited application', points: 42 },
          { level: 1, descriptor: 'Little/No Value - Minimal understanding with poor application', points: 14 }
        ]
      },
      {
        id: 'communication-skills',
        name: 'Communication Skills',
        description: 'Verbal communication, confidence, and professional demeanor',
        maxPoints: 30,
        levels: [
          { level: 4, descriptor: 'Excellent communication with strong presence', points: 30 },
          { level: 3, descriptor: 'Good communication with adequate presence', points: 24 },
          { level: 2, descriptor: 'Fair communication with some hesitation', points: 18 },
          { level: 1, descriptor: 'Poor communication with lack of confidence', points: 6 }
        ]
      }
    ],
    judgeInstructions: [
      "Evaluate based on realistic business scenarios",
      "Consider creativity and innovation in solutions",
      "Assess professional communication throughout",
      "Note time management and organization"
    ]
  };

  const fblaRubric: ClubRubric = {
    eventName: "FBLA Business Presentation Rubric",
    totalPoints: 100,
    timeAllocation: {
      presentation: "7 minutes",
      qa: "3 minutes"
    },
    criteria: [
      {
        id: 'organization-delivery',
        name: 'Organization and Delivery',
        description: 'Structure, flow, and presentation skills',
        maxPoints: 25,
        levels: [
          { level: 4, descriptor: 'Exceptional organization with flawless delivery', points: 25 },
          { level: 3, descriptor: 'Well organized with good delivery', points: 20 },
          { level: 2, descriptor: 'Adequately organized with fair delivery', points: 15 },
          { level: 1, descriptor: 'Poorly organized with weak delivery', points: 5 }
        ]
      },
      {
        id: 'content-knowledge',
        name: 'Content and Knowledge',
        description: 'Accuracy, depth, and relevance of business content',
        maxPoints: 50,
        levels: [
          { level: 4, descriptor: 'Comprehensive knowledge with excellent content', points: 50 },
          { level: 3, descriptor: 'Good knowledge with solid content', points: 40 },
          { level: 2, descriptor: 'Basic knowledge with adequate content', points: 30 },
          { level: 1, descriptor: 'Limited knowledge with poor content', points: 10 }
        ]
      },
      {
        id: 'visual-aids',
        name: 'Visual Aids and Technology',
        description: 'Effective use of presentation technology',
        maxPoints: 25,
        levels: [
          { level: 4, descriptor: 'Creative and highly effective visual aids', points: 25 },
          { level: 3, descriptor: 'Good use of visual aids', points: 20 },
          { level: 2, descriptor: 'Adequate visual aids', points: 15 },
          { level: 1, descriptor: 'Poor or no visual aids', points: 5 }
        ]
      }
    ],
    judgeInstructions: [
      "Focus on business application and real-world relevance",
      "Evaluate professional presentation standards",
      "Consider audience engagement and interaction",
      "Assess adherence to time limits"
    ]
  };

  const hosaRubric: ClubRubric = {
    eventName: "HOSA Health Innovation Rubric",
    totalPoints: 100,
    timeAllocation: {
      presentation: "7 minutes",
      qa: "3 minutes"
    },
    criteria: [
      {
        id: 'innovation-creativity',
        name: 'Innovation and Creativity',
        description: 'Originality and creative problem-solving in healthcare',
        maxPoints: 30,
        levels: [
          { level: 4, descriptor: 'Highly innovative with creative healthcare solutions', points: 30 },
          { level: 3, descriptor: 'Good innovation with solid creativity', points: 24 },
          { level: 2, descriptor: 'Some innovation with basic creativity', points: 18 },
          { level: 1, descriptor: 'Limited innovation with little creativity', points: 6 }
        ]
      },
      {
        id: 'scientific-accuracy',
        name: 'Scientific Accuracy',
        description: 'Correct use of medical and scientific terminology',
        maxPoints: 35,
        levels: [
          { level: 4, descriptor: 'Exceptional scientific accuracy and terminology', points: 35 },
          { level: 3, descriptor: 'Good scientific accuracy with proper terminology', points: 28 },
          { level: 2, descriptor: 'Adequate accuracy with some terminology errors', points: 21 },
          { level: 1, descriptor: 'Poor accuracy with incorrect terminology', points: 7 }
        ]
      },
      {
        id: 'presentation-skills',
        name: 'Presentation Skills',
        description: 'Professional delivery and communication',
        maxPoints: 35,
        levels: [
          { level: 4, descriptor: 'Outstanding presentation with excellent communication', points: 35 },
          { level: 3, descriptor: 'Good presentation with clear communication', points: 28 },
          { level: 2, descriptor: 'Fair presentation with adequate communication', points: 21 },
          { level: 1, descriptor: 'Poor presentation with unclear communication', points: 7 }
        ]
      }
    ],
    judgeInstructions: [
      "Evaluate healthcare impact and feasibility",
      "Assess understanding of medical/scientific concepts",
      "Consider ethical implications of proposed solutions",
      "Look for evidence-based reasoning and research"
    ]
  };

  const getClubEvents = (club: string): ClubEvent[] => {
    switch (club) {
      case 'deca': return decaEvents;
      case 'fbla': return fblaEvents;
      case 'hosa': return hosaEvents;
      default: return [];
    }
  };

  const getClubRubric = (club: string): ClubRubric => {
    switch (club) {
      case 'deca': return decaRubric;
      case 'fbla': return fblaRubric;
      case 'hosa': return hosaRubric;
      default: return decaRubric;
    }
  };

  const generateAIJudgeFeedback = () => {
    const rubric = getClubRubric(selectedClub);
    const event = getClubEvents(selectedClub).find(e => e.id === selectedEvent);
    
    if (!event || !customRubric.trim()) {
      setAiJudgeFeedback("Please select an event and provide content for evaluation.");
      return;
    }

    // Simulate AI analysis based on rubric criteria
    const feedback = `
**AI Judge Evaluation for ${event.name}**

**Overall Assessment:** Based on the ${selectedClub.toUpperCase()} rubric standards, here's your detailed feedback:

**Strengths Identified:**
• Clear understanding of ${event.keySkills[0].toLowerCase()} principles
• Professional presentation approach
• Good use of industry terminology

**Areas for Improvement:**
• Consider strengthening your ${event.keySkills[1].toLowerCase()} demonstration
• Enhance visual aids for better judge engagement
• Practice time management for the ${event.timeLimit} format

**Specific Rubric Analysis:**
${rubric.criteria.map(criteria => 
  `• **${criteria.name}:** Currently at Level 3/4 - ${criteria.levels[1].descriptor}`
).join('\n')}

**Judge's Recommended Action Steps:**
1. Practice the specific performance indicators for ${event.category}
2. Develop stronger opening and closing statements
3. Prepare for Q&A by anticipating judge questions
4. Review ${selectedClub.toUpperCase()} guidelines for ${event.format} events

**Competition Tips:**
• Arrive early and review room setup
• Bring backup materials and technology
• Maintain professional demeanor throughout
• Follow time limits strictly - judges penalize for overtime

**Estimated Score:** 78-85/100 (Strong performance with room for excellence)
`;

    setAiJudgeFeedback(feedback);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-card border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="gradient-text font-heading text-xl">Competitive Clubs</span>
              <p className="text-sm text-gray-600 font-normal">DECA, FBLA & HOSA Competition Training</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Club Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className={`cursor-pointer transition-all duration-200 ${selectedClub === 'deca' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
          onClick={() => setSelectedClub('deca')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">DECA</h3>
            <p className="text-sm text-gray-600 mb-3">Distributive Education Clubs of America</p>
            <Badge variant="secondary">Marketing & Business</Badge>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 ${selectedClub === 'fbla' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'}`}
          onClick={() => setSelectedClub('fbla')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">FBLA</h3>
            <p className="text-sm text-gray-600 mb-3">Future Business Leaders of America</p>
            <Badge variant="secondary">Business Leadership</Badge>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 ${selectedClub === 'hosa' ? 'ring-2 ring-red-500 bg-red-50' : 'hover:shadow-md'}`}
          onClick={() => setSelectedClub('hosa')}
        >
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">HOSA</h3>
            <p className="text-sm text-gray-600 mb-3">Health Occupations Students of America</p>
            <Badge variant="secondary">Healthcare Careers</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Event Selection and Training */}
      {selectedClub && (
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">Events & Practice</TabsTrigger>
            <TabsTrigger value="rubric">AI Judge</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Competitive Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a competitive event" />
                  </SelectTrigger>
                  <SelectContent>
                    {getClubEvents(selectedClub).map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name} - {event.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedEvent && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {(() => {
                      const event = getClubEvents(selectedClub).find(e => e.id === selectedEvent);
                      return event ? (
                        <div className="space-y-3">
                          <h4 className="font-semibold">{event.name}</h4>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Format:</strong> {event.format}
                            </div>
                            <div>
                              <strong>Time Limit:</strong> {event.timeLimit}
                            </div>
                            <div>
                              <strong>Participants:</strong> {event.participants}
                            </div>
                            <div>
                              <strong>Judges:</strong> {event.judgeCount}
                            </div>
                          </div>
                          
                          <div>
                            <strong className="text-sm">Key Skills:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {event.keySkills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rubric" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Competition Judge</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Practice Mode</label>
                    <Select value={practiceMode} onValueChange={(value: any) => setPracticeMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="competitor">Competitor Practice</SelectItem>
                        <SelectItem value="judge">Judge Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Event</label>
                    <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        {getClubEvents(selectedClub).map(event => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {practiceMode === 'competitor' ? 'Your Presentation/Response' : 'Competitor Content to Evaluate'}
                  </label>
                  <Textarea
                    value={customRubric}
                    onChange={(e) => setCustomRubric(e.target.value)}
                    placeholder={practiceMode === 'competitor' 
                      ? "Enter your presentation content, business plan, or competition response here..." 
                      : "Paste the competitor's content to evaluate using official rubrics..."
                    }
                    className="min-h-32"
                  />
                </div>

                <Button onClick={generateAIJudgeFeedback} className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  {practiceMode === 'competitor' ? 'Get Judge Feedback' : 'Generate Judge Scorecard'}
                </Button>

                {aiJudgeFeedback && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">AI Judge Evaluation</h4>
                    <div className="text-sm whitespace-pre-line">{aiJudgeFeedback}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedClub && (
              <Card>
                <CardHeader>
                  <CardTitle>Official {selectedClub.toUpperCase()} Rubric</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const rubric = getClubRubric(selectedClub);
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">{rubric.eventName}</h5>
                          <Badge variant="outline">Total: {rubric.totalPoints} points</Badge>
                        </div>
                        
                        {rubric.timeAllocation && (
                          <div className="p-3 bg-blue-50 rounded">
                            <h6 className="font-medium text-sm mb-1">Time Allocation:</h6>
                            <div className="text-xs space-y-1">
                              {rubric.timeAllocation.prep && <div>Prep: {rubric.timeAllocation.prep}</div>}
                              {rubric.timeAllocation.presentation && <div>Presentation: {rubric.timeAllocation.presentation}</div>}
                              {rubric.timeAllocation.qa && <div>Q&A: {rubric.timeAllocation.qa}</div>}
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          {rubric.criteria.map(criteria => (
                            <div key={criteria.id} className="border rounded p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h6 className="font-medium">{criteria.name}</h6>
                                <Badge variant="secondary">{criteria.maxPoints} pts</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{criteria.description}</p>
                              <div className="text-xs space-y-1">
                                {criteria.levels.map(level => (
                                  <div key={level.level} className="flex justify-between">
                                    <span>Level {level.level}: {level.descriptor}</span>
                                    <span className="font-medium">{level.points} pts</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Competition Guides</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <h5 className="font-medium">Official {selectedClub.toUpperCase()} Guidelines</h5>
                    <p className="text-sm text-gray-600">Competition rules and procedures</p>
                  </div>
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <h5 className="font-medium">Event-Specific Rubrics</h5>
                    <p className="text-sm text-gray-600">Detailed scoring criteria</p>
                  </div>
                  <div className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <h5 className="font-medium">Sample Presentations</h5>
                    <p className="text-sm text-gray-600">Award-winning examples</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5" />
                    <span>Quick Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-sm">Practice with official time limits</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-sm">Use industry-specific terminology</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-sm">Prepare for judge questions</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-sm">Review current industry trends</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}