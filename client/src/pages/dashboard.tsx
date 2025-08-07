import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mic, BarChart3, Brain, FileText, Trophy, Target, User, Home, Settings, Shield, Star, BookOpen, PieChart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SimplifiedPracticePage from "@/components/SimplifiedPracticePage";
import AICoachRedesigned from "@/components/AICoachRedesigned";
import PersonalizedSpeechDNA from "@/components/PersonalizedSpeechDNA";
import EnhancedTemplateMarketplace from "@/components/EnhancedTemplateMarketplace";
import ImprovedBadgeSystem from "@/components/ImprovedBadgeSystem";
import EnhancedAnalysisTab from "@/components/EnhancedAnalysisTab";
import DailyGoalWidget from "@/components/DailyGoalWidget";
import SimpleProfileForm from "@/components/SimpleProfileForm";
import AppSettings from "@/components/AppSettings";
import PrivacySettings from "@/components/PrivacySettings";
import StreamlinedProgressTab from "@/components/StreamlinedProgressTab";
import WelcomeMessage from "@/components/WelcomeMessage";
import ReturningUserWelcome from "@/components/ReturningUserWelcome";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { DailyGoalsDialog } from "@/components/DailyGoalsDialog";

import yappyyLogoPath from '@assets/Y-2-removebg-preview_1753384287580.png';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("practice-alt");
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showReturningWelcome, setShowReturningWelcome] = useState(false);
  const { user } = useAuth();

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
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button onClick={() => window.location.href = '/'} className="hover:opacity-80 transition-opacity">
                <img src={yappyyLogoPath} alt="Yappyy" className="h-8" />
              </button>
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
          {/* Horizontal Navigation Tabs - Yappyy blue gradient color scheme */}
          <TabsList className="flex items-center justify-center gap-8 mb-8 h-auto p-0 bg-transparent border-b border-gray-200 rounded-none w-full">
            <TabsTrigger 
              value="practice-alt" 
              className="flex items-center gap-3 px-8 py-4 text-sm font-medium text-gray-600 rounded-none border-b-2 border-transparent hover:text-blue-600 hover:border-blue-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-sm transition-all duration-300 whitespace-nowrap relative group"
            >
              <Mic className="w-4 h-4 group-data-[state=active]:text-blue-600 group-hover:text-blue-600" />
              <span className="group-data-[state=active]:bg-gradient-to-r group-data-[state=active]:from-blue-600 group-data-[state=active]:via-cyan-500 group-data-[state=active]:to-blue-600 group-data-[state=active]:bg-clip-text group-data-[state=active]:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-cyan-500 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent">Practice</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex items-center gap-3 px-8 py-4 text-sm font-medium text-gray-600 rounded-none border-b-2 border-transparent hover:text-blue-600 hover:border-blue-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-sm transition-all duration-300 whitespace-nowrap relative group"
            >
              <BarChart3 className="w-4 h-4 group-data-[state=active]:text-blue-600 group-hover:text-blue-600" />
              <span className="group-data-[state=active]:bg-gradient-to-r group-data-[state=active]:from-blue-600 group-data-[state=active]:via-cyan-500 group-data-[state=active]:to-blue-600 group-data-[state=active]:bg-clip-text group-data-[state=active]:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-cyan-500 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-coach" 
              className="flex items-center gap-3 px-8 py-4 text-sm font-medium text-gray-600 rounded-none border-b-2 border-transparent hover:text-blue-600 hover:border-blue-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-sm transition-all duration-300 whitespace-nowrap relative group"
            >
              <Brain className="w-4 h-4 group-data-[state=active]:text-blue-600 group-hover:text-blue-600" />
              <span className="group-data-[state=active]:bg-gradient-to-r group-data-[state=active]:from-blue-600 group-data-[state=active]:via-cyan-500 group-data-[state=active]:to-blue-600 group-data-[state=active]:bg-clip-text group-data-[state=active]:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-cyan-500 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent">AI Coach</span>
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="flex items-center gap-3 px-8 py-4 text-sm font-medium text-gray-600 rounded-none border-b-2 border-transparent hover:text-blue-600 hover:border-blue-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-sm transition-all duration-300 whitespace-nowrap relative group"
            >
              <FileText className="w-4 h-4 group-data-[state=active]:text-blue-600 group-hover:text-blue-600" />
              <span className="group-data-[state=active]:bg-gradient-to-r group-data-[state=active]:from-blue-600 group-data-[state=active]:via-cyan-500 group-data-[state=active]:to-blue-600 group-data-[state=active]:bg-clip-text group-data-[state=active]:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-cyan-500 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent">Templates</span>
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex items-center gap-3 px-8 py-4 text-sm font-medium text-gray-600 rounded-none border-b-2 border-transparent hover:text-blue-600 hover:border-blue-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-sm transition-all duration-300 whitespace-nowrap relative group"
            >
              <Trophy className="w-4 h-4 group-data-[state=active]:text-blue-600 group-hover:text-blue-600" />
              <span className="group-data-[state=active]:bg-gradient-to-r group-data-[state=active]:from-blue-600 group-data-[state=active]:via-cyan-500 group-data-[state=active]:to-blue-600 group-data-[state=active]:bg-clip-text group-data-[state=active]:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-cyan-500 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent">Performance</span>
            </TabsTrigger>
          </TabsList>

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
              <EnhancedAnalysisTab />
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="space-y-6">
                <ImprovedBadgeSystem />
                <DailyGoalWidget />
              </div>
            </TabsContent>
          </div>

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
