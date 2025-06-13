import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Brain, Star, Eye, Volume2, FileText, Trophy } from "lucide-react";
import ImprovedPracticePage from "@/components/ImprovedPracticePage";
import ComprehensiveAICoach from "@/components/ComprehensiveAICoach";
import PersonalizedSpeechDNA from "@/components/PersonalizedSpeechDNA";
import ComprehensiveSessionAnalysis from "@/components/ComprehensiveSessionAnalysis";
import BodyLanguageAnalyzer from "@/components/BodyLanguageAnalyzer";
import AdvancedSpeechAnalysis from "@/components/AdvancedSpeechAnalysis";
import Enhanced50PlusTemplates from "@/components/Enhanced50PlusTemplates";
import ImprovedBadgeSystem from "@/components/ImprovedBadgeSystem";
import EnhancedAnalysisTab from "@/components/EnhancedAnalysisTab";
import yappyyLogoPath from '@assets/Untitled_design-11600-removebg-preview_1749744306540.png';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("practice");

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <img src={yappyyLogoPath} alt="Yappyy" className="h-8" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-8 h-auto p-2 bg-white border border-gray-100 shadow-lg rounded-xl">
            <TabsTrigger value="practice" className="flex flex-col items-center space-y-2 px-4 py-3 text-xs font-medium rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#1e40af] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">
              <BarChart3 className="w-5 h-5" />
              <span>Practice</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex flex-col items-center space-y-2 px-4 py-3 text-xs font-medium rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#1e40af] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">
              <Brain className="w-5 h-5" />
              <span>Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="ai-coach" className="flex flex-col items-center space-y-2 px-4 py-3 text-xs font-medium rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#1e40af] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">
              <Brain className="w-5 h-5" />
              <span>AI Coach</span>
            </TabsTrigger>
            <TabsTrigger value="speech-dna" className="flex flex-col items-center space-y-2 px-4 py-3 text-xs font-medium rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#1e40af] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">
              <Star className="w-5 h-5" />
              <span>Speech DNA</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex flex-col items-center space-y-2 px-4 py-3 text-xs font-medium rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#1e40af] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">
              <FileText className="w-5 h-5" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex flex-col items-center space-y-2 px-4 py-3 text-xs font-medium rounded-lg transition-all duration-300 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#1e40af] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">
              <Trophy className="w-5 h-5" />
              <span>Badges</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practice" className="space-y-8 pb-16">
            <ImprovedPracticePage />
          </TabsContent>

          <TabsContent value="ai-coach" className="space-y-6">
            <ComprehensiveAICoach />
          </TabsContent>

          <TabsContent value="speech-dna" className="space-y-6">
            <PersonalizedSpeechDNA />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <EnhancedAnalysisTab />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Enhanced50PlusTemplates />
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <ImprovedBadgeSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
