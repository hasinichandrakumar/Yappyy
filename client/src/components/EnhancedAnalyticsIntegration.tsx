import { useState, useRef, useEffect } from 'react';
import { WebSpeechAnalyzer } from '@/utils/webSpeechAPI';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { WebRTCQualityMonitor } from '@/utils/webrtcQualityMonitor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Activity, Mic, Globe, Wifi, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';

interface AnalyticsData {
  webSpeech: {
    wordsPerMinute: number;
    averageConfidence: number;
    totalPauses: number;
    voiceActivity: number;
    transcript: string;
  } | null;
  performance: {
    score: number;
    memoryUsage: number;
    connectionLatency: number;
    renderingTime: number;
  } | null;
  webrtc: {
    qualityScore: number;
    connectionState: string;
    audioQuality: number;
    videoQuality: number;
  } | null;
}

interface EnhancedAnalyticsProps {
  isRecording: boolean;
  onAnalyticsUpdate: (data: AnalyticsData) => void;
}

export function EnhancedAnalyticsIntegration({ isRecording, onAnalyticsUpdate }: EnhancedAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    webSpeech: null,
    performance: null,
    webrtc: null
  });
  const [webSpeechStatus, setWebSpeechStatus] = useState<'idle' | 'active' | 'error'>('idle');
  const [apiSupport, setApiSupport] = useState({
    webSpeech: false,
    performanceAPI: false,
    webRTC: false
  });

  const webSpeechAnalyzer = useRef<WebSpeechAnalyzer>(new WebSpeechAnalyzer());
  const webrtcMonitor = useRef<WebRTCQualityMonitor>(new WebRTCQualityMonitor());

  useEffect(() => {
    // Check API support on initialization
    setApiSupport({
      webSpeech: webSpeechAnalyzer.current.isSupported(),
      performanceAPI: typeof PerformanceObserver !== 'undefined',
      webRTC: webrtcMonitor.current.isSupported()
    });

    // Start performance monitoring immediately
    if (typeof PerformanceObserver !== 'undefined') {
      performanceMonitor.startMonitoring();
    }

    return () => {
      performanceMonitor.cleanup();
      webrtcMonitor.current.cleanup();
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      startAnalytics();
    } else {
      stopAnalytics();
    }
  }, [isRecording]);

  const startAnalytics = () => {
    console.log('🚀 Starting enhanced analytics integration');

    // Start Web Speech API if supported
    if (apiSupport.webSpeech) {
      const success = webSpeechAnalyzer.current.startAnalysis(
        (result) => {
          console.log('🎤 Web Speech API result:', result);
          // Update analytics with speech data
          setAnalyticsData(prev => ({
            ...prev,
            webSpeech: {
              wordsPerMinute: result.speechRate,
              averageConfidence: result.confidence,
              totalPauses: 0, // Will be updated by metrics
              voiceActivity: result.isStillSpeaking ? 100 : 0,
              transcript: result.transcript
            }
          }));
        },
        (error) => {
          console.error('❌ Web Speech API error:', error);
          setWebSpeechStatus('error');
        }
      );
      
      if (success) {
        setWebSpeechStatus('active');
      } else {
        setWebSpeechStatus('error');
      }
    }

    // Start performance monitoring updates
    const performanceInterval = setInterval(() => {
      if (typeof PerformanceObserver !== 'undefined') {
        const metrics = performanceMonitor.getMetrics();
        const summary = performanceMonitor.getMetricsSummary();
        
        setAnalyticsData(prev => ({
          ...prev,
          performance: {
            score: summary.score,
            memoryUsage: metrics.realTime.memoryUsage / (1024 * 1024), // Convert to MB
            connectionLatency: metrics.realTime.connectionLatency,
            renderingTime: metrics.realTime.renderingTime
          }
        }));
      }
    }, 2000);

    // Store interval for cleanup
    (window as any).analyticsInterval = performanceInterval;
  };

  const stopAnalytics = () => {
    console.log('⏹️ Stopping enhanced analytics integration');

    // Stop Web Speech API
    if (webSpeechStatus === 'active') {
      const speechMetrics = webSpeechAnalyzer.current.stopAnalysis();
      console.log('🎤 Final speech metrics:', speechMetrics);
      
      setAnalyticsData(prev => ({
        ...prev,
        webSpeech: prev.webSpeech ? {
          ...prev.webSpeech,
          wordsPerMinute: speechMetrics.wordsPerMinute,
          averageConfidence: speechMetrics.averageConfidence,
          totalPauses: speechMetrics.totalPauses,
          voiceActivity: speechMetrics.voiceActivity
        } : null
      }));
      
      setWebSpeechStatus('idle');
    }

    // Clear performance monitoring interval
    if ((window as any).analyticsInterval) {
      clearInterval((window as any).analyticsInterval);
      delete (window as any).analyticsInterval;
    }
  };

  // Update parent component with analytics data
  useEffect(() => {
    onAnalyticsUpdate(analyticsData);
  }, [analyticsData, onAnalyticsUpdate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const supportedAPIs = Object.entries(apiSupport).filter(([_, supported]) => supported).length;
  const totalAPIs = Object.keys(apiSupport).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Enhanced Analytics Integration
          <Badge variant={supportedAPIs > 0 ? "default" : "secondary"}>
            {supportedAPIs}/{totalAPIs} APIs Working
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Support Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${apiSupport.webSpeech ? 'bg-green-500' : 'bg-red-500'}`} />
            <Mic className="h-4 w-4" />
            <span className="text-sm">Web Speech API</span>
            {apiSupport.webSpeech && (
              <Badge variant="secondary" className="ml-auto">
                {webSpeechStatus}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${apiSupport.performanceAPI ? 'bg-green-500' : 'bg-red-500'}`} />
            <Activity className="h-4 w-4" />
            <span className="text-sm">Performance API</span>
            {apiSupport.performanceAPI && (
              <Badge variant="secondary" className="ml-auto">
                active
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${apiSupport.webRTC ? 'bg-green-500' : 'bg-red-500'}`} />
            <Wifi className="h-4 w-4" />
            <span className="text-sm">WebRTC Monitor</span>
            {apiSupport.webRTC && (
              <Badge variant="secondary" className="ml-auto">
                ready
              </Badge>
            )}
          </div>
        </div>

        {/* Real-time Analytics Display */}
        {isRecording && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">Real-time Analytics</div>
            
            {analyticsData.webSpeech && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Speech Recognition</span>
                  <span className="text-sm font-mono">
                    {analyticsData.webSpeech.averageConfidence.toFixed(1)}% confidence
                  </span>
                </div>
                <Progress value={analyticsData.webSpeech.averageConfidence * 100} className="h-2" />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>WPM: {analyticsData.webSpeech.wordsPerMinute.toFixed(0)}</span>
                  <span>Voice Activity: {analyticsData.webSpeech.voiceActivity.toFixed(0)}%</span>
                  <span>Pauses: {analyticsData.webSpeech.totalPauses}</span>
                </div>
              </div>
            )}

            {analyticsData.performance && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">System Performance</span>
                  <span className="text-sm font-mono">
                    {analyticsData.performance.score}/100
                  </span>
                </div>
                <Progress value={analyticsData.performance.score} className="h-2" />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Memory: {analyticsData.performance.memoryUsage.toFixed(1)}MB</span>
                  <span>Latency: {analyticsData.performance.connectionLatency.toFixed(0)}ms</span>
                  <span>Render: {analyticsData.performance.renderingTime.toFixed(1)}ms</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Summary */}
        <div className="pt-2 text-xs text-muted-foreground">
          {supportedAPIs === 0 && (
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              No browser APIs available for enhanced analytics
            </div>
          )}
          {supportedAPIs > 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              {supportedAPIs} working API{supportedAPIs > 1 ? 's' : ''} providing authentic data
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}