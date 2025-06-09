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
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="features">📚 Feature Guide</TabsTrigger>
          <TabsTrigger value="terminology">📖 Terminology</TabsTrigger>
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

        <TabsContent value="terminology" className="space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-green-600" />
                YapUp Terminology Guide
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Master the language of public speaking with our comprehensive terminology guide.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6">
                
                {/* Performance Metrics */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Performance Metrics</h3>
                  <div className="grid gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Voice Clarity Score</h4>
                      <p className="text-gray-700 text-sm">Measures pronunciation, articulation, and overall voice quality (0-100%). Higher scores indicate clearer, more professional vocal delivery.</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Speaking Pace (WPM)</h4>
                      <p className="text-gray-700 text-sm">Words Per Minute - measures speaking speed. Optimal range is 140-180 WPM for most presentations. Too fast appears nervous, too slow loses attention.</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Eye Contact Percentage</h4>
                      <p className="text-gray-700 text-sm">Percentage of time maintaining direct camera contact. Target 60-80% for natural engagement without appearing robotic.</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Confidence Score</h4>
                      <p className="text-gray-700 text-sm">Overall presence and energy assessment combining vocal strength, posture, and gesture confidence (0-100%).</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">Filler Words Count</h4>
                      <p className="text-gray-700 text-sm">Number of verbal fillers like "um," "uh," "like," "you know." Lower counts indicate more polished delivery.</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Persuasiveness Score</h4>
                      <p className="text-gray-700 text-sm">AI-calculated potential impact and persuasive power of your message based on structure, emotion, and delivery.</p>
                    </div>
                  </div>
                </div>

                {/* Body Language Analysis */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Body Language Analysis</h3>
                  <div className="grid gap-4">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">Posture Score</h4>
                      <p className="text-gray-700 text-sm">Evaluation of spine alignment, shoulder position, and overall stance stability. Good posture projects confidence and authority.</p>
                    </div>
                    <div className="p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-semibold text-teal-900 mb-2">Gesture Naturalness</h4>
                      <p className="text-gray-700 text-sm">Measures how natural and purposeful hand movements appear. Includes frequency, variety, and relevance to speech content.</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <h4 className="font-semibold text-pink-900 mb-2">Facial Expression Score</h4>
                      <p className="text-gray-700 text-sm">Analysis of facial engagement, micro-expressions, and emotional variety throughout presentation.</p>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded-lg">
                      <h4 className="font-semibold text-cyan-900 mb-2">Gesture Frequency</h4>
                      <p className="text-gray-700 text-sm">Rate of hand and arm movements per minute. Balanced frequency enhances message without distraction.</p>
                    </div>
                  </div>
                </div>

                {/* Speech Analysis Terms */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Speech Analysis</h3>
                  <div className="grid gap-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h4 className="font-semibold text-emerald-900 mb-2">Speech DNA</h4>
                      <p className="text-gray-700 text-sm">Unique speaking personality profile based on patterns, style preferences, and delivery characteristics across multiple sessions.</p>
                    </div>
                    <div className="p-4 bg-violet-50 rounded-lg">
                      <h4 className="font-semibold text-violet-900 mb-2">Pace Variation</h4>
                      <p className="text-gray-700 text-sm">How much speaking speed changes throughout presentation. Good variation (0.6-0.9) maintains audience interest.</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-semibold text-amber-900 mb-2">Intonation Range</h4>
                      <p className="text-gray-700 text-sm">Vocal pitch variety and melody patterns. Higher range (0.7-1.0) creates more engaging, expressive delivery.</p>
                    </div>
                    <div className="p-4 bg-lime-50 rounded-lg">
                      <h4 className="font-semibold text-lime-900 mb-2">Pause Effectiveness</h4>
                      <p className="text-gray-700 text-sm">Strategic use of silence for emphasis and audience processing. Effective pauses enhance message impact.</p>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-lg">
                      <h4 className="font-semibold text-rose-900 mb-2">Vocal Resonance</h4>
                      <p className="text-gray-700 text-sm">Depth and richness of voice projection. Better resonance commands attention and conveys authority.</p>
                    </div>
                  </div>
                </div>

                {/* Advanced Features */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Advanced Features</h3>
                  <div className="grid gap-4">
                    <div className="p-4 bg-sky-50 rounded-lg">
                      <h4 className="font-semibold text-sky-900 mb-2">ROI Analyzer</h4>
                      <p className="text-gray-700 text-sm">Return on Investment calculator predicting potential business impact and audience response to presentations.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-2">Vibe Tracker</h4>
                      <p className="text-gray-700 text-sm">Real-time emotional intelligence monitoring measuring audience connection and emotional resonance.</p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-lg">
                      <h4 className="font-semibold text-stone-900 mb-2">Adaptive Feedback Engine</h4>
                      <p className="text-gray-700 text-sm">AI system that personalizes coaching recommendations based on learning style, progress, and individual strengths/weaknesses.</p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-lg">
                      <h4 className="font-semibold text-neutral-900 mb-2">Speech Fingerprint</h4>
                      <p className="text-gray-700 text-sm">Unique digital signature of speaking patterns, traits, and characteristics that evolve over time with practice.</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-lg">
                      <h4 className="font-semibold text-zinc-900 mb-2">AI Practice Roleplay</h4>
                      <p className="text-gray-700 text-sm">Interactive simulation with AI audience members for practicing Q&A, handling objections, and audience engagement.</p>
                    </div>
                  </div>
                </div>

                {/* Content Analysis */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Content Analysis</h3>
                  <div className="grid gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Structure Quality</h4>
                      <p className="text-gray-700 text-sm">Assessment of introduction, body, conclusion organization and logical flow of ideas throughout presentation.</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Transition Effectiveness</h4>
                      <p className="text-gray-700 text-sm">How smoothly ideas connect and flow between sections. Good transitions guide audience through your message.</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Key Message Clarity</h4>
                      <p className="text-gray-700 text-sm">How clearly and memorably your main points are communicated. Clear messages stick with audiences.</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Call-to-Action Strength</h4>
                      <p className="text-gray-700 text-sm">Effectiveness of your audience request or desired action. Strong CTAs drive results and engagement.</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">Emotional Resonance</h4>
                      <p className="text-gray-700 text-sm">How well your content connects emotionally with audience. High resonance creates lasting impact.</p>
                    </div>
                  </div>
                </div>

                {/* Achievement System */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Achievement System</h3>
                  <div className="grid gap-4">
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">Badge Categories</h4>
                      <p className="text-gray-700 text-sm">Delivery (vocal skills), Content (message quality), Growth (improvement), Community (social features), Themed (special occasions).</p>
                    </div>
                    <div className="p-4 bg-teal-50 rounded-lg">
                      <h4 className="font-semibold text-teal-900 mb-2">Badge Rarity</h4>
                      <p className="text-gray-700 text-sm">Common (basic achievements), Rare (challenging goals), Epic (exceptional performance), Legendary (mastery level).</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <h4 className="font-semibold text-pink-900 mb-2">Learning Velocity</h4>
                      <p className="text-gray-700 text-sm">Rate of skill improvement over time. Higher velocity indicates faster mastery and more efficient practice.</p>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded-lg">
                      <h4 className="font-semibold text-cyan-900 mb-2">Mastery Level</h4>
                      <p className="text-gray-700 text-sm">Overall proficiency ranking across all speaking skills. Progresses from Beginner to Expert with consistent practice.</p>
                    </div>
                  </div>
                </div>

                {/* Technical Terms */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Technical Terms</h3>
                  <div className="grid gap-4">
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">MediaPipe Analysis</h4>
                      <p className="text-gray-700 text-sm">Google's computer vision framework used for real-time body language, facial expression, and gesture tracking.</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h4 className="font-semibold text-emerald-900 mb-2">Speech Recognition API</h4>
                      <p className="text-gray-700 text-sm">Browser technology that converts spoken words to text for real-time transcript generation and analysis.</p>
                    </div>
                    <div className="p-4 bg-violet-50 rounded-lg">
                      <h4 className="font-semibold text-violet-900 mb-2">Confidence Interval</h4>
                      <p className="text-gray-700 text-sm">Statistical range indicating reliability of speech recognition accuracy. Higher confidence means more accurate transcription.</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-semibold text-amber-900 mb-2">Landmark Detection</h4>
                      <p className="text-gray-700 text-sm">Identification of key facial and body points for measuring posture, expression, and movement patterns.</p>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
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