import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Sparkles
} from "lucide-react";

export default function Home() {
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const features = [
    {
      icon: Video,
      title: "Real-time Video Analysis",
      description: "AI-powered posture and gesture detection with live feedback on your body language and presence.",
      gradient: "from-purple-500 to-blue-600"
    },
    {
      icon: Mic,
      title: "Voice & Speech Analysis",
      description: "Advanced voice metrics including pace, clarity, confidence scoring, and filler word detection.",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: MessageCircle,
      title: "Intelligent Coaching Chat",
      description: "Purpose-driven AI coaching tailored to your speech type - from TED talks to business pitches.",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Detailed session tracking with improvement suggestions and historical progress monitoring.",
      gradient: "from-purple-600 to-blue-500"
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
    <div className="min-h-screen gradient-bg-light">
      {/* Navigation */}
      <nav className="gradient-card backdrop-blur-md shadow-lg purple-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center purple-glow">
                <Mic className="text-white w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold gradient-text">
                AI Speaking Coach
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
          <Badge className="mb-6 bg-purple-100 text-purple-800 border-purple-200 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by Advanced AI
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Master Your
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Public Speaking
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your presentation skills with AI-powered real-time feedback, intelligent coaching, 
            and personalized improvement plans tailored to your speaking goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-xl px-8 py-4 text-lg">
                Start Your Free Session
                <PlayCircle className="w-5 h-5 ml-3" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg">
              Watch Demo
              <Video className="w-5 h-5 ml-3" />
            </Button>
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
            {features.map((feature, index) => (
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
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
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
            <h3 className="text-xl font-bold">AI Speaking Coach</h3>
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