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
              className={selectedTimeFrame === timeframe ? 
                'bg-gradient-to-br from-[#1e40af] to-[#0ea5e9] hover:from-[#1d4ed8] hover:to-[#0284c7] shadow-lg' : 
                'border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200'
              }
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Overall Score</p>
              <p className="text-4xl font-bold bg-gradient-to-br from-[#1e40af] to-[#0ea5e9] bg-clip-text text-transparent">{mockData.overall.averageScore}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-sm font-medium text-emerald-600">+{mockData.overall.improvement}% this {selectedTimeFrame}</span>
              </div>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-[#1e40af] to-[#0ea5e9] rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-white to-emerald-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Practice Time</p>
              <p className="text-4xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">{mockData.overall.totalMinutes}m</p>
              <p className="text-sm font-medium text-gray-500">{mockData.overall.totalSessions} sessions completed</p>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Clock className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-white to-purple-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Weekly Goal</p>
              <p className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-violet-600 bg-clip-text text-transparent">{mockData.overall.weeklyProgress}%</p>
              <div className="mt-3">
                <Progress value={mockData.overall.weeklyProgress} className="h-2 bg-purple-100" />
              </div>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-white to-orange-50/30 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Speaking Pace</p>
              <p className="text-4xl font-bold bg-gradient-to-br from-orange-600 to-red-500 bg-clip-text text-transparent">{mockData.voice.averageWPM}</p>
              <p className="text-sm font-medium text-gray-500">words per minute</p>
            </div>
            <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="h-7 w-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="voice" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-100 shadow-lg rounded-xl p-1">
          <TabsTrigger value="voice" className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#1e40af] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-lg">
            <Mic className="h-4 w-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="body-language" className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#1e40af] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-lg">
            <Eye className="h-4 w-4" />
            Body Language
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#1e40af] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-lg">
            <MessageSquare className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#1e40af] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-white data-[state=active]:shadow-lg">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        {/* Voice Analysis */}
        <TabsContent value="voice" className="space-y-6">
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Voice Quality Analysis</h3>
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
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Body Language & Presence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">{mockData.bodyLanguage.eyeContact}%</div>
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Eye Contact</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-br from-emerald-600 to-emerald-700 bg-clip-text text-transparent">{mockData.bodyLanguage.posture}%</div>
                <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Posture</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-purple-700 bg-clip-text text-transparent">{mockData.bodyLanguage.gestures}%</div>
                <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Gestures</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-br from-orange-600 to-orange-700 bg-clip-text text-transparent">{mockData.bodyLanguage.confidence}%</div>
                <div className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Confidence</div>
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
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Content Quality Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-br from-[#1e40af] to-[#0ea5e9] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-br from-[#1e40af] to-[#0ea5e9] bg-clip-text text-transparent mb-2">{mockData.content.structure}%</div>
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Structure & Flow</div>
                <Progress value={mockData.content.structure} className="h-2" />
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">{mockData.content.engagement}%</div>
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Audience Engagement</div>
                <Progress value={mockData.content.engagement} className="h-2" />
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">{mockData.content.purposeAlignment}%</div>
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Purpose Alignment</div>
                <Progress value={mockData.content.purposeAlignment} className="h-2" />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Trends Analysis */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="p-8 bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance Trends</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-6">Category Performance</h4>
                <div className="space-y-4">
                  {mockData.trends.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full shadow-lg ${category.trend === 'up' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-red-400 to-red-600'}`}></div>
                        <span className="font-semibold text-gray-800">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {category.trend === 'up' ? (
                          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-700">+{category.current - category.previous}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded-lg">
                            <TrendingDown className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-medium text-red-700">{category.current - category.previous}</span>
                          </div>
                        )}
                        <span className="text-lg font-bold text-gray-900">{category.current}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-6">Weekly Progress</h4>
                <div className="space-y-3">
                  {mockData.trends.last7Days.map((score, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100">
                      <span className="text-sm font-semibold text-gray-700 w-16">Day {index + 1}</span>
                      <Progress value={score} className="flex-1 h-3" />
                      <span className="text-sm font-bold text-gray-900 w-12">{score}%</span>
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