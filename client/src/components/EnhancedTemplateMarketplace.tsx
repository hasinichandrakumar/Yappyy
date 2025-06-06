import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Filter, 
  Star, 
  Download, 
  Edit3, 
  Wand2, 
  Target, 
  Heart, 
  Lightbulb,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  Mic,
  Award,
  FileText
} from "lucide-react";



interface SpeechTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  genre: 'persuasive' | 'narrative' | 'motivational' | 'analytical' | 'celebratory';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  downloads: number;
  author: string;
  price: number;
  isUserGenerated: boolean;
  toneProfile: {
    humor: number;
    formality: number;
    emotion: number;
    urgency: number;
  };
  structure: {
    hook: string;
    body: string[];
    cta: string;
  };
  fillInBlanks: {
    [key: string]: string;
  };
  smartRewrites: {
    persuasive: string;
    emotional: string;
    humorous: string;
  };
}

interface ToneSettings {
  humor: number;
  formality: number;
  emotion: number;
  urgency: number;
}

export default function EnhancedTemplateMarketplace() {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [toneSettings, setToneSettings] = useState<ToneSettings>({
    humor: 50,
    formality: 50,
    emotion: 50,
    urgency: 50
  });
  const [selectedTemplate, setSelectedTemplate] = useState<SpeechTemplate | null>(null);
  const [customInputs, setCustomInputs] = useState<{[key: string]: string}>({});

  const templates: SpeechTemplate[] = [
    {
      id: '1',
      title: "TED Talk: Revolutionary Product Launch",
      description: "AI-crafted structure for announcing breakthrough innovations with maximum impact",
      category: "Product Launch",
      genre: 'persuasive',
      difficulty: 'advanced',
      duration: "12-15 minutes",
      rating: 4.9,
      downloads: 2847,
      author: "Dr. Sarah Chen",
      price: 0,
      isUserGenerated: true,
      toneProfile: {
        humor: 30,
        formality: 70,
        emotion: 80,
        urgency: 90
      },
      structure: {
        hook: "What if I told you that in the next [TIMEFRAME], [PROBLEM] will be completely solved?",
        body: [
          "The [STATISTIC] that changed everything",
          "How we discovered [BREAKTHROUGH]",
          "The three pillars of [SOLUTION]",
          "Real-world impact: [CASE_STUDY]"
        ],
        cta: "Join us in [ACTION] - because [FUTURE_VISION] starts today."
      },
      fillInBlanks: {
        TIMEFRAME: "18 months",
        PROBLEM: "climate change",
        STATISTIC: "97% reduction in carbon emissions",
        BREAKTHROUGH: "carbon-negative technology",
        SOLUTION: "our revolutionary approach",
        CASE_STUDY: "Google's 50% energy reduction",
        ACTION: "the sustainability revolution",
        FUTURE_VISION: "a carbon-neutral world"
      },
      smartRewrites: {
        persuasive: "Transform your opening with data-driven urgency and social proof",
        emotional: "Add personal story about environmental impact on your family",
        humorous: "Start with: 'My kids asked me why the planet is getting a fever...'"
      }
    },
    {
      id: '2',
      title: "Motivational Keynote: Overcoming Adversity",
      description: "Inspire audiences with your journey from challenge to triumph",
      category: "Keynote",
      genre: 'motivational',
      difficulty: 'intermediate',
      duration: "20-25 minutes",
      rating: 4.8,
      downloads: 3921,
      author: "Marcus Williams",
      price: 0,
      isUserGenerated: true,
      toneProfile: {
        humor: 60,
        formality: 40,
        emotion: 95,
        urgency: 70
      },
      structure: {
        hook: "They said [NEGATIVE_PREDICTION]. Today, I'm here to tell you they were wrong.",
        body: [
          "The moment everything changed: [PIVOTAL_MOMENT]",
          "The three lessons [FAILURE] taught me",
          "How [MINDSET_SHIFT] transformed my path",
          "Your turn: The [ACTION_FRAMEWORK] that works"
        ],
        cta: "Your [OBSTACLE] isn't your ending - it's your beginning. Start [FIRST_STEP] today."
      },
      fillInBlanks: {
        NEGATIVE_PREDICTION: "I'd never succeed in business",
        PIVOTAL_MOMENT: "losing my first company",
        FAILURE: "bankruptcy",
        MINDSET_SHIFT: "seeing failure as data",
        ACTION_FRAMEWORK: "RISE method",
        OBSTACLE: "setback",
        FIRST_STEP: "taking one small action"
      },
      smartRewrites: {
        persuasive: "Add statistics about resilience and success rates after failure",
        emotional: "Include vulnerable moment about your darkest day",
        humorous: "Open with: 'I've failed so many times, I should get a PhD in it...'"
      }
    },
    {
      id: '3',
      title: "Business Pitch: Series A Funding",
      description: "Structured approach to secure venture capital with compelling storytelling",
      category: "Funding Pitch",
      genre: 'analytical',
      difficulty: 'advanced',
      duration: "10 minutes",
      rating: 4.7,
      downloads: 1653,
      author: "AI Speech Coach",
      price: 0,
      isUserGenerated: false,
      toneProfile: {
        humor: 20,
        formality: 90,
        emotion: 60,
        urgency: 85
      },
      structure: {
        hook: "[MARKET_SIZE] people face [PROBLEM] daily. We've built the solution they're waiting for.",
        body: [
          "Market opportunity: [TAM] and growing [GROWTH_RATE]%",
          "Our solution: [UNIQUE_VALUE_PROP]",
          "Traction: [KEY_METRICS] in [TIMEFRAME]",
          "The ask: [FUNDING_AMOUNT] for [USE_OF_FUNDS]"
        ],
        cta: "Partner with us to capture [MARKET_SHARE]% of this [MARKET_VALUE] market."
      },
      fillInBlanks: {
        MARKET_SIZE: "500 million",
        PROBLEM: "inefficient workflow management",
        TAM: "$50B total addressable market",
        GROWTH_RATE: "25",
        UNIQUE_VALUE_PROP: "AI-powered automation that learns",
        KEY_METRICS: "200% revenue growth",
        TIMEFRAME: "12 months",
        FUNDING_AMOUNT: "$5M",
        USE_OF_FUNDS: "product development and market expansion",
        MARKET_SHARE: "3",
        MARKET_VALUE: "$50B"
      },
      smartRewrites: {
        persuasive: "Lead with customer pain point and urgency of solution",
        emotional: "Share founder story about discovering this problem",
        humorous: "Start with: 'We're solving a problem so obvious, we're surprised no one fixed it yet...'"
      }
    },
    {
      id: '4',
      title: "Wedding Toast: Best Man Speech",
      description: "Heartfelt and memorable wedding toast that balances humor with sentiment",
      category: "Wedding",
      genre: 'celebratory',
      difficulty: 'beginner',
      duration: "3-5 minutes",
      rating: 4.9,
      downloads: 8247,
      author: "Wedding Speech Pro",
      price: 0,
      isUserGenerated: false,
      toneProfile: {
        humor: 70,
        formality: 30,
        emotion: 85,
        urgency: 20
      },
      structure: {
        hook: "I've known [GROOM_NAME] for [YEARS] years, and I've never seen him as happy as he is with [BRIDE_NAME].",
        body: [
          "How we met: [FRIENDSHIP_STORY]",
          "The moment I knew [BRIDE_NAME] was special: [REALIZATION_MOMENT]",
          "What makes them perfect together: [COUPLE_QUALITIES]",
          "My wish for your future: [BLESSING]"
        ],
        cta: "Please join me in raising a toast to [COUPLE_NAMES] - may your love story continue to inspire us all."
      },
      fillInBlanks: {
        GROOM_NAME: "Mike",
        BRIDE_NAME: "Sarah",
        YEARS: "15",
        FRIENDSHIP_STORY: "we met in college during a terrible karaoke performance",
        REALIZATION_MOMENT: "he started wearing matching socks",
        COUPLE_QUALITIES: "they both laugh at terrible jokes",
        BLESSING: "endless laughter and adventure",
        COUPLE_NAMES: "Mike and Sarah"
      },
      smartRewrites: {
        persuasive: "Add specific examples of their positive impact on others",
        emotional: "Include a touching moment about their relationship",
        humorous: "Start with: 'Mike asked me to keep this short, so I'll try to finish before their first anniversary...'"
      }
    },
    {
      id: '5',
      title: "Job Interview: Executive Position",
      description: "Structured approach to showcase leadership experience and vision",
      category: "Interview",
      genre: 'persuasive',
      difficulty: 'advanced',
      duration: "15-20 minutes",
      rating: 4.6,
      downloads: 3421,
      author: "Career Coach AI",
      price: 0,
      isUserGenerated: false,
      toneProfile: {
        humor: 25,
        formality: 85,
        emotion: 40,
        urgency: 60
      },
      structure: {
        hook: "In my [YEARS] years of leadership, I've learned that [KEY_INSIGHT] is what separates good leaders from great ones.",
        body: [
          "My leadership philosophy: [PHILOSOPHY]",
          "Key achievement: How I [MAJOR_ACCOMPLISHMENT]",
          "Challenge overcome: [DIFFICULT_SITUATION] and its resolution",
          "My vision for this role: [FUTURE_PLANS]"
        ],
        cta: "I'm excited to bring this experience and vision to drive [COMPANY_NAME]'s next phase of growth."
      },
      fillInBlanks: {
        YEARS: "12",
        KEY_INSIGHT: "empowering teams to exceed their own expectations",
        PHILOSOPHY: "servant leadership with clear accountability",
        MAJOR_ACCOMPLISHMENT: "turned around a failing division to 150% growth",
        DIFFICULT_SITUATION: "managing through the 2020 downturn",
        FUTURE_PLANS: "expanding market presence while building team culture",
        COMPANY_NAME: "TechCorp"
      },
      smartRewrites: {
        persuasive: "Lead with quantifiable business impact and ROI",
        emotional: "Share personal motivation for joining this specific company",
        humorous: "Open with: 'My kids think I'm the CEO of bedtime negotiations...'"
      }
    },
    {
      id: '6',
      title: "Academic Conference: Research Presentation",
      description: "Professional template for presenting research findings to academic peers",
      category: "Academic",
      genre: 'analytical',
      difficulty: 'advanced',
      duration: "18-22 minutes",
      rating: 4.7,
      downloads: 2156,
      author: "Dr. Research Expert",
      price: 0,
      isUserGenerated: true,
      toneProfile: {
        humor: 15,
        formality: 95,
        emotion: 30,
        urgency: 50
      },
      structure: {
        hook: "Current [FIELD] research faces a critical gap: [RESEARCH_GAP] that impacts [STAKEHOLDERS].",
        body: [
          "Literature review and methodology: [APPROACH]",
          "Key findings: [MAIN_RESULTS]",
          "Statistical significance: [DATA_ANALYSIS]",
          "Implications for the field: [BROADER_IMPACT]"
        ],
        cta: "This research opens new avenues for [FUTURE_RESEARCH] and practical applications in [APPLICATION_AREA]."
      },
      fillInBlanks: {
        FIELD: "sustainable energy",
        RESEARCH_GAP: "efficient battery storage at scale",
        STAKEHOLDERS: "renewable energy adoption",
        APPROACH: "machine learning optimization models",
        MAIN_RESULTS: "23% efficiency improvement",
        DATA_ANALYSIS: "p<0.001 across all test conditions",
        BROADER_IMPACT: "accelerating clean energy transition",
        FUTURE_RESEARCH: "commercial implementation studies",
        APPLICATION_AREA: "grid-scale energy storage"
      },
      smartRewrites: {
        persuasive: "Emphasize urgency of climate action and research impact",
        emotional: "Connect to personal motivation for sustainability research",
        humorous: "Start with: 'After 3 years of data collection, I can confirm that spreadsheets don't actually solve climate change...'"
      }
    },
    {
      id: '7',
      title: "Sales Presentation: Enterprise Software",
      description: "Compelling business case for B2B software solution with ROI focus",
      category: "Sales",
      genre: 'persuasive',
      difficulty: 'intermediate',
      duration: "25-30 minutes",
      rating: 4.8,
      downloads: 4762,
      author: "Sales Mastery Inc",
      price: 0,
      isUserGenerated: true,
      toneProfile: {
        humor: 40,
        formality: 70,
        emotion: 60,
        urgency: 80
      },
      structure: {
        hook: "What if I told you that [CURRENT_PROCESS] is costing your company [COST_IMPACT] annually?",
        body: [
          "The hidden costs of [STATUS_QUO]",
          "Our solution: [PRODUCT_BENEFITS]",
          "ROI demonstration: [CASE_STUDY]",
          "Implementation roadmap: [TIMELINE]"
        ],
        cta: "Let's schedule a pilot program to demonstrate [SPECIFIC_BENEFIT] within [TIMEFRAME]."
      },
      fillInBlanks: {
        CURRENT_PROCESS: "manual data entry",
        COST_IMPACT: "$2.3 million in lost productivity",
        STATUS_QUO: "outdated workflow systems",
        PRODUCT_BENEFITS: "AI-powered automation reducing manual work by 75%",
        CASE_STUDY: "TechCorp saved $500K in first 6 months",
        TIMELINE: "90-day implementation with immediate benefits",
        SPECIFIC_BENEFIT: "30% productivity increase",
        TIMEFRAME: "30 days"
      },
      smartRewrites: {
        persuasive: "Lead with competitor analysis and market urgency",
        emotional: "Share customer success story about transformed work-life balance",
        humorous: "Open with: 'Raise your hand if you love spending Friday nights with Excel spreadsheets...'"
      }
    },
    {
      id: '8',
      title: "Graduation Speech: University Commencement",
      description: "Inspirational address for graduates entering the workforce",
      category: "Commencement",
      genre: 'motivational',
      difficulty: 'intermediate',
      duration: "12-15 minutes",
      rating: 4.9,
      downloads: 5683,
      author: "Education Leader",
      price: 0,
      isUserGenerated: false,
      toneProfile: {
        humor: 50,
        formality: 60,
        emotion: 90,
        urgency: 40
      },
      structure: {
        hook: "Class of [YEAR], you are graduating into a world that needs exactly what you have to offer: [UNIQUE_QUALITIES].",
        body: [
          "What you've accomplished: [ACHIEVEMENTS]",
          "The world you're entering: [CURRENT_LANDSCAPE]",
          "Your unique preparation: [SKILLS_GAINED]",
          "The challenge ahead: [CALL_TO_ACTION]"
        ],
        cta: "Go forth and [MISSION] - the world is waiting for your contribution."
      },
      fillInBlanks: {
        YEAR: "2024",
        UNIQUE_QUALITIES: "fresh perspective and digital fluency",
        ACHIEVEMENTS: "adapting to remote learning and emerging stronger",
        CURRENT_LANDSCAPE: "rapid technological change and global challenges",
        SKILLS_GAINED: "resilience, adaptability, and critical thinking",
        CALL_TO_ACTION: "create solutions for tomorrow's problems",
        MISSION: "make your mark on the world"
      },
      smartRewrites: {
        persuasive: "Emphasize graduates' unique position to solve global challenges",
        emotional: "Share personal story about overcoming educational obstacles",
        humorous: "Start with: 'You survived group projects - you can survive anything...'"
      }
    },
    {
      id: '9',
      title: "Product Demo: Live Software Demonstration",
      description: "Engaging live demo script that highlights key features and benefits",
      category: "Product Demo",
      genre: 'analytical',
      difficulty: 'intermediate',
      duration: "20 minutes",
      rating: 4.5,
      downloads: 3891,
      author: "Demo Expert",
      price: 0,
      isUserGenerated: true,
      toneProfile: {
        humor: 35,
        formality: 65,
        emotion: 45,
        urgency: 70
      },
      structure: {
        hook: "Let me show you how [PRODUCT_NAME] can [PRIMARY_BENEFIT] in just [TIME_FRAME].",
        body: [
          "The problem we're solving: [PAIN_POINT]",
          "Feature showcase: [KEY_FEATURES]",
          "Real-world scenario: [USE_CASE]",
          "Results you can expect: [OUTCOMES]"
        ],
        cta: "Ready to see how [PRODUCT_NAME] can transform your [BUSINESS_AREA]? Let's set up your trial."
      },
      fillInBlanks: {
        PRODUCT_NAME: "WorkflowAI",
        PRIMARY_BENEFIT: "reduce project management overhead by 60%",
        TIME_FRAME: "10 minutes",
        PAIN_POINT: "scattered communication and missed deadlines",
        KEY_FEATURES: "intelligent task routing and automated progress tracking",
        USE_CASE: "launching a new product campaign",
        OUTCOMES: "faster delivery and improved team collaboration",
        BUSINESS_AREA: "project management workflow"
      },
      smartRewrites: {
        persuasive: "Focus on competitive advantage and ROI metrics",
        emotional: "Share customer testimonial about stress reduction",
        humorous: "Begin with: 'This is the demo that makes project managers smile...'"
      }
    },
    {
      id: '10',
      title: "Retirement Speech: Farewell Address",
      description: "Graceful farewell speech reflecting on career achievements and legacy",
      category: "Farewell",
      genre: 'celebratory',
      difficulty: 'beginner',
      duration: "8-10 minutes",
      rating: 4.8,
      downloads: 2749,
      author: "Life Transitions",
      price: 0,
      isUserGenerated: false,
      toneProfile: {
        humor: 60,
        formality: 50,
        emotion: 85,
        urgency: 20
      },
      structure: {
        hook: "After [YEARS] years in [INDUSTRY], I've learned that [LIFE_LESSON] matters most.",
        body: [
          "My journey: From [START_POINT] to [CURRENT_ROLE]",
          "Memorable moments: [CAREER_HIGHLIGHTS]",
          "People who shaped me: [MENTORS_COLLEAGUES]",
          "Advice for the future: [WISDOM_SHARED]"
        ],
        cta: "Thank you for [SPECIFIC_GRATITUDE]. I look forward to [RETIREMENT_PLANS]."
      },
      fillInBlanks: {
        YEARS: "35",
        INDUSTRY: "education",
        LIFE_LESSON: "inspiring others to reach their potential",
        START_POINT: "nervous first-year teacher",
        CURRENT_ROLE: "principal",
        CAREER_HIGHLIGHTS: "watching students discover their passions",
        MENTORS_COLLEAGUES: "amazing teachers who became lifelong friends",
        WISDOM_SHARED: "never stop learning and always believe in your students",
        SPECIFIC_GRATITUDE: "letting me be part of so many success stories",
        RETIREMENT_PLANS: "traveling and volunteering with literacy programs"
      },
      smartRewrites: {
        persuasive: "Emphasize the impact and legacy you've built",
        emotional: "Include specific student success story that moved you",
        humorous: "Open with: 'They say retirement is when you stop living at work and start working at living...'"
      }
    },
    {
      id: '11',
      title: "Crisis Communication: Public Statement",
      description: "Professional crisis response template for organizational challenges",
      category: "Crisis Management",
      genre: 'analytical',
      difficulty: 'advanced',
      duration: "5-7 minutes",
      rating: 4.4,
      downloads: 1823,
      author: "Crisis Communication Pro",
      price: 0,
      isUserGenerated: true,
      toneProfile: {
        humor: 5,
        formality: 95,
        emotion: 40,
        urgency: 85
      },
      structure: {
        hook: "I want to address [SITUATION] directly and share our immediate response and long-term commitment.",
        body: [
          "What happened: [FACTS_SUMMARY]",
          "Our immediate actions: [RESPONSE_STEPS]",
          "Accountability: [RESPONSIBILITY_ACCEPTANCE]",
          "Moving forward: [PREVENTION_MEASURES]"
        ],
        cta: "We are committed to [COMMITMENT] and will provide updates as we progress."
      },
      fillInBlanks: {
        SITUATION: "the data security incident affecting customer accounts",
        FACTS_SUMMARY: "unauthorized access to encrypted customer data on March 15th",
        RESPONSE_STEPS: "immediately secured systems and notified authorities",
        RESPONSIBILITY_ACCEPTANCE: "taking full responsibility for this breach",
        PREVENTION_MEASURES: "implementing multi-factor authentication and enhanced monitoring",
        COMMITMENT: "rebuilding your trust through transparent action"
      },
      smartRewrites: {
        persuasive: "Emphasize concrete actions and timeline for resolution",
        emotional: "Acknowledge personal impact on affected customers",
        humorous: "Maintain serious tone throughout - no humor appropriate"
      }
    },
    {
      id: '12',
      title: "Team Building: Quarterly All-Hands",
      description: "Energizing team meeting template to align goals and boost morale",
      category: "Team Meeting",
      genre: 'motivational',
      difficulty: 'beginner',
      duration: "15-20 minutes",
      rating: 4.7,
      downloads: 6234,
      author: "Team Leadership",
      price: 0,
      isUserGenerated: false,
      toneProfile: {
        humor: 65,
        formality: 40,
        emotion: 75,
        urgency: 60
      },
      structure: {
        hook: "This quarter, we achieved [MAJOR_WIN] together. Let's talk about what's next.",
        body: [
          "Celebrating our wins: [ACHIEVEMENTS]",
          "Learning from challenges: [LESSONS_LEARNED]",
          "Our focus ahead: [QUARTERLY_GOALS]",
          "How we'll succeed together: [TEAM_STRATEGY]"
        ],
        cta: "Let's make the next quarter our best yet by [SPECIFIC_ACTION]."
      },
      fillInBlanks: {
        MAJOR_WIN: "exceeding our revenue target by 15%",
        ACHIEVEMENTS: "launching three new features and gaining 500 new customers",
        LESSONS_LEARNED: "the importance of cross-team communication",
        QUARTERLY_GOALS: "improving customer satisfaction to 95%",
        TEAM_STRATEGY: "implementing weekly collaboration sessions",
        SPECIFIC_ACTION: "supporting each other's growth and celebrating small wins"
      },
      smartRewrites: {
        persuasive: "Include competitive market position and growth opportunities",
        emotional: "Share personal story about team member's contribution",
        humorous: "Start with: 'I've seen our Slack channels - you're definitely collaborating...'"
      }
    }
  ];

  const genres = [
    { value: 'all', label: 'All Genres', icon: Star },
    { value: 'persuasive', label: 'Persuasive', icon: Target },
    { value: 'narrative', label: 'Narrative', icon: Heart },
    { value: 'motivational', label: 'Motivational', icon: TrendingUp },
    { value: 'analytical', label: 'Analytical', icon: Briefcase },
    { value: 'celebratory', label: 'Celebratory', icon: Award }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'product-launch', label: 'Product Launch' },
    { value: 'keynote', label: 'Keynote' },
    { value: 'funding-pitch', label: 'Funding Pitch' },
    { value: 'ted-talk', label: 'TED Talk' },
    { value: 'sales-presentation', label: 'Sales Presentation' }
  ];

  const filteredTemplates = templates.filter(template => 
    selectedGenre === 'all' || template.genre === selectedGenre
  );

  const handleToneChange = (tone: keyof ToneSettings, value: number[]) => {
    setToneSettings(prev => ({
      ...prev,
      [tone]: value[0]
    }));
  };

  const generateSmartRewrite = (template: SpeechTemplate, style: 'persuasive' | 'emotional' | 'humorous') => {
    return template.smartRewrites[style];
  };

  const getToneDescription = (value: number) => {
    if (value < 25) return 'Minimal';
    if (value < 50) return 'Light';
    if (value < 75) return 'Moderate';
    return 'Strong';
  };

  return (
    <div className="space-y-6">
      {/* Filters and Tone Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-purple-600" />
            <CardTitle>Smart Template Filters & Tone Designer</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Genre and Category Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(genre => {
                    const Icon = genre.icon;
                    return (
                      <SelectItem key={genre.value} value={genre.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{genre.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tone Sliders */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Tone Customization</h3>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(toneSettings).map(([tone, value]) => (
                <div key={tone} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700 capitalize">{tone}</label>
                    <Badge variant="outline" className="text-xs">
                      {getToneDescription(value)}
                    </Badge>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(val) => handleToneChange(tone as keyof ToneSettings, val)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Minimal</span>
                    <span>Strong</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">{template.title}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{template.rating}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {template.difficulty}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{template.genre}</Badge>
                <Badge variant="outline">{template.duration}</Badge>
                {template.isUserGenerated && (
                  <Badge className="bg-purple-100 text-purple-800">Community</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Tone Profile Visualization */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Tone Profile</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(template.toneProfile).map(([tone, value]) => (
                    <div key={tone} className="flex justify-between">
                      <span className="capitalize">{tone}:</span>
                      <span className="font-medium">{getToneDescription(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Template Preview */}
              <div className="p-3 bg-gray-50 rounded text-sm">
                <strong>Hook:</strong> {template.structure.hook.substring(0, 80)}...
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    {template.downloads}
                  </span>
                  <span>by {template.author}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    FREE
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Customization Modal/Panel */}
      {selectedTemplate && (
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                <CardTitle>Fill-in-the-Blank Builder</CardTitle>
              </div>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Close
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              AI builds the structure, you customize the content
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Fill-in-the-Blank Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedTemplate.fillInBlanks).map(([key, defaultValue]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  <Input
                    placeholder={defaultValue}
                    value={customInputs[key] || ''}
                    onChange={(e) => setCustomInputs(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                  />
                </div>
              ))}
            </div>

            {/* Smart Rewrites */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Smart Rewrites</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(selectedTemplate.smartRewrites).map(([style, suggestion]) => (
                  <Card key={style} className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <h4 className="font-medium capitalize">{style}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{suggestion}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Apply Rewrite
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Live Preview with Custom Content */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Live Preview</h3>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-white rounded border-l-4 border-blue-500">
                  <strong className="text-blue-700">Hook:</strong>
                  <p className="mt-1">{selectedTemplate.structure.hook.replace(/\[([^\]]+)\]/g, (match, key) => customInputs[key] || selectedTemplate.fillInBlanks[key] || key)}</p>
                </div>
                <div className="p-3 bg-white rounded border-l-4 border-green-500">
                  <strong className="text-green-700">Body Structure:</strong>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    {selectedTemplate.structure.body.map((point, index) => (
                      <li key={index}>{point.replace(/\[([^\]]+)\]/g, (match, key) => customInputs[key] || selectedTemplate.fillInBlanks[key] || key)}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-white rounded border-l-4 border-purple-500">
                  <strong className="text-purple-700">Call to Action:</strong>
                  <p className="mt-1">{selectedTemplate.structure.cta.replace(/\[([^\]]+)\]/g, (match, key) => customInputs[key] || selectedTemplate.fillInBlanks[key] || key)}</p>
                </div>
              </div>
            </div>

            {/* Full Speech Output */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-600" />
                Complete Speech
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="mb-4 text-gray-800 leading-relaxed">
                  {selectedTemplate.structure.hook.replace(/\[([^\]]+)\]/g, (match, key) => customInputs[key] || selectedTemplate.fillInBlanks[key] || key)}
                </p>
                {selectedTemplate.structure.body.map((point, index) => (
                  <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                    {point.replace(/\[([^\]]+)\]/g, (match, key) => customInputs[key] || selectedTemplate.fillInBlanks[key] || key)}
                  </p>
                ))}
                <p className="mt-4 text-gray-800 font-medium">
                  {selectedTemplate.structure.cta.replace(/\[([^\]]+)\]/g, (match, key) => customInputs[key] || selectedTemplate.fillInBlanks[key] || key)}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline">Save Draft</Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Generate Speech
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}