import { useVoiceAnalysis } from "@/hooks/useVoiceAnalysis";
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
    speakingPace, 
    voiceClarity, 
    confidenceScore 
  } = useVoiceAnalysis();
  
  const { isListening } = useSpeechRecognition();

  // Mock real-time data for demonstration
  const liveMetrics = {
    eyeContact: 78,
    posture: 85,
    gestureFrequency: 6,
    energyLevel: 72,
    fillerWords: 3,
    pauseQuality: 82,
    volume: 75,
    articulation: 88
  };

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
          {value}{unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
        </div>
        
        {progress !== undefined && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500">{progress}% optimal</p>
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
            value={speakingPace}
            unit="WPM"
            icon={Timer}
            progress={Math.min((speakingPace / 160) * 100, 100)}
            status={getStatusBadge(speakingPace, { good: 120, excellent: 140 })}
            tip="Aim for 120-160 WPM for optimal comprehension"
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
            value={liveMetrics.fillerWords}
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
            value={liveMetrics.gestureFrequency}
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
      
      {/* Voice Clarity */}
      <Card className="bg-surface rounded-lg shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Voice Clarity</h3>
            <Mic className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{voiceClarity}%</div>
          <div className={`text-sm mt-1 ${
            voiceClarity >= 80 ? 'text-secondary' : voiceClarity >= 60 ? 'text-accent' : 'text-error'
          }`}>
            {voiceClarity >= 80 ? 'Excellent' : voiceClarity >= 60 ? 'Good' : 'Needs Improvement'}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                voiceClarity >= 80 ? 'bg-secondary' : voiceClarity >= 60 ? 'bg-accent' : 'bg-error'
              }`}
              style={{ width: `${voiceClarity}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Confidence Score */}
      <Card className="bg-surface rounded-lg shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Confidence</h3>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{confidenceScore}%</div>
          <div className={`text-sm mt-1 ${
            confidenceScore >= 80 ? 'text-secondary' : confidenceScore >= 60 ? 'text-accent' : 'text-warning'
          }`}>
            {confidenceScore >= 80 ? 'Strong' : confidenceScore >= 60 ? 'Growing' : 'Room for Growth'}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                confidenceScore >= 80 ? 'bg-secondary' : confidenceScore >= 60 ? 'bg-accent' : 'bg-warning'
              }`}
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
