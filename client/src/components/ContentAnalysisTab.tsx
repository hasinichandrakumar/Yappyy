import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SuperAdvancedContentDisplay from './SuperAdvancedContentDisplay';
import { 
  FileText, 
  Target, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  BarChart3,
  Brain,
  Sparkles,
  Book,
  Users,
  Megaphone,
  Star,
  Clock,
  RefreshCw,
  Info
} from 'lucide-react';

interface ContentAnalysisTabProps {
  session: any;
}

export default function ContentAnalysisTab({ session }: ContentAnalysisTabProps) {
  const [contentAnalysis, setContentAnalysis] = useState<any>(null);
  const [purposeFeedback, setPurposeFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyze content when session changes
  useEffect(() => {
    if (session?.transcript && session.transcript.trim().length > 0) {
      analyzeContent();
    }
  }, [session]);

  const analyzeContent = async () => {
    if (!session?.transcript || session.transcript.trim().length === 0) {
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log(`🧠 Starting super advanced content analysis for ${session.purpose || 'general-presentation'}`);
      
      const response = await fetch('/api/advanced-content-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: session.transcript,
          purpose: session.purpose || 'general-presentation',
          sessionDuration: session.duration || 0,
          sessionId: session.id || Date.now().toString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.analysis) {
          setContentAnalysis(data.analysis);
          setPurposeFeedback(data.purposeFeedback);
          console.log('🎯 Super advanced content analysis completed:', {
            score: data.analysis.overall.score,
            grade: data.analysis.overall.grade,
            framework: data.analysis.purposeAlignment.framework
          });
        }
      }
    } catch (error) {
      console.error('Super advanced content analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!session?.transcript || session.transcript.trim().length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content to Analyze</h3>
          <p className="text-gray-600">This session doesn't have a transcript available for content analysis.</p>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analyzing your content with super advanced AI for persuasiveness, clarity, structure, and engagement...</p>
        </CardContent>
      </Card>
    );
  }

  if (!contentAnalysis) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Unavailable</h3>
          <p className="text-gray-600 mb-4">Unable to analyze the content. Please try again.</p>
          <Button onClick={analyzeContent} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-bold">Super Advanced Content Analysis</h3>
          {purposeFeedback && (
            <Badge variant="outline" className="ml-2">
              {purposeFeedback.purpose} Analysis
            </Badge>
          )}
        </div>
        <Button 
          onClick={analyzeContent} 
          disabled={isAnalyzing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Re-analyze
        </Button>
      </div>

      <SuperAdvancedContentDisplay 
        analysis={contentAnalysis} 
        purposeFeedback={purposeFeedback}
      />
    </div>
  );
}