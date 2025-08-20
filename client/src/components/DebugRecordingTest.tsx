import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Camera, Mic, Play, Square, Bug } from 'lucide-react';

export default function DebugRecordingTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[DEBUG] ${message}`);
  };

  const clearLog = () => {
    setDebugLog([]);
    setError('');
  };

  const startRecording = async () => {
    try {
      clearLog();
      addLog('🎬 Starting recording process...');
      
      // Step 1: Check browser support
      addLog('🔍 Checking browser support...');
      if (!navigator.mediaDevices) {
        throw new Error('getUserMedia not supported in this browser');
      }
      addLog('✅ getUserMedia is supported');

      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia method not available');
      }
      addLog('✅ getUserMedia method is available');

      // Step 2: Check HTTPS/localhost
      addLog('🔍 Checking protocol...');
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        throw new Error('getUserMedia requires HTTPS (except on localhost)');
      }
      addLog(`✅ Protocol is ${location.protocol} on ${location.hostname}`);

      // Step 3: Request permissions
      addLog('🎤 Requesting camera and microphone permissions...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      addLog('✅ Camera and microphone permissions granted');

      // Step 4: Setup video
      addLog('📹 Setting up video element...');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        addLog('✅ Video element is playing');
      } else {
        addLog('⚠️ Video ref is null');
      }

      // Step 5: Check speech recognition
      addLog('🎤 Checking speech recognition...');
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        addLog('✅ Speech recognition is supported');
      } else {
        addLog('⚠️ Speech recognition not supported');
      }

      setIsRecording(true);
      addLog('🎉 Recording started successfully!');

    } catch (error: any) {
      console.error('Recording failed:', error);
      addLog(`❌ ERROR: ${error.message}`);
      setError(error.message);
    }
  };

  const stopRecording = () => {
    addLog('🛑 Stopping recording...');
    setIsRecording(false);
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        addLog(`🛑 Stopped ${track.kind} track`);
      });
      videoRef.current.srcObject = null;
    }
    
    addLog('✅ Recording stopped');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Debug Recording Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            This debug test will show exactly what happens when you click the start button.
          </p>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={startRecording} 
              disabled={isRecording}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRecording ? 'Recording...' : 'Start Recording'}
            </Button>
            
            <Button 
              onClick={stopRecording} 
              disabled={!isRecording}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Stop Recording
            </Button>

            <Button 
              onClick={clearLog} 
              variant="outline"
              className="flex items-center gap-2"
            >
              Clear Log
            </Button>
          </div>

          {/* Video Feed */}
          {isRecording && (
            <div className="mt-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}

          {/* Debug Log */}
          <div className="mt-6">
            <h3 className="font-medium mb-2">Debug Log:</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg max-h-96 overflow-y-auto font-mono text-sm">
              {debugLog.length === 0 ? (
                <span className="text-gray-500">Click "Start Recording" to see debug information...</span>
              ) : (
                debugLog.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </div>

          {/* Browser Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Browser Information:</h4>
            <div className="space-y-1 text-sm">
              <div>User Agent: {navigator.userAgent}</div>
              <div>Protocol: {location.protocol}</div>
              <div>Hostname: {location.hostname}</div>
              <div>getUserMedia Support: {navigator.mediaDevices ? 'Yes' : 'No'}</div>
              <div>Speech Recognition: {'webkitSpeechRecognition' in window || 'SpeechRecognition' in window ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

