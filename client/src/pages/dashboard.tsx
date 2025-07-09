import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, BarChart3, Brain, FileText, Trophy, Target } from "lucide-react";
import SimplePracticePage from "@/components/SimplePracticePage";
import SimpleAICoach from "@/components/SimpleAICoach";
import SimpleAnalysisTab from "@/components/SimpleAnalysisTab";
import SimpleTemplates from "@/components/SimpleTemplates";
import SimpleBadgeSystem from "@/components/SimpleBadgeSystem";
import yappyyLogoPath from '@assets/Untitled_design-11600-removebg-preview_1749744306540.png';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("practice");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src={yappyyLogoPath} alt="Yappyy" className="h-8" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-gray-900">Public Speaking Coach</h1>
                <p className="text-sm text-gray-500">AI-Powered Speech Training Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-8 h-auto p-2 bg-white border border-gray-200 shadow-sm rounded-xl">
            <TabsTrigger 
              value="practice" 
              className="flex flex-col items-center space-y-1.5 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <Mic className="w-5 h-5" />
              <span>Practice</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex flex-col items-center space-y-1.5 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analysis</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ai-coach" 
              className="flex flex-col items-center space-y-1.5 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <Brain className="w-5 h-5" />
              <span>AI Coach</span>
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="flex flex-col items-center space-y-1.5 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <FileText className="w-5 h-5" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex flex-col items-center space-y-1.5 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md cursor-pointer"
            >
              <Trophy className="w-5 h-5" />
              <span>Progress</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practice" className="space-y-8 pb-16">
            <SimplePracticePage />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <SimpleAnalysisTab />
          </TabsContent>

          <TabsContent value="ai-coach" className="space-y-6">
            <SimpleAICoach />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <SimpleTemplates />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <SimpleBadgeSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
