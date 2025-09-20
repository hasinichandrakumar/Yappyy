import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, BarChart3, Brain, FileText, Trophy, Target, User, Home, Settings, Shield, Star, BookOpen, PieChart, Users, School, TrendingUp, Calendar, Flame } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SimplifiedPracticePage from "@/components/SimplifiedPracticePage";
import AICoachRedesigned from "@/components/AICoachRedesigned";
import PersonalizedSpeechDNA from "@/components/PersonalizedSpeechDNA";
import EnhancedTemplateMarketplace from "@/components/EnhancedTemplateMarketplace";
import ImprovedBadgeSystem from "@/components/ImprovedBadgeSystem";
import EnhancedAnalysisWithTabs from "@/components/EnhancedAnalysisWithTabs";
import PerformanceSimple from "@/components/PerformanceSimple";
import DailyGoalWidget from "@/components/DailyGoalWidget";
import SimpleProfileForm from "@/components/SimpleProfileForm";
import AppSettings from "@/components/AppSettings";
import PrivacySettings from "@/components/PrivacySettings";
import StreamlinedProgressTab from "@/components/StreamlinedProgressTab";
import WelcomeMessage from "@/components/WelcomeMessage";
import ReturningUserWelcome from "@/components/ReturningUserWelcome";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { DailyGoalsDialog } from "@/components/DailyGoalsDialog";
import AICapabilitiesTest from "@/components/AICapabilitiesTest";
import MediaPipeTest from "@/components/MediaPipeTest";


import yappyyLogoPath from '@assets/Y-2-removebg-preview_1753384287580.png';

// Dashboard Performance Tab Component
function DashboardPerformanceTab() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [weeklyPractices, setWeeklyPractices] = useState(0);
  const [dailyPractices, setDailyPractices] = useState(0);

  useEffect(() => {
    // Load streak data from localStorage
    const storedStreak = localStorage.getItem('practiceStreak.current');
    if (storedStreak) {
      setCurrentStreak(parseInt(storedStreak));
    }

    // Calculate weekly and daily practices
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    // Mock data for now - in real app, fetch from API
    setWeeklyPractices(5);
    setDailyPractices(2);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Streak */}
        <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex items-center justify-between pb-0">
            <CardTitle className="text-base font-semibold tracking-tight text-gray-900">Current Streak</CardTitle>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-extrabold text-gray-900 leading-none">{currentStreak} days</div>
            <p className="mt-2 text-sm text-gray-500">Keep practicing daily to maintain your streak</p>
          </CardContent>
        </Card>

        {/* Weekly Practices */}
        <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex items-center justify-between pb-0">
            <CardTitle className="text-base font-semibold tracking-tight text-gray-900">Weekly Practices</CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-extrabold text-gray-900 leading-none">{weeklyPractices}</div>
            <p className="mt-2 text-sm text-gray-500">This week's practice sessions</p>
          </CardContent>
        </Card>

        {/* Daily Practices */}
        <Card className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex items-center justify-between pb-0">
            <CardTitle className="text-base font-semibold tracking-tight text-gray-900">Daily Practices</CardTitle>
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <Target className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-4xl font-extrabold text-gray-900 leading-none">{dailyPractices}</div>
            <p className="mt-2 text-sm text-gray-500">Today's practice sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Performance Analytics */}
      <div className="rounded-2xl border border-gray-100 shadow-sm">
        <PerformanceSimple />
      </div>
    </div>
  );
}

