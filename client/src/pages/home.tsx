import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  Brain, 
  Eye,
  Volume2,
  BarChart3,
  Sparkles,
  PlayCircle, 
  Award,
  Users
} from "lucide-react";
import yapUpLogo from "@assets/YapUp-2_1749483329460.png";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  const handleStartPracticing = () => {
    window.location.href = "/api/auth/google";
  };

  const coreFeatures = [
    {
      icon: Brain,
      title: "AI Speech Analysis",
      description: "Real-time feedback on clarity, pace, and confidence"
    },
    {
      icon: Eye,
      title: "Body Language AI",
      description: "Posture, gestures, and eye contact tracking"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Detailed progress tracking and insights"
    }
  ];

  const speechTypes = [
    "School Presentations", "TED Talks", "Business Pitches", "Conference Talks",
    "Wedding Speeches", "Job Interviews", "Sales Presentations", "Training Sessions"
  ];

  return (
    <div className="min-h-screen gradient-bg-light">
      {/* Navigation */}
      <nav className="gradient-card backdrop-blur-md shadow-lg purple-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src={yapUpLogo} alt="YapUp Logo" className="w-10 h-10 rounded-xl" />
              <h1 className="text-xl font-bold yapup-gradient">YapUp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleStartPracticing}>Sign In</Button>
              <Button className="gradient-bg text-white" onClick={handleStartPracticing}>
                Start Practicing
                <PlayCircle className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-cyan-500/10 text-cyan-600 border-cyan-500/20 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by GPT-4 Turbo & MediaPipe Neural Networks
          </Badge>
          
          <h1 className="mb-8 tracking-tight text-balance">
            <span className="block hero-title floating-text yapup-gradient">YapUp</span>
            <span className="hero-subtitle block mt-6">
              Master Your <span className="highlight-word">Public Speaking</span>
            </span>
          </h1>
          
          <p className="creative-text mb-8 max-w-3xl mx-auto text-balance">
            Transform your presentation skills with <span className="highlight-word">AI-powered</span> real-time feedback, 
            intelligent coaching, and personalized improvement plans.
          </p>
          
          <div className="mb-12 p-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-[#0BF9EA]/20 max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-8 mb-4">
              {[
                { value: "55%", label: "Body Language" },
                { value: "38%", label: "Tone of Voice" },
                { value: "7%", label: "Words" }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-display gradient-text mb-1">{stat.value}</div>
                  <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#0BF9EA]/20 pt-6">
              <h2 className="text-4xl md:text-5xl font-display gradient-text tracking-tight">
                We coach 100% of you.
              </h2>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="gradient-bg text-white shadow-xl px-8 py-4 text-lg font-semibold mb-16"
            onClick={handleStartPracticing}
          >
            Start Your Free Session
            <PlayCircle className="w-5 h-5 ml-3" />
          </Button>

          {/* Core Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#0BF9EA] to-blue-600 rounded-full flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking Scenarios */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="feature-title mb-4">
              Perfect for Every <span className="highlight-word">Speaking Situation</span>
            </h2>
            <p className="creative-text max-w-3xl mx-auto">
              Get specialized feedback for any presentation or speech scenario.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {speechTypes.map((type, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 border-gray-100 hover:border-[#0BF9EA]/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-[#0BF9EA]/10 group-hover:to-blue-100 rounded-full flex items-center justify-center transition-all duration-300">
                    <Users className="w-6 h-6 text-gray-600 group-hover:text-[#0BF9EA]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{type}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Award className="w-16 h-16 mx-auto mb-8 text-white/80" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your <span className="bg-white/20 px-3 py-1 rounded-lg">Speaking Skills</span>?
          </h2>
          <p className="text-xl text-white/90 mb-12">
            Join thousands of speakers improving with our AI-powered coaching platform.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl px-12 py-4 text-lg font-semibold"
            onClick={handleStartPracticing}
          >
            Start Your Journey
            <PlayCircle className="w-5 h-5 ml-3" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src={yapUpLogo} alt="YapUp Logo" className="w-16 h-16 mx-auto mb-6 rounded-lg" />
          <p className="text-gray-400 mb-6">
            Empowering speakers worldwide with AI-powered coaching.
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