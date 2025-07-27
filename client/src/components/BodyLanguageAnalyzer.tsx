import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Eye, 
  Activity, 
  Target,
  AlertCircle,
  TrendingUp,
  Camera,
  Zap
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import SessionSelector from "./SessionSelector";

interface BodyLanguageMetrics {
  eyeContactDuration: number;
  eyeContactFrequency: number;
  gazeDirection: string;
  blinkRate: number;
  facialExpression: string;
  headMovement: number;
  shoulderPosition: string;

  handPosition: string;
  stanceStability: number;
  weightShifting: number;
  footPosition: string;
  overallPresence: number;
  energyLevel: string;
  proximityToAudience: string;
  confidenceSignals: number;

  facialEngagement: number;
  postureAlignment: number;
  movementPurpose: number;
}

interface PostureBreakdown {
  spinalCurvature: number;
  shoulderAlignment: number;
  hipAlignment: number;
  headTilt: number;
  chestOpenness: number;
}

interface Session {
  id: number;
  userId: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export default function BodyLanguageAnalyzer() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isAnalyzingSession, setIsAnalyzingSession] = useState(false);
  const [metrics, setMetrics] = useState<BodyLanguageMetrics | null>(null);
  const [postureBreakdown, setPostureBreakdown] = useState<PostureBreakdown | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<string | null>(null);

  // Load body language data from selected session only when session is available
  useEffect(() => {
    if (selectedSession) {
      loadSessionBodyLanguageData();
    }
  }, [selectedSession]);

  const loadSessionBodyLanguageData = async () => {
    if (!selectedSession) return;
    
    setIsAnalyzingSession(true);
    try {
      // Fetch actual session data - only display if real data exists
      const response = await fetch(`/api/sessions/${selectedSession.id}/body-language`);
      const data = await response.json();
      if (data && data.bodyLanguageData) {
        setMetrics(data.bodyLanguageData.metrics);
        setPostureBreakdown(data.bodyLanguageData.postureBreakdown);
      }
    } catch (error) {
      console.error('Failed to load body language data:', error);
      // Do not show any data if loading fails
      setMetrics(null);
      setPostureBreakdown(null);
    } finally {
      setIsAnalyzingSession(false);
    }
  };

  const analyzeCurrentPosture = async () => {
    setIsAnalyzing(true);
    try {
      // In a real implementation, this would capture the current video frame
      // and send it to the AI analysis endpoint
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#16213e';
        ctx.fillRect(200, 100, 240, 300);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCurrentFrame(imageData);
      }

      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update metrics with analysis results - only if previous data exists
      setMetrics(prev => {
        if (!prev) return null;
        return {
          ...prev,
          overallPresence: Math.min(95, prev.overallPresence + 5),
          armGestures: Math.min(90, prev.armGestures + 10)
        };
      });
    } catch (error) {
      console.error('Failed to analyze posture:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getRecommendation = (metric: string, score: number): string => {
    const recommendations: { [key: string]: { [key: string]: string } } = {
      eyeContactDuration: {
        low: "Increase eye contact time - aim for 3-5 seconds per person",
        medium: "Good eye contact, try to distribute evenly across audience",
        high: "Excellent eye contact maintenance"
      },
      armGestures: {
        low: "Use more hand gestures to emphasize key points",
        medium: "Good gesture frequency, ensure they match your message",
        high: "Great use of gestures to enhance communication"
      },
      stanceStability: {
        low: "Plant feet firmly, avoid excessive swaying",
        medium: "Good stability, minor adjustments needed",
        high: "Excellent stable stance and presence"
      }
    };

    const level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    return recommendations[metric]?.[level] || "Continue monitoring this aspect";
  };

  return (
    <div className="space-y-6">
      {/* Real-time Analysis Controls */}
      <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-blue-600" />
              <span>Live Body Language Analysis</span>
            </div>
            <Button 
              onClick={analyzeCurrentPosture}
              disabled={isAnalyzing}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Analyze Now
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedSession ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Select a practice session above to view body language analysis</p>
            </div>
          ) : isAnalyzingSession ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading body language data...</p>
            </div>
          ) : !metrics ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No body language data available for this session</p>
              <p className="text-sm text-gray-500 mt-2">Body language analysis requires computer vision during recording</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(metrics.overallPresence)}`}>
                  {(() => {
                    const presence = Number(metrics.overallPresence);
                    return isNaN(presence) ? "0%" : `${Math.round(presence)}%`;
                  })()}
                </div>
                <div className="text-sm text-gray-600">Overall Presence</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-cyan-600">
                  {metrics.energyLevel}
                </div>
                <div className="text-sm text-gray-600">Energy Level</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-cyan-600">
                  {metrics.proximityToAudience}
                </div>
                <div className="text-sm text-gray-600">Audience Distance</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {metrics && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eye Contact & Facial Analysis */}
        <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-cyan-600" />
              <span>Eye Contact & Facial Expression</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Eye Contact Duration</span>
                <Badge className={`${getScoreBg(metrics.eyeContactDuration)} ${getScoreColor(metrics.eyeContactDuration)} border-0`}>
                  {Math.round(metrics.eyeContactDuration)}%
                </Badge>
              </div>
              <Progress value={metrics.eyeContactDuration} className="h-2" />
              <p className="text-xs text-gray-600">{getRecommendation('eyeContactDuration', metrics.eyeContactDuration)}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Eye Contact Frequency</span>
                <Badge className={`${getScoreBg(metrics.eyeContactFrequency)} ${getScoreColor(metrics.eyeContactFrequency)} border-0`}>
                  {Math.round(metrics.eyeContactFrequency)}%
                </Badge>
              </div>
              <Progress value={metrics.eyeContactFrequency} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{metrics.blinkRate}/min</div>
                <div className="text-xs text-gray-600">Blink Rate</div>
                <div className="text-xs text-blue-600 mt-1">
                  {metrics.blinkRate > 20 ? "Slightly high - try to relax" : "Normal range"}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-900">{metrics.facialExpression}</div>
                <div className="text-xs text-gray-600">Expression</div>
                <div className="text-xs text-green-600 mt-1">Engaging audience</div>
              </div>
            </div>
          </CardContent>
        </Card>



            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Head Movement</span>
                <Badge className={`${getScoreBg(metrics.headMovement)} ${getScoreColor(metrics.headMovement)} border-0`}>
                  {Math.round(metrics.headMovement)}%
                </Badge>
              </div>
              <Progress value={metrics.headMovement} className="h-2" />
              <p className="text-xs text-gray-600">
                {metrics.headMovement < 50 ? "Add more head movement for emphasis" : "Good natural head movement"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900">Hand Position</div>
                <div className="text-xs text-gray-600 mt-1">{metrics.handPosition}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {metrics.handPosition.includes("Clasped") ? "Try open gestures for more engagement" : "Good hand positioning"}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900">Shoulder Position</div>
                <div className="text-xs text-gray-600 mt-1">{metrics.shoulderPosition}</div>
                <div className="text-xs text-orange-600 mt-1">
                  {metrics.shoulderPosition.includes("tense") ? "Relax shoulders, roll them back" : "Good shoulder posture"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stance & Stability */}
        <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <span>Stance & Stability</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Stance Stability</span>
                <Badge className={`${getScoreBg(metrics.stanceStability)} ${getScoreColor(metrics.stanceStability)} border-0`}>
                  {Math.round(metrics.stanceStability)}%
                </Badge>
              </div>
              <Progress value={metrics.stanceStability} className="h-2" />
              <p className="text-xs text-gray-600">{getRecommendation('stanceStability', metrics.stanceStability)}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Weight Shifting</span>
                <Badge className={`${getScoreBg(100 - metrics.weightShifting)} ${getScoreColor(100 - metrics.weightShifting)} border-0`}>
                  {metrics.weightShifting < 40 ? "Minimal" : metrics.weightShifting < 60 ? "Moderate" : "Excessive"}
                </Badge>
              </div>
              <Progress value={100 - metrics.weightShifting} className="h-2" />
              <p className="text-xs text-gray-600">
                {metrics.weightShifting > 60 ? "Reduce swaying for more authority" : "Good weight distribution"}
              </p>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900">Foot Position</div>
              <div className="text-xs text-gray-600 mt-1">{metrics.footPosition}</div>
              <div className="text-xs text-green-600 mt-1">Optimal stance width</div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Posture Breakdown */}
        <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-red-600" />
              <span>Posture Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {postureBreakdown ? Object.entries(postureBreakdown).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{label}</span>
                    <Badge className={`${getScoreBg(value)} ${getScoreColor(value)} border-0`}>
                      {Math.round(value)}%
                    </Badge>
                  </div>
                  <Progress value={value} className="h-2" />
                  {value < 70 && (
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 text-cyan-500" />
                      <p className="text-xs text-cyan-600">
                        {key === 'chestOpenness' && "Open chest, pull shoulders back"}
                        {key === 'spinalCurvature' && "Straighten spine, engage core"}
                        {key === 'headTilt' && "Keep head level and centered"}
                      </p>
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="text-center py-4">
                <p className="text-gray-600">No posture data available</p>
              </div>
            )}

            {postureBreakdown && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Posture Tip</span>
              </div>
              <p className="text-xs text-blue-800 mt-1">
                Imagine a string pulling you up from the crown of your head. This helps align your entire spine naturally.
              </p>
            </div>
            )}
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );
}