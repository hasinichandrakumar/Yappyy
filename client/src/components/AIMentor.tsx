import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Lightbulb, 
  Users, 
  MessageSquare, 
  Zap, 
  Target, 
  Edit3, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  TrendingUp
} from "lucide-react";

interface ScriptSuggestion {
  type: 'improvement' | 'addition' | 'restructure' | 'enhancement';
  section: string;
  original: string;
  suggested: string;
  reasoning: string;
  impact: 'high' | 'medium' | 'low';
}

interface MentorInsight {
  category: 'structure' | 'engagement' | 'persuasion' | 'delivery';
  title: string;
  description: string;
  actionable: string[];
  examples: string[];
}

export default function AIMentor() {
  const [currentScript, setCurrentScript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mentorMode, setMentorMode] = useState<'revision' | 'coaching' | 'practice'>('revision');

  // Mock suggestions based on common speech improvement patterns
  const scriptSuggestions: ScriptSuggestion[] = [
    {
      type: 'improvement',
      section: 'Opening',
      original: 'Hello everyone, today I want to talk about...',
      suggested: 'Imagine walking into a room where every conversation stops because of what you just said. That\'s the power we\'re exploring today...',
      reasoning: 'Hook the audience immediately with intrigue rather than generic openings',
      impact: 'high'
    },
    {
      type: 'restructure',
      section: 'Main Body',
      original: 'First point, second point, third point...',
      suggested: 'Let me tell you about Sarah, a CEO who transformed her company using three simple principles...',
      reasoning: 'Story-driven structure creates emotional connection and better retention',
      impact: 'high'
    },
    {
      type: 'enhancement',
      section: 'Call to Action',
      original: 'So please consider what I\'ve said today',
      suggested: 'Your next conversation could change everything. Will you choose words that whisper or words that roar?',
      reasoning: 'Powerful metaphor with direct challenge creates memorable ending',
      impact: 'medium'
    }
  ];

  const mentorInsights: MentorInsight[] = [
    {
      category: 'structure',
      title: 'Narrative Arc Optimization',
      description: 'Your content shows potential for stronger storytelling flow',
      actionable: [
        'Build tension in your opening 30 seconds',
        'Use the "problem-agitation-solution" framework',
        'End each section with a transition hook'
      ],
      examples: [
        '"What if I told you that 80% of presentations fail in the first minute?"',
        '"Here\'s what most people get wrong about persuasion..."'
      ]
    },
    {
      category: 'engagement',
      title: 'Audience Interaction Enhancement',
      description: 'Opportunities to increase audience participation and connection',
      actionable: [
        'Ask rhetorical questions every 2-3 minutes',
        'Use inclusive language ("we", "us", "together")',
        'Include pause points for reflection'
      ],
      examples: [
        '"How many of you have experienced this?"',
        '"Let\'s explore this together..."'
      ]
    },
    {
      category: 'persuasion',
      title: 'Influence Architecture',
      description: 'Strategic placement of persuasive elements for maximum impact',
      actionable: [
        'Use social proof in supporting arguments',
        'Layer logical and emotional appeals',
        'Create urgency without pressure'
      ],
      examples: [
        '"Leading companies like Google and Apple use this exact approach"',
        '"The window for this opportunity closes tomorrow"'
      ]
    }
  ];

  const handleAnalyzeScript = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'structure': return <BookOpen className="w-4 h-4" />;
      case 'engagement': return <Users className="w-4 h-4" />;
      case 'persuasion': return <Target className="w-4 h-4" />;
      case 'delivery': return <MessageSquare className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Mentor Header */}
      <Card className="gradient-card border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="gradient-text font-heading text-xl">AI Speech Mentor</span>
              <p className="text-sm text-gray-600 font-normal">Transform your script with expert-level coaching</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Mentor Mode Selection */}
      <Tabs value={mentorMode} onValueChange={(value: any) => setMentorMode(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revision" className="flex items-center space-x-2">
            <Edit3 className="w-4 h-4" />
            <span>Script Revision</span>
          </TabsTrigger>
          <TabsTrigger value="coaching" className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Strategic Coaching</span>
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Practice Drills</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revision" className="space-y-6">
          {/* Script Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5" />
                <span>Script Analysis & Revision</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your script here for AI-powered analysis and improvement suggestions..."
                value={currentScript}
                onChange={(e) => setCurrentScript(e.target.value)}
                className="min-h-32"
              />
              <Button 
                onClick={handleAnalyzeScript}
                disabled={!currentScript.trim() || isAnalyzing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Script...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Get AI Suggestions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Script Suggestions */}
          {currentScript.trim() && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>AI Improvement Suggestions</span>
              </h3>
              
              {scriptSuggestions.map((suggestion, index) => (
                <Card key={index} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`${getImpactColor(suggestion.impact)}`}>
                          {suggestion.impact} impact
                        </Badge>
                        <Badge variant="secondary">{suggestion.section}</Badge>
                      </div>
                      <Badge variant="outline" className="text-purple-700 border-purple-300">
                        {suggestion.type}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm font-medium text-red-800 mb-1">Current:</p>
                        <p className="text-sm text-red-700 italic">"{suggestion.original}"</p>
                      </div>
                      
                      <ArrowRight className="w-4 h-4 text-gray-400 mx-auto" />
                      
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-800 mb-1">Suggested:</p>
                        <p className="text-sm text-green-700 font-medium">"{suggestion.suggested}"</p>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-1">Why this works:</p>
                        <p className="text-sm text-blue-700">{suggestion.reasoning}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Apply Suggestion
                      </Button>
                      <Button size="sm" variant="ghost">
                        Alternative Options
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="coaching" className="space-y-6">
          <div className="grid gap-4">
            {mentorInsights.map((insight, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-semibold text-lg">{insight.title}</h4>
                        <p className="text-gray-600">{insight.description}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Action Steps:</h5>
                        <ul className="space-y-1">
                          {insight.actionable.map((action, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Examples:</h5>
                        {insight.examples.map((example, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded text-sm italic mb-1">
                            "{example}"
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Personalized Practice Drills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Opening Power Drill</h4>
                  <p className="text-sm text-gray-600 mb-3">Practice creating compelling openings that grab attention immediately</p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Start Drill
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Transition Mastery</h4>
                  <p className="text-sm text-gray-600 mb-3">Smooth transitions that keep your audience engaged throughout</p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Start Drill
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Persuasion Architecture</h4>
                  <p className="text-sm text-gray-600 mb-3">Build compelling arguments that influence and inspire action</p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Start Drill
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}