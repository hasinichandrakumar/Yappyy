import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Eye, 
  Mic, 
  FileText, 
  Target,
  Clock,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap
} from "lucide-react";

interface OverviewMetric {
  category: 'body' | 'voice' | 'content' | 'overall';
  label: string;
  score: number;
  previousScore?: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  insights: string[];
}

interface SessionSummary {
  duration: string;
  wordsSpoken: number;
  averagePace: number;
  keyStrengths: string[];
  priorityImprovements: string[];
  overallScore: number;
  sessionDate: Date;
}

export default function AnalysisOverview() {
  const [metrics, setMetrics] = useState<OverviewMetric[]>([]);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);

  useEffect(() => {
    // Check if user has completed any practice sessions
    // Only show data if authentic sessions exist
    const hasActiveSessions = false; // This will be connected to real session data
    
    if (!hasActiveSessions) {
      setMetrics([]);
      setSessionSummary(null);
      return;
    }
    
    // Load comprehensive overview data only when sessions exist
    const overviewData: OverviewMetric[] = [
      {
        category: 'overall',
        label: 'Overall Performance',
        score: 78,
        previousScore: 71,
        trend: 'up',
        status: 'good',
        insights: [
          'Significant improvement in confidence delivery',
          'Eye contact has improved by 12% since last session',
          'Voice clarity remains consistently strong'
        ]
      },
      {
        category: 'body',
        label: 'Body Language',
        score: 82,
        previousScore: 75,
        trend: 'up',
        status: 'good',
        insights: [
          'Excellent posture maintenance throughout session',
          'Natural gesture usage increased',
          'Eye contact pattern shows professional engagement'
        ]
      },
      {
        category: 'voice',
        label: 'Voice & Delivery',
        score: 75,
        previousScore: 74,
        trend: 'stable',
        status: 'good',
        insights: [
          'Optimal speaking pace achieved',
          'Voice modulation shows good variety',
          'Minor filler word usage detected'
        ]
      },
      {
        category: 'content',
        label: 'Content Structure',
        score: 73,
        previousScore: 68,
        trend: 'up',
        status: 'good',
        insights: [
          'Clear introduction and conclusion',
          'Good use of transitions between points',
          'Could benefit from more supporting evidence'
        ]
      }
    ];

    const summary: SessionSummary = {
      duration: '4m 32s',
      wordsSpoken: 612,
      averagePace: 135,
      keyStrengths: [
        'Confident body posture',
        'Clear voice projection',
        'Structured content flow',
        'Professional eye contact'
      ],
      priorityImprovements: [
        'Reduce filler words (um, uh)',
        'Add more concrete examples',
        'Vary gesture patterns'
      ],
      overallScore: 78,
      sessionDate: new Date()
    };

    setMetrics(overviewData);
    setSessionSummary(summary);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'body': return <Eye className="w-5 h-5" />;
      case 'voice': return <Mic className="w-5 h-5" />;
      case 'content': return <FileText className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  if (!sessionSummary) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
          <CardContent className="py-12">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Data Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Complete your first practice session to see detailed performance analytics and insights.
              </p>
              <Button 
                onClick={() => {
                  // Switch to practice tab
                  const practiceTab = document.querySelector('[data-value="practice"]') as HTMLElement;
                  practiceTab?.click();
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start First Practice Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Summary Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-blue-900">Session Overview</CardTitle>
              <p className="text-blue-700 mt-1">
                {sessionSummary.sessionDate.toLocaleDateString()} • {sessionSummary.duration}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-900">{sessionSummary.overallScore}%</div>
              <p className="text-sm text-blue-600">Overall Score</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">{sessionSummary.duration}</p>
                <p className="text-sm text-gray-600">Duration</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">{sessionSummary.wordsSpoken} words</p>
                <p className="text-sm text-gray-600">Words Spoken</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">{sessionSummary.averagePace} WPM</p>
                <p className="text-sm text-gray-600">Speaking Pace</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(metric.category)}
                  <h3 className="font-semibold text-gray-900">{metric.label}</h3>
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{metric.score}%</span>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status.replace('-', ' ')}
                  </Badge>
                </div>
                <Progress value={metric.score} className="h-2" />
                {metric.previousScore && (
                  <p className="text-sm text-gray-500 mt-2">
                    Previous: {metric.previousScore}% 
                    ({metric.score > metric.previousScore ? '+' : ''}{metric.score - metric.previousScore})
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {metric.insights.slice(0, 2).map((insight, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <Info className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Key Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessionSummary.keyStrengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="text-sm text-green-800">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-700">
              <Target className="w-5 h-5" />
              <span>Priority Improvements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessionSummary.priorityImprovements.map((improvement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <span className="text-sm text-orange-800">{improvement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <div className="font-medium mb-1">Practice Eye Contact</div>
                <div className="text-sm text-gray-600">
                  10-minute focused exercise
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <div className="font-medium mb-1">Voice Clarity Drills</div>
                <div className="text-sm text-gray-600">
                  Reduce filler words
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 text-left">
              <div>
                <div className="font-medium mb-1">Content Structure</div>
                <div className="text-sm text-gray-600">
                  Template practice session
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Detailed performance trends coming soon</p>
              <p className="text-sm">Track your progress over multiple sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}