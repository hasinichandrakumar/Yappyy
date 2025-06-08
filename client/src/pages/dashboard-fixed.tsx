import { useState } from "react";
import { Bell, MicOff, User, BarChart3, Eye, Brain, Star, TrendingUp, FileText, Trophy, Users, Volume2, HelpCircle, PlayCircle, Camera, MessageSquare, Activity, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvancedPracticeHub from "@/components/AdvancedPracticeHub";
import DetailedAnalysis from "@/components/DetailedAnalysis";
import BodyLanguageAnalyzer from "@/components/BodyLanguageAnalyzer";
import AdvancedSpeechAnalysis from "@/components/AdvancedSpeechAnalysis";
import ImprovementSummary from "@/components/ImprovementSummary";
import SpeechDNA from "@/components/SpeechDNA";
import SpeechROIAnalyzer from "@/components/SpeechROIAnalyzer";
import ScriptTemplates from "@/components/ScriptTemplates";
import BadgeSystem from "@/components/BadgeSystem";
import EnhancedTemplateMarketplace from "@/components/EnhancedTemplateMarketplace";
import HelpGuide from "@/components/HelpGuide";
import PostSessionAnalysis from "@/components/PostSessionAnalysis";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostAnalysis, setShowPostAnalysis] = useState(false);
  const [sessionContext, setSessionContext] = useState<{
    roleplayType?: string;
    audienceType?: string;
  }>({});
  const [isSessionActive, setIsSessionActive] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="gradient-card shadow-lg purple-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center purple-glow">
                <MicOff className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-heading yapup-gradient tracking-tight">YapUp</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-8 lg:grid-cols-8 w-full h-auto p-1 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <TabsTrigger value="overview" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <PlayCircle className="w-4 h-4" />
              <span>Practice</span>
            </TabsTrigger>
            <TabsTrigger value="ai-coach" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Brain className="w-4 h-4" />
              <span>AI Coach</span>
            </TabsTrigger>
            <TabsTrigger value="speech-dna" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Star className="w-4 h-4" />
              <span>Speech DNA</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Brain className="w-4 h-4" />
              <span>Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="body-language" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Eye className="w-4 h-4" />
              <span>Body Lang</span>
            </TabsTrigger>
            <TabsTrigger value="speech-deep" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Volume2 className="w-4 h-4" />
              <span>Deep Dive</span>
            </TabsTrigger>
            <TabsTrigger value="roi-analyzer" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4" />
              <span>Impact</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Trophy className="w-4 h-4" />
              <span>Badges</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 pb-16">
            <AdvancedPracticeHub />
          </TabsContent>

          <TabsContent value="ai-coach" className="space-y-8 pb-16">
            <ImprovementSummary />
          </TabsContent>

          <TabsContent value="speech-dna" className="space-y-8 pb-16">
            <SpeechDNA />
          </TabsContent>

          <TabsContent value="detailed" className="space-y-8 pb-16">
            <DetailedAnalysis />
          </TabsContent>

          <TabsContent value="body-language" className="space-y-8 pb-16">
            <BodyLanguageAnalyzer />
          </TabsContent>

          <TabsContent value="speech-deep" className="space-y-8 pb-16">
            <AdvancedSpeechAnalysis />
          </TabsContent>

          <TabsContent value="roi-analyzer" className="space-y-8 pb-16">
            <SpeechROIAnalyzer />
          </TabsContent>

          <TabsContent value="templates" className="space-y-8 pb-16">
            <EnhancedTemplateMarketplace />
          </TabsContent>

          <TabsContent value="badges" className="space-y-8 pb-16">
            <BadgeSystem />
          </TabsContent>

          <TabsContent value="help" className="space-y-8 pb-16">
            <HelpGuide />
          </TabsContent>
        </Tabs>
      </div>

      {/* Post Session Analysis Modal */}
      <PostSessionAnalysis 
        isVisible={showPostAnalysis}
        onClose={() => setShowPostAnalysis(false)}
        roleplayContext={sessionContext.roleplayType}
        audienceType={sessionContext.audienceType}
      />
    </div>
  );
}