// Dashboard Classroom Tab Component
function DashboardClassroomTab({ classroomCode, setClassroomCode }: { 
  classroomCode: string; 
  setClassroomCode: (code: string) => void; 
}) {
  const [joinedClassrooms, setJoinedClassrooms] = useState<string[]>([]);

  const handleJoinClassroom = () => {
    if (classroomCode.trim()) {
      setJoinedClassrooms(prev => [...prev, classroomCode.trim()]);
      setClassroomCode("");
      // Here you would typically make an API call to join the classroom
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Join a Classroom
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Enter classroom code"
              value={classroomCode}
              onChange={(e) => setClassroomCode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleJoinClassroom} disabled={!classroomCode.trim()}>
              Join
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask your teacher for the classroom code to join and track your progress together.
          </p>
        </CardContent>
      </Card>

      {joinedClassrooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Classrooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {joinedClassrooms.map((code, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Classroom {code}</p>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("practice-alt");
  const [activeDashboardTab, setActiveDashboardTab] = useState("performance");
  const [classroomCode, setClassroomCode] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showReturningWelcome, setShowReturningWelcome] = useState(false);
  const { user } = useAuth();

  // Set document title
  useEffect(() => {
    document.title = "Dashboard | yappyy.com";
  }, []);

  const { logout } = useAuth();

  // Check if user needs onboarding dialogs based on new system
  useEffect(() => {
    if (user) {
      // Use the new onboarding system data from the backend
      const userData = user as any; // Cast to access backend properties
      if (userData.shouldShowWelcome) {
        setShowWelcome(true);
      } else if (userData.shouldShowDailyGoals) {
        // Only show daily goals if we haven't shown them today
        const todayKey = `dailyGoalsShown_${user.id}_${new Date().toDateString()}`;
        const hasSeenTodayGoals = localStorage.getItem(todayKey);
        
        if (!hasSeenTodayGoals) {
          setShowReturningWelcome(true);
          localStorage.setItem(todayKey, 'true');
        }
      }
    }
  }, [user]);

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handlePrivacyClick = () => {
    setShowPrivacy(true);
  };

  const getInitials = (name?: string, username?: string) => {
    if (name) {
      const names = name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length-1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase();
    }
    return username?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Professional Header with integrated navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Single-row header: logo (left) • nav (center) • profile (right) */}
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button onClick={() => window.location.href = '/'} className="hover:opacity-80 transition-opacity">
                <img src={yappyyLogoPath} alt="Yappyy" className="h-8" />
              </button>
            </div>

            {/* Center navigation - revert to text-only with gradient on active via group styles */}
            <div className="flex-1 flex items-center justify-center">
              <TabsList className="bg-transparent border-0 shadow-none p-0 h-auto flex items-center gap-16">
                <TabsTrigger value="practice-alt" className="px-5 py-3 rounded-full h-auto text-base font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm transition-colors data-[state=active]:bg-transparent data-[state=active]:hover:bg-gray-100/90 data-[state=active]:yappyy-gradient">
                  Practice
                </TabsTrigger>
                <TabsTrigger value="analysis" className="px-5 py-3 rounded-full h-auto text-base font-semibold tracking-wide text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm transition-colors data-[state=active]:bg-transparent data-[state=active]:hover:bg-gray-100/90 data-[state=active]:yappyy-gradient">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="ai-coach" className="px-5 py-3 rounded-full h-auto text-base font-semibold tracking-wide text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm transition-colors data-[state=active]:bg-transparent data-[state=active]:hover:bg-gray-100/90 data-[state=active]:yappyy-gradient">
                  AI Coach
                </TabsTrigger>
                <TabsTrigger value="templates" className="px-5 py-3 rounded-full h-auto text-base font-semibold tracking-wide text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm transition-colors data-[state=active]:bg-transparent data-[state=active]:hover:bg-gray-100/90 data-[state=active]:yappyy-gradient">
                  Templates
                </TabsTrigger>
                <TabsTrigger value="achievements" className="px-5 py-3 rounded-full h-auto text-base font-semibold tracking-wide text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm transition-colors data-[state=active]:bg-transparent data-[state=active]:hover:bg-gray-100/90 data-[state=active]:yappyy-gradient">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="ai-test" className="px-5 py-3 rounded-full h-auto text-base font-semibold tracking-wide text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm transition-colors data-[state=active]:bg-transparent data-[state=active]:hover:bg-gray-100/90 data-[state=active]:yappyy-gradient">
                  AI Test
                </TabsTrigger>
                <TabsTrigger value="mediapipe-test" className="px-5 py-3 rounded-full h-auto text-base font-semibold tracking-wide text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm transition-colors data-[state=active]:bg-transparent data-[state=active]:hover:bg-gray-100/90 data-[state=active]:yappyy-gradient">
                  MediaPipe Test
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Profile Section */}
            <div className="flex items-center space-x-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImageUrl} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                          {getInitials(user.name, user.username)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {user.name && (
                          <p className="font-medium">{user.name}</p>
                        )}
                        {user.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={handleSettingsClick}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={handlePrivacyClick}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Privacy</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600" onClick={logout}>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* (Nav moved into the single-row top bar above) */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* All tab content constrained to same width as navigation tabs */}
          <div className="w-full max-w-full">


            <TabsContent value="ai-coach" className="space-y-6">
              <AICoachRedesigned />
            </TabsContent>

            <TabsContent value="practice-alt" className="space-y-8 pb-16">
              <SimplifiedPracticePage />
            </TabsContent>



            <TabsContent value="templates" className="space-y-6">
              <EnhancedTemplateMarketplace />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <EnhancedAnalysisWithTabs />
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              {/* Dashboard Sub-Navigation */}
              <Tabs value={activeDashboardTab} onValueChange={setActiveDashboardTab} className="w-full">
                <div className="mb-6">
                  <TabsList className="bg-transparent border-0 shadow-none p-0 h-auto flex items-center gap-3">
                    <TabsTrigger 
                      value="performance" 
                      className="px-8 py-4 rounded-2xl h-auto text-base font-semibold border-0 transition-all duration-200 focus:outline-none bg-gray-100 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-lg"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Performance
                    </TabsTrigger>
                    <TabsTrigger 
                      value="classroom" 
                      className="px-8 py-4 rounded-2xl h-auto text-base font-semibold border-0 transition-all duration-200 focus:outline-none bg-gray-100 text-gray-700 hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-lg"
                    >
                      <School className="w-4 h-4 mr-2" />
                      Classroom
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="performance" className="space-y-6">
                  <DashboardPerformanceTab />
                </TabsContent>

                <TabsContent value="classroom" className="space-y-6">
                  <DashboardClassroomTab 
                    classroomCode={classroomCode}
                    setClassroomCode={setClassroomCode}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="ai-test" className="space-y-6">
              <AICapabilitiesTest />
            </TabsContent>

            <TabsContent value="mediapipe-test" className="space-y-6">
              <MediaPipeTest />
            </TabsContent>
          </div>

      </div>
      </Tabs>

      {/* Profile Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <SimpleProfileForm />
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AppSettings />
        </DialogContent>
      </Dialog>

      {/* Privacy Modal */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <PrivacySettings />
        </DialogContent>
      </Dialog>

      {/* New User Welcome Dialog */}
      <WelcomeDialog 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)}
        userName={(user as any)?.firstName || user?.name}
      />
      
      {/* Returning User Daily Goals Dialog */}
      <DailyGoalsDialog 
        isOpen={showReturningWelcome} 
        onClose={() => setShowReturningWelcome(false)}
        goals={(user as any)?.dailyGoals || []}
        userName={(user as any)?.firstName || user?.name}
        sessionCount={(user as any)?.sessionCount}
      />
    </div>
  );
}
