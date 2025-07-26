// Facial Expression Analysis Debugger Component
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { TensorFlowVisionSystem, TensorFlowEmotionResults } from '@/lib/tensorflow-emotion';

interface FacialExpressionDebuggerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isRecording: boolean;
  onExpressionUpdate?: (results: TensorFlowEmotionResults | null) => void;
}

export function FacialExpressionDebugger({
  videoRef,
  canvasRef,
  isRecording,
  onExpressionUpdate
}: FacialExpressionDebuggerProps) {
  const [tfSystem, setTfSystem] = useState<TensorFlowVisionSystem | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastResults, setLastResults] = useState<TensorFlowEmotionResults | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [frameCount, setFrameCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Initialize TensorFlow system
  useEffect(() => {
    const initializeTensorFlow = async () => {
      try {
        const system = new TensorFlowVisionSystem();
        await system.initializeModels();
        setTfSystem(system);
        setIsInitialized(true);
        setErrorMessage('');
        console.log('✅ Facial Expression Debugger: TensorFlow system initialized');
      } catch (error) {
        console.error('❌ Facial Expression Debugger: Initialization failed', error);
        setErrorMessage('Failed to initialize facial recognition models');
      }
    };

    initializeTensorFlow();
  }, []);

  // Process facial expressions when recording
  useEffect(() => {
    if (!isRecording || !tfSystem || !videoRef.current || !canvasRef.current) return;

    const processInterval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const startTime = performance.now();
      
      try {
        const results = await tfSystem.analyzeFrame(canvasRef.current, videoRef.current);
        const endTime = performance.now();
        
        setProcessingTime(endTime - startTime);
        setFrameCount(prev => prev + 1);
        setLastResults(results);
        setErrorMessage('');
        
        // Notify parent component
        onExpressionUpdate?.(results);
        
      } catch (error) {
        console.error('Facial expression processing error:', error);
        setErrorMessage('Processing error occurred');
      }
    }, 1000); // Process every second

    return () => clearInterval(processInterval);
  }, [isRecording, tfSystem, videoRef, canvasRef, onExpressionUpdate]);

  const handleRecalibrate = async () => {
    setFrameCount(0);
    setLastResults(null);
    setErrorMessage('');
    
    if (tfSystem) {
      try {
        await tfSystem.initializeModels();
        console.log('🔄 Facial Expression system recalibrated');
      } catch (error) {
        setErrorMessage('Recalibration failed');
      }
    }
  };

  return (
    <Card className="p-4 bg-purple-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Facial Expression Analysis
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant={isInitialized ? "default" : "secondary"}>
            {isInitialized ? "Ready" : "Loading"}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRecalibrate}
            disabled={!isInitialized}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
        <div className="text-center">
          <div className="font-medium">System Status</div>
          <div className="flex items-center justify-center mt-1">
            {isInitialized ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-500" />
            )}
            <span className="ml-1">
              {isInitialized ? "Active" : "Loading"}
            </span>
          </div>
        </div>
        <div className="text-center">
          <div className="font-medium">Frames Processed</div>
          <div className="text-lg font-bold">{frameCount}</div>
        </div>
        <div className="text-center">
          <div className="font-medium">Processing Time</div>
          <div className="text-lg font-bold">{processingTime.toFixed(0)}ms</div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Current Expression Analysis */}
      {lastResults && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Current Emotions</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(lastResults.emotions).map(([emotion, intensity]) => (
                <div key={emotion} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{emotion}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded">
                      <div 
                        className={`h-full rounded ${
                          emotion === 'happy' ? 'bg-green-500' :
                          emotion === 'sad' ? 'bg-blue-500' :
                          emotion === 'angry' ? 'bg-red-500' :
                          emotion === 'fearful' ? 'bg-orange-500' :
                          emotion === 'surprised' ? 'bg-yellow-500' :
                          emotion === 'disgusted' ? 'bg-purple-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${Math.min(100, intensity * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs w-8">{(() => {
                      const percentage = intensity * 100;
                      return isNaN(percentage) ? "0%" : `${Math.round(percentage)}%`;
                    })()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Advanced Metrics</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-sm">Confidence</span>
                <Progress value={lastResults.expressions.confidence} className="h-2 mt-1" />
                <span className="text-xs text-gray-600">{lastResults.expressions.confidence}%</span>
              </div>
              <div>
                <span className="text-sm">Engagement</span>
                <Progress value={lastResults.expressions.engagement} className="h-2 mt-1" />
                <span className="text-xs text-gray-600">{lastResults.expressions.engagement}%</span>
              </div>
              <div>
                <span className="text-sm">Authenticity</span>
                <Progress value={lastResults.expressions.authenticity} className="h-2 mt-1" />
                <span className="text-xs text-gray-600">{lastResults.expressions.authenticity}%</span>
              </div>
              <div>
                <span className="text-sm">Nervousness</span>
                <Progress value={lastResults.expressions.nervousness} className="h-2 mt-1" />
                <span className="text-xs text-gray-600">{lastResults.expressions.nervousness}%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Demographic Analysis</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Age:</span>
                <span className="ml-2 font-medium">{lastResults.age} years</span>
              </div>
              <div>
                <span className="text-gray-600">Gender:</span>
                <span className="ml-2 font-medium capitalize">{lastResults.gender}</span>
                <span className="ml-1 text-xs text-gray-500">({(() => {
                  const percentage = lastResults.genderProbability * 100;
                  return isNaN(percentage) ? "0%" : `${Math.round(percentage)}%`;
                })()})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!lastResults && isRecording && isInitialized && (
        <div className="text-center py-4">
          <div className="animate-pulse">
            <Camera className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-sm text-gray-600">Processing facial expressions...</p>
          </div>
        </div>
      )}

      {!isRecording && (
        <div className="text-center py-4">
          <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">Start recording to analyze facial expressions</p>
        </div>
      )}
    </Card>
  );
}