import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Mic, 
  MessageSquare, 
  Clock, 
  Target,
  Award,
  Activity,
  Volume2,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function EnhancedAnalysisTab() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('week');
  
  // Mock data for demonstration - in real app this would come from the database
  const mockData = {
    overall: {
      totalSessions: 24,
      totalMinutes: 180,
      averageScore: 82,
      improvement: 15,
      weeklyGoal: 120,
      weeklyProgress: 75
    },
    voice: {
      averageWPM: 145,
      optimalRange: [120, 180],
      clarity: 88,
      volume: 75,
      fillerWords: 12,
      improvement: 8
    },
    bodyLanguage: {
      eyeContact: 76,
      posture: 82,
      gestures: 71,
      confidence: 79,
      improvement: 12
    },
    content: {
      structure: 85,
      engagement: 78,
      purposeAlignment: 92,
      improvement: 5
    },
    trends: {
      last7Days: [68, 72, 75, 78, 80, 82, 85],
      categories: [
        { name: 'Voice Quality', current: 85, previous: 78, trend: 'up' },
        { name: 'Body Language', current: 77, previous: 82, trend: 'down' },
        { name: 'Content Quality', current: 88, previous: 85, trend: 'up' },
        { name: 'Confidence', current: 79, previous: 74, trend: 'up' }
      ]
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 55) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 55) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Speaking Analysis</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your communication skills</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'quarter'].map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeFrame === timeframe ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeFrame(timeframe)}
              className={selectedTimeFrame === timeframe ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : ''}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Score</p>
              <p className="text-3xl font-bold text-gray-900">{mockData.overall.averageScore}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{mockData.overall.improvement}% this {selectedTimeFrame}</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Practice Time</p>
              <p className="text-3xl font-bold text-gray-900">{mockData.overall.totalMinutes}m</p>
              <p className="text-sm text-gray-500">{mockData.overall.totalSessions} sessions</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Goal</p>
              <p className="text-3xl font-bold text-gray-900">{mockData.overall.weeklyProgress}%</p>
              <Progress value={mockData.overall.weeklyProgress} className="mt-2" />
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Speaking Pace</p>
              <p className="text-3xl font-bold text-gray-900">{mockData.voice.averageWPM}</p>
              <p className="text-sm text-gray-500">words per minute</p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-50">
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="body-language" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Body Language
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        {/* Voice Analysis */}
        <TabsContent value="voice" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Voice Quality Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Speaking Pace</span>
                  <Badge className={getScoreColor(mockData.voice.averageWPM <= 180 ? 85 : 65)}>
                    {mockData.voice.averageWPM} WPM
                  </Badge>
                </div>
                <Progress 
                  value={(mockData.voice.averageWPM / 200) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-gray-500">
                  Optimal range: {mockData.voice.optimalRange[0]}-{mockData.voice.optimalRange[1]} WPM
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Voice Clarity</span>
                  <Badge className={getScoreColor(mockData.voice.clarity)}>
                    {mockData.voice.clarity}%
                  </Badge>
                </div>
                <Progress value={mockData.voice.clarity} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Volume Control</span>
                  <Badge className={getScoreColor(mockData.voice.volume)}>
                    {mockData.voice.volume}%
                  </Badge>
                </div>
                <Progress value={mockData.voice.volume} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Areas for Improvement</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Detected {mockData.voice.fillerWords} filler words in recent sessions. 
                    Practice pausing instead of using "um" and "uh".
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Strengths</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your voice clarity has improved by {mockData.voice.improvement}% this {selectedTimeFrame}. 
                    Great articulation and projection!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Body Language Analysis */}
        <TabsContent value="body-language" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Body Language & Presence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">{mockData.bodyLanguage.eyeContact}%</div>
                <div className="text-sm text-blue-600">Eye Contact</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">{mockData.bodyLanguage.posture}%</div>
                <div className="text-sm text-green-600">Posture</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">{mockData.bodyLanguage.gestures}%</div>
                <div className="text-sm text-purple-600">Gestures</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-700">{mockData.bodyLanguage.confidence}%</div>
                <div className="text-sm text-orange-600">Confidence</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Performance Breakdown</h4>
                {Object.entries(mockData.bodyLanguage).filter(([key]) => key !== 'improvement').map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-sm font-medium">{value}%</span>
                    </div>
                    <Progress value={value as number} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">AI Insights</h4>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Body Language Tips</span>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Maintain eye contact for 3-5 seconds at a time</li>
                    <li>• Use open gestures to appear more confident</li>
                    <li>• Keep shoulders back and head level</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Progress Update</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your body language has improved by {mockData.bodyLanguage.improvement}% overall. 
                    Focus on gesture variety for even better results.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Content Analysis */}
        <TabsContent value="content" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Content Quality Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{mockData.content.structure}%</div>
                  <div className="text-sm text-gray-600">Structure & Flow</div>
                  <Progress value={mockData.content.structure} className="mt-2" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{mockData.content.engagement}%</div>
                  <div className="text-sm text-gray-600">Audience Engagement</div>
                  <Progress value={mockData.content.engagement} className="mt-2" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{mockData.content.purposeAlignment}%</div>
                  <div className="text-sm text-gray-600">Purpose Alignment</div>
                  <Progress value={mockData.content.purposeAlignment} className="mt-2" />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Trends Analysis */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Performance Trends</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Category Performance</h4>
                <div className="space-y-4">
                  {mockData.trends.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${category.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {category.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">{category.current}%</span>
                        <span className="text-sm text-gray-500">
                          ({category.trend === 'up' ? '+' : ''}{category.current - category.previous})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Weekly Progress</h4>
                <div className="space-y-2">
                  {mockData.trends.last7Days.map((score, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm w-16">Day {index + 1}</span>
                      <Progress value={score} className="flex-1" />
                      <span className="text-sm w-8">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}