import { useState } from "react";
import { Bell, MicOff, User, BarChart3, Eye, Brain, Star, TrendingUp, FileText, Trophy, Users, Volume2, HelpCircle, PlayCircle, Camera, MessageSquare, Activity, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoFeed from "@/components/VideoFeed";
import RealTimeMetrics from "@/components/RealTimeMetrics";
import LiveTranscript from "@/components/LiveTranscript";
import SmartAIFeedback from "@/components/SmartAIFeedback";
import SessionStats from "@/components/SessionStats";
import SessionHistory from "@/components/SessionHistory";
import DetailedAnalysis from "@/components/DetailedAnalysis";
import BodyLanguageAnalyzer from "@/components/BodyLanguageAnalyzer";
import AdvancedSpeechAnalysis from "@/components/AdvancedSpeechAnalysis";
import ImprovementSummary from "@/components/ImprovementSummary";
import SpeechDNA from "@/components/SpeechDNA";
import SpeechROIAnalyzer from "@/components/SpeechROIAnalyzer";
import ScriptTemplates from "@/components/ScriptTemplates";
import BadgeSystem from "@/components/BadgeSystem";
import AIPracticeRoleplay from "@/components/AIPracticeRoleplay";
import BodyCueTimeline from "@/components/BodyCueTimeline";
import SpeechFingerprintGenerator from "@/components/SpeechFingerprintGenerator";

import AdaptiveFeedbackEngine from "@/components/AdaptiveFeedbackEngine";
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
              <button className="text-cyan-600 hover:text-cyan-700 transition-colors">
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
          <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-1 mb-8 gradient-card purple-border shadow-lg p-1 h-auto">
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
            {/* Practice Session Header */}
            <div className="bg-gradient-to-r from-blue-50 to-[#0BF9EA]/10 rounded-2xl p-8 border border-[#0BF9EA]/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Your Practice Session</h2>
                  <p className="text-gray-600">Get real-time AI feedback to improve your speaking skills</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white rounded-lg px-4 py-2 border border-gray-200">
                    <span className="text-sm text-gray-500">Session #</span>
                    <span className="text-lg font-bold text-[#0BF9EA] ml-1">24</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="bg-[#0BF9EA] hover:bg-[#0BF9EA]/90 text-white shadow-lg">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Quick Start
                    </Button>
                    <Button 
                      onClick={() => setShowPostAnalysis(true)}
                      variant="outline" 
                      className="border-[#0BF9EA] text-[#0BF9EA] hover:bg-[#0BF9EA]/10"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Finish & Analyze
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Focus Areas - Card Style */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { icon: Eye, label: "Eye Contact", color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100", active: true },
                  { icon: Users, label: "Posture", color: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100", active: false },
                  { icon: Volume2, label: "Voice Clarity", color: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100", active: false },
                  { icon: BarChart3, label: "Filler Words", color: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100", active: false },
                  { icon: TrendingUp, label: "Energy", color: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100", active: false }
                ].map((focus, index) => (
                  <div key={index} className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${focus.active ? 'bg-[#0BF9EA]/10 border-[#0BF9EA] text-[#0BF9EA]' : focus.color}`}>
                    <focus.icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium block text-center">{focus.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Practice Area - Improved Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Video & Transcript Section */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Camera className="w-5 h-5 mr-2 text-[#0BF9EA]" />
                      Live Video Feed
                    </h3>
                  </div>
                  <div className="p-6">
                    <VideoFeed />
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-[#0BF9EA]" />
                      Live Transcript
                    </h3>
                  </div>
                  <div className="p-6">
                    <LiveTranscript />
                  </div>
                </div>
              </div>
              
              {/* Live Feedback Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-[#0BF9EA]" />
                      Live Metrics
                    </h3>
                  </div>
                  <div className="p-6">
                    <RealTimeMetrics />
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-[#0BF9EA]" />
                      AI Feedback
                    </h3>
                  </div>
                  <div className="p-6">
                    <SmartAIFeedback />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Practice Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-[#0BF9EA]" />
                    AI Practice Partner
                  </h3>
                </div>
                <div className="p-6">
                  <AIPracticeRoleplay />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-[#0BF9EA]" />
                    Session Stats
                  </h3>
                </div>
                <div className="p-6">
                  <SessionStats />
                </div>
              </div>
            </div>
            
            {/* Session History */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-[#0BF9EA]" />
                  Recent Sessions
                </h3>
              </div>
              <div className="p-6">
                <SessionHistory />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="improvement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdaptiveFeedbackEngine 
                userProfile={{
                  userId: 'demo-user',
                  sessionCount: 15,
                  masteredSkills: ['voice_pacing', 'basic_gestures', 'eye_contact'],
                  currentWeaknesses: ['advanced_rhetoric', 'emotional_intelligence'],
                  feedbackHistory: ['gesture timing', 'voice clarity', 'posture'],
                  adaptiveLevel: 6,
                  learningVelocity: 0.85,
                  personalityTraits: ['analytical', 'detail_oriented'],
                  preferredFeedbackStyle: 'analytical'
                }}
                currentPerformance={{
                  voiceClarity: 72,
                  bodyLanguage: 78,
                  contentStructure: 83,
                  engagement: 75
                }}
              />

            </div>
            <ImprovementSummary />
          </TabsContent>

          <TabsContent value="speech-dna" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpeechFingerprintGenerator 
                sessionCount={15}
              />
              <SpeechDNA />
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <DetailedAnalysis />
          </TabsContent>

          <TabsContent value="body-language" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BodyLanguageAnalyzer />
              <BodyCueTimeline 
                cues={[]}
                totalDuration={300}
              />
            </div>
          </TabsContent>

          <TabsContent value="speech-deep" className="space-y-6">
            <AdvancedSpeechAnalysis />
          </TabsContent>

          <TabsContent value="roi-analyzer" className="space-y-6">
            <SpeechROIAnalyzer />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <EnhancedTemplateMarketplace />
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <BadgeSystem />
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
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
