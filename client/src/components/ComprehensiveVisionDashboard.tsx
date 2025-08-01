import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useComprehensiveVision } from '@/hooks/useComprehensiveVision';
import { 
  Eye, Users, Camera, Brain, Activity, Zap, 
  CheckCircle, AlertCircle, XCircle, PlayCircle, 
  StopCircle, Settings, TrendingUp, Target
} from 'lucide-react';

interface ComprehensiveVisionDashboardProps {
  isActive: boolean;
  onAnalysisUpdate?: (analysis: any) => void;
}

export function ComprehensiveVisionDashboard({ 
  isActive, 
  onAnalysisUpdate 
}: ComprehensiveVisionDashboardProps) {
  const {
    isAnalyzing,
    analysis,
    engineStatus,
    error,
    analyzeFrame,
    startContinuousAnalysis,
    initializeVideo,
    stopVideo,
    reset,
    getEnginesSummary,
    videoRef,
    canvasRef
  } = useComprehensiveVision();

  const [continuousAnalysis, setContinuousAnalysis] = useState<(() => void) | null>(null);
  const [isVideoInitialized, setIsVideoInitialized] = useState(false);

  useEffect(() => {
    if (analysis && onAnalysisUpdate) {
      onAnalysisUpdate(analysis);
    }
  }, [analysis, onAnalysisUpdate]);

  useEffect(() => {
    if (isActive && !isVideoInitialized) {
      initializeVideo().then(setIsVideoInitialized);
    } else if (!isActive && isVideoInitialized) {
      stopVideo();
      setIsVideoInitialized(false);
      if (continuousAnalysis) {
        continuousAnalysis();
        setContinuousAnalysis(null);
      }
    }
  }, [isActive, isVideoInitialized, initializeVideo, stopVideo, continuousAnalysis]);

  const handleStartAnalysis = () => {
    if (continuousAnalysis) {
      continuousAnalysis();
    }
    const stopFn = startContinuousAnalysis(3000); // Analyze every 3 seconds
    setContinuousAnalysis(() => stopFn);
  };

  const handleStopAnalysis = () => {
    if (continuousAnalysis) {
      continuousAnalysis();
      setContinuousAnalysis(null);
    }
  };

  const getEngineStatusIcon = (engineName: string, available: boolean) => {
    if (!available) return <XCircle className="w-4 h-4 text-red-500" />;
    
    switch (engineName) {
      case 'Google Cloud Vision':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Enhanced MediaPipe':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'OpenPose':
        return available ? <CheckCircle className="w-4 h-4 text-purple-500" /> : <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isActive) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Comprehensive Computer Vision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Computer vision analysis will activate when you start practicing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hidden video and canvas elements */}
      <div className="hidden">
        <video ref={videoRef} autoPlay muted className="w-full" />
        <canvas ref={canvasRef} />
      </div>

      {/* Engine Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              CV Engine Status
            </span>
            <Badge variant={engineStatus ? 'default' : 'secondary'}>
              {engineStatus ? `${engineStatus.availableEngines}/${engineStatus.totalEngines}` : 'Loading'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {engineStatus ? (
            <div className="space-y-2">
              {engineStatus.engines.map((engine) => (
                <div key={engine.name} className="flex items-center justify-between">
                  <span className="text-xs flex items-center gap-2">
                    {getEngineStatusIcon(engine.name, engine.available)}
                    {engine.name}
                  </span>
                  <Badge variant={engine.available ? 'default' : 'outline'} className="text-xs">
                    {engine.available ? 'Active' : 'Offline'}
                  </Badge>
                </div>
              ))}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-600">Primary: {engineStatus.primaryEngine}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Initializing engines...</p>
          )}
        </CardContent>
      </Card>

      {/* Analysis Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Real-Time Analysis
            </span>
            {isAnalyzing && <Badge variant="secondary" className="animate-pulse">Analyzing</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            {!continuousAnalysis ? (
              <Button 
                onClick={handleStartAnalysis} 
                size="sm" 
                disabled={!isVideoInitialized || isAnalyzing}
                className="flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                Start Analysis
              </Button>
            ) : (
              <Button 
                onClick={handleStopAnalysis} 
                size="sm" 
                variant="outline"
                className="flex items-center gap-2"
              >
                <StopCircle className="w-4 h-4" />
                Stop Analysis
              </Button>
            )}
            
            <Button 
              onClick={() => analyzeFrame()} 
              size="sm" 
              variant="outline"
              disabled={!isVideoInitialized || isAnalyzing}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Single Frame
            </Button>
          </div>
          
          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Facial Expression Analysis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4" />
                Facial Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs">Emotion</span>
                <Badge variant="outline">{analysis.facialExpression.emotion}</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Eye Contact</span>
                  <span className={`text-xs font-medium ${getScoreColor(analysis.facialExpression.eyeContact)}`}>
                    {analysis.facialExpression.eyeContact}%
                  </span>
                </div>
                <Progress value={analysis.facialExpression.eyeContact} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Engagement</span>
                  <span className={`text-xs font-medium ${getScoreColor(analysis.facialExpression.engagement)}`}>
                    {analysis.facialExpression.engagement}%
                  </span>
                </div>
                <Progress value={analysis.facialExpression.engagement} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Confidence</span>
                  <span className={`text-xs font-medium ${getScoreColor(analysis.facialExpression.confidence)}`}>
                    {Math.round(analysis.facialExpression.confidence)}%
                  </span>
                </div>
                <Progress value={analysis.facialExpression.confidence} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Body Pose Analysis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                Body Language
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs">Posture</span>
                <Badge variant="outline">{analysis.bodyPose.posture}</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Posture Score</span>
                  <span className={`text-xs font-medium ${getScoreColor(analysis.bodyPose.postureScore)}`}>
                    {analysis.bodyPose.postureScore}%
                  </span>
                </div>
                <Progress value={analysis.bodyPose.postureScore} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Detection Confidence</span>
                  <span className={`text-xs font-medium ${getScoreColor(analysis.bodyPose.confidence)}`}>
                    {Math.round(analysis.bodyPose.confidence)}%
                  </span>
                </div>
                <Progress value={analysis.bodyPose.confidence} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Hand Gestures */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4" />
                Hand Gestures
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Left Hand</span>
                  <Badge variant="outline">{analysis.handGestures.leftHand.gesture}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Right Hand</span>
                  <Badge variant="outline">{analysis.handGestures.rightHand.gesture}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Left Confidence</span>
                  <span className={`text-xs font-medium ${getScoreColor(analysis.handGestures.leftHand.confidence)}`}>
                    {Math.round(analysis.handGestures.leftHand.confidence)}%
                  </span>
                </div>
                <Progress value={analysis.handGestures.leftHand.confidence} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Right Confidence</span>
                  <span className={`text-xs font-medium ${getScoreColor(analysis.handGestures.rightHand.confidence)}`}>
                    {Math.round(analysis.handGestures.rightHand.confidence)}%
                  </span>
                </div>
                <Progress value={analysis.handGestures.rightHand.confidence} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Overall Presence */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                Overall Presence
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.overallPresence)}`}>
                  {analysis.overallPresence}%
                </div>
                <div className="text-xs text-gray-600">Overall Presence Score</div>
              </div>
              
              <Progress value={analysis.overallPresence} className="h-3" />
              
              <div className="text-xs text-center text-gray-600">
                Based on eye contact, engagement, and posture
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Real-time Tips */}
      {analysis && analysis.overallPresence < 70 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Presence Tips</p>
                <div className="text-xs text-yellow-700 mt-1">
                  {analysis.facialExpression.eyeContact < 60 && (
                    <p>• Try to look directly at the camera more often</p>
                  )}
                  {analysis.bodyPose.postureScore < 70 && (
                    <p>• Sit or stand up straighter to improve your posture</p>
                  )}
                  {analysis.facialExpression.engagement < 60 && (
                    <p>• Show more facial expression and energy</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}