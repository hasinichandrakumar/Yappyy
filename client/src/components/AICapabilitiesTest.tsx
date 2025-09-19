// AI Capabilities Test Component
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEnhancedMediaPipe } from '@/hooks/useEnhancedMediaPipe';
import { useEnhancedTensorFlow } from '@/hooks/useEnhancedTensorFlow';
import { useEnhancedWebGazer } from '@/hooks/useEnhancedWebGazer';

export default function AICapabilitiesTest() {
  const [testResults, setTestResults] = useState<any>({});
  const [isTesting, setIsTesting] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  // Enhanced AI hooks
  const {
    result: mediaPipeResult,
    isInitialized: isMediaPipeInitialized,
    isLoading: isMediaPipeLoading,
    error: mediaPipeError,
    startAnalysis: startMediaPipeAnalysis,
    stopAnalysis: stopMediaPipeAnalysis
  } = useEnhancedMediaPipe();

  const {
    emotionResult,
    isInitialized: isTensorFlowInitialized,
    isLoading: isTensorFlowLoading,
    error: tensorFlowError,
    startEmotionAnalysis,
    stopEmotionAnalysis
  } = useEnhancedTensorFlow();

  const {
    eyeTrackingResult,
    isInitialized: isWebGazerInitialized,
    isLoading: isWebGazerLoading,
    isCalibrated,
    error: webGazerError,
    startEyeTracking,
    stopEyeTracking,
    calibrate
  } = useEnhancedWebGazer();

  const startTest = async () => {
    setIsTesting(true);
    setTestResults({});

    try {
      // Get camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      setVideoRef(video);

      // Test MediaPipe
      if (isMediaPipeInitialized) {
        try {
          await startMediaPipeAnalysis(video);
          setTestResults(prev => ({ ...prev, mediaPipe: '✅ Working' }));
        } catch (error) {
          setTestResults(prev => ({ ...prev, mediaPipe: `❌ Error: ${error}` }));
        }
      } else {
        setTestResults(prev => ({ ...prev, mediaPipe: '⚠️ Not initialized' }));
      }

      // Test TensorFlow
      if (isTensorFlowInitialized) {
        try {
          await startEmotionAnalysis(video);
          setTestResults(prev => ({ ...prev, tensorFlow: '✅ Working' }));
        } catch (error) {
          setTestResults(prev => ({ ...prev, tensorFlow: `❌ Error: ${error}` }));
        }
      } else {
        setTestResults(prev => ({ ...prev, tensorFlow: '⚠️ Not initialized' }));
      }

      // Test WebGazer
      if (isWebGazerInitialized) {
        try {
          await startEyeTracking(video);
          setTestResults(prev => ({ ...prev, webGazer: '✅ Working' }));
        } catch (error) {
          setTestResults(prev => ({ ...prev, webGazer: `❌ Error: ${error}` }));
        }
      } else {
        setTestResults(prev => ({ ...prev, webGazer: '⚠️ Not initialized' }));
      }

    } catch (error) {
      setTestResults(prev => ({ ...prev, camera: `❌ Camera error: ${error}` }));
    }

    setIsTesting(false);
  };

  const stopTest = () => {
    if (videoRef) {
      stopMediaPipeAnalysis();
      stopEmotionAnalysis();
      stopEyeTracking();
      
      if (videoRef.srcObject) {
        const stream = videoRef.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setVideoRef(null);
    }
    setIsTesting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🚀 Enhanced AI Capabilities Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={startTest} 
              disabled={isTesting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isTesting ? 'Testing...' : 'Start AI Test'}
            </Button>
            <Button 
              onClick={stopTest} 
              variant="outline"
              disabled={!isTesting}
            >
              Stop Test
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* MediaPipe Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">MediaPipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant={isMediaPipeInitialized ? "default" : "secondary"}>
                    {isMediaPipeLoading ? 'Loading...' : isMediaPipeInitialized ? 'Ready' : 'Not Ready'}
                  </Badge>
                  {mediaPipeError && (
                    <p className="text-xs text-red-600">{mediaPipeError}</p>
                  )}
                  {testResults.mediaPipe && (
                    <p className="text-xs">{testResults.mediaPipe}</p>
                  )}
                  {mediaPipeResult.isWorking && (
                    <div className="text-xs space-y-1">
                      <p>Posture: {mediaPipeResult.posture?.toFixed(1) || 'N/A'}</p>
                      <p>Gesture: {mediaPipeResult.gesture?.toFixed(1) || 'N/A'}</p>
                      <p>Eye Contact: {mediaPipeResult.eyeContact?.toFixed(1) || 'N/A'}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* TensorFlow Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">TensorFlow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant={isTensorFlowInitialized ? "default" : "secondary"}>
                    {isTensorFlowLoading ? 'Loading...' : isTensorFlowInitialized ? 'Ready' : 'Not Ready'}
                  </Badge>
                  {tensorFlowError && (
                    <p className="text-xs text-red-600">{tensorFlowError}</p>
                  )}
                  {testResults.tensorFlow && (
                    <p className="text-xs">{testResults.tensorFlow}</p>
                  )}
                  {emotionResult.isWorking && (
                    <div className="text-xs space-y-1">
                      <p>Emotion: {emotionResult.emotion}</p>
                      <p>Confidence: {(emotionResult.confidence * 100).toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* WebGazer Status */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">WebGazer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant={isWebGazerInitialized ? "default" : "secondary"}>
                    {isWebGazerLoading ? 'Loading...' : isWebGazerInitialized ? 'Ready' : 'Not Ready'}
                  </Badge>
                  {webGazerError && (
                    <p className="text-xs text-red-600">{webGazerError}</p>
                  )}
                  {testResults.webGazer && (
                    <p className="text-xs">{testResults.webGazer}</p>
                  )}
                  {eyeTrackingResult.isWorking && (
                    <div className="text-xs space-y-1">
                      <p>X: {eyeTrackingResult.x.toFixed(1)}</p>
                      <p>Y: {eyeTrackingResult.y.toFixed(1)}</p>
                      <p>Looking at Target: {eyeTrackingResult.isLookingAtTarget ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Overall AI Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  MediaPipe: {isMediaPipeInitialized ? '✅' : '❌'} | 
                  TensorFlow: {isTensorFlowInitialized ? '✅' : '❌'} | 
                  WebGazer: {isWebGazerInitialized ? '✅' : '❌'}
                </p>
                <p className="text-xs text-gray-600">
                  All AI systems are now enabled with enhanced error handling and graceful fallbacks.
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
