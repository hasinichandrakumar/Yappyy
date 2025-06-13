import React, { useState, useEffect } from 'react';
import { Dna, Star, TrendingUp, User, Zap, Heart, Brain, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface SpeechPersona {
  type: string;
  title: string;
  description: string;
  strengths: string[];
  characteristics: string[];
  communicationStyle: string;
  recommendations: string[];
  avatar: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface DNAInsight {
  category: string;
  trait: string;
  score: number;
  description: string;
  developmentTip: string;
}

export default function PersonalizedSpeechDNA() {
  const [speechPersona, setSpeechPersona] = useState<SpeechPersona | null>(null);
  const [dnaInsights, setDnaInsights] = useState<DNAInsight[]>([]);
  const [hasSessionData, setHasSessionData] = useState(false);

  const { data: sessions } = useQuery({
    queryKey: ['/api/practice-sessions'],
    enabled: true
  });

  const { data: userPersona } = useQuery({
    queryKey: ['/api/speech-persona'],
    enabled: true
  });

  // Mock persona data - replace with OpenAI generated analysis
  const generatePersona = (sessionData: any[]): SpeechPersona => {
    // This would use OpenAI to analyze session patterns and generate persona
    return {
      type: 'confident_storyteller',
      title: 'The Confident Storyteller',
      description: 'You have a natural gift for weaving compelling narratives that captivate your audience. Your speaking style combines warmth with authority, making complex ideas accessible through personal anecdotes and vivid examples.',
      strengths: [
        'Excellent narrative structure',
        'Authentic emotional expression',
        'Strong voice projection',
        'Natural audience connection'
      ],
      characteristics: [
        'Uses personal anecdotes effectively',
        'Varies tone for emotional impact',
        'Maintains good eye contact',
        'Gestures support key points'
      ],
      communicationStyle: 'Your communication style is warm yet authoritative. You excel at making complex topics relatable through storytelling, and your authentic delivery creates trust with your audience. You naturally vary your pace and tone to maintain engagement.',
      recommendations: [
        'Continue developing your signature storytelling techniques',
        'Practice with more structured business presentations',
        'Work on seamless transitions between stories and data',
        'Develop your impromptu speaking skills'
      ],
      avatar: '🎭',
      colorScheme: {
        primary: 'bg-purple-500',
        secondary: 'bg-blue-500',
        accent: 'bg-pink-500'
      }
    };
  };

  const generateDNAInsights = (): DNAInsight[] => {
    return [
      {
        category: 'Voice & Delivery',
        trait: 'Vocal Variety',
        score: 85,
        description: 'You naturally vary your tone and pace to create engaging delivery',
        developmentTip: 'Practice with different emotional contexts to expand your range'
      },
      {
        category: 'Content Structure',
        trait: 'Narrative Flow',
        score: 92,
        description: 'Your stories have clear beginnings, middles, and satisfying conclusions',
        developmentTip: 'Apply this storytelling skill to data-driven presentations'
      },
      {
        category: 'Audience Connection',
        trait: 'Authenticity',
        score: 88,
        description: 'Your genuine personality shines through, creating trust with listeners',
        developmentTip: 'Maintain this authenticity in formal business settings'
      },
      {
        category: 'Physical Presence',
        trait: 'Confident Posture',
        score: 78,
        description: 'You project confidence through your body language and stance',
        developmentTip: 'Work on purposeful movement to enhance your presence'
      },
      {
        category: 'Adaptability',
        trait: 'Audience Awareness',
        score: 82,
        description: 'You adjust your style based on audience feedback and engagement',
        developmentTip: 'Practice reading virtual audience cues for online presentations'
      }
    ];
  };

  useEffect(() => {
    // Check if user has session data
    const mockSessions = [
      { id: '1', name: 'Job Interview Practice' },
      { id: '2', name: 'Presentation Practice' }
    ];
    
    if (mockSessions.length > 0) {
      setHasSessionData(true);
      setSpeechPersona(generatePersona(mockSessions));
      setDnaInsights(generateDNAInsights());
    }
  }, [sessions]);

  if (!hasSessionData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Dna className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start a session to generate your Speech DNA</h3>
          <p className="text-gray-600 mb-4">
            Complete your first practice session to unlock your personalized speaking persona and detailed analysis
          </p>
          <Button>
            <Target className="w-4 h-4 mr-2" />
            Start Practice Session
          </Button>
        </div>
      </div>
    );
  }

  if (!speechPersona) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Generating your Speech DNA...</h3>
          <p className="text-gray-600">AI is analyzing your speaking patterns to create your personalized profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Speech Persona Card */}
      <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">{speechPersona.avatar}</div>
              <div>
                <CardTitle className="text-2xl text-purple-900">{speechPersona.title}</CardTitle>
                <Badge className="mt-2 bg-purple-100 text-purple-800 border-purple-300">
                  Your Speaking Persona
                </Badge>
              </div>
            </div>
            <Dna className="w-8 h-8 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 text-lg leading-relaxed">{speechPersona.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Your Strengths
              </h4>
              <div className="space-y-2">
                {speechPersona.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    {strength}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Key Characteristics
              </h4>
              <div className="space-y-2">
                {speechPersona.characteristics.map((characteristic, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {characteristic}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Your Communication Style
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{speechPersona.communicationStyle}</p>
        </CardContent>
      </Card>

      {/* DNA Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Speech DNA Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dnaInsights.map((insight, index) => (
              <div key={index} className="border-l-4 border-purple-400 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{insight.trait}</h4>
                    <p className="text-sm text-gray-600">{insight.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{insight.score}</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
                
                <Progress value={insight.score} className="h-3 mb-3" />
                
                <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                
                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">
                    <strong>Development tip:</strong> {insight.developmentTip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-orange-600" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {speechPersona.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-orange-800 flex-1">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}