import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  Lightbulb, 
  Eye, 
  Volume2, 
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'tip' | 'improvement' | 'strength';
  message: string;
  category: 'voice' | 'body' | 'content';
  priority: 'high' | 'medium' | 'low';
}

export default function SimpleAICoach() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [currentTip, setCurrentTip] = useState<string>("Welcome to your AI Coach! Start practicing to receive personalized feedback.");

  // Sample insights for demonstration
  const sampleInsights: AIInsight[] = [
    {
      id: '1',
      type: 'tip',
      message: 'Maintain steady eye contact with the camera to connect with your audience',
      category: 'body',
      priority: 'high'
    },
    {
      id: '2',
      type: 'improvement',
      message: 'Try varying your speaking pace to add emphasis to key points',
      category: 'voice',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'strength',
      message: 'Great posture! You appear confident and professional',
      category: 'body',
      priority: 'low'
    },
    {
      id: '4',
      type: 'tip',
      message: 'Use pause for emphasis instead of filler words like "um" or "uh"',
      category: 'voice',
      priority: 'high'
    }
  ];

  // Simulate receiving insights during practice
  useEffect(() => {
    const interval = setInterval(() => {
      const randomInsight = sampleInsights[Math.floor(Math.random() * sampleInsights.length)];
      setCurrentTip(randomInsight.message);
      
      setInsights(prev => {
        const newInsights = [randomInsight, ...prev.filter(i => i.id !== randomInsight.id)].slice(0, 5);
        return newInsights;
      });
    }, 10000); // New insight every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'improvement': return <Target className="w-4 h-4 text-blue-500" />;
      case 'strength': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'tip': return 'border-yellow-200 bg-yellow-50';
      case 'improvement': return 'border-blue-200 bg-blue-50';
      case 'strength': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium': return <Badge variant="default" className="text-xs">Medium</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs">Low</Badge>;
      default: return <Badge variant="secondary" className="text-xs">Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Coach Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
            <span>AI Speaking Coach</span>
            <Badge variant="secondary" className="text-xs">Live Analysis</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Current Tip</h4>
                <p className="text-sm text-gray-600">{currentTip}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center space-x-1">
                  <Volume2 className="w-4 h-4" />
                  <span>Voice Quality</span>
                </span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>Body Language</span>
                </span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>Overall Presence</span>
                </span>
                <span className="font-medium">82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Start practicing to receive AI coaching insights</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight) => (
                <div key={insight.id} className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getInsightIcon(insight.type)}
                      <span className="text-xs font-medium text-gray-600 uppercase">
                        {insight.category}
                      </span>
                    </div>
                    {getPriorityBadge(insight.priority)}
                  </div>
                  <p className="text-sm text-gray-700">{insight.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Coaching Focus Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
              <Volume2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold text-sm mb-1">Voice Training</h4>
              <p className="text-xs text-gray-600">Clarity, pace, and tone</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
              <Eye className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold text-sm mb-1">Body Language</h4>
              <p className="text-xs text-gray-600">Posture and gestures</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold text-sm mb-1">Content Flow</h4>
              <p className="text-xs text-gray-600">Structure and clarity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}