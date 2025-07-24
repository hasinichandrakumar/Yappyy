import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mic, BarChart3, Brain, FileText, Trophy, Target, User, Home, Settings, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SimplifiedPracticePage from "@/components/SimplifiedPracticePage";
import AICoachRedesigned from "@/components/AICoachRedesigned";
import PersonalizedSpeechDNA from "@/components/PersonalizedSpeechDNA";
import Enhanced50PlusTemplates from "@/components/Enhanced50PlusTemplates";
import ImprovedBadgeSystem from "@/components/ImprovedBadgeSystem";
import EnhancedAnalysisTab from "@/components/EnhancedAnalysisTab";
import DailyGoalWidget from "@/components/DailyGoalWidget";
import SimpleProfileForm from "@/components/SimpleProfileForm";
import AppSettings from "@/components/AppSettings";
import PrivacySettings from "@/components/PrivacySettings";
import FunctionalProgressTracker from "@/components/FunctionalProgressTracker";
import WelcomeMessage from "@/components/WelcomeMessage";
import ReturningUserWelcome from "@/components/ReturningUserWelcome";
import yappyyLogoPath from '@assets/Y-2-removebg-preview_1753383888231.png';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("practice");
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showReturningWelcome, setShowReturningWelcome] = useState(false);
  const { user } = useAuth();

  const { logout } = useAuth();

  // Check if user needs welcome message - show for both authenticated and guest users
  useEffect(() => {
    if (user) {
      if (user.isAuthenticated) {
        // For authenticated users - determine by actual session data
        const hasRecordedSessions = (user as any).totalSessions > 0;
        const todayKey = `dailyWelcomeShown_${user.id}_${new Date().toDateString()}`;
        const hasSeenTodayWelcome = localStorage.getItem(todayKey);
        
        if (!hasRecordedSessions) {
          // New authenticated user with no recorded sessions - show first-time welcome
          setShowWelcome(true);
        } else if (!hasSeenTodayWelcome) {
          // Returning authenticated user with sessions - show daily welcome with goals
          setShowReturningWelcome(true);
          localStorage.setItem(todayKey, 'true');
        }
      } else {
        // For guest users - always show welcome for new users
        if (user.isNewUser && !user.welcomeMessageShown) {
          setShowWelcome(true);
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
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src={yappyyLogoPath} alt="Yappyy" className="h-8" />
              <div className="hidden sm:block">
                {/* Header text removed per user request */}
              </div>
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2 mb-8 h-auto p-2 bg-white border border-gray-200 shadow-sm rounded-xl">
            <TabsTrigger 
              value="practice" 
              className="flex flex-col items-center space-y-1.5 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <Mic className="w-5 h-5" />
              <span className="font-bold">Practice</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex flex-col items-center space-y-1.5 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-bold">Analysis</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-coach" 
              className="flex flex-col items-center space-y-1.5 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <Brain className="w-5 h-5" />
              <span className="font-bold">AI Coach</span>
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="flex flex-col items-center space-y-1.5 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <FileText className="w-5 h-5" />
              <span className="font-bold">Templates</span>
            </TabsTrigger>
            <TabsTrigger 
              value="goals" 
              className="flex flex-col items-center space-y-1.5 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <Target className="w-5 h-5" />
              <span className="font-bold">Goals</span>
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex flex-col items-center space-y-1.5 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <Trophy className="w-5 h-5" />
              <span className="font-bold">Progress</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practice" className="space-y-8 pb-16">
            <SimplifiedPracticePage />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <EnhancedAnalysisTab />
          </TabsContent>

          <TabsContent value="ai-coach" className="space-y-6">
            <AICoachRedesigned />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Enhanced50PlusTemplates />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <DailyGoalWidget />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <FunctionalProgressTracker />
          </TabsContent>

        </Tabs>
      </div>

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

      {/* Welcome Messages */}
      <WelcomeMessage 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
      
      <ReturningUserWelcome 
        isOpen={showReturningWelcome} 
        onClose={() => setShowReturningWelcome(false)} 
      />
    </div>
  );
}
