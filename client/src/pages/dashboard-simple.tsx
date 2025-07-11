import { useState } from "react";
import { Bell, MicOff, User, BarChart3, Eye, Volume2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardSimple() {
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
              <h1 className="text-xl font-heading gradient-text tracking-tight">YAPPYY</h1>
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
        {/* Practice Focus Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Focus Areas</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex items-center space-x-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
              <Eye className="w-4 h-4" />
              <span>Maintain Eye Contact</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Improve Posture</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4" />
              <span>Voice Clarity</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Reduce Filler Words</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Energy & Pace</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Feed Placeholder */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>Video Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Camera will appear here</p>
              </div>
            </CardContent>
          </Card>

          {/* Live Metrics */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>Live Performance Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">No Live Session Active</p>
                  <p className="text-sm">Start a practice session to see real-time performance metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}