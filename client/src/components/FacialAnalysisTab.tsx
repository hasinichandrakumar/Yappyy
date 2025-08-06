import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Activity, Smile, Eye, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAdvancedFacialAnalysis } from '@/hooks/useAdvancedFacialAnalysis';

interface FacialAnalysisTabProps {
  isRecording: boolean;
}

export default function FacialAnalysisTab({ isRecording }: FacialAnalysisTabProps) {
  const {
    isInitialized,
    isAnalyzing,
    currentMetrics,
    analysisHistory,
    error,
    videoRef,
    canvasRef,
    initialize,
    startAnalysis,
    stopAnalysis
  } = useAdvancedFacialAnalysis();

  const [selectedTab, setSelectedTab] = useState('realtime');

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isRecording && isInitialized && !isAnalyzing) {
      startAnalysis();
    } else if (!isRecording && isAnalyzing) {
      stopAnalysis();
    }
  }, [isRecording, isInitialized, isAnalyzing, startAnalysis, stopAnalysis]);

  const getEmotionColor = (score: number) => {
    if (score > 0.8) return 'text-green-600';
    if (score > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderRealtimeMetrics = () => {
    if (!currentMetrics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emotional Expression Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Emotional Expression</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(currentMetrics.emotionScores).map(([emotion, score]) => (
                <div key={emotion} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="capitalize">{emotion}</span>
                    <span className={getEmotionColor(score)}>{Math.round(score * 100)}%</span>
                  </div>
                  <Progress value={score * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Engagement Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span>Engagement Score</span>
                  <span className={getEmotionColor(currentMetrics.engagementScore)}>
                    {Math.round(currentMetrics.engagementScore * 100)}%
                  </span>
                </div>
                <Progress value={currentMetrics.engagementScore * 100} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span>Expressiveness</span>
                  <span className={getEmotionColor(currentMetrics.expressiveness)}>
                    {Math.round(currentMetrics.expressiveness * 100)}%
                  </span>
                </div>
                <Progress value={currentMetrics.expressiveness * 100} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span>Naturalness</span>
                  <span className={getEmotionColor(currentMetrics.naturalness)}>
                    {Math.round(currentMetrics.naturalness * 100)}%
                  </span>
                </div>
                <Progress value={currentMetrics.naturalness * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Metrics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Advanced Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Expression Variability</span>
                <Badge variant="outline">
                  {Math.round(currentMetrics.expressionVariability * 100)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Expression Consistency</span>
                <Badge variant="outline">
                  {Math.round(currentMetrics.expressionConsistency * 100)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Micro-Expressions</span>
                <Badge variant="outline">
                  {currentMetrics.microExpressions.length} detected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Recommendations Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smile className="w-5 h-5" />
              <span>Live Feedback</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {analysisHistory.slice(-3).reverse().map((analysis, index) => (
                analysis.recommendations.map((rec, recIndex) => (
                  <Alert key={`${index}-${recIndex}`} className="mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium">{rec.observation}</div>
                      <div className="text-sm text-muted-foreground">{rec.recommendation}</div>
                    </AlertDescription>
                  </Alert>
                ))
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderHistoricalAnalysis = () => {
    // Implementation for historical analysis view
    return (
      <div>
        {/* Add historical analysis visualization */}
      </div>
    );
  };

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="realtime">Real-time Analysis</TabsTrigger>
          <TabsTrigger value="historical">Historical Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="realtime">
          {renderRealtimeMetrics()}
        </TabsContent>
        <TabsContent value="historical">
          {renderHistoricalAnalysis()}
        </TabsContent>
      </Tabs>

      {/* Hidden video element for facial analysis */}
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        width="640"
        height="480"
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width="640"
        height="480"
      />
    </div>
  );
}