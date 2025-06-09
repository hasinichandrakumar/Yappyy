import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import yapUpLogo from "@assets/YapUp-2_1749483329460.png";
import { 
  Mic, 
  Brain, 
  Eye, 
  TrendingUp, 
  Users, 
  Zap, 
  CheckCircle, 
  Play,
  Star,
  Award,
  Target,
  ArrowRight
} from "lucide-react";

export default function Landing() {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src={yapUpLogo}
                alt="YapUp Logo"
                className="w-10 h-10 rounded-lg"
              />
              <h1 className="text-xl font-semibold text-gray-900">YapUp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleGoogleLogin}>
                Sign In
              </Button>
              <Button onClick={handleGoogleLogin} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img
                src={yapUpLogo}
                alt="YapUp Logo"
                className="w-32 h-32 rounded-2xl shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Your 
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> Voice</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your public speaking with AI-powered coaching, real-time feedback, 
              and advanced speech analysis. Build confidence that opens doors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={handleGoogleLogin}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-4 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Free Practice Session
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-gray-500 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>Industry Leading</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced AI Coaching Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade analysis that gives you the edge in presentations, meetings, and public speaking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Feedback",
                description: "Get instant, personalized coaching suggestions based on your speaking patterns and body language",
                color: "blue"
              },
              {
                icon: Eye,
                title: "Eye Contact Analysis",
                description: "Advanced facial recognition tracks your gaze direction and provides real-time eye contact feedback",
                color: "cyan"
              },
              {
                icon: Mic,
                title: "Voice Analysis",
                description: "Analyze pace, clarity, confidence, and vocal variety with professional-grade audio processing",
                color: "purple"
              },
              {
                icon: Target,
                title: "Posture Tracking",
                description: "Computer vision technology monitors your posture and body language for maximum presence",
                color: "green"
              },
              {
                icon: TrendingUp,
                title: "Progress Analytics",
                description: "Track your improvement over time with detailed metrics and performance insights",
                color: "orange"
              },
              {
                icon: Zap,
                title: "Real-Time Coaching",
                description: "Live feedback during practice sessions helps you improve immediately, not after",
                color: "red"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Top Professionals Choose YapUp
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Build the communication skills that accelerate your career and boost your confidence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                "85% increase in presentation confidence within 30 days",
                "Real-time feedback prevents bad habits from forming",
                "Practice anytime, anywhere with immediate AI coaching",
                "Track measurable improvement with detailed analytics",
                "Professional-grade technology used by Fortune 500 companies"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-cyan-300 mt-0.5 flex-shrink-0" />
                  <span className="text-white text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Start Your Free Trial</h3>
                <p className="text-blue-100 mb-6">
                  No credit card required. Full access to all features for 14 days.
                </p>
                <Button 
                  size="lg" 
                  onClick={handleGoogleLogin}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg w-full"
                >
                  Continue with Google
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-xs text-blue-200 mt-3">
                  Trusted by 10,000+ professionals worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img
              src={yapUpLogo}
              alt="YapUp Logo"
              className="w-16 h-16 mx-auto mb-4 rounded-lg"
            />
            <p className="text-gray-400 mb-4">
              Empowering speakers worldwide with AI-powered coaching technology
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Contact</a>
              <a href="#" className="hover:text-white">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}