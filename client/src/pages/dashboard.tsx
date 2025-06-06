import { Bell, MicOff, User } from "lucide-react";
import VideoFeed from "@/components/VideoFeed";
import RealTimeMetrics from "@/components/RealTimeMetrics";
import SpeechTranscript from "@/components/SpeechTranscript";
import CoachingTips from "@/components/CoachingTips";
import SessionStats from "@/components/SessionStats";
import SessionHistory from "@/components/SessionHistory";

export default function Dashboard() {
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
      </div>
    </div>
  );
}
