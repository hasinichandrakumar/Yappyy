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
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0BF9EA] to-blue-600 rounded-lg flex items-center justify-center">
                <MicOff className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">YapUp</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <Bell className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 w-full h-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
              <TabsTrigger value="overview" className="flex flex-col items-center space-y-1 px-3 py-3 text-xs data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-md transition-all">
                <PlayCircle className="w-4 h-4" />
                <span className="font-medium">Practice</span>
              </TabsTrigger>
              <TabsTrigger value="ai-coach" className="flex flex-col items-center space-y-1 px-3 py-3 text-xs data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-md transition-all">
                <Brain className="w-4 h-4" />
                <span className="font-medium">AI Coach</span>
              </TabsTrigger>
              <TabsTrigger value="speech-dna" className="flex flex-col items-center space-y-1 px-3 py-3 text-xs data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-md transition-all">
                <Star className="w-4 h-4" />
                <span className="font-medium">Speech DNA</span>
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex flex-col items-center space-y-1 px-3 py-3 text-xs data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-md transition-all">
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="body-language" className="flex flex-col items-center space-y-1 px-3 py-3 text-xs data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-md transition-all">
                <Eye className="w-4 h-4" />
                <span className="font-medium">Body Language</span>
              </TabsTrigger>
              <TabsTrigger value="speech-deep" className="flex flex-col items-center space-y-1 px-3 py-3 text-xs data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-md transition-all">
                <Volume2 className="w-4 h-4" />
                <span className="font-medium">Deep Dive</span>
              </TabsTrigger>
              <TabsTrigger value="roi-analyzer" className="flex flex-col items-center space-y-1 px-3 py-3 text-xs data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-md transition-all">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Impact</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex flex-col items-center space-y-1 px-3 py-3 text-xs data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-md transition-all">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex flex-col items-center space-y-1 px-3 py-3 text-xs data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-md transition-all">
                <Trophy className="w-4 h-4" />
                <span className="font-medium">Badges</span>
              </TabsTrigger>
              <TabsTrigger value="help" className="flex flex-col items-center space-y-1 px-3 py-3 text-xs data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-md transition-all">
                <HelpCircle className="w-4 h-4" />
                <span className="font-medium">Help</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
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
          </div>
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