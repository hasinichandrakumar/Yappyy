import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  AlertTriangle, 
  CheckCircle, 
  Volume2, 
  Zap, 
  TrendingDown, 
  TrendingUp,
  VolumeX,
  Activity,
  Clock,
  X
} from "lucide-react";

interface FeedbackAlert {
  id: string;
  type: "warning" | "success" | "info" | "error";
  category: "speed" | "volume" | "filler" | "tone" | "confidence" | "general";
  icon: React.ReactNode;
  title: string;
  message: string;
  timestamp: Date;
  priority: "high" | "medium" | "low";
  actionable?: string;
}

interface LVIEFeedbackEngineProps {
  isActive: boolean;
  audioLevel: number;
  speechRate: number;
  confidenceScore: number;
  fillerWordCount: number;
  onVoiceFeedbackToggle: (enabled: boolean) => void;
}

export default function LVIEFeedbackEngine({ 
  isActive, 
  audioLevel, 
  speechRate, 
  confidenceScore, 
  fillerWordCount,
  onVoiceFeedbackToggle 
}: LVIEFeedbackEngineProps) {
  const [alerts, setAlerts] = useState<FeedbackAlert[]>([]);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(false);
  const [lastFeedbackTime, setLastFeedbackTime] = useState<Date | null>(null);

  // Simulate real-time analysis and feedback generation
  const analyzeAndGenerateFeedback = useCallback(() => {
    if (!isActive) return;

    const now = new Date();
    const newAlerts: FeedbackAlert[] = [];

    // Speech Rate Analysis
    if (speechRate < 100) {
      newAlerts.push({
        id: `speed-slow-${now.getTime()}`,
        type: "warning",
        category: "speed",
        icon: <TrendingDown className="w-4 h-4" />,
        title: "Speaking too slowly",
        message: `Avg. ${speechRate} WPM - Try increasing your pace`,
        timestamp: now,
        priority: "medium",
        actionable: "Aim for 120-150 WPM for optimal engagement"
      });
    } else if (speechRate > 180) {
      newAlerts.push({
        id: `speed-fast-${now.getTime()}`,
        type: "warning",
        category: "speed",
        icon: <TrendingUp className="w-4 h-4" />,
        title: "Speeding up!",
        message: "Try pacing yourself - your audience needs time to process",
        timestamp: now,
        priority: "high",
        actionable: "Take deliberate pauses between key points"
      });
    }

    // Volume Analysis
    if (audioLevel < 40) {
      newAlerts.push({
        id: `volume-low-${now.getTime()}`,
        type: "warning",
        category: "volume",
        icon: <VolumeX className="w-4 h-4" />,
        title: "Project more",
        message: `Volume dipping under ${audioLevel} dB`,
        timestamp: now,
        priority: "high",
        actionable: "Speak from your diaphragm and project to the back row"
      });
    }

    // Filler Words Analysis
    if (fillerWordCount > 3) {
      newAlerts.push({
        id: `filler-high-${now.getTime()}`,
        type: "error",
        category: "filler",
        icon: <AlertTriangle className="w-4 h-4" />,
        title: "Filler word detected",
        message: `'like' used ${fillerWordCount} times in 1 min`,
        timestamp: now,
        priority: "high",
        actionable: "Replace filler words with purposeful pauses"
      });
    } else if (fillerWordCount === 0) {
      newAlerts.push({
        id: `filler-good-${now.getTime()}`,
        type: "success",
        category: "filler",
        icon: <CheckCircle className="w-4 h-4" />,
        title: "Nice job!",
        message: "No filler words in the last minute!",
        timestamp: now,
        priority: "low"
      });
    }

    // Confidence Analysis
    if (confidenceScore < 60) {
      newAlerts.push({
        id: `confidence-low-${now.getTime()}`,
        type: "info",
        category: "confidence",
        icon: <Activity className="w-4 h-4" />,
        title: "Confidence dropped",
        message: "Detected nervous pauses - you've got this!",
        timestamp: now,
        priority: "medium",
        actionable: "Take a deep breath and remember your expertise"
      });
    }

    // Tone Analysis (simulated)
    if (false) { // Disabled fake random tone analysis
      newAlerts.push({
        id: `tone-flat-${now.getTime()}`,
        type: "info",
        category: "tone",
        icon: <Volume2 className="w-4 h-4" />,
        title: "Flat tone detected",
        message: "Add more emotional variation to engage your audience",
        timestamp: now,
        priority: "medium",
        actionable: "Vary your pitch and emphasize key words"
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep only latest 10 alerts
      
      // Voice feedback
      if (voiceFeedbackEnabled && (!lastFeedbackTime || now.getTime() - lastFeedbackTime.getTime() > 30000)) {
        const highPriorityAlert = newAlerts.find(alert => alert.priority === "high");
        if (highPriorityAlert) {
          // In a real implementation, this would use text-to-speech
          console.log(`Voice feedback: ${highPriorityAlert.actionable || highPriorityAlert.message}`);
          setLastFeedbackTime(now);
        }
      }
    }
  }, [isActive, audioLevel, speechRate, confidenceScore, fillerWordCount, voiceFeedbackEnabled, lastFeedbackTime]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(analyzeAndGenerateFeedback, 5000); // Analyze every 5 seconds
    return () => clearInterval(interval);
  }, [analyzeAndGenerateFeedback, isActive]);

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleVoiceFeedbackToggle = (enabled: boolean) => {
    setVoiceFeedbackEnabled(enabled);
    onVoiceFeedbackToggle(enabled);
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "speed": return "bg-purple-100 text-purple-700";
      case "volume": return "bg-orange-100 text-orange-700";
      case "filler": return "bg-red-100 text-red-700";
      case "tone": return "bg-blue-100 text-blue-700";
      case "confidence": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      {/* L.V.I.E. Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">L.V.I.E.™ System</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                Live Vocal & Interaction Evaluation
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="voice-feedback"
                  checked={voiceFeedbackEnabled}
                  onCheckedChange={handleVoiceFeedbackToggle}
                />
                <Label htmlFor="voice-feedback" className="text-sm">
                  Voice Feedback
                </Label>
              </div>
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Alerts */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <Card key={alert.id} className={`border ${getAlertStyles(alert.type)}`}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {alert.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-semibold">{alert.title}</h4>
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(alert.category)}`}>
                        {alert.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.priority}
                      </Badge>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    {alert.actionable && (
                      <p className="text-xs mt-1 font-medium opacity-80">
                        💡 {alert.actionable}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="w-3 h-3 opacity-60" />
                      <span className="text-xs opacity-60">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlert(alert.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {alerts.length === 0 && isActive && (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">L.V.I.E.™ is listening and analyzing...</p>
              <p className="text-xs text-gray-400 mt-1">
                Real-time feedback will appear here as you speak
              </p>
            </CardContent>
          </Card>
        )}

        {!isActive && (
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <VolumeX className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Start your practice session to activate L.V.I.E.™</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      {isActive && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{speechRate}</div>
                <div className="text-xs text-gray-600">WPM</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{fillerWordCount}</div>
                <div className="text-xs text-gray-600">Fillers/min</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{audioLevel}</div>
                <div className="text-xs text-gray-600">dB Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{confidenceScore}%</div>
                <div className="text-xs text-gray-600">Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}