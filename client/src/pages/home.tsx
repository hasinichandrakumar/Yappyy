import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Video, Trophy, Target, BarChart3, Users, ArrowRight, CheckCircle } from 'lucide-react';
import yappyyLogoPath from '@assets/yappyy-logo.svg';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={yappyyLogoPath} alt="Yappyy" className="h-8" />
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 hover:from-blue-700 hover:via-cyan-700 hover:to-sky-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 mb-6">
              Master Your Voice
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
              AI-powered speech coaching that transforms your communication skills through real-time feedback and personalized training
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 hover:from-blue-700 hover:via-cyan-700 hover:to-sky-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4">
                  Start Practicing Now
                  <Mic className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4">
                Watch Demo
                <Video className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Everything You Need to Become a
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600"> Confident Speaker</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered platform provides comprehensive speech training with real-time feedback and detailed analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="p-6 bg-white border border-blue-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Real-Time Voice Analysis</h3>
              <p className="text-slate-600">
                Get instant feedback on pace, volume, clarity, and filler words as you speak. Our AI analyzes your speech patterns in real-time.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 bg-white border border-blue-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Body Language Tracking</h3>
              <p className="text-slate-600">
                Monitor eye contact, posture, and gestures with computer vision technology that helps you develop confident presence.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 bg-white border border-blue-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Detailed Analytics</h3>
              <p className="text-slate-600">
                Comprehensive reports with insights, progress tracking, and personalized recommendations for continuous improvement.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 bg-white border border-blue-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Purpose-Driven Practice</h3>
              <p className="text-slate-600">
                Tailored coaching for interviews, presentations, pitches, and more. Practice with scenarios that match your goals.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 bg-white border border-blue-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Achievement System</h3>
              <p className="text-slate-600">
                Earn badges and track milestones as you improve. Stay motivated with gamified progress tracking.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 bg-white border border-blue-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">AI Speech Coach</h3>
              <p className="text-slate-600">
                Your personal AI coach provides encouragement, tracks your progress, and offers personalized guidance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-6">
                Why Choose
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600"> Yappyy?</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Instant Improvement</h3>
                    <p className="text-slate-600">See immediate results with real-time feedback and adaptive coaching</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Personalized Learning</h3>
                    <p className="text-slate-600">AI adapts to your unique speaking style and learning pace</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Comprehensive Training</h3>
                    <p className="text-slate-600">Cover all aspects: voice, content, body language, and confidence</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Practice Anywhere</h3>
                    <p className="text-slate-600">No scheduling required - practice whenever and wherever you want</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-sky-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Speaking?</h3>
                <p className="mb-6 opacity-90">
                  Join thousands of users who have already improved their communication skills with Yappyy's AI-powered coaching platform.
                </p>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img src={yappyyLogoPath} alt="Yappyy" className="h-8 mx-auto mb-4 filter brightness-0 invert" />
            <p className="text-slate-400">
              © 2024 Yappyy. Empowering confident communication through AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}