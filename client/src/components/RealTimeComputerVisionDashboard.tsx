// Real-Time Computer Vision Dashboard
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Eye, User, Smile, TrendingUp } from 'lucide-react';

interface ComputerVisionDashboardProps {
  // MediaPipe Holistic data
  mediaPipePosture: number | null;
  mediaPipeGesture: number | null;
  mediaPipeEyeContact: number | null;
  isMediaPipeInitialized: boolean;
  
  // Body language analysis
  bodyLanguageMetrics: any;
  isBodyLanguageActive: boolean;
  
  // Facial analysis
  facialAnalysis: any;
  isFacialAnalysisActive: boolean;
  
  // Roboflow analysis
  roboflowAnalysis: any;
  isRoboflowAnalyzing: boolean;
}

export default function RealTimeComputerVisionDashboard({
  mediaPipePosture,
  mediaPipeGesture,
  mediaPipeEyeContact,
  isMediaPipeInitialized,
  bodyLanguageMetrics,
  isBodyLanguageActive,
  facialAnalysis,
  isFacialAnalysisActive,
  roboflowAnalysis,
  isRoboflowAnalyzing
}: ComputerVisionDashboardProps) {
  
  // Calculate overall computer vision status
  const computerVisionSystems = [
    isMediaPipeInitialized,
    isBodyLanguageActive, 
    isFacialAnalysisActive,
    isRoboflowAnalyzing
  ];
  const activeSystemsCount = computerVisionSystems.filter(Boolean).length;
  const overallStatus = activeSystemsCount > 0 ? 'active' : 'inactive';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Computer Vision Analysis
          <Badge 
            variant={overallStatus === 'active' ? 'default' : 'secondary'}
            className={overallStatus === 'active' ? 'bg-green-500' : ''}
          >
            {activeSystemsCount}/4 Systems Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* System Status */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isMediaPipeInitialized ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm">MediaPipe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isBodyLanguageActive ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm">Body Language</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isFacialAnalysisActive ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm">Facial Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRoboflowAnalyzing ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="text-sm">Roboflow Vision</span>
          </div>
        </div>
        
        {/* Real-time Metrics */}
        {activeSystemsCount > 0 ? (
          <div className="space-y-3">
            
            {/* Eye Contact */}
            {(mediaPipeEyeContact !== null || bodyLanguageMetrics?.eyeContact || facialAnalysis?.facialMetrics?.communicationSignals?.eyeContactQuality) && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    Eye Contact
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(mediaPipeEyeContact || 
                      bodyLanguageMetrics?.eyeContact?.engagement || 
                      facialAnalysis?.facialMetrics?.communicationSignals?.eyeContactQuality || 0)}%
                  </span>
                </div>
                <Progress 
                  value={mediaPipeEyeContact || 
                    bodyLanguageMetrics?.eyeContact?.engagement || 
                    facialAnalysis?.facialMetrics?.communicationSignals?.eyeContactQuality || 0}
                  className="h-2"
                />
              </div>
            )}
            
            {/* Posture Confidence */}
            {(mediaPipePosture !== null || bodyLanguageMetrics?.posture || roboflowAnalysis?.posture) && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Posture
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(mediaPipePosture || 
                      bodyLanguageMetrics?.posture?.confidence || 
                      roboflowAnalysis?.posture?.confidence || 0)}%
                  </span>
                </div>
                <Progress 
                  value={mediaPipePosture || 
                    bodyLanguageMetrics?.posture?.confidence || 
                    roboflowAnalysis?.posture?.confidence || 0}
                  className="h-2"
                />
              </div>
            )}
            
            {/* Gesture Effectiveness */}
            {(mediaPipeGesture !== null || bodyLanguageMetrics?.gestures || roboflowAnalysis?.gestures) && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Gestures
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(mediaPipeGesture || 
                      bodyLanguageMetrics?.gestures?.naturalness || 
                      roboflowAnalysis?.gestures?.effectiveness || 0)}%
                  </span>
                </div>
                <Progress 
                  value={mediaPipeGesture || 
                    bodyLanguageMetrics?.gestures?.naturalness || 
                    roboflowAnalysis?.gestures?.effectiveness || 0}
                  className="h-2"
                />
              </div>
            )}
            
            {/* Facial Expression */}
            {facialAnalysis?.facialMetrics?.emotionalExpression && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Smile className="w-4 h-4" />
                    Expression
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(facialAnalysis.facialMetrics.emotionalExpression.confidence || 0)}%
                  </span>
                </div>
                <Progress 
                  value={facialAnalysis.facialMetrics.emotionalExpression.confidence || 0}
                  className="h-2"
                />
              </div>
            )}
            
            {/* Computer Vision Insights */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Live Insights</h4>
              <div className="space-y-1 text-xs text-gray-600">
                {isMediaPipeInitialized && <p>• MediaPipe analyzing pose and face in real-time</p>}
                {isBodyLanguageActive && <p>• Advanced body language detection active</p>}
                {isFacialAnalysisActive && <p>• Emotional expression analysis running</p>}
                {isRoboflowAnalyzing && <p>• Professional computer vision processing frames</p>}
                {activeSystemsCount === 0 && <p>• Start recording to activate computer vision analysis</p>}
              </div>
            </div>
            
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Computer vision will activate when recording starts</p>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
}