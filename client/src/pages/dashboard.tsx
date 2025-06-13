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
import yappyyLogoPath from '@assets/yappyy-logo.svg';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("practice");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      {/* Header with Logo */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <img src={yappyyLogoPath} alt="Yappyy" className="h-8" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-1 mb-8 h-auto p-1 bg-white/60 backdrop-blur-md border border-blue-200">
            <TabsTrigger value="practice" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-cyan-600 data-[state=active]:to-sky-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              <span>Practice</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-cyan-600 data-[state=active]:to-sky-600 data-[state=active]:text-white">
              <Brain className="w-4 h-4" />
              <span>Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="ai-coach" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-cyan-600 data-[state=active]:to-sky-600 data-[state=active]:text-white">
              <Brain className="w-4 h-4" />
              <span>AI Coach</span>
            </TabsTrigger>
            <TabsTrigger value="speech-dna" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-cyan-600 data-[state=active]:to-sky-600 data-[state=active]:text-white">
              <Star className="w-4 h-4" />
              <span>Speech DNA</span>
            </TabsTrigger>
            <TabsTrigger value="body-language" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-cyan-600 data-[state=active]:to-sky-600 data-[state=active]:text-white">
              <Eye className="w-4 h-4" />
              <span>Body Lang</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-cyan-600 data-[state=active]:to-sky-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-cyan-600 data-[state=active]:to-sky-600 data-[state=active]:text-white">
              <Trophy className="w-4 h-4" />
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
            <ComprehensiveSessionAnalysis />
          </TabsContent>

          <TabsContent value="body-language" className="space-y-6">
            <BodyLanguageAnalyzer />
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
