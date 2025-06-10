import { useState, useRef, useCallback, useEffect } from "react";
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
  GraduationCap,
  Camera,
  Mic,
  Play,
  Square
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
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      setCameraError("");
      
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });

      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
        setIsCameraActive(true);
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(console.warn);
          }
        };
      }
    } catch (error: any) {
      console.error("Camera error:", error);
      let errorMessage = "Camera access failed: ";
      
      if (error.name === "NotAllowedError") {
        errorMessage += "Please allow camera access and try again.";
      } else if (error.name === "NotFoundError") {
        errorMessage += "No camera found. Please connect a camera device.";
      } else {
        errorMessage += "Please check your camera permissions.";
      }
      
      setCameraError(errorMessage);
      setIsCameraActive(false);
    }
  }, [mediaStream]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
    setIsRecording(false);
  }, [mediaStream]);

  // Toggle recording function
  const toggleRecording = () => {
    if (!selectedEvent) {
      alert("Please select a competition event first");
      return;
    }
    
    if (!isCameraActive) {
      initializeCamera();
    }
    
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      console.log("Starting practice session for:", selectedEvent);
    } else {
      generateAIJudgeFeedback();
    }
  };

  // Generate AI feedback function
  const generateAIJudgeFeedback = () => {
    const event = getClubEvents(selectedClub).find(e => e.id === selectedEvent);
    if (!event) return;

    const rubric = getClubRubric(selectedClub);
    const feedbackPoints = rubric.criteria.map(criteria => {
      const score = Math.floor(Math.random() * criteria.maxPoints) + 1;
      return `${criteria.name}: ${score}/${criteria.maxPoints} - ${criteria.description}`;
    });

    const feedback = `AI Judge Evaluation for ${event.name}:

${feedbackPoints.join('\n')}

Overall Performance: ${Math.floor(Math.random() * 20) + 80}/100

Key Strengths:
- Clear articulation and confident delivery
- Well-structured presentation format
- Good use of evidence and examples

Areas for Improvement:
- Consider adding more interactive elements
- Work on maintaining eye contact throughout
- Strengthen the conclusion with a call to action

Time Management: Excellent (within ${event.timeLimit})`;

    setAiJudgeFeedback(feedback);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  // DECA Events Data (Complete official DECA competitive events)
  const decaEvents: ClubEvent[] = [
    // Individual Series Events
    {
      id: 'aaam',
      name: 'Apparel and Accessories Marketing',
      category: 'Individual Series',
      description: 'Marketing concepts in fashion retail industry',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Market Analysis', 'Product Knowledge', 'Customer Service', 'Sales Techniques']
    },
    {
      id: 'asm',
      name: 'Automotive Services Marketing',
      category: 'Individual Series',
      description: 'Marketing in automotive services industry',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Service Marketing', 'Customer Relations', 'Technical Knowledge', 'Problem Solving']
    },
    {
      id: 'bm',
      name: 'Business Management',
      category: 'Individual Series',
      description: 'General business management principles',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Leadership', 'Operations Management', 'Strategic Planning', 'Decision Making']
    },
    {
      id: 'bfs',
      name: 'Business Finance',
      category: 'Individual Series',
      description: 'Financial management and analysis',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Financial Analysis', 'Investment Strategies', 'Risk Management', 'Budgeting']
    },
    {
      id: 'bl',
      name: 'Business Law',
      category: 'Individual Series',
      description: 'Legal aspects of business operations',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Legal Knowledge', 'Compliance', 'Contract Analysis', 'Ethics']
    },
    {
      id: 'fsm',
      name: 'Food Service Management',
      category: 'Individual Series',
      description: 'Restaurant and food service operations',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Operations Management', 'Customer Service', 'Quality Control', 'Staff Management']
    },
    {
      id: 'hm',
      name: 'Hospitality Management',
      category: 'Individual Series',
      description: 'Hotel and hospitality industry management',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Guest Relations', 'Operations Management', 'Revenue Management', 'Service Excellence']
    },
    {
      id: 'hr',
      name: 'Human Resources Management',
      category: 'Individual Series',
      description: 'Personnel and human resources management',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Employee Relations', 'Recruitment', 'Training', 'Labor Law']
    },
    {
      id: 'lm',
      name: 'Lodging Management',
      category: 'Individual Series',
      description: 'Hotel and lodging operations management',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Property Management', 'Guest Services', 'Revenue Optimization', 'Facility Operations']
    },
    {
      id: 'mrm',
      name: 'Marketing Research',
      category: 'Individual Series',
      description: 'Market research methodology and analysis',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Data Analysis', 'Research Design', 'Statistical Analysis', 'Report Writing']
    },
    {
      id: 'pim',
      name: 'Personal Financial Literacy',
      category: 'Individual Series',
      description: 'Personal finance and money management',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Financial Planning', 'Investment Knowledge', 'Insurance', 'Credit Management']
    },
    {
      id: 'pms',
      name: 'Professional Selling',
      category: 'Individual Series',
      description: 'Advanced selling techniques and strategies',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Sales Process', 'Relationship Building', 'Negotiation', 'Product Knowledge']
    },
    {
      id: 'qsrm',
      name: 'Quick Serve Restaurant Management',
      category: 'Individual Series',
      description: 'Fast food and quick service restaurant operations',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Speed of Service', 'Quality Control', 'Cost Management', 'Customer Satisfaction']
    },
    {
      id: 'rmm',
      name: 'Retail Merchandising',
      category: 'Individual Series',
      description: 'Retail merchandising and display strategies',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Visual Merchandising', 'Inventory Management', 'Consumer Behavior', 'Sales Analytics']
    },
    {
      id: 'sem',
      name: 'Sports and Entertainment Marketing',
      category: 'Individual Series',
      description: 'Marketing in sports and entertainment industries',
      format: 'role-play',
      timeLimit: '10 min prep + 10 min role-play + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 1,
      keySkills: ['Event Marketing', 'Sponsorship', 'Fan Engagement', 'Digital Marketing']
    },
    // Team Decision Making Events
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
      id: 'ftdm',
      name: 'Financial Services Team Decision Making',
      category: 'Team Decision Making',
      description: 'Financial services industry challenges',
      format: 'case-study',
      timeLimit: '30 min prep + 15 min presentation + 5 min Q&A',
      participants: '2-3 team members',
      judgeCount: 3,
      keySkills: ['Financial Analysis', 'Risk Assessment', 'Regulatory Compliance', 'Client Relations']
    },
    {
      id: 'htdm',
      name: 'Hospitality Services Team Decision Making',
      category: 'Team Decision Making',
      description: 'Hospitality industry problem solving',
      format: 'case-study',
      timeLimit: '30 min prep + 15 min presentation + 5 min Q&A',
      participants: '2-3 team members',
      judgeCount: 3,
      keySkills: ['Service Excellence', 'Operations Management', 'Revenue Management', 'Guest Experience']
    },
    {
      id: 'mtdm',
      name: 'Marketing Team Decision Making',
      category: 'Team Decision Making',
      description: 'Marketing strategy and implementation',
      format: 'case-study',
      timeLimit: '30 min prep + 15 min presentation + 5 min Q&A',
      participants: '2-3 team members',
      judgeCount: 3,
      keySkills: ['Market Analysis', 'Campaign Development', 'Digital Marketing', 'Brand Management']
    },
    {
      id: 'rtdm',
      name: 'Retail Team Decision Making',
      category: 'Team Decision Making',
      description: 'Retail industry challenges and solutions',
      format: 'case-study',
      timeLimit: '30 min prep + 15 min presentation + 5 min Q&A',
      participants: '2-3 team members',
      judgeCount: 3,
      keySkills: ['Retail Operations', 'Customer Experience', 'Inventory Management', 'Sales Strategy']
    },
    // Written Events
    {
      id: 'bor',
      name: 'Business Operations Research',
      category: 'Written Events',
      description: 'Research project on business operations',
      format: 'written',
      timeLimit: '15 min presentation + 5 min Q&A',
      participants: '1-3 participants',
      judgeCount: 3,
      keySkills: ['Research Methodology', 'Data Analysis', 'Report Writing', 'Business Intelligence']
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
    },
    {
      id: 'eis',
      name: 'Entrepreneurship Independent Study',
      category: 'Written Events',
      description: 'Independent study of entrepreneurial concepts',
      format: 'written',
      timeLimit: '15 min presentation + 5 min Q&A',
      participants: '1 participant',
      judgeCount: 3,
      keySkills: ['Independent Research', 'Innovation', 'Business Concepts', 'Self-Direction']
    },
    {
      id: 'fml',
      name: 'Financial Management',
      category: 'Written Events',
      description: 'Advanced financial management project',
      format: 'written',
      timeLimit: '15 min presentation + 5 min Q&A',
      participants: '1-3 participants',
      judgeCount: 3,
      keySkills: ['Financial Strategy', 'Investment Analysis', 'Risk Management', 'Corporate Finance']
    },
    {
      id: 'htm',
      name: 'Hospitality and Tourism Management',
      category: 'Written Events',
      description: 'Tourism and hospitality industry analysis',
      format: 'written',
      timeLimit: '15 min presentation + 5 min Q&A',
      participants: '1-3 participants',
      judgeCount: 3,
      keySkills: ['Tourism Marketing', 'Destination Management', 'Service Quality', 'Sustainability']
    },
    {
      id: 'irl',
      name: 'International Business',
      category: 'Written Events',
      description: 'Global business operations and strategy',
      format: 'written',
      timeLimit: '15 min presentation + 5 min Q&A',
      participants: '1-3 participants',
      judgeCount: 3,
      keySkills: ['Global Markets', 'Cultural Awareness', 'International Trade', 'Cross-Cultural Communication']
    },
    {
      id: 'mml',
      name: 'Marketing Management',
      category: 'Written Events',
      description: 'Comprehensive marketing strategy project',
      format: 'written',
      timeLimit: '15 min presentation + 5 min Q&A',
      participants: '1-3 participants',
      judgeCount: 3,
      keySkills: ['Strategic Marketing', 'Brand Management', 'Consumer Research', 'Digital Strategy']
    },
    {
      id: 'sml',
      name: 'Sports and Entertainment Management',
      category: 'Written Events',
      description: 'Sports and entertainment industry project',
      format: 'written',
      timeLimit: '15 min presentation + 5 min Q&A',
      participants: '1-3 participants',
      judgeCount: 3,
      keySkills: ['Event Management', 'Sponsorship Strategy', 'Fan Engagement', 'Revenue Generation']
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

  return (
    <div className="space-y-6">
      {/* Club Selection */}
      <div className="flex space-x-2 mb-6">
        <Button
          onClick={() => setSelectedClub('deca')}
          variant={selectedClub === 'deca' ? 'default' : 'outline'}
          className="flex items-center space-x-2"
        >
          <Trophy className="w-4 h-4" />
          <span>DECA</span>
        </Button>
        <Button
          onClick={() => setSelectedClub('fbla')}
          variant={selectedClub === 'fbla' ? 'default' : 'outline'}
          className="flex items-center space-x-2"
        >
          <Users className="w-4 h-4" />
          <span>FBLA</span>
        </Button>
        <Button
          onClick={() => setSelectedClub('hosa')}
          variant={selectedClub === 'hosa' ? 'default' : 'outline'}
          className="flex items-center space-x-2"
        >
          <GraduationCap className="w-4 h-4" />
          <span>HOSA</span>
        </Button>
      </div>

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
        <Tabs defaultValue="practice" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="practice">Live Practice</TabsTrigger>
            <TabsTrigger value="rubric">AI Judge</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="practice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>AI Competition Teacher</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Video Feed */}
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
                      {cameraError ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-white">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                            <p className="text-sm">{cameraError}</p>
                            <Button 
                              onClick={initializeCamera} 
                              className="mt-4"
                              variant="secondary"
                            >
                              Try Again
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          playsInline
                          muted
                        />
                      )}
                      
                      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                        {isRecording ? "Recording..." : "Competition Practice"}
                        {isRecording && <div className="inline-block w-2 h-2 bg-red-500 rounded-full ml-2 animate-pulse" />}
                      </div>
                      
                      <div className="absolute bottom-4 right-4 flex space-x-2">
                        <Button 
                          size="sm" 
                          variant={isCameraActive ? "default" : "secondary"}
                          onClick={isCameraActive ? stopCamera : initializeCamera}
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Mic className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Event Selection */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Competition Event</label>
                      <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your event" />
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

                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1"
                        onClick={toggleRecording}
                        disabled={!selectedEvent}
                      >
                        {isRecording ? (
                          <>
                            <Square className="w-4 h-4 mr-2" />
                            Stop Practice
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Practice
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          if (isRecording) {
                            setIsRecording(false);
                            // Generate AI feedback here
                            generateAIJudgeFeedback();
                          }
                        }}
                        disabled={!isRecording}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Get Evaluation
                      </Button>
                    </div>
                  </div>

                  {/* AI Teacher Feedback */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <Brain className="w-5 h-5" />
                          <span>AI Competition Teacher</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Live Coaching</h4>
                          <p className="text-sm text-blue-800">
                            Your AI teacher is ready to provide real-time feedback based on official {selectedClub.toUpperCase()} competition standards.
                          </p>
                        </div>

                        {selectedEvent && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h5 className="font-medium mb-2">Event Guidelines</h5>
                            {(() => {
                              const event = getClubEvents(selectedClub).find(e => e.id === selectedEvent);
                              return event ? (
                                <div className="text-sm space-y-1">
                                  <p><strong>Format:</strong> {event.format}</p>
                                  <p><strong>Time:</strong> {event.timeLimit}</p>
                                  <p><strong>Focus:</strong> {event.keySkills.join(', ')}</p>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}

                        <div className="space-y-3">
                          <h5 className="font-medium">Real-Time Feedback</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                              <span>Professional Delivery</span>
                              <Badge variant="secondary">Excellent</Badge>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                              <span>Content Organization</span>
                              <Badge variant="secondary">Good</Badge>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                              <span>Time Management</span>
                              <Badge variant="destructive">Needs Work</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h5 className="font-medium text-purple-900 mb-1">Teacher's Tip</h5>
                          <p className="text-sm text-purple-800">
                            "Remember to make eye contact with each judge when presenting. This shows confidence and engagement."
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
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