import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, Heart, Zap, BookOpen, Lightbulb, Target } from "lucide-react";

interface EmotionalDataPoint {
  time: number;
  energy: number;
  engagement: number;
  persuasiveness: number;
  confidence: number;
  timestamp: string;
}

interface VibeInsight {
  type: 'energy_dip' | 'engagement_spike' | 'persuasion_peak' | 'confidence_drop';
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
  learningNote: string;
}

interface VibeTrackerProps {
  emotionalData: EmotionalDataPoint[];
  insights: VibeInsight[];
  userLearningProfile: {
    sessionCount: number;
    adaptiveLevel: number;
    previousPatterns: string[];
    improvementAreas: string[];
  };
}

export default function VibeTracker({ 
  emotionalData, 
  insights, 
  userLearningProfile 
}: VibeTrackerProps) {
  // Generate adaptive emotional data based on user learning profile
  const generateAdaptiveData = (): EmotionalDataPoint[] => {
    const baseData = [
      { time: 0, energy: 65, engagement: 70, persuasiveness: 60, confidence: 55, timestamp: "0:00" },
      { time: 30, energy: 72, engagement: 75, persuasiveness: 68, confidence: 62, timestamp: "0:30" },
      { time: 60, energy: 68, engagement: 65, persuasiveness: 70, confidence: 65, timestamp: "1:00" },
      { time: 90, energy: 45, engagement: 50, persuasiveness: 55, confidence: 48, timestamp: "1:30" },
      { time: 120, energy: 80, engagement: 85, persuasiveness: 82, confidence: 78, timestamp: "2:00" },
      { time: 150, energy: 75, engagement: 80, persuasiveness: 85, confidence: 82, timestamp: "2:30" },
      { time: 180, energy: 70, engagement: 72, persuasiveness: 75, confidence: 75, timestamp: "3:00" },
    ];

    // Adapt data based on user's learning profile
    return baseData.map(point => ({
      ...point,
      // Add adaptive variance based on user's improvement areas
      energy: point.energy + (userLearningProfile.adaptiveLevel * 2),
      confidence: point.confidence + (userLearningProfile.sessionCount > 10 ? 5 : 0)
    }));
  };

  const generateAdaptiveInsights = (): VibeInsight[] => {
    const baseInsights = [
      {
        type: 'energy_dip' as const,
        timestamp: "1:30",
        severity: 'high' as const,
        message: "Significant energy drop detected",
        suggestion: "Add a personal story or ask audience a question",
        learningNote: "Pattern analysis: You tend to lose energy when transitioning between main points"
      },
      {
        type: 'engagement_spike' as const,
        timestamp: "2:00",
        severity: 'low' as const,
        message: "Excellent engagement recovery",
        suggestion: "Continue this storytelling approach",
        learningNote: "Success pattern: Stories about personal experience consistently boost your engagement"
      },
      {
        type: 'persuasion_peak' as const,
        timestamp: "2:30",
        severity: 'medium' as const,
        message: "Peak persuasive moment identified",
        suggestion: "Use similar data-driven arguments more frequently",
        learningNote: "Learning insight: Your persuasion peaks when combining emotion with statistics"
      }
    ];

    // Filter and adapt insights based on user's learning history
    return baseInsights.filter(insight => {
      // Don't repeat insights the user has already mastered
      if (userLearningProfile.improvementAreas.includes(insight.type)) {
        return true;
      }
      // Show advanced insights for experienced users
      return userLearningProfile.sessionCount > 5;
    });
  };

  const displayData = emotionalData.length > 0 ? emotionalData : generateAdaptiveData();
  const displayInsights = insights.length > 0 ? insights : generateAdaptiveInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'energy_dip': return TrendingDown;
      case 'engagement_spike': return TrendingUp;
      case 'persuasion_peak': return Target;
      case 'confidence_drop': return Heart;
      default: return Lightbulb;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-green-200 bg-green-50 text-green-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const averageEnergy = displayData.reduce((sum, point) => sum + point.energy, 0) / displayData.length;
  const engagementTrend = displayData[displayData.length - 1].engagement - displayData[0].engagement;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <CardTitle>Emotional Vibe Tracker</CardTitle>
          </div>
          <Badge variant="outline" className="text-purple-600">
            Session {userLearningProfile.sessionCount} • Level {userLearningProfile.adaptiveLevel}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          AI tracks your emotional tone curve and provides adaptive learning insights
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Emotional Curve Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="energy"
                stackId="1"
                stroke="#ec4899"
                fill="#fdf2f8"
                strokeWidth={2}
                name="Energy"
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stackId="2"
                stroke="#3b82f6"
                fill="#eff6ff"
                strokeWidth={2}
                name="Engagement"
              />
              <Area
                type="monotone"
                dataKey="persuasiveness"
                stackId="3"
                stroke="#10b981"
                fill="#f0fdf4"
                strokeWidth={2}
                name="Persuasiveness"
              />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                name="Confidence"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-100">
            <div className="text-2xl font-bold text-pink-600">{Math.round(averageEnergy)}%</div>
            <div className="text-sm text-gray-600">Avg Energy</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-center">
              {engagementTrend > 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-600" />
              )}
              <span className="text-2xl font-bold text-blue-600 ml-1">
                {engagementTrend > 0 ? '+' : ''}{Math.round(engagementTrend)}%
              </span>
            </div>
            <div className="text-sm text-gray-600">Engagement Trend</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">{displayInsights.length}</div>
            <div className="text-sm text-gray-600">AI Insights</div>
          </div>
        </div>

        {/* Adaptive Learning Insights */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Adaptive Learning Insights</h3>
            <Badge variant="secondary" className="text-xs">
              Personalized for you
            </Badge>
          </div>
          
          {displayInsights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className="h-5 w-5 mt-0.5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        {insight.timestamp}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {insight.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <h4 className="font-medium mb-1">{insight.message}</h4>
                    <p className="text-sm mb-2">{insight.suggestion}</p>
                    <div className="text-xs italic opacity-75 border-t pt-2 mt-2">
                      <Lightbulb className="h-3 w-3 inline mr-1" />
                      {insight.learningNote}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Learning Progress */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2">Your Learning Journey</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Sessions Completed:</span>
              <span className="font-semibold ml-1">{userLearningProfile.sessionCount}</span>
            </div>
            <div>
              <span className="text-gray-600">Adaptive Level:</span>
              <span className="font-semibold ml-1">{userLearningProfile.adaptiveLevel}/10</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-600 text-sm">Mastered Patterns:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {userLearningProfile.previousPatterns.map((pattern, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {pattern}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}