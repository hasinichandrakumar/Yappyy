import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Mic, 
  Video, 
  Brain, 
  TrendingUp, 
  Users, 
  Award, 
  PlayCircle, 
  MessageCircle,
  Eye,
  Volume2,
  BarChart3,
  Sparkles,
  Bot,
  Zap,
  Waves,
  Target,
  Globe,
  Lightbulb,
  Settings,
  Shield
} from "lucide-react";

export default function Home() {
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth();

  const handleStartPracticing = () => {
    // Since we're in demo mode, always redirect to dashboard
    window.location.href = "/dashboard";
  };

  const advancedFeatures = [
    {
      icon: Brain,
      title: "Neural Speech Pattern Analysis",
      description: "Deep learning algorithms analyze pause patterns, intonation, articulation, and rhetorical device usage with 95% accuracy.",
      gradient: "from-purple-500 to-blue-600",
      details: ["Real-time vocal variety scoring", "Strategic pause effectiveness", "Consonant clarity assessment", "Emotional tone detection"]
    },
    {
      icon: Eye,
      title: "Computer Vision Body Language",
      description: "Advanced computer vision tracks 33 facial landmarks, 21 hand joints, and full-body posture for comprehensive presence analysis.",
      gradient: "from-blue-500 to-indigo-600",
      details: ["468 facial landmark tracking", "Hand gesture recognition", "Posture stability analysis", "Eye contact duration metrics"]
    },
    {
      icon: Bot,
      title: "Multi-Modal AI Coaching",
      description: "GPT-powered contextual coaching that adapts to speech purpose, audience, and individual speaking patterns in real-time.",
      gradient: "from-indigo-500 to-purple-600",
      details: ["Purpose-specific feedback", "Adaptive learning paths", "Personalized improvement plans", "Context-aware suggestions"]
    },
    {
      icon: Target,
      title: "Persuasiveness Intelligence",
      description: "AI analyzes argument structure, emotional appeal, credibility markers, and audience engagement to score persuasive impact.",
      gradient: "from-purple-600 to-blue-500",
      details: ["Rhetorical device detection", "Emotional intelligence scoring", "Credibility assessment", "Audience impact prediction"]
    }
  ];

  const speechTypes = [
    "School Presentations",
    "TED Talks", 
    "Business Pitches",
    "Conference Talks",
    "Wedding Speeches",
    "Job Interviews",
    "Sales Presentations",
    "Training Sessions"
  ];

  const metrics = [
    { icon: Eye, label: "Eye Contact", value: "Real-time tracking" },
    { icon: Volume2, label: "Voice Clarity", value: "AI-powered analysis" },
    { icon: TrendingUp, label: "Speaking Pace", value: "Optimal WPM guidance" },
    { icon: Brain, label: "Confidence Score", value: "Live assessment" }
  ];

  return (
    <div className="min-h-screen bg-black dark">
      {/* Navigation */}
      <nav className="bg-black/90 backdrop-blur-md shadow-lg border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center purple-glow">
                <Mic className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold yapup-gradient">
                YapUp
              </h1>
            </div>
            <Link href="/dashboard">
              <Button className="gradient-bg text-white hover:opacity-90 shadow-lg purple-glow">
                Start Practicing
                <PlayCircle className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by GPT-4 Turbo & MediaPipe Neural Networks
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-display text-white mb-8 tracking-tight text-balance">
            <span className="block yapup-gradient font-display">
              YapUp
            </span>
            <span className="text-4xl md:text-5xl block mt-4 gradient-text-secondary">
              Master Your Public Speaking
            </span>
          </h1>
          
          <p className="text-xl font-body text-gray-300 mb-8 max-w-3xl mx-auto text-balance">
            Transform your presentation skills with AI-powered real-time feedback, intelligent coaching, 
            and personalized improvement plans tailored to your speaking goals.
          </p>
          
          <div className="mb-12 p-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-200 max-w-3xl mx-auto purple-glow">
            <div className="text-center">
              <div className="grid grid-cols-3 gap-8 mb-4">
                <div>
                  <div className="text-3xl font-display gradient-text mb-1">55%</div>
                  <p className="text-sm font-medium text-gray-700">Body Language</p>
                </div>
                <div>
                  <div className="text-3xl font-display gradient-text mb-1">38%</div>
                  <p className="text-sm font-medium text-gray-700">Tone of Voice</p>
                </div>
                <div>
                  <div className="text-3xl font-display gradient-text mb-1">7%</div>
                  <p className="text-sm font-medium text-gray-700">Words</p>
                </div>
              </div>
              <div className="border-t border-purple-200 pt-6">
                <h2 className="text-4xl md:text-5xl font-display gradient-text tracking-tight">We coach 100% of you.</h2>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mb-16">
            <Link href="/dashboard">
              <Button size="lg" className="gradient-bg text-white hover:opacity-90 shadow-xl px-8 py-4 text-lg font-semibold tracking-wide purple-glow">
                Start Your Free Session
                <PlayCircle className="w-5 h-5 ml-3" />
              </Button>
            </Link>
          </div>

          {/* Real-time Metrics Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{metric.label}</h3>
                  <p className="text-sm text-gray-600">{metric.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced AI-Powered Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent coaching system provides comprehensive feedback across every aspect of your presentation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => (
              <Card 
                key={index}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl border-0 overflow-hidden ${
                  isHovered === feature.title ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setIsHovered(feature.title)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <CardContent className="p-8 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center text-sm text-gray-500">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                        {detail}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission/About Us Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 px-4 py-2">Our Mission</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Unlock Your True Potential Through Masterful Communication
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Public speaking is the ultimate multiplier of human influence. It shapes careers, builds movements, 
              and transforms ideas into reality. Yet for millions, fear and lack of skill in communication becomes 
              the invisible barrier that keeps their true potential locked away.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">The Hidden Cost of Poor Communication</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Studies show that 75% of people fear public speaking more than death itself. This fear doesn't just affect presentations—it limits career advancement, 
                    reduces leadership opportunities, and prevents brilliant ideas from reaching the world.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">The Power of Influential Speaking</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Great speakers don't just communicate—they inspire action, change minds, and create lasting impact. 
                    From boardroom presentations to wedding toasts, masterful communication opens doors that talent alone cannot.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Breaking Through the Barrier</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We believe every person has something valuable to share with the world. Our AI-powered platform doesn't just 
                    teach speaking skills—it systematically dismantles the barriers between your potential and your impact.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <Globe className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h4>
                </div>
                <blockquote className="text-lg text-gray-700 italic leading-relaxed text-center">
                  "A world where every person can confidently share their ideas, influence positive change, 
                  and unlock opportunities through the power of masterful communication."
                </blockquote>
                <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">10M+</div>
                    <div className="text-sm text-gray-600">Lives Transformed</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">95%</div>
                    <div className="text-sm text-gray-600">Confidence Boost</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speech Types Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tailored for Every Speaking Scenario
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get purpose-specific feedback and coaching for any type of presentation or speech.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {speechTypes.map((type, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-purple-100 rounded-full flex items-center justify-center transition-all duration-300">
                    <Users className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{type}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Award className="w-16 h-16 mx-auto mb-8 text-white/80" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Speaking Skills?
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Join thousands of speakers who have improved their presentation skills with our AI-powered coaching platform.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl px-12 py-4 text-lg font-semibold">
              Start Your Journey
              <PlayCircle className="w-5 h-5 ml-3" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Mic className="text-white w-4 h-4" />
            </div>
            <h3 className="text-xl font-bold yapup-gradient">YapUp</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering speakers worldwide with intelligent feedback and coaching.
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}