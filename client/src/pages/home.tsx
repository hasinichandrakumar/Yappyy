import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Mic, Video, Trophy, Target, BarChart3, Users, ArrowRight, CheckCircle, Brain, Zap, Cpu, Eye, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import yappyyLogoPath from '@assets/Y-2-removebg-preview_1753384287580.png';

export default function HomePage() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  
  // Check for OAuth errors in URL params
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const errorDetails = urlParams.get('details');
  const callbackUrl = urlParams.get('callback_url');
  
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const names = name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length-1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase();
    }
    return email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* OAuth Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error === 'redirect_mismatch' ? 'Google OAuth Setup Required' : 'Sign-in was cancelled'}
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error === 'redirect_mismatch' ? (
                  <div>
                    <p className="font-medium mb-2">The Replit callback URL needs to be added to Google Cloud Console:</p>
                    <div className="bg-gray-100 p-2 rounded font-mono text-xs break-all">
                      {callbackUrl}
                    </div>
                    <p className="mt-2">
                      1. Go to Google Cloud Console → APIs & Credentials
                      <br />
                      2. Edit your OAuth 2.0 Client ID: 372720245891-dtpkbj63rl2hju5vo2uorldivgurg6fh
                      <br />
                      3. Add the URL above to "Authorized redirect URIs"
                      <br />
                      4. Save and try signing in again
                    </p>
                  </div>
                ) : (
                  <p>
                    {errorDetails === 'The user did not consent' 
                      ? 'You cancelled the Google sign-in process. To access your dashboard, please try signing in again and click "Allow" when Google asks for permissions.'
                      : `Sign-in failed: ${errorDetails || error}`
                    }
                  </p>
                )}
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <Button
                    onClick={() => {
                      // Clear error params and retry
                      window.history.replaceState({}, '', window.location.pathname);
                      window.location.href = '/api/login';
                    }}
                    size="sm"
                    className="bg-red-100 text-red-800 hover:bg-red-200"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => {
                      window.history.replaceState({}, '', window.location.pathname);
                      window.location.reload();
                    }}
                    variant="ghost"
                    size="sm"
                    className="ml-3 text-red-800 hover:bg-red-200"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={() => window.location.href = '/'} className="hover:opacity-80 transition-opacity">
                <img src={yappyyLogoPath} alt="Yappyy" className="h-8" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <Button
                  onClick={() => window.location.href = '/api/login'}
                  variant="outline" 
                  className="border-gray-300 hover:border-gray-400"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm">
                          {getInitials(user?.name, user?.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                          {getInitials(user?.name, user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-0.5 leading-none">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = 'https://yappyy.com/dashboard'}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <Button 
                className="bg-gradient-to-br from-[#2563eb] to-[#22d3ee] hover:from-[#1d4ed8] hover:to-[#06b6d4] text-white font-button shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  if (isAuthenticated) {
                    window.location.href = 'https://yappyy.com/dashboard';
                  } else {
                    window.location.href = '/api/login';
                  }
                }}
              >
                {isAuthenticated ? 'Dashboard' : 'Get Started'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 animate-gradient-x">
        {/* Floating Background Bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-12 h-12 bg-white/10 rounded-full opacity-30"></div>
          <div className="absolute top-32 right-16 w-8 h-8 bg-white/10 rounded-full opacity-40"></div>
          <div className="absolute top-48 left-1/4 w-6 h-6 bg-white/10 rounded-full opacity-50"></div>
          <div className="absolute bottom-32 right-20 w-10 h-10 bg-white/10 rounded-full opacity-35"></div>
          <div className="absolute bottom-48 left-20 w-4 h-4 bg-white/10 rounded-full opacity-60"></div>
          <div className="absolute top-1/2 right-1/3 w-14 h-14 bg-white/10 rounded-full opacity-25"></div>
          <div className="absolute bottom-20 left-1/3 w-7 h-7 bg-white/10 rounded-full opacity-45"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-display text-white mb-6 font-bold">
              Talk Smart.
              <br />
              Talk Yappyy.
            </h1>
            <p className="text-xl md:text-2xl font-body text-white/90 mb-8 max-w-3xl mx-auto">
              AI-powered speech coaching that transforms your communication skills through real-time feedback and personalized training
            </p>
            <div className="flex justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-white hover:bg-gray-50 font-button shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 border-0"
                onClick={() => {
                  if (isAuthenticated) {
                    window.location.href = '/dashboard';
                  } else {
                    window.location.href = '/api/login';
                  }
                }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent font-bold animate-gradient-x">
                  Start Practicing Now
                </span>
                <Mic className="ml-2 h-5 w-5 text-blue-600" />
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
                
                {/* Bubble decorations around the circle */}
                <div className="absolute -top-6 left-1/4 w-8 h-8 bubble-decoration opacity-70"></div>
                <div className="absolute -bottom-4 right-1/4 w-6 h-6 bubble-decoration opacity-60"></div>
                <div className="absolute top-1/3 -left-8 w-5 h-5 bubble-decoration opacity-50"></div>
                <div className="absolute bottom-1/3 -right-6 w-4 h-4 bubble-decoration opacity-65"></div>
                <div className="absolute -top-2 right-1/3 w-3 h-3 bubble-decoration opacity-55"></div>
                <div className="absolute top-1/2 -right-10 w-7 h-7 bubble-decoration opacity-45"></div>
                <div className="absolute bottom-1/4 -left-10 w-9 h-9 bubble-decoration opacity-40"></div>
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

      {/* Deep Learning Technology Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-16 h-16 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-purple-200">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Revolutionary AI Technology</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Powered by
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600"> Deep Learning Neural Networks</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Experience the most advanced AI speech coaching technology with multi-modal processing, transformer models, and real-time neural analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Neural Network Architecture */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 text-center">Multi-Layer Neural Networks</h3>
              <p className="text-slate-600 text-sm text-center">
                8 attention heads, 256-dimensional transformer models with LSTM networks for personalized learning
              </p>
            </Card>

            {/* Real-Time Processing */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 text-center">Sub-100ms Processing</h3>
              <p className="text-slate-600 text-sm text-center">
                Lightning-fast analysis with multi-layer caching and parallel processing for instant feedback
              </p>
            </Card>

            {/* Dual AI Models */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-cyan-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Cpu className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 text-center">Dual AI Engine</h3>
              <p className="text-slate-600 text-sm text-center">
                OpenAI GPT-4o + Anthropic Claude Sonnet 4 for cross-validation and maximum accuracy
              </p>
            </Card>

            {/* Advanced Analytics */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Eye className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 text-center">Advanced Voice Analytics</h3>
              <p className="text-slate-600 text-sm text-center">
                40+ filler word patterns, spectral analysis, and prosodic feature extraction
              </p>
            </Card>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-purple-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Enterprise-Grade AI Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">256D</div>
                <div className="text-sm font-semibold text-slate-700 mb-1">Transformer Model</div>
                <div className="text-xs text-slate-600">Multi-head attention with 8 attention heads for pattern recognition</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">64U</div>
                <div className="text-sm font-semibold text-slate-700 mb-1">LSTM Networks</div>
                <div className="text-xs text-slate-600">Sequential learning for personality analysis and behavioral patterns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-2">128F</div>
                <div className="text-sm font-semibold text-slate-700 mb-1">CNN Filters</div>
                <div className="text-xs text-slate-600">Convolutional networks for advanced voice pattern recognition</div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">Neural Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">Real-Time Adaptation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">Continuous Learning</span>
                </div>
              </div>
            </div>
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
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Yappyy
                </span>
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

      {/* Yappyy's Vision Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-16 h-16 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-slate-600 mb-4">Yappyy's Vision</h3>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8 leading-tight">
              Every Person Has a Voice That 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600"> Deserves to Be Heard</span>
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-blue-200">
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                <p className="text-xl md:text-2xl font-medium text-slate-800">
                  Our AI coach isn't just about giving speeches — it's about giving everyone the courage to stand up, speak out, and share their ideas with the world.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                  <div className="text-left">
                    <p className="mb-4">
                      When people learn to speak with confidence, they feel seen and valued. They discover that their words can spark change in their workplaces, their communities, and beyond.
                    </p>
                    <p>
                      They learn that they can inspire others, stand up for what's right, and make a real difference — no matter how small they start.
                    </p>
                  </div>
                  
                  <div className="text-left">
                    <p className="mb-4">
                      Most importantly, confident communication gives everyone the wings to follow their dreams. It opens doors to new opportunities and helps them believe in themselves, even when no one else does.
                    </p>
                    <p>
                      💙 Our AI coach is here to be that quiet cheerleader in your pocket — helping you practice, grow, and shine, one word at a time.
                    </p>
                  </div>
                </div>
                
                <div className="mt-10 p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
                  <p className="text-xl font-semibold text-slate-800 mb-2">
                    Because every person deserves to feel heard.
                  </p>
                  <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                    Every person deserves to know that their voice can change the world.
                  </p>
                </div>
              </div>
              
              <div className="mt-10">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4">
                      Find Your Voice
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => window.location.href = '/api/auth/google'}
                    className="bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4"
                  >
                    Start Building Confidence Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
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