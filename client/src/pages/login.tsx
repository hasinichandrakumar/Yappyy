import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MicOff, 
  Chrome, 
  Sparkles, 
  Users, 
  BarChart3, 
  Brain,
  Star,
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0BF9EA] to-blue-600 rounded-lg flex items-center justify-center">
                <MicOff className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">YapUp</h1>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Login */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Master Your
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}Speaking Skills
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                AI-powered public speaking coach with real-time feedback, advanced analytics, and personalized improvement plans.
              </p>
            </div>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Get Started Today</CardTitle>
                <p className="text-gray-600">Join thousands improving their communication skills</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button 
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 h-12 text-lg font-medium shadow-sm"
                >
                  <Chrome className="w-5 h-5 mr-3" />
                  {isLoading ? "Connecting..." : "Continue with Google"}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>Secure authentication • No credit card required</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What you'll get:</h4>
                  <div className="space-y-2">
                    {[
                      "Real-time speech analysis and feedback",
                      "AI-powered coaching recommendations", 
                      "Professional presentation templates",
                      "Advanced performance analytics",
                      "Career impact measurements"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Features showcase */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">AI Speech Coach</h3>
                    <p className="text-purple-100">Personalized feedback in real-time</p>
                  </div>
                </div>
                <p className="text-white/90">
                  Advanced AI analyzes your speech patterns, body language, and delivery to provide instant coaching insights.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-teal-600 text-white">
                <CardContent className="p-4">
                  <BarChart3 className="w-8 h-8 mb-3" />
                  <h4 className="font-semibold mb-2">Performance Analytics</h4>
                  <p className="text-sm text-green-100">
                    Track improvement with detailed metrics and ROI analysis
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <CardContent className="p-4">
                  <Users className="w-8 h-8 mb-3" />
                  <h4 className="font-semibold mb-2">Audience Insights</h4>
                  <p className="text-sm text-orange-100">
                    Understand how different audiences respond to your style
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Star className="w-6 h-6" />
                    <span className="font-semibold">Speech DNA Analysis</span>
                  </div>
                  <Badge className="bg-white/20 text-white">
                    15 Archetypes
                  </Badge>
                </div>
                <p className="text-amber-100 mb-4">
                  Discover your unique speaking style with our comprehensive archetype analysis featuring 15 distinct communication profiles.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <Play className="w-4 h-4" />
                  <span>Try it now after signing in</span>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-gray-600">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Join 10,000+ professionals improving their communication</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Speaking?</h2>
              <p className="text-xl text-purple-100 mb-6">
                Get instant access to AI-powered coaching, advanced analytics, and personalized improvement plans.
              </p>
              <Button 
                onClick={handleLogin}
                disabled={isLoading}
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Sign In with Google
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}