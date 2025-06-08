import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, 
  Play, 
  Eye, 
  Volume2, 
  Timer, 
  Target, 
  Brain, 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Trophy, 
  Users, 
  MessageCircle, 
  Zap, 
  ChevronDown, 
  ChevronRight,
  Camera,
  Mic,
  Activity,
  Award,
  Lightbulb,
  Settings,
  BookOpen
} from "lucide-react";

interface GuideSection {
  title: string;
  icon: React.ReactNode;
  content: string;
  steps?: string[];
  tips?: string[];
}

interface FeatureGuide {
  category: string;
  sections: GuideSection[];
}

export default function HelpGuide() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSection(expandedSection === sectionTitle ? null : sectionTitle);
  };

  const featureGuides: FeatureGuide[] = [
    {
      category: "Getting Started",
      sections: [
        {
          title: "Your First Practice Session",
          icon: <Play className="w-5 h-5" />,
          content: "Start your speaking journey with YapUp's live practice sessions that provide real-time feedback on your performance.",
          steps: [
            "Click on the Overview tab to access the main dashboard",
            "Allow camera and microphone permissions when prompted",
            "Click the 'Start Recording' button to begin your session",
            "Speak naturally - the AI will analyze your performance in real-time",
            "Stop recording when finished to view detailed feedback"
          ],
          tips: [
            "Ensure good lighting for optimal body language analysis",
            "Speak in a quiet environment for accurate voice analysis",
            "Start with shorter sessions (2-3 minutes) to get comfortable"
          ]
        },
        {
          title: "Understanding Real-Time Metrics",
          icon: <Activity className="w-5 h-5" />,
          content: "Learn how to interpret the four core metrics displayed during your practice sessions.",
          steps: [
            "Eye Contact: Measures how consistently you look at the camera",
            "Voice Clarity: Analyzes your pronunciation and articulation",
            "Speaking Pace: Tracks your words per minute for optimal delivery",
            "Confidence Score: Evaluates your overall presence and energy"
          ],
          tips: [
            "Aim for 60-80% eye contact for natural engagement",
            "Maintain 140-180 WPM for ideal speaking pace",
            "Watch for real-time feedback indicators during practice"
          ]
        }
      ]
    },
    {
      category: "Advanced Features",
      sections: [
        {
          title: "Speech DNA Analysis",
          icon: <Brain className="w-5 h-5" />,
          content: "Discover your unique speaking style with comprehensive personality and communication pattern analysis.",
          steps: [
            "Complete multiple practice sessions for accurate profiling",
            "Navigate to the 'Speech DNA' tab",
            "Review your speaking personality traits",
            "Explore famous speaker comparisons and style recommendations",
            "Use insights to develop your authentic speaking voice"
          ],
          tips: [
            "Complete at least 5 sessions for reliable DNA analysis",
            "Try different topics to showcase speaking versatility",
            "Use persona challenges to expand your range"
          ]
        },
        {
          title: "Body Language Analysis",
          icon: <Eye className="w-5 h-5" />,
          content: "Advanced computer vision tracks your posture, gestures, and non-verbal communication in real-time.",
          steps: [
            "Position yourself clearly in the camera frame",
            "The system analyzes posture alignment and stability",
            "Gesture frequency and variety are tracked automatically",
            "Facial expressions and eye contact patterns are measured",
            "Receive detailed breakdowns in the analysis section"
          ],
          tips: [
            "Stand or sit with shoulders back for better posture scores",
            "Use natural hand gestures to enhance your message",
            "Practice different facial expressions for engagement"
          ]
        },
        {
          title: "ROI Analyzer & Persuasion Intelligence",
          icon: <TrendingUp className="w-5 h-5" />,
          content: "Measure the potential impact and persuasiveness of your speeches with advanced AI analysis.",
          steps: [
            "Record speeches with clear calls-to-action",
            "Access the ROI Analyzer from the advanced features",
            "Review persuasion metrics and emotional impact scores",
            "Analyze audience engagement predictions",
            "Implement suggested improvements for higher impact"
          ],
          tips: [
            "Include specific benefits and outcomes in your speech",
            "Use emotional storytelling for higher engagement scores",
            "Practice with different audience types for varied analysis"
          ]
        }
      ]
    },
    {
      category: "Content Creation",
      sections: [
        {
          title: "Template Marketplace",
          icon: <FileText className="w-5 h-5" />,
          content: "Access AI-powered speech templates for various occasions and automatically customize them for your needs.",
          steps: [
            "Browse templates by category (Business, Ceremonial, Educational)",
            "Select a template that matches your speaking occasion",
            "Fill in the customization fields with your specific details",
            "Use AI rewriting features for different tones and styles",
            "Generate multiple variations to find your perfect speech"
          ],
          tips: [
            "Customize templates thoroughly for authenticity",
            "Experiment with different tone settings",
            "Save successful templates for future reference"
          ]
        },
        {
          title: "Script Templates & Quick Start",
          icon: <BookOpen className="w-5 h-5" />,
          content: "Create structured speeches quickly with guided templates for common speaking scenarios.",
          steps: [
            "Choose from business pitches, presentations, or ceremonial speeches",
            "Fill in the prompted fields for personalization",
            "Review the generated structure and key points",
            "Practice with the template using live feedback",
            "Modify and iterate based on performance data"
          ],
          tips: [
            "Use templates as starting points, not final scripts",
            "Adapt language to match your natural speaking style",
            "Practice templates multiple times for confidence"
          ]
        }
      ]
    },
    {
      category: "Performance Tracking",
      sections: [
        {
          title: "Session History & Progress",
          icon: <BarChart3 className="w-5 h-5" />,
          content: "Track your improvement over time with detailed session analytics and progress visualization.",
          steps: [
            "View all past sessions in chronological order",
            "Compare performance metrics across sessions",
            "Identify improvement trends and areas needing work",
            "Set goals based on historical performance data",
            "Export session data for external analysis"
          ],
          tips: [
            "Practice regularly to see meaningful progress trends",
            "Focus on one skill at a time for targeted improvement",
            "Celebrate small wins to maintain motivation"
          ]
        },
        {
          title: "Badge System & Achievements",
          icon: <Trophy className="w-5 h-5" />,
          content: "Earn badges and achievements as you master different aspects of public speaking.",
          steps: [
            "Complete speaking challenges to unlock badges",
            "Track progress toward various achievement categories",
            "View badge criteria and completion requirements",
            "Share achievements to showcase your speaking journey",
            "Unlock premium features through badge completion"
          ],
          tips: [
            "Focus on consistent practice to earn time-based badges",
            "Challenge yourself with difficult topics for skill badges",
            "Join community challenges for social badges"
          ]
        },
        {
          title: "Adaptive Feedback Engine",
          icon: <Lightbulb className="w-5 h-5" />,
          content: "Receive personalized coaching recommendations that adapt to your learning style and progress.",
          steps: [
            "Complete initial assessment sessions for baseline",
            "Receive customized feedback based on your learning profile",
            "Follow progressive skill-building recommendations",
            "Track adaptive learning velocity and mastery",
            "Adjust feedback style preferences as needed"
          ],
          tips: [
            "Be honest in self-assessments for better recommendations",
            "Try different feedback styles to find what works",
            "Follow the progressive difficulty increases"
          ]
        }
      ]
    },
    {
      category: "Specialized Tools",
      sections: [
        {
          title: "Vibe Tracker & Emotional Intelligence",
          icon: <Zap className="w-5 h-5" />,
          content: "Monitor and improve your emotional resonance and audience connection during speeches.",
          steps: [
            "Access the Vibe Tracker from the advanced features tab",
            "Practice emotional delivery with different speech types",
            "Monitor real-time emotional impact scores",
            "Review detailed emotional intelligence breakdowns",
            "Use insights to enhance audience connection"
          ],
          tips: [
            "Practice expressing genuine emotions for authentic scores",
            "Vary your emotional range throughout longer speeches",
            "Match emotional intensity to your content and audience"
          ]
        },
        {
          title: "AI Practice Roleplay",
          icon: <Users className="w-5 h-5" />,
          content: "Practice with AI-powered audience simulations for different scenarios and personality types.",
          steps: [
            "Select an audience type (Corporate, Academic, Casual, etc.)",
            "Choose scenario difficulty and interaction level",
            "Engage with AI audience members who ask questions",
            "Receive feedback on audience engagement and responses",
            "Practice handling difficult questions and objections"
          ],
          tips: [
            "Start with friendly audiences before challenging ones",
            "Practice common objections in your field",
            "Use roleplay to prepare for specific upcoming presentations"
          ]
        },
        {
          title: "Speech Fingerprint Generator",
          icon: <Target className="w-5 h-5" />,
          content: "Generate a unique analysis of your speaking patterns, strengths, and signature traits.",
          steps: [
            "Complete multiple diverse speaking sessions",
            "Access the Speech Fingerprint from your profile",
            "Review your unique speaking characteristics",
            "Compare your fingerprint evolution over time",
            "Use insights for personal brand development"
          ],
          tips: [
            "Record speeches on various topics for comprehensive fingerprinting",
            "Update your fingerprint monthly to track changes",
            "Use fingerprint insights for professional development"
          ]
        }
      ]
    }
  ];

  const quickTips = [
    "Enable camera and microphone permissions for full functionality",
    "Practice in a well-lit, quiet environment for best results",
    "Start with 2-3 minute sessions and gradually increase duration",
    "Review session history regularly to track improvement",
    "Try different speech types to develop versatility",
    "Use templates as starting points, then personalize them",
    "Focus on one improvement area at a time",
    "Practice regularly - consistency beats intensity"
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">YapUp User Guide</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Master every feature of YapUp with this comprehensive guide. From basic practice sessions to advanced AI analysis.
        </p>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="features">📚 Feature Guide</TabsTrigger>
          <TabsTrigger value="quickstart">🚀 Quick Start</TabsTrigger>
          <TabsTrigger value="tips">💡 Pro Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          {featureGuides.map((guide, categoryIndex) => (
            <Card key={categoryIndex} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-xl text-gray-900">{guide.category}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {guide.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border-b border-gray-100 last:border-b-0">
                    <button
                      onClick={() => toggleSection(`${categoryIndex}-${sectionIndex}`)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {section.icon}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                        </div>
                        {expandedSection === `${categoryIndex}-${sectionIndex}` ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </button>
                    
                    {expandedSection === `${categoryIndex}-${sectionIndex}` && (
                      <div className="px-6 pb-6 space-y-4">
                        <p className="text-gray-700">{section.content}</p>
                        
                        {section.steps && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Steps:</h4>
                            <ol className="space-y-2">
                              {section.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start gap-3">
                                  <Badge variant="outline" className="mt-0.5 min-w-[24px] h-6 flex items-center justify-center">
                                    {stepIndex + 1}
                                  </Badge>
                                  <span className="text-gray-700">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                        
                        {section.tips && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Pro Tips:</h4>
                            <ul className="space-y-1">
                              {section.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="flex items-start gap-2 text-gray-700">
                                  <span className="text-blue-500 mt-1">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="quickstart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Quick Start Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">First Session Setup</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Camera className="w-5 h-5 text-blue-500" />
                      <span>Allow camera permissions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mic className="w-5 h-5 text-blue-500" />
                      <span>Allow microphone permissions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-blue-500" />
                      <span>Test your audio/video quality</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-blue-500" />
                      <span>Start with a 2-3 minute practice session</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Essential Features to Try</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-purple-500" />
                      <span>Real-time metrics feedback</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <span>Speech DNA analysis</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-500" />
                      <span>Practice with a template</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-purple-500" />
                      <span>Check your first badge progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Pro Tips for Maximum Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {quickTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}