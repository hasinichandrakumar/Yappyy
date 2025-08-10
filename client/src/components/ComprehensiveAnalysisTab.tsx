import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Mic, 
  FileText, 
  Heart, 
  PlayCircle, 
  PauseCircle,
  Volume2,
  Maximize2,
  SkipBack,
  SkipForward,
  Eye,
  TrendingUp,
  Brain,
  Users,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface ComprehensiveAnalysisTabProps {
  sessionData: any;
  aiInsights?: any;
}

export default function ComprehensiveAnalysisTab({ sessionData, aiInsights }: ComprehensiveAnalysisTabProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Video playback controls
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Prepare data for charts
  const bodyLanguageData = [
    { metric: 'Posture', score: sessionData?.bodyLanguage?.postureScore || 0, fullMark: 100 },
    { metric: 'Gestures', score: sessionData?.bodyLanguage?.gestureScore || 0, fullMark: 100 },
    { metric: 'Eye Contact', score: sessionData?.eyeContactScore || 0, fullMark: 100 },
    { metric: 'Movement', score: sessionData?.bodyLanguage?.movementScore || 0, fullMark: 100 },
    { metric: 'Facial Expression', score: sessionData?.facialAnalysis?.expressiveness || 0, fullMark: 100 },
    { metric: 'Confidence', score: sessionData?.confidenceLevel || 0, fullMark: 100 }
  ];

  const voiceMetricsData = [
    { name: 'Clarity', value: sessionData?.voiceAnalysis?.clarity || 0, color: '#8B5CF6' },
    { name: 'Pace', value: sessionData?.voiceAnalysis?.pace || 0, color: '#3B82F6' },
    { name: 'Volume', value: sessionData?.voiceAnalysis?.volume || 0, color: '#10B981' },
    { name: 'Pitch Variation', value: sessionData?.voiceAnalysis?.pitchVariation || 0, color: '#F59E0B' },
    { name: 'Tone', value: sessionData?.voiceAnalysis?.tone || 0, color: '#EF4444' }
  ];

  const emotionalJourneyData = aiInsights?.emotionalImpact ? [
    { phase: 'Opening', score: aiInsights.emotionalImpact.emotionalJourney.openingEmotionalHook },
    { phase: 'Build-up', score: aiInsights.emotionalImpact.emotionalJourney.emotionalProgression },
    { phase: 'Peak', score: aiInsights.emotionalImpact.emotionalJourney.peakEmotionalMoments },
    { phase: 'Closing', score: aiInsights.emotionalImpact.emotionalJourney.emotionalClosing }
  ] : [];

  const acousticEmotionData = aiInsights?.emotionalImpact ? [
    { name: 'Pitch Variation', value: aiInsights.emotionalImpact.acousticEmotions.pitchVariation },
    { name: 'Volume Dynamics', value: aiInsights.emotionalImpact.acousticEmotions.volumeDynamics },
    { name: 'Speech Rate', value: aiInsights.emotionalImpact.acousticEmotions.speechRateEmotions },
    { name: 'Voice Quality', value: aiInsights.emotionalImpact.acousticEmotions.voiceQualityMarkers }
  ] : [];

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="body" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="body" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Body Analysis
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice Analysis
          </TabsTrigger>
          <TabsTrigger value="transcript" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Transcript
          </TabsTrigger>
          <TabsTrigger value="emotional" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Emotional Impact
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            Video Replay
          </TabsTrigger>
        </TabsList>

        {/* Body Analysis Tab */}
        <TabsContent value="body" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Body Language Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Overall Body Language Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#E5E7EB"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#3B82F6"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - (sessionData?.overallPerformance || 0) / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{sessionData?.overallPerformance || 0}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Posture</span>
                      <span className="font-medium">{sessionData?.bodyLanguage?.postureScore || 0}%</span>
                    </div>
                    <Progress value={sessionData?.bodyLanguage?.postureScore || 0} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Gestures</span>
                      <span className="font-medium">{sessionData?.bodyLanguage?.gestureScore || 0}%</span>
                    </div>
                    <Progress value={sessionData?.bodyLanguage?.gestureScore || 0} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Eye Contact</span>
                      <span className="font-medium">{sessionData?.eyeContactScore || 0}%</span>
                    </div>
                    <Progress value={sessionData?.eyeContactScore || 0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Body Language Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-500" />
                  Body Language Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={bodyLanguageData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Score" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Key Body Language Insights */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-500" />
                  Key Body Language Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiInsights?.bodyLanguageAnalysis?.strengths?.map((strength: string, index: number) => (
                    <Alert key={`strength-${index}`} className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {strength}
                      </AlertDescription>
                    </Alert>
                  ))}
                  {aiInsights?.bodyLanguageAnalysis?.improvements?.map((improvement: string, index: number) => (
                    <Alert key={`improvement-${index}`} className="border-amber-200 bg-amber-50">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        {improvement}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice Analysis Tab */}
        <TabsContent value="voice" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voice Metrics Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-indigo-500" />
                  Voice Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={voiceMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {voiceMetricsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Speech Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Speech Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Words Per Minute</p>
                      <p className="text-2xl font-bold">{sessionData?.wpm || 0}</p>
                      <Badge variant={sessionData?.wpm > 140 && sessionData?.wpm < 180 ? "default" : "secondary"}>
                        {sessionData?.wpm > 180 ? "Too Fast" : sessionData?.wpm < 140 ? "Too Slow" : "Optimal"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Filler Words</p>
                      <p className="text-2xl font-bold">{sessionData?.fillerWordCount || 0}</p>
                      <Badge variant={sessionData?.fillerWordCount < 5 ? "default" : "destructive"}>
                        {sessionData?.fillerWordCount < 5 ? "Excellent" : "Needs Work"}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Clarity</span>
                        <span className="text-sm font-medium">{sessionData?.clarityScore || 0}%</span>
                      </div>
                      <Progress value={sessionData?.clarityScore || 0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Volume Consistency</span>
                        <span className="text-sm font-medium">{sessionData?.volumeConsistency || 0}%</span>
                      </div>
                      <Progress value={sessionData?.volumeConsistency || 0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Pace Consistency</span>
                        <span className="text-sm font-medium">{sessionData?.paceConsistency || 0}%</span>
                      </div>
                      <Progress value={sessionData?.paceConsistency || 0} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice Analysis Insights */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-purple-500" />
                  Voice Analysis Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights?.voiceAnalysis?.insights && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        {aiInsights.voiceAnalysis.insights}
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-green-700">Strengths</h4>
                      <ul className="space-y-1">
                        {aiInsights?.voiceAnalysis?.strengths?.map((strength: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-amber-700">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        {aiInsights?.voiceAnalysis?.improvements?.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transcript Tab */}
        <TabsContent value="transcript" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Speech Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Transcript Controls */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {sessionData?.fillerWordCount || 0} Filler Words
                    </Badge>
                    <Badge variant="secondary">
                      {sessionData?.wpm || 0} WPM
                    </Badge>
                    <Badge variant="secondary">
                      {Math.floor((sessionData?.duration || 0) / 60)}:{((sessionData?.duration || 0) % 60).toString().padStart(2, '0')} Duration
                    </Badge>
                  </div>
                </div>

                {/* Transcript Content */}
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {sessionData?.transcript ? (
                      <div className="text-base leading-relaxed">
                        {sessionData.transcript.split(' ').map((word: string, index: number) => {
                          const isFillerWord = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically'].some(
                            filler => word.toLowerCase().includes(filler)
                          );
                          
                          return (
                            <span
                              key={index}
                              className={`${
                                isFillerWord 
                                  ? 'bg-yellow-200 px-1 rounded cursor-pointer hover:bg-yellow-300' 
                                  : ''
                              } ${selectedWord === word ? 'bg-blue-200' : ''}`}
                              onClick={() => setSelectedWord(word)}
                            >
                              {word}{' '}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">No transcript available for this session.</p>
                    )}
                  </div>
                </ScrollArea>

                {/* Content Analysis */}
                {aiInsights?.contentAnalysis && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Content Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{aiInsights.contentAnalysis.score}%</p>
                        <p className="text-sm text-gray-600">Content Score</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {aiInsights.contentAnalysis.strengths?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">Key Strengths</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">
                          {aiInsights.contentAnalysis.improvements?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">Improvements</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emotional Impact Tab */}
        <TabsContent value="emotional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Emotional Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Overall Emotional Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#FEE2E2"
                          strokeWidth="12"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#EF4444"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - (aiInsights?.emotionalImpact?.overallScore || 0) / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{aiInsights?.emotionalImpact?.overallScore || 0}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Primary Emotions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Primary Emotions Detected</p>
                    <div className="flex flex-wrap gap-2">
                      {aiInsights?.emotionalImpact?.primaryEmotions?.map((emotion: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Authenticity Markers */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Authenticity Markers</p>
                    <div className="flex flex-wrap gap-2">
                      {aiInsights?.emotionalImpact?.authenticityMarkers?.map((marker: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {marker}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emotional Journey */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Emotional Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={emotionalJourneyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="phase" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm text-gray-600">
                  {aiInsights?.emotionalImpact?.emotionalJourney?.insights}
                </div>
              </CardContent>
            </Card>

            {/* Acoustic Emotions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-purple-500" />
                  Acoustic Emotional Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {acousticEmotionData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{item.name}</span>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {aiInsights?.emotionalImpact?.acousticEmotions?.insights}
                </p>
              </CardContent>
            </Card>

            {/* Body Language Emotions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  Body Language Emotional Expression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Gesture Expressiveness</span>
                      <span className="text-sm font-medium">
                        {aiInsights?.emotionalImpact?.bodyLanguageEmotions?.gestureExpressiveness || 0}%
                      </span>
                    </div>
                    <Progress 
                      value={aiInsights?.emotionalImpact?.bodyLanguageEmotions?.gestureExpressiveness || 0} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Facial Expression Range</span>
                      <span className="text-sm font-medium">
                        {aiInsights?.emotionalImpact?.bodyLanguageEmotions?.facialExpressionRange || 0}%
                      </span>
                    </div>
                    <Progress 
                      value={aiInsights?.emotionalImpact?.bodyLanguageEmotions?.facialExpressionRange || 0} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Eye Contact Emotions</span>
                      <span className="text-sm font-medium">
                        {aiInsights?.emotionalImpact?.bodyLanguageEmotions?.eyeContactEmotions || 0}%
                      </span>
                    </div>
                    <Progress 
                      value={aiInsights?.emotionalImpact?.bodyLanguageEmotions?.eyeContactEmotions || 0} 
                      className="h-2" 
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {aiInsights?.emotionalImpact?.bodyLanguageEmotions?.insights}
                </p>
              </CardContent>
            </Card>

            {/* Emotional Recommendations */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Emotional Impact Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights?.emotionalImpact?.emotionalRecommendations?.map((rec: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{rec.title}</h4>
                            <Badge variant={
                              rec.priority === 'high' ? 'destructive' : 
                              rec.priority === 'medium' ? 'default' : 'secondary'
                            }>
                              {rec.priority}
                            </Badge>
                            <Badge variant="outline">{rec.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                          <p className="text-sm text-blue-600 font-medium">
                            Expected Impact: {rec.expectedImpact}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Video Replay Tab */}
        <TabsContent value="video" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-green-500" />
                Session Video Replay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Video Player */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {sessionData?.videoUrl ? (
                    <video
                      ref={videoRef}
                      src={sessionData.videoUrl}
                      className="w-full h-full"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No video available for this session</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Controls */}
                {sessionData?.videoUrl && (
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
                        <input
                          type="range"
                          min={0}
                          max={duration}
                          value={currentTime}
                          onChange={(e) => handleSeek(Number(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600">{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="default"
                        size="lg"
                        onClick={togglePlayPause}
                        className="px-8"
                      >
                        {isPlaying ? (
                          <>
                            <PauseCircle className="w-5 h-5 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-5 h-5 mr-2" />
                            Play
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Volume and Fullscreen */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-gray-600" />
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.1}
                          value={volume}
                          onChange={(e) => handleVolumeChange(Number(e.target.value))}
                          className="w-32"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleFullscreen}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Session Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{sessionData?.overallPerformance || 0}%</p>
                    <p className="text-sm text-gray-600">Overall Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{sessionData?.wpm || 0}</p>
                    <p className="text-sm text-gray-600">Words/Min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{sessionData?.fillerWordCount || 0}</p>
                    <p className="text-sm text-gray-600">Filler Words</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatTime(sessionData?.duration || 0)}</p>
                    <p className="text-sm text-gray-600">Duration</p>
                  </div>
                </div>

                {/* Key Moments */}
                {aiInsights?.keyInsights && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Key Moments & Insights</h4>
                    <div className="space-y-2">
                      {aiInsights.keyInsights.map((insight: any, index: number) => (
                        <Alert key={index}>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <strong>{insight.title}:</strong> {insight.description}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}