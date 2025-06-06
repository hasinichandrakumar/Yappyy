import { useState } from "react";
import { Bell, MicOff, User, BarChart3, Eye, Brain, Star, TrendingUp, FileText, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoFeed from "@/components/VideoFeed";
import RealTimeMetrics from "@/components/RealTimeMetrics";
import SpeechTranscript from "@/components/SpeechTranscript";
import CoachingTips from "@/components/CoachingTips";
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
import VibeTracker from "@/components/VibeTracker";
import AdaptiveFeedbackEngine from "@/components/AdaptiveFeedbackEngine";
import EnhancedTemplateMarketplace from "@/components/EnhancedTemplateMarketplace";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

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
              <h1 className="text-xl font-heading gradient-text tracking-tight">AI Speaking Coach</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-purple-600 hover:text-purple-700 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center purple-glow">
                <User className="text-white w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-6 gradient-card purple-border">
            <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              <span>Practice</span>
            </TabsTrigger>
            <TabsTrigger value="improvement" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Brain className="w-4 h-4" />
              <span>AI Coach</span>
            </TabsTrigger>
            <TabsTrigger value="speech-dna" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Star className="w-4 h-4" />
              <span>Speech DNA</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Brain className="w-4 h-4" />
              <span>Detailed Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="body-language" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Eye className="w-4 h-4" />
              <span>Body Language</span>
            </TabsTrigger>
            <TabsTrigger value="speech-deep" className="flex items-center space-x-2 data-[state=active]:gradient-bg data-[state=active]:text-white">
              <MicOff className="w-4 h-4" />
              <span>Speech Deep Dive</span>
            </TabsTrigger>
            <TabsTrigger value="roi-analyzer" className="flex items-center space-x-1 data-[state=active]:gradient-bg data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Impact</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center space-x-1 data-[state=active]:gradient-bg data-[state=active]:text-white">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center space-x-1 data-[state=active]:gradient-bg data-[state=active]:text-white">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Video Feed and Controls */}
              <div className="lg:col-span-2 space-y-6">
                <VideoFeed />
                <RealTimeMetrics />
                <SpeechTranscript />
              </div>
              
              {/* Right Column - Practice Tools and AI Roleplay */}
              <div className="space-y-6">
                <AIPracticeRoleplay />
                <CoachingTips />
                <SessionStats />
              </div>
            </div>
            
            <div className="mt-8">
              <SessionHistory />
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
              <VibeTracker 
                emotionalData={[]}
                insights={[]}
                userLearningProfile={{
                  sessionCount: 15,
                  adaptiveLevel: 6,
                  previousPatterns: ['strategic pausing', 'data storytelling', 'confident openings'],
                  improvementAreas: ['energy_dip', 'persuasion_peak']
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
        </Tabs>
      </div>
    </div>
  );
}
