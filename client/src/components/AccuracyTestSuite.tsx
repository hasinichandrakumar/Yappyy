// Comprehensive Accuracy Test Suite for Body Language and Voice Analysis
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Square, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  Mic, 
  Eye, 
  Hand,
  User,
  Volume2,
  Brain
} from 'lucide-react';
import { useMediaPipeBodyLanguage } from '@/hooks/useMediaPipeBodyLanguage';
import { useVoiceAnalysis } from '@/hooks/useVoiceAnalysis';
import { useFacialAnalysis } from '@/hooks/useFacialAnalysis';

interface TestResult {
  component: string;
  metric: string;
  expected: number;
  actual: number;
  accuracy: number;
  status: 'pass' | 'fail' | 'warning';
}

interface AccuracyReport {
  bodyLanguage: TestResult[];
  voiceAnalysis: TestResult[];
  facialAnalysis: TestResult[];
  overall: {
    accuracy: number;
    totalTests: number;
    passed: number;
    failed: number;
  };
}

export default function AccuracyTestSuite() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AccuracyReport | null>(null);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Hook integrations
  const {
    startAnalysis: startBodyLanguageAnalysis,
    stopAnalysis: stopBodyLanguageAnalysis,
    currentMetrics: bodyLanguageMetrics,
    getAverageMetrics: getAverageBodyLanguageMetrics,
    isActive: isBodyLanguageActive,
    frameCount: bodyLanguageFrameCount,
    processingTime: bodyLanguageProcessingTime,
    error: bodyLanguageError
  } = useMediaPipeBodyLanguage();

  const {
    voiceClarity,
    confidenceScore,
    volumeLevel,
    pitch,
    stability
  } = useVoiceAnalysis();

  const {
    startFacialAnalysis,
    stopFacialAnalysis,
    currentAnalysis: facialAnalysis,
    getAverageFacialMetrics,
    isActive: isFacialAnalysisActive,
    error: facialAnalysisError
  } = useFacialAnalysis();

  const addLog = (message: string) => {
    setTestLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(`🧪 Test: ${message}`);
  };

  const calculateAccuracy = (expected: number, actual: number): number => {
    if (expected === 0 && actual === 0) return 100;
    if (expected === 0) return actual === 0 ? 100 : 0;
    const diff = Math.abs(expected - actual);
    const accuracy = Math.max(0, 100 - (diff / expected) * 100);
    return Math.round(accuracy);
  };

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setTestLogs([]);
    addLog('Starting comprehensive accuracy test suite...');

    try {
      // Step 1: Initialize camera and microphone
      addLog('Initializing camera and microphone access...');
      setCurrentTest('Camera & Microphone Setup');
      setProgress(10);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        streamRef.current = stream;
        addLog('✅ Camera and microphone initialized successfully');
      }

      // Step 2: Test MediaPipe Body Language Analysis
      addLog('Testing MediaPipe body language analysis accuracy...');
      setCurrentTest('MediaPipe Body Language Analysis');
      setProgress(25);

      const bodyLanguageTests = await testBodyLanguageAccuracy();
      addLog(`✅ Body language tests completed: ${bodyLanguageTests.length} metrics tested`);

      // Step 3: Test Voice Analysis System
      addLog('Testing voice analysis system accuracy...');
      setCurrentTest('Voice Analysis & Articulation');
      setProgress(50);

      const voiceTests = await testVoiceAnalysisAccuracy();
      addLog(`✅ Voice analysis tests completed: ${voiceTests.length} metrics tested`);

      // Step 4: Test Facial Analysis Integration
      addLog('Testing facial analysis integration...');
      setCurrentTest('Facial Analysis Integration');
      setProgress(75);

      const facialTests = await testFacialAnalysisAccuracy();
      addLog(`✅ Facial analysis tests completed: ${facialTests.length} metrics tested`);

      // Step 5: Compile Results
      addLog('Compiling comprehensive accuracy report...');
      setCurrentTest('Generating Report');
      setProgress(90);

      const allTests = [...bodyLanguageTests, ...voiceTests, ...facialTests];
      const passed = allTests.filter(test => test.status === 'pass').length;
      const failed = allTests.filter(test => test.status === 'fail').length;
      const overallAccuracy = allTests.reduce((sum, test) => sum + test.accuracy, 0) / allTests.length;

      const finalResults: AccuracyReport = {
        bodyLanguage: bodyLanguageTests,
        voiceAnalysis: voiceTests,
        facialAnalysis: facialTests,
        overall: {
          accuracy: Math.round(overallAccuracy),
          totalTests: allTests.length,
          passed,
          failed
        }
      };

      setResults(finalResults);
      setProgress(100);
      addLog(`🎉 Test suite completed! Overall accuracy: ${Math.round(overallAccuracy)}%`);

    } catch (error) {
      addLog(`❌ Test suite failed: ${error.message}`);
      console.error('Test suite error:', error);
    } finally {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const testBodyLanguageAccuracy = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];
    
    if (!videoRef.current) {
      addLog('❌ Video element not available for body language testing');
      return tests;
    }

    try {
      // Start MediaPipe analysis
      addLog('🤖 Starting MediaPipe body language analysis...');
      const started = await startBodyLanguageAnalysis(videoRef.current);
      
      if (!started) {
        addLog('❌ Failed to start MediaPipe analysis');
        return tests;
      }

      // Wait for analysis to process frames
      addLog('⏳ Waiting for MediaPipe to process frames...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Test posture confidence
      const postureTest: TestResult = {
        component: 'MediaPipe Body Language',
        metric: 'Posture Confidence',
        expected: 75, // Expected baseline for good posture
        actual: bodyLanguageMetrics?.posture?.confidence || 0,
        accuracy: calculateAccuracy(75, bodyLanguageMetrics?.posture?.confidence || 0),
        status: (bodyLanguageMetrics?.posture?.confidence || 0) > 0 ? 'pass' : 'fail'
      };
      tests.push(postureTest);
      addLog(`📊 Posture confidence: ${postureTest.actual}% (expected ~${postureTest.expected}%)`);

      // Test gesture naturalness
      const gestureTest: TestResult = {
        component: 'MediaPipe Body Language',
        metric: 'Gesture Naturalness',
        expected: 70,
        actual: bodyLanguageMetrics?.gestures?.naturalness || 0,
        accuracy: calculateAccuracy(70, bodyLanguageMetrics?.gestures?.naturalness || 0),
        status: (bodyLanguageMetrics?.gestures?.naturalness || 0) > 0 ? 'pass' : 'fail'
      };
      tests.push(gestureTest);
      addLog(`👋 Gesture naturalness: ${gestureTest.actual}% (expected ~${gestureTest.expected}%)`);

      // Test eye contact engagement
      const eyeContactTest: TestResult = {
        component: 'MediaPipe Body Language',
        metric: 'Eye Contact Engagement',
        expected: 80,
        actual: bodyLanguageMetrics?.eyeContact?.engagement || 0,
        accuracy: calculateAccuracy(80, bodyLanguageMetrics?.eyeContact?.engagement || 0),
        status: (bodyLanguageMetrics?.eyeContact?.engagement || 0) > 0 ? 'pass' : 'fail'
      };
      tests.push(eyeContactTest);
      addLog(`👁️ Eye contact engagement: ${eyeContactTest.actual}% (expected ~${eyeContactTest.expected}%)`);

      // Test processing performance
      const performanceTest: TestResult = {
        component: 'MediaPipe Performance',
        metric: 'Processing Time (ms)',
        expected: 1000, // Expected max 1 second processing
        actual: bodyLanguageProcessingTime,
        accuracy: bodyLanguageProcessingTime < 1000 ? 100 : 50,
        status: bodyLanguageProcessingTime < 1000 ? 'pass' : 'warning'
      };
      tests.push(performanceTest);
      addLog(`⚡ Processing time: ${performanceTest.actual}ms (expected <${performanceTest.expected}ms)`);

      stopBodyLanguageAnalysis();
      addLog('✅ MediaPipe body language tests completed');

    } catch (error) {
      addLog(`❌ Body language test error: ${error.message}`);
    }

    return tests;
  };

  const testVoiceAnalysisAccuracy = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    try {
      addLog('🎤 Testing voice analysis system...');
      
      // Wait for voice analysis to capture data
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Test voice clarity
      const clarityTest: TestResult = {
        component: 'Voice Analysis',
        metric: 'Voice Clarity',
        expected: 75,
        actual: voiceClarity,
        accuracy: calculateAccuracy(75, voiceClarity),
        status: voiceClarity > 0 ? 'pass' : 'fail'
      };
      tests.push(clarityTest);
      addLog(`🔊 Voice clarity: ${clarityTest.actual}% (expected ~${clarityTest.expected}%)`);

      // Test confidence scoring
      const confidenceTest: TestResult = {
        component: 'Voice Analysis',
        metric: 'Confidence Score',
        expected: 70,
        actual: confidenceScore,
        accuracy: calculateAccuracy(70, confidenceScore),
        status: confidenceScore > 0 ? 'pass' : 'fail'
      };
      tests.push(confidenceTest);
      addLog(`💪 Confidence score: ${confidenceTest.actual}% (expected ~${confidenceTest.expected}%)`);

      // Test pitch detection
      const pitchTest: TestResult = {
        component: 'Voice Analysis',
        metric: 'Pitch Detection (Hz)',
        expected: 150, // Average speaking pitch
        actual: pitch,
        accuracy: pitch > 0 ? 100 : 0,
        status: pitch > 0 ? 'pass' : 'fail'
      };
      tests.push(pitchTest);
      addLog(`🎵 Pitch detection: ${pitchTest.actual}Hz (expected ~${pitchTest.expected}Hz)`);

      // Test volume level detection
      const volumeTest: TestResult = {
        component: 'Voice Analysis',
        metric: 'Volume Level',
        expected: 50,
        actual: volumeLevel,
        accuracy: calculateAccuracy(50, volumeLevel),
        status: volumeLevel > 0 ? 'pass' : 'fail'
      };
      tests.push(volumeTest);
      addLog(`📢 Volume level: ${volumeTest.actual}% (expected ~${volumeTest.expected}%)`);

      addLog('✅ Voice analysis tests completed');

    } catch (error) {
      addLog(`❌ Voice analysis test error: ${error.message}`);
    }

    return tests;
  };

  const testFacialAnalysisAccuracy = async (): Promise<TestResult[]> => {
    const tests: TestResult[] = [];

    if (!videoRef.current) {
      addLog('❌ Video element not available for facial analysis testing');
      return tests;
    }

    try {
      addLog('😊 Testing facial analysis integration...');
      
      // Start facial analysis
      startFacialAnalysis(videoRef.current, 2000);
      
      // Wait for analysis to process
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Test facial analysis activation
      const activationTest: TestResult = {
        component: 'Facial Analysis',
        metric: 'System Activation',
        expected: 1, // Should be active
        actual: isFacialAnalysisActive ? 1 : 0,
        accuracy: isFacialAnalysisActive ? 100 : 0,
        status: isFacialAnalysisActive ? 'pass' : 'fail'
      };
      tests.push(activationTest);
      addLog(`🎭 Facial analysis active: ${isFacialAnalysisActive ? 'Yes' : 'No'}`);

      // Test emotion detection (if available)
      if (facialAnalysis?.facialMetrics) {
        const emotionTest: TestResult = {
          component: 'Facial Analysis',
          metric: 'Emotion Detection',
          expected: 70,
          actual: facialAnalysis.facialMetrics.emotionalExpression?.confidence || 0,
          accuracy: calculateAccuracy(70, facialAnalysis.facialMetrics.emotionalExpression?.confidence || 0),
          status: (facialAnalysis.facialMetrics.emotionalExpression?.confidence || 0) > 0 ? 'pass' : 'fail'
        };
        tests.push(emotionTest);
        addLog(`😄 Emotion detection: ${emotionTest.actual}% (expected ~${emotionTest.expected}%)`);
      }

      stopFacialAnalysis();
      addLog('✅ Facial analysis tests completed');

    } catch (error) {
      addLog(`❌ Facial analysis test error: ${error.message}`);
    }

    return tests;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'fail': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'fail': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Accuracy Test Suite
        </h1>
        <p className="text-gray-600">
          Comprehensive testing for MediaPipe body language analysis and voice articulation features
        </p>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Test Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Button 
              onClick={runComprehensiveTest}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Running Tests...' : 'Run Comprehensive Test'}
            </Button>
            
            {isRunning && (
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{currentTest}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          {/* Video Preview */}
          <div className="relative w-full max-w-md mx-auto">
            <video
              ref={videoRef}
              className="w-full aspect-video bg-gray-900 rounded-lg"
              muted
              playsInline
            />
            <div className="absolute top-2 left-2 space-y-1">
              {isBodyLanguageActive && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  MediaPipe Active
                </Badge>
              )}
              {isFacialAnalysisActive && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Facial Analysis Active
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Results */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Overall Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.overall.accuracy}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Accuracy</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {results.overall.passed}
                  </div>
                  <div className="text-sm text-gray-600">Tests Passed</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {results.overall.failed}
                  </div>
                  <div className="text-sm text-gray-600">Tests Failed</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {results.overall.totalTests}
                  </div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Body Language Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Body Language Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.bodyLanguage.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <div className="font-medium">{test.metric}</div>
                      <div className="text-sm text-gray-600">
                        Actual: {test.actual} | Expected: {test.expected}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(test.status)}>
                    {test.accuracy}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Voice Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Voice Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.voiceAnalysis.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <div className="font-medium">{test.metric}</div>
                      <div className="text-sm text-gray-600">
                        Actual: {test.actual} | Expected: {test.expected}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(test.status)}>
                    {test.accuracy}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test Logs */}
      {testLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {testLogs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alerts */}
      {(bodyLanguageError || facialAnalysisError) && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Errors Detected:</strong>
            {bodyLanguageError && <div>• Body Language: {bodyLanguageError}</div>}
            {facialAnalysisError && <div>• Facial Analysis: {facialAnalysisError}</div>}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}