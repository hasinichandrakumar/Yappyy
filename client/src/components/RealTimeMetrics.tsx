import { useState, useEffect } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gauge, 
  Mic, 
  TrendingUp, 
  Eye, 
  Volume2, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Brain,
  Activity,
  Timer,
  BarChart3
} from "lucide-react";

export default function RealTimeMetrics() {
  const { 
    wpm,
    wordCount,
    fillerWords,
    isListening 
  } = useSpeechRecognition();

  // Simulated metrics for voice clarity and confidence
  const [voiceClarity, setVoiceClarity] = useState(82);
  const [confidenceScore, setConfidenceScore] = useState(75);

  // Live updating metrics with real-time simulation
  const [liveMetrics, setLiveMetrics] = useState({
    eyeContact: 78,
    posture: 85,
    gestureFrequency: 6,
    energyLevel: 72,
    fillerWords: 3,
    pauseQuality: 82,
    volume: 75,
    articulation: 88
  });

  // Update simulated metrics in real-time when listening
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        eyeContact: Math.max(40, Math.min(95, prev.eyeContact + (Math.random() - 0.5) * 3)),
        posture: Math.max(60, Math.min(98, prev.posture + (Math.random() - 0.5) * 2)),
        gestureFrequency: Math.max(2, Math.min(12, prev.gestureFrequency + (Math.random() - 0.5) * 0.5)),
        energyLevel: Math.max(45, Math.min(95, prev.energyLevel + (Math.random() - 0.5) * 4)),
        fillerWords: fillerWords.length,
        pauseQuality: Math.max(50, Math.min(95, prev.pauseQuality + (Math.random() - 0.5) * 2)),
        volume: Math.max(40, Math.min(90, prev.volume + (Math.random() - 0.5) * 3)),
        articulation: Math.max(65, Math.min(98, prev.articulation + (Math.random() - 0.5) * 2))
      }));

      // Update voice clarity and confidence based on speech metrics
      setVoiceClarity(prev => Math.max(60, Math.min(95, prev + (Math.random() - 0.5) * 2)));
      setConfidenceScore(prev => Math.max(50, Math.min(90, prev + (Math.random() - 0.5) * 3)));
    }, 2000);

    return () => clearInterval(interval);
  }, [isListening, fillerWords.length]);

  const getStatusBadge = (value: number, thresholds: { good: number, excellent: number }) => {
    if (value >= thresholds.excellent) return { label: "Excellent", color: "bg-green-100 text-green-800" };
    if (value >= thresholds.good) return { label: "Good", color: "bg-blue-100 text-blue-800" };
    return { label: "Needs Work", color: "bg-yellow-100 text-yellow-800" };
  };

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    icon: Icon, 
    progress, 
    status, 
    tip 
  }: {
    title: string;
    value: number | string;
    unit?: string;
    icon: any;
    progress?: number;
    status?: { label: string; color: string };
    tip?: string;
  }) => (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          </div>
          {status && (
            <Badge className={`text-xs ${status.color}`}>
              {status.label}
            </Badge>
          )}
        </div>
        
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {typeof value === 'number' ? Math.round(value) : value}
          {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
        </div>
        
        {progress !== undefined && (
          <div className="space-y-2">
            <Progress value={Math.round(progress)} className="h-2" />
            <p className="text-xs text-gray-500">{Math.round(progress)}% optimal</p>
          </div>
        )}
        
        {tip && (
          <p className="text-xs text-gray-600 mt-2 italic">{tip}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span>Live Performance Feedback</span>
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            title="Speaking Pace"
            value={wpm}
            unit="WPM"
            icon={Timer}
            progress={Math.min((wpm / 200) * 100, 100)}
            status={getStatusBadge(wpm, { good: 140, excellent: 180 })}
            tip="Ideal range: 140-180 WPM for engagement"
          />
          
          <MetricCard
            title="Voice Clarity"
            value={voiceClarity}
            unit="%"
            icon={Volume2}
            progress={voiceClarity}
            status={getStatusBadge(voiceClarity, { good: 70, excellent: 85 })}
            tip="Clear articulation enhances message delivery"
          />
          
          <MetricCard
            title="Eye Contact"
            value={liveMetrics.eyeContact}
            unit="%"
            icon={Eye}
            progress={liveMetrics.eyeContact}
            status={getStatusBadge(liveMetrics.eyeContact, { good: 60, excellent: 80 })}
            tip="Maintain 60-80% eye contact with audience"
          />
          
          <MetricCard
            title="Confidence"
            value={confidenceScore}
            unit="%"
            icon={Brain}
            progress={confidenceScore}
            status={getStatusBadge(confidenceScore, { good: 70, excellent: 85 })}
            tip="Body language and voice tone indicate confidence"
          />
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            title="Posture"
            value={liveMetrics.posture}
            unit="%"
            icon={Users}
            progress={liveMetrics.posture}
            status={getStatusBadge(liveMetrics.posture, { good: 75, excellent: 90 })}
            tip="Upright posture projects authority"
          />
          
          <MetricCard
            title="Energy Level"
            value={liveMetrics.energyLevel}
            unit="%"
            icon={TrendingUp}
            progress={liveMetrics.energyLevel}
            status={getStatusBadge(liveMetrics.energyLevel, { good: 65, excellent: 80 })}
            tip="Match energy to content and audience"
          />
          
          <MetricCard
            title="Filler Words"
            value={liveMetrics.fillerWords.toFixed(1)}
            unit="/min"
            icon={AlertCircle}
            status={liveMetrics.fillerWords <= 2 ? 
              { label: "Excellent", color: "bg-green-100 text-green-800" } :
              liveMetrics.fillerWords <= 4 ?
              { label: "Good", color: "bg-blue-100 text-blue-800" } :
              { label: "Reduce", color: "bg-yellow-100 text-yellow-800" }
            }
            tip="Keep under 2 per minute for polished delivery"
          />
          
          <MetricCard
            title="Gesture Rate"
            value={liveMetrics.gestureFrequency.toFixed(1)}
            unit="/min"
            icon={BarChart3}
            status={getStatusBadge(liveMetrics.gestureFrequency, { good: 4, excellent: 6 })}
            tip="Natural gestures enhance communication"
          />
        </div>

        {/* Real-time Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Brain className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">AI Coach Insight</h4>
              <p className="text-sm text-blue-800">
                Your eye contact has improved 15% since last session. Try varying your pace slightly more to maintain audience engagement.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}