import { useState } from "react";
import { Bell, User, BarChart3, Eye, Brain, Star, TrendingUp, FileText, Trophy, Volume2, HelpCircle } from "lucide-react";
import yappyyLogo from "@assets/image_1753488502332.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewPracticeDashboard from "@/components/NewPracticeDashboard";
import ComprehensiveAICoach from "@/components/ComprehensiveAICoach";
import PersonalizedSpeechDNA from "@/components/PersonalizedSpeechDNA";
import ComprehensiveSessionAnalysis from "@/components/ComprehensiveSessionAnalysis";
import BodyLanguageAnalyzer from "@/components/BodyLanguageAnalyzer";
import AdvancedSpeechAnalysis from "@/components/AdvancedSpeechAnalysis";
import SpeechROIAnalyzer from "@/components/SpeechROIAnalyzer";
import Enhanced50PlusTemplates from "@/components/Enhanced50PlusTemplates";
import ImprovedBadgeSystem from "@/components/ImprovedBadgeSystem";

export default function IntegratedDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="gradient-card shadow-lg purple-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={() => window.location.href = '/'} className="hover:opacity-80 transition-opacity">
                <img src={yappyyLogo} alt="Yappyy" className="h-8" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-blue-500 hover:text-blue-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center purple-glow">
                <User className="text-white w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 lg:grid-cols-8 gap-1 mb-8 gradient-card purple-border shadow-lg p-1 h-auto">
            <TabsTrigger value="overview" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              <span>Practice</span>
            </TabsTrigger>
            <TabsTrigger value="improvement" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
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
            <TabsTrigger value="templates" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex flex-col items-center space-y-1 px-2 py-2 text-xs data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Trophy className="w-4 h-4" />
              <span>Badges</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 pb-16">
            <NewPracticeDashboard />
          </TabsContent>

          <TabsContent value="improvement" className="space-y-6">
            <ComprehensiveAICoach />
          </TabsContent>

          <TabsContent value="speech-dna" className="space-y-6">
            <PersonalizedSpeechDNA />
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <ComprehensiveSessionAnalysis />
          </TabsContent>

          <TabsContent value="body-language" className="space-y-6">
            <BodyLanguageAnalyzer />
          </TabsContent>

          <TabsContent value="speech-deep" className="space-y-6">
            <AdvancedSpeechAnalysis />
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