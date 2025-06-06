import { useState } from "react";
import { Bell, MicOff, User, BarChart3, Eye, Brain } from "lucide-react";
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-surface shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MicOff className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">AI Speaking Coach</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="text-gray-600 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Detailed Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="body-language" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Body Language</span>
            </TabsTrigger>
            <TabsTrigger value="speech-deep" className="flex items-center space-x-2">
              <MicOff className="w-4 h-4" />
              <span>Speech Deep Dive</span>
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
              
              {/* Right Column - Coaching Panel */}
              <div className="space-y-6">
                <CoachingTips />
                <SessionStats />
              </div>
            </div>
            
            <div className="mt-8">
              <SessionHistory />
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <DetailedAnalysis />
          </TabsContent>

          <TabsContent value="body-language" className="space-y-6">
            <BodyLanguageAnalyzer />
          </TabsContent>

          <TabsContent value="speech-deep" className="space-y-6">
            <AdvancedSpeechAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
