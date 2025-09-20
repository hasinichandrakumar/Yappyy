// MediaPipe Test Component - Verify MediaPipe functionality
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEnhancedMediaPipe } from '@/hooks/useEnhancedMediaPipe';

export default function MediaPipeTest() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    result: mediaPipeResult,
    isInitialized: isMediaPipeInitialized,
    isLoading: isMediaPipeLoading,
    error: mediaPipeError,
    startAnalysis: startMediaPipeAnalysis,
    stopAnalysis: stopMediaPipeAnalysis
  } = useEnhancedMediaPipe({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  const startTest = async () => {
    try {
      setIsTesting(true);
      setTestResults(null);

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Start MediaPipe analysis
      if (videoRef.current) {
        await startMediaPipeAnalysis(videoRef.current);
        console.log('🎯 MediaPipe test started');
      }

    } catch (error) {
      console.error('❌ MediaPipe test failed:', error);
      setTestResults({
        error: error.message,
        success: false
      });
    }
  };

  const stopTest = () => {
    setIsTesting(false);
    stopMediaPipeAnalysis();
    
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (mediaPipeResult) {
      setTestResults({
        success: true,
        data: mediaPipeResult,
        timestamp: new Date().toISOString()
      });
    }
  }, [mediaPipeResult]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎯 MediaPipe Test
          <Badge variant={isMediaPipeInitialized ? "default" : "secondary"}>
            {isMediaPipeInitialized ? "Initialized" : "Not Initialized"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Test Controls</h3>
            <div className="space-y-2">
              <Button 
                onClick={startTest} 
                disabled={isTesting || isMediaPipeLoading}
                className="w-full"
              >
                {isTesting ? "Testing..." : "Start MediaPipe Test"}
              </Button>
              <Button 
                onClick={stopTest} 
                disabled={!isTesting}
                variant="outline"
                className="w-full"
              >
                Stop Test
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="space-y-1 text-sm">
              <div>Loading: {isMediaPipeLoading ? "Yes" : "No"}</div>
              <div>Initialized: {isMediaPipeInitialized ? "Yes" : "No"}</div>
              <div>Error: {mediaPipeError || "None"}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Video Feed</h3>
            <video
              ref={videoRef}
              className="w-full h-48 bg-gray-100 rounded border"
              autoPlay
              muted
              playsInline
            />
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Canvas Output</h3>
            <canvas
              ref={canvasRef}
              className="w-full h-48 bg-gray-100 rounded border"
              width={640}
              height={480}
            />
          </div>
        </div>

        {testResults && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Test Results</h3>
            <div className="bg-gray-50 p-4 rounded border">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {mediaPipeResult && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Live MediaPipe Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-blue-50 p-2 rounded text-center">
                <div className="text-xs text-gray-600">Posture</div>
                <div className="font-bold">{mediaPipeResult.posture || 0}</div>
              </div>
              <div className="bg-green-50 p-2 rounded text-center">
                <div className="text-xs text-gray-600">Gesture</div>
                <div className="font-bold">{mediaPipeResult.gesture || 0}</div>
              </div>
              <div className="bg-yellow-50 p-2 rounded text-center">
                <div className="text-xs text-gray-600">Eye Contact</div>
                <div className="font-bold">{mediaPipeResult.eyeContact || 0}</div>
              </div>
              <div className="bg-purple-50 p-2 rounded text-center">
                <div className="text-xs text-gray-600">Confidence</div>
                <div className="font-bold">{Math.round((mediaPipeResult.confidence || 0) * 100)}%</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
