import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic, Eye, Brain, Zap, TrendingUp, AlertCircle } from 'lucide-react';

interface AdvancedAnalyticsDashboardProps {
  speechMetrics?: any;
  cvMetrics?: any;
  multiModalMetrics?: any;
  isAnalyzing?: boolean;
  analyticsError?: string;
}

export function AdvancedAnalyticsDashboard({
  speechMetrics,
  cvMetrics,
  multiModalMetrics,
  isAnalyzing = false,
  analyticsError
}: AdvancedAnalyticsDashboardProps) {
  
  // Helper function to get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Helper function to get progress color
  const getProgressColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (analyticsError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Analytics Error: {analyticsError}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-lg font-medium">Analyzing with advanced AI...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Multi-Modal Overview */}
      {multiModalMetrics && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Multi-Modal Analysis Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(multiModalMetrics.overallScore)}`}>
                  {multiModalMetrics.overallScore}%
                </div>
                <div className="text-sm text-gray-600">Overall Performance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">
                  {multiModalMetrics.processingTime}ms
                </div>
                <div className="text-sm text-gray-600">Processing Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-600">
                  {multiModalMetrics.recommendations?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Recommendations</div>
              </div>
            </div>
            
            {/* Recommendations */}
            {multiModalMetrics.recommendations && multiModalMetrics.recommendations.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-sm mb-2">Real-Time Recommendations:</h4>
                <div className="space-y-2">
                  {multiModalMetrics.recommendations.map((rec: string, idx: number) => (
                    <div key={idx} className="bg-white p-2 rounded text-sm border-l-4 border-blue-500">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advanced Speech Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-green-600" />
              Advanced Speech Analytics
              <Badge variant="secondary" className="ml-auto">FREE</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {speechMetrics ? (
              <div className="space-y-4">
                {/* Core Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Clarity</span>
                      <span className={`text-sm font-semibold ${getScoreColor(speechMetrics.clarityScore)}`}>
                        {speechMetrics.clarityScore}%
                      </span>
                    </div>
                    <Progress 
                      value={speechMetrics.clarityScore} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Pacing</span>
                      <span className={`text-sm font-semibold ${getScoreColor(speechMetrics.pacingScore)}`}>
                        {speechMetrics.pacingScore}%
                      </span>
                    </div>
                    <Progress 
                      value={speechMetrics.pacingScore} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Volume Consistency</span>
                      <span className={`text-sm font-semibold ${getScoreColor(speechMetrics.volumeConsistency)}`}>
                        {speechMetrics.volumeConsistency}%
                      </span>
                    </div>
                    <Progress 
                      value={speechMetrics.volumeConsistency} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Pitch Variation</span>
                      <span className={`text-sm font-semibold ${getScoreColor(speechMetrics.pitchVariation)}`}>
                        {speechMetrics.pitchVariation}%
                      </span>
                    </div>
                    <Progress 
                      value={speechMetrics.pitchVariation} 
                      className="h-2"
                    />
                  </div>
                </div>

                {/* Emotional Analysis */}
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-semibold text-sm mb-2">Emotional Analysis</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Tone:</span>
                      <Badge variant="outline" className="ml-2">
                        {speechMetrics.emotionalTone}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Sentiment:</span>
                      <span className={`ml-2 font-semibold ${speechMetrics.sentimentScore > 0 ? 'text-green-600' : speechMetrics.sentimentScore < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {speechMetrics.sentimentScore > 0 ? 'Positive' : speechMetrics.sentimentScore < 0 ? 'Negative' : 'Neutral'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filler Words */}
                <div className="bg-yellow-50 p-3 rounded">
                  <h4 className="font-semibold text-sm mb-2">Filler Word Analysis</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Count:</span>
                      <span className="ml-2 font-semibold">{speechMetrics.fillerWordCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Density:</span>
                      <span className={`ml-2 font-semibold ${speechMetrics.fillerWordDensity > 10 ? 'text-red-600' : speechMetrics.fillerWordDensity > 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {speechMetrics.fillerWordDensity.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tonal Quality */}
                {speechMetrics.tonalQuality && (
                  <div className="bg-blue-50 p-3 rounded">
                    <h4 className="font-semibold text-sm mb-2">Tonal Quality</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Engagement:</span>
                        <span className="ml-2 font-semibold">{speechMetrics.tonalQuality.engagementLevel}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Expressiveness:</span>
                        <span className="ml-2 font-semibold">{speechMetrics.tonalQuality.expressiveness}%</span>
                      </div>
                    </div>
                    {speechMetrics.tonalQuality.monotone && (
                      <div className="mt-2">
                        <Badge variant="destructive" className="text-xs">
                          Monotone Detected
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Mic className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Start speaking to see advanced speech analytics</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Computer Vision */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Enhanced Computer Vision
              <Badge variant="secondary" className="ml-auto">FREE</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cvMetrics ? (
              <div className="space-y-4">
                {/* Posture Analysis */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Posture Analysis</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Overall Posture</span>
                        <span className={`text-sm font-semibold ${getScoreColor(cvMetrics.posture.overallPosture)}`}>
                          {cvMetrics.posture.overallPosture}%
                        </span>
                      </div>
                      <Progress value={cvMetrics.posture.overallPosture} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Spine Alignment:</span>
                        <span className="ml-1 font-semibold">{cvMetrics.posture.spineAlignment}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Shoulder Level:</span>
                        <span className="ml-1 font-semibold">{cvMetrics.posture.shoulderLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eye Contact Analysis */}
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-semibold text-sm mb-2">Eye Contact Analysis</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Eye Contact</span>
                        <span className={`text-sm font-semibold ${getScoreColor(cvMetrics.eyeContact.eyeContactPercentage)}`}>
                          {cvMetrics.eyeContact.eyeContactPercentage}%
                        </span>
                      </div>
                      <Progress value={cvMetrics.eyeContact.eyeContactPercentage} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600">Gaze Stability:</span>
                        <span className="ml-1 font-semibold">{cvMetrics.eyeContact.gazeStability}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Blink Rate:</span>
                        <span className="ml-1 font-semibold">{cvMetrics.eyeContact.blinkRate}/min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Facial Expression Analysis */}
                <div className="bg-green-50 p-3 rounded">
                  <h4 className="font-semibold text-sm mb-2">Facial Expression</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Confidence:</span>
                      <span className={`ml-2 font-semibold ${getScoreColor(cvMetrics.facialExpression.confidence)}`}>
                        {cvMetrics.facialExpression.confidence}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Engagement:</span>
                      <span className={`ml-2 font-semibold ${getScoreColor(cvMetrics.facialExpression.engagement)}`}>
                        {cvMetrics.facialExpression.engagement}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Authenticity:</span>
                      <span className={`ml-2 font-semibold ${getScoreColor(cvMetrics.facialExpression.authenticity)}`}>
                        {cvMetrics.facialExpression.authenticity}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Nervousness:</span>
                      <span className={`ml-2 font-semibold ${getScoreColor(100 - cvMetrics.facialExpression.nervousness)}`}>
                        {cvMetrics.facialExpression.nervousness}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gesture Analysis */}
                <div className="bg-purple-50 p-3 rounded">
                  <h4 className="font-semibold text-sm mb-2">Gesture Analysis</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Naturalness:</span>
                      <span className={`ml-2 font-semibold ${getScoreColor(cvMetrics.gestures.gestureNaturalness)}`}>
                        {cvMetrics.gestures.gestureNaturalness}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Open Palms:</span>
                      <span className="ml-2 font-semibold">{cvMetrics.gestures.openPalmFrequency}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Movement Freq:</span>
                      <span className="ml-2 font-semibold">{cvMetrics.gestures.handMovementFrequency}/min</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fidgeting:</span>
                      <span className={`ml-2 font-semibold ${getScoreColor(cvMetrics.gestures.fidgetingScore)}`}>
                        {cvMetrics.gestures.fidgetingScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Language */}
                <div className="bg-orange-50 p-3 rounded">
                  <h4 className="font-semibold text-sm mb-2">Body Language</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Energy Level:</span>
                      <span className={`ml-2 font-semibold ${getScoreColor(cvMetrics.bodyLanguage.energyLevel)}`}>
                        {cvMetrics.bodyLanguage.energyLevel}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Professionalism:</span>
                      <span className={`ml-2 font-semibold ${getScoreColor(cvMetrics.bodyLanguage.professionalism)}`}>
                        {cvMetrics.bodyLanguage.professionalism}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Approachability:</span>
                      <span className={`ml-2 font-semibold ${getScoreColor(cvMetrics.bodyLanguage.approachability)}`}>
                        {cvMetrics.bodyLanguage.approachability}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Authority:</span>
                      <span className={`ml-2 font-semibold ${getScoreColor(cvMetrics.bodyLanguage.authorityPresence)}`}>
                        {cvMetrics.bodyLanguage.authorityPresence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Eye className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Enable camera to see computer vision analytics</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      {(speechMetrics || cvMetrics) && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {speechMetrics && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Speech Strengths</h4>
                  <ul className="text-sm space-y-1">
                    {speechMetrics.clarityScore >= 80 && (
                      <li className="text-green-600">✓ Excellent speech clarity</li>
                    )}
                    {speechMetrics.pacingScore >= 70 && (
                      <li className="text-green-600">✓ Good speaking pace</li>
                    )}
                    {speechMetrics.fillerWordDensity < 5 && (
                      <li className="text-green-600">✓ Minimal filler words</li>
                    )}
                    {speechMetrics.volumeConsistency >= 70 && (
                      <li className="text-green-600">✓ Consistent volume</li>
                    )}
                  </ul>
                </div>
              )}

              {cvMetrics && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Visual Presence Strengths</h4>
                  <ul className="text-sm space-y-1">
                    {cvMetrics.posture.overallPosture >= 80 && (
                      <li className="text-green-600">✓ Excellent posture</li>
                    )}
                    {cvMetrics.eyeContact.eyeContactPercentage >= 70 && (
                      <li className="text-green-600">✓ Strong eye contact</li>
                    )}
                    {cvMetrics.facialExpression.confidence >= 75 && (
                      <li className="text-green-600">✓ Confident expression</li>
                    )}
                    {cvMetrics.gestures.gestureNaturalness >= 70 && (
                      <li className="text-green-600">✓ Natural gesturing</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}