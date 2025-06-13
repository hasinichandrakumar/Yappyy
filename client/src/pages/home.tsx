import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Video, Trophy, Target, BarChart3, Users, ArrowRight, CheckCircle } from 'lucide-react';
import yappyyLogoPath from '@assets/Untitled_design-11600-removebg-preview_1749744306540.png';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={yappyyLogoPath} alt="Yappyy" className="h-8" />
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-br from-[#2563eb] to-[#22d3ee] hover:from-[#1d4ed8] hover:to-[#06b6d4] text-white font-button shadow-lg hover:shadow-xl transition-all duration-300">
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
            <h1 className="text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-br from-[#2563eb] to-[#22d3ee] mb-6">
              Future Talks Here
            </h1>
            <p className="text-xl md:text-2xl font-body text-slate-600 mb-8 max-w-3xl mx-auto">
              AI-powered speech coaching that transforms your communication skills through real-time feedback and personalized training
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-br from-[#2563eb] to-[#22d3ee] hover:from-[#1d4ed8] hover:to-[#06b6d4] text-white font-button shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4">
                  Start Practicing Now
                  <Mic className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-blue-300 text-blue-700 hover:bg-blue-50 font-button px-8 py-4">
                Watch Demo
                <Video className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7-38-55 Rule Statistics Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-gray-900 mb-4">
              Why Communication is More Than Just Words
            </h2>
            <p className="text-lg font-body text-gray-600 max-w-3xl mx-auto">
              Research shows that effective communication involves much more than what you say. 
              The 7-38-55 rule reveals the true breakdown of how people perceive your message.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Words - 7% */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-6xl font-bold bg-gradient-to-br from-[#2563eb] to-[#22d3ee] bg-clip-text text-transparent mb-4">
                7%
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Spoken Words</h3>
              <p className="text-gray-600">
                Only 7% of communication impact comes from the actual words you speak
              </p>
            </div>

            {/* Tone - 38% */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-6xl font-bold bg-gradient-to-br from-[#2563eb] to-[#22d3ee] bg-clip-text text-transparent mb-4">
                38%
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tone of Voice</h3>
              <p className="text-gray-600">
                38% comes from your vocal delivery, pace, volume, and inflection
              </p>
            </div>

            {/* Body Language - 55% */}
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-6xl font-bold bg-gradient-to-br from-[#2563eb] to-[#22d3ee] bg-clip-text text-transparent mb-4">
                55%
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Body Language</h3>
              <p className="text-gray-600">
                55% of your message impact comes from posture, gestures, and eye contact
              </p>
            </div>
          </div>

          <div className="mt-16">
            {/* Central 100% Statistic */}
            <div className="text-center">
              <div className="inline-block relative">
                <div className="bg-white p-16 rounded-full shadow-2xl border-4 border-blue-100 relative overflow-hidden">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-700 mb-2">
                      We coach
                    </p>
                    <div className="relative">
                      <div className="text-7xl md:text-8xl font-black bg-gradient-to-br from-[#2563eb] to-[#22d3ee] bg-clip-text text-transparent leading-none tracking-tighter">
                        100%
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-2">
                      of you
                    </p>
                  </div>
                </div>
                
                {/* Floating elements around the circle */}
                <div className="absolute -top-6 left-1/4 w-8 h-8 bg-gradient-to-br from-[#1e40af] to-[#0ea5e9] rounded-lg rotate-12 opacity-80 animate-float"></div>
                <div className="absolute -bottom-4 right-1/4 w-6 h-6 bg-gradient-to-br from-[#1e40af] to-[#0ea5e9] rounded-full opacity-80 animate-float-delayed"></div>
                <div className="absolute top-1/3 -right-8 w-4 h-8 bg-gradient-to-br from-[#1e40af] to-[#0ea5e9] rounded-full rotate-45 opacity-80 animate-float"></div>
                <div className="absolute bottom-1/3 -left-6 w-10 h-4 bg-gradient-to-br from-[#1e40af] to-[#0ea5e9] rounded-full -rotate-12 opacity-80 animate-float-delayed"></div>
              </div>
              
              <p className="text-lg font-semibold text-gray-600 mt-8 max-w-md mx-auto">
                Complete communication coaching across all aspects of your speaking skills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
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
              <h2 className="text-4xl font-heading text-slate-800 mb-6 flex items-center gap-3 flex-wrap">
                Why Choose
                <img src={yappyyLogoPath} alt="Yappyy" className="h-14" />
                ?
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
                  Experience personalized AI coaching that adapts to your unique speaking style and helps you build confidence in every conversation.
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
            <p className="text-slate-400 flex items-center justify-center gap-2 flex-wrap">
              © 2024 
              <img src={yappyyLogoPath} alt="Yappyy" className="h-5 inline filter brightness-0 invert" />
              . Empowering confident communication through AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}