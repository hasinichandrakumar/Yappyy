import { useState } from "react";
import { Bell, MicOff, User, BarChart3, Eye, Brain, Star, TrendingUp, FileText, Trophy, Users, Volume2, HelpCircle, PlayCircle, BookOpen, Target } from "lucide-react";
import yapUpLogo from "@assets/YapUp-6_1749439026739.png";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import YapUpLogo, { YapUpIcon } from "@/components/YapUpLogo";
import EnhancedPracticeHubFixed from "@/components/EnhancedPracticeHubFixed";
import AnalysisOverview from "@/components/AnalysisOverview";
import BodyLanguageAnalyzer from "@/components/BodyLanguageAnalyzer";
import AdvancedSpeechAnalysis from "@/components/AdvancedSpeechAnalysis";
import ContentAnalysis from "@/components/ContentAnalysis";
import AIMentor from "@/components/AIMentor";
import SimpleAICoach from "@/components/SimpleAICoach";
import SessionStudyModal from "@/components/SessionStudyModal";
import SpeechDNA from "@/components/SpeechDNA";
import SpeechROIAnalyzer from "@/components/SpeechROIAnalyzer";
import BadgeSystem from "@/components/BadgeSystem";
import EnhancedTemplateMarketplace from "@/components/EnhancedTemplateMarketplace";
import HelpGuide from "@/components/HelpGuide";
import PostSessionAnalysis from "@/components/PostSessionAnalysis";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostAnalysis, setShowPostAnalysis] = useState(false);
  const [showSessionStudy, setShowSessionStudy] = useState(false);
  const [studyingSessionId, setStudyingSessionId] = useState<string>("");
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
              <img
                src={yapUpLogo}
                alt="YapUp Logo"
                className="w-8 h-8 rounded-lg"
              />
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
              <EnhancedPracticeHubFixed />
            </TabsContent>

            <TabsContent value="ai-coach" className="mt-0">
              <SimpleAICoach />
            </TabsContent>

            <TabsContent value="speech-dna" className="mt-0">
              <SpeechDNA />
            </TabsContent>

            <TabsContent value="detailed" className="mt-0">
              <Tabs defaultValue="overview" className="w-full">
                {/* Study Session Header */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {studyingSessionId ? 'Studying Session' : 'Session Analysis'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {studyingSessionId 
                            ? `Analyzing specific session data across all metrics`
                            : 'Deep dive into your practice sessions'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {studyingSessionId && (
                        <Button 
                          variant="outline"
                          onClick={() => setStudyingSessionId("")}
                          className="border-blue-300"
                        >
                          Exit Study Mode
                        </Button>
                      )}
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowSessionStudy(true)}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Study Different Session
                      </Button>
                    </div>
                  </div>
                  {studyingSessionId && (
                    <div className="mt-3 px-3 py-2 bg-blue-100 rounded-lg border border-blue-300">
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Currently studying: Product Launch Presentation (Session {studyingSessionId})
                        </span>
                      </div>
                    </div>
                  )}
                </div>

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
                  <div className="space-y-6">
                    <ContentAnalysis />
                    <AIMentor />
                  </div>
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

      {/* Session Study Modal */}
      <SessionStudyModal
        isOpen={showSessionStudy}
        onClose={() => setShowSessionStudy(false)}
        onSessionSelect={(sessionId) => {
          setStudyingSessionId(sessionId);
          // Could switch to detailed analysis tab automatically
          setActiveTab('detailed');
        }}
      />
    </div>
  );
}