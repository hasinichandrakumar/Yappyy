import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Users, Hand, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface BodyCue {
  timestamp: string;
  type: 'posture' | 'gesture' | 'eye_contact' | 'movement';
  severity: 'good' | 'warning' | 'improvement';
  message: string;
  suggestion: string;
}

interface BodyCueTimelineProps {
  cues: BodyCue[];
  totalDuration: number;
}

export default function BodyCueTimeline({ cues, totalDuration }: BodyCueTimelineProps) {
  const mockCues: BodyCue[] = [
    {
      timestamp: "0:15",
      type: "posture",
      severity: "warning",
      message: "Slouching detected",
      suggestion: "Stand straight with shoulders back"
    },
    {
      timestamp: "1:23",
      type: "eye_contact",
      severity: "improvement",
      message: "Looking away from camera too much",
      suggestion: "Maintain eye contact with camera for 3-5 seconds at a time"
    },
    {
      timestamp: "1:45",
      type: "movement",
      severity: "warning",
      message: "Excessive swaying detected",
      suggestion: "Ground yourself with stable foot position"
    },
    {
      timestamp: "2:30",
      type: "gesture",
      severity: "good",
      message: "Great open hand gestures",
      suggestion: "Continue using these confident movements"
    },
    {
      timestamp: "3:12",
      type: "posture",
      severity: "improvement",
      message: "Crossed arms - closed body language",
      suggestion: "Keep arms open and relaxed at your sides"
    },
    {
      timestamp: "4:05",
      type: "eye_contact",
      severity: "good",
      message: "Excellent sustained eye contact",
      suggestion: "Perfect engagement with audience"
    }
  ];

  const displayCues = cues.length > 0 ? cues : mockCues;

  const getIcon = (type: string) => {
    switch (type) {
      case 'posture': return Users;
      case 'gesture': return Hand;
      case 'eye_contact': return Eye;
      case 'movement': return Users;
      default: return Info;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'good': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'improvement': return Info;
      default: return Info;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'improvement': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <CardTitle>Body Language Cue Timeline</CardTitle>
        </div>
        <p className="text-sm text-gray-600">
          Timestamped feedback on posture, gestures, and presence throughout your speech
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayCues.map((cue, index) => {
            const Icon = getIcon(cue.type);
            const SeverityIcon = getSeverityIcon(cue.severity);
            
            return (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full border-2 ${getSeverityColor(cue.severity)} flex items-center justify-center`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        {cue.timestamp}
                      </Badge>
                      <Badge 
                        variant={cue.severity === 'good' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          cue.severity === 'good' ? 'bg-green-100 text-green-800' :
                          cue.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <SeverityIcon className="h-3 w-3 mr-1" />
                        {cue.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-1">{cue.message}</h4>
                  <p className="text-sm text-gray-600">{cue.suggestion}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Timeline Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {displayCues.filter(c => c.severity === 'good').length}
              </div>
              <div className="text-sm text-gray-600">Strong Moments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {displayCues.filter(c => c.severity === 'warning').length}
              </div>
              <div className="text-sm text-gray-600">Cautions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {displayCues.filter(c => c.severity === 'improvement').length}
              </div>
              <div className="text-sm text-gray-600">Growth Areas</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}