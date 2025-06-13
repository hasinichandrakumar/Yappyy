import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Target, TrendingUp, Volume2, Eye, MessageCircle, BarChart3, Play, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';

interface SessionData {
  id: string;
  name: string;
  purpose: string;
  date: string;
  duration: number;
  metrics: {
    volume: number;
    clarity: number;
    pace: number;
    wordsSpoken: number;
    fillerWords: number;
  };
  aiAnalysis: {
    bodyLanguage: string;
    content: string;
    voice: string;
    overall: string;
    purposeAlignment: number;
    improvements: string[];
    strengths: string[];
  };
  videoUrl?: string;
  audioUrl?: string;
}

interface SessionAnalysisProps {
  selectedSessionId?: string;
}

export default function ComprehensiveSessionAnalysis({ selectedSessionId }: SessionAnalysisProps) {
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);

  // Mock session data - replace with actual API call
  const mockSessions: SessionData[] = [
    {
      id: '1',
      name: 'Job Interview Practice',
      purpose: 'Practice answering behavioral questions with confidence and clear structure',
      date: '2024-01-15',
      duration: 480,
      metrics: {
        volume: 75,
        clarity: 82,
        pace: 145,
        wordsSpoken: 189,
        fillerWords: 7
      },
      aiAnalysis: {
        bodyLanguage: "Good posture and eye contact throughout most of the session. Noticed some hand fidgeting during the first 2 minutes, but this improved significantly. Your facial expressions were engaging and authentic, particularly when discussing your achievements. Consider maintaining more consistent gestures to emphasize key points.",
        content: "Your responses followed the STAR method effectively. The opening was strong and structured. However, your conclusion could be more impactful - consider ending with specific outcomes or learnings. The middle section showed good storytelling skills, but some examples could be more concise to maintain engagement.",
        voice: "Voice clarity was excellent with good projection. Pace was appropriate for interview settings. Noticed slight vocal fry in the beginning which disappeared as you became more comfortable. Your tone variation was good when expressing enthusiasm about achievements. Consider practicing breath control for longer responses.",
        overall: "Strong performance overall with clear preparation evident. Your confidence grew throughout the session, which shows good adaptability. The session purpose was well-aligned with your delivery - you demonstrated professional communication skills suitable for interview settings.",
        purposeAlignment: 87,
        improvements: [
          "Reduce hand fidgeting in opening minutes",
          "Strengthen conclusion statements",
          "Practice breath control for longer responses",
          "Maintain consistent eye contact"
        ],
        strengths: [
          "Excellent STAR method implementation",
          "Strong voice projection and clarity",
          "Good storytelling with authentic examples",
          "Professional posture and presence"
        ]
      },
      videoUrl: '/mock-video-1.mp4',
      audioUrl: '/mock-audio-1.wav'
    },
    {
      id: '2',
      name: 'Presentation Practice',
      purpose: 'Work on engaging storytelling and reducing filler words',
      date: '2024-01-14',
      duration: 360,
      metrics: {
        volume: 68,
        clarity: 76,
        pace: 160,
        wordsSpoken: 156,
        fillerWords: 12
      },
      aiAnalysis: {
        bodyLanguage: "Dynamic use of gestures that enhanced your storytelling. Good stage presence with purposeful movement. Eye contact could be more varied - you focused well on the center but could engage more with different areas of the audience. Your facial expressions were animated and helped convey emotion effectively.",
        content: "Storytelling structure was compelling with a clear narrative arc. Your opening hook was particularly strong. The middle section maintained good flow, though some transitions could be smoother. You successfully wove in personal anecdotes that made the content relatable and memorable.",
        voice: "Pace was slightly fast during exciting parts of the story, which is natural but consider slowing down for key points. Voice variety was good with effective use of pauses. Volume was appropriate but could be projected slightly more. Filler words were noticeable - 12 instances, mainly 'um' during transitions.",
        overall: "Engaging presentation with strong storytelling elements. Your passion for the topic was evident and infectious. The session achieved its purpose of practicing storytelling, though filler word reduction needs continued work. Overall delivery was confident and authentic.",
        purposeAlignment: 74,
        improvements: [
          "Reduce filler words during transitions",
          "Vary eye contact across different areas",
          "Control pace during exciting moments",
          "Increase volume projection"
        ],
        strengths: [
          "Compelling storytelling structure",
          "Dynamic and purposeful gestures",
          "Strong emotional expression",
          "Authentic personal anecdotes"
        ]
      },
      videoUrl: '/mock-video-2.mp4',
      audioUrl: '/mock-audio-2.wav'
    }
  ];

  // Use the provided session ID or default to first session
  useEffect(() => {
    const session = selectedSessionId 
      ? mockSessions.find(s => s.id === selectedSessionId)
      : mockSessions[0];
    setSelectedSession(session || null);
  }, [selectedSessionId]);

  const { data: sessions } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  if (!selectedSession) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Session Selected</h3>
          <p className="text-gray-600">Select a session from the dropdown above to view detailed analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSession.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(selectedSession.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {Math.floor(selectedSession.duration / 60)}:{(selectedSession.duration % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Watch Recording
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-start space-x-2">
            <Target className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Session Purpose</h4>
              <p className="text-gray-700 mt-1">{selectedSession.purpose}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Purpose Alignment Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Progress value={selectedSession.aiAnalysis.purposeAlignment} className="h-3" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {selectedSession.aiAnalysis.purposeAlignment}%
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            How well your performance aligned with your stated session purpose
          </p>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="voice">Voice Analysis</TabsTrigger>
          <TabsTrigger value="body">Body Language</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Session Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Volume</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedSession.metrics.volume} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{selectedSession.metrics.volume}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Clarity</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedSession.metrics.clarity} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{selectedSession.metrics.clarity}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedSession.metrics.pace}</p>
                    <p className="text-xs text-gray-600">WPM</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedSession.metrics.wordsSpoken}</p>
                    <p className="text-xs text-gray-600">Words</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{selectedSession.metrics.fillerWords}</p>
                    <p className="text-xs text-gray-600">Filler Words</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths & Improvements */}
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                  <div className="space-y-1">
                    {selectedSession.aiAnalysis.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-orange-700 mb-2">Areas for Improvement</h4>
                  <div className="space-y-1">
                    {selectedSession.aiAnalysis.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                        {improvement}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>AI Coach Overall Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{selectedSession.aiAnalysis.overall}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="w-5 h-5 mr-2" />
                Voice & Speech Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{selectedSession.aiAnalysis.voice}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="body" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Body Language Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{selectedSession.aiAnalysis.bodyLanguage}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Content & Structure Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{selectedSession.aiAnalysis.content}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}