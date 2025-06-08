import { useState } from "react";
import { Bell, MicOff, User, BarChart3, Eye, Brain, Star, TrendingUp, FileText, Trophy, Users, Volume2, HelpCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedPracticeHub from "@/components/EnhancedPracticeHub";
import AnalysisOverview from "@/components/AnalysisOverview";
import BodyLanguageAnalyzer from "@/components/BodyLanguageAnalyzer";
import AdvancedSpeechAnalysis from "@/components/AdvancedSpeechAnalysis";
import ContentAnalysis from "@/components/ContentAnalysis";
import ImprovementSummary from "@/components/ImprovementSummary";
import SpeechDNA from "@/components/SpeechDNA";
import SpeechROIAnalyzer from "@/components/SpeechROIAnalyzer";
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Navigation Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0BF9EA] to-blue-600 rounded-lg flex items-center justify-center">
                <MicOff className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">YapUp</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Clean Tab Navigation */}
          <div className="mb-8">
            <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 w-full h-auto p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
              <TabsTrigger 
                value="overview" 
                className="flex flex-col items-center space-y-1 px-3 py-3 text-xs font-medium data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Practice</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="detailed" 
                className="flex flex-col items-center space-y-1 px-3 py-3 text-xs font-medium data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analysis</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="ai-coach" 
                className="flex flex-col items-center space-y-1 px-3 py-3 text-xs font-medium data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Brain className="w-4 h-4" />
                <span>AI Coach</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="speech-dna" 
                className="flex flex-col items-center space-y-1 px-3 py-3 text-xs font-medium data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Star className="w-4 h-4" />
                <span>Speech DNA</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="roi-analyzer" 
                className="flex flex-col items-center space-y-1 px-3 py-3 text-xs font-medium data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Impact</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="templates" 
                className="flex flex-col items-center space-y-1 px-3 py-3 text-xs font-medium data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <FileText className="w-4 h-4" />
                <span>Templates</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="badges" 
                className="flex flex-col items-center space-y-1 px-3 py-3 text-xs font-medium data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Trophy className="w-4 h-4" />
                <span>Badges</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="help" 
                className="flex flex-col items-center space-y-1 px-3 py-3 text-xs font-medium data-[state=active]:bg-[#0BF9EA] data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            <TabsContent value="overview" className="mt-0">
              <EnhancedPracticeHub />
            </TabsContent>

            <TabsContent value="ai-coach" className="mt-0">
              <ImprovementSummary />
            </TabsContent>

            <TabsContent value="speech-dna" className="mt-0">
              <SpeechDNA />
            </TabsContent>

            <TabsContent value="detailed" className="mt-0">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview" className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="body-language" className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Body Language</span>
                  </TabsTrigger>
                  <TabsTrigger value="voice-analysis" className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4" />
                    <span>Voice Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger value="content-analysis" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Content Analysis</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <AnalysisOverview />
                </TabsContent>
                
                <TabsContent value="body-language" className="mt-6">
                  <BodyLanguageAnalyzer />
                </TabsContent>
                
                <TabsContent value="voice-analysis" className="mt-6">
                  <AdvancedSpeechAnalysis />
                </TabsContent>
                
                <TabsContent value="content-analysis" className="mt-6">
                  <ContentAnalysis />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="roi-analyzer" className="mt-0">
              <SpeechROIAnalyzer />
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <EnhancedTemplateMarketplace />
            </TabsContent>

            <TabsContent value="badges" className="mt-0">
              <BadgeSystem />
            </TabsContent>

            <TabsContent value="help" className="mt-0">
